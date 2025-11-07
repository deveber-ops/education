import {Request, Response, NextFunction} from "express";
import {setSortAndPagination} from "../../../Core/Helpers/defaultSortAndPagination.helper";
import {BlogQueryInput} from "../Types/blog.types";
import {mapToBlogListPaginatedOutput} from "../Mappers/blogsListPaginated.mapper";
import {BlogsService} from "../Services/blogs.services";

export async function getBlogsListHandler (req: Request, res: Response, next: NextFunction) {
    try {
        const queryInput = setSortAndPagination(req.query)

        const { items, totalCount } = await BlogsService.findMany(<BlogQueryInput>queryInput)

        const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: totalCount,
        })

        res.send(blogsListOutput);
    } catch (error: unknown) {
        next(error);
    }
}