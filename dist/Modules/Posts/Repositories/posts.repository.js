import { Posts } from '../../../Database/schema.js';
import { eq, sql } from "drizzle-orm";
import database from '../../../Database/database.js';
import { buildOrderBy, buildPagination } from '../../../Database/utils.js';
import { repositoryNotFoundError, repositoryUniqueError } from '../../../Core/Errors/repository.errors.js';
import { BlogsRepository } from '../../Blogs/Repositories/blogs.repository.js';
import { toStringKeys } from '../../../Core/Helpers/idToString.helper.js';
const PostsRepository = {
  async findMany(queryDto, blogId) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    } = queryDto;
    if (blogId) {
      const existingBlog = await BlogsRepository.findOne(blogId);
      if (!existingBlog) throw new repositoryNotFoundError("\u0411\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "blogId");
    }
    const db = database.getDB();
    const pagination = buildPagination(pageNumber, pageSize);
    const orderBy = buildOrderBy(Posts, sortBy ?? "createdAt", sortDirection);
    let itemsQuery = db.select().from(Posts).orderBy(orderBy).limit(pagination.limit).offset(pagination.offset);
    let countQuery = db.select({ count: sql`count(*)` }).from(Posts);
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
  async findOne(id) {
    const db = database.getDB();
    const result = await db.select().from(Posts).where(eq(Posts.id, id));
    if (result.length === 0) {
      throw new repositoryNotFoundError("\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    return toStringKeys(result[0], ["id", "blogId"]);
  },
  async create(postData, blogId) {
    const db = database.getDB();
    if (blogId) {
      postData = {
        ...postData,
        blogId
      };
    }
    const existingBlog = await BlogsRepository.findOne(postData.blogId);
    if (!existingBlog) {
      throw new repositoryNotFoundError("\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u0431\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "blogId");
    } else {
      postData = {
        ...postData,
        blogName: existingBlog.name
      };
    }
    try {
      const [createdPost] = await db.insert(Posts).values(postData);
      const createdPostId = createdPost?.insertId;
      const [post] = await db.select().from(Posts).where(eq(Posts.id, createdPostId)).limit(1);
      return toStringKeys(post, ["id", "blogId"]);
    } catch (error) {
      throw error;
    }
  },
  async update(id, data) {
    const db = database.getDB();
    const existingPost = await this.findOne(id);
    const existingBlog = await BlogsRepository.findOne(data.blogId);
    if (!existingPost) throw new repositoryUniqueError("\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    if (!existingBlog) {
      throw new repositoryNotFoundError("\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u0431\u043B\u043E\u0433 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "blogId");
    } else {
      data = {
        ...data,
        blogName: existingBlog.name
      };
    }
    try {
      await db.update(Posts).set(data).where(eq(Posts.id, id));
    } catch (error) {
      throw error;
    }
  },
  async delete(id) {
    const db = database.getDB();
    const postResult = await db.select().from(Posts).where(eq(Posts.id, id));
    if (postResult.length === 0) {
      throw new repositoryNotFoundError("\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    await db.delete(Posts).where(eq(Posts.id, id));
  }
};
export {
  PostsRepository
};
