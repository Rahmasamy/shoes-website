import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

let isInitialized = false;
const initPromise = registerRoutes(httpServer, app).then(() => {
  isInitialized = true;
  console.log("Vercel Serverless API initialized successfully.");
}).catch((err) => {
  console.error("Vercel Serverless API initialization failed:", err);
});

export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    await initPromise;
  }
  return app(req, res);
}
