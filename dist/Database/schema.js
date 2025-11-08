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
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
  updatedAt: datetime("updatedAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).$onUpdate(() => sql`CURRENT_TIMESTAMP`)
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
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
  updatedAt: datetime("updatedAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`).$onUpdate(() => sql`CURRENT_TIMESTAMP`)
}, (table) => [
  uniqueIndex("module_method_path_unique").on(table.moduleId, table.method, table.path)
]);
const Users = mysqlTable("Users", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
  email: varchar("email", { length: 100 }).unique().notNull(),
  login: varchar("login", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull()
}, (table) => [
  uniqueIndex("user_login_idx").on(table.login),
  uniqueIndex("user_email_idx").on(table.email)
]);
const registrationSessions = mysqlTable("registrationSessions", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  login: varchar("login", { length: 100 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  verificationCode: varchar("verificationCode", { length: 32 }).notNull(),
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
  lastSentAt: datetime("lastSentAt", { fsp: 6 }).notNull(),
  expiresAt: datetime("expiresAt", { fsp: 6 }).notNull(),
  attempts: int("attempts").default(0),
  isVerified: boolean("isVerified").default(false)
});
const userTokens = mysqlTable("User_Tokens", {
  id: int("id").primaryKey().autoincrement(),
  email: int("userId").notNull().references(() => Users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: datetime("expiresAt", { fsp: 6 }).notNull(),
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`)
});
const Blogs = mysqlTable("Blogs", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
  name: varchar("name", { length: 15 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 100 }).notNull(),
  isMembership: boolean("isMembership").default(false)
});
const Posts = mysqlTable("Posts", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
  title: varchar("title", { length: 30 }).notNull(),
  shortDescription: varchar("shortDescription", { length: 100 }).notNull(),
  content: varchar("content", { length: 1e3 }).notNull(),
  blogId: int("userId").notNull().references(() => Blogs.id, { onDelete: "cascade" }),
  blogName: varchar("blogName", { length: 15 }).notNull()
});
const Comments = mysqlTable("Comments", {
  id: int("id").primaryKey().autoincrement(),
  createdAt: datetime("createdAt", { fsp: 6 }).default(sql`CURRENT_TIMESTAMP(6)`),
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
  registrationSessions,
  userTokens
};
