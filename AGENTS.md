# AGENTS.md --- Agent Integration Guide (v1.2.4)

This file provides machine-optimized context for AI agents interacting
with this repository.

It defines invocation expectations, output contracts, parsing rules, and
behavioral constraints for the skills in this repo.

------------------------------------------------------------------------

## Repository Scope

This repository contains Open Agent Skills focused on Apple platform
engineering.

Current Skill: - apple-accessibility-advisor (v1.2.4)

Planned Domains: - Performance optimization - Architecture review -
Concurrency modernization - CI automation guidance

Audience: Intermediate to senior Apple platform engineers.

------------------------------------------------------------------------

## Skill Registry (Machine Metadata)

-   skill_id: apple-accessibility-advisor
-   version: 1.2.4
-   author: Saurabh Dave
-   platforms: \["iOS","iPadOS","macOS","watchOS","visionOS","tvOS"\]
-   areas:
    \["accessibility","swiftui","uikit","appkit","watchkit","testing","wcag"\]
-   manifest_file: skills/apple-accessibility-advisor/SKILL.md

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

Short Review: "Audit this SwiftUI view for accessibility compliance and
return structured output."

Deep Audit: "Run a full accessibility audit and produce a prioritized
remediation plan."

Platform-Specific: "Adapt this VoiceOver behavior for watchOS and tvOS.
Include code and testing notes."

CI Validation: "Verify that all interactive elements define
accessibility labels and return missing elements only."

------------------------------------------------------------------------

## Skill Loading Strategy for Agents

1.  Load SKILL.md first.
2.  Apply Output Contract.
3.  Reference supporting modules only when deeper guidance is needed:
    -   accessibility-patterns.md
    -   testing-strategies.md
    -   wcag-guidelines.md
    -   swiftui-examples.md
4.  Maintain deterministic structure.

------------------------------------------------------------------------

## Versioning Policy

Semantic Versioning:

-   Major → Output contract or structural changes
-   Minor → Capability expansion
-   Patch → Wording refinement or minor improvements

Agents should reference version when debugging structured outputs.

------------------------------------------------------------------------

## Maintenance

Update this file when:

-   A new skill is added
-   The Output Contract changes
-   Behavioral constraints change
-   The repository structure evolves

------------------------------------------------------------------------

End of AGENTS.md
