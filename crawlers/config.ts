import BSC_ABI from "./abi/bsc.ts";
import ETH_ABI from "./abi/eth.ts";
import ARB_ABI from "./abi/arb.ts";

export const Config = {
    networks: ["mainnet", "bsc-mainnet", "arbitrum-mainnet"] as const,
    contracts: {
        eth: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
        bnb: "0xd8c34a379BD95c3EfFF2CA23Dfa27D83962dc44a",
        arb: "0x5d482d501b369f5ba034dec5c5fb7a50d2d6ca20",
    },
    abi: {
        mainnet: ETH_ABI,
        "bsc-mainnet": BSC_ABI,
        "arbitrum-mainnet": ARB_ABI,
    },
    keys: {
        infura: process.env.INFURA_API_KEY,
    },
};
