
import { authMiddleware } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/genkit(.*)" // Assuming Genkit flows might be called publicly or need specific handling
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  // ignoredRoutes: ['/no-auth-in-this-route'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)', '/admin(.*)'], // Added /admin(.*) to matcher
};
