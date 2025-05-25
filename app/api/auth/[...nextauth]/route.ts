import NextAuth from "next-auth";
import { authOptions } from "@/packages/lib/authOptions";

export const fetchCache = "force-no-store";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
