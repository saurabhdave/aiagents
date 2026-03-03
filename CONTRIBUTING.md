# Contributing to AI Agents Repository

Thank you for your interest in contributing! This project is designed to grow by
community involvement. Follow the guidelines below to ensure your contributions
are easy to review and maintain.

## Getting Started

1. **Fork** the repository and clone your fork locally.
2. Create a new branch named according to the feature or fix, for example
   `skill-add-performance-advisor` or `doc-update-readme`.
3. Make your changes in the appropriate subfolder:
   - New skills go under `skills/<skill-name>/` with a `SKILL.md` manifest.
   - Shared documentation can be added at the repo root or in `docs/` (if present).
   - Example code or Xcode projects should live inside the relevant skill folder
     under `examples/`.

## Writing a Skill

Each skill must include a `SKILL.md` file with metadata (name, description,
version, author, etc.) and clear usage instructions. See
`skills/apple-accessibility-advisor/SKILL.md` as a reference.

## Code & Documentation Standards

- Markdown files should be linted with [markdownlint](https://github.com/DavidAnson/markdownlint)
  or similar. Maintain consistent heading levels and fenced code blocks.
- Swift snippets should compile; if a sample project is included, ensure it builds
  with `xcodebuild` or `swift build`.
- Keep language clear and professional. Avoid overly wordy explanations.

## Testing & Validation

- If you add executable examples, include simple unit/UI tests where feasible.
- Update the CI workflow (in `.github/workflows/`) to run any new build steps or
  linting commands.
- Before submitting a pull request, run the existing CI tasks locally if possible
  (`npm install && npm run lint`, plus `swift build` / `swift test` for any added
  Swift packages or examples).

## Submitting Changes

1. Push your branch to your fork.
2. Open a pull request against the `main` branch of this repository.
3. Provide a descriptive title and explain the purpose of your changes.
4. Be responsive to review comments; the maintainers may ask for revisions.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating,
you are expected to uphold respectful and inclusive behavior.

---

Thanks for helping make this project better! Your contributions are **greatly appreciated**.
