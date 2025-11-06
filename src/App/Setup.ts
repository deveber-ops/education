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

    app.use('/api/testing/all-data', async (req: Request, res: Response, next: NextFunction) => {
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