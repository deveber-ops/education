import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {Comments} from "../../../Database/schema";
import {SortDirection} from "../../../Core/Types/sortDirections.type";
import {Blog} from "../../Blogs/Types/blog.types";

export enum CommentSortFields {
    CreatedAt = "createdAt",
}

export type Comment = InferSelectModel<typeof Comments>;
export type CommentWithStringId = Omit<Comment, 'id' | 'postId'> & { id: string };
export type CommentInputType = InferInsertModel<typeof Comments>;

export type CommentQueryInput = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: CommentSortFields;
    sortDirection?: SortDirection;
};

export type CommentsListPaginatedOutput = {
    page: number;
    pagesCount: number;
    pageSize: number;
    totalCount: number;
    items: CommentWithStringId[];
};