import { InfuraProvider, Contract } from "ethers";

import Crawler from "../utils.ts";
import { Config } from "../config.ts";

export default abstract class EVMCrawler {
    public provider: InfuraProvider;
    public contract: Contract;
    public chain: (typeof Config.networks)[number];

    constructor(
        chain: (typeof Config.networks)[number],
        tld: keyof typeof Config.contracts
    ) {
        let contractAddress = Config.contracts[tld];

        this.chain = chain;
        this.provider = new InfuraProvider(chain, Config.keys.infura);
        this.contract = new Contract(
            contractAddress,
            Config.abi[chain],
            this.provider
        );
    }

    listen() {
        this.contract.on(this.eventName, (...args) => {
            console.log(JSON.stringify(args, null, 2));

            // Crawler.addToDatastore({})
        });
    }

    async getLatestBlockTransactions(contractAddress: string) {
        const latestBlock = await this.provider.getBlockNumber();

        const logs = await this.provider.getLogs({
            address: contractAddress,
            fromBlock: latestBlock,
            toBlock: 0,
        });

        return logs.map(log => ({
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            data: log.data,
            topics: log.topics,
        }));
    }

    get eventName() {
        return Config.abi[this.chain][0].name;
    }
}
