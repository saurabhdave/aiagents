# CoreData to SwiftData Concept Mapping

SwiftData is a Swift-native persistence framework powered by the `@Model` macro.

Minimum deployment targets for full adoption:
- iOS 17+
- macOS 14+

## Mapping Table

| CoreData | SwiftData | Notes |
| --- | --- | --- |
| `NSManagedObject` subclass | `@Model` class | No codegen, no `.xcdatamodeld` required |
| `NSPersistentContainer` | `ModelContainer` | Configure in code or with `.modelContainer(...)` |
| `NSManagedObjectContext` | `ModelContext` | Access from `@Environment(\\.modelContext)` in SwiftUI |
| `NSFetchRequest` | `FetchDescriptor` | Uses Swift predicates and sort descriptors |
| `@FetchRequest` | `@Query` | Returns `[Model]`, not `FetchedResults` |
| `NSPredicate` | `#Predicate` | Type-safe and compile-time checked |
| `NSSortDescriptor` | `SortDescriptor` | Swift key-path based sorting |
| `.xcdatamodeld` schema | In-code schema | Persisted schema is defined by `@Model` types |
| Lightweight migration | `VersionedSchema` + `SchemaMigrationPlan` | Migration stages are explicit |

## Migration Heuristics

- Prefer direct model conversion first (`NSManagedObject` -> `@Model`), then query conversion, then UI bindings.
- Keep data migrations explicit: define versioned schemas and migration stages before release.
- Treat predicate migration as semantic migration, not syntax-only replacement.
- Validate feature gaps early (abstract entities, fetched properties, advanced multi-store setups).

## CoreData Features With No SwiftData Equivalent (iOS 17/18)

These are migration blockers. Identify them before committing to full adoption.

| CoreData Feature | SwiftData Status | Migration Path |
| --- | --- | --- |
| `NSFetchedResultsController` | No equivalent | Use `@Query` in SwiftUI views; for non-SwiftUI use `withObservationTracking` or an `AsyncStream` driven from `ModelContext` |
| `NSBatchInsertRequest` | No equivalent | Loop insert in chunks; call `modelContext.save()` after each batch (e.g., 500 records) to bound memory |
| `NSBatchDeleteRequest` | No equivalent | Fetch matching object IDs, delete in a loop with periodic `save()` |
| Abstract entities | Not supported | Flatten hierarchy or use Swift protocols with separate `@Model` concrete types |
| Fetched properties | Not supported | Replace with computed properties or explicit `FetchDescriptor` calls at point of use |
| Transformable attributes | Limited — no custom `ValueTransformer` | Make the attribute type `Codable`; for external binary storage use `@Attribute(.externalStorage)` |
| `NSMergePolicy` | Not exposed | SwiftData handles conflicts internally; last-write-wins semantics apply |
| `NSPersistentHistoryTracking` | Not supported | No history token / change tracking equivalent as of iOS 17/18 |

## Immediate Red Flags

- App must continue supporting iOS 16 or lower.
- Existing CoreData behavior relies on unsupported SwiftData features (see table above).
- CloudKit sync constraints are unverified for current release scope.
- Third-party dependencies require `NSManagedObject` types directly.
