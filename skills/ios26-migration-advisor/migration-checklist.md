# iOS 26+ Migration Checklist

---

## Pre-Migration Assessment

- [ ] Xcode 26 or later is installed and the project builds cleanly on it.
- [ ] Current minimum deployment target is confirmed (determines how much `#available` guarding is needed).
- [ ] `NavigationView` usage is fully inventoried (must be replaced — compile error in iOS 26).
- [ ] All `tabItem` usage is inventoried (soft-deprecated; plan `Tab` type migration).
- [ ] All custom material backgrounds (`ultraThinMaterial`, `thinMaterial`, etc.) are inventoried.
- [ ] All `UIBlurEffect` and `UIVisualEffectView` usage is inventoried.
- [ ] Snapshot test baselines captured for all screens that will change visually.
- [ ] Accessibility audit baseline recorded (contrast ratios, VoiceOver labels).

---

## Phase 1 Gate (Audit Complete, NavigationView Fixed)

- [ ] Zero `NavigationView` references remain (app builds on iOS 26 simulator).
- [ ] All `NavigationView` replaced with `NavigationStack` or `NavigationSplitView`.
- [ ] Programmatic navigation updated to value-based `NavigationLink` + `.navigationDestination`.
- [ ] Snapshot baselines committed to the repo.

---

## Phase 2 Gate (iOS 26 APIs Adopted)

- [ ] All glass surfaces wrapped in `#available(iOS 26, *)` or a shared `ViewModifier`.
- [ ] `GlassEffectContainer` used wherever two or more sibling views each apply `.glassEffect()`.
- [ ] No bare `.glassEffect()` calls outside a container when siblings also use glass.
- [ ] TabView updated to `Tab` type (in `#available` block for dual-target apps).
- [ ] UIKit navigation/tab bar appearances updated with `configureWithDefaultBackground()`.
- [ ] App builds and runs cleanly on iOS 26 simulator **and** on the oldest supported OS simulator.
- [ ] Accessibility audit passed: WCAG AA contrast ratios met on all glass surfaces.
- [ ] Dark Mode visual review complete — glass tinting correct in both appearances.
- [ ] Snapshot tests updated to include iOS 26 appearance; old baselines not deleted yet.

---

## Release Gate

- [ ] Tested on a physical iOS 26 device (not just simulator) — glass rendering and animations verified.
- [ ] Tested on a device running the oldest supported iOS version — no regressions.
- [ ] All `#available(iOS 26, *)` branches verified to compile in both the `if` and `else` paths.
- [ ] No `UIBlurEffect`-based views remain on screens where glass is intended.
- [ ] App passes App Store accessibility review standards (no contrast failures in Xcode's audit).
- [ ] Performance profiling run on the oldest supported device — glass rendering frame rate acceptable.

---

## Phase 3 Gate (Deployment Target Raised to iOS 26)

- [ ] Minimum deployment target set to iOS 26 in Xcode project settings.
- [ ] All `#available(iOS 26, *)` guards removed (grep confirms none remain).
- [ ] All `tabItem` legacy branches removed; only `Tab` type used.
- [ ] Old snapshot baselines (pre-glass) removed; new baselines committed.
- [ ] App builds cleanly with zero availability-related warnings.

---

## Common Mistakes

### Mistake 1: Applying .glassEffect() without GlassEffectContainer on sibling views

**Wrong — causes visual artifacts**

```swift
HStack {
    Image(systemName: "heart")
        .padding()
        .glassEffect()
    Text("Favorites")
        .padding()
        .glassEffect()
}
```

**Correct — container composites glass as one surface**

```swift
GlassEffectContainer {
    HStack {
        Image(systemName: "heart")
            .padding()
            .glassEffect()
        Text("Favorites")
            .padding()
            .glassEffect()
    }
}
```

---

### Mistake 2: Using NavigationView in iOS 26 code

**Wrong — compile error in iOS 26**

```swift
NavigationView {
    ContentView()
}
```

**Correct**

```swift
NavigationStack {
    ContentView()
}
```

---

### Mistake 3: Forgetting contrast check after adopting glass

**Wrong — .secondary on glass may fail WCAG AA contrast**

```swift
Text("Important label")
    .foregroundStyle(.secondary)
    .padding()
    .glassEffect()
```

**Correct — use .primary or verify contrast; adjust if needed**

```swift
Text("Important label")
    .foregroundStyle(.primary)
    .padding()
    .glassEffect()
```

---

### Mistake 4: Calling configureWithTransparentBackground() expecting glass look

**Wrong — transparent background is not the glass material**

```swift
appearance.configureWithTransparentBackground()
```

**Correct — default background applies the glass material on iOS 26**

```swift
if #available(iOS 26, *) {
    appearance.configureWithDefaultBackground()
} else {
    appearance.configureWithTransparentBackground()
}
```

---

### Mistake 5: Using Tab type without #available for dual-target apps

**Wrong — compile error on iOS 17 deployment target**

```swift
Tab("Home", systemImage: "house", value: AppTab.home) {
    HomeView()
}
```

**Correct — guard with #available for dual-target apps**

```swift
if #available(iOS 26, *) {
    Tab("Home", systemImage: "house", value: AppTab.home) {
        HomeView()
    }
} else {
    HomeView()
        .tabItem { Label("Home", systemImage: "house") }
        .tag(0)
}
```
