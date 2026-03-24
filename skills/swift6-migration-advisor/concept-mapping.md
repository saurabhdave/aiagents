# Swift 5.x to Swift 6 Concept Mapping

Swift 6 language mode enforces complete data-race safety at compile time. The changes below are the primary source of migration errors when enabling `SWIFT_STRICT_CONCURRENCY=complete` or setting `swiftLanguageVersion` to `6`.

## Concurrency Isolation Mapping

| Swift 5.x (Old) | Swift 6 (New) | Notes |
| --- | --- | --- |
| `DispatchQueue.main.async { }` | `await MainActor.run { }` or `@MainActor func` | Prefer static isolation over runtime dispatch |
| `DispatchQueue(label:).async { }` | Custom `actor` | Actor replaces serial queue + shared state pattern |
| Unprotected global `var` | `let` constant, actor-isolated, or `nonisolated(unsafe)` | Mutable globals require isolation proof |
| Completion handler crossing threads | `async` function or `AsyncStream` | Structured concurrency eliminates callback threading |
| Manual `DispatchSemaphore` / `NSLock` | Actor or `Mutex` (Swift 6) | Prefer compiler-checked isolation |
| `@escaping` closure capturing mutable state | `@Sendable` closure with actor isolation | Closures crossing boundaries must be `Sendable` |

## Sendable Mapping

| Swift 5.x Pattern | Swift 6 Requirement | Notes |
| --- | --- | --- |
| Class passed across concurrency boundaries | `Sendable` conformance or actor-isolated | Compiler error without proof of safety |
| Reference type with internal lock | `@unchecked Sendable` + comment explaining lock | Manual proof required; use sparingly |
| Struct with all `Sendable` stored properties | Implicit `Sendable` (synthesized) | No annotation needed if all fields are `Sendable` |
| Enum with only `Sendable` associated values | Implicit `Sendable` | Same as struct rule |
| `@escaping` closure | Must be `@Sendable` if crossing actor boundary | Inferred in many cases; explicit if ambiguous |
| Subclass of `NSObject` | Conformance must be declared explicitly | `NSObject` is not retroactively `Sendable` |

## Actor Isolation Mapping

| Swift 5.x Pattern | Swift 6 Equivalent | Notes |
| --- | --- | --- |
| `class ViewModel: ObservableObject` | `@MainActor class ViewModel` | View-layer types belong on main actor |
| Method called from any thread | `nonisolated func method()` | Explicit opt-out of actor isolation |
| Property accessed from background | Actor-isolated property + `await` at call site | Crossing actor boundary requires `await` |
| `UIViewController` subclass | `@MainActor` (inferred from UIKit) | UIKit types are `@MainActor` in Xcode 16+ |
| Delegate callback on unknown thread | `@MainActor` on delegate method | Pin to main if UI work follows |
| `isolated` parameter | `func f(isolation: isolated any Actor)` | Pass actor as first-class value |

## Existential `any` Mapping

| Swift 5.x | Swift 6 | Notes |
| --- | --- | --- |
| `var delegate: SomeProtocol?` | `var delegate: (any SomeProtocol)?` | Bare existential now requires `any` keyword |
| `func take(_ p: Printable)` | `func take(_ p: any Printable)` | Applies to parameters, return types, stored properties |
| `[Equatable]` | `[any Equatable]` | Swift 6 warns on omission; error in strict mode |
| `some View` (opaque type) | unchanged | `some` is for opaque return types, not existentials |

## Error Handling Mapping

| Swift 5.x | Swift 6 | Notes |
| --- | --- | --- |
| `throws` (untyped) | `throws` (still valid, untyped) | Untyped throws remains supported |
| Untyped throws with known error type | `throws(MyError)` | Typed throws enables exhaustive `catch` |
| `rethrows` | `rethrows` (unchanged) | No change |
| `try?` on typed throw | Produces `Optional` directly | Same behavior; typed throw improves exhaustivity |

## Ownership Mapping

| Swift 5.x | Swift 6 / Swift 5.9+ | Notes |
| --- | --- | --- |
| No ownership annotation | `borrowing` (read-only, non-copying) | Default for most value-type parameters |
| `inout` | `inout` (unchanged) | Mutable borrow still `inout` |
| `consuming` | `consuming` (copy-on-write source) | Caller relinquishes value |
| N/A | `~Copyable` (noncopyable type) | Prevents implicit copies; for resources/handles |
| `consume(x)` | `consume x` (Swift 5.9 syntax) | Explicit ownership transfer |

## Build Setting Migration

| Setting | Swift 5 Value | Migration Path |
| --- | --- | --- |
| `SWIFT_STRICT_CONCURRENCY` | `minimal` (default) | `minimal` → `targeted` → `complete` |
| `SWIFT_VERSION` | `5` | `6` (final step, after `complete` is warning-clean) |
| Per-file override | N/A | Use `-strict-concurrency=targeted` per file via compiler flags |
| SPM package | `.swiftSettings([.swiftLanguageVersion(.v5)])` | `.swiftLanguageVersion(.v6)` per target |

## Behavior Differences

- Swift 6 mode turns concurrency warnings into errors — the code must compile clean at `complete` before enabling `SWIFT_VERSION = 6`.
- `nonisolated(unsafe)` silences isolation errors but provides no runtime guarantee; prefer it only as a temporary migration bridge.
- Protocol conformances synthesized in pre-Swift-6 modules may require `@preconcurrency` at the conformance site to suppress retroactive-conformance warnings.
- `any Protocol` and `some Protocol` are not interchangeable: `any` allows dynamic dispatch; `some` requires a single concrete type known at compile time.
