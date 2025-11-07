function toStringKeys(item, keys) {
  const result = { ...item };
  for (const key of keys) {
    result[key] = String(item[key]);
  }
  return result;
}
export {
  toStringKeys
};
