import express from "express";
import cookieParser from "cookie-parser";
import { detectClientTypeMiddleware } from '../Core/Middlewares/detectClientType.middleware.js';
import { loadRoutes } from './Router.js';
import { errorsMiddleware } from '../Core/Errors/errors.middleware.js';
import database from '../Database/database.js';
import * as dotenv from "dotenv";
dotenv.config();
const setupApp = async (app) => {
  await database.connect();
  app.use((req, res, next) => {
    if (!req.headers["content-type"]) {
      req.headers["content-type"] = "application/json";
    }
    next();
  });
  const { router } = await loadRoutes();
  app.use(express.json({ limit: "10mb", strict: false }));
  app.use(express.urlencoded({ extended: true, limit: "10mb", type: "*/*" }));
  app.use(cookieParser());
  app.use(detectClientTypeMiddleware);
  app.use(router);
  app.use(errorsMiddleware);
  return app;
};
export {
  setupApp
};
