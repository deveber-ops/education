function mapToUsersListPaginatedOutput(users, meta) {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: Number(meta.pageNumber),
    pageSize: Number(meta.pageSize),
    totalCount: Number(meta.totalCount),
    items: users.map((user) => ({
      id: user.id.toString(),
      createdAt: user.createdAt,
      login: user.login,
      email: user.email
    }))
  };
}
export {
  mapToUsersListPaginatedOutput
};
