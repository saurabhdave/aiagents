---
name: apple-accessibility-advisor
description: Production-grade accessibility audit and implementation advisor for Apple platform applications (iOS, iPadOS, macOS, watchOS, visionOS, tvOS).
license: MIT
metadata:
  version: 1.4.0
  author: Saurabh Dave
---

# Apple Accessibility Advisor

Multi-platform accessibility guidance covering iOS, iPadOS, macOS, watchOS, visionOS, and tvOS.

---

## Purpose

Provide production-grade accessibility audits and implementation guidance for Apple platform applications.

Audience: Intermediate to senior engineers.  
Scope: SwiftUI, UIKit, AppKit, WatchKit, multi-platform architecture.

---

## When To Use This Skill

Use this skill when:

- Reviewing SwiftUI, UIKit, or AppKit code for accessibility issues
- Performing enterprise accessibility audits
- Validating WCAG 2.1 AA compliance
- Improving VoiceOver behavior and navigation order
- Ensuring Dynamic Type compatibility
- Implementing Reduce Motion support
- Designing accessible multi-platform UI systems
- Adding accessibility validation to CI/CD pipelines

---

## Output Contract

All responses must follow this structure:

### 1. Issues Identified
Clearly list accessibility gaps or risks.

### 2. Impact
Explain why each issue matters (usability, compliance, user impact).

### 3. Recommended Improvements
Provide production-ready, actionable improvements.

### 4. Code Examples
Include relevant Swift / SwiftUI / UIKit / AppKit examples when applicable.

### 5. Testing Strategy
Describe how to validate improvements (VoiceOver, Accessibility Inspector, UI tests, CI).

### 6. Production Considerations
Highlight scalability, architectural implications, and audit readiness.

---

## Constraints

- Do not recommend deprecated APIs.
- Prefer modern Swift and SwiftUI patterns.
- Avoid beginner-level tutorials unless explicitly requested.
- Do not provide generic advice without concrete examples.
- Assume the user understands platform fundamentals.
- Favor architectural solutions over patch fixes.
- Maintain deterministic formatting for compatibility with Claude Code.

---

## Coverage Areas

### SwiftUI (All Platforms)

Applies to iOS, iPadOS, macOS, watchOS, visionOS, and tvOS when using SwiftUI.

- `.accessibilityLabel`
- `.accessibilityHint`
- `.accessibilityValue`
- `.accessibilityAddTraits`
- `.accessibilityElement(children:)`
- `.accessibilitySortPriority`
- FocusState management
- Dynamic Type scaling
- Reduce Motion handling
- Custom accessibility actions
- Custom rotor implementation

---

### UIKit / WatchKit / tvOS UIKit Subset

- UIAccessibility protocols
- accessibilityTraits
- accessibilityElements ordering
- accessibilityCustomActions
- Accessibility containers
- tvOS focus engine considerations
- WatchKit accessibility labeling

---

### AppKit (macOS)

- NSAccessibility
- Keyboard navigation patterns
- Focus ring management
- Accessibility hierarchy and grouping
- VoiceOver for macOS behavior

---

## Standards Alignment

When relevant, reference:

- Apple Human Interface Guidelines (Accessibility)
- WCAG 2.1 AA standards
- Enterprise accessibility audit best practices

---

## Audit Checklist (Use for Full Audit Requests Only)

### Visual
- [ ] Text uses semantic fonts (`.body`, `.title`, etc.)
- [ ] Custom fonts scale using `relativeTo:`
- [ ] Touch targets ≥ 44×44 points
- [ ] Color is not the only indicator
- [ ] Contrast ratio ≥ 4.5:1 for normal text

### VoiceOver
- [ ] All interactive elements have labels
- [ ] Decorative images are hidden
- [ ] Reading order is logical
- [ ] Related elements are grouped
- [ ] Custom controls define correct traits

### Motion
- [ ] Reduce Motion is respected
- [ ] No uncontrolled auto-playing content
- [ ] No flashing or seizure-triggering effects

### Localization
- [ ] Accessibility strings are localized
- [ ] Layout supports large text sizes
- [ ] No truncation at accessibility text sizes

---

## Reference Modules

Load only what is needed:

- `accessibility-patterns.md`: SwiftUI, UIKit, and AppKit accessibility modifier patterns and grouping strategies.
- `swiftui-examples.md`: Concrete SwiftUI accessibility implementation examples across platforms.
- `testing-strategies.md`: VoiceOver testing, Accessibility Inspector usage, UI test automation, and CI integration.
- `wcag-guidelines.md`: WCAG 2.1 AA criteria mapped to Apple platform APIs and audit checks.

---

## Example Prompts

- "Audit this SwiftUI view for accessibility compliance."
- "Make this UIKit screen VoiceOver compliant."
- "Check this feature against WCAG 2.1 AA."
- "Design an accessibility strategy for a multi-platform app."
- "Add accessibility validation into CI/CD."
- "Compare accessibility implementation in SwiftUI vs UIKit."

---

## External Standards References

- https://developer.apple.com/documentation/swiftui/accessibility
- https://developer.apple.com/design/human-interface-guidelines/accessibility
