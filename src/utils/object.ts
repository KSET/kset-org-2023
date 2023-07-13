import { get } from "lodash";
import { omit as $omit, pick as $pick } from "rambdax";

import { type RecursiveNonPartial } from "~/types/object";
import { type Path, type PathValue } from "~/types/strings";
import { type MaybeReadonly } from "~/types/util";

type KeyType = string | number | symbol;

export const omit = <
  T extends Record<KeyType, unknown>,
  K extends keyof T & string,
>(
  keys: MaybeReadonly<K[]>,
  obj: T,
): Omit<T, K> => $omit(keys as never, obj);

export const pick = <T extends Record<KeyType, unknown>, K extends keyof T>(
  keys: MaybeReadonly<K[]>,
  obj: T,
) => $pick(keys as never, obj) as unknown as Pick<T, K>;

export const dotGet = <
  Obj,
  T extends Path<RecursiveNonPartial<Obj>> = Path<RecursiveNonPartial<Obj>>,
  Ret extends PathValue<RecursiveNonPartial<Obj>, T> = PathValue<
    RecursiveNonPartial<Obj>,
    T
  >,
>(
  obj: Obj | undefined,
  prop: T,
  fallback?: Ret,
) => {
  if (!obj) {
    return fallback;
  }

  return get(obj, prop) as Ret;
};
