import { NextFunction, Request, Response } from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {authError} from "../../../Core/Errors/auth.errors";
import {UserInfoType} from "../../Users/Types/user.types";
import {UsersService} from "../../Users/Services/users.service";
import {CommentsService} from "../Services/comments.service";

export async function updateCommentHandler(req: Request<{ id: string }, {}, {content: string}>, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);

        const userId = req.userId;
        if (!userId) return new authError('Не авторизован', 'auth')
        const userInfo:UserInfoType = await UsersService.findOne(userId);

        const commentData = {
            content: req.body.content,
            commentatorInfo: {
                userId: userInfo.id,
                userLogin: userInfo.login
            }
        }

        await CommentsService.update(id, commentData);

        res.status(HttpStatus.NoContent).send();
    } catch (error: unknown) {
        next(error);
    }
}