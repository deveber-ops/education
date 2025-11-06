import {Request, Response, NextFunction} from "express";
import {CommentsService} from "../Services/comments.service";

export async function getCommentHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        const comment= await CommentsService.findOne(id)
        res.send(comment);
    } catch (error: unknown) {
        next(error);
    }
}