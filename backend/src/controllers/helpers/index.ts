export function exclude<T extends object, K extends keyof T>(
  items: T[] | T,
  keys: K[]
): Omit<T, K>[] | Omit<T, K> {
  const excludeHelper = (item: any): any => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Array.isArray(item)) {
      return item.map(excludeHelper);
    } else if (item instanceof Date) {
      return item;
    } else if (item !== null && typeof item === 'object') {
      const filteredEntries = Object.entries(item).filter(
        ([key]) => !keys.includes(key as K)
      ).map(([key, value]) => {
        return [key, typeof value === 'object' ? excludeHelper(value) : value];
      });
      return Object.fromEntries(filteredEntries);
    }
    return item;
  };

  return excludeHelper(items);
}
