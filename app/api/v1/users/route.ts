import { sendVerificationEmail } from "@/packages/email";
import { createUser, updateUser } from "@/packages/lib/user/service";

export const POST = async (request: Request) => {
    let { ...user } = await request.json();
    try {
        user = {
            ...user,
            ...{ email: user.email.toLowerCase() },
        };

        // Create the user
        user = await createUser(user);

        const updatedNotificationSettings = {
            ...user.notificationSettings,
            alert: {
                ...user.notificationSettings?.alert,
            },
            weeklySummary: {
                ...user.notificationSettings?.weeklySummary,
            },
        };

        await updateUser(user.id, {
            notificationSettings: updatedNotificationSettings,
        });

        await sendVerificationEmail(user.email);

        return Response.json(user);
    } catch (e) {
        if (e.message === "User with this email already exists") {
            return Response.json(
                {
                    error: "user with this email address already exists",
                    errorCode: e.code,
                },
                { status: 409 }
            );
        } else {
            return Response.json(
                {
                    error: e.message,
                    errorCode: e.code,
                },
                { status: 500 }
            );
        }
    };
};