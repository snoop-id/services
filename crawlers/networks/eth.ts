import EVMCrawler from "./evm.js";

export default class ETHCrawler extends EVMCrawler {
    constructor() {
        super("mainnet", "eth");
    }

    listen() {
        super.listen("NameRegistered");
    }
}