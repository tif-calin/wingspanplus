
export type DeepPartial<T> = T extends Record<string, unknown>
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type Primitive = string | number | boolean | null | undefined;
export type Json = Primitive | Json[] | { [key: string]: Json };
