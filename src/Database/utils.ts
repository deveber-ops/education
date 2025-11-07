import {SQL, and, like, or, eq, desc, asc} from "drizzle-orm";
import { AnyMySqlTable, MySqlColumn } from "drizzle-orm/mysql-core";

export interface SearchOptions {
    search?: string;
    searchFields: string[];
}

export interface WhereBuilderOptions {
    search?: string;
    searchFields?: string[];
    filters?: Record<string, any>;
}

export const buildSearchConditions = (
    table: AnyMySqlTable,
    options: SearchOptions
): SQL | undefined => {
    const { search, searchFields } = options;

    if (!search || !searchFields || searchFields.length === 0) {
        return undefined;
    }

    const conditions = searchFields
        .map(field => {
            const column = table[field as keyof typeof table] as MySqlColumn | undefined;
            return column ? like(column, `%${search}%`) : undefined;
        })
        .filter((condition): condition is SQL => condition !== undefined);

    return conditions.length > 0 ? or(...conditions) : undefined;
};

export interface WhereBuilderOptions {
    searchFieldsMapping?: Record<string, string>;
    filters?: Record<string, any>;
}

export const buildWhereConditions = (
    table: AnyMySqlTable,
    options: WhereBuilderOptions
): SQL | undefined => {
    const conditions: SQL[] = [];
    const { searchFieldsMapping, filters } = options;

    if (searchFieldsMapping) {
        const searchConditions: SQL[] = [];

        Object.entries(searchFieldsMapping).forEach(([queryParam, tableColumn]) => {
            const searchValue = filters?.[queryParam];

            if (searchValue && typeof searchValue === 'string') {
                const column = table[tableColumn as keyof typeof table] as MySqlColumn | undefined;
                if (column) {
                    searchConditions.push(like(column, `%${searchValue}%`));
                }
            }
        });

        if (searchConditions.length > 0) {
            conditions.push(<SQL<unknown>>or(...searchConditions));
        }
    }

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (searchFieldsMapping && key in searchFieldsMapping) {
                return;
            }

            if (value !== undefined && value !== null) {
                const column = table[key as keyof typeof table] as MySqlColumn | undefined;
                if (column) {
                    conditions.push(eq(column, value));
                }
            }
        });
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
};

export const buildPagination = (pageNumber: any = 1, pageSize: any = 10) => {
    const parsedPageNumber = Math.max(1, parseInt(String(pageNumber)) || 1);
    const parsedPageSize = Math.max(1, Math.min(100, parseInt(String(pageSize)) || 10));

    const skip = (parsedPageNumber - 1) * parsedPageSize;
    return { limit: parsedPageSize, offset: skip };
};

// Утилита для сортировки
export const buildOrderBy = (table: AnyMySqlTable, sortBy: string = 'id', sortDirection: 'asc' | 'desc' = 'asc') => {
    const column = table[sortBy as keyof typeof table] as MySqlColumn | undefined;
    if (!column) {
        throw new Error(`Column ${sortBy} not found in table`);
    }
    return sortDirection === 'desc' ? desc(column) : asc(column);
};

export function createSearchMapping<T extends Record<string, string>>(searchFields: T): Record<string, string> {
    return Object.entries(searchFields).reduce((acc, [tableColumn, queryParam]) => {
        acc[queryParam] = tableColumn;
        return acc;
    }, {} as Record<string, string>);
}