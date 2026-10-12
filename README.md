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
| `pnpm setup:github` | Recreate the MVV milestones and issues on GitHub |

## GitHub milestones and issues

GitHub doesn't copy milestones or issues when you create a repo from a
template. After creating your project repo, run this once from its root:

```bash
pnpm setup:github
```

It needs the GitHub CLI (`gh`) logged in with access to the repo. It creates:

- the `role: designer`, `role: developer` and `role: both` labels
- milestones **M0 · Foundations** to **M5 · Final** (no due dates, so set them
  for your project)
- one issue per task, with M0 and M1 grouped into Week 0 and Day 0–4 parent
  issues with sub-issues

The tasks live in `scripts/github-setup/mvv-milestones.json`. Edit that file to
change them. The script is safe to re-run because it updates existing
milestones and issues instead of duplicating them. Add `--dry-run` to preview,
or `--repo owner/name` to target a different repo.

## Structure

```
src/
  app/        # App Router routes (layout, page, globals.css)
  lib/        # utilities (cn helper) + tests
  components/ # UI primitives + feature components (empty — build here)
public/       # static assets
```
