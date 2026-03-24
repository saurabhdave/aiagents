# Swift 6 Migration Patterns

Common before/after examples for the most frequent Swift 5.x → Swift 6 migration scenarios.

---

## 1. Enabling Strict Concurrency Per Target (SPM)

**Before (Swift 5.x)**

```swift
// Package.swift
.target(
    name: "MyFeature",
    dependencies: [...]
)
```

**After (Swift 6)**

```swift
// Package.swift — step 1: targeted warnings
.target(
    name: "MyFeature",
    dependencies: [...],
    swiftSettings: [
        .swiftLanguageVersion(.v5),
        .enableExperimentalFeature("StrictConcurrency")
    ]
)

// Package.swift — step 2: Swift 6 language mode
.target(
    name: "MyFeature",
    dependencies: [...],
    swiftSettings: [
        .swiftLanguageVersion(.v6)
    ]
)
```

---

## 2. Main-Thread View Model

**Before (Swift 5.x)**

```swift
class ProfileViewModel: ObservableObject {
    @Published var username: String = ""

    func load() {
        Task {
            let name = await fetchUsername()
            DispatchQueue.main.async {
                self.username = name
            }
        }
    }
}
```

**After (Swift 6)**

```swift
@MainActor
@Observable
class ProfileViewModel {
    var username: String = ""

    func load() async {
        username = await fetchUsername()
    }
}
```

---

## 3. Actor-Isolated Service

**Before (Swift 5.x)**

```swift
class NetworkService {
    private let queue = DispatchQueue(label: "com.app.network")
    private var activeRequests: [UUID: URLSessionTask] = [:]

    func cancel(_ id: UUID) {
        queue.async { self.activeRequests[id]?.cancel() }
    }
}
```

**After (Swift 6)**

```swift
actor NetworkService {
    private var activeRequests: [UUID: URLSessionTask] = [:]

    func cancel(_ id: UUID) {
        activeRequests[id]?.cancel()
    }
}

// Call site
await networkService.cancel(id)
```

---

## 4. Sendable Class

**Before (Swift 5.x)**

```swift
class UserToken {
    let value: String
    init(_ value: String) { self.value = value }
}
// Passed across Task boundaries without compiler complaint
```

**After (Swift 6)**

```swift
// Option A: make immutable — implicit Sendable
final class UserToken: Sendable {
    let value: String
    init(_ value: String) { self.value = value }
}

// Option B: mutable with explicit lock — @unchecked Sendable
final class UserToken: @unchecked Sendable {
    private let lock = NSLock()
    private var _value: String
    var value: String {
        get { lock.withLock { _value } }
        set { lock.withLock { _value = newValue } }
    }
    init(_ value: String) { self._value = value }
}

// Option C: convert to struct for value semantics
struct UserToken: Sendable {
    let value: String
}
```

---

## 5. Global Mutable State

**Before (Swift 5.x)**

```swift
var currentEnvironment: Environment = .production
var sharedCache: [String: Data] = [:]
```

**After (Swift 6)**

```swift
// Option A: immutable constant
let currentEnvironment: Environment = .production

// Option B: actor-isolated
actor AppState {
    var sharedCache: [String: Data] = [:]
}
let appState = AppState()

// Option C: @MainActor isolation
@MainActor var sharedCache: [String: Data] = [:]

// Option D: nonisolated(unsafe) — bridge only, document why
nonisolated(unsafe) var legacyFlag: Bool = false
```

---

## 6. Completion Handler to async/await

**Before (Swift 5.x)**

```swift
func fetchUser(id: String, completion: @escaping (Result<User, Error>) -> Void) {
    URLSession.shared.dataTask(with: makeURL(id)) { data, _, error in
        if let error { completion(.failure(error)); return }
        completion(.success(decode(data!)))
    }.resume()
}
```

**After (Swift 6)**

```swift
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: makeURL(id))
    return try decode(data)
}

// Bridging legacy callback API
func fetchUserBridge(id: String) async throws -> User {
    try await withCheckedThrowingContinuation { continuation in
        fetchUser(id: id) { result in
            continuation.resume(with: result)
        }
    }
}
```

---

## 7. Sendable Closure

**Before (Swift 5.x)**

```swift
func scheduleWork(_ block: @escaping () -> Void) {
    DispatchQueue.global().async(execute: block)
}
```

**After (Swift 6)**

```swift
func scheduleWork(_ block: @escaping @Sendable () -> Void) {
    Task.detached { block() }
}
```

---

## 8. Existential `any`

**Before (Swift 5.x)**

```swift
protocol Renderer { func render() }

func display(_ renderer: Renderer) { renderer.render() }
var renderers: [Renderer] = []
```

**After (Swift 6)**

```swift
protocol Renderer { func render() }

func display(_ renderer: any Renderer) { renderer.render() }
var renderers: [any Renderer] = []

// Use `some` only for single-type opaque returns
func makeRenderer() -> some Renderer { ConcreteRenderer() }
```

---

## 9. Typed Throws

**Before (Swift 5.x)**

```swift
enum ParseError: Error { case invalidJSON, missingField(String) }

func parse(_ data: Data) throws -> Model {
    guard let json = try? JSONDecoder().decode(RawModel.self, from: data) else {
        throw ParseError.invalidJSON
    }
    guard let name = json.name else { throw ParseError.missingField("name") }
    return Model(name: name)
}
```

**After (Swift 6)**

```swift
func parse(_ data: Data) throws(ParseError) -> Model {
    guard let json = try? JSONDecoder().decode(RawModel.self, from: data) else {
        throw ParseError.invalidJSON
    }
    guard let name = json.name else { throw ParseError.missingField("name") }
    return Model(name: name)
}

// Call site — exhaustive catch without `as?` casting
do throws(ParseError) {
    let model = try parse(data)
} catch .invalidJSON {
    // ...
} catch .missingField(let key) {
    // ...
}
```

---

## 10. @preconcurrency Import for Legacy SDKs

**Before (Swift 5.x — no issue)**

```swift
import ThirdPartyAnalytics
let tracker: AnalyticsTracker = DefaultTracker()
```

**After (Swift 6 — suppressing retroactive Sendable warnings)**

```swift
@preconcurrency import ThirdPartyAnalytics
// Sendable violations from this module are downgraded to warnings
let tracker: AnalyticsTracker = DefaultTracker()
```

---

## 11. Noncopyable Resource Handle

**Before (Swift 5.x)**

```swift
class FileHandle {
    private let fd: Int32
    init(path: String) { fd = open(path, O_RDONLY) }
    deinit { close(fd) }
}
// Accidentally copied; multiple owners close the same fd
```

**After (Swift 6 with ~Copyable)**

```swift
struct FileHandle: ~Copyable {
    private let fd: Int32
    init(path: String) { fd = open(path, O_RDONLY) }
    deinit { close(fd) }
}
// Compiler prevents copies; ownership is explicit
let handle = FileHandle(path: "/tmp/data")
use(consume handle) // transfers ownership
```

---

## 12. UIKit Delegate with Actor Isolation

**Before (Swift 5.x)**

```swift
class MyViewController: UIViewController, UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        updateUI(for: indexPath)
    }
}
```

**After (Swift 6)**

```swift
// UIViewController is already @MainActor in Xcode 16 / Swift 6
// No annotation needed on the class; delegate methods inherit @MainActor
@MainActor
class MyViewController: UIViewController, UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        updateUI(for: indexPath)
    }
}
```
