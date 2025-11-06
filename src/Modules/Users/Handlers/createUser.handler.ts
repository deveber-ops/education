import {Request, Response, NextFunction} from "express";
import {UsersService} from "../Services/users.service";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {UserInputType} from "../Types/user.types";

export async function createUserHandler (req: Request<{}, {}, UserInputType>, res: Response, next: NextFunction ) {
    try {
        const createdUser = await UsersService.create(req.body);

        res.status(HttpStatus.Created).send(createdUser)
    } catch (error) {
        next(error);
    }
}