import { and, like, or, eq, desc, asc } from "drizzle-orm";
const buildSearchConditions = (table, options) => {
  const { search, searchFields } = options;
  if (!search || !searchFields || searchFields.length === 0) {
    return void 0;
  }
  const conditions = searchFields.map((field) => {
    const column = table[field];
    return column ? like(column, `%${search}%`) : void 0;
  }).filter((condition) => condition !== void 0);
  return conditions.length > 0 ? or(...conditions) : void 0;
};
const buildWhereConditions = (table, options) => {
  const conditions = [];
  const { search, searchFields, filters } = options;
  if (search && searchFields && searchFields.length > 0) {
    const searchCondition = buildSearchConditions(table, { search, searchFields });
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        const column = table[key];
        if (column) {
          conditions.push(eq(column, value));
        }
      }
    });
  }
  return conditions.length > 0 ? and(...conditions) : void 0;
};
const buildPagination = (pageNumber = 1, pageSize = 10) => {
  const skip = (pageNumber - 1) * pageSize;
  return { limit: pageSize, offset: skip };
};
const buildOrderBy = (table, sortBy = "id", sortDirection = "asc") => {
  const column = table[sortBy];
  if (!column) {
    throw new Error(`Column ${sortBy} not found in table`);
  }
  return sortDirection === "desc" ? desc(column) : asc(column);
};
export {
  buildOrderBy,
  buildPagination,
  buildSearchConditions,
  buildWhereConditions
};
