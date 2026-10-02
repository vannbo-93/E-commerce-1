/** @format */

// يفحص أن كل import نسبي يطابق اسم الملف المحفوظ في git حرفيًا (بحالة الأحرف).
// التشغيل من جذر المشروع:  node ..\check-import-case.mjs

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs)$/;
const RESOLVE_EXT = [
  "",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  "/index.ts",
  "/index.tsx",
  "/index.js",
];

let tracked;
try {
  tracked = execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
} catch {
  console.error(
    "This folder is not a git repository. Run the script from the project root.",
  );
  process.exit(1);
}

const exact = new Set(tracked);
const lowerToReal = new Map(tracked.map((f) => [f.toLowerCase(), f]));
const resolveAlias = (spec) =>
  spec.startsWith("@/") ? "src/" + spec.slice(2) : null;

const IMPORT_RE =
  /(?:import\s[^'"]*?from\s*|import\s*\(\s*|import\s+|export\s[^'"]*?from\s*)['"]([^'"]+)['"]/g;

const problems = [];
let checked = 0;

for (const file of tracked) {
  if (!SOURCE_EXT.test(file) || file.includes("node_modules/")) continue;

  let code;
  try {
    code = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const match of code.matchAll(IMPORT_RE)) {
    const spec = match[1];
    let base;
    if (spec.startsWith("./") || spec.startsWith("../")) {
      base = path.posix.normalize(
        path.posix.join(path.posix.dirname(file), spec),
      );
    } else {
      base = resolveAlias(spec);
      if (!base) continue;
    }

    checked++;
    const variants = [base];
    if (base.endsWith(".js")) variants.push(base.slice(0, -3));

    const candidates = variants.flatMap((v) =>
      RESOLVE_EXT.map((ext) => v + ext),
    );
    if (candidates.some((c) => exact.has(c))) continue;

    const line = code.slice(0, match.index).split("\n").length;
    const caseMatch = candidates
      .map((c) => lowerToReal.get(c.toLowerCase()))
      .find(Boolean);

    problems.push(
      caseMatch
        ? { file, line, spec, kind: "CASE", real: caseMatch }
        : { file, line, spec, kind: "MISSING" },
    );
  }
}

if (problems.length === 0) {
  console.log(
    `OK: ${checked} imports checked, all match git file names exactly.`,
  );
  process.exit(0);
}

const caseIssues = problems.filter((p) => p.kind === "CASE");
const missing = problems.filter((p) => p.kind === "MISSING");

if (caseIssues.length) {
  console.log(
    `\nCASE MISMATCH (${caseIssues.length}): works on Windows, breaks on Linux\n`,
  );
  for (const p of caseIssues) {
    console.log(`  ${p.file}:${p.line}`);
    console.log(`    import:      "${p.spec}"`);
    console.log(`    file in git:  ${p.real}\n`);
  }
}

if (missing.length) {
  console.log(
    `\nNOT IN GIT (${missing.length}): file not committed, or path is wrong\n`,
  );
  for (const p of missing) {
    console.log(`  ${p.file}:${p.line}  ->  "${p.spec}"`);
  }
  console.log("");
}

process.exit(1);
