import { authOptions } from "@/packages/lib/authOptions";
import { createProduct } from "@/packages/lib/product/service";
import { updateUser } from "@/packages/lib/user/service";
import { AuthorizationError } from "@/packages/types/errors";
import { TProduct, TProductUpdateInput } from "@/packages/types/product";
import { getServerSession } from "next-auth";

export const createProductAction = async (
    productInput: TProductUpdateInput
): Promise<TProduct> => {
    const session  = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authenticated");

    const product = await createProduct(productInput);
    const updatedNotificationSettings = {
        ...session.user.notificationSettings,
        alert: {
            ...session.user.notificationSettings?.alert,
        },
        weeklySummary: {
            ...session.user.notificationSettings?.weeklySummary,
            [product.id]: true,
        },
    };

    await updateUser(session.user.id, {
        notificationSettings: updatedNotificationSettings,
    });

    return product;
};