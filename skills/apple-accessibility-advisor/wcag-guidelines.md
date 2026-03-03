# WCAG Guidelines for Apple Platforms

While WCAG originated for web content, its success criteria are broadly applicable to
native applications. The following summary highlights key points to consider when
building Apple platforms software.

---

## 1. Perceivable

- **Text Alternatives (1.1.1)**: Provide accessibility labels for non‑text content such as
  icons or images. Use `accessibilityLabel` and `accessibilityHint`.
- **Adaptable (1.3.1)**: Ensure content is structured so that assistive technologies can
  interpret it. In SwiftUI, use `accessibilityElement(children:)` and grouping effectively.
- **Distinguishable (1.4.x)**: Maintain contrast ratios of at least 4.5:1 for normal text
  and 3:1 for large text. Avoid conveying information by color alone; combine with icons or
  text.

### Mobile-specific
- **Orientation (1.3.4)**: Support both portrait and landscape unless a rotation is
  essential.
- **Resize Text (1.4.4)**: Respect Dynamic Type and never clip or truncate at larger size
  categories.
- **Motion**: Provide options to reduce non-essential motion and avoid animation-triggered
  discomfort (see **2.2.2 Pause, Stop, Hide** and **2.3.3 Animation from Interactions**).

---

## 2. Operable

- **Keyboard Accessible (2.1.1)**: On macOS ensure all interactive elements are reachable
  using the keyboard (Tab, Enter, Space). For iOS, ensure VoiceOver gesture equivalents
  exist for custom interactions.
- **Enough Time (2.2.1)**: Allow users to extend time limits or disable auto‑advancing
  screens when supported.
- **Seizures (2.3.1)**: Avoid content that flashes more than three times per second.
- **Navigable (2.4.x)**: Provide clear navigation order, landmarks, and focus indicators.

---

## 3. Understandable

- **Readable (3.1.1)**: Use clear language and supply localized strings for all user‑visible
  text, including accessibility labels.
- **Predictable (3.2.x)**: UI components should behave consistently; avoid unexpected changes
  in context when activated.
- **Input Assistance (3.3.x)**: Offer help when form fields are invalid, through hints or
  alerts that are accessible to VoiceOver.

---

## 4. Robust

- **Compatible (4.1.2)**: Follow platform APIs correctly so that assistive technologies can
  parse UI elements. For example, avoid layering views that obscure accessibility elements.
- **Name, Role, Value (4.1.2)**: Ensure every element has an appropriate label (name), a role
  (button, header, switch), and current value if applicable.

---

## Mapping to Apple APIs
- Use `accessibilityLabel`, `accessibilityValue`, `accessibilityHint`, `accessibilityTraits`.
- Declaring `accessibilityElements` or using SwiftUI modifiers like
  `.accessibilityElement(children:)` helps satisfy structural criteria.
- Leverage `UIAccessibility` notifications (e.g. `announcement`) to communicate dynamic changes.

---

Keeping WCAG success criteria in mind during design and development helps make your
application accessible to the broadest audience, including users with visual, motor,
or cognitive disabilities.
