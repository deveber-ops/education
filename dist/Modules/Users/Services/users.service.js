import { UsersRepository } from '../Repositories/users.repository.js';
const UsersService = {
  async findMany(queryDto) {
    return await UsersRepository.findMany(queryDto);
  },
  async findOne(id) {
    return await UsersRepository.findOne(id);
  },
  async create(userDto) {
    return await UsersRepository.create(userDto);
  },
  async delete(id) {
    return await UsersRepository.delete(id);
  }
};
export {
  UsersService
};
