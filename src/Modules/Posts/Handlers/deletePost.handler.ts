import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {PostsService} from "../Services/posts.services";

export async function deletePostHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        await PostsService.delete(id)
        res.sendStatus(HttpStatus.NoContent);
    } catch (error: unknown) {
        next(error);
    }
}