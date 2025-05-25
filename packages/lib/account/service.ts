import { TAccount, TAccountInput, ZAccountInput } from "@/packages/types/account";
import { validateInputs } from "../utils/validate";
import { filterAccountInputData } from "./utils";
import { prisma } from "@/packages/database/client";
import { Prisma } from "@prisma/client";
import { DatabaseError } from "@/packages/types/errors";

export const createAccount = async (accountData: TAccountInput): Promise<TAccount> => {
    validateInputs([accountData, ZAccountInput]);

    try {
        const supportedAccountData = filterAccountInputData(accountData);
        const account = await prisma.account.create({
            data: supportedAccountData
        });

        return account
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }

        throw error;
    }
    
}