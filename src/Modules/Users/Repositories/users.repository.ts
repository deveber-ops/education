import bcrypt from 'bcrypt';
import {eq, or, sql} from 'drizzle-orm';
import {User, UserInputType, UserQueryInput, UserWithoutPassword} from "../Types/user.types";
import database from "../../../Database/database";
import {buildOrderBy, buildPagination, buildWhereConditions} from "../../../Database/utils";
import {Users} from "../../../Database/schema";
import {repositoryNotFoundError, repositoryUniqueError} from "../../../Core/Errors/repository.errors";

export const UsersRepository = {
    async findMany(queryDto: UserQueryInput): Promise<{ items: UserWithoutPassword[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchEmailTerm,
            searchLoginTerm,
        } = queryDto;

        const db = database.getDB();

        // Создаем search строку из терминов поиска
        const search = searchEmailTerm || searchLoginTerm ?
            [searchEmailTerm, searchLoginTerm].filter(Boolean).join(' ') :
            undefined;

        // Построение условий WHERE
        const whereConditions = buildWhereConditions(Users, {
            search,
            searchFields: ['email', 'login'],
        });

        // Построение пагинации
        const pagination = buildPagination(pageNumber, pageSize);

        // Построение порядка сортировки
        const orderBy = buildOrderBy(Users, sortBy, sortDirection);

        // Получение пользователей
        const items = await db
            .select()
            .from(Users)
            .where(whereConditions)
            .orderBy(orderBy)
            .limit(pagination.limit)
            .offset(pagination.offset);

        // Получение общего количества
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(Users)
            .where(whereConditions);

        const totalCount = totalCountResult[0]?.count || 0;

        return { items, totalCount };
    },

    async findOne(id: number): Promise<UserWithoutPassword> {
        const db = database.getDB();

        const result = await db
            .select()
            .from(Users)
            .where(eq(Users.id, id));

        if (result.length === 0) {
            throw new repositoryNotFoundError('Пользователь не найден.', 'id');
        }

        const {password: _, ...rest} = result[0];

        return rest;
    },

    async create(userData: UserInputType): Promise<UserWithoutPassword> {
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
            return userWithoutPassword;
        } catch (error: any) {
            if (error.message?.includes('user_login_idx')) {
                throw new repositoryUniqueError('Пользователь с таким логином уже существует', 'login');
            } else if (error.message?.includes('user_email_idx')) {
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