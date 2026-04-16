---
name: ios26-migration-advisor
description: Production-grade migration advisor for adopting iOS 26+ patterns in existing apps. Use when migrating to the Liquid Glass design system (.glassEffect(), GlassEffectContainer, UIGlassEffect), updating TabView and navigation to the floating bar redesign, replacing deprecated SwiftUI/UIKit APIs with iOS 26 equivalents, or planning phased rollout across apps that must support both iOS 26 and older deployment targets.
license: MIT
metadata:
  version: 1.0.0
  author: Saurabh Dave
---

# iOS 26+ Migration Advisor

Migration guidance for iOS and iPadOS teams adopting the iOS 26 Liquid Glass design system,
redesigned navigation and tab bar, and updated SwiftUI and UIKit APIs.

---

## Purpose

Deliver safe, incremental, production-ready migration plans for iOS 26+ adoption: Liquid
Glass design system integration, floating TabView redesign, navigation API updates, and
SwiftUI/UIKit API modernization. Covers both iOS-26-minimum apps and dual-target apps
that must preserve backward compatibility with older OS versions.

Audience: Intermediate to senior Apple platform engineers.
Scope: Liquid Glass materials and `.glassEffect()` adoption, `GlassEffectContainer` usage,
`UIGlassEffect` for UIKit, floating TabView with the new `Tab` type, `TabSection` grouping,
`NavigationView` removal, toolbar glass behavior, dual-target `#available` bridge patterns,
and deprecated API replacement.

---

## Output Contract

All responses must follow this structure:

### 1. Migration Readiness

State Xcode version requirements, minimum deployment target constraints, whether iOS 26 APIs
can be adopted unconditionally or require `#available(iOS 26, *)` guards, and scope
classification (SwiftUI-only, UIKit-only, or hybrid).

### 2. Concept & API Mapping

Map pre-iOS-26 patterns to iOS 26 equivalents — materials and background APIs, TabView and
`Tab` type, navigation APIs, UIKit glass APIs — with both SwiftUI and UIKit columns where
applicable.

### 3. Migration Strategy

Propose a phased adoption plan: Phase 1 (audit and `#available` wrap), Phase 2 (adopt new
APIs in guarded branches, coexistence patterns), Phase 3 (remove legacy branches once minimum
deployment target raises to iOS 26). Include decision matrix for subclass vs wrapper vs full
replacement.

### 4. Code Examples

Provide production-grade Swift examples for the exact migration requested: Liquid Glass
adoption, floating TabView, navigation updates, UIKit glass interop, and `#available`
dual-target wrappers.

### 5. Validation Plan

Describe build-phase, snapshot test, accessibility audit, and release checks to verify visual
correctness, layout regression safety, and backward compatibility on all supported OS versions.

### 6. Production Considerations

Highlight Dynamic Type and VoiceOver impact of glass materials, Dark Mode and tinting behavior,
glass rendering performance on older supported hardware, and rollback strategy.

---

## Constraints

- Do not apply `.glassEffect()` or `UIGlassEffect` without ensuring sufficient contrast for
  text and interactive elements — glass materials are semi-transparent.
- Always use `GlassEffectContainer` when multiple sibling views each apply `.glassEffect()`;
  omitting it causes visual artifacts.
- Do not remove `tabItem` patterns without verifying the app still builds and runs on the
  oldest supported iOS version.
- Treat `#available(iOS 26, *)` branches as the migration state; remove them only after the
  deployment target officially raises to iOS 26.
- Prefer `Tab(value:role:)` with `TabSection` over bare `tabItem` for new code targeting
  iOS 26+.
- Do not use `NavigationView` in any new code — it is removed in iOS 26.
- Avoid generic guidance without concrete, compilable Swift examples.
- Favor incremental, screen-by-screen or component-by-component adoption over big-bang
  visual redesigns.

---

## Coverage Areas

### Liquid Glass Design System

Adopting `.glassEffect()` in SwiftUI, using `GlassEffectContainer` for sibling glass
views, applying `.background(.glass)` shorthand, replacing custom `UIBlurEffect`-based
views with `UIGlassEffect` and `UIVisualEffectView` in UIKit, and handling glass tinting
and vibrancy.

### TabView Floating Bar

Migrating from `tabItem` to the new `Tab` type, using `TabSection` for grouped tabs,
customizing tab bar appearance and badge display, coexistence patterns for dual-target
apps, and adapting to the floating bar layout on iPhone and sidebar on iPad.

### Navigation Redesign

Completing the removal of `NavigationView` (hard-deprecated in iOS 26), adopting
`NavigationStack` and `NavigationSplitView` correctly, updating `.toolbar` and
`.navigationBarTitleDisplayMode` usage for iOS 26 toolbar glass behavior, and bridging
`NavigationLink` destination patterns.

### UIKit Glass Interop

Replacing `UIVisualEffectView(effect: UIBlurEffect(style:))` with
`UIVisualEffectView(effect: UIGlassEffect())`, updating `UINavigationBar` and `UITabBar`
appearance APIs deprecated in iOS 26, and wrapping UIKit glass views in SwiftUI via
`UIViewRepresentable` or `UIViewControllerRepresentable`.

### Dual-Target Coexistence

Writing `#available(iOS 26, *)` guards for all new APIs, abstracting glass behavior behind
`ViewModifier` wrappers to centralize availability checks, and providing fallback
`.ultraThinMaterial` or custom backgrounds for older OS versions.

---

## Reference Modules

Load only what is needed:

- `concept-mapping.md`: Pre-iOS-26 → iOS 26 API mapping tables for materials, TabView,
  navigation, and UIKit glass.
- `migration-patterns.md`: Before/after Swift code examples for the five core migration
  scenarios.
- `migration-strategy.md`: Phased adoption plan, decision matrix, and coexistence
  guidance for dual-target apps.
- `migration-checklist.md`: Pre-migration audit, per-phase gates, release checklist, and
  common mistakes with corrections.

---

## Example Prompts

- "Migrate my custom card views to use Liquid Glass and make them backward compatible
  with iOS 17."
- "Convert my TabView from tabItem to the new iOS 26 Tab type with sections."
- "Remove NavigationView from my app and replace it with NavigationStack correctly."
- "Update my UIKit navigation bar to use UIGlassEffect on iOS 26 while keeping the old
  appearance on iOS 17-25."
- "Plan a phased iOS 26 design system rollout for a production app targeting iOS 17+."
- "My glass backgrounds are making text hard to read -- fix the contrast and accessibility."
