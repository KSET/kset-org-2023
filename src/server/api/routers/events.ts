import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type Assign } from "~/types/object";
import { utcDate } from "~/utils/date";
import { dbFieldsOfModel, dbModelFor } from "~/utils/prisma";

const ClubEventModel = dbModelFor("ClubEvent");
const ClubEventDbFields = dbFieldsOfModel(ClubEventModel);

export const eventsRouter = createTRPCRouter({
  getUpcomingEvents: publicProcedure.query(async () => {
    const events = await prisma.clubEvent.findMany({
      orderBy: {
        date: "asc",
      },
      select: {
        id: true,
        title: true,
        tags: true,
        date: true,
        time: true,
        price: true,
        slug: true,
        daytime: true,
      },
      take: 5,
      where: {
        date: {
          gte: new Date(),
        },
      },
    });

    return events;
  }),

  getEventInfo: publicProcedure
    .input(z.object({ slug: z.string(), withImages: z.boolean().optional() }))
    .query(async ({ input }) => {
      const event = await prisma.clubEvent.findFirst({
        where: {
          slug: input.slug,
        },
      });

      if (!event) {
        return null;
      }

      let gallery = null;
      if (input.withImages) {
        gallery = await prisma.galleryAlbum.findFirst({
          where: {
            slug: input.slug,
          },
          select: {
            galleryImageAlbum: {
              select: {
                image: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    uploadPath: true,
                    caption: true,
                  },
                },
              },
              take: 10,
            },
            photographer: true,
          },
        });
      }

      const evt = event as Assign<
        typeof event,
        {
          gallery: typeof gallery;
        }
      >;

      evt.gallery = gallery;

      return evt;
    }),

  getEventsForYear: publicProcedure
    .input(z.object({ year: z.number() }).optional())
    .query(async ({ input }) => {
      const forYear = input?.year ?? new Date().getFullYear();
      const startOfYear = utcDate({ year: forYear, month: 1, day: 1 });
      const startOfYearAfter = utcDate({ year: forYear + 1, month: 1, day: 1 });

      const events = await prisma.clubEvent.findMany({
        where: {
          AND: [
            {
              date: {
                gte: startOfYear,
              },
            },
            {
              date: {
                lt: startOfYearAfter,
              },
            },
          ],
        },
        select: {
          id: true,
          slug: true,
          title: true,
          date: true,
          price: true,
          tags: true,
          thumb: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      const groupedByMonth = events.reduce<Record<number, typeof events>>(
        (acc, event) => {
          const month = event.date.getMonth();

          if (!acc[month]) {
            acc[month] = [];
          }

          acc[month]!.push(event);

          return acc;
        },
        {},
      );

      return {
        forYear,
        groupedByMonth,
      };
    }),

  getYearsWithEvents: publicProcedure.query(async () => {
    const eventYears: { date: number }[] = await prisma.$queryRawUnsafe(
      `select distinct date_part('year', ${
        ClubEventDbFields.date
      }) as date from "${
        ClubEventModel.dbName ?? ""
      }" order by date_part('year', ${ClubEventDbFields.date}) desc`,
    );

    return eventYears.map((e) => e.date);
  }),
});
