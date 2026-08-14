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

## Structure

```
src/
  app/        # App Router routes (layout, page, globals.css)
  lib/        # utilities (cn helper) + tests
  components/ # UI primitives + feature components (empty — build here)
public/       # static assets
```
