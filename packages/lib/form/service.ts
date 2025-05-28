import { ZId } from "@/packages/types/environment"
import { validateInputs } from "../utils/validate"
import { prisma } from "@/packages/database/client";
import { formCache } from "./cache";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { Prisma } from "@prisma/client";
import { cache } from "../cache";
import { TForm, TFormInput, ZForm } from "@/packages/types/forms";

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

export const getForm = (formId: string): Promise<TForm | null> =>
    cache(
        async () => {
            validateInputs([formId, ZId]);
            try {
                const formPrisma = await prisma.form.findUnique({
                    where: {
                        id: formId,
                    },
                    select: selectForm,
                });

                if (!formPrisma) {
                    return null;
                }

                return formPrisma as TForm;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    console.error(error);
                    throw new DatabaseError(error.message);
                }
                throw error;
            }
        },
        [`getForm-${formId}`],
        {
            tags: [formCache.tag.byId(formId)],
        }
    )();


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
    )();

export const updateForm = async (updateForm: TForm): Promise<TForm> => {
    validateInputs([updateForm, ZForm]);

    try {
        const formId = updateForm.id;
        let data: any = {}; 

        const currentForm = await getForm(formId);
        if (!currentForm) {
            throw new ResourceNotFoundError("Form", formId);
        }

        const {  questions, ...formdata} = updateForm;

        data.questions = questions.map((question) => {
            const { ...rest } = question;
            return rest; 
        });

        formdata.updatedAt = new Date();

        data = {
            ...formdata,
            ...data,
        };

        // TODO if in future add the runOnDate unComment below code
        // Remove scheduled status when runOnDate is not set
        // if (data.status === "scheduled" && data.runOnDate === null) {
        //     data.status = "inProgress";
        // }
        // Set scheduled status when runOnDate is set and in the future on completed surveys
        // if (
        //     (data.status === "completed" || data.status === "paused" || data.status === "inProgress") &&
        //     data.runOnDate &&
        //     data.runOnDate > new Date()
        // ) {
        //     data.status = "scheduled";
        // }
        
        const prismaForm = await prisma.form.update({
            where: { id: formId },
            data,
            select: selectForm,
        });

        formCache.revalidate({
            id: prismaForm.id,
            environmentId: prismaForm.environmentId,
        });

        return prismaForm as TForm;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error);
            throw new DatabaseError(error.message);
        }
        console.log(error)
        throw error;
    }
}

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
