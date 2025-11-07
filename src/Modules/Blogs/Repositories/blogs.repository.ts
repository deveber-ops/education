import {eq, sql} from 'drizzle-orm';
import database from "../../../Database/database";
import {Blogs, Users} from "../../../Database/schema";
import {buildOrderBy, buildPagination, buildWhereConditions} from "../../../Database/utils";
import {Blog, BlogInputType, BlogQueryInput, BlogWithStringId} from "../Types/blog.types";
import {repositoryNotFoundError, repositoryUniqueError} from "../../../Core/Errors/repository.errors";
import {toStringKeys} from "../../../Core/Helpers/idToString.helper";

export const BlogsRepository = {
    async findMany(queryDto: BlogQueryInput): Promise<{ items: Blog[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryDto;

        const db = database.getDB();

        const search = searchNameTerm ?
            [searchNameTerm].filter(Boolean).join(' ') :
            undefined;

        const whereConditions = buildWhereConditions(Users, {
            search,
            searchFields: ['name'],
        });

        const pagination = buildPagination(pageNumber, pageSize);

        const orderBy = buildOrderBy(Blogs, sortBy, sortDirection);

        const items = await db
            .select()
            .from(Blogs)
            .where(whereConditions)
            .orderBy(orderBy)
            .limit(pagination.limit)
            .offset(pagination.offset);

        const totalCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(Blogs)
            .where(whereConditions);

        const totalCount = totalCountResult[0]?.count || 0;

        return { items, totalCount };
    },

    async findOne(id: number): Promise<BlogWithStringId> {
        const db = database.getDB();

        const result = await db
            .select()
            .from(Blogs)
            .where(eq(Blogs.id, id));

        if (result.length === 0) {
            throw new repositoryNotFoundError('Блог не найден.', 'id');
        }

        return toStringKeys(result[0], ['id']) as BlogWithStringId;
    },

    async create(blogData: BlogInputType): Promise<BlogWithStringId> {
        const db = database.getDB()

        try {
            const [createdBlog] = await db
                .insert(Blogs)
                .values(blogData);

            const createdBlogId = createdBlog?.insertId;

            const [blog] = await db
                .select()
                .from(Blogs)
                .where(eq(Blogs.id, createdBlogId))
                .limit(1)

            return toStringKeys(blog, ['id']) as BlogWithStringId;
        } catch (error: any) {
            if (error.cause.code === 'ER_DUP_ENTRY' || error.cause.sqlMessage?.includes('blog_name_idx')) {
                throw new repositoryUniqueError('Блог с таким именем уже существует', 'name');
            }
            throw error;
        }
    },

    async update(id: number, data: BlogInputType): Promise<void> {
        const db = database.getDB();
        const existingBlog = await this.findOne(id);

        if (!existingBlog) throw new repositoryUniqueError('Блог не найден.', 'id');

        try {
            await db
                .update(Blogs)
                .set(data)
                .where(eq(Blogs.id, id));
        } catch (error: any) {
            if (error.cause.code === 'ER_DUP_ENTRY' || error.cause.sqlMessage?.includes('blog_name_idx')) {
                throw new repositoryUniqueError('Блог с таким именем уже существует', 'name');
            }
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        const db = database.getDB();

        const blogResult = await db
            .select()
            .from(Blogs)
            .where(eq(Blogs.id, id));

        if (blogResult.length === 0) {
            throw new repositoryNotFoundError('Блог не найден.', 'id');
        }

        await db
            .delete(Blogs)
            .where(eq(Blogs.id, id));
    }
}