# iOS 26+ Concept & API Mapping

Maps pre-iOS-26 patterns to their iOS 26 equivalents across Liquid Glass materials,
TabView, navigation, and UIKit glass APIs.

---

## Liquid Glass: SwiftUI Materials & Backgrounds

| Pre-iOS 26 (Old) | iOS 26 (New) | Notes |
| --- | --- | --- |
| `.background(.ultraThinMaterial)` | `.glassEffect()` | `.glassEffect()` is the canonical glass surface; wrap siblings in `GlassEffectContainer` |
| `.background(.thinMaterial)` | `.glassEffect(.regular)` | Explicit tint level; default `glassEffect()` is equivalent to `.regular` |
| `.background(.regularMaterial)` | `.background(.glass)` | `.glass` shorthand works on `background`; use when `glassEffect()` is not appropriate |
| `ZStack` with `RoundedRectangle().fill(.ultraThinMaterial)` | `GlassEffectContainer { ... }` | Container handles corner radii and compositing automatically |
| `UIVisualEffectView(effect: UIBlurEffect(style: .systemUltraThinMaterial))` | `UIVisualEffectView(effect: UIGlassEffect())` | `UIGlassEffect` is the UIKit equivalent; blending is handled by the system |
| `UIVisualEffectView(effect: UIBlurEffect(style: .dark))` | `UIVisualEffectView(effect: UIGlassEffect())` with dark appearance | Tint and appearance driven by trait collection in iOS 26; no explicit dark/light style needed |
| Custom `CALayer` blur | `UIGlassEffect` + `UIVisualEffectView` | Avoid private `CAFilter` blur; use supported APIs only |
| `.background(Color.white.opacity(0.2))` | `.glassEffect()` | Opacity-hack backgrounds should be replaced; glass handles vibrancy correctly |

---

## TabView: Floating Bar & Tab Type

| Pre-iOS 26 (Old) | iOS 26 (New) | Notes |
| --- | --- | --- |
| `.tabItem { Label("Home", systemImage: "house") }` | `Tab("Home", systemImage: "house") { HomeView() }` | `Tab` type is the preferred API in iOS 26; `tabItem` still compiles but is soft-deprecated |
| `TabView(selection: $tab)` with `tag()` | `TabView(selection: $tab)` with `Tab(value:)` | `Tab(value:role:)` replaces `tag()` for selection binding |
| Flat list of `tabItem` views | `Tab` views, optionally grouped with `TabSection` | `TabSection` enables visual grouping and sidebar sections on iPad |
| `.tabViewStyle(.page)` | `.tabViewStyle(.page)` (unchanged) | Page style is unchanged; floating bar is the new default for standard tabs |
| Manual `UITabBarAppearance` customization | `.tabBarMinimizeBehavior` + appearance APIs | New behavior modifiers control floating bar minimize/expand |
| Custom badge via `.badge(count)` | `.badge(count)` (unchanged) | Badge API is unchanged; behavior on floating bar is automatic |
| `TabView` without role | `Tab(role: .search)` for search tab | Designated roles enable system behavior (e.g., search tab placement) |

---

## Navigation: Stack, Splits, and Toolbar

| Pre-iOS 26 (Old) | iOS 26 (New) | Notes |
| --- | --- | --- |
| `NavigationView { ... }` | `NavigationStack { ... }` or `NavigationSplitView` | `NavigationView` is removed in iOS 26; this is a hard compile error |
| `NavigationView` with two-column layout | `NavigationSplitView(sidebar:detail:)` | Two- and three-column layouts require `NavigationSplitView` |
| `.navigationBarTitle("Title", displayMode: .large)` | `.navigationTitle("Title")` + `.navigationBarTitleDisplayMode(.large)` | API unchanged; toolbar glass applied automatically in iOS 26 |
| `NavigationLink(destination:label:)` | `NavigationLink(value:label:)` + `.navigationDestination(for:destination:)` | Programmatic navigation preferred; destination-based links remain supported |
| `ToolbarItem(placement: .navigationBarLeading)` | `ToolbarItem(placement: .topBarLeading)` | `.navigationBarLeading`/`Trailing` renamed to `.topBarLeading`/`Trailing` in iOS 16+; use new names |
| `.toolbar` items with manual background | `.toolbar` items with automatic glass | Toolbar background is glass by default in iOS 26; remove manual `.toolbarBackground` overrides unless customizing |
| `.navigationBarHidden(true)` | `.toolbar(.hidden, for: .navigationBar)` | Preferred API for hiding nav bar; behavior consistent with glass toolbar |

---

## UIKit Glass: Bars and Visual Effects

| Pre-iOS 26 (Old) | iOS 26 (New) | Notes |
| --- | --- | --- |
| `UINavigationBarAppearance()` with `configureWithTransparentBackground()` | `UINavigationBarAppearance()` with `configureWithDefaultBackground()` | iOS 26 default is glass; transparent background no longer needed for modern look |
| `UITabBarAppearance()` with custom `backgroundEffect` | `UITabBarAppearance()` with `configureWithDefaultBackground()` | Tab bar glass is automatic; custom `backgroundEffect` overrides the system glass |
| `navigationBar.standardAppearance = opaqueAppearance` | `navigationBar.standardAppearance = defaultAppearance` | Opaque appearance overrides glass; use default to opt in |
| `UIBlurEffect(style: .systemMaterial)` | `UIGlassEffect()` | For surfaces that should look like iOS 26 glass, prefer `UIGlassEffect` |
| `UIBlurEffect(style: .prominent)` | `UIBlurEffect(style: .prominent)` (still valid) | `UIBlurEffect` is not deprecated; use when glass look is not desired |
| `UIVibrancyEffect(blurEffect:style:)` with blur | `UIVibrancyEffect(blurEffect: UIGlassEffect(), style:)` | Vibrancy can be layered on `UIGlassEffect` the same way as `UIBlurEffect` |
