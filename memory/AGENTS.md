# LLM Wiki — supermemory landing page

This directory is a persistent, LLM-maintained wiki. You (the LLM) own the wiki layer entirely. The human curates sources, directs analysis, asks questions, and thinks about what it all means. You do the bookkeeping: summarizing, cross-referencing, filing, and keeping everything consistent.

## Directory structure

```
memory/
├── AGENTS.md           # This file — your operating instructions
├── raw/                # Immutable source documents (you read, never write)
│   ├── articles/       # Web articles, papers, blog posts
│   └── sessions/       # Raw session transcripts (if any)
└── wiki/               # Compiled knowledge — you own this entirely
    ├── _index.md       # Content catalog — every page listed with link + summary
    ├── _log.md         # Chronological record of all actions (append-only)
    ├── _overview.md    # Top-level synthesis / wiki landing page
    ├── decisions.md    # Architecture Decision Records
    ├── plan.md         # Project plan
    ├── tech-stack.md   # Technology stack reference
    ├── architecture.md # System architecture documentation
    ├── sections.md     # Landing page section design
    ├── sessions/       # Session notes (archival, can be sources for wiki pages)
    ├── concepts/       # Key concepts and terminology
    └── components/     # Component documentation
```

## Page conventions

- **Format**: Markdown (.md), GitHub Flavored Markdown
- **Frontmatter**: YAML frontmatter on every page with `tags`, `created`, `updated`, `sources` (list of source filenames)
- **Headings**: ATX headings (`#` for title, `##` for sections, `###` for subsections)
- **Cross-references**: Wiki links using markdown `[Page Name](page-name.md)` — always use relative paths from wiki root
- **Citations**: When making a claim from a source, cite it as `[source: filename.md]` inline
- **Contradictions**: If sources disagree, note both claims with `[contradiction: topic]` and summarize the disagreement

## Workflows

### Ingest a source

When the human drops a new source into `raw/` and asks you to process it:

1. Read the source file
2. Discuss key takeaways with the human (what to emphasize, what to downplay)
3. Create a summary page in `wiki/` under the appropriate subdirectory
4. Update `_index.md` with the new page entry
5. Update relevant existing wiki pages (decisions, architecture, concepts, etc.) if the new source adds or contradicts information
6. Append an entry to `_log.md` with prefix `## [YYYY-MM-DD] ingest | Source Title`
7. Stage and commit changes with a descriptive message

A single source may touch 5-15 wiki pages — update all of them.

### Answer a query

When the human asks a question:

1. Read `_index.md` to identify relevant pages
2. Read the relevant pages in full
3. Synthesize an answer with citations to wiki pages (`[page: page-name.md]`)
4. If the answer is substantial and worth preserving, file it as a new wiki page and update `_index.md` + `_log.md`
5. Append a log entry

### Lint the wiki

Periodically (or when asked):

1. Check for: contradictions between pages, stale claims superseded by newer sources, orphan pages with no inbound links, concepts mentioned but lacking their own page, missing cross-references
2. Suggest new questions to investigate and new sources to look for
3. Fix issues found (update pages, add links, create missing pages)
4. Append a lint entry to `_log.md`

### Commit discipline

After every significant change (ingest, query answer filed, lint fix), stage all changed files in `memory/` and commit with a clear message prefixed with `wiki:`.

## Important notes

- **Never modify files in `raw/`** — they are immutable source documents
- **Do update files in `wiki/`** as new knowledge arrives — keeping pages current is your primary job
- **Cross-reference liberally** — the value of the wiki grows with the density of connections between pages
- **The `_index.md` must be accurate** — it's the primary navigation tool for both you and the human
- **The `_log.md` is append-only** — never edit or delete past entries
- If you're unsure about a change, ask the human before making it
