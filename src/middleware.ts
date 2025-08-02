import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0"

export async function middleware(request: NextRequest) {
    const authRes = await auth0.middleware(request);

    // authentication routes — let the middleware handle it
    if (request.nextUrl.pathname.startsWith("/auth")) {
        return authRes;
    }

    // API routes — allow access to onboarding endpoints
    if (request.nextUrl.pathname.startsWith("/api/onboarding")) {
        return NextResponse.next();
    }

    // API routes — allow access to token endpoint
    if (request.nextUrl.pathname.startsWith("/api/auth/token")) {
        return NextResponse.next();
    }

    // public routes — no need to check for session
    if (request.nextUrl.pathname === ("/")) {
        return authRes;
    }

    // dashboard route — let Auth0 handle authentication
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        return authRes;
    }

    // demo route — allow access without authentication
    if (request.nextUrl.pathname.startsWith("/demo")) {
        return NextResponse.next();
    }

    // For protected routes, let Auth0 middleware handle the session check
    // The Auth0 middleware will automatically redirect to login if no session exists
    return authRes;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - api (API routes) - but we handle them in middleware
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
}