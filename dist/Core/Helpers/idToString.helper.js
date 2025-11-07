function toStringKeys(item, keys) {
  const result = { ...item };
  for (const key of keys) {
    result[key] = String(item[key]);
  }
  return result;
}
function toStringKeysArray(items, keys) {
  return items.map((item) => toStringKeys(item, keys));
}
export {
  toStringKeys,
  toStringKeysArray
};
