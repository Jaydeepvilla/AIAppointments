import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing(.*)",
  "/features(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/demo(.*)",
  "/integrations(.*)",
  "/security(.*)",
  "/docs(.*)",
  "/changelog(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/widget(.*)",
  "/api/health",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.[\\w]+$|_next/image).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
