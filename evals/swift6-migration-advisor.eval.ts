/**
 * Eval: swift6-migration-advisor
 *
 * For each test case:
 *   1. Generate a skill response (Claude + full skill context as system prompt)
 *   2. Judge the response against the Output Contract (Claude-as-judge, adaptive thinking)
 *   3. Emit a score report and save evals/reports/swift6-<timestamp>.json
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npm run eval:swift6
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic();

// ---------------------------------------------------------------------------
// Skill content loader
// ---------------------------------------------------------------------------

const SKILL_DIR = path.resolve(
  process.cwd(),
  "skills",
  "swift6-migration-advisor",
);

function loadSkillContext(): string {
  const files = [
    "SKILL.md",
    "concept-mapping.md",
    "migration-patterns.md",
    "migration-strategy.md",
    "migration-checklist.md",
  ];
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(SKILL_DIR, f), "utf-8");
      return `### ${f}\n\n${raw}`;
    })
    .join("\n\n---\n\n");
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

interface TestCase {
  id: string;
  prompt: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: "tc1-actor-isolation",
    prompt: [
      "Enable Swift 6 language mode in my app target and fix all strict",
      "concurrency errors in this view model:\n",
      "```swift",
      "class ProfileViewModel: ObservableObject {",
      '    @Published var username: String = ""',
      "",
      "    func load() {",
      "        Task {",
      "            let name = await fetchUsername()",
      "            DispatchQueue.main.async { self.username = name }",
      "        }",
      "    }",
      "",
      "    func fetchUsername() async -> String { return \"Alice\" }",
      "}",
      "```",
    ].join("\n"),
  },
  {
    id: "tc2-sendable-audit",
    prompt: [
      "Audit this class for Sendable compliance and propose the minimal safe",
      "conformance. It is passed across Task boundaries in several places:\n",
      "```swift",
      "class UserCache {",
      "    var storage: [String: Data] = [:]",
      "    func value(for key: String) -> Data? { storage[key] }",
      "    func store(_ data: Data, for key: String) { storage[key] = data }",
      "}",
      "```",
    ].join("\n"),
  },
  {
    id: "tc3-phased-migration-plan",
    prompt: [
      "Plan a phased Swift 6 adoption for a modular iOS app that has three",
      "SPM packages in dependency order: Networking → Domain → AppFeature.",
      "We currently support iOS 16+ and are on Xcode 16.",
    ].join("\n"),
  },
  {
    id: "tc4-global-state",
    prompt: [
      "Migrate all global mutable state in this module to actor-isolated",
      "or constant equivalents:\n",
      "```swift",
      'var currentEnvironment: String = "production"',
      "var requestCount: Int = 0",
      "var featureFlags: [String: Bool] = [:]",
      "```",
    ].join("\n"),
  },
  {
    id: "tc5-typed-throws",
    prompt: [
      "Add typed throws to this error-handling layer and update all call sites:\n",
      "```swift",
      "enum ParseError: Error {",
      "    case invalidJSON",
      "    case missingField(String)",
      "}",
      "",
      "func parse(_ data: Data) throws -> Model {",
      "    guard let raw = try? JSONDecoder().decode(Raw.self, from: data) else {",
      "        throw ParseError.invalidJSON",
      "    }",
      '    guard let name = raw.name else { throw ParseError.missingField("name") }',
      "    return Model(name: name)",
      "}",
      "",
      "func loadAndParse(_ url: URL) throws -> Model {",
      "    let data = try Data(contentsOf: url)",
      "    return try parse(data)",
      "}",
      "```",
    ].join("\n"),
  },
];

// ---------------------------------------------------------------------------
// Output Contract rubric (used as the judge system prompt)
// ---------------------------------------------------------------------------

const JUDGE_SYSTEM_PROMPT = `
You are an expert Swift 6 engineer evaluating responses from a Swift 6 Migration Advisor.

The advisor's Output Contract mandates ALL SIX sections in this order:
  1. Migration Readiness — toolchain/Swift version requirements, deployment-target constraints, go/no-go assessment.
  2. Concurrency and Language Mapping — explicit mapping from Swift 5.x patterns to Swift 6 equivalents.
  3. Migration Strategy — phased plan using SWIFT_STRICT_CONCURRENCY levels (minimal/targeted/complete) and/or Swift 6 mode enablement.
  4. Code Examples — production-grade, compilable Swift 6 code directly addressing the request.
  5. Validation Plan — concrete build-phase and test checks to verify the migration.
  6. Production Considerations — performance tradeoffs, architecture impact, rollback strategy.

Evaluate the response on FIVE dimensions (0–2 each, max 10):

  • completeness    — All 6 sections present and substantive (not just headings).
  • accuracy        — Swift 6 content is technically correct: valid actor isolation, Sendable rules, no deprecated patterns (no budget_tokens, no @preconcurrency as permanent fix), correct any/some usage.
  • code_quality    — Code examples are production-grade and compilable Swift 6; directly address the user's specific code.
  • actionability   — Guidance is concrete and step-by-step; a developer can act on it immediately.
  • contract_adherence — Follows the Output Contract structure precisely; sections appear in the mandated order.

Return ONLY valid JSON — no prose before or after:
{
  "scores": {
    "completeness": <0-2>,
    "accuracy": <0-2>,
    "code_quality": <0-2>,
    "actionability": <0-2>,
    "contract_adherence": <0-2>
  },
  "total": <0-10>,
  "missing_sections": ["<section name>", ...],
  "issues": ["<specific technical or structural problem>", ...],
  "strengths": ["<notable strength>", ...]
}
`.trim();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EvalScores {
  completeness: number;
  accuracy: number;
  code_quality: number;
  actionability: number;
  contract_adherence: number;
}

interface EvalResult {
  scores: EvalScores;
  total: number;
  missing_sections: string[];
  issues: string[];
  strengths: string[];
}

interface TestResult {
  id: string;
  prompt: string;
  response: string;
  eval: EvalResult;
  response_tokens: number;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

async function generateResponse(
  prompt: string,
  skillContext: string,
): Promise<{ text: string; output_tokens: number }> {
  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: `You are a Swift 6 Migration Advisor. Use the skill documentation below to produce responses that strictly follow the Output Contract.\n\n${skillContext}`,
    messages: [{ role: "user", content: prompt }],
  });

  process.stdout.write("    [generating");
  stream.on("text", () => process.stdout.write("."));

  const final = await stream.finalMessage();
  process.stdout.write("]\n");

  const textBlock = final.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  );
  return {
    text: textBlock?.text ?? "",
    output_tokens: final.usage.output_tokens,
  };
}

// ---------------------------------------------------------------------------
// Evaluation (judge)
// ---------------------------------------------------------------------------

async function evaluateResponse(
  prompt: string,
  response: string,
): Promise<EvalResult> {
  const judgeResponse = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: JUDGE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `## User Prompt\n${prompt}\n\n## Advisor Response\n${response}`,
      },
    ],
  });

  const textBlock = judgeResponse.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  );
  const raw = textBlock?.text ?? "{}";

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Judge returned no JSON.\nRaw response:\n${raw}`);
  }

  return JSON.parse(jsonMatch[0]) as EvalResult;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function run() {
  console.log("Loading skill context...");
  const skillContext = loadSkillContext();
  console.log(`Loaded ${skillContext.length.toLocaleString()} chars of skill content.\n`);

  const results: TestResult[] = [];

  for (const tc of TEST_CASES) {
    console.log(`[${tc.id}]`);

    process.stdout.write("  Generating response... ");
    const { text: response, output_tokens } = await generateResponse(
      tc.prompt,
      skillContext,
    );

    process.stdout.write("  Judging response...    ");
    const evalResult = await evaluateResponse(tc.prompt, response);

    results.push({ id: tc.id, prompt: tc.prompt, response, eval: evalResult, response_tokens: output_tokens });

    const s = evalResult.scores;
    console.log(
      `  Score: ${evalResult.total}/10  ` +
        `(complete:${s.completeness} accuracy:${s.accuracy} ` +
        `code:${s.code_quality} action:${s.actionability} contract:${s.contract_adherence})`,
    );
    if (evalResult.missing_sections.length > 0) {
      console.log(`  Missing: ${evalResult.missing_sections.join(", ")}`);
    }
    if (evalResult.issues.length > 0) {
      console.log(`  Issues:\n${evalResult.issues.map((i) => `    - ${i}`).join("\n")}`);
    }
    console.log();
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  const scores = results.map((r) => r.eval.total);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  console.log("=".repeat(60));
  console.log("EVAL SUMMARY — swift6-migration-advisor");
  console.log("=".repeat(60));
  console.log(`Cases:    ${results.length}`);
  console.log(`Average:  ${avg.toFixed(1)}/10`);
  console.log(`Range:    ${min}–${max}/10`);
  console.log();

  // Per-dimension averages
  const dims: (keyof EvalScores)[] = [
    "completeness",
    "accuracy",
    "code_quality",
    "actionability",
    "contract_adherence",
  ];
  for (const dim of dims) {
    const dimAvg =
      results.reduce((sum, r) => sum + r.eval.scores[dim], 0) / results.length;
    const bar = "█".repeat(Math.round(dimAvg * 5)) + "░".repeat(10 - Math.round(dimAvg * 5));
    console.log(`  ${dim.padEnd(20)} ${bar}  ${dimAvg.toFixed(1)}/2`);
  }
  console.log();

  // Improvement suggestions (aggregate unique issues)
  const allIssues = results.flatMap((r) => r.eval.issues);
  if (allIssues.length > 0) {
    console.log("Common issues to address:");
    [...new Set(allIssues)].slice(0, 5).forEach((i) => console.log(`  - ${i}`));
    console.log();
  }

  // ---------------------------------------------------------------------------
  // Save report
  // ---------------------------------------------------------------------------

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportPath = path.join(
    process.cwd(),
    "evals",
    "reports",
    `swift6-${timestamp}.json`,
  );

  const report = {
    skill: "swift6-migration-advisor",
    ran_at: new Date().toISOString(),
    summary: { cases: results.length, avg_score: avg, min_score: min, max_score: max },
    dimension_averages: Object.fromEntries(
      dims.map((d) => [
        d,
        results.reduce((sum, r) => sum + r.eval.scores[d], 0) / results.length,
      ]),
    ),
    results,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report saved: ${reportPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
