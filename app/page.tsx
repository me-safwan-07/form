import { authOptions } from "@/packages/lib/authOptions";
import { TEnvironment } from "@/packages/types/environment";
import { ClientLogout } from "@/packages/ui/ClientLogout";
import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { getOrganizationsByUserId } from "@/packages/lib/organization/service";
import { getFirstEnvironmentByUserId } from "@/packages/lib/environment/service";


const Page = async () => {
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/login");
  }

  if (!session?.user) {
    return <ClientLogout />;
  }

  let environment: TEnvironment | null = null;
  try {
    environment = await getFirstEnvironmentByUserId(session?.user.id);
  } catch (error) {
    console.error(`error getting environment: ${error}`);
  }

  const userOrganizations = await getOrganizationsByUserId(session.user.id);

  if (userOrganizations.length === 0) {
    return redirect("/setup/organization/create");
  }

  if (!environment) {
    console.log("Failed to get first environment of user");
    return redirect(`/organizations/${userOrganizations[0].id}/products/new/channel`);
  }

  return redirect(`/environments/${environment.id}`);
};

export default Page;