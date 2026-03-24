# Migration Patterns (Before and After)

## 1) `NSManagedObject` -> `@Model`

### Before (CoreData)

```swift
class Item: NSManagedObject {
    @NSManaged var title: String
    @NSManaged var timestamp: Date
    @NSManaged var isComplete: Bool
    @NSManaged var tags: NSSet?
}
```

### After (SwiftData)

```swift
import SwiftData

@Model
class Item {
    var title: String
    var timestamp: Date
    var isComplete: Bool
    var tags: [Tag]

    init(
        title: String,
        timestamp: Date = .now,
        isComplete: Bool = false,
        tags: [Tag] = []
    ) {
        self.title = title
        self.timestamp = timestamp
        self.isComplete = isComplete
        self.tags = tags
    }
}
```

Notes:
- Replace `NSSet` relationships with Swift arrays.
- Remove `@NSManaged`; use stored properties.
- Always provide explicit initializers.

## 2) `NSPersistentContainer` -> `ModelContainer`

### SwiftUI setup (preferred)

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [Item.self, Tag.self])
    }
}
```

### Manual container setup

```swift
let container = try ModelContainer(
    for: Item.self, Tag.self,
    configurations: ModelConfiguration(isStoredInMemoryOnly: false)
)
```

## 3) `NSFetchRequest` -> `FetchDescriptor`

### Before (CoreData)

```swift
let request: NSFetchRequest<Item> = Item.fetchRequest()
request.predicate = NSPredicate(format: "isComplete == NO")
request.sortDescriptors = [NSSortDescriptor(keyPath: \Item.timestamp, ascending: false)]
let items = try viewContext.fetch(request)
```

### After (SwiftData)

```swift
var descriptor = FetchDescriptor<Item>(
    predicate: #Predicate<Item> { !$0.isComplete },
    sortBy: [SortDescriptor(\.timestamp, order: .reverse)]
)
descriptor.fetchLimit = 20
let items = try modelContext.fetch(descriptor)
```

## 4) `@FetchRequest` -> `@Query`

### Before (CoreData)

```swift
@FetchRequest(
    sortDescriptors: [NSSortDescriptor(keyPath: \Item.timestamp, ascending: false)],
    predicate: NSPredicate(format: "isComplete == NO")
)
private var items: FetchedResults<Item>
```

### After (SwiftData)

```swift
@Query(
    filter: #Predicate<Item> { !$0.isComplete },
    sort: \.timestamp,
    order: .reverse
)
private var items: [Item]
```

## 5) `NSManagedObjectContext` -> `ModelContext`

### Before (CoreData)

```swift
let item = Item(context: viewContext)
item.title = "New Item"
try viewContext.save()
```

### After (SwiftData)

```swift
let item = Item(title: "New Item")
modelContext.insert(item)
try modelContext.save()
```

## 6) Non-persisted fields and uniqueness

```swift
@Model
class Item {
    #Unique<Item>([\.title, \.timestamp])

    var title: String
    var timestamp: Date
    @Transient var isSelected: Bool = false

    init(title: String, timestamp: Date = .now) {
        self.title = title
        self.timestamp = timestamp
    }
}
```

## 7) Inverse Relationships

CoreData enforces inverses in the model editor. SwiftData requires an explicit `@Relationship` annotation with `.inverse` — omitting it causes orphaned records on deletion.

### Before (CoreData)

```swift
class Project: NSManagedObject {
    @NSManaged var tasks: NSSet?   // inverse defined in .xcdatamodeld
}

class Task: NSManagedObject {
    @NSManaged var project: Project?
}
```

### After (SwiftData)

```swift
@Model
class Project {
    var name: String
    // cascade deletes tasks when project is deleted; inverse declared here
    @Relationship(deleteRule: .cascade, inverse: \Task.project)
    var tasks: [Task] = []

    init(name: String) { self.name = name }
}

@Model
class Task {
    var title: String
    var project: Project?   // back-reference; SwiftData resolves the inverse

    init(title: String) { self.title = title }
}
```

## 8) Transformable / External Storage

CoreData `Transformable` attributes with custom `ValueTransformer` have no direct equivalent. Use `Codable` conformance instead. For large blobs that used `allowsExternalBinaryDataStorage`, use `@Attribute(.externalStorage)`.

### Before (CoreData)

```swift
class Profile: NSManagedObject {
    @NSManaged var avatar: UIImage?          // Transformable
    @NSManaged var rawData: Data?            // External binary storage
}
```

### After (SwiftData)

```swift
import SwiftData

// Make the type Codable for attribute storage
struct AvatarData: Codable {
    let pngData: Data
}

@Model
class Profile {
    var avatar: AvatarData?                  // Codable replaces Transformable

    @Attribute(.externalStorage)
    var rawData: Data?                       // stored outside the SQLite row

    init() {}
}
```

Note: `UIImage` itself is not `Codable`. Wrap it in a `Codable` struct that stores `Data` and converts on access, or persist the raw `Data` directly with `@Attribute(.externalStorage)`.
