# AGENTS.md --- Agent Integration Guide (v1.4.0)

This file provides machine-optimized context for AI agents interacting
with this repository.

It defines invocation expectations, output contracts, parsing rules, and
behavioral constraints for the skills in this repo.

------------------------------------------------------------------------

## Repository Scope

This repository contains Open Agent Skills focused on Apple platform
engineering.

Current Skills:
- apple-accessibility-advisor (v1.3.0)
- coredata-swiftdata-migration-advisor (v1.0.0)
- observable-migration-advisor (v1.0.0)

Planned Domains: - Performance optimization - Architecture review -
Concurrency modernization - CI automation guidance

Audience: Intermediate to senior Apple platform engineers.

------------------------------------------------------------------------

## Skill Registry (Machine Metadata)

-   skill_id: apple-accessibility-advisor
-   version: 1.3.0
-   author: Saurabh Dave
-   platforms: ["iOS","iPadOS","macOS","watchOS","visionOS","tvOS"]
-   areas:
    ["accessibility","swiftui","uikit","appkit","watchkit","testing","wcag"]
-   manifest_file: skills/apple-accessibility-advisor/SKILL.md

-   skill_id: coredata-swiftdata-migration-advisor
-   version: 1.0.0
-   author: Saurabh Dave
-   platforms: ["iOS","iPadOS","macOS"]
-   areas:
    ["coredata","swiftdata","migration","persistence","schema","rollout"]
-   manifest_file: skills/coredata-swiftdata-migration-advisor/SKILL.md

-   skill_id: observable-migration-advisor
-   version: 1.0.0
-   author: Saurabh Dave
-   platforms: ["iOS","iPadOS","macOS"]
-   areas:
    ["observation","observable","observableobject","swiftui","migration","combine"]
-   manifest_file: skills/observable-migration-advisor/SKILL.md

Agents must treat SKILL.md as the authoritative instruction set.

------------------------------------------------------------------------

## Invocation Contract

When invoking `apple-accessibility-advisor`, agents MUST enforce the
Output Contract defined in SKILL.md.

Expected structured sections:

1.  Issues Identified
2.  Impact
3.  Recommended Improvements
4.  Code Examples
5.  Testing Strategy
6.  Production Considerations

When invoking `coredata-swiftdata-migration-advisor`, agents MUST enforce
the Output Contract defined in SKILL.md.

Expected structured sections:

1.  Migration Readiness
2.  API and Model Mapping
3.  Migration Strategy
4.  Code Examples
5.  Validation Plan
6.  Production Considerations

When invoking `observable-migration-advisor`, agents MUST enforce the
Output Contract defined in SKILL.md.

Expected structured sections:

1.  Migration Readiness
2.  Concept Mapping
3.  Migration Strategy
4.  Code Examples
5.  Validation Plan
6.  Production Considerations

Responses must use clear section headers and deterministic formatting.

------------------------------------------------------------------------

## Behavioral Constraints

Agents using this repository MUST:

-   Prefer modern Swift and SwiftUI APIs.
-   Avoid deprecated frameworks.
-   Provide concrete code examples when relevant.
-   Assume intermediate-to-senior developer knowledge.
-   Favor architectural improvements over superficial fixes.
-   Align recommendations with Apple HIG and WCAG 2.1 AA where
    applicable.
-   Avoid unnecessary verbosity.
-   Never auto-modify user files without explicit confirmation.

------------------------------------------------------------------------

## Parsing & Formatting Rules

-   If returning code, use fenced blocks marked with `swift`.
-   If returning checklist results, preserve checklist formatting.
-   If asked for binary validation, return `true` or a structured list
    of violations.
-   Maintain professional, technical tone.

------------------------------------------------------------------------

## Invocation Examples

Accessibility Review: "Audit this SwiftUI view for accessibility
compliance and return structured output."

Accessibility Deep Audit: "Run a full accessibility audit and produce a
prioritized remediation plan."

Migration Planning: "Create a phased CoreData to SwiftData migration
plan for an app with existing production data."

Migration Implementation: "Convert this CoreData fetch and context logic
to SwiftData with a rollout-safe approach."

Observation Migration Planning: "Create a phased ObservableObject to
@Observable migration plan for a production SwiftUI app."

Observation Migration Implementation: "Convert this ObservableObject
view model and wrappers to @Observable safely."

------------------------------------------------------------------------

## Skill Loading Strategy for Agents

1.  Load SKILL.md first.
2.  Apply Output Contract.
3.  Reference supporting modules only when deeper guidance is needed:
    - For `apple-accessibility-advisor`:
      - accessibility-patterns.md
      - testing-strategies.md
      - wcag-guidelines.md
      - swiftui-examples.md
    - For `coredata-swiftdata-migration-advisor`:
      - concept-mapping.md
      - migration-patterns.md
      - migration-strategy.md
      - migration-checklist.md
    - For `observable-migration-advisor`:
      - concept-mapping.md
      - migration-patterns.md
      - migration-strategy.md
      - migration-checklist.md
4.  Maintain deterministic structure.

------------------------------------------------------------------------

## Versioning Policy

This repository uses two independent semantic version scopes:

-   Repo version:
    `package.json`, README badge, Git tag (`vX.Y.Z`), and AGENTS header
    represent the release version of the repository as a whole.
-   Skill version:
    Each skill has its own version in:
    - SKILL.md frontmatter (`version`)
    - `.claude/manifest.json` skill entry
    - AGENTS skill registry block

Agents should reference version when debugging structured outputs.

Version bump rules:

-   Bump repo version for any published repository release.
-   Bump a skill version only when that skill's behavior/content changes.
-   Keep unchanged skill versions stable across unrelated repo updates.

------------------------------------------------------------------------

## Maintenance

Update this file when:

-   A new skill is added
-   The Output Contract changes
-   Behavioral constraints change
-   The repository structure evolves

------------------------------------------------------------------------

End of AGENTS.md
