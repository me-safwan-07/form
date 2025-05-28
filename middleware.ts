import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { isAuthProtectedRoute } from "./app/middleware/endpointValidator";
import { WEBAPP_URL } from "./packages/lib/constants";

export const middleware = async (request: NextRequest) => {
    // issue with next auth types & Next 15; lets's review when new fixes are available
    // @ts-expect-error
    const token = await getToken({ req: request });

    if (isAuthProtectedRoute(request.nextUrl.pathname) && !token) {
        const loginUrl = `${WEBAPP_URL}/auth/login?callbackUrl=${encodeURIComponent(WEBAPP_URL + request.nextUrl.pathname + request.nextUrl.search)}`;
        return NextResponse.redirect(loginUrl);
    }

    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (token && callbackUrl) {
        return NextResponse.redirect(WEBAPP_URL + callbackUrl);
    }
    if (process.env.NODE_ENV !== "production") {
        return NextResponse.next();
    }

    // let ip =
    //     request.headers.get("cf-connecting-ip") ||
    //     request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    //     request.ip;

    // if (ip) {
    //     try {
    //         if (loginRoute(request.nextUrl.pathname)) {
    //             await 
    //         }
    //     }
    // }
}