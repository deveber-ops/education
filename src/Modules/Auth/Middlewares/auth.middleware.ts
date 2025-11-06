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

const extractToken = (req: Request) => {
    const auth = req.headers.authorization as string

    let accessToken: string | undefined;
    let basicAuth: boolean = false;

    const [authType, authToken] = auth.split(' ')

    if (authType === 'Bearer') {
        accessToken = authToken
    }
    if (authType === 'Basic') {
        accessToken = authToken
        basicAuth = true
    }

    if (!accessToken && req.cookies?.accessToken) {
        accessToken = req.cookies.accessToken;
    }

    return { accessToken, basicAuth };
};

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { accessToken, basicAuth } = extractToken(req);
    if (!accessToken) return next(new authError('Токен авторизации не передан.', 'token'))

    if (basicAuth) {
        const credentials = Buffer.from(accessToken, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':')

        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            next(new authError('Не авторизован.', 'token'))
        }

        next()
    } else {
        try {
            const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
            (req as any).userId = Number(payload.sub);
            return next();
        } catch (error) {
            return next(new authError('Токен авторизации недействителен.', 'token'))
        }
    }
};