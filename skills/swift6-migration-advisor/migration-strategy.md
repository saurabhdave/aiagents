# Swift 6 Migration Strategy

Guidance for planning and executing a phased Swift 6 language mode adoption in production apps and SPM packages.

---

## Phased Enablement Plan

Swift provides three `SWIFT_STRICT_CONCURRENCY` levels. Progress through them in order — do not jump directly from `minimal` to Swift 6 mode.

### Phase 1 — Targeted Warnings (`targeted`)

Set `SWIFT_STRICT_CONCURRENCY = targeted` (or `.enableExperimentalFeature("StrictConcurrency")` in SPM) per target.

Goals:

- Surface concurrency warnings without blocking the build.
- Identify which types cross task/actor boundaries.
- Add `Sendable` conformances and `@MainActor` to obvious candidates.
- Do not suppress warnings with `@unchecked Sendable` or `nonisolated(unsafe)` unless the fix is genuinely deferred.

Exit criteria: Zero new warnings introduced by `targeted` mode.

### Phase 2 — Complete Warnings (`complete`)

Set `SWIFT_STRICT_CONCURRENCY = complete` per target.

Goals:

- Resolve all remaining concurrency diagnostics.
- Audit global and static mutable state.
- Add `@preconcurrency import` for third-party modules that emit noise.
- Validate that `@unchecked Sendable` usages are documented with a synchronization comment.

Exit criteria: Clean build under `complete` strict concurrency with no suppressions pending removal.

### Phase 3 — Swift 6 Language Mode

Set `SWIFT_VERSION = 6` (Xcode target) or `.swiftLanguageVersion(.v6)` (SPM).

Goals:

- All `complete` warnings are now errors — the build should already be clean.
- Adopt typed throws where it improves error-handling expressiveness.
- Replace remaining bare `Protocol` existentials with `any Protocol`.
- Remove all temporary `@preconcurrency` annotations that are no longer needed.

Exit criteria: All targets compile with `SWIFT_VERSION = 6` and pass full test suite.

---

## Module Migration Order

For modular apps (SPM packages or Xcode frameworks), migrate in dependency order — leaves first, entry point last.

```
[Networking] → [Domain] → [Feature A] → [App Target]
     ↑               ↑
 migrate first   migrate second
```

Rules:

1. Migrate modules with no upstream Swift 5 dependencies first.
2. Use `@preconcurrency import LegacyModule` at the boundary between a migrated and unmigrated module.
3. Do not enable Swift 6 mode on a module until all modules it imports are warning-clean at `complete`.

---

## Handling Third-Party Dependencies

| Situation | Strategy |
| --- | --- |
| Dependency ships Swift 6 package | Upgrade to version that declares `swiftLanguageVersion(.v6)` |
| Dependency is warning-free at `complete` but not Swift 6 | Use as-is; add `@preconcurrency import` if needed |
| Dependency emits Sendable or isolation warnings | `@preconcurrency import Dep` to downgrade to warnings |
| Dependency is Objective-C / C | Warnings suppressed automatically; verify delegate patterns are `@MainActor` |
| Dependency is unmaintained | Wrap in an actor-isolated facade; `@unchecked Sendable` on wrapper with documented lock |

---

## @preconcurrency Bridge Patterns

Use `@preconcurrency` as a migration bridge — remove it once the underlying module is updated.

```swift
// Suppress Sendable warnings from a pre-Swift-6 module
@preconcurrency import LegacyAnalytics

// Suppress retroactive conformance warnings on an extension
@preconcurrency extension LegacyModel: @unchecked Sendable {}

// Mark a protocol conformance as pre-concurrency
class MyClass: @preconcurrency LegacySomeDelegate { ... }
```

Track all `@preconcurrency` usages in a migration backlog. Each one is a debt item.

---

## Global State Migration Decision Tree

```
Is the global variable immutable (let)?
  YES → No change needed. Already safe.
  NO  →
    Is it accessed only from @MainActor context?
      YES → Annotate with @MainActor.
      NO  →
        Is it a simple primitive that never races in practice?
          YES → Consider nonisolated(unsafe) + comment (bridge only).
          NO  →
            Move to an actor or redesign as a dependency-injected service.
```

---

## Concurrency Error Triage Priorities

When enabling strict concurrency produces a large number of errors, address them in this order:

1. **Actor isolation violations on @MainActor types** — lowest risk, highest return. Usually just adding `@MainActor` to a class.
2. **Missing Sendable on value types** — add conformance or convert to struct.
3. **Global mutable var** — convert to `let`, actor-isolated, or injected dependency.
4. **Completion-handler closures crossing boundaries** — refactor to async/await or mark `@Sendable`.
5. **@unchecked Sendable audit** — verify each has a valid synchronization proof.
6. **Third-party noise** — add `@preconcurrency import` last, after own-code is clean.

---

## Rollback Strategy

- Keep a migration branch per module. Merge only when the module is fully clean.
- Use feature flags in CI to build with `SWIFT_STRICT_CONCURRENCY=complete` without shipping.
- If a dependency introduces regressions after migration, lock to a pre-migration version and file an upstream issue.
- Swift 6 mode is per-target. Rolling back one target does not affect others.
