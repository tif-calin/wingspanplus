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
