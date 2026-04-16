# iOS 26+ Migration Strategy

A phased adoption plan for migrating existing apps to iOS 26 patterns, with coexistence
guidance for dual-target apps and a decision matrix for choosing the right migration approach.

---

## Phase 1: Audit and Wrap

**Goal:** No production code changes yet. Establish baseline and `#available` boundaries.

### 1.1 Audit deprecated APIs

Run the following shell audit to identify files that need attention:

```bash
# Find NavigationView usage (compile error in iOS 26 — must fix)
grep -rn "NavigationView" --include="*.swift" .

# Find tabItem usage (soft-deprecated in iOS 26)
grep -rn "\.tabItem" --include="*.swift" .

# Find custom material backgrounds (candidates for glass)
grep -rn "\.ultraThinMaterial\|\.thinMaterial\|\.regularMaterial\|\.thickMaterial" --include="*.swift" .

# Find UIBlurEffect usage (UIKit candidates for UIGlassEffect)
grep -rn "UIBlurEffect" --include="*.swift" .

# Find old UINavigationBarAppearance with opaque/transparent background
grep -rn "configureWithOpaqueBackground\|configureWithTransparentBackground" --include="*.swift" .
```

### 1.2 Capture snapshot test baseline

Before changing any visual code, capture snapshot baselines for all screens that will
change. If you use a snapshot library (e.g., swift-snapshot-testing):

```swift
func testHomeViewBaseline() {
    let view = HomeView()
    assertSnapshot(of: UIHostingController(rootView: view), as: .image(on: .iPhone13))
}
```

### 1.3 Fix NavigationView (required — compile error in iOS 26)

`NavigationView` removal is **blocking** — it must be done before the app can build on
iOS 26. Complete this in Phase 1 even if other glass adoption is deferred.

Replace all `NavigationView` with `NavigationStack` or `NavigationSplitView` as shown in
Pattern 5 in `migration-patterns.md`.

---

## Phase 2: Adopt iOS 26 APIs Behind `#available`

**Goal:** New iOS 26 design and navigation is live on iOS 26 devices; older OS gets existing behavior.

### 2.1 Wrap all glass and TabView changes in `#available`

Use the `AdaptiveGlassModifier` pattern from Pattern 3 in `migration-patterns.md` as the
template for every surface. Do not apply `.glassEffect()` unconditionally.

### 2.2 Adopt `Tab` type for TabView

```swift
var body: some View {
    if #available(iOS 26, *) {
        TabView(selection: $selectedTab) {
            Tab("Home", systemImage: "house", value: AppTab.home) {
                HomeView()
            }
            Tab("Search", systemImage: "magnifyingglass", value: AppTab.search, role: .search) {
                SearchView()
            }
        }
    } else {
        TabView(selection: $legacyTab) {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }
                .tag(0)
            SearchView()
                .tabItem { Label("Search", systemImage: "magnifyingglass") }
                .tag(1)
        }
    }
}
```

### 2.3 Update UIKit bars

Apply `configureWithDefaultBackground()` on iOS 26 and keep the existing opaque appearance
on older OS as shown in Pattern 4 in `migration-patterns.md`.

### 2.4 Review contrast and accessibility

After adopting `.glassEffect()`, run the Accessibility Inspector on every screen that now
uses glass. Verify WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
against the glass surface. Add `.shadow(radius:)` or increase font weight if contrast
is insufficient.

---

## Phase 3: Clean Up (After Deployment Target Raises to iOS 26)

**Goal:** Remove all `#available(iOS 26, *)` branches and dead legacy code.

### 3.1 Remove `#available` guards

Once the minimum deployment target is iOS 26, every `#available(iOS 26, *)` check is
always-true. Find them all:

```bash
grep -rn "available(iOS 26" --include="*.swift" .
```

For each match, keep the `if #available` branch body and delete the `else` branch and
the availability check wrapper.

### 3.2 Remove legacy `tabItem` code

Delete the `else` branch of any `TabView` availability wrapper. If `tabItem` is used
anywhere outside an `#available` else branch, migrate it to `Tab` now.

### 3.3 Reset snapshot baselines

Re-capture snapshot baselines after all glass is applied and delete the Phase 1 baselines.

---

## Decision Matrix: Subclass vs Wrapper vs Full Replacement

| Scenario | Recommended Approach | Reason |
| --- | --- | --- |
| Custom `UIView` subclass drawing blur manually | Wrap in `UIViewRepresentable` + use `UIGlassEffect` | Avoid modifying low-level draw code; UIKit compositing handles glass |
| Existing SwiftUI `ViewModifier` that applies material | Update modifier with `#available` inside it | Centralizes the availability check; no call-site changes |
| Entire screen built with UIKit using opaque nav bar | Adopt `configureWithDefaultBackground()` in `#available` block | Minimal change; no structural refactor needed |
| Full-screen modal with custom blurred overlay | Replace `UIBlurEffect`-based overlay with `.glassEffect()` or `UIGlassEffect` | Structural replacement; old blur overlay is no longer the right pattern |
| TabView that already uses `NavigationStack` | Add `Tab` type in `#available(iOS 26, *)` block | Non-breaking; existing `tabItem` code remains in else branch |
| App still using `NavigationView` | Full replacement with `NavigationStack` (no availability guard needed) | `NavigationView` is a compile error in iOS 26 |
