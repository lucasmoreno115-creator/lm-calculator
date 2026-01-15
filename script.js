// ===============================
// LM CALCULATOR — APP ADAPTER v0.9
// ===============================
// Este arquivo NÃO contém regras científicas.
// Ele apenas conecta o formulário ao core LM Score.

import { calculateLMScore } from "./core/lmScoreEngine.js";

document
  .getElementById("calcBtn")
  .addEventListener("click", handleCalculate);

// -------------------------------
// Controller principal
// -------------------------------
function handleCalculate() {
  const data = collectFormData();
  const result = calculateLMScore(data);
  renderResult(result);
}

// -------------------------------
// Coleta de dados (compatível com o core)
// -------------------------------
function collectFormData() {
  const bodyFatValue = document.getElementById("bodyFat").value;

  return {
    sex: document.getElementById("sex").value,
    age: Number(document.getElementById("age").value),
    weight: Number(document.getElementById("weight").value),
    height: Number(document.getElementById("height").value),

    // Só envia bodyFat se o usuário preencher
    bodyFat: bodyFatValue ? Number(bodyFatValue) : undefined,

    activityLevel: document.getElementById("activityLevel").value,
    trainingFrequency: Number(
      document.getElementById("trainingFrequency").value
    ),
    strengthTraining:
      document.getElementById("strengthTraining").checked,

    expectation: document.getElementById("expectation").value
  };
}

// -------------------------------
// Renderização do resultado
// -------------------------------
function renderResult(result) {
  const resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  resultDiv.style.display = "block";

  document.getElementById("score").textContent =
    `LM Score: ${result.score}`;

  document.getElementById("classification").textContent =
    result.classification;

  document.getElementById("mainFactor").textContent =
    result.reasons.length
      ? result.reasons.join(" ")
      : "Nenhum fator de risco relevante identificado.";

  const debugEl = document.getElementById("debug");
  if (debugEl) {
    debugEl.textContent = JSON.stringify(result, null, 2);
  }
}
