import {Request, Response, NextFunction} from "express";
import {repositoryNotFoundError, repositoryUniqueError} from "./repository.errors";
import {HttpStatus} from "../Types/httpStatuses.enum";
import {FieldValidationError, ValidationError} from "express-validator";
import {authError} from "./auth.errors";
import {errorDto, errorType} from "../Types/error.types";
import {forbiddenError} from "./forbidden.errors";
import {verificationError} from "./verification.errors";

export const formatErrors = (error: ValidationError): errorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        message: expressError.msg,
        field: expressError.path,
    };
};

export const createErrorMessages = (
    errors: errorType[],
): errorDto => {
    return { errorsMessages: errors };
};

export const errorsMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof authError) {
        return res.status(HttpStatus.Unauthorized).json(
            createErrorMessages([{ message: err.message, field: err.field }])
        );
    }

    if (err instanceof repositoryUniqueError) {
        return res.status(HttpStatus.Conflict).json(
            createErrorMessages([{ message: err.message, field: err.field }])
        );
    }

    if (err instanceof repositoryNotFoundError) {
        return res.status(HttpStatus.NotFound).json(
            createErrorMessages([{ message: err.message, field: err.field }])
        );
    }

    if (err instanceof forbiddenError) {
        return res.status(HttpStatus.Forbidden).json(
            createErrorMessages([{ message: err.message, field: err.field }])
        );
    }

    if (err instanceof verificationError) {
        return res.status(HttpStatus.BadRequest).json(
            createErrorMessages([{ message: err.message, field: err.field }])
        );
    }

    if (
        err instanceof Error &&
        (
            err.message.includes("connect") ||
            err.message.includes("ECONNREFUSED") ||
            err.message.includes("access denied") ||
            err.message.includes("getaddrinfo ENOTFOUND")
        )
    ) {
        return res.status(HttpStatus.InternalServerError).json(
            createErrorMessages([
                {
                    message: "Ошибка подключения к базе данных, обратитесь к администратору.",
                    field: "database",
                },
            ])
        );
    }

    if (err instanceof Error && 'field' in err) {
        return res.status(HttpStatus.BadRequest).json(
            createErrorMessages([{ message: err.message, field: (err as any).field }])
        );
    }

    return res.status(HttpStatus.InternalServerError).json(
        createErrorMessages([{ message: 'Внутренняя ошибка сервера', error: `${err}`, field: 'server' }])
    );
};