import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { type PathValue } from "react-hook-form";
import { type Simplify } from "type-fest";

import { type AppRouter } from "~/server/api/root";

import { type Path } from "./strings";

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type TrpcInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type TrpcOutputs = inferRouterOutputs<AppRouter>;

type RouterOutputsPath = Path<TrpcOutputs>;

type TrpcResultImpl<TPath extends RouterOutputsPath> = PathValue<
  TrpcOutputs,
  TPath
>;

/**
 * Easier way to get to the result of a trpc query.
 *
 * @example type ClubNews = TrpcResult<"news.getNewsItem">
 */
export type TrpcResult<
  TPath extends RouterOutputsPath,
  TNonNullable = true,
> = Simplify<
  TNonNullable extends true
    ? NonNullable<TrpcResultImpl<TPath>>
    : TrpcResultImpl<TPath>
>;

/**
 * Easier way to get to a single result of a trpc query.
 * This is useful for queries that return an array of results.
 * It will return the union from the array of results.
 *
 * @example type ClubNews = TrpcResultEntry<"news.getNews">
 */
export type TrpcResultEntry<TPath extends RouterOutputsPath> =
  TrpcResult<TPath> extends (infer T)[] ? T : TrpcResult<TPath>;
