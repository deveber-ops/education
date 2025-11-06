import {Post, PostsListPaginatedOutput} from "../Types/post.types";

export function mapToPostListPaginatedOutput(
    posts: Post[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostsListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: Number(meta.pageNumber),
        pageSize: Number(meta.pageSize),
        totalCount: Number(meta.totalCount),
        items: posts.map((post) => ({
            id: toString(post.id),
            createdAt: post.createdAt,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
        })),
    };
}