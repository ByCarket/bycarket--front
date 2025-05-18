import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;

  if (pathname.startsWith("/dashboard") && !authToken) {
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*"],
};