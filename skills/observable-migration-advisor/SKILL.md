---
name: observable-migration-advisor
description: Production-grade migration advisor for moving Apple app observation code from ObservableObject to the @Observable macro. Use when converting models, replacing @Published and objectWillChange patterns, updating SwiftUI wrappers (@StateObject/@ObservedObject/@EnvironmentObject), and planning phased rollout for mixed ObservableObject + @Observable codebases.
version: 1.0.0
author: Saurabh Dave
license: MIT
---

# ObservableObject to @Observable Migration Advisor

Migration guidance for iOS, iPadOS, and macOS teams modernizing SwiftUI observation from `ObservableObject` to `@Observable`.

---

## Purpose

Deliver safe, incremental, production-ready migration plans from `ObservableObject` to `@Observable` with clear wrapper mapping, binding updates, and coexistence strategy.

Audience: Intermediate to senior Apple platform engineers.
Scope: Observation model conversion, view wrapper migration, environment injection updates, Combine replacement options, and rollout validation.

---

## Output Contract

All responses must follow this structure:

### 1. Migration Readiness
State deployment-target constraints, framework compatibility, and whether migration should proceed now.

### 2. Concept Mapping
Map current `ObservableObject`/`@Published`/wrapper usage to `@Observable` patterns and call out behavior changes.

### 3. Migration Strategy
Propose phased rollout order, coexistence boundaries, and risk controls for production adoption.

### 4. Code Examples
Provide production-grade Swift examples for the exact migration steps requested.

### 5. Validation Plan
Describe testing and release checks to verify correctness, rendering behavior, and regression safety.

### 6. Production Considerations
Highlight performance impact, architecture tradeoffs, and rollback contingencies.

---

## Constraints

- Prefer modern Swift and SwiftUI APIs.
- Treat `iOS 17+` / `macOS 14+` as minimum for pure `@Observable` adoption.
- Do not use `@Published` inside `@Observable` types.
- Do not use `@ObservedObject`, `@StateObject`, or `.environmentObject(...)` with `@Observable` types.
- Use `@Bindable` only when bindings (`$`) are required for non-owned observable objects.
- Favor phased migration over big-bang rewrites for production apps.
- Avoid generic guidance without concrete migration steps.

---

## Reference Modules

Load only what is needed:

- `concept-mapping.md`: `ObservableObject` -> `@Observable` API and wrapper mapping.
- `migration-patterns.md`: Before/after model and view migration examples.
- `migration-strategy.md`: Coexistence rollout, conversion order, and publisher replacement patterns.
- `migration-checklist.md`: Common mistakes, do-not-migrate criteria, and release checklist.

---

## Example Prompts

- "Convert this ObservableObject view model and dependent SwiftUI views to @Observable."
- "Audit this migration diff and list observation-related regressions."
- "Plan a phased migration from @EnvironmentObject to @Environment(Type.self)."
- "Replace this @Published Combine pipeline with @Observable-compatible patterns."
- "Should we migrate now if we still support iOS 16?"
