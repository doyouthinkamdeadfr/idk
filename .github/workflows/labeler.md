---
on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read

safe-outputs:
  add-labels:
    allowed: [ci, frontend, backend, database, tests, dependencies]
    max: 6
---

## PR Labeler

Automatically label pull requests based on which files were changed.

## Rules

- Label "ci" if `.github/**` files were changed
- Label "frontend" if `src/**/*.svelte`, `src/**/*.css`, or `src/components/**` files were changed
- Label "backend" if `src/routes/api/**` or `src/lib/server/**` files were changed
- Label "database" if `src/db/**` or `migrations/**` files were changed
- Label "tests" if `src/**/*.test.*` or `tests/**` files were changed
- Label "dependencies" if `package.json` or `bun.lock` files were changed

Apply all matching labels. Don't remove existing labels.
