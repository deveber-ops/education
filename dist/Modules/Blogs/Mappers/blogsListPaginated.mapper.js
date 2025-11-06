function mapToBlogListPaginatedOutput(blogs, meta) {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    totalCount: Number(meta.totalCount),
    items: blogs.map((blog) => ({
      id: blog.id.toString(),
      createdAt: blog.createdAt,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership
    }))
  };
}
export {
  mapToBlogListPaginatedOutput
};
