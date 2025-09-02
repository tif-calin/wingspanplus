import type { Json } from './utilityTypes';

/**
 * A type-preserving version of Object.entries().
 */
export const objectEntries = <T extends object>(object: T) => Object.entries(object) as [keyof T, T[keyof T]][];

/**
 * A type-preserving version of Object.fromEntries().
 */
export const objectFromEntries = <T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(
  entries: T
) => Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };

/**
 * Filters key/values of an object.
 */
export const filterObject = <T extends Record<string, T[keyof T]>>(
  object: T,
  fn: (
    key: keyof T,
    value: T[keyof T],
    i: number,
    array: [keyof T, T[keyof T]][]
  ) => boolean
): Record<keyof T, T[keyof T]> =>
  Object.fromEntries(
    Object.entries(object).filter(([k, v], i, arr) => fn(k, v, i, arr))
  ) as Record<keyof T, T[keyof T]>
;

const MAX_DEPTH = 999;
/**
 * Deeply merges two objects.
 *
 * @example
 * const obj1 = { a: { b: 1 }, d: 'foo' };
 * const obj2 = { a: { c: 2 }, d: 'bar' };
 *
 * deepMerge(obj1, obj2) // { a: { b: 1, c: 2 }, d: 'bar' }
 */
export const deepMerge = <
  Record1 extends { [key: string]: Json },
  Record2 extends { [key: string]: Json },
>(
  obj1: Record1,
  obj2: Record2,
  recursion = MAX_DEPTH
) => {
  if (recursion < 1) return obj1;

  // TODO: fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj = (Object.keys({ ...obj1, ...obj2 }) as any[]).reduce(
    (acc, key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (val2 === undefined) acc[key] = val1;
      else if (val2 === null) acc[key] = val2;
      else if (Array.isArray(val2)) acc[key] = val2;
      else if (val1 instanceof Object && val2 instanceof Object) {
        if (Object.keys(val2))
          acc[key] = deepMerge(val1 as { [key: string]: Json }, val2, recursion - 1);
      } else acc[key] = val2;

      return acc;
    },
    {} as Json
  );

  return newObj;
};
