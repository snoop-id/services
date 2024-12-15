import { z } from "zod";
import cors from "cors";
import { Router } from "express";
import { createWeb3Name } from "@web3-name-sdk/core";

import { add, decode, get, getAll } from "./utils.ts";
import { Authenticate } from "../middlewares.ts";
import { verifyMessage } from "ethers";
import Crawler, { IDomain } from "../crawlers/utils.ts";

const router = Router();

const whitelist = [
    `http://localhost:${process.env.PORT!}`,
    process.env.APP_URL!,
];

router.use(cors({ origin: whitelist }));

/**
 * @route GET /data/domains
 * @description Read domain datas
 * @access Public
 * @returns {{ status: boolean, data?: any }} Status of the operation
 */
router.get("/domains", async (req, res) => {
    const encryptedData = await getAll("domains");
    const data = [];

    for (const { key, value } of encryptedData) {
        const decodedValue = decode(value);
        if (typeof decodedValue === "object") data.push(decodedValue);
    }

    res.send({ status: true, data });
});

/**
 * @route POST /data/domain
 * @description Add a domain data to datastore
 * @access Private
 * @returns {{ status: boolean }} Status of the operation
 */
router.post("/domain", Authenticate, async (req, res) => {
    const { domain } = req.body;
    if (!domain) {
        res.status(400).send({ status: false, error: "Domain is required" });
        return;
    }

    const schema = z.object({
        domain: z.string(),
        network: z.string(),
        status: z.string(),
        expiration: z.date(),
    });

    const parsed = schema.safeParse(domain);
    if (!parsed.success) {
        res.status(400).send({ status: false, error: parsed.error.message });
        return;
    }

    try {
        await add("domains", req.body.domain, req.body);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            error: "Error adding domain data",
        });
        return;
    }

    res.send({ status: true });
});

/**
 * @route GET /data/resolve
 * @description Get redirection link of domain if exists
 * @access Public
 * @returns {{ status: boolean, redirect_url?: any }} Status of the operation
 */
router.get("/resolve", async (req, res) => {
    const { domain } = req.query;

    try {
        const domainStore = await get("domains", domain as string);

        if (!domainStore) {
            res.status(404).send({
                status: false,
                error: "Domain not found",
            });
            return;
        }

        var domainData = decode(domainStore);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            error: "Error reading domain data",
        });
        return;
    }

    res.send({ status: true, redirect_url: domainData?.redirect_url ?? null });
});

/**
 * @route POST /data/resolve
 * @description Add a redirection to domain
 * @access Public
 * @returns {{ status: boolean }} Status of the operation
 */
router.post("/resolve", async (req, res) => {
    const { signature, address, redirect, chain } = req.body;

    if (!signature || !address || !redirect) {
        res.status(400).send({ status: false, error: "Invalid request" });
        return;
    }

    const web3Name = createWeb3Name();

    // Get user domain
    const name = await web3Name.getDomainName({
        address,
        queryChainIdList: [chain],
    });

    if (!name) {
        res.status(404).send({
            status: false,
            error: "Your wallet doesn't have any space.id domains on this network.",
        });
        return;
    }

    // Check if domain is in store
    const encodedDomainData = await get("domains", name);
    let domainStore: IDomain | null = encodedDomainData
        ? decode(encodedDomainData)
        : null;

    // New domain store object
    if (!domainStore) {
        const completeMetadata = await Crawler.nameToCompleteMetadata(name);

        domainStore = {
            domain: name,
            address,
            network: chain,
            image: completeMetadata.image,
            description: completeMetadata.description,
            creation: new Date(completeMetadata.attributes[0].value * 1000),
            expiration: new Date(completeMetadata.attributes[2].value * 1000),
            registration: new Date(completeMetadata.attributes[1].value * 1000),
        };
    }

    const message = `Redirecting ${name} to ${redirect}`;

    // Validate signature
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        res.status(400).send({ status: false, error: "Invalid signature" });
        return;
    }

    // Check if redirection URL is valid
    try {
        var isValid = Boolean(new URL(redirect));
        if (!isValid) {
            res.status(400).send({ status: false, error: "Invalid URL" });
            return;
        }
    } catch (e) {
        res.status(400).send({ status: false, error: "Invalid URL" });
        return;
    }

    // Update domain store
    await add("domains", name, {
        ...domainStore,
        redirect_url: redirect,
    });

    res.send({ status: true });
});

export default router;
