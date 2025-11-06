import {UserInputType, UserQueryInput, UserWithoutPassword} from "../Types/user.types";
import {UsersRepository} from "../Repositories/users.repository";

export const UsersService = {
    async findMany(queryDto: UserQueryInput): Promise<{ items: UserWithoutPassword[]; totalCount: number }> {
        return await UsersRepository.findMany(queryDto);
    },

    async findOne(id: number): Promise<UserWithoutPassword> {
        return await UsersRepository.findOne(id)
    },

    async create(userDto: UserInputType): Promise<UserWithoutPassword | null> {
        return await UsersRepository.create(userDto);
    },

    async delete(id: number): Promise<void> {
        return await UsersRepository.delete(id);
    }
}