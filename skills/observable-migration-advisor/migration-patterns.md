# Migration Patterns (Before and After)

## 1) Model: `ObservableObject` -> `@Observable`

### Before

```swift
class UserSettings: ObservableObject {
    @Published var username: String = ""
    @Published var isLoggedIn: Bool = false

    var displayName: String {
        username.isEmpty ? "Anonymous" : username
    }
}
```

### After

```swift
import Observation

@Observable
class UserSettings {
    var username: String = ""
    var isLoggedIn: Bool = false

    var displayName: String {
        username.isEmpty ? "Anonymous" : username
    }
}
```

## 2) Ownership Wrapper: `@StateObject` -> `@State`

```swift
// Before
@StateObject private var settings = UserSettings()

// After
@State private var settings = UserSettings()
```

## 3) Consumer Wrapper: `@ObservedObject` -> `var` or `@Bindable`

```swift
// Read-only usage
struct HeaderView: View {
    var settings: UserSettings

    var body: some View {
        Text(settings.username)
    }
}
```

```swift
// Binding usage
struct EditorView: View {
    @Bindable var settings: UserSettings

    var body: some View {
        TextField("Username", text: $settings.username)
    }
}
```

## 4) Environment: `@EnvironmentObject` -> `@Environment`

```swift
// Injection
ContentView()
    .environment(settings)

// Usage
struct ProfileView: View {
    @Environment(UserSettings.self) var settings

    var body: some View {
        Text(settings.username)
    }
}
```

For bindings with environment-injected observables:

```swift
struct ProfileEditorView: View {
    @Environment(UserSettings.self) var settings

    var body: some View {
        @Bindable var settings = settings
        TextField("Username", text: $settings.username)
    }
}
```

## 5) Combine `$property` Observation Replacement

```swift
@Observable
class SearchViewModel {
    var query: String = ""
    var results: [String] = []
}

struct SearchView: View {
    @State private var viewModel = SearchViewModel()

    var body: some View {
        List(viewModel.results, id: \.self) { Text($0) }
            .searchable(text: $viewModel.query)
            .task(id: viewModel.query) {
                try? await Task.sleep(for: .milliseconds(300))
                guard !Task.isCancelled else { return }
                viewModel.results = await performSearch(viewModel.query)
            }
    }
}
```

## 6) Manual Observation Outside SwiftUI

```swift
func observe(settings: UserSettings) {
    withObservationTracking {
        _ = settings.username
    } onChange: {
        observe(settings: settings)
    }
}
```

## 7) @Published with willSet/didSet Side Effects

The simple `@Published var name = ""` case migrates trivially. The hard case is when a property drives side effects:

```swift
// Before — triggers async work on every change
class SearchViewModel: ObservableObject {
    @Published var query: String = "" {
        didSet { Task { await search(query) } }
    }
    @Published var results: [Result] = []
}
```

`@Observable` plain stored properties don't support Combine-style side effects. Three migration options, ranked by preference:

### Option 1 — Preferred: Move the reaction to the view with `task(id:)`

```swift
@Observable
class SearchViewModel {
    var query: String = ""
    var results: [Result] = []
}

struct SearchView: View {
    @State private var viewModel = SearchViewModel()

    var body: some View {
        List(viewModel.results) { ResultRow(result: $0) }
            .searchable(text: $viewModel.query)
            .task(id: viewModel.query) {
                // Debounce and cancel automatically on query change
                try? await Task.sleep(for: .milliseconds(300))
                guard !Task.isCancelled else { return }
                viewModel.results = await search(viewModel.query)
            }
    }
}
```

### Option 2 — Non-SwiftUI observer: `withObservationTracking` loop

```swift
@Observable
class SearchViewModel {
    var query: String = ""
    var results: [Result] = []

    func startObserving() {
        withObservationTracking {
            _ = self.query   // register tracking
        } onChange: { [weak self] in
            guard let self else { return }
            Task { await self.search(self.query) }
            self.startObserving()   // re-register for next change
        }
    }
}
```

### Option 3 — Last resort: Computed property with backing store

Only use when the side effect genuinely belongs in the model layer (e.g., persisting to disk immediately on change).

```swift
@Observable
class SettingsViewModel {
    private var _fontSize: Int = 14

    var fontSize: Int {
        get { _fontSize }
        set {
            _fontSize = newValue
            UserDefaults.standard.set(newValue, forKey: "fontSize")  // side effect
        }
    }
}
```

> This re-introduces the boilerplate `@Observable` was designed to eliminate. Prefer Options 1 or 2.
