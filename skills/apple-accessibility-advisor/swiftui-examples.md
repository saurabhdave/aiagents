# SwiftUI Accessibility Examples

This document collects concrete SwiftUI snippets demonstrating key accessibility patterns from the
`accessibility-patterns.md` guidance. Since that file now contains a broader
set of examples alongside its architectural patterns, the two should be
consulted together. These samples remain suitable for copying into
production projects and can be used as reference material for audits or
training.

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
    .foregroundColor(Color(UIColor.systemRed))
```

Add redundancy for color-only indicators:

```swift
Image(systemName: "circle.fill")
    .foregroundColor(.green)
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

## 9. Audit Tips

- Preview with the Accessibility Inspector in Xcode.
- Run VoiceOver on device to catch unexpected behavior.
- Add unit tests using `XCTest` and `accessibilityLabel` checks where possible.

---

These examples are meant to be copied into your own SwiftUI components or used as teaching
aids. Combine them with the patterns in `accessibility-patterns.md` and the WCAG guidelines to
create fully accessible applications.
