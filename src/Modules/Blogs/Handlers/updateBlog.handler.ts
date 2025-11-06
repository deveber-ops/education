import { NextFunction, Request, Response } from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {BlogsService} from "../Services/blogs.services";

export async function updateBlogHandler(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        await BlogsService.update(id, req.body);

        res.status(HttpStatus.NoContent).send();
    } catch (error: unknown) {
        next(error);
    }
}