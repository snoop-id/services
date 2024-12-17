// Initialize crawlers
import ETHCrawler from "./networks/eth.ts";
import BNBCrawler from "./networks/bsc.ts";

const eth = new ETHCrawler();
const bnb = new BNBCrawler();

export default function Crawl() {
    eth.listen();
    bnb.listen();
}