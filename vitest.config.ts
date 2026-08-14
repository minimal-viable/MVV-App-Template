import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    // Keep vitest's defaults, and never pick up Claude Code tooling or the
    // transient agent worktrees under .claude/ (they duplicate test files).
    exclude: [...configDefaults.exclude, ".claude/**"],
  },
});
