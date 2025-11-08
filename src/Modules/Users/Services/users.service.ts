import {User, UserInputType, UserQueryInput, UserWithoutPassword, UserWithStringId} from "../Types/user.types";
import {UsersRepository} from "../Repositories/users.repository";

export const UsersService = {
    async findMany(queryDto: UserQueryInput): Promise<{ items: UserWithoutPassword[]; totalCount: number }> {
        return await UsersRepository.findMany(queryDto);
    },

    async findOne(id: number): Promise<UserWithStringId> {
        return await UsersRepository.findOne(id)
    },

    async findUser(loginOrEmail: string): Promise<User | null> {
        return await UsersRepository.findUser(loginOrEmail);
    },

    async create(userDto: UserInputType, passwordHashed?: boolean): Promise<UserWithStringId | null> {
        return await UsersRepository.create(userDto, passwordHashed);
    },

    async delete(id: number): Promise<void> {
        return await UsersRepository.delete(id);
    },
}