import { eq, sql } from "drizzle-orm";
import database from '../../../Database/database.js';
import { Blogs } from '../../../Database/schema.js';
import { buildOrderBy, buildPagination, buildWhereConditions, createSearchMapping } from '../../../Database/utils.js';
import { BlogSearchFields } from '../Types/blog.types.js';
import { repositoryNotFoundError, repositoryUniqueError } from '../../../Core/Errors/repository.errors.js';
import { toStringKeys } from '../../../Core/Helpers/idToString.helper.js';
const BlogsRepository = {
  async findMany(queryDto) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      ...searchFilters
    } = queryDto;
    const db = database.getDB();
    const pagination = buildPagination(pageNumber, pageSize);
    const orderBy = buildOrderBy(Blogs, sortBy ?? "createdAt", sortDirection);
    const searchFieldsMapping = createSearchMapping(BlogSearchFields);
    const whereConditions = buildWhereConditions(Blogs, {
      searchFieldsMapping,
      filters: searchFilters
    });
    let query = db.select().from(Blogs);
    if (whereConditions) {
      query = query.where(whereConditions);
    }
    const items = await query.orderBy(...orderBy).limit(pagination.limit).offset(pagination.offset);
    let countQuery = db.select({ count: sql`count(*)` }).from(Blogs);
    if (whereConditions) {
      countQuery = countQuery.where(whereConditions);
    }
    const totalCountResult = await countQuery;
    const totalCount = totalCountResult[0]?.count || 0;
    return { items, totalCount };
  },
  async findOne(id) {
    const db = database.getDB();
    const result = await db.select().from(Blogs).where(eq(Blogs.id, id));
    if (result.length === 0) {
      throw new repositoryNotFoundError("\u0411\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    return toStringKeys(result[0], ["id"]);
  },
  async create(blogData) {
    const db = database.getDB();
    try {
      const [createdBlog] = await db.insert(Blogs).values(blogData);
      const createdBlogId = createdBlog?.insertId;
      const [blog] = await db.select().from(Blogs).where(eq(Blogs.id, createdBlogId)).limit(1);
      return toStringKeys(blog, ["id"]);
    } catch (error) {
      if (error.cause.code === "ER_DUP_ENTRY" || error.cause.sqlMessage?.includes("blog_name_idx")) {
        throw new repositoryUniqueError("\u0411\u043B\u043E\u0433 \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442", "name");
      }
      throw error;
    }
  },
  async update(id, data) {
    const db = database.getDB();
    const existingBlog = await this.findOne(id);
    if (!existingBlog) throw new repositoryUniqueError("\u0411\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    try {
      await db.update(Blogs).set(data).where(eq(Blogs.id, id));
    } catch (error) {
      if (error.cause.code === "ER_DUP_ENTRY" || error.cause.sqlMessage?.includes("blog_name_idx")) {
        throw new repositoryUniqueError("\u0411\u043B\u043E\u0433 \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442", "name");
      }
      throw error;
    }
  },
  async delete(id) {
    const db = database.getDB();
    const blogResult = await db.select().from(Blogs).where(eq(Blogs.id, id));
    if (blogResult.length === 0) {
      throw new repositoryNotFoundError("\u0411\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    await db.delete(Blogs).where(eq(Blogs.id, id));
  }
};
export {
  BlogsRepository
};
