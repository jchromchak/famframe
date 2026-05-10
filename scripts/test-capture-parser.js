const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const ts = require(path.join(repoRoot, "admin-react", "node_modules", "typescript"));
const sourcePath = path.join(repoRoot, "admin-react", "src", "capture.ts");
const outPath = path.join(os.tmpdir(), "famframe-capture-test.cjs");

const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
});

fs.writeFileSync(outPath, compiled.outputText);

delete require.cache[outPath];
const { parseCaptureAppends } = require(outPath);

const routines = [
  { id: "routine-school-morning", label: "School morning", enabled: true },
  { id: "routine-evening", label: "Evening wind-down", enabled: true },
  { id: "routine-soccer-practice", label: "Soccer practice", enabled: true },
];

const parsed = parseCaptureAppends(
  "Late start tomorrow. Need library books. Pack soccer gear. Need library books.",
  routines,
);

assert.deepEqual(
  parsed.map((append) => ({
    label: append.label,
    timing: append.timing,
    routineLabel: append.routineLabel,
    confidence: append.confidence,
  })),
  [
    {
      label: "Late start",
      timing: "Tomorrow",
      routineLabel: "School morning",
      confidence: "high",
    },
    {
      label: "Library books",
      timing: "Next routine",
      routineLabel: "School morning",
      confidence: "high",
    },
    {
      label: "Soccer gear",
      timing: "Next routine",
      routineLabel: "Soccer practice",
      confidence: "high",
    },
  ],
);

const unknown = parseCaptureAppends("Call dentist Friday", routines);
assert.equal(unknown[0].label, "Call dentist");
assert.equal(unknown[0].timing, "Friday");
assert.equal(unknown[0].routineLabel, "School morning");
assert.equal(unknown[0].confidence, "low");

console.log("Capture parser tests passed.");
