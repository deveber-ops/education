import bcrypt from "bcrypt";
import { eq, or, sql } from "drizzle-orm";
import {
  UserSearchFields
} from '../Types/user.types.js';
import database from '../../../Database/database.js';
import { buildOrderBy, buildPagination, buildWhereConditions, createSearchMapping } from '../../../Database/utils.js';
import { Users } from '../../../Database/schema.js';
import { repositoryNotFoundError, repositoryUniqueError } from '../../../Core/Errors/repository.errors.js';
import { toStringKeys } from '../../../Core/Helpers/idToString.helper.js';
const UsersRepository = {
  async findMany(queryDto) {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      ...searchFilters
    } = queryDto;
    console.log(sortDirection);
    const searchFieldsMapping = createSearchMapping(UserSearchFields);
    const db = database.getDB();
    const pagination = buildPagination(pageNumber, pageSize);
    const orderBy = buildOrderBy(Users, sortBy ?? "createdAt", sortDirection);
    const whereConditions = buildWhereConditions(Users, {
      searchFieldsMapping,
      filters: searchFilters
    });
    let query = db.select().from(Users);
    if (whereConditions) {
      query = query.where(whereConditions);
    }
    const items = await query.orderBy(...orderBy).limit(pagination.limit).offset(pagination.offset);
    let countQuery = db.select({ count: sql`count(*)` }).from(Users);
    if (whereConditions) {
      countQuery = countQuery.where(whereConditions);
    }
    const totalCountResult = await countQuery;
    const totalCount = totalCountResult[0]?.count || 0;
    return { items, totalCount };
  },
  async findOne(id) {
    const db = database.getDB();
    const result = await db.select().from(Users).where(eq(Users.id, id));
    if (result.length === 0) {
      throw new repositoryNotFoundError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    const { password: _, ...rest } = result[0];
    return toStringKeys(rest, ["id"]);
  },
  async create(userData) {
    const db = database.getDB();
    const { login, email, password } = userData;
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await db.insert(Users).values({
        login,
        email,
        password: passwordHash
      });
      const [user] = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
      const { password: _, ...userWithoutPassword } = user;
      return toStringKeys(userWithoutPassword, ["id"]);
    } catch (error) {
      if (error.cause.sqlMessage?.includes("user_login_idx")) {
        throw new repositoryUniqueError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C \u043B\u043E\u0433\u0438\u043D\u043E\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442", "login");
      } else if (error.cause.sqlMessage?.includes("user_email_idx")) {
        throw new repositoryUniqueError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442", "email");
      }
      throw error;
    }
  },
  async delete(id) {
    const db = database.getDB();
    const userResult = await db.select().from(Users).where(eq(Users.id, id));
    if (userResult.length === 0) {
      throw new repositoryNotFoundError("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.", "id");
    }
    await db.delete(Users).where(eq(Users.id, id));
  },
  async findUser(loginOrEmail) {
    const result = await database.getDB().select().from(Users).where(or(
      eq(Users.login, loginOrEmail),
      eq(Users.email, loginOrEmail)
    )).limit(1);
    return result[0];
  }
};
export {
  UsersRepository
};
