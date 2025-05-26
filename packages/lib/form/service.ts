import { ZId } from "@/packages/types/environment"
import { validateInputs } from "../utils/validate"
import { prisma } from "@/packages/database/client";
import { formCache } from "./cache";
import { DatabaseError } from "@/packages/types/errors";
import { Prisma } from "@prisma/client";
import { cache } from "../cache";
import { TForm, TFormInput } from "@/packages/types/forms";

export const selectForm = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
//   type: true,
  environmentId: true,
  createdBy: true,
  status: true,
  welcomeCard: true,
  questions: true,
  thankYouCard: true,
//   hiddenFields: true,
//   displayOption: true,
//   recontactDays: true,
//   displayLimit: true,
//   autoClose: true,
//   runOnDate: true,
//   closeOnDate: true,
//   delay: true,
//   displayPercentage: true,
//   autoComplete: true,
//   verifyEmail: true,
  redirectUrl: true,
//   productOverwrites: true,
//   styling: true,
//   surveyClosedMessage: true,
//   singleUse: true,
//   pin: true,
//   resultShareKey: true,
//   showLanguageSwitch: true,
};


export const getFormCount = async (environmentId: string): Promise<number> => 
    cache(
        async () => {
            validateInputs([environmentId, ZId]);
            try {
                const formCount = await prisma.form.count({
                   where: {
                        environmentId: environmentId,
                   },
                });

                return formCount;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    console.error(error);
                    throw new DatabaseError(error.message);
                }

                throw error;
            }
        },
        [`getFormcount-${environmentId}`],
        {
            tags: [formCache.tag.byEnvironmentId(environmentId)],
        }
    )()

export const createForm = async (environmentId: string, formBody: TFormInput): Promise<TForm> => {
    validateInputs([environmentId, ZId]);

    try {
        const createdBy = formBody.createdBy;
        delete formBody.createdBy;

        const data: Omit<Prisma.FormCreateInput, "environment"> = {
            ...formBody,
        }

        if (createdBy) {
            data.creator = {
                connect: {
                    id: createdBy
                },
            };
        }

        const form = await prisma.form.create({
            data: {
                ...data,
                environment: {
                    connect: {
                        id: environmentId,
                    },
                },
            },
            select: selectForm,
        })

        formCache.revalidate({
            id: form.id,
            environmentId: form.environmentId,
        })

        return form as TForm;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error);
            throw new DatabaseError(error.message);
        }

        throw error;
    }
};
