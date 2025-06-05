// middleware.js
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

async function withAuth(request) {
  try {
    const token = request.cookies.get("authToken")?.value;
    const userType = request.cookies.get("userType")?.value;
    const pathname = request.nextUrl.pathname;
    const inLoginPage =
      pathname.includes("sign-in") || pathname.includes("register");
    const inProtectedPage =
      pathname.includes("pricing") ||
      pathname.includes("profile");
      // pathname.includes("subscription")

    // const inSubscriptionPage = pathname.includes("subscription");

    if (inProtectedPage) {
      if (!token)
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (inLoginPage) {
      if (token) return NextResponse.redirect(new URL("/", request.url));
    }
    // if (inSubscriptionPage) {
    //   if (token && userType === "user")
    //     return NextResponse.redirect(new URL("/access-denied", request.url));
    // }

    return null;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { message: "Authentication error" },
      { status: 500 }
    );
  }
}

// Combine both middlewares
export async function middleware(request) {
  // First check authentication
  const authResult = await withAuth(request);
  if (authResult) return authResult;

  // Then handle internationalization
  return intlMiddleware(request);
}

// Update matcher to include admin routes
export const config = {
  matcher: [
    // Match all pathnames except those starting with `/api`, `/_next`, `/_vercel`, or containing a dot (e.g., `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match `/admin` routes, with or without a locale prefix
    "/admin/:path*",
    "/:locale/admin/:path*",
  ],
};
