import {Request, Response, NextFunction} from "express";
import {BlogInputType} from "../Types/blog.types";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {BlogsService} from "../Services/blogs.services";

export async function createBlogHandler (req: Request<{}, {}, BlogInputType>, res: Response, next: NextFunction ) {
    try {
        const createdBlog = await BlogsService.create(req.body);

        res.status(HttpStatus.Created).send(createdBlog)
    } catch (error) {
        next(error);
    }
}