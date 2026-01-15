/**
 * LM SCORE ENGINE (v0.8.1 compat / v0.9 adapter-safe)
 * Fonte da verdade do LM Score.
 *
 * Regras travadas:
 * - Score começa em 100
 * - Só penaliza
 * - Score mínimo 40
 * - Penalização máxima 60
 * - Sempre retorna razões educacionais
 */

import { block1BodyComposition } from "./block1_bodyComposition.js";
import { block2Activity } from "./block2_activity.js";
import { block3Expectation } from "./block3_expectation.js";

export const LM_CORE_VERSION = "0.8.1";

export function calculateLMScore(input) {
  // Executa blocos isolados
  const b1 = block1BodyComposition(input);
  const b2 = block2Activity(input);
  const b3 = block3Expectation(input, b1, b2);

  // Penalização total com teto (60) e piso do score (40)
  const totalPenalty = clamp(b1.penalty + b2.penalty + b3.penalty, 0, 60);
  const score = clamp(100 - totalPenalty, 40, 100);

  return {
    version: LM_CORE_VERSION,
    score,
    classification: classify(score),
    reasons: [...b1.reasons, ...b2.reasons, ...b3.reasons],
    blocks: {
      body: b1,
      activity: b2,
      expectation: b3,
      totalPenalty,
    },
  };
}

function classify(score) {
  // Faixas travadas (lock)
  if (score >= 85) return "Baixo risco metabólico";
  if (score >= 65) return "Risco metabólico leve";
  if (score >= 45) return "Risco metabólico moderado";
  return "Alto risco metabólico";
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
