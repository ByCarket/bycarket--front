// import { NextURL } from "next/dist/server/web/next-url";
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//     const { pathname, origin } = request.nextUrl;

//     const tokenCookie = request.cookies.get("token");

//     const protectedPaths = ["/dashboard"];
//     const isProtectedRoute = protectedPaths.includes(pathname);

//     if (isProtectedRoute && !tokenCookie?.value) {
//         const loginURL = new NextURL("/login", origin);
//         return NextResponse.redirect(loginURL);
//     }

//     return NextResponse.next();
// }