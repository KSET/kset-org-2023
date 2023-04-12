import { htmlToText } from "html-to-text";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

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

      return {
        ...event,
        date: event.date.toISOString(),
        time: event.time?.toISOString(),
        description: event.description
          ? htmlToText(event.description, {
              wordwrap: false,
            })
          : undefined,
        gallery,
      };
    }),
});
