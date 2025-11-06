import {Comment, CommentInputType, CommentQueryInput} from "../Types/comment.types";
import {CommentsRepository} from "../Repositories/comments.repository";
import {UserInfoType} from "../../Users/Types/user.types";

export const CommentsService = {
    async findMany(queryDto: CommentQueryInput, postId: number): Promise<{ items: Comment[]; totalCount: number }> {
        return await CommentsRepository.findMany(queryDto, postId);
    },

    async findOne(id: number): Promise<Comment> {
        return await CommentsRepository.findOne(id)
    },

    async create(commentData: CommentInputType): Promise<Comment | null> {
        return await CommentsRepository.create(commentData);
    },

    async update(id: number, commentData: CommentInputType): Promise<void> {
        return await CommentsRepository.update(id, commentData);
    },

    async delete(id: number, userInfo: UserInfoType): Promise<void> {
        return await CommentsRepository.delete(id, userInfo);
    }
}