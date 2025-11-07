import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {BlogsService} from "../Services/blogs.services";

export async function deleteBlogHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        await BlogsService.delete(id)
        res.sendStatus(HttpStatus.NoContent);
    } catch (error: unknown) {
        next(error);
    }
}