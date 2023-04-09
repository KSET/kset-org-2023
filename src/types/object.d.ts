export type Dict<TVal = unknown, TKey = string> = Record<TKey, TVal>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface RecursiveDict<TVal = unknown, TKey = string> {
  [key: string]: RecursiveDict<TVal, TKey> | undefined;
}
