# ObservableObject to @Observable Concept Mapping

The `@Observable` macro (iOS 17 / macOS 14) replaces `ObservableObject` with Swift Observation.

## Mapping Table

| ObservableObject (Old) | @Observable (New) | Notes |
| --- | --- | --- |
| `class Model: ObservableObject` | `@Observable class Model` | Macro replaces protocol conformance |
| `@Published var name: String` | `var name: String` | Plain stored properties, no wrapper |
| `@StateObject private var model` | `@State private var model` | Use for owned instances |
| `@ObservedObject var model` | `var model: Model` or `@Bindable var model` | Use `@Bindable` only for bindings |
| `@EnvironmentObject var model` | `@Environment(Model.self) var model` | Or custom environment key |
| `objectWillChange.send()` | Automatic | Remove manual notifications |
| `model.$property` publishers | `task(id:)`, `AsyncStream`, `withObservationTracking` | No `$` projection from `@Observable` |
| `.environmentObject(model)` | `.environment(model)` | Direct environment injection |

## Behavior Differences

- SwiftUI re-renders only when a view reads a property that changed.
- Computed properties that read observed state trigger updates automatically.
- `@Observable` does not expose Combine `@Published` publishers.

## Wrapper Decision Guide

- View creates and owns object: `@State`
- View receives object and only reads: plain `var`
- View receives object and needs `$` bindings: `@Bindable`
- Environment injection: `.environment(model)` and `@Environment(Model.self)`

## Excluding Non-UI State

```swift
@Observable
class ViewModel {
    var visibleTitle: String = ""

    @ObservationIgnored
    var internalCache: [String: Data] = [:]
}
```
