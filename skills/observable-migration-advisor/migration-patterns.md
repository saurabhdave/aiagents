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
