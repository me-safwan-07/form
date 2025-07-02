import { authOptions } from "@/packages/lib/authOptions";
import { getFirstEnvironmentByUserId } from "@/packages/lib/environment/service";
import { createOrganization, getOrganizationsByUserId } from "@/packages/lib/organization/service";
import { TEnvironment } from "@/packages/types/environment";
import { ClientLogout } from "@/packages/ui/ClientLogout";
import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { createProductAction } from "./(app)/environments/[environmentId]/actions";
import { DEFAULT_BRAND_COLOR } from "@/packages/lib/constants";


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
    // return redirect("/setup/organization/create");
    const product  = await createOrganization();
    const productionEnvironment = product.environment[0];
    return redirect(`/environments/${productionEnvironment.id}/forms`);
  }

  if (!environment) {
    // console.error("Failed to get first environment of user");
    // return redirect(`/organizations/${userOrganization[0].id}/products/new/settings`);

    const styling = {
      styling: {
        allowStyleOverwrite: true,
        brandColor: {
          light: DEFAULT_BRAND_COLOR
        }
      }
    }

    const product = await createProductAction(userOrganization[0]?.id, styling)
    redirect(`/environments/${product.id}/forms`);
  }

  return redirect(`/environments/${environment.id}`);
};

export default Page;