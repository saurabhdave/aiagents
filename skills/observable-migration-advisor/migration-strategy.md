# Production Migration Strategy

## 1) Readiness Gate

Proceed only if the migrated surface can require:

- `iOS 17+`
- `macOS 14+`

If the app must support older OS versions broadly, keep `ObservableObject` in those paths.

## 2) Coexistence Strategy

`ObservableObject` and `@Observable` can coexist during migration.

```swift
class LegacySettings: ObservableObject {
    @Published var fontSize: Int = 14
}

@Observable
class ModernSettings {
    var theme: Theme = .system
}

struct ContentView: View {
    @StateObject private var legacy = LegacySettings()
    @State private var modern = ModernSettings()

    var body: some View {
        ChildView(legacy: legacy, modern: modern)
    }
}
```

## 3) Incremental Migration Order

1. Migrate low-dependency models first.
2. Update all consuming views for each migrated model.
3. Replace environment injection (`.environmentObject` -> `.environment`).
4. Remove manual notification calls and obsolete wrappers.
5. Replace Combine `$property` pipelines where no longer needed.

## 4) Combine Transition Options

- Keep Combine where it still provides value; avoid forced rewrites.
- For query-driven view work, prefer `task(id:)` and async workflows.
- For non-view observers, use `withObservationTracking` or bridge to `AsyncStream`.

## 5) Rollout and Rollback

- Gate each migrated feature behind integration tests.
- Track rendering regressions and state propagation issues in telemetry.
- Maintain the ability to revert a feature boundary to legacy observation until stable.
