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

    app.use((req: Request, _res: Response, next: NextFunction) => {
        if (!req.headers.host || req.headers.host === '') {
            req.headers.host = 'edu.deveber.site';
        }

        // Также устанавливаем другие необходимые заголовки
        if (!req.headers['x-forwarded-host']) {
            req.headers['x-forwarded-host'] = req.headers.host;
        }

        next();
    });

    const { router } = await loadRoutes();

    app.use(express.json({ limit: '10mb', strict: true }));
    app.use(express.urlencoded({ extended: true, limit: '10mb', type: '*/*' }));
    app.use(cookieParser());
    app.use(detectClientTypeMiddleware);

    app.use(router);

    app.use(errorsMiddleware);

    return app;
};