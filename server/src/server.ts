// api/index.ts
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { logger } from "../src/config/logger";
import { bootstrapAppDependencies } from "../src/app";
import { CONNECT_TO_DATABASE } from "../src/config/connection";

const app: Express = express();

// Global variable to track if DB is connected
let isDbConnected: boolean = false;
let appInitialized: Express | null = null;

// Initialize application
async function initializeApp(): Promise<Express> {
  try {
    if (!isDbConnected) {
      const DB = await CONNECT_TO_DATABASE();
      app.locals.db = DB;
      isDbConnected = true;
      logger.info('Production database connected successfully');
    }
    
    bootstrapAppDependencies(app);
    appInitialized = app;
    return app;
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    throw error;
  }
}

// Initialize app on cold start
const appPromise: Promise<Express> = initializeApp();

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    const expressApp = await appPromise;
    return expressApp(req, res);
  } catch (error) {
    logger.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}