import { authOptions } from "@/packages/lib/authOptions";
import { gethasNoOrganizations } from "@/packages/lib/instance/service";
import { AuthenticationError } from "@/packages/types/errors";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { CreateOrganization } from "./components/CreateOrganization";

const Page = async () => {
    const session = await getServerSession(authOptions);

    if (!session) throw new AuthenticationError("Not Authenticated");

    const hasNoOrganizations = await gethasNoOrganizations();

    if (hasNoOrganizations) {
        return <CreateOrganization />
    }

    return notFound();
}

export default Page;