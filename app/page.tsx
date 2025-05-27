import { authOptions } from "@/packages/lib/authOptions";
import { getFirstEnvironmentByUserId } from "@/packages/lib/environment/service";
import { getOrganizationsByUserId } from "@/packages/lib/organization/service";
import { TEnvironment } from "@/packages/types/environment";
import { ClientLogout } from "@/packages/ui/ClientLogout";
import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";


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
    console.log("Environment:", environment);
  } catch (error) {
    console.error(`error getting environment: ${error}`)
  }

  const userOrganization = await getOrganizationsByUserId(session.user.id);
  // console.log("User Organization:", userOrganization);
  if (userOrganization.length === 0) {
    return redirect("/setup/organization/create");
  }

  if (!environment) {
    console.error("Failed to get first environment of user");
    return redirect(`/organizations/${userOrganization[0].id}/products/new/channel`);
  }

  return redirect(`/environments/${environment.id}`);
};

export default Page;