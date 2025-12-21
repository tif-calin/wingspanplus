import type { Json } from './utilityTypes';

/**
 * Returns hash with property values for keys, grouped items as values
 */
export const groupItemsByFunction = <
  NewKey extends string,
  ObjType extends Record<string, unknown>
>(
  items: ObjType[],
  keyGetter: (obj: ObjType, i: number) => NewKey
): Record<NewKey, ObjType[]> =>
  items.reduce((acc, item, i) => {
    const typename = keyGetter(item, i);

    acc[typename] ||= [];
    acc[typename].push(item);

    return acc;
  }, {} as Record<string, ObjType[]>)
;

/**
 * Same as Object.keys() but preserves type information.
 */
export const objectKeys = <T extends Record<string, unknown>>(
  obj: T
): (keyof T)[] => Object.keys(obj) as (keyof T)[];

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
 * Recursively flattens an objects keys.
 *
 * @example
 * flattenObject({ a: { b: 1, c: { d: 2 } } }) // { 'a.b': 1, 'a.c.d': 2 }
 */
export const flattenObject = <T extends Record<string, unknown>>(
  obj: T
) => {
  const flatObj: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(flattenObject(value as Record<string, unknown>)).forEach(([subkey, subvalue]) => {
        flatObj[`${key}.${subkey}`] = subvalue;
      });
    } else {
      flatObj[key] = value;
    }
  });

  return flatObj;
};

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
