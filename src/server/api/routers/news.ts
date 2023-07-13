import { htmlToText } from "html-to-text";
import { z } from "zod";

import { prisma } from "~/server/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const newsRouter = createTRPCRouter({
  getNews: publicProcedure
    .input(
      z
        .object({
          count: z.number().default(4),
        })
        .default({}),
    )
    .query(async ({ input }) => {
      const news = await prisma.news_news.findMany({
        orderBy: [
          {
            // eslint-disable-next-line camelcase
            created_at: "desc",
          },
        ],
        take: input.count,
      });

      return news.map((x) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        x.description = htmlToText(x.description || x.content || "", {
          wordwrap: false,
        });

        x.content =
          x.content?.replaceAll(
            "../../../../media",
            "https://www.kset.org/media",
          ) ?? null;

        return x;
      });
    }),

  getNewsItem: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const news = await prisma.news_news.findFirst({
        where: {
          slug: input.slug,
        },
      });

      return news;
    }),
});
