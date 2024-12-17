import "dotenv/config.js";

import { createServer } from "http";
import cookieParser from "cookie-parser";
import express, { type Application } from "express";

import Crawl from "./crawlers/index.ts";
import DataRouter from "./data/index.ts";

const app: Application = express();
const server = createServer(app);

app.use(express.json());
app.use(cookieParser());

/* Services */
// Endpoints
app.use("/data", DataRouter);

// Start the server
server.listen(process.env.PORT, () =>
    console.log(`snoop.id Serives are running on port ${process.env.PORT}`)
);

// Crawlers
Crawl();