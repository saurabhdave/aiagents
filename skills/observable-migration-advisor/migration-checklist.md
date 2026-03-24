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

## Testing @Observable Models

`@Observable` requires different test strategies — `objectWillChange` does not exist and cannot be used.

### Unit testing model state (synchronous)

Plain mutation and assertion — no `expectation` or sink needed for synchronous state changes:

```swift
func testUsernameUpdate() {
    let settings = UserSettings()
    settings.username = "alice"
    XCTAssertEqual(settings.username, "alice")
    XCTAssertEqual(settings.displayName, "alice")
}
```

### Asserting observation tracking fires

Use `withObservationTracking` to verify that mutating a property triggers the `onChange` callback:

```swift
func testObservationFires() {
    let model = UserSettings()
    var changeCount = 0

    withObservationTracking {
        _ = model.username   // register tracking
    } onChange: {
        changeCount += 1
    }

    model.username = "bob"
    XCTAssertEqual(changeCount, 1)
}
```

### Testing UIKit view controllers bound via withObservationTracking

```swift
func testViewControllerUpdatesOnModelChange() {
    let model = UserSettings()
    let vc = ProfileViewController(settings: model)
    vc.loadViewIfNeeded()
    vc.startObserving()   // sets up withObservationTracking loop

    model.username = "carol"
    RunLoop.main.run(until: Date(timeIntervalSinceNow: 0.01))  // drain one run loop cycle

    XCTAssertEqual(vc.nameLabel.text, "carol")
}
```

### What not to do

```swift
// Wrong: @Observable has no objectWillChange — this will not compile
model.objectWillChange.sink { _ in ... }

// Wrong: @ObservedObject test pattern — inapplicable to @Observable
XCTAssertNotNil(model.objectWillChange)
```

---

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
