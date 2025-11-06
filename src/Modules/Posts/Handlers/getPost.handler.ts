import {Request, Response, NextFunction} from "express";
import {PostsService} from "../Services/posts.services";

export async function getPostHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        const user= await PostsService.findOne(id)
        res.send(user);
    } catch (error: unknown) {
        next(error);
    }
}