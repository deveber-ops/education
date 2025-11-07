import {SQL, and, like, or, eq, sql} from "drizzle-orm";
import { AnyMySqlTable, MySqlColumn } from "drizzle-orm/mysql-core";

export interface SearchOptions {
    search?: string;
    searchFields: string[];
}

export interface WhereBuilderOptions {
    search?: string;
    searchFields?: string[];
    filters?: Record<string, any>;
    searchFieldsMapping?: Record<string, string>;
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
    const { searchFieldsMapping, filters, search, searchFields } = options;

    // Обработка общего поиска (search)
    if (search && searchFields && searchFields.length > 0) {
        const searchConditions = buildSearchConditions(table, { search, searchFields });
        if (searchConditions) {
            conditions.push(searchConditions);
        }
    }

    // Обработка поиска по отдельным полям через searchFieldsMapping
    if (searchFieldsMapping && filters) {
        const searchConditions: SQL[] = [];

        Object.entries(searchFieldsMapping).forEach(([queryParam, tableColumn]) => {
            const searchValue = filters[queryParam];

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

    // Обычные фильтры (не search)
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            // Пропускаем поля, которые уже обработаны в searchFieldsMapping
            if (searchFieldsMapping && key in searchFieldsMapping) {
                return;
            }

            // Пропускаем специальные поля для пагинации и сортировки
            if (['page', 'pageSize', 'sortBy', 'sortDirection'].includes(key)) {
                return;
            }

            if (value !== undefined && value !== null && value !== '') {
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
export const buildOrderBy = (
    table: AnyMySqlTable,
    sortBy: string,
    sortDirection: 'asc' | 'desc' = 'asc'
) => {
    const column = table[sortBy as keyof typeof table] as MySqlColumn | undefined;

    if (!column) {
        throw new Error(`Column "${sortBy}" not found in table`);
    }

    const isStringColumn = ['MySqlVarChar', 'MySqlText', 'MySqlChar'].includes(column.columnType);

    if (isStringColumn) {
        // Используем LOWER для гарантированной нерегистрозависимой сортировки
        return sortDirection === 'desc'
            ? sql`LOWER(${column}) DESC`
            : sql`LOWER(${column}) ASC`;
    }

    return sortDirection === 'desc' ? sql`${column} DESC` : sql`${column} ASC`;
};

export function createSearchMapping<T extends Record<string, string>>(searchFields: T): Record<string, string> {
    return Object.entries(searchFields).reduce((acc, [tableColumn, queryParam]) => {
        acc[queryParam] = tableColumn;
        return acc;
    }, {} as Record<string, string>);
}