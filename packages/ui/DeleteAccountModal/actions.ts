"use server";

import { authOptions } from "@/packages/lib/authOptions";
import { deleteUser } from "@/packages/lib/user/service";
import { AuthenticationError } from "@/packages/types/errors";
import { getServerSession } from "next-auth";

export const deleteUserAction = async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthenticationError("Not Authenticated");

    return await deleteUser(session.user.id)
}