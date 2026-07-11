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

// Middleware to ensure routes are registered before handling any request
app.use(async (req, res, next) => {
  if (!isInitialized) {
    await initPromise;
  }
  next();
});

export default app;
