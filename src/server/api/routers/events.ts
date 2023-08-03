import { Prisma } from "@prisma/client";
import { htmlToText } from "html-to-text";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { utcDate } from "~/utils/date";

export const eventsRouter = createTRPCRouter({
  getUpcomingEvents: publicProcedure.query(async () => {
    const events = await prisma.events_event.findMany({
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
      const event = await prisma.events_event.findFirst({
        where: {
          slug: input.slug,
        },
      });

      if (!event) {
        return null;
      }

      let gallery = null;
      if (input.withImages) {
        /* eslint-disable camelcase */
        gallery = await prisma.gallery_album.findFirst({
          where: {
            slug: input.slug,
          },
          select: {
            gallery_image_album: {
              select: {
                gallery_image: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    upload_path: true,
                    caption: true,
                  },
                },
              },
              take: 10,
            },
            gallery_photographer: true,
          },
        });
        /* eslint-enable camelcase */
      }

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const description = htmlToText(event.description || event.content || "", {
        wordwrap: false,
      })
        // Replace multiple whitespace (space, newline, etc.) with a single space
        .replace(/\s+/g, " ")
        // Trim string to 200 characters and add ellipsis
        .replace(/^(.{200}[^\s]*).*/, "$1…");

      return {
        ...event,
        date: event.date.toISOString(),
        time: event.time?.toISOString() ?? null,
        description,
        gallery,
      };
    }),

  getEventsForYear: publicProcedure
    .input(z.object({ year: z.number() }).optional())
    .query(async ({ input }) => {
      const forYear = input?.year ?? new Date().getFullYear();
      const startOfYear = utcDate({ year: forYear, month: 1, day: 1 });
      const startOfYearAfter = utcDate({ year: forYear + 1, month: 1, day: 1 });

      const events = await prisma.events_event.findMany({
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
      `select distinct date_part('year', ${Prisma.Events_eventScalarFieldEnum.date}) as date from ${Prisma.ModelName.events_event} order by date_part('year', ${Prisma.Events_eventScalarFieldEnum.date}) desc`,
    );

    return eventYears.map((e) => e.date);
  }),
});
