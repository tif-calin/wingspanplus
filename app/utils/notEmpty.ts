/**
 * @example
* ```ts
* const example = [{ foo: 'bar' }, null, undefined, { foo: 'qux' }].filter(notEmpty);
* #      ^? Array<{ foo: string }>
* ```
*/
export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => value !== null && value !== undefined;
