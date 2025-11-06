import { CommentsRepository } from '../Repositories/comments.repository.js';
const CommentsService = {
  async findMany(queryDto, postId) {
    return await CommentsRepository.findMany(queryDto, postId);
  },
  async findOne(id) {
    return await CommentsRepository.findOne(id);
  },
  async create(commentData) {
    return await CommentsRepository.create(commentData);
  },
  async update(id, commentData) {
    return await CommentsRepository.update(id, commentData);
  },
  async delete(id, userInfo) {
    return await CommentsRepository.delete(id, userInfo);
  }
};
export {
  CommentsService
};
