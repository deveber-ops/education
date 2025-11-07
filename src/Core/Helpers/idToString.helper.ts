export function toStringKeys<T extends Record<string, unknown>, K extends keyof T>(
    item: T,
    keys: K[]
): Omit<T, K> & { [P in K]: string } {
    const result: any = { ...item };
    for (const key of keys) {
        result[key] = String(item[key]);
    }
    return result;
}

export function toStringKeysArray<T extends Record<string, unknown>, K extends keyof T>(
    items: T[],
    keys: K[]
): Array<Omit<T, K> & { [P in K]: string }> {
    return items.map(item => toStringKeys(item, keys));
}