# Production Migration Strategy

## 1) Versioned schema migration

Use `VersionedSchema` and `SchemaMigrationPlan` when changing persisted models across app releases.

```swift
import SwiftData

enum ItemSchemaV1: VersionedSchema {
    static var versionIdentifier = Schema.Version(1, 0, 0)
    static var models: [any PersistentModel.Type] { [Item.self] }

    @Model
    class Item {
        var title: String
        var timestamp: Date

        init(title: String, timestamp: Date) {
            self.title = title
            self.timestamp = timestamp
        }
    }
}

enum ItemSchemaV2: VersionedSchema {
    static var versionIdentifier = Schema.Version(2, 0, 0)
    static var models: [any PersistentModel.Type] { [Item.self] }

    @Model
    class Item {
        var title: String
        var timestamp: Date
        var isComplete: Bool

        init(title: String, timestamp: Date, isComplete: Bool = false) {
            self.title = title
            self.timestamp = timestamp
            self.isComplete = isComplete
        }
    }
}

enum ItemMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] {
        [ItemSchemaV1.self, ItemSchemaV2.self]
    }

    static var stages: [MigrationStage] {
        [MigrationStage.lightweight(fromVersion: ItemSchemaV1.self, toVersion: ItemSchemaV2.self)]
    }
}
```

For transformations that cannot be lightweight, use `.custom` and mutate in `willMigrate` / `didMigrate`.

## 2) Coexistence rollout for production apps

1. Add SwiftData models next to existing CoreData entities.
2. Migrate one feature/screen at a time to SwiftData APIs.
3. Perform one-time backfill for remaining legacy records.
4. Remove CoreData stack after parity checks and rollout stability.

## 3) Shared store approach (optional)

CoreData and SwiftData can point to the same SQLite file during staged rollout.

```swift
let url = URL.applicationSupportDirectory.appending(path: "MyApp.store")

let description = NSPersistentStoreDescription()
description.url = url

let coreData = NSPersistentContainer(name: "MyApp")
coreData.persistentStoreDescriptions = [description]

let swiftDataConfig = ModelConfiguration(url: url)
let swiftData = try ModelContainer(for: Item.self, configurations: swiftDataConfig)
```

## 4) One-time data backfill

```swift
func migrateData(from coreDataContext: NSManagedObjectContext, to modelContext: ModelContext) throws {
    let request: NSFetchRequest<CDItem> = CDItem.fetchRequest()
    let coreDataItems = try coreDataContext.fetch(request)

    for old in coreDataItems {
        let item = Item(
            title: old.title ?? "",
            timestamp: old.timestamp ?? .now,
            isComplete: old.isComplete
        )
        modelContext.insert(item)
    }

    try modelContext.save()
}
```

## 5) Rollback design

- Keep CoreData read compatibility until SwiftData-only rollout is stable.
- Add migration progress and failure telemetry.
- Gate destructive cleanup (dropping old model artifacts) behind release milestones.
- Require integrity checks on record counts and key business invariants before cutover.
