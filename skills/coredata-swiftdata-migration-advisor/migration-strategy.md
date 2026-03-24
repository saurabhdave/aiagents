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

## 4) Custom MigrationStage

For transformations that cannot be handled lightweight (e.g., splitting a field), use `.custom` with `willMigrate` / `didMigrate`.

```swift
// V2 → V3: split fullName into firstName + lastName
enum ItemSchemaV3: VersionedSchema {
    static var versionIdentifier = Schema.Version(3, 0, 0)
    static var models: [any PersistentModel.Type] { [Item.self] }

    @Model
    class Item {
        var firstName: String
        var lastName: String
        var timestamp: Date

        init(firstName: String, lastName: String, timestamp: Date) {
            self.firstName = firstName
            self.lastName = lastName
            self.timestamp = timestamp
        }
    }
}

enum ItemMigrationPlanV3: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] {
        [ItemSchemaV1.self, ItemSchemaV2.self, ItemSchemaV3.self]
    }

    static var stages: [MigrationStage] {
        [
            MigrationStage.lightweight(
                fromVersion: ItemSchemaV1.self,
                toVersion: ItemSchemaV2.self
            ),
            MigrationStage.custom(
                fromVersion: ItemSchemaV2.self,
                toVersion: ItemSchemaV3.self,
                willMigrate: nil,   // schema-only prep — usually nil
                didMigrate: { context in
                    let items = try context.fetch(FetchDescriptor<ItemSchemaV3.Item>())
                    for item in items {
                        // At this point the V3 schema is live; populate new fields
                        // from any auxiliary source (e.g., a temp staging table)
                        let parts = item.firstName.split(separator: " ", maxSplits: 1)
                        item.firstName = String(parts.first ?? "")
                        item.lastName = parts.count > 1 ? String(parts[1]) : ""
                    }
                    try context.save()
                }
            )
        ]
    }
}
```

## 5) One-time data backfill (batched)

Process large datasets in chunks to avoid exhausting memory and to produce smaller, safer transactions.

```swift
func migrateData(
    from coreDataContext: NSManagedObjectContext,
    to modelContext: ModelContext,
    batchSize: Int = 500
) throws -> Int {
    let countRequest: NSFetchRequest<CDItem> = CDItem.fetchRequest()
    let total = try coreDataContext.count(for: countRequest)
    var migrated = 0

    while migrated < total {
        let request: NSFetchRequest<CDItem> = CDItem.fetchRequest()
        request.fetchLimit = batchSize
        request.fetchOffset = migrated
        request.sortDescriptors = [NSSortDescriptor(keyPath: \CDItem.timestamp, ascending: true)]

        let batch = try coreDataContext.fetch(request)
        for old in batch {
            let item = Item(
                title: old.title ?? "",
                timestamp: old.timestamp ?? .now,
                isComplete: old.isComplete
            )
            modelContext.insert(item)
        }

        try modelContext.save()
        migrated += batch.count
    }

    return migrated
}
```

## 6) Rollback design

- Keep CoreData read compatibility until SwiftData-only rollout is stable.
- Add migration progress and failure telemetry.
- Gate destructive cleanup (dropping old model artifacts) behind release milestones.
- Require integrity checks on record counts and key business invariants before cutover.

## 7) CloudKit Considerations

CloudKit integration changes significantly between CoreData and SwiftData.

### Container setup

```swift
// CoreData
let container = NSPersistentCloudKitContainer(name: "MyApp")

// SwiftData
let config = ModelConfiguration(cloudKitDatabase: .automatic)
let container = try ModelContainer(for: Item.self, configurations: config)
```

### Schema requirements for CloudKit

All `@Model` properties used with CloudKit must be optional or have default values. CloudKit cannot store non-optional attributes that have no server-side default.

```swift
// Wrong: non-optional with no default — will fail CloudKit schema initialization
@Model class Item {
    var title: String  // ❌

    init(title: String) { self.title = title }
}

// Right: optional or defaulted
@Model class Item {
    var title: String = ""  // ✅
    var notes: String?       // ✅

    init(title: String = "") { self.title = title }
}
```

### Migration window protocol

1. **Disable CloudKit sync** during the CoreData-to-SwiftData migration window to avoid sync conflicts between the two stacks writing to the same CloudKit schema.
2. After SwiftData cutover and local validation, **re-enable sync** and allow SwiftData to push the new schema to CloudKit automatically on first launch.
3. `NSPersistentCloudKitContainer.initializeCloudKitSchema()` has no SwiftData equivalent — schema initialization is automatic, but the first sync after migration will push a full record set.
4. SwiftData supports only the **private CloudKit database** as of iOS 17/18. Shared database (`NSPersistentCloudKitContainer` shared zone) is not yet available.
