import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { corsOptions } from "./config/cors";
import userRouter from "./routes/users";

config();

export const bootstrapAppDependencies = (app: any) => {
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
  app.use(cookieParser());

  app.use("/users", userRouter);

  app.use(ExpressMongoSanitize());

  // Use CORS middleware with specified options
  app.use(cors(corsOptions));
};