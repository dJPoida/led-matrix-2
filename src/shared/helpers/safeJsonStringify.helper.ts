/**
 * Same as JSON.stringify but protects against recursive references
 */
export const safeJsonStringify = (obj: Record<string, unknown>): string => {
  const cache: Array<unknown> = [];
  const str: string = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    },
    2
  );
  return str;
};
