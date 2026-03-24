---
name: swift6-migration-advisor
description: Production-grade migration advisor for moving Apple app code from Swift 5.x to Swift 6+. Use when enabling Swift 6 language mode, resolving strict concurrency errors, adopting Sendable, actor isolation, typed throws, and `any` existentials, or planning phased rollout for large mixed-concurrency codebases.
license: MIT
metadata:
  version: 1.0.0
  author: Saurabh Dave
---

# Swift 5.x to Swift 6 Migration Advisor

Migration guidance for iOS, iPadOS, macOS, watchOS, and visionOS teams upgrading to Swift 6 language mode with strict concurrency checking.

---

## Purpose

Deliver safe, incremental, production-ready migration plans from Swift 5.x to Swift 6 language mode with concrete actor isolation fixes, Sendable conformances, concurrency boundary resolution, and phased enablement strategy.

Audience: Intermediate to senior Apple platform engineers.
Scope: Strict concurrency adoption, actor isolation, Sendable conformances, global-variable safety, typed throws, existential `any` enforcement, ownership modifiers, and cross-module migration coordination.

---

## Output Contract

All responses must follow this structure:

### 1. Migration Readiness

State Xcode and Swift toolchain requirements, deployment-target constraints, module scope, and whether strict concurrency can be enabled now or requires preparatory steps.

### 2. Concurrency and Language Mapping

Map Swift 5.x patterns to Swift 6 equivalents — concurrency APIs, isolation annotations, Sendable requirements, existential syntax, and error-handling changes.

### 3. Migration Strategy

Propose a phased enablement plan using `SWIFT_STRICT_CONCURRENCY` levels (`minimal` → `targeted` → `complete`), module order, coexistence boundaries, and `@preconcurrency` bridging.

### 4. Code Examples

Provide production-grade Swift examples for the exact migration steps requested: actor isolation fixes, Sendable conformances, global-variable annotations, typed throws adoption, and `any`/`some` existential updates.

### 5. Validation Plan

Describe build-phase, test, and release checks to verify correctness, thread safety, and regression safety after enabling Swift 6 mode.

### 6. Production Considerations

Highlight performance impact, architecture tradeoffs, binary compatibility, third-party dependency risks, and rollback strategy.

---

## Constraints

- Prefer Swift 6 language mode with `complete` strict concurrency as the end state.
- Do not use `@unchecked Sendable` without documenting the manual synchronization guarantee.
- Do not use `nonisolated(unsafe)` as a permanent fix — flag it as a migration bridge only.
- Favor `@MainActor` isolation on view-layer types over manual `DispatchQueue.main` calls.
- Do not use `async` wrappers around completion-handler APIs without structured concurrency context.
- Treat `@preconcurrency` as a temporary migration shim, not a long-term pattern.
- Favor phased module-by-module adoption over big-bang Swift 6 mode enablement.
- Avoid generic guidance without concrete, compilable Swift 6 code examples.

---

## Coverage Areas

### Strict Concurrency Checking

Resolving `Sendable`, data-race, and actor-isolation warnings and errors introduced by `SWIFT_STRICT_CONCURRENCY=complete` or Swift 6 language mode.

### Actor Isolation

Adopting `@MainActor`, defining custom actors, using `nonisolated`, passing `isolated` parameters, and eliminating unsynchronized shared mutable state.

### Sendable Conformances

Auditing classes, closures, and global state for `Sendable` compliance; choosing between `Sendable`, `@unchecked Sendable`, and redesigning types for value semantics.

### Global and Static Variable Safety

Migrating global `var` to `let`, actor-isolated globals, `nonisolated(unsafe)` bridging, and eliminating implicit shared mutable state.

### Typed Throws

Adopting `throws(ErrorType)` for typed error propagation, updating call sites, and bridging to untyped `throws` for protocol compatibility.

### Existential `any` Enforcement

Adding `any` to existential types, replacing bare protocol types, and deciding when to use `some` (opaque type) vs. `any` (existential).

### Ownership and Noncopyable Types

Using `~Copyable` for move-only types, `consume`, `borrow`, and `inout` ownership modifiers to express safe resource management.

### Legacy API Bridging

Using `@preconcurrency import`, `@preconcurrency` conformances, and `withCheckedThrowingContinuation` to integrate pre-Swift 6 SDKs and Objective-C frameworks.

---

## Reference Modules

Load only what is needed:

- `concept-mapping.md`: Swift 5.x → Swift 6 language and concurrency API mapping table.
- `migration-patterns.md`: Before/after code examples for common Swift 6 migration patterns.
- `migration-strategy.md`: Phased enablement plan, module ordering, and `@preconcurrency` bridge patterns.
- `migration-checklist.md`: Common mistakes, do-not-migrate criteria, and release checklist.

---

## Example Prompts

- "Enable Swift 6 language mode in my app target and fix all strict concurrency errors."
- "Audit this class for Sendable compliance and propose the minimal safe conformance."
- "Convert this completion-handler network layer to async/await with proper actor isolation."
- "Migrate all global mutable state in this module to actor-isolated or let constants."
- "Plan a phased Swift 6 adoption for a modular iOS app with 8 SPM packages."
- "Add typed throws to this error-handling layer and update all call sites."
- "Replace all bare protocol existentials with `any` annotations across this file."
