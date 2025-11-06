import {Request, Response, NextFunction} from "express";
import {UsersService} from "../Services/users.service";

export async function getUserHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        const user= await UsersService.findOne(id)
        res.send(user);
    } catch (error: unknown) {
        next(error);
    }
}