import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { calculateLMScore } from "../core/lmScoreEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJson(relPath) {
  const full = path.join(__dirname, relPath);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function assertWithin(name, actual, expected, tolerance) {
  const min = expected - tolerance;
  const max = expected + tolerance;

  if (actual < min || actual > max) {
    throw new Error(
      `[FAIL] ${name}: score=${actual} (expected ${expected} ±${tolerance} => ${min}..${max})`
    );
  }

  console.log(`[PASS] ${name}: score=${actual} (expected ${expected} ±${tolerance})`);
}

function assertReasonsNonEmptyWhenLow(name, result) {
  // Regra educacional: se score < 85, deve haver pelo menos 1 razão
  if (result.score < 85 && (!Array.isArray(result.reasons) || result.reasons.length === 0)) {
    throw new Error(`[FAIL] ${name}: score < 85 mas reasons está vazio (quebra explicabilidade)`);
  }
  console.log(`[PASS] ${name}: reasons ok (${result.reasons.length})`);
}

function runScenario(scenarioKey) {
  const input = readJson(`${scenarioKey}.json`);
  return calculateLMScore(input);
}

function main() {
  const expected = readJson("expectedResults.json");

  const cases = [
    { key: "scenarioA", label: "Scenario A" },
    { key: "scenarioB", label: "Scenario B" },
    { key: "scenarioC", label: "Scenario C" }
  ];

  let failures = 0;

  for (const c of cases) {
    try {
      const result = runScenario(c.key);
      const exp = expected[c.key];

      assertWithin(c.label, result.score, exp.score, exp.tolerance);
      assertReasonsNonEmptyWhenLow(c.label, result);

      // Debug opcional (descomente se quiser ver)
      // console.log(result);
    } catch (err) {
      failures++;
      console.error(String(err?.message || err));
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} teste(s) falharam.`);
    process.exit(1);
  }

  console.log("\nTodos os testes passaram ✅");
}

main();
