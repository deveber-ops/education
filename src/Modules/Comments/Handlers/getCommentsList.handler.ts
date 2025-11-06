import {Request, Response, NextFunction} from "express";
import {setSortAndPagination} from "../../../Core/Helpers/defaultSortAndPagination.helper";
import {CommentsService} from "../Services/comments.service";
import {CommentQueryInput} from "../Types/comment.types";
import {mapToCommentListPaginatedOutput} from "../Mappers/commentsListPaginated.mapper";

export async function getCommentsListHandler (req: Request<{ postId: string }>, res: Response, next: NextFunction) {
    try {
        const postId = parseInt(req.params.postId, 10)

        const queryInput = setSortAndPagination(req.query)

        const { items, totalCount } = await CommentsService.findMany(<CommentQueryInput>queryInput, postId)

        const commentsListOutput = mapToCommentListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: totalCount
        })

        res.send(commentsListOutput);
    } catch (error: unknown) {
        next(error);
    }
}