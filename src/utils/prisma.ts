import { Prisma as PrismaObj } from "@prisma/client";
import { type Simplify } from "@trpc/server";

import { type Assign } from "~/types/object";

type Prisma = typeof PrismaObj;

export type ModelName = keyof Prisma["ModelName"];

const getPrismaModels = () => {
  const models = Object.fromEntries(
    PrismaObj.dmmf.datamodel.models.map((x) => {
      const fields = Object.fromEntries(
        x.fields.map((y) => [
          y.name,
          {
            ...y,
            resolvedName: y.dbName ?? y.name,
          },
        ]),
      );

      return [
        x.name,
        {
          ...x,
          fields,
        },
      ];
    }),
  );

  type PrismaModelsPrimitive = {
    [Key in ModelName]: (typeof models)[keyof typeof models];
  };

  type PrismaModels = {
    [ModelsKey in keyof PrismaModelsPrimitive]: Assign<
      PrismaModelsPrimitive[ModelsKey],
      {
        name: ModelsKey;
        fields: {
          [FieldKey in keyof Prisma[`${Capitalize<ModelsKey>}ScalarFieldEnum`]]: PrismaModelsPrimitive[ModelsKey]["fields"][string];
        };
      }
    >;
  };

  return models as Simplify<PrismaModels>;
};

export const PrismaModels = getPrismaModels();

export type PrismaModel = (typeof PrismaModels)[keyof typeof PrismaModels];

export const modelFor = <T extends ModelName>(modelName: T) => {
  return PrismaModels[modelName];
};
