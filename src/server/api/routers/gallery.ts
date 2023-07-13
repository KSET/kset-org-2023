import { z } from "zod";

import { prisma } from "~/server/db";

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
      const galleries = await prisma.gallery_album.findMany({
        take: input.count,
        orderBy: {
          // eslint-disable-next-line camelcase
          date_of_event: "desc",
        },
        include: {
          // eslint-disable-next-line camelcase
          gallery_photographer: true,
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
      const gallery = await prisma.gallery_album.findFirst({
        where: {
          slug: input.slug,
        },
        include: {
          // eslint-disable-next-line camelcase
          gallery_photographer: true,
          // eslint-disable-next-line camelcase
          gallery_image_album: {
            include: {
              // eslint-disable-next-line camelcase
              gallery_image: true,
            },
          },
        },
      });

      return gallery;
    }),
});
