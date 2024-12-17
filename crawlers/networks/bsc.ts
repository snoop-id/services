import EVMCrawler from "./evm.ts";

export default class BNBCrawler extends EVMCrawler {
    constructor() {
        super("bsc-mainnet", "bnb");
    }

    listen() {
        super.listen("TldNameChanged");
    }
}
