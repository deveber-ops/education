import {Request, Response, NextFunction} from "express";
import {BlogsService} from "../Services/blogs.services";

export async function getBlogHandler (req: Request, res: Response, next: NextFunction) {
    console.log('GET /api/blog query:', req.query);
    try {
        const id = parseInt(req.params.id, 10)
        const user= await BlogsService.findOne(id)
        res.send(user);
    } catch (error: unknown) {
        next(error);
    }
}