# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A collection of **Open Agent Skills** for Apple platform engineering. Each skill is a structured set of markdown documents that AI agents load to provide deterministic, production-grade guidance on specific topics (accessibility, database migration, modern patterns). The repo contains no compiled code — all content is markdown.

## Commands

```bash
npm install       # Install markdownlint-cli dependency
npm run lint      # Lint all markdown files
```

There is no build step. Linting is the only automated check run locally.

## Adding or Modifying Skills

Each skill lives under `skills/<skill-id>/` and must contain:
- `SKILL.md` — frontmatter metadata + output contract (the primary instruction set for agents)
- Supporting reference docs (e.g., `concept-mapping.md`, `migration-patterns.md`)
- `agents/openai.yaml` — display metadata for OpenAI-style integrations

### Version Consistency Requirement

The CI (`validate-skill.yml`) enforces that versions match across **three locations** for every skill. When bumping a skill version, update all three:

1. `skills/<skill-id>/SKILL.md` frontmatter (`version:` field)
2. `.claude/manifest.json` (the `version` field for that skill entry)
3. `AGENTS.md` (the `version:` field in the skill's registry block)

The **repo version** (in `package.json` and the `AGENTS.md` header) is separate from per-skill versions. Bump the repo version when adding or significantly changing any skill.

### Skill Name/ID Convention

The skill `name` in SKILL.md and the `id` in `.claude/manifest.json` must match exactly. Validation will fail if they differ.

## CI Validation

The `validate-skill.yml` workflow runs on every push and PR. It:
1. Runs `npm run lint` (markdown linting)
2. Verifies all skills have required SKILL.md frontmatter fields
3. Cross-validates versions across SKILL.md, `.claude/manifest.json`, and `AGENTS.md`
4. On tag pushes, additionally validates the git tag matches `package.json` and AGENTS.md header versions

On release tags (`v*.*.*`), two additional workflows fire:
- `release.yml` — creates a GitHub Release with generated notes
- `update_badge_workflow.yml` — opens a PR updating the README version badge

## Architecture

```text
skills/
  <skill-id>/
    SKILL.md                  # Defines output contract agents MUST follow
    <reference-docs>.md       # Supporting context loaded as needed
    agents/openai.yaml        # UI hints for OpenAI integrations
.claude/manifest.json         # Claude Code skill registry
.claude-plugin/manifest.json  # Claude plugin system registry
AGENTS.md                     # Machine-optimized context (skill registry + behavioral rules)
```

**AGENTS.md** is the authoritative machine-readable registry. It defines invocation contracts, output structure requirements, and behavioral constraints that agent integrations must respect. It is not for human-first consumption.

**SKILL.md** files define the strict output contract for each skill — the ordered sections agents must produce in responses. These contracts are deterministic by design.

## Versioning Policy

- **Repo version** (`package.json`, AGENTS.md header): bumped when any skill is added or significantly changed
- **Per-skill version** (SKILL.md, manifest entries, AGENTS.md blocks): bumped independently per skill following semver

See `CONTRIBUTING.md` for the full versioning rationale.
