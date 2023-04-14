import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "~/server/api/root";
import { createServerTRPCContext } from "~/server/api/trpc";

export const createApi = async (
  ...args: Parameters<typeof createServerTRPCContext>
) => {
  const ctx = await createServerTRPCContext(...args);

  return createServerSideHelpers({
    ctx,
    router: appRouter,
    transformer: SuperJSON,
  });
};
