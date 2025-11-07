import {
  mysqlTable,
  int,
  varchar,
  datetime,
  boolean,
  uniqueIndex,
  json
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
const modules = mysqlTable("Modules", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  path: varchar("path", { length: 100 }).notNull(),
  system: boolean("system").default(false),
  active: boolean("active").default(true),
  menu: boolean("menu").default(false),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt").default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});
const moduleActions = mysqlTable("moduleActions", {
  id: int("id").primaryKey().autoincrement(),
  moduleId: int("moduleId").references(() => modules.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  path: varchar("path", { length: 200 }).notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  method: varchar("method", { length: 10 }).default("GET"),
  authorization: boolean("authorization").default(false),
  active: boolean("active").default(true),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt").default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`)
}, (table) => [
  uniqueIndex("module_method_path_unique").on(table.moduleId, table.method, table.path)
]);
const Users = mysqlTable("Users", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  email: varchar("email", { length: 100 }).unique().notNull(),
  login: varchar("login", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull()
}, (table) => [
  uniqueIndex("user_login_idx").on(table.login),
  uniqueIndex("user_email_idx").on(table.email)
]);
const userTokens = mysqlTable("User_Tokens", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => Users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: datetime("expiresAt").notNull(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`)
});
const Blogs = mysqlTable("Blogs", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  name: varchar("name", { length: 15 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 100 }).notNull(),
  isMembership: boolean("isMembership").default(false)
});
const Posts = mysqlTable("Posts", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  title: varchar("title", { length: 30 }).notNull(),
  shortDescription: varchar("shortDescription", { length: 100 }).notNull(),
  content: varchar("content", { length: 1e3 }).notNull(),
  blogId: int("userId").notNull().references(() => Blogs.id, { onDelete: "cascade" }),
  blogName: varchar("blogName", { length: 15 }).notNull()
});
const Comments = mysqlTable("Comments", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt").default(sql`CURRENT_TIMESTAMP`),
  postId: int("postId").references(() => Posts.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 300 }).notNull(),
  commentatorInfo: json("commentatorInfo").$type().notNull()
});
export {
  Blogs,
  Comments,
  Posts,
  Users,
  moduleActions,
  modules,
  userTokens
};
