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
