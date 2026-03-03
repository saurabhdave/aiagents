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

## Immediate Red Flags

- App must continue supporting iOS 16 or lower.
- Existing CoreData behavior relies on unsupported SwiftData features.
- CloudKit sync constraints are unverified for current release scope.
- Third-party dependencies require `NSManagedObject` types directly.
