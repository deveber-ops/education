function mapToPostListPaginatedOutput(posts, meta) {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    totalCount: Number(meta.totalCount),
    items: posts.map((post) => ({
      id: post.id.toString(),
      createdAt: post.createdAt,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName
    }))
  };
}
export {
  mapToPostListPaginatedOutput
};
