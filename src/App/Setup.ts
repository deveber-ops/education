import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import {detectClientTypeMiddleware} from "../Core/Middlewares/detectClientType.middleware";
import {loadRoutes} from "./Router";
import {errorsMiddleware} from "../Core/Errors/errors.middleware";
import database from "../Database/database";
import * as dotenv from 'dotenv';
import {Blogs, Comments, Posts, Users} from "../Database/schema";
import {HttpStatus} from "../Core/Types/httpStatuses.enum";
dotenv.config();

export const setupApp = async (app: Express) => {
    await database.connect();

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());
    app.use(detectClientTypeMiddleware);

    const { router } = await loadRoutes();
    app.use(router);

    app.use(errorsMiddleware);

    return app;
};