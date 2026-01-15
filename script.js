// ===============================
// LM CALCULATOR — APP ADAPTER v0.9
// ===============================
// Este arquivo NÃO contém regras científicas.
// Ele apenas conecta o formulário ao core LM Score.

import { calculateLMScore } from "./core/lmScoreEngine.js";

document.getElementById("calcBtn")?.addEventListener("click", handleCalculate);

// -------------------------------
// Controller principal
// -------------------------------
function handleCalculate() {
  const data = collectFormData();

  // Guardrails mínimos pra não mandar NaN pro core
  const validation = validateInput(data);
  if (!validation.ok) {
    renderError(validation.message);
    return;
  }

  const result = calculateLMScore(data);
  renderResult(result);
}

// -------------------------------
// Coleta de dados (compatível com o core)
// -------------------------------
function collectFormData() {
  const bodyFatValue = document.getElementById("bodyFat")?.value?.trim();

  const age = Number(document.getElementById("age")?.value);
  const weight = Number(document.getElementById("weight")?.value);
  const height = Number(document.getElementById("height")?.value);

  return {
    sex: document.getElementById("sex")?.value,
    age,
    weight,
    height,

    // Só envia bodyFat se o usuário preencher
    bodyFat: bodyFatValue ? Number(bodyFatValue) : undefined,

    activityLevel: document.getElementById("activityLevel")?.value,
    trainingFrequency: Number(document.getElementById("trainingFrequency")?.value),
    strengthTraining: Boolean(document.getElementById("strengthTraining")?.checked),

    expectation: document.getElementById("expectation")?.value
  };
}

// -------------------------------
// Validação mínima (UI-side)
// -------------------------------
function validateInput(data) {
  if (!data.sex) return { ok: false, message: "Selecione o sexo." };

  if (!Number.isFinite(data.age) || data.age <= 0) {
    return { ok: false, message: "Idade inválida." };
  }

  if (!Number.isFinite(data.weight) || data.weight <= 0) {
    return { ok: false, message: "Peso inválido." };
  }

  if (!Number.isFinite(data.height) || data.height <= 0) {
    return { ok: false, message: "Altura inválida." };
  }

  if (data.bodyFat !== undefined) {
    if (!Number.isFinite(data.bodyFat) || data.bodyFat <= 0 || data.bodyFat >= 80) {
      return { ok: false, message: "% de gordura inválido." };
    }
  }

  if (!data.activityLevel) return { ok: false, message: "Selecione o nível de atividade." };

  if (!Number.isFinite(data.trainingFrequency) || data.trainingFrequency < 0) {
    return { ok: false, message: "Frequência de treino inválida." };
  }

  if (!data.expectation) return { ok: false, message: "Selecione a expectativa." };

  return { ok: true };
}

// -------------------------------
// Renderização do resultado
// -------------------------------
function renderResult(result) {
  clearError();

  const resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  resultDiv.style.display = "block";

  // Final
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = `LM Score: ${result.score}`;

  const classEl = document.getElementById("classification");
  if (classEl) classEl.textContent = result.classification ?? "";

  const mainFactorEl = document.getElementById("mainFactor");
  if (mainFactorEl) {
    mainFactorEl.textContent =
      Array.isArray(result.reasons) && result.reasons.length
        ? result.reasons.join(" ")
        : "Nenhum fator de risco relevante identificado.";
  }

  // Se o core retornar mode/version (v0.9+), mostramos
  const metaEl = document.getElementById("meta");
  if (metaEl) {
    const parts = [];
    if (result.mode) parts.push(`Mode: ${result.mode}`);
    if (result.version) parts.push(`Core: ${result.version}`);
    metaEl.textContent = parts.join(" | ");
    metaEl.style.display = parts.length ? "block" : "none";
  }

  // Blocos (v0.9): bodyComposition/activity/expectation
  const blocksEl = document.getElementById("blocks");
  if (blocksEl) {
    if (result.blocks && typeof result.blocks === "object") {
      blocksEl.innerHTML = formatBlocks(result.blocks);
      blocksEl.style.display = "block";
    } else {
      blocksEl.innerHTML = "";
      blocksEl.style.display = "none";
    }
  }

  // Debug completo
  const debugEl = document.getElementById("debug");
  if (debugEl) {
    debugEl.textContent = JSON.stringify(result, null, 2);
  }
}

function formatBlocks(blocks) {
  // blocks = { bodyComposition: {rawScore, weightedScore, confidence, flags}, ... }
  const entries = Object.entries(blocks);

  return `
    <div style="margin-top:12px;">
      <strong>Detalhe por bloco</strong>
      <ul style="margin:8px 0 0 18px;">
        ${entries
          .map(([name, b]) => {
            const raw = b?.rawScore ?? "-";
            const w = b?.weightedScore ?? "-";
            const conf = b?.confidence ?? "-";
            const flags = Array.isArray(b?.flags) && b.flags.length ? ` | flags: ${b.flags.join(", ")}` : "";
            return `<li><code>${name}</code> — raw: ${raw} | weighted: ${w} | conf: ${conf}${flags}</li>`;
          })
          .join("")}
      </ul>
    </div>
  `;
}

// -------------------------------
// Erros (UI-side)
// -------------------------------
function renderError(message) {
  const el = document.getElementById("error");
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
}

function clearError() {
  const el = document.getElementById("error");
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}
