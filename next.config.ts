import type { NextConfig } from "next";

/* The client walkthrough guide (public/walkthrough/index.html) is always at
   /walkthrough. Set WALKTHROUGH_ON_ROOT=true (e.g. in the Vercel project's
   environment variables, then redeploy) to make it the first thing the
   client sees at "/" as well. It is read at build time, so each deploy can
   decide: Production on, Preview off, for example.

   While it is on, "/" never reaches src/app/page.tsx (beforeFiles wins over
   app-router matching), so give the platform's first screen its own route
   (e.g. /sign-in) and point the walkthrough's first card at it. */
const walkthroughOnRoot = process.env.WALKTHROUGH_ON_ROOT === "true";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: walkthroughOnRoot
        ? [{ source: "/", destination: "/walkthrough/index.html" }]
        : [],
      afterFiles: [
        { source: "/walkthrough", destination: "/walkthrough/index.html" },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
