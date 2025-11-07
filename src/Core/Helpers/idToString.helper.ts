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