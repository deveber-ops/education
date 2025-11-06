import {Comment, CommentInputType, CommentQueryInput} from "../Types/comment.types";
import {PostsRepository} from "../../Posts/Repositories/posts.repository";
import {repositoryNotFoundError} from "../../../Core/Errors/repository.errors";
import database from "../../../Database/database";
import {buildOrderBy, buildPagination} from "../../../Database/utils";
import {Comments} from "../../../Database/schema";
import {eq, sql} from "drizzle-orm";
import {UserInfoType} from "../../Users/Types/user.types";
import {forbiddenError} from "../../../Core/Errors/forbidden.errors";

export const CommentsRepository = {
    async findMany(
        queryDto: CommentQueryInput,
        postId: number
    ): Promise<{ items: Comment[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const existingPost = await PostsRepository.findOne(postId);
        if (!existingPost) throw new repositoryNotFoundError('Пост не найден.', 'postId')

        const db = database.getDB();

        const pagination = buildPagination(pageNumber, pageSize);
        const orderBy = buildOrderBy(Comments, sortBy, sortDirection);

        // Базовый запрос для items
        let itemsQuery = db
            .select()
            .from(Comments)
            .orderBy(orderBy)
            .limit(pagination.limit)
            .offset(pagination.offset);

        // Базовый запрос для totalCount
        let countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(Comments);

        itemsQuery = itemsQuery.where(eq(Comments.postId, postId));
        countQuery = countQuery.where(eq(Comments.postId, postId));

        const [items, totalCountResult] = await Promise.all([
            itemsQuery,
            countQuery
        ]);

        const totalCount = totalCountResult[0]?.count || 0;

        return { items, totalCount };
    },

    async findOne(id: number): Promise<Comment> {
        const db = database.getDB();

        const result = await db
            .select()
            .from(Comments)
            .where(eq(Comments.id, id));

        if (result.length === 0) {
            throw new repositoryNotFoundError('Комментарий не найден.', 'id');
        }

        return result[0]
    },

    async create(commentData: CommentInputType): Promise<Comment> {
        const db = database.getDB()

        const existingPost = await PostsRepository.findOne(commentData.postId);

        if (!existingPost) throw new repositoryNotFoundError('Указанный пост не найден.', 'postId')

        try {
            const [createdComment] = await db
                .insert(Comments)
                .values(commentData);

            const createdCommentId = createdComment?.insertId;

            const [comment] = await db
                .select()
                .from(Comments)
                .where(eq(Comments.id, createdCommentId))
                .limit(1)

            return comment;
        } catch (error: any) {
            throw error;
        }
    },

    async update(id: number, commentData: CommentInputType): Promise<void> {
        const db = database.getDB();

        const existingComment = await this.findOne(id);

        if (!existingComment)
            throw new repositoryNotFoundError('Комментарий не найден.', 'id')

        if (existingComment.commentatorInfo.userId !== commentData.commentatorInfo.userId)
            throw new forbiddenError('Вы не можете редактировать чужие комментарии.', 'comment')

        try {
            await db
                .update(Comments)
                .set(commentData)
                .where(eq(Comments.id, id));
        } catch (error: any) {
            throw error;
        }
    },

    async delete(id: number, userInfo: UserInfoType): Promise<void> {
        const db = database.getDB();

        const existingComment = await this.findOne(id);

        if (!existingComment)
            throw new repositoryNotFoundError('Комментарий не найден.', 'id')

        if (existingComment.commentatorInfo.userId !== userInfo.id)
            throw new forbiddenError('Вы не можете удалять чужие комментарии.', 'comment')

        await db
            .delete(Comments)
            .where(eq(Comments.id, id));
    }
}