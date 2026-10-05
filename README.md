# MVV App Template

Blank Next.js starter template for MVV apps. Provides the shared tooling and
project structure with no branding, content, or domain code — clone it and
build.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (PostCSS) with a neutral placeholder design-token system in
  `src/app/globals.css` — swap the brand values for your client's branding.
- **shadcn** (base-nova, base-ui) configured via `components.json` — run
  `pnpm dlx shadcn@latest add <component>` to pull primitives into `src/components/ui`.
- **Vitest** for unit tests.
- **pnpm** package manager.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command      | Description                    |
| ------------ | ------------------------------ |
| `pnpm dev`   | Start the dev server           |
| `pnpm build` | Production build               |
| `pnpm start` | Serve the production build     |
| `pnpm lint`  | ESLint (next core-web-vitals)  |
| `pnpm test`  | Run Vitest unit tests          |

## Client walkthrough guide

Every MVV prototype ships with the MVL-branded walkthrough page the client
opens first: a card per screen, a "how to give feedback" panel, and an
optional AI-triggers modal of the exact prompts the agent is scripted for.

- **Where it lives:** `public/walkthrough/index.html` (plain HTML, no build
  step), plus `mvl-logo.svg` and the screenshots beside it.
- **Always available at** `/walkthrough`.
- **Make it the start page:** set `WALKTHROUGH_ON_ROOT=true` and redeploy. On
  Vercel, add it under Settings → Environment Variables, scoped to whichever
  environments should open on the guide (e.g. Production only). Unset or any
  other value leaves `/` as the app. It is read at build time, so changing it
  needs a redeploy. Locally: `WALKTHROUGH_ON_ROOT=true pnpm dev`.
- **While it is on,** `/` serves the guide instead of `src/app/page.tsx`, so
  give the platform's first screen its own route (e.g. `/sign-in`) and link
  the first card to it.

### Filling it in

Search `index.html` for `EDIT`:

1. The `WALKTHROUGH` config at the bottom: client name, date, and toggles for
   persona badges and the AI-triggers modal.
2. One `<article class="card">` per screen: step label, title, copy, and the
   "View screen" `href` (an app route like `/dashboard`). The screen count
   updates itself.
3. Screenshots as `public/walkthrough/shot-01.jpg`, `shot-02.jpg` … at 16:10
   (1440×900 works well). A missing file shows a placeholder.
4. The feedback contact email, and the AI-triggers flows if the prototype has
   a scripted agent.

## Structure

```
src/
  app/        # App Router routes (layout, page, globals.css)
  lib/        # utilities (cn helper) + tests
  components/ # UI primitives + feature components (empty — build here)
public/       # static assets
  walkthrough/  # client walkthrough guide (see above)
```
