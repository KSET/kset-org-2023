import { htmlToText } from "html-to-text";
import { z } from "zod";

import { prisma } from "~/server/db";
import { utcDate } from "~/utils/date";
import { dbFieldsOfModel, dbModelFor } from "~/utils/prisma";

import { createTRPCRouter, publicProcedure } from "../trpc";

const ClubNewsDbModel = dbModelFor("ClubNews");
const ClubNewsDbFields = dbFieldsOfModel(ClubNewsDbModel);

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
      const news = await prisma.clubNews.findMany({
        orderBy: [
          {
            createdAt: "desc",
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

  getNewsForYear: publicProcedure
    .input(z.object({ year: z.number() }).optional())
    .query(async ({ input }) => {
      const forYear = input?.year ?? new Date().getFullYear();
      const startOfYear = utcDate({ year: forYear, month: 1, day: 1 });
      const startOfYearAfter = utcDate({ year: forYear + 1, month: 1, day: 1 });

      const news = await prisma.clubNews.findMany({
        where: {
          AND: [
            {
              createdAt: {
                gte: startOfYear,
              },
            },
            {
              createdAt: {
                lt: startOfYearAfter,
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        forYear,
        items: news,
      };
    }),

  getYearsWithNews: publicProcedure.query(async () => {
    const eventYears: { date: number }[] = await prisma.$queryRawUnsafe(
      `select distinct date_part('year', ${
        ClubNewsDbFields.createdAt
      }) as date from "${
        ClubNewsDbModel.dbName ?? ""
      }" order by date_part('year', ${ClubNewsDbFields.createdAt}) desc`,
    );

    return eventYears.map((e) => e.date);
  }),

  getNewsItem: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const news = await prisma.clubNews.findFirst({
        where: {
          slug: input.slug,
        },
      });

      return news;
    }),
});
