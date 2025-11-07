import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {authError} from "../../../Core/Errors/auth.errors";
import * as dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.accessToken;
        let accessToken: string | undefined;
        let isBasic = false;

        // 1. Проверка типа авторизации
        if (authHeader) {
            const parts = authHeader.split(' ');
            if (parts.length !== 2) {
                return next(new authError('Неверный формат авторизации.', 'header'));
            }

            const [authType, token] = parts;

            if (authType === 'Bearer') {
                accessToken = token || cookieToken;
            } else if (authType === 'Basic') {
                accessToken = token;
                isBasic = true;
            } else {
                return next(new authError('Неподдерживаемый тип авторизации.', 'header'));
            }
        }

        if (!accessToken) {
            return next(new authError('Токен авторизации не передан.', 'token'));
        }

        // 2. Basic Auth
        if (isBasic) {
            const credentials = Buffer.from(accessToken, 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');

            if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
                return next(new authError('Неверные учетные данные.', 'token'));
            }
            return next();
        }

        // 3. Bearer Auth
        try {
            const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as { sub: string | number };
            (req as any).userId = Number(payload.sub);
            return next();
        } catch {
            return next(new authError('Токен авторизации недействителен.', 'token'));
        }
    } catch {
        return next(new authError('Ошибка авторизации.', 'token'));
    }
}