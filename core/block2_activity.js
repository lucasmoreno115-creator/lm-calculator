/**
 * BLOCO 2 — ATIVIDADE FÍSICA (até 35 pts)
 *
 * Implementa o lock:
 * - Sedentarismo pesa muito
 * - Frequência baixa penaliza
 * - Sem musculação penaliza
 */

export function block2Activity(d) {
  let penalty = 0;
  const reasons = [];

  // Penalização por “atividade declarada”
  if (d.activityLevel === "sedentary") {
    penalty += 25;
    reasons.push("Sedentarismo reduz eficiência do déficit e aumenta dificuldade de adesão.");
  } else if (d.activityLevel === "light") {
    penalty += 15;
    reasons.push("Baixa atividade limita ritmo de progresso e aumenta dependência de dieta perfeita.");
  } else if (d.activityLevel === "moderate") {
    penalty += 5;
    reasons.push("Atividade moderada: boa base, ainda depende de consistência semanal.");
  } else {
    // high
    penalty += 0;
  }

  // Frequência <3 penaliza (mesmo que “se declare ativo”)
  if (d.trainingFrequency < 3) {
    penalty += 5;
    reasons.push("Treino <3x/sem reduz estímulo mínimo para progresso consistente.");
  }

  // Sem musculação penaliza
  if (!d.strengthTraining) {
    penalty += 5;
    reasons.push("Sem musculação: maior risco de perder massa magra e piorar composição corporal.");
  }

  // Teto do bloco
  penalty = Math.min(penalty, 35);

  return {
    penalty,
    reasons,
    meta: {
      declaredActivity: d.activityLevel,
      trainingFrequency: d.trainingFrequency,
      strengthTraining: d.strengthTraining,
    },
  };
}
