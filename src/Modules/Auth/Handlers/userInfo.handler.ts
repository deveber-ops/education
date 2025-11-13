import { Request, Response, NextFunction } from 'express';
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";

export const userInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(HttpStatus.Ok).json(req.userInfo);
    } catch (error) {
        next(error);
    }
};