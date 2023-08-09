/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Simplify } from "@trpc/server";

export type Dict<TVal = unknown, TKey = string> = Record<TKey, TVal>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface RecursiveDict<TVal = unknown, TKey = string> {
  [key: string]: RecursiveDict<TVal, TKey> | undefined;
}

export type NonEmptyArray<T> = [T, ...T[]];

export type MakeNonEmpty<T> = T extends any[] ? NonEmptyArray<T[number]> : T;

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type RecursiveNonPartial<T> = {
  [P in keyof T]-?: RecursiveNonPartial<T[P]>;
};

export type RecursiveMutable<T> = {
  -readonly [P in keyof T]: RecursiveMutable<T[P]>;
};

export type Assign<T, TAssign> = Simplify<TAssign & Omit<T, keyof TAssign>>;
