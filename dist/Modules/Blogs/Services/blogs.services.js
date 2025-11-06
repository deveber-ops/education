import { BlogsRepository } from '../Repositories/blogs.repository.js';
const BlogsService = {
  async findMany(queryDto) {
    return await BlogsRepository.findMany(queryDto);
  },
  async findOne(id) {
    return await BlogsRepository.findOne(id);
  },
  async create(blogDTO) {
    return await BlogsRepository.create(blogDTO);
  },
  async update(blogId, blogDTO) {
    return await BlogsRepository.update(blogId, blogDTO);
  },
  async delete(id) {
    return await BlogsRepository.delete(id);
  }
};
export {
  BlogsService
};
