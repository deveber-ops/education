import bcrypt from 'bcrypt';
import {eq, or, sql} from 'drizzle-orm';
import {
    User,
    UserInputType,
    UserQueryInput,
    UserSearchFields,
    UserWithoutPassword,
    UserWithStringId
} from "../Types/user.types";
import database from "../../../Database/database";
import {buildOrderBy, buildPagination, buildWhereConditions, createSearchMapping} from "../../../Database/utils";
import {Users} from "../../../Database/schema";
import {repositoryNotFoundError, repositoryUniqueError} from "../../../Core/Errors/repository.errors";
import {toStringKeys} from "../../../Core/Helpers/idToString.helper";

export const UsersRepository = {
    async findMany(queryDto: UserQueryInput): Promise<{ items: UserWithoutPassword[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            ...searchFilters
        } = queryDto;

        const searchFieldsMapping = createSearchMapping(UserSearchFields);

        const db = database.getDB();

        const pagination = buildPagination(pageNumber, pageSize);
        const orderBy = buildOrderBy(Users, sortBy ?? 'createdAt', sortDirection);

        const whereConditions = buildWhereConditions(Users, {
            searchFieldsMapping,
            filters: searchFilters,
        });

        console.log(whereConditions)

        let query = db.select().from(Users);

        if (whereConditions) {
            query = query.where(whereConditions);
        }

        const items = await query
            .orderBy(orderBy)
            .limit(pagination.limit)
            .offset(pagination.offset);

        let countQuery = db.select({ count: sql<number>`count(*)` }).from(Users);

        if (whereConditions) {
            countQuery = countQuery.where(whereConditions);
        }

        const totalCountResult = await countQuery;
        const totalCount = totalCountResult[0]?.count || 0;

        return { items, totalCount };
    },

    async findOne(id: number): Promise<UserWithStringId> {
        const db = database.getDB();

        const result = await db
            .select()
            .from(Users)
            .where(eq(Users.id, id));

        if (result.length === 0) {
            throw new repositoryNotFoundError('Пользователь не найден.', 'id');
        }

        const {password: _, ...rest} = result[0];

        return toStringKeys(rest, ['id']) as UserWithStringId;
    },

    async create(userData: UserInputType): Promise<UserWithStringId> {
        const db = database.getDB();
        const {login, email, password} = userData;

        try {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await db
                .insert(Users)
                .values({
                    login,
                    email,
                    password: passwordHash,
                });

            const [user] = await db
                .select()
                .from(Users)
                .where(eq(Users.email, email))
                .limit(1)

            const { password: _, ...userWithoutPassword } = user;

            return toStringKeys(userWithoutPassword, ['id']) as UserWithStringId;
        } catch (error: any) {
            if (error.cause.sqlMessage?.includes('user_login_idx')) {
                throw new repositoryUniqueError('Пользователь с таким логином уже существует', 'login');
            } else if (error.cause.sqlMessage?.includes('user_email_idx')) {
                throw new repositoryUniqueError('Пользователь с таким email уже существует', 'email');
            }

            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        const db = database.getDB();

        const userResult = await db
            .select()
            .from(Users)
            .where(eq(Users.id, id));

        if (userResult.length === 0) {
            throw new repositoryNotFoundError('Пользователь не найден.', 'id');
        }

        await db
            .delete(Users)
            .where(eq(Users.id, id));
    },

    async findUser(loginOrEmail: string): Promise<User | null> {
        const result = await database.getDB()
            .select()
            .from(Users)
            .where(or(
                eq(Users.login, loginOrEmail),
                eq(Users.email, loginOrEmail)
            ))
            .limit(1);

        return result[0];
    },
}