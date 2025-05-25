import { ZId } from "@/packages/types/environment";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { prisma } from "@/packages/database/client";
import { Prisma } from "@prisma/client";
import { DatabaseError } from "@/packages/types/errors";
import { productCache } from "./cache";
import { TProduct } from "@/packages/types/product";


const selectProduct = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  darkOverlay: true,
  environments: true,
  styling: true,
  logo: true,
};

export const getProductByEnvironmentId = (environmentId: string): Promise<TProduct | null> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId]);

      let productPrisma;

      try {
        productPrisma = await prisma.product.findFirst({
          where: {
            environments: {
              some: {
                id: environmentId,
              },
            },
          },
          select: selectProduct,
        });

        return productPrisma as TProduct | null;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    [`getProductByEnvironmentId-${environmentId}`],
    {
      tags: [productCache.tag.byEnvironmentId(environmentId)],
    }
  )();