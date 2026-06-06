---
on:
  schedule:
    - cron: '0 6 * * 1'

permissions:
  contents: read

safe-outputs:
  add-labels:
    allowed: [stale]
    max: 3
  add-comment:
    max: 3
  close-issue:
    required-labels: [stale]
    max: 10
---

## Stale Issue & PR Manager

Weekly cleanup of stale issues and pull requests.

## Rules

- Mark issues with no activity for 60 days as "stale" with a comment:
  "This issue has been marked as stale due to inactivity. It will be closed in 7 days if no further activity occurs."
- Close stale issues after 7 more days of inactivity with a comment:
  "Closing this issue due to inactivity. Feel free to reopen if needed."
- Mark PRs with no activity for 60 days as "stale" with the same comment pattern
- Close stale PRs after 7 more days of inactivity
- Never mark issues labeled "priority" or "enhancement" as stale
- Never mark PRs labeled "dependencies" as stale
