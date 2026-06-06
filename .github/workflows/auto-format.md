---
on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read

safe-outputs:
  push-to-pull-request-branch:
    max: 1
  add-comment:
    max: 1
---

## Auto-Format Prettier

When CI lint fails on a PR, fix formatting automatically.

## Steps

1. Checkout the PR branch
2. Install dependencies with `bun install --frozen-lockfile`
3. Run `bun run format` to fix all prettier issues
4. Commit any changes as "style: auto-format" and push to the PR branch
5. If nothing changed, leave a comment saying "No formatting issues found"
