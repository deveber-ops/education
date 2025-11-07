import {Post, PostInputType, PostQueryInput, PostWithStringId} from "../Types/post.types";
import {Posts} from "../../../Database/schema";
import {eq, sql} from "drizzle-orm";
import database from "../../../Database/database";
import {buildOrderBy, buildPagination} from "../../../Database/utils";
import {repositoryNotFoundError, repositoryUniqueError} from "../../../Core/Errors/repository.errors";
import {BlogsRepository} from "../../Blogs/Repositories/blogs.repository";
import {toStringKeys} from "../../../Core/Helpers/idToString.helper";

export const PostsRepository = {
    async findMany(
        queryDto: PostQueryInput,
        blogId?: number | undefined | null
    ): Promise<{ items: Post[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        if (blogId) {
            const existingBlog = await BlogsRepository.findOne(blogId);
            if (!existingBlog) throw new repositoryNotFoundError('Блог не найден.', 'blogId')
        }

        const db = database.getDB();

        const pagination = buildPagination(pageNumber, pageSize);
        const orderBy = buildOrderBy(Posts, sortBy, sortDirection);

        // Базовый запрос для items
        let itemsQuery = db
            .select()
            .from(Posts)
            .orderBy(orderBy)
            .limit(pagination.limit)
            .offset(pagination.offset);

        // Базовый запрос для totalCount
        let countQuery = db
            .select({ count: sql<number>`count(*)` })
            .from(Posts);

        // Добавляем фильтр по blogId если он передан
        if (blogId) {
            itemsQuery = itemsQuery.where(eq(Posts.blogId, blogId));
            countQuery = countQuery.where(eq(Posts.blogId, blogId));
        }

        const [items, totalCountResult] = await Promise.all([
            itemsQuery,
            countQuery
        ]);

        const totalCount = totalCountResult[0]?.count || 0;

        return { items, totalCount };
    },

    async findOne(id: number): Promise<PostWithStringId> {
        const db = database.getDB();

        const result = await db
            .select()
            .from(Posts)
            .where(eq(Posts.id, id));

        if (result.length === 0) {
            throw new repositoryNotFoundError('Пост не найден.', 'id');
        }

        return toStringKeys(result[0], ['id']) as PostWithStringId;
    },

    async create(postData: PostInputType, blogId?: number | null | undefined): Promise<PostWithStringId> {
        const db = database.getDB()

        if (blogId) {
            postData = {
                ...postData,
                blogId,
            };
        }

        const existingBlog = await BlogsRepository.findOne(postData.blogId);

        if (!existingBlog) {
            throw new repositoryNotFoundError('Указанный блог не найден.', 'blogId')
        } else {
            postData = {
                ...postData,
                blogName: existingBlog.name,
            };
        }

        try {
            const [createdPost] = await db
                .insert(Posts)
                .values(postData);

            const createdPostId = createdPost?.insertId;

            const [post] = await db
                .select()
                .from(Posts)
                .where(eq(Posts.id, createdPostId))
                .limit(1)

            return toStringKeys(post, ['id', 'blogId']) as PostWithStringId;
        } catch (error: any) {
            throw error;
        }
    },

    async update(id: number, data: PostInputType): Promise<void> {
        const db = database.getDB();
        const existingPost = await this.findOne(id);
        const existingBlog = await BlogsRepository.findOne(data.blogId);

        if (!existingPost) throw new repositoryUniqueError('Пост не найден.', 'id');
        if (!existingBlog) {
            throw new repositoryNotFoundError('Указанный блог не найден.', 'blogId')
        } else {
            data = {
                ...data,
                blogName: existingBlog.name,
            };
        }

        try {
            await db
                .update(Posts)
                .set(data)
                .where(eq(Posts.id, id));
        } catch (error: any) {
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        const db = database.getDB();

        const postResult = await db
            .select()
            .from(Posts)
            .where(eq(Posts.id, id));

        if (postResult.length === 0) {
            throw new repositoryNotFoundError('Пост не найден.', 'id');
        }

        await db
            .delete(Posts)
            .where(eq(Posts.id, id));
    }
}