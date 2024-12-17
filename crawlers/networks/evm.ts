import { WebSocketProvider, Contract } from "ethers";

import Crawler from "../utils.ts";
import { Config } from "../config.ts";

export default abstract class EVMCrawler {
    public provider: WebSocketProvider;
    public contract: Contract;
    public chain: (typeof Config.networks)[number];

    constructor(
        chain: (typeof Config.networks)[number],
        tld: keyof typeof Config.contracts
    ) {
        let contractAddress = Config.contracts[tld];
        let base = `wss://${chain}.infura.io/ws/v3/${Config.keys.infura}`;

        this.chain = chain;
        this.provider = new WebSocketProvider(base);
        this.contract = new Contract(
            contractAddress,
            Config.abi[chain],
            this.provider
        );

        this.provider.websocket.onopen = () => {
            console.log(`Listening to ${chain}`);
        };
    }

    listen(eventName: string) {
        this.contract.on(eventName, (...args) => {
            console.log("xd");
            console.log(JSON.stringify(args, null, 2));
            // Crawler.addToDatastore({})
        });
    }
}
