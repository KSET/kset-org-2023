import { appRouter } from "~/server/api/root";
import { createServerTRPCContext } from "~/server/api/trpc";

export const createApi = async (
  ...args: Parameters<typeof createServerTRPCContext>
) => appRouter.createCaller(await createServerTRPCContext(...args));
