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

export const buildWhereConditions = (
    table: AnyMySqlTable,
    options: WhereBuilderOptions
): SQL | undefined => {
    const conditions: SQL[] = [];
    const { search, searchFields, filters } = options;

    // Добавляем поисковые условия
    if (search && searchFields && searchFields.length > 0) {
        const searchCondition = buildSearchConditions(table, { search, searchFields });
        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    // Добавляем фильтры
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
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

// Утилита для пагинации
export const buildPagination = (pageNumber: number, pageSize: number) => {
    const skip = (pageNumber - 1) * pageSize;
    return { limit: pageSize, offset: skip };
};

// Утилита для сортировки
export const buildOrderBy = (table: AnyMySqlTable, sortBy: string = 'id', sortDirection: 'asc' | 'desc' = 'asc') => {
    const column = table[sortBy as keyof typeof table] as MySqlColumn | undefined;
    if (!column) {
        throw new Error(`Column ${sortBy} not found in table`);
    }
    return sortDirection === 'desc' ? desc(column) : asc(column);
};