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
});
