// Initialize crawlers
import ETHCrawler from "./networks/eth.js";
import BNBCrawler from "./networks/bsc.js";

const eth = new ETHCrawler();
const bnb = new BNBCrawler();

export default function Crawl() {
    eth.listen();
    bnb.listen();
}