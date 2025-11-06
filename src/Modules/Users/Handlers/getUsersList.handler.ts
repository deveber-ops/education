import {Request, Response, NextFunction} from "express";
import {UserQueryInput} from "../Types/user.types";
import {setSortAndPagination} from "../../../Core/Helpers/defaultSortAndPagination.helper";
import {UsersService} from "../Services/users.service";
import {mapToUsersListPaginatedOutput} from "../Mappers/usersListPaginated.mapper";

export async function getUsersListHandler (req: Request, res: Response, next: NextFunction) {
    try {

        const queryInput = setSortAndPagination(req.query)

        const { items, totalCount } = await UsersService.findMany(<UserQueryInput>queryInput)

        const usersListOutput = mapToUsersListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: totalCount
        })

        res.send(usersListOutput);
    } catch (error: unknown) {
        next(error);
    }
}