import {Blog, BlogInputType, BlogQueryInput} from "../Types/blog.types";
import {BlogsRepository} from "../Repositories/blogs.repository";

export const BlogsService = {
    async findMany(queryDto: BlogQueryInput): Promise<{ items: Blog[]; totalCount: number }> {
        return await BlogsRepository.findMany(queryDto);
    },

    async findOne(id: number): Promise<Blog> {
        return await BlogsRepository.findOne(id)
    },

    async create(blogDTO: BlogInputType): Promise<Blog | null> {
        return await BlogsRepository.create(blogDTO);
    },

    async update(blogId: number, blogDTO: BlogInputType): Promise<void> {
        return await BlogsRepository.update(blogId, blogDTO);
    },

    async delete(id: number): Promise<void> {
        return await BlogsRepository.delete(id);
    }
}