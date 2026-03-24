# SwiftUI Accessibility Examples

Production-ready SwiftUI component patterns for direct use in apps or audits.

**Scope**: This file covers component-level accessibility implementations by UI type.
For architectural patterns (grouping strategies, motion, color system, custom rotors), see `accessibility-patterns.md`.
For WCAG criterion mappings, see `wcag-guidelines.md`.

---

## 1. Labels & Hints

Ensure every interactive control has a clear `accessibilityLabel` and, when needed, a hint.

```swift
Button(action: deleteItem) {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete item")
.accessibilityHint("Removes this item permanently")
```

For compound controls, combine children first then apply a label:

```swift
HStack {
    Text("Volume")
    Slider(value: $volume)
}
.accessibilityElement(children: .combine)
.accessibilityLabel("Volume")
```

---

## 2. Focus & Reading Order

Use `accessibilityElement(children:)` or explicit arrays to control VoiceOver order.

```swift
VStack {
    header
    content
    footer
}
.accessibilityElement(children: .contain) // keeps natural order
```

On more complex views, manually specify:

```swift
var body: some View {
    VStack {
        TitleView()
        BodyView()
        FooterView()
    }
    .accessibilityElement(children: .ignore)
    .accessibilityAddTraits(.isHeader)
    .accessibilitySortPriority(1) // custom sorting if needed
}
```

---

## 3. Dynamic Type & Scalable Text

Always use `.font(_:)` with `TextStyle` and allow scaling operations.

```swift
Text("Profile")
    .font(.title)
    .minimumScaleFactor(0.8) // avoids truncation at large sizes
```

UIKit interoperability example in SwiftUI:

```swift
let label = UILabel()
label.adjustsFontForContentSizeCategory = true
label.font = .preferredFont(forTextStyle: .body)
```

---

## 4. Color & Contrast

Although color is usually defined in asset catalogs, verify with code:

```swift
Text("Warning")
    .foregroundStyle(.red)
```

Add redundancy for color-only indicators:

```swift
Image(systemName: "circle.fill")
    .foregroundStyle(.green)
    .accessibilityLabel("Success")
```

---

## 5. Reduce Motion

Respect the `accessibilityReduceMotion` environment value.

```swift
struct AnimatedView: View {
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @State private var showDetails = false

    var body: some View {
        Button("Show") {
            if reduceMotion {
                showDetails = true
            } else {
                withAnimation {
                    showDetails = true
                }
            }
        }
        if showDetails {
            Text("Details here")
        }
    }
}
```

---

## 6. Custom Accessibility Actions

Add custom actions to controls to expose app-specific operations.

```swift
Button(action: markFavorite) {
    Image(systemName: "star")
}
.accessibilityAction(named: "Mark as Favorite") {
    markFavorite()
}
```

Use `accessibilityCustomActions` when integrating with UIKit views via `UIViewRepresentable`.

---

## 7. Accessibility Grouping & Containers

```swift
VStack {
    Text("Name")
    TextField("Enter name", text: $name)
}
.accessibilityElement(children: .combine)
```

Group related controls so VoiceOver reads them as a single logical unit.

---

## 8. Examples in Context

A production-ready profile row:

```swift
struct ProfileRow: View {
    let user: User

    var body: some View {
        HStack {
            Image(uiImage: user.avatar)
                .resizable()
                .frame(width: 44, height: 44)
                .clipShape(Circle())

            VStack(alignment: .leading) {
                Text(user.name)
                    .font(.headline)
                Text(user.role)
                    .font(.subheadline)
            }
            Spacer()
        }
        .padding()
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(user.name), \(user.role)")
        .accessibilityHint("Tap for details")
    }
}
```

---

## 9. List Row with Disclosure Action

Combine label, subtitle, and trailing chevron into a single VoiceOver element with an explicit action.

```swift
struct ArticleRow: View {
    let article: Article

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(article.title).font(.headline)
                Text(article.summary).font(.subheadline).foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName: "chevron.right").foregroundStyle(.tertiary)
        }
        .padding()
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(article.title)
        .accessibilityValue(article.summary)
        .accessibilityHint("Double tap to read full article")
        .accessibilityAddTraits(.isButton)
    }
}
```

---

## 10. Toggle with Announced Status

Go beyond the default toggle trait by including a meaningful `.accessibilityValue`.

```swift
struct NotificationToggle: View {
    @Binding var isEnabled: Bool

    var body: some View {
        Toggle(isOn: $isEnabled) {
            Text("Push Notifications")
        }
        .accessibilityValue(isEnabled ? "Enabled" : "Disabled")
        .accessibilityHint("Toggles push notification delivery")
    }
}
```

---

## 11. Tab with Dynamic Badge Count

Announce badge counts so VoiceOver users know about unread items without visual inspection.

```swift
struct InboxTab: View {
    let unreadCount: Int

    var body: some View {
        Label("Inbox", systemImage: "tray")
            .accessibilityLabel(
                unreadCount > 0
                    ? "Inbox, \(unreadCount) unread messages"
                    : "Inbox"
            )
    }
}
```

---

## 12. Audit Tips

- Preview with the Accessibility Inspector in Xcode.
- Run VoiceOver on device to catch unexpected behavior.
- Use `XCUIElement.performAccessibilityAudit()` (Xcode 15+) in UI tests to catch issues automatically.
