// api/index.ts
import express, { Express, Request, Response } from "express";
import { logger } from "../src/config/logger";
import { bootstrapAppDependencies } from "../src/app";
import { CONNECT_TO_DATABASE } from "../src/config/connection";

const app: Express = express();

// Initialize application
async function initializeApp(): Promise<Express> {
  try {
    const DB = await CONNECT_TO_DATABASE();
    logger.info('DATABASE CONNECTION STATUS:', DB);
    app.locals.db = DB;
    logger.info('Production database connected successfully');

    await bootstrapAppDependencies(app);
    return app;
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    const expressApp = await initializeApp();
    return expressApp(req, res);
  } catch (error) {
    logger.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}