function mapToCommentListPaginatedOutput(comments, meta) {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    totalCount: Number(meta.totalCount),
    items: comments.map((comment) => ({
      id: comment.id.toString(),
      createdAt: comment.createdAt,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId.toString(),
        userLogin: comment.commentatorInfo.userLogin
      }
    }))
  };
}
export {
  mapToCommentListPaginatedOutput
};
