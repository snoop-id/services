import EVMCrawler from "./evm.ts";

export default class ETHCrawler extends EVMCrawler {
    constructor() {
        super("mainnet", "eth");
    }

    listen() {
        super.listen("NameRegistered");
    }
}