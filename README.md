# AI Agents -- Apple Platform Engineering Skills 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.3.0-green.svg) ![Open
Agent
Skills](https://img.shields.io/badge/OpenAgentSkills-compatible-purple)

------------------------------------------------------------------------

## About

This repository provides Open Agent Skills for Apple platform
engineering tasks.

Each skill encapsulates production-grade domain expertise and is
designed to be consumed by compatible AI agents using the Open Agent
Skills specification via `npx skills`.

Audience: Intermediate to senior Apple platform engineers.\
Focus: Accessibility, architecture, performance, and enterprise
readiness.

------------------------------------------------------------------------

## Overview

A structured collection of reusable AI skills that help Apple platform
developers:

-   Audit and improve accessibility
-   Architect scalable systems
-   Optimize performance
-   Enforce platform best practices
-   Prepare for enterprise review and compliance

Skills are installable into compatible AI tooling using the `skills`
CLI.

------------------------------------------------------------------------


## What Makes These Skills Different

**Enterprise-oriented.**\
Designed for production applications --- not tutorial-level examples.

**Architectural focus.**\
Prioritizes scalable, multi-platform engineering decisions and migration safety.

**Deterministic output.**\
Enforces a strict Output Contract to ensure consistent structured
responses.

**Agent-framework agnostic.**\
Works with Claude Code, Cursor, Copilot-style agents, and other tools
supporting the Agent Skills format.

------------------------------------------------------------------------

## Skill Structure

    aiagents/
    ├── .claude/
    │   └── manifest.json
    ├── .claude-plugin/
    │   └── manifest.json
    ├── skills/
    │   ├── apple-accessibility-advisor/
    │   │   ├── SKILL.md
    │   │   ├── accessibility-patterns.md
    │   │   ├── swiftui-examples.md
    │   │   ├── testing-strategies.md
    │   │   ├── wcag-guidelines.md
    │   │   └── agents/
    │   │       └── openai.yaml
    │   └── coredata-swiftdata-migration-advisor/
    │       ├── SKILL.md
    │       ├── concept-mapping.md
    │       ├── migration-patterns.md
    │       ├── migration-strategy.md
    │       ├── migration-checklist.md
    │       └── agents/
    │           └── openai.yaml
    ├── AGENTS.md
    ├── CHANGELOG.md
    ├── LICENSE
    └── README.md

------------------------------------------------------------------------

## 🧰 Current Skills

| Skill | Description |
| --- | --- |
| `apple-accessibility-advisor` | Production-grade accessibility audit and implementation advisor for Apple platform applications (iOS, iPadOS, macOS, watchOS, visionOS, tvOS). |
| `coredata-swiftdata-migration-advisor` | Production-grade migration advisor for planning and executing CoreData to SwiftData transitions in production apps. |

--------------------------------------------------------------------------------------

## How to Use These Skills

Pick one skill ID:

- `apple-accessibility-advisor`
- `coredata-swiftdata-migration-advisor`

### Option A - skills.sh CLI (Recommended)

Install one skill at a time:

```bash
npx skills add saurabhdave/aiagents --skill apple-accessibility-advisor
```

```bash
npx skills add saurabhdave/aiagents --skill coredata-swiftdata-migration-advisor
```

Learn more: https://skills.sh

------------------------------------------------------------------------

### Option B - Claude Code Plugin

Personal setup:

```text
/plugin marketplace add saurabhdave/aiagents
/plugin install apple-accessibility-advisor@aiagents
/plugin install coredata-swiftdata-migration-advisor@aiagents
```

Team setup (`.claude/settings.json`):

```json
{
  "enabledPlugins": {
    "apple-accessibility-advisor@aiagents": true,
    "coredata-swiftdata-migration-advisor@aiagents": true
  },
  "extraKnownMarketplaces": {
    "aiagents": {
      "source": {
        "source": "github",
        "repo": "saurabhdave/aiagents"
      }
    }
  }
}
```

Commit this file to enable the same skills for the whole team.

------------------------------------------------------------------------

### Option C - Manual Installation

1. Clone the repo:

```bash
git clone https://github.com/saurabhdave/aiagents.git
```

2. Copy or symlink one or both folders into your tool's skills directory:
   - `skills/apple-accessibility-advisor/`
   - `skills/coredata-swiftdata-migration-advisor/`
3. Restart or reload your agent.

Supported tools include Claude Code, Cursor, Windsurf, and other
Agent-Skills compatible clients.

------------------------------------------------------------------------

## 📈 Roadmap

-   SwiftUI Performance Advisor
-   iOS Architecture Reviewer
-   Accessibility Testing & CI Automation
-   UIKit to SwiftUI Migration Assistant
-   Concurrency & Async/Await Modernization Advisor

------------------------------------------------------------------------

## 📄 License

MIT © 2026 Saurabh Dave

Maintained by Saurabh Dave.
