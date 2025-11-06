import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {CommentsService} from "../Services/comments.service";
import {authError} from "../../../Core/Errors/auth.errors";
import {UserInfoType} from "../../Users/Types/user.types";
import {UsersService} from "../../Users/Services/users.service";

export async function deleteCommentHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)

        const userId = req.userId;
        if (!userId) return new authError('Не авторизован', 'auth')
        const userInfo:UserInfoType = await UsersService.findOne(userId);

        await CommentsService.delete(id, userInfo)
        res.sendStatus(HttpStatus.Ok);
    } catch (error: unknown) {
        next(error);
    }
}