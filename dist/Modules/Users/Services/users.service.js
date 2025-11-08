import { UsersRepository } from '../Repositories/users.repository.js';
const UsersService = {
  async findMany(queryDto) {
    return await UsersRepository.findMany(queryDto);
  },
  async findOne(id) {
    return await UsersRepository.findOne(id);
  },
  async findUser(loginOrEmail) {
    return await UsersRepository.findUser(loginOrEmail);
  },
  async create(userDto, passwordHashed) {
    return await UsersRepository.create(userDto, passwordHashed);
  },
  async delete(id) {
    return await UsersRepository.delete(id);
  }
};
export {
  UsersService
};
