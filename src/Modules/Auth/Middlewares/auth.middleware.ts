import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {authError} from "../../../Core/Errors/auth.errors";
import * as dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
    userId?: number;
}

const extractToken = (req: Request): { accessToken?: string } => {
    let accessToken: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
    }

    if (!accessToken && req.cookies?.accessToken) {
        accessToken = req.cookies.accessToken;
    }

    return { accessToken };
};

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { accessToken } = extractToken(req);
    if (!accessToken) return next(new authError('Токен авторизации не передан.', 'token'))

    try {
        const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
        (req as any).userId = Number(payload.sub);
        return next();
    } catch (error) {
        return next(new authError('Токен авторизации недействителен.', 'token'))
    }
};