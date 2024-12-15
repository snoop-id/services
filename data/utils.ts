import { tcp } from "@libp2p/tcp";
import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import { FsDatastore } from "datastore-fs";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";

export async function prepareDatastore(path: string) {
    const store = new FsDatastore(`./data/datastores/${path}`);

    const libp2p = await createLibp2p({
        datastore: store,
        addresses: {
            listen: ["/ip4/127.0.0.1/tcp/0"],
        },
        transports: [tcp()],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
    });

    const helia = await createHelia({
        datastore: store,
        libp2p,
    });

    return { helia, store };
}

export async function get(path: string, query: string) {
    const { Key } = await import("interface-datastore");
    const { helia, store } = await prepareDatastore(path);

    try {
        const value = await store.get(new Key(query));
        await helia.stop();
        return value;
    } catch (error) {}

    return null;
}

export async function getAll(path: string) {
    const { helia, store } = await prepareDatastore(path);
    const data = [];

    try {
        for await (const { key, value } of store.query({})) {
            data.push({ key, value });
        }
        await helia.stop();
        return data;
    } catch (error) {
        console.error("Error reading data:", error);
    } finally {
        await helia.stop();
    }

    return [];
}

export async function add(path: string, key: string, value: any) {
    const { Key } = await import("interface-datastore");
    const { helia, store } = await prepareDatastore(path);

    if (typeof value === "string") {
        value = new TextEncoder().encode(value);
    } else if (typeof value === "object") {
        value = new TextEncoder().encode(JSON.stringify(value));
    } else if (typeof value === "number") {
        value = new TextEncoder().encode(value.toString());
    }

    try {
        await store.put(new Key(key), value);
    } catch (error) {
        console.error("Error adding data:", error);
    } finally {
        await helia.stop();
    }
}

export function decode(encodedValue: Uint8Array) {
    const decodedString: any = new TextDecoder().decode(encodedValue);

    try {
        const parsedValue = JSON.parse(decodedString);
        return parsedValue;
    } catch {
        if (!isNaN(decodedString) && decodedString.trim() !== "") {
            return Number(decodedString);
        }
        return decodedString;
    }
}
