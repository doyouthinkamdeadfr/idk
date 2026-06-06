---
on:
  push:
    branches: [main]

permissions:
  contents: read

safe-outputs:
  update-release:
    max: 1
---

## Release Drafter

When code is merged to main, draft a new release with auto-generated notes.

## Steps

1. Read all merged pull requests since the last release
2. Group them by label:
   - "ci" → "CI/CD Improvements"
   - "frontend" → "Frontend Changes"
   - "backend" → "Backend Changes"
   - "database" → "Database Changes"
   - "tests" → "Testing Improvements"
   - "dependencies" → "Dependency Updates"
   - No label → "Other Changes"
3. Create a draft release with:
   - Tag: next patch version (e.g., v0.0.2, v0.0.3...)
   - Title: same as tag
   - Body: grouped list of PRs with their descriptions
   - Set as draft (not published yet)
