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
  const { searchFieldsMapping, filters } = options;
  if (searchFieldsMapping && filters) {
    Object.entries(searchFieldsMapping).forEach(([queryParam, tableColumn]) => {
      const searchValue = filters[queryParam];
      if (searchValue && typeof searchValue === "string") {
        const column = table[tableColumn];
        if (column) {
          conditions.push(like(column, `%${searchValue}%`));
        }
      }
    });
  }
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (searchFieldsMapping && key in searchFieldsMapping) {
        return;
      }
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
  const parsedPageNumber = Math.max(1, parseInt(String(pageNumber)) || 1);
  const parsedPageSize = Math.max(1, Math.min(100, parseInt(String(pageSize)) || 10));
  const skip = (parsedPageNumber - 1) * parsedPageSize;
  return { limit: parsedPageSize, offset: skip };
};
const buildOrderBy = (table, sortBy = "id", sortDirection = "asc") => {
  const column = table[sortBy];
  if (!column) {
    throw new Error(`Column ${sortBy} not found in table`);
  }
  return sortDirection === "desc" ? desc(column) : asc(column);
};
function createSearchMapping(searchFields) {
  return Object.entries(searchFields).reduce((acc, [tableColumn, queryParam]) => {
    acc[queryParam] = tableColumn;
    return acc;
  }, {});
}
export {
  buildOrderBy,
  buildPagination,
  buildSearchConditions,
  buildWhereConditions,
  createSearchMapping
};
