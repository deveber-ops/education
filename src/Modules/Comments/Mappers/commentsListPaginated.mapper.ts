import {Comment, CommentsListPaginatedOutput} from "../Types/comment.types";

export function mapToCommentListPaginatedOutput(
    comments: Comment[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentsListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: Number(meta.pageNumber),
        pageSize: Number(meta.pageSize),
        totalCount: Number(meta.totalCount),
        items: comments.map((comment) => ({
            id: comment.id,
            createdAt: comment.createdAt,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            }
        })),
    };
}