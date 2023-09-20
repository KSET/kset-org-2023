import { type Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "~/server/db";
import { utcDate } from "~/utils/date";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const galleryRouter = createTRPCRouter({
  getGalleries: publicProcedure
    .input(
      z
        .object({
          count: z.number().default(4),
        })
        .default({}),
    )
    .query(async ({ input }) => {
      const galleries = await prisma.galleryAlbum.findMany({
        take: input.count,
        orderBy: {
          dateOfEvent: "desc",
        },
        include: {
          photographer: true,
        },
      });

      return galleries;
    }),

  getGallery: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const gallery = await prisma.galleryAlbum.findFirst({
        where: {
          slug: input.slug,
        },
        include: {
          photographer: true,
          galleryImageAlbum: {
            include: {
              image: true,
            },
          },
        },
      });

      return gallery;
    }),

  getGalleryOverview: publicProcedure
    .input(
      z.object({
        eventType: z.enum(["live", "foto"]),
        forYear: z
          .number()
          .int()
          .min(2000)
          .max(2100)
          .default(new Date().getFullYear()),
        filter: z
          .object({
            titleOrPhotographerName: z.string().transform((v) => v.trim()),
          })
          .partial()
          .optional(),
      }),
    )
    .query(async ({ input: { forYear, eventType, filter } }) => {
      const startOfYear = utcDate({
        year: forYear,
        month: 1,
        day: 1,
      });
      const startOfYearAfter = utcDate({
        year: forYear + 1,
        month: 1,
        day: 1,
      });

      const galleriesFilter = (
        [
          filter?.titleOrPhotographerName
            ? {
                OR: [
                  {
                    title: {
                      contains: filter.titleOrPhotographerName,
                      mode: "insensitive",
                    },
                  },
                  {
                    photographer: {
                      name: {
                        contains: filter.titleOrPhotographerName,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              }
            : undefined,
          {
            category: eventType,
          },
          {
            dateOfEvent: {
              gte: startOfYear,
            },
          },
          {
            dateOfEvent: {
              lt: startOfYearAfter,
            },
          },
        ] satisfies (Prisma.GalleryAlbumWhereInput | undefined)[]
      ).filter(Boolean);

      const galleries = await prisma.galleryAlbum.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          thumb: true,
          dateOfEvent: true,
          photographer: {
            select: {
              name: true,
            },
          },
        },
        where: {
          AND: galleriesFilter,
        },
        orderBy: [
          {
            dateOfEvent: "asc",
          },
          {
            title: "asc",
          },
        ],
      });

      const entries = galleries.reduce<Record<number, typeof galleries>>(
        (acc, gallery) => {
          const month = gallery.dateOfEvent.getMonth() + 1;

          if (!acc[month]) {
            acc[month] = [];
          }

          acc[month]!.push(gallery);

          return acc;
        },
        {},
      );

      return {
        forYear,
        eventType,
        filter,
        groupedByMonth: entries,
      };
    }),
});
