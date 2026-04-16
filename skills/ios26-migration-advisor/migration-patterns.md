# iOS 26+ Migration Patterns

Before/after Swift code examples for the five core iOS 26 migration scenarios.

---

## 1. Custom Card Background → Liquid Glass (SwiftUI)

**Before (pre-iOS 26)**

```swift
struct ContentCard: View {
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}
```

**After (iOS 26+)**

```swift
struct ContentCard: View {
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .glassEffect(in: RoundedRectangle(cornerRadius: 16))
    }
}
```

**Notes:** Pass the shape to `glassEffect(in:)` to apply clipping and glass material together. Remove the manual `.clipShape` — the glass effect handles it.

---

## 2. TabView with Floating Bar (SwiftUI)

**Before (pre-iOS 26)**

```swift
@State private var selectedTab = 0

var body: some View {
    TabView(selection: $selectedTab) {
        HomeView()
            .tabItem {
                Label("Home", systemImage: "house")
            }
            .tag(0)

        SearchView()
            .tabItem {
                Label("Search", systemImage: "magnifyingglass")
            }
            .tag(1)

        ProfileView()
            .tabItem {
                Label("Profile", systemImage: "person")
            }
            .tag(2)
    }
}
```

**After (iOS 26+)**

```swift
enum AppTab: Hashable {
    case home, search, profile
}

@State private var selectedTab: AppTab = .home

var body: some View {
    TabView(selection: $selectedTab) {
        Tab("Home", systemImage: "house", value: AppTab.home) {
            HomeView()
        }
        Tab("Search", systemImage: "magnifyingglass", value: AppTab.search, role: .search) {
            SearchView()
        }
        Tab("Profile", systemImage: "person", value: AppTab.profile) {
            ProfileView()
        }
    }
}
```

**Notes:** Replace `Int` tags with a typed `Hashable` enum. Use `Tab(role: .search)` for the search tab — the system positions it appropriately in the floating bar. Remove `.tag()` modifiers.

---

## 3. #available Wrapper for Dual-Target Glass

**Before (pre-iOS 26 — no glass available)**

```swift
extension View {
    func cardBackground() -> some View {
        self
            .padding()
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}
```

**After (dual-target: iOS 17–26)**

```swift
struct AdaptiveGlassModifier: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 26, *) {
            content
                .padding()
                .glassEffect(in: RoundedRectangle(cornerRadius: 16))
        } else {
            content
                .padding()
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }
}

extension View {
    func cardBackground() -> some View {
        modifier(AdaptiveGlassModifier())
    }
}
```

**Notes:** Centralizing `#available` in a `ViewModifier` means every call site uses `cardBackground()` unchanged. When the deployment target raises to iOS 26, delete the `else` branch and flatten the modifier.

---

## 4. UIKit Toolbar with Glass Effect

**Before (pre-iOS 26)**

```swift
private func configureNavigationBar() {
    let appearance = UINavigationBarAppearance()
    appearance.configureWithOpaqueBackground()
    appearance.backgroundColor = .systemBackground

    navigationController?.navigationBar.standardAppearance = appearance
    navigationController?.navigationBar.scrollEdgeAppearance = appearance
    navigationController?.navigationBar.compactAppearance = appearance
}
```

**After (iOS 26+)**

```swift
private func configureNavigationBar() {
    if #available(iOS 26, *) {
        let appearance = UINavigationBarAppearance()
        appearance.configureWithDefaultBackground()
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
    } else {
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = .systemBackground
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
        navigationController?.navigationBar.compactAppearance = appearance
    }
}
```

**Notes:** `configureWithDefaultBackground()` on iOS 26 automatically applies the glass material. If you previously used `configureWithTransparentBackground()` to achieve a blurred bar, `configureWithDefaultBackground()` achieves the same look via the glass system.

---

## 5. Remove NavigationView and Adopt NavigationStack

**Before (removed in iOS 26)**

```swift
struct RootView: View {
    var body: some View {
        NavigationView {
            List(items) { item in
                NavigationLink(destination: DetailView(item: item)) {
                    ItemRow(item: item)
                }
            }
            .navigationTitle("Items")
        }
    }
}
```

**After (iOS 16+ / required for iOS 26)**

```swift
struct RootView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List(items) { item in
                NavigationLink(value: item) {
                    ItemRow(item: item)
                }
            }
            .navigationTitle("Items")
            .navigationDestination(for: Item.self) { item in
                DetailView(item: item)
            }
        }
    }
}
```

**Notes:** `NavigationView` is a compile error in iOS 26. `NavigationStack` + value-based `NavigationLink` + `.navigationDestination(for:destination:)` is the correct replacement. The `path` binding enables programmatic navigation (deep links, back-stack manipulation).
