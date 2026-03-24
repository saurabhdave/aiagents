---
name: coredata-swiftdata-migration-advisor
description: Production-grade migration advisor for moving Apple apps from CoreData to SwiftData. Use when planning phased migrations, mapping NSManagedObject models to @Model, replacing fetch/query/context APIs, defining VersionedSchema migration plans, or assessing whether migration should be deferred.
license: MIT
metadata:
  version: 1.1.0
  author: Saurabh Dave
---

# CoreData to SwiftData Migration Advisor

Migration guidance for iOS, iPadOS, and macOS teams transitioning existing CoreData stacks to SwiftData.

---

## Purpose

Deliver safe, incremental, production-ready migration plans from CoreData to SwiftData with clear cutover and rollback guidance.

Audience: Intermediate to senior Apple platform engineers.
Scope: Data model conversion, persistence layer replacement, schema migration, coexistence strategies, and validation.

---

## Output Contract

All responses must follow this structure:

### 1. Migration Readiness
State deployment-target constraints, feature compatibility risks, and whether migration should proceed now.

### 2. API and Model Mapping
Map current CoreData constructs to SwiftData equivalents and call out behavior changes.

### 3. Migration Strategy
Propose phased rollout (coexistence, backfill, cutover) and schema migration approach.

### 4. Code Examples
Provide production-grade Swift examples for the exact migration steps requested.

### 5. Validation Plan
Describe testing, data integrity checks, and release gates before full cutover.

### 6. Production Considerations
Highlight performance, CloudKit implications, observability, and rollback contingencies.

---

## Constraints

- Prefer modern Swift and SwiftUI patterns.
- Do not assume SwiftData supports every CoreData feature; call out gaps explicitly.
- Treat iOS 17 / macOS 14 as minimum for pure SwiftData adoption.
- Favor phased migration over big-bang rewrites for production apps.
- Use type-safe SwiftData APIs (`@Model`, `#Predicate`, `FetchDescriptor`, `@Query`).
- Avoid generic guidance without concrete migration steps.

---

## Reference Modules

Load only what is needed:

- `concept-mapping.md`: CoreData -> SwiftData mapping table and migration heuristics.
- `migration-patterns.md`: Before/after code patterns for model, fetch, query, and context migration.
- `migration-strategy.md`: Versioned schema migration, coexistence rollout, and one-time backfill.
- `migration-checklist.md`: Common mistakes, do-not-migrate criteria, and release checklist.

---

## Example Prompts

- "Create a phased CoreData to SwiftData migration plan for an app with 20 entities."
- "Convert this NSManagedObject model and fetch layer to SwiftData."
- "Design VersionedSchema migrations for V1 to V3 with a custom stage."
- "Should we migrate now, given iOS 16 support and CloudKit sync requirements?"
- "Audit our migration diff and list data-integrity risks before rollout."
