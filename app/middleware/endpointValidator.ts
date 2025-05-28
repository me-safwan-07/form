export const loginRoute = (url: string) => url === "/api/auth/callback/credentials";

export const isAuthProtectedRoute = (url: string): boolean => {
    // List of routes that require authentication
    const protectedRoutes = ["/environments", "/setup/organization", "/organizations"];
    
    return protectedRoutes.some((route) => url.startsWith(route));
};