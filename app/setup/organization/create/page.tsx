import { authOptions } from "@/packages/lib/authOptions";
import { gethasNoOrganizations } from "@/packages/lib/instance/service";
import { AuthenticationError } from "@/packages/types/errors";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { CreateOrganization } from "./components/CreateOrganization";
import { Metadata } from "next";
import { getOrganizationsByUserId } from "@/packages/lib/organization/service";
import { RemovedFromOrganization } from "./components/RemovedFromOrganization";

export const metadata: Metadata = {
  title: "Create Organization",
  description: "Open-source Experience Management. Free & open source.",
};

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthenticationError("Not Authenticated");

  const hasNoOrganizations = await gethasNoOrganizations();
  const userOrganizations = await getOrganizationsByUserId(session.user.id);
  if (!hasNoOrganizations) {
     return <CreateOrganization />
  }

  if (hasNoOrganizations ) {
    return <RemovedFromOrganization session={session} />
  }

  return notFound();
}

export default Page;