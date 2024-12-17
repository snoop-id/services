import EVMCrawler from "./evm.js";

export default class BNBCrawler extends EVMCrawler {
    constructor() {
        super("bsc-mainnet", "bnb");
    }

    listen() {
        super.listen("TldNameChanged");
    }
}
