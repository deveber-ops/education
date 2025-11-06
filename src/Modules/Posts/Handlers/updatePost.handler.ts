import { NextFunction, Request, Response } from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {PostsService} from "../Services/posts.services";

export async function updatePostHandler(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        await PostsService.update(id, req.body);

        res.status(HttpStatus.NoContent).send();
    } catch (error: unknown) {
        next(error);
    }
}