import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {HttpStatus} from "../Types/httpStatuses.enum";
import {createErrorMessages, formatErrors} from "./errors.middleware";

export const validationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true });

    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
    }

    next();
};