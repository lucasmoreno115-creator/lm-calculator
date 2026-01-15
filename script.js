/**
 * APP ADAPTER (v0.9)
 * - Não contém ciência do score
 * - Só coleta dados, chama o core e renderiza
 */

import { calculateLMScore } from "./core/lmScoreEngine.js";

const els = {
  calcBtn: document.getElementById("calcBtn"),
  result: document.getElementById("result"),
  score: document.getElementById("score"),
  classification: document.getElementById("classification"),
  mainFactor: document.getElementById("mainFactor"),
  debug: document.getElementById("debug"),
};

els.calcBtn.addEventListener("click", () => {
  const data = collectFormData();
  const errors = validateInput(data);

  if (errors.length) {
    alert(errors.join("\n"));
    return;
  }

  const result = calculateLMScore(data);
  renderResult(result);
});

function collectFormData() {
  const bodyFatRaw = document.getElementById("bodyFat").value;

  return {
    sex: document.getElementById("sex").value,
    age: Number(document.getElementById("age").value),
    weight: Number(document.getElementById("weight").value),
    height: Number(document.getElementById("height").value),

    // Importante: não “inventar” 0% gordura se não preenchido
    bodyFat: bodyFatRaw ? Number(bodyFatRaw) : undefined,

    activityLevel: document.getElementById("activityLevel").value,
    trainingFrequency: Number(document.getElementById("trainingFrequency").value),
    strengthTraining: document.getElementById("strengthTraining").checked,

    expectation: document.getElementById("expectation").value,
  };
}

function validateInput(d) {
  const errs = [];

  if (!d.sex) errs.push("Sexo é obrigatório.");
  if (!Number.isFinite(d.age) || d.age <= 0) errs.push("Idade inválida.");
  if (!Number.isFinite(d.weight) || d.weight <= 0) errs.push("Peso inválido.");
  if (!Number.isFinite(d.height) || d.height <= 0) errs.push("Altura inválida.");

  if (!Number.isFinite(d.trainingFrequency) || d.trainingFrequency < 0 || d.trainingFrequency > 7) {
    errs.push("Frequência de treino deve estar entre 0 e 7.");
  }

  if (d.bodyFat !== undefined && (!Number.isFinite(d.bodyFat) || d.bodyFat < 0 || d.bodyFat > 60)) {
    errs.push("% de gordura deve estar entre 0 e 60.");
  }

  return errs;
}

function renderResult(result) {
  els.result.style.display = "block";

  els.score.textContent = String(result.score);
  els.classification.textContent = result.classification;

  els.mainFactor.textContent = result.reasons.length
    ? result.reasons.join(" ")
    : "Nenhum fator de risco relevante identificado.";

  if (els.debug) {
    els.debug.textContent = JSON.stringify(result, null, 2);
  }
}
