import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {Users} from "../../../Database/schema";
import {SortDirection} from "../../../Core/Types/sortDirections.type";
import {BlogSortFields} from "../../Blogs/Types/blog.types";

export enum UserSortFields {
    CreatedAt = "createdAt",
}

export enum UserSearchFields {
    login = "searchLoginTerm",
    email = "searchEmailTerm",
}

export type User = InferSelectModel<typeof Users>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type UserWithStringId = Omit<UserWithoutPassword, 'id'> & { id: string };
export type UserInputType = InferInsertModel<typeof Users>;
export type UserInfoType = Omit<User, 'id' | 'createdAt' | 'password'> & { id: string };

export type UserQueryInput = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: BlogSortFields;
    sortDirection?: SortDirection;
} & {
    [K in keyof typeof UserSearchFields as typeof UserSearchFields[K]]?: string;
};

export type UsersListPaginatedOutput = {
    page: number;
    pagesCount: number;
    pageSize: number;
    totalCount: number;
    items: UserWithStringId[];
};