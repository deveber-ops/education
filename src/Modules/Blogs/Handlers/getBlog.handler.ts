import {Request, Response, NextFunction} from "express";
import {BlogsService} from "../Services/blogs.services";

export async function getBlogHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id, 10)
        const user= await BlogsService.findOne(id)
        res.send(user);
    } catch (error: unknown) {
        next(error);
    }
}