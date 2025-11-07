import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {authError} from "../../../Core/Errors/auth.errors";
import {UsersService} from "../../Users/Services/users.service";
import {UserInfoType} from "../../Users/Types/user.types";
import {CommentsRepository} from "../Repositories/comments.repository";

export async function createCommentHandler (req: Request<{ postId: string }, {}, {content: string}>, res: Response, next: NextFunction ) {
    try {
        const postId = parseInt(req.params.postId, 10)

        const userId = req.userId;
        if (!userId) return next(new authError('Не авторизован', 'auth'));
        const userInfo:UserInfoType = await UsersService.findOne(userId);

        const commentData = {
            content: req.body.content,
            postId,
            commentatorInfo: {
                userId: userInfo.id,
                userLogin: userInfo.login
            }
        }

        const createdComment = await CommentsRepository.create(commentData);

        res.status(HttpStatus.Created).send(createdComment)
    } catch (error) {
        next(error);
    }
}