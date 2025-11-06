import { PostsRepository } from '../Repositories/posts.repository.js';
const PostsService = {
  async findMany(queryDto, blogId) {
    return await PostsRepository.findMany(queryDto, blogId);
  },
  async findOne(id) {
    return await PostsRepository.findOne(id);
  },
  async create(postDTO, blogId) {
    return await PostsRepository.create(postDTO, blogId);
  },
  async update(id, postDTO) {
    return await PostsRepository.update(id, postDTO);
  },
  async delete(id) {
    return await PostsRepository.delete(id);
  }
};
export {
  PostsService
};
