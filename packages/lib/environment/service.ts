import { TEnvironment, ZEnvironment, ZId } from "@/packages/types/environment";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { environmentCache } from "./cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/packages/database/client";
import { DatabaseError, ResourceNotFoundError, ValidationError } from "@/packages/types/errors";
import { z } from "zod";

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