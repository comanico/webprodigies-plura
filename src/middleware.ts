// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected routes (require login)
const isProtectedRoute = createRouteMatcher(["/agency"]);

// Public routes (no login needed)
const isPublicRoute = createRouteMatcher(["/site", "/api/uploadthing"]);

export default clerkMiddleware(async (auth, req) => {
  // Await the auth result to access methods like redirectToSignIn
  const { userId, redirectToSignIn } = await auth();

  const { pathname } = req.nextUrl;

  // Redirect root to sign-in if not logged in
  if (pathname === "/" && !userId) {
    return redirectToSignIn({ returnBackUrl: "/sign-in" });
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    // Optional: Redirect logged-in users away from sign-in pages
    if (userId) {
      // rewrite for domains
      const url = req.nextUrl;
      const searchParams = url.searchParams.toString();
      let hostname = req.headers;

      const pathWithSearchParams = `${url.pathname}${
        searchParams.length > 0 ? `?${searchParams}` : ""
      }`;

      // if subdomain exists
      const customSubDomain = hostname
        .get("host")
        ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0];

      if (customSubDomain) {
        return NextResponse.rewrite(
          new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
        );
      }

      if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
        return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
      }

      if (
        url.pathname === "/" ||
        (url.pathname === "/site" &&
          url.pathname === process.env.NEXT_PUBLIC_DOMAIN)
      ) {
        return NextResponse.rewrite(new URL('/site', req.url));
      }

      if (url.pathname.startsWith('/agency')|| url.pathname.startsWith('/subaccount')){
        return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
      }
    }
    return NextResponse.next();
  }

  // Protect everything else
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // All good – proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip internals + static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes
    "/(api|trpc)(.*)",
  ],
};
