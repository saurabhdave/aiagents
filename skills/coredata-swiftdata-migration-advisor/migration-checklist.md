# Migration Checklist and Common Mistakes

## When not to migrate yet

Stay on CoreData if one or more conditions are true:

- Minimum deployment target is below iOS 17 / macOS 14.
- Required CoreData capabilities are not available in SwiftData for your architecture.
- Existing CoreData stack is stable, well-tested, and migration has no business return.
- CloudKit behavior under SwiftData is not yet validated for your app's sync topology.
- Third-party dependencies require `NSManagedObject` subclasses.

## Common mistakes

```swift
// Wrong: CoreData-style init
let item = Item(context: modelContext)

// Right: Create model, then insert
let item = Item(title: "New")
modelContext.insert(item)
```

```swift
// Wrong: NSPredicate format strings in SwiftData query
@Query(filter: NSPredicate(format: "isComplete == NO"))
private var items: [Item]

// Right: #Predicate macro
@Query(filter: #Predicate<Item> { !$0.isComplete })
private var items: [Item]
```

```swift
// Wrong: NSSet relationship
@Model
class Item {
    var tags: NSSet?
}

// Right: Swift collection relationship
@Model
class Item {
    var tags: [Tag]

    init(tags: [Tag] = []) {
        self.tags = tags
    }
}
```

## Release readiness checklist

- [ ] Deployment target supports SwiftData (`iOS 17+` / `macOS 14+`).
- [ ] Every CoreData entity has a validated `@Model` counterpart.
- [ ] All model relationships use Swift collections/types (no `NSSet`).
- [ ] Every `@Model` type provides explicit initializers.
- [ ] `NSPredicate` usage replaced with `#Predicate` where applicable.
- [ ] `NSSortDescriptor` usage replaced with `SortDescriptor`.
- [ ] `@FetchRequest` usage replaced with `@Query` where applicable.
- [ ] `NSManagedObjectContext` operations replaced with `ModelContext` operations.
- [ ] `VersionedSchema` and `SchemaMigrationPlan` defined for persisted schema changes.
- [ ] One-time backfill migration tested against production-like data volume.
- [ ] CloudKit sync behavior validated if sync is enabled.
- [ ] Rollback plan documented and tested.
- [ ] `.xcdatamodeld` artifacts removed only after full cutover validation.
