/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Simplify } from "type-fest";

export type Maybe<T> = Simplify<T | null | undefined>;

export type MaybeReadonly<T> = T | Readonly<T>;
