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
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            return next(new authError("Заголовок Authorization отсутствует.", "header"));
        }

        const headerParts = authHeader.split(" ");
        if (headerParts.length !== 2) {
            return next(new authError("Неверный формат заголовка Authorization.", "header"));
        }

        const [authType, token] = headerParts;

        if (authType.toLowerCase() === "basic") {
            const credentials = Buffer.from(token, "base64").toString("utf-8");
            const [username, password] = credentials.split(":");

            if (!username || !password) {
                return next(new authError("Неверный формат Basic токена.", "token"));
            }

            if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
                return next(new authError("Неверные учетные данные.", "token"));
            }
        } else if (authType.toLowerCase() === "bearer") {
            try {
                const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as { sub?: string | number };
                (req as any).userId = Number(payload.sub);
            } catch {
                return next(new authError("Токен авторизации недействителен или истёк.", "token"));
            }
        } else {
            return next(new authError("Неподдерживаемый тип авторизации.", "header"));
        }

        console.log('Authorized')

        return next();
    } catch {
        return next(new authError("Ошибка авторизации.", "token"));
    }
}