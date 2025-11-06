import express from "express";
import cookieParser from "cookie-parser";
import { detectClientTypeMiddleware } from '../Core/Middlewares/detectClientType.middleware.js';
import { loadRoutes } from './Router.js';
import { errorsMiddleware } from '../Core/Errors/errors.middleware.js';
import database from '../Database/database.js';
import * as dotenv from "dotenv";
import { Blogs, Comments, Posts, Users } from '../Database/schema.js';
import { HttpStatus } from '../Core/Types/httpStatuses.enum.js';
dotenv.config();
const setupApp = async (app) => {
  await database.connect();
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());
  app.use(detectClientTypeMiddleware);
  const { router } = await loadRoutes();
  app.use(router);
  app.delete("/api/testing/all-data", async (req, res, next) => {
    const db = database.getDB();
    try {
      await db.delete(Comments).execute();
      await db.delete(Posts).execute();
      await db.delete(Users).execute();
      await db.delete(Blogs).execute();
      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      next(error);
    }
  });
  app.use(errorsMiddleware);
  return app;
};
export {
  setupApp
};
