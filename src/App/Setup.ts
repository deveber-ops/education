import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import {detectClientTypeMiddleware} from "../Core/Middlewares/detectClientType.middleware";
import {loadRoutes} from "./Router";
import {errorsMiddleware} from "../Core/Errors/errors.middleware";
import database from "../Database/database";
import * as dotenv from 'dotenv';
dotenv.config();

export const setupApp = async (app: Express) => {
    await database.connect();

    const { router } = await loadRoutes();

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (!req.headers['content-type'] &&
            ['POST', 'PUT', 'PATCH'].includes(req.method) &&
            req.body !== undefined) {
            req.headers['content-type'] = 'application/json';
        }
        next();
    });

    app.use(express.json({ limit: '10mb', strict: false }));
    app.use(express.urlencoded({ extended: true, limit: '10mb', type: '*/*' }));
    app.use(cookieParser());
    app.use(detectClientTypeMiddleware);

    app.use(router);

    app.use(errorsMiddleware);

    return app;
};