import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../../Core/Types/httpStatuses.enum";
import {PostInputType} from "../Types/post.types";
import {PostsService} from "../Services/posts.services";

export async function createPostHandler (req: Request<{ blogId?: string }, {}, PostInputType>, res: Response, next: NextFunction ) {
    try {
        const blogId = req.params.blogId ? parseInt(req.params.blogId) : null
        const createdPost = await PostsService.create(req.body, blogId);

        res.status(HttpStatus.Created).send(createdPost)
    } catch (error) {
        next(error);
    }
}