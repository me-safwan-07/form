'use server';

import { authOptions } from "@/packages/lib/authOptions";
import { DEFAULT_BRAND_COLOR } from "@/packages/lib/constants";
import { createMembership } from "@/packages/lib/membership/service";
import { createOrganization } from "@/packages/lib/organization/service";
import { createProduct } from "@/packages/lib/product/service";
import { updateUser } from "@/packages/lib/user/service";
import { AuthorizationError } from "@/packages/types/errors";
import { TProduct } from "@/packages/types/product";
import { getServerSession } from "next-auth";

export const createOrganizationAction = async (organizationName: string):Promise<TProduct> => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authenticated");

    const newOrganization = await createOrganization({
        name: organizationName,
    });

    await createMembership(newOrganization.id, session.user.id, {
        role: "owner",
        accepted: true,
    });

    const newProduct = await createProduct(newOrganization.id, {
        name: "Form Name",
        styling: {
            allowStyleOverwrite: true,
            brandColor: { light: DEFAULT_BRAND_COLOR }
        }
    });

    const updatedNotificationSettings = {
        ...session.user.notificationSettings,
        alert: {
            ...session.user.notificationSettings?.alert,
        },
        weeklySummary: {
            ...session.user.notificationSettings?.weeklySummary,
            [newProduct.id]: true,
        },
    };
    
    await updateUser(session.user.id, {
        notificationSettings: updatedNotificationSettings,
    });

    return newProduct;
};