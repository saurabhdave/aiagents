# Changelog

All notable changes to this project are documented in this file.

This project follows Semantic Versioning (SemVer).

------------------------------------------------------------------------

## [1.5.0] - 2026-03-24

### Added

-   `CLAUDE.md` — repository guidance for Claude Code instances.
-   `apple-accessibility-advisor` (v1.4.0):
    -   Custom VoiceOver rotor patterns (`AccessibilityRotorEntry`, `UIAccessibilityCustomRotor`).
    -   `accessibilityRepresentation` pattern for custom-drawn controls.
    -   Automated accessibility auditing via `XCUIElement.performAccessibilityAudit()` (Xcode 15+).
    -   WCAG criteria: 1.4.11 Non-text Contrast, 2.5.3 Label in Name, 2.5.5 Target Size.
    -   Production component examples: list row, toggle with status, tab badge announcement.
-   `coredata-swiftdata-migration-advisor` (v1.1.0):
    -   Unsupported CoreData features table (`NSFetchedResultsController`, batch ops, abstract entities, fetched properties, transformable, history tracking).
    -   Inverse relationship pattern with `@Relationship(deleteRule:inverse:)`.
    -   Transformable / external storage migration pattern.
    -   Custom `MigrationStage` example with `willMigrate`/`didMigrate`.
    -   Batched backfill with `fetchLimit`/`fetchOffset` for large datasets.
    -   CloudKit migration section: container setup, schema requirements, migration window protocol, private-only limitation.
-   `observable-migration-advisor` (v1.1.0):
    -   Constraints section: class-only, no `objectWillChange`, no manual `Observable` conformance, `Sendable` interaction, subclassing rules.
    -   `@Published` with `willSet`/`didSet` side-effects migration — three ranked options.
    -   `AsyncStream` bridge replacing `PassthroughSubject`/`CurrentValueSubject`.
    -   Testing `@Observable` models: synchronous state tests, `withObservationTracking` assertions, UIKit VC test pattern, anti-patterns.

### Fixed

-   Deprecated `.foregroundColor(Color(UIColor.systemRed))` replaced with `.foregroundStyle(.red)` in `swiftui-examples.md`.
-   Removed irrelevant `axe-core` (web tool) reference from `testing-strategies.md`.
-   CI validation regex updated to handle `metadata:`-nested `version:` and `author:` frontmatter fields.
-   Fixed frontmatter in all three SKILL.md files: moved `version` and `author` under supported `metadata:` key.
-   Deduplicated checklist in `accessibility-patterns.md` (was a copy of the one in `SKILL.md`).
-   Differentiated `swiftui-examples.md` scope from `accessibility-patterns.md` — each file now has a distinct role.

------------------------------------------------------------------------

## [1.4.0] - 2026-03-04

### Added

-   Added new skill: `observable-migration-advisor`.
-   Added Observable migration reference modules:
    -   `concept-mapping.md`
    -   `migration-patterns.md`
    -   `migration-strategy.md`
    -   `migration-checklist.md`
-   Added agent UI metadata for the new skill (`agents/openai.yaml`).

### Improved

-   Updated `.claude/manifest.json` and `.claude-plugin/manifest.json` to
    register the new skill.
-   Updated README and AGENTS integration docs with the new skill,
    invocation contract, and installation commands.

------------------------------------------------------------------------

## [1.3.0] - 2026-03-03

### Added

-   Added new skill: `coredata-swiftdata-migration-advisor`.
-   Added migration reference modules:
    -   `concept-mapping.md`
    -   `migration-patterns.md`
    -   `migration-strategy.md`
    -   `migration-checklist.md`
-   Added agent UI metadata for the new skill (`agents/openai.yaml`).

### Improved

-   Updated `.claude/manifest.json` and `.claude-plugin/manifest.json` to
    register the new skill.
-   Updated README and AGENTS integration documentation for multi-skill
    usage and invocation contracts.

------------------------------------------------------------------------

## \[1.2.4\] - 2026-02-27

### Added

-   Finalized CI validation workflow (`validate-skill.yml`).
-   Enforced strict version consistency between:
    -   SKILL.md
    -   .claude/manifest.json
    -   Git tags
-   Pull request validation to prevent version drift before merge.

### Improved

-   Strengthened automated release safeguards.
-   Ensured release pipeline fails on metadata mismatch.
-   Elevated repository to fully automated, production-grade DevOps
    standards.

------------------------------------------------------------------------

## \[1.2.3\]

### Added

-   Initial CI validation workflow implementation.

------------------------------------------------------------------------

## \[1.2.2\] - 2026-02-27

### Added

-   Automated GitHub Release workflow (tag-based).
-   Automated README version badge update workflow.
-   CI-ready release automation using GitHub Actions.

### Improved

-   Release process now fully automated on semantic version tags
    (v*.*.\*).
-   README version badge now updates automatically based on tag.
-   Repository maturity upgraded to production-grade automation
    standards.

------------------------------------------------------------------------

## \[1.2.1\] - 2026-02-27

### Added

-   Claude Code plugin integration documentation.
-   `.claude/manifest.json` support for marketplace-style loading.
-   Agent-deterministic formatting requirement in SKILL.md.
-   Expanded README with multi-install options (skills.sh, Claude
    Plugin, Manual).

### Improved

-   Strengthened Output Contract enforcement.
-   Improved agent parsing guidance in AGENTS.md.
-   Enhanced enterprise positioning and installation clarity.
-   README restructured to align with marketplace-style skill repos.

------------------------------------------------------------------------

## \[1.2.0\] - 2026-02-27

### Added

-   Explicit Output Contract section.
-   Deterministic Constraints section.
-   Multi-platform scope clarification.
-   Conditional audit checklist guidance.
-   AGENTS.md for machine-optimized context.
-   CHANGELOG.md with semantic version tracking.

### Improved

-   Reduced narrative tone.
-   Increased instruction density for agent compliance.
-   Strengthened WCAG alignment references.

------------------------------------------------------------------------

## \[1.1.0\]

### Added

-   Audit checklist section.
-   Expanded multi-platform coverage.
-   Accessibility testing and CI considerations.

------------------------------------------------------------------------

## \[1.0.0\]

### Initial Release

-   Apple Accessibility Advisor skill.
-   WCAG 2.1 AA alignment.
-   Enterprise accessibility audit guidance.
