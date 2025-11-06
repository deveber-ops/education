import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {Users} from "../../../Database/schema";
import {SortDirection} from "../../../Core/Types/sortDirections.type";

export enum UserSortFields {
    CreatedAt = "createdAt",
}

export enum UserSearchFields {
    login = "searchLoginTerm",
    email = "searchEmailTerm",
}

export type User = InferSelectModel<typeof Users>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type UserInputType = InferInsertModel<typeof Users>;
export type UserInfoType = Omit<UserWithoutPassword, 'createdAt'>;

export type UserQueryInput = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: UserSortFields;
    sortDirection?: SortDirection;
    searchEmailTerm?: string;
    searchLoginTerm?: string;
};

export type UsersListPaginatedOutput = {
    page: number;
    pagesCount: number;
    pageSize: number;
    totalCount: number;
    items: UserWithoutPassword[];
};