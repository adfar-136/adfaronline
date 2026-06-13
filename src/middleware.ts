import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isDashboard = path.startsWith("/dashboard");
  const isAdmin = path.startsWith("/admin");

  if (isDashboard || isAdmin) {
    // Check if the session token cookie exists (standard or secure variant)
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
