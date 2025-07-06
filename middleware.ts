import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    
    // Check if trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin) {
        // Redirect non-admin users to the translate page
        return NextResponse.redirect(new URL("/translate", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access if user has token (is authenticated)
        if (!token) return false;
        
        // For admin routes, also check role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token.role === "ADMIN";
        }
        
        // For other protected routes, just check authentication
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/translate/:path*", "/admin/:path*"],
};