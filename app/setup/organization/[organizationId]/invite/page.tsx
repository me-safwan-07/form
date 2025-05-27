import { IS_SMTP_CONFIGURED } from "@/packages/email"
import { authOptions } from "@/packages/lib/authOptions";
import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from "@/packages/lib/constants"
import { AuthenticationError } from "@/packages/types/errors";
import { getServerSession } from "next-auth";
import { InviteMembers } from "./components/InviteMembers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invite",
  description: "Open-source Experience Management. Free & open source.",
};

const Page = async () => {
    // const IS_SMTP_CONFIGURED: boolean = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD ? true : false;
    const session = await getServerSession(authOptions);
    console.log("Session in invite page:", session);
    if (!session) throw new AuthenticationError("Not Authenticated");

    return <InviteMembers />
}

export default Page;