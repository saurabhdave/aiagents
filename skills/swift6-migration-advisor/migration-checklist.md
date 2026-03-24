# Swift 6 Migration Checklist

Use this checklist before enabling Swift 6 language mode on each target and before shipping a migrated release.

---

## Pre-Migration Assessment

- [ ] Xcode 16+ is used (required for Swift 6 language mode).
- [ ] Swift toolchain is 6.0 or later (`swift --version`).
- [ ] All SPM dependencies declare a compatible `swiftLanguageVersion` or are warning-clean at `complete`.
- [ ] A migration branch exists for each target being upgraded.
- [ ] The test suite covers concurrent code paths (actors, Tasks, background work).

---

## Phase 1 — Targeted Strict Concurrency

- [ ] `SWIFT_STRICT_CONCURRENCY = targeted` enabled on target.
- [ ] All new warnings reviewed (not suppressed automatically).
- [ ] `@MainActor` added to view-layer classes and view models.
- [ ] `Sendable` conformance added to value types crossing task boundaries.
- [ ] No new `@unchecked Sendable` added without a synchronization comment.

---

## Phase 2 — Complete Strict Concurrency

- [ ] `SWIFT_STRICT_CONCURRENCY = complete` enabled on target.
- [ ] Build is warning-clean (zero concurrency diagnostics).
- [ ] All global `var` declarations are either `let`, actor-isolated, or `nonisolated(unsafe)` with documented justification.
- [ ] All `@escaping` closures crossing actor boundaries are `@Sendable`.
- [ ] `@preconcurrency import` used only for third-party modules pending upgrade.
- [ ] Every `@unchecked Sendable` has a comment citing the specific lock or invariant.
- [ ] Every `nonisolated(unsafe)` has a comment and a backlog ticket for removal.

---

## Phase 3 — Swift 6 Language Mode

- [ ] `SWIFT_VERSION = 6` (or `.swiftLanguageVersion(.v6)`) set on target.
- [ ] Build compiles without errors in Swift 6 mode.
- [ ] All bare protocol existentials updated to `any Protocol`.
- [ ] Typed throws adopted where it reduces `as?` casting at call sites.
- [ ] Redundant `@preconcurrency` annotations removed.
- [ ] `nonisolated(unsafe)` usages reduced or eliminated.
- [ ] Thread Sanitizer run on the test suite with no data-race reports.

---

## Release Checklist

- [ ] Full test suite passes with Swift 6 mode enabled.
- [ ] Thread Sanitizer enabled in test scheme — no data races detected.
- [ ] Main-thread checker enabled — no main-thread violations in UI paths.
- [ ] Xcode's concurrency warnings (`-strict-concurrency=complete`) produce zero diagnostics in CI.
- [ ] Performance regression tests run — actor hops can add latency in hot paths.
- [ ] Instruments "Swift Concurrency" template run on representative flows.
- [ ] Crash-free rate baseline captured before rollout.
- [ ] Staged rollout plan documented (e.g., 1% → 10% → 100%).

---

## Common Mistakes

### Do not use `@unchecked Sendable` as a silence-all fix

Incorrect:

```swift
// Silencing warning, no actual thread safety
final class Cache: @unchecked Sendable {
    var storage: [String: Data] = [:]
}
```

Correct:

```swift
// @unchecked Sendable with documented lock
final class Cache: @unchecked Sendable {
    private let lock = NSLock()
    private var storage: [String: Data] = [:]
    func value(for key: String) -> Data? { lock.withLock { storage[key] } }
    func setValue(_ data: Data, for key: String) { lock.withLock { storage[key] = data } }
}
```

### Do not mix @MainActor and DispatchQueue.main

Incorrect:

```swift
@MainActor
func updateLabel() {
    DispatchQueue.main.async { self.label.text = "done" } // redundant and confusing
}
```

Correct:

```swift
@MainActor
func updateLabel() {
    label.text = "done" // already on main actor
}
```

### Do not leave async functions without actor context when they touch UI

Incorrect:

```swift
func loadAndDisplay() async {
    let data = await fetch()
    label.text = data.title // main-thread violation if called from background Task
}
```

Correct:

```swift
@MainActor
func loadAndDisplay() async {
    let data = await fetch()
    label.text = data.title
}
```

### Do not use `any Protocol` where `some Protocol` is appropriate

Incorrect (loses type information, forces heap allocation):

```swift
func makeFormatter() -> any Formatter { DateFormatter() }
```

Correct (opaque type, concrete type inferred by compiler):

```swift
func makeFormatter() -> some Formatter { DateFormatter() }
```

### Do not keep @preconcurrency imports after the dependency is updated

- Review all `@preconcurrency import` on every dependency version bump.
- Remove when the imported module is clean at Swift 6.

---

## Do-Not-Migrate Criteria

Do not enable Swift 6 mode on a target if:

- A required SPM dependency fails to compile under `complete` strict concurrency and has no workaround.
- The target is a plugin or tool that runs on Swift 5.x toolchains in CI.
- A third-party binary framework is not `Sendable`-safe and cannot be wrapped in a facade.

In these cases, stay at `SWIFT_STRICT_CONCURRENCY = complete` with Swift 5 language mode until the blocker is resolved.
