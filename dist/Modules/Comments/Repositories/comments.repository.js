import { PostsRepository } from '../../Posts/Repositories/posts.repository.js';
import { repositoryNotFoundError } from '../../../Core/Errors/repository.errors.js';
import database from '../../../Database/database.js';
import { buildOrderBy, buildPagination } from '../../../Database/utils.js';
import { Comments } from '../../../Database/schema.js';
import { eq, sql } from "drizzle-orm";
import { forbiddenError } from '../../../Core/Errors/forbidden.errors.js';
const CommentsRepository = {
  async findMany(queryDto, postId) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection
    } = queryDto;
    const existingPost = await PostsRepository.findOne(postId);
    if (!existingPost) throw new repositoryNotFoundError("\u041F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "postId");
    const db = database.getDB();
    const pagination = buildPagination(pageNumber, pageSize);
    const orderBy = buildOrderBy(Comments, sortBy, sortDirection);
    let itemsQuery = db.select().from(Comments).orderBy(orderBy).limit(pagination.limit).offset(pagination.offset);
    let countQuery = db.select({ count: sql`count(*)` }).from(Comments);
    itemsQuery = itemsQuery.where(eq(Comments.postId, postId));
    countQuery = countQuery.where(eq(Comments.postId, postId));
    const [items, totalCountResult] = await Promise.all([
      itemsQuery,
      countQuery
    ]);
    const totalCount = totalCountResult[0]?.count || 0;
    return { items, totalCount };
  },
  async findOne(id) {
    const db = database.getDB();
    const result = await db.select().from(Comments).where(eq(Comments.id, id));
    if (result.length === 0) {
      throw new repositoryNotFoundError("\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    return result[0];
  },
  async create(commentData) {
    const db = database.getDB();
    const existingPost = await PostsRepository.findOne(commentData.postId);
    if (!existingPost) throw new repositoryNotFoundError("\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u043F\u043E\u0441\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "postId");
    try {
      const [createdComment] = await db.insert(Comments).values(commentData);
      const createdCommentId = createdComment?.insertId;
      const [comment] = await db.select().from(Comments).where(eq(Comments.id, createdCommentId)).limit(1);
      return comment;
    } catch (error) {
      throw error;
    }
  },
  async update(id, commentData) {
    const db = database.getDB();
    const existingComment = await this.findOne(id);
    if (!existingComment)
      throw new repositoryNotFoundError("\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    if (existingComment.commentatorInfo.userId !== commentData.commentatorInfo.userId)
      throw new forbiddenError("\u0412\u044B \u043D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0447\u0443\u0436\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438.", "comment");
    try {
      await db.update(Comments).set(commentData).where(eq(Comments.id, id));
    } catch (error) {
      throw error;
    }
  },
  async delete(id, userInfo) {
    const db = database.getDB();
    const existingComment = await this.findOne(id);
    if (!existingComment)
      throw new repositoryNotFoundError("\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    if (existingComment.commentatorInfo.userId !== userInfo.id)
      throw new forbiddenError("\u0412\u044B \u043D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u0447\u0443\u0436\u0438\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438.", "comment");
    await db.delete(Comments).where(eq(Comments.id, id));
  }
};
export {
  CommentsRepository
};
