import {NextFunction, Request, Response} from "express";
import {UsersService} from "../Services/users.service";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";

export async function deleteUserHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        await UsersService.delete(id)
        res.sendStatus(HttpStatus.Ok);
    } catch (error: unknown) {
        next(error);
    }
}