import { authOptions } from "@/packages/lib/authOptions";
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

  return redirect("/environments");
};

export default Page;