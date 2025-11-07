import {
    mysqlTable,
    int,
    varchar,
    datetime,
    boolean,
    uniqueIndex, json,
} from 'drizzle-orm/mysql-core';
import {sql} from "drizzle-orm";

export const modules = mysqlTable('Modules', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 100 }).unique().notNull(),
    label: varchar('label', { length: 200 }).notNull(),
    path: varchar('path', { length: 100 }).notNull(),
    system: boolean('system').default(false),
    active: boolean('active').default(true),
    menu: boolean('menu').default(false),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
    updatedAt: datetime('updatedAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const moduleActions = mysqlTable('moduleActions', {
    id: int('id').primaryKey().autoincrement(),
    moduleId: int('moduleId').references(() => modules.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    path: varchar('path', { length: 200 }).notNull(),
    label: varchar('label', { length: 200 }).notNull(),
    method: varchar('method', { length: 10 }).default('GET'),
    authorization: boolean('authorization').default(false),
    active: boolean('active').default(true),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
    updatedAt: datetime('updatedAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).$onUpdate(() => sql`CURRENT_TIMESTAMP`)
}, (table) => [
    uniqueIndex('module_method_path_unique').on(table.moduleId, table.method, table.path)
]);

// Users
export const Users = mysqlTable('Users', {
    id: int('id').primaryKey().autoincrement(),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
    email: varchar('email', { length: 100 }).unique().notNull(),
    login: varchar('login', { length: 100 }).unique().notNull(),
    password: varchar('password', { length: 100 }).notNull(),
}, (table) => [
    uniqueIndex('user_login_idx').on(table.login),
    uniqueIndex('user_email_idx').on(table.email)
]);

// User Tokens
export const userTokens = mysqlTable('User_Tokens', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('userId').notNull().references(() => Users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    expiresAt: datetime('expiresAt', { fsp: 6 }).notNull(),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
})

export const Blogs = mysqlTable('Blogs', {
    id: int('id').primaryKey().autoincrement(),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
    name: varchar('name', { length: 15 }).notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    websiteUrl: varchar('websiteUrl', { length: 100 }).notNull(),
    isMembership: boolean('isMembership').default(false),
})/*, (table) => [
    uniqueIndex('blog_name_idx').on(table.name)
]);*/

export const Posts = mysqlTable('Posts', {
    id: int('id').primaryKey().autoincrement(),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
    title: varchar('title', { length: 30 }).notNull(),
    shortDescription: varchar('shortDescription', { length: 100 }).notNull(),
    content: varchar('content', { length: 1000 }).notNull(),
    blogId: int('userId').notNull().references(() => Blogs.id, { onDelete: 'cascade' }),
    blogName: varchar('blogName', { length: 15 }).notNull(),
})

export const Comments = mysqlTable('Comments', {
    id: int('id').primaryKey().autoincrement(),
    createdAt: datetime('createdAt', { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
    postId: int('postId').references(() => Posts.id, { onDelete: 'cascade' }),
    content: varchar('content', { length: 300 }).notNull(),
    commentatorInfo: json('commentatorInfo').$type<{ userId: number; userLogin: string }>().notNull(),
})
