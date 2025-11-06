import {PostsRepository} from "../Repositories/posts.repository";
import {Post, PostInputType, PostQueryInput} from "../Types/post.types";

export const PostsService = {
    async findMany(queryDto: PostQueryInput, blogId?: number | null | undefined): Promise<{ items: Post[]; totalCount: number }> {
        return await PostsRepository.findMany(queryDto, blogId);
    },

    async findOne(id: number): Promise<Post> {
        return await PostsRepository.findOne(id)
    },

    async create(postDTO: PostInputType, blogId?: number | null | undefined): Promise<Post | null> {
        return await PostsRepository.create(postDTO, blogId);
    },

    async update(id: number, postDTO: PostInputType): Promise<void> {
        return await PostsRepository.update(id, postDTO);
    },

    async delete(id: number): Promise<void> {
        return await PostsRepository.delete(id);
    }
}