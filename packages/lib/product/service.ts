import { ZId } from "@/packages/types/environment";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { prisma } from "@/packages/database/client";
import { Prisma } from "@prisma/client";
import { DatabaseError, ValidationError } from "@/packages/types/errors";
import { productCache } from "./cache";
import { TProduct, TProductUpdateInput, ZProduct, ZProductUpdateInput } from "@/packages/types/product";
import { createEnvironment } from "../environment/service";
import { z } from "zod";
import { ZOptionalNumber } from "@/packages/types/common";


const selectProduct = {
  id: true,
  createdAt: true,
  updatedAt: true,
  // name: true,
  // organizationId: true,
  darkOverlay: true,
  environments: true,
  styling: true,
  logo: true,
};

export const getProducts = (organizationId: string, page?:number): Promise<TProduct[]> => {
  cache(
    async () => {
      validateInputs([organizationId, ZId], [page, ZOptionalNumber]);

      try {
        const products = await prisma.product.findMany({
          where: {
            organizationId,
          },
          select: selectProduct,
        });
        console.log("Prisma product", products)

        return products;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    [`getProducts-${organizationId}-${page}`],
    {
      tags: [productCache.tag.byUserId(organizationId)],
    }
  )
}

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

export const updateProduct = async (
  productId: string,
  inputProduct: TProductUpdateInput
): Promise<TProduct> => {
  validateInputs([productId, ZId], [inputProduct, ZProductUpdateInput]);

  const { environments, ...data } = inputProduct;
  let updatedProduct;
  try {
    updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...data,
        environments: {
          connect: environments?.map((environment) => ({ id: environment.id })) ?? [],
        },
      },
      select: selectProduct,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }

  try {
    const product = ZProduct.parse(updatedProduct);

    // productCache.revalidate({
    //   id: product.id,
    // });

    product.environments?.forEach((environment) => {
      // revalidate environment cache
      productCache.revalidate({
        environmentId: environment.id,
      });
    });
    return product;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(JSON.stringify(error.errors, null, 2));
    }
    throw new ValidationError("Data validation of product failed");
  }
};

export const getProduct = async (productId: string): Promise<TProduct | null> =>
  cache(
    async () => {
      try {
        const prodcutPrisma = await prisma.product.findUnique({
          where: {
            id: productId,
          },
          select: selectProduct,
        });

        return prodcutPrisma as TProduct;
      } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    [`getProduct-${productId}`],
    {
      tags: [productCache.tag.byId(productId)],
    }
  )();;

export const createProduct = async (
  productInput: Partial<TProductUpdateInput>
): Promise<TProduct> => {
  validateInputs([productInput, ZProductUpdateInput.partial()]);

  const { environments, ...data } = productInput;

  try {
    const product = await prisma.product.create({
      data: {
        ...data,
      },
      select: selectProduct,
    });

    productCache.revalidate({
      id: product.id,
      // organizationId: product.organizationId,
    });


    const environment = await createEnvironment(product.id);
    const updatedProduct = await updateProduct(product.id, {
      environments: [environment],
    });

    return updatedProduct;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }
    throw error;
  }
}