import { ZId } from "@/packages/types/environment"
import { validateInputs } from "../utils/validate"
import { prisma } from "@/packages/database/client";
import { formCache } from "./cache";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { Prisma } from "@prisma/client";
import { cache } from "../cache";
import { TForm, TFormFilterCriteria, TFormInput, ZForm } from "@/packages/types/forms";
import { ZOptionalNumber } from "@/packages/types/common";
import { buildOrderByClause, buildWhereClause } from "./utils";

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

export const getForms = (
    environmentId: string,
    limit?: number,
    offset?: number,
    filterCriteria?: TFormFilterCriteria
): Promise<TForm[]> => 
    cache(
        async () => {
            validateInputs([environmentId, ZId], [limit, ZOptionalNumber], [offset, ZOptionalNumber]);
            try {
                const formsPrisma = await prisma.form.findMany({
                    where: {
                        environmentId,
                        ...buildWhereClause(filterCriteria),
                    },
                    select: selectForm,
                    orderBy: buildOrderByClause(filterCriteria?.sortBy),
                    take: limit ? limit : undefined,
                    skip: offset ? offset : undefined,
                });

                const forms: TForm[] = [];

                for (const formPrisma of formsPrisma) {
                    const parsedForm = ZForm.parse(formPrisma);
                    forms.push(parsedForm);
                }

                return forms;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(error);
                throw new DatabaseError(error.message);
                }

                throw error;
            }
        },
        [`getForms-${environmentId}-${limit}-${offset}-${JSON.stringify(filterCriteria)}`],
        {
            tags: [formCache.tag.byEnvironmentId(environmentId)],
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

    console.log("UpdatedForm", updateForm);
    try {
        const formId = updateForm.id;
        let data: any = {}; 

        const currentForm = await getForm(formId);
        console.log("CurrentForm", currentForm);
        if (!currentForm) {
            throw new ResourceNotFoundError("Form", formId);
        }

        const { questions, id, ...formdata } = updateForm; // 💡 Destructure and omit `id`

        data.questions = questions.map((question) => {
            const { ...rest } = question;
            return rest; 
        });

        formdata.updatedAt = new Date();

        data = {
            ...formdata,
            ...data,
        };

        console.log("data", data);

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
            throw new DatabaseError(error.message);
        }
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
