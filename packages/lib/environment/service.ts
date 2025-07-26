import { TEnvironment, ZEnvironment, ZId } from "@/packages/types/environment";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { environmentCache } from "./cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/packages/database/client";
import { DatabaseError, ResourceNotFoundError, ValidationError } from "@/packages/types/errors";
import { z } from "zod";
import { getProducts } from "../product/service";
import { getOrganizationsByUserId } from "../organization/service";

export const getEnvironment = (environmentId: string): Promise<TEnvironment | null> =>
    cache(
        async () => {
            validateInputs([environmentId, ZId]);

            try {
                const environment = await prisma.environment.findUnique({
                    where: {
                        id: environmentId,
                    },
                });
                return environment;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    console.error(error);
                    throw new DatabaseError(error.message);
                }

                throw error;
            }
        },
        [`getEnvironment-${environmentId}`],
        {
            tags: [environmentCache.tag.byId(environmentId)],
        }
    )();

export const getEnvironments = (productId: string): Promise<TEnvironment[]> =>
    cache(
        async (): Promise<TEnvironment[]> => {
            validateInputs([productId, ZId]);
            let productPrisma;
            try {
                productPrisma = await prisma.product.findFirst({
                    where: {
                        id: productId,
                    },
                    include: {
                        environments: true,
                    },
                });

                if (!productPrisma) {
                    throw new ResourceNotFoundError("Product", productId);
                }
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new DatabaseError(error.message);
                }
                throw error;
            }

            const environments: TEnvironment[] = [];
            for (let environment of productPrisma.environments) {
                let targetEnvironment: TEnvironment = ZEnvironment.parse(environment);
                environments.push(targetEnvironment);
            }

            try {
                return environments;
            } catch (error) {
                if(error instanceof z.ZodError) {
                    console.error(JSON.stringify(error.errors, null, 2));
                }
                throw new ValidationError("Data validation of environments array failed");
            }
        },
        [`getEnvironments-${productId}`],
        {
            tags: [environmentCache.tag.byProductId(productId)],
        }
    )();

export const getFirstEnvironmentByUserId = async (userId: string): Promise<TEnvironment | null> => {
    try {
        const organizations = await getOrganizationsByUserId(userId);
        if (organizations.length === 0) {
            throw new Error(`Unable to get first environment: User ${userId} has no organizations`);
        }
        const firstOrganization = organizations[0];
        const product =  await getProducts(firstOrganization.id);
        if (product.length === 0) {
            throw new Error(
                `Unable to get first environment: Organization ${firstOrganization.id} has no products`
            );
        }
        const firstProduct = product[0];
        const productEnvironment = firstProduct.environments?.find(
            (environment) => environment
        );

        if (!productEnvironment) {
            throw new Error(
                `Unable to get first environment: Product ${firstProduct.id} has no production environment`
            );
        }

        return productEnvironment;
    } catch (error) {
        throw error;
    }
};

export const createEnvironment = async (
    productId: string
): Promise<TEnvironment> => {
    validateInputs([productId, ZId]);

    try {
        const environment = await prisma.environment.create({
            data: {
                product: {
                    connect: {
                        id: productId,
                    },
                }
            },
        });

        environmentCache.revalidate({
            id: environment.id,
            productId: environment.productId,
        });

        return environment
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }
        throw error;
    }
};