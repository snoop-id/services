import jwt from "jsonwebtoken";
import { createWeb3Name } from "@web3-name-sdk/core";

import { internalRequest } from "../utils.ts";

export interface IDomain {
    domain: string;
    address: string;
    network: string;
    creation: Date;
    expiration: Date;
    registration: Date;
    image: string;
    description: string;
}

export default class Crawler {
    static generateToken() {
        // Generate a JWT token
        const token = jwt.sign({ fromServer: true }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        return token;
    }

    static addToDatastore(domainData: IDomain) {
        return new Promise((resolve, reject) => {
            // Send an internal request to the data service
            internalRequest("POST", "/data/domain", Crawler.generateToken(), {
                ...domainData,
            })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.error(error);
                    reject();
                });
        });
    }

    static async nameToCompleteMetadata(name: string) {
        const web3Name = createWeb3Name();

        const metadata = await web3Name.getMetadata({ name });
        const address = await web3Name.getAddress(name);

        return {
            ...metadata,
            address,
        };
    }
}
