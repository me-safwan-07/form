"use server";

import { authOptions } from "@/packages/lib/authOptions";
import { updateForm } from "@/packages/lib/form/service";
import { getProduct } from "@/packages/lib/product/service";
import { AuthorizationError } from "@/packages/types/errors";
import { TForm } from "@/packages/types/forms";
import { TProduct } from "@/packages/types/product";
import { getServerSession } from "next-auth";

export const updateFormAction = async (form: TForm): Promise<TForm> => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authorized");

    // TODO add the security function like access here

    return await updateForm(form);
}
export const refetchProductAction = async (productId: string): Promise<TProduct | null> => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authorized");

    const product = await getProduct(productId);
    return product;
}