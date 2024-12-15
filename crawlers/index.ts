// Initialize crawlers
import ETHCrawler from "./networks/eth.ts";

const eth = new ETHCrawler();

export default function Crawl() {
    eth.listen();
}