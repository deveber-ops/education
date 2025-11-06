import {HttpStatus} from "../Types/httpStatuses.enum";
import {createErrorMessages} from "../Errors/errors.middleware";
import {Request, Response, NextFunction} from "express";

export const bodyValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
        return res.status(HttpStatus.BadRequest).json(
            createErrorMessages([{
                message: 'Request body is missing or invalid JSON',
                field: 'body'
            }])
        );
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(HttpStatus.BadRequest).json(
            createErrorMessages([{
                message: 'Request body cannot be empty',
                field: 'body'
            }])
        );
    }

    next();
};