# Migration Checklist and Common Mistakes

## When not to migrate yet

Stay on `ObservableObject` if one or more conditions are true:

- Minimum deployment target is below `iOS 17` / `macOS 14`.
- Significant Combine pipelines rely on `@Published` projections and are not worth replacing yet.
- Existing code is stable and migration has no measurable performance or maintenance return.
- You must support platform versions without Observation support for key product surfaces.

## Common mistakes

```swift
// Wrong: @Published inside @Observable
@Observable
class Settings {
    @Published var name: String = ""
}

// Right
@Observable
class Settings {
    var name: String = ""
}
```

```swift
// Wrong: @ObservedObject for @Observable type
struct MyView: View {
    @ObservedObject var settings: Settings
}

// Right: plain var or @Bindable
struct MyView: View {
    @Bindable var settings: Settings
}
```

```swift
// Wrong: @StateObject for @Observable type
@StateObject private var settings = Settings()

// Right
@State private var settings = Settings()
```

```swift
// Wrong
ContentView().environmentObject(settings)

// Right
ContentView().environment(settings)
```

## Release readiness checklist

- [ ] Deployment target supports Observation (`iOS 17+` / `macOS 14+`).
- [ ] `ObservableObject` conformance replaced with `@Observable` where intended.
- [ ] `@Published` wrappers removed from migrated models.
- [ ] `@StateObject` replaced with `@State` for owned observable instances.
- [ ] `@ObservedObject` replaced with plain `var` or `@Bindable`.
- [ ] `@EnvironmentObject` replaced with `@Environment(Type.self)`.
- [ ] `.environmentObject(...)` replaced with `.environment(...)`.
- [ ] `objectWillChange.send()` removed from migrated models.
- [ ] `@Bindable` added only where `$` bindings are needed.
- [ ] Combine `$property` subscriptions replaced or intentionally retained.
- [ ] `@ObservationIgnored` added for non-UI state that should not trigger updates.
