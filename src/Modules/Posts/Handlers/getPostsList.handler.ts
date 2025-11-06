import {Request, Response, NextFunction} from "express";
import {setSortAndPagination} from "../../../Core/Helpers/defaultSortAndPagination.helper";
import {PostsService} from "../Services/posts.services";
import {PostQueryInput} from "../Types/post.types";
import {mapToPostListPaginatedOutput} from "../Mappers/postsListPaginated.mapper";

export async function getPostsListHandler (req: Request<{ blogId?: string }>, res: Response, next: NextFunction) {
    try {
        const blogId = req.params.blogId ? parseInt(req.params.blogId) : null

        const queryInput = setSortAndPagination(req.query)

        const { items, totalCount } = await PostsService.findMany(<PostQueryInput>queryInput, blogId)

        const postsListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: totalCount
        })

        res.send(postsListOutput);
    } catch (error: unknown) {
        next(error);
    }
}