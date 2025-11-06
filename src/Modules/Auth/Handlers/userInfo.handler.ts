import { Request, Response, NextFunction } from 'express';
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {UsersService} from "../../Users/Services/users.service";
import {authError} from "../../../Core/Errors/auth.errors";

export const userInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) return new authError('Не авторизован', 'auth')

        const {createdAt: _, id, ...userInfo} = await UsersService.findOne(userId);

        return res.status(HttpStatus.Ok).json({
            userId: id,
            ...userInfo
        });
    } catch (error) {
        next(error);
    }
};