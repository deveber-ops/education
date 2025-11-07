import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {authError} from "../../../Core/Errors/auth.errors";
import * as dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export interface AuthenticatedRequest extends Request {
    userId?: number;
}


export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.accessToken;
        let accessToken: string | undefined;
        let isBasic = false;

        // 1. Проверка типа авторизации
        if (authHeader) {
            const [authType, token] = authHeader.split(' ');

            if (authType === 'Bearer') {
                accessToken = token || cookieToken;
            } else if (authType === 'Basic') {
                accessToken = token;
                isBasic = true;
            } else {
                return next(new authError('Неподдерживаемый тип авторизации.', 'token'));
            }
        } else if (cookieToken) {
            accessToken = cookieToken;
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

            console.log('✅ Basic Auth passed');
            return next();
        }

        // 3. Bearer Auth
        try {
            const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as { sub: string | number };
            (req as any).userId = Number(payload.sub);
            console.log('✅ Bearer Auth passed');
            return next();
        } catch {
            return next(new authError('Токен авторизации недействителен.', 'token'));
        }
    } catch {
        return next(new authError('Ошибка авторизации.', 'token'));
    }
}