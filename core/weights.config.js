/**
 * LM WEIGHTS CONFIG — v1.2
 * Fonte única para pesos por bloco.
 * - NÃO muda ciência.
 * - Só controla quanto cada bloco contribui na agregação block-weighted.
 *
 * Regra: soma dos pesos deve ser 1.0 (normalização defensiva no engine).
 */

export const LM_WEIGHTS_V12 = {
  version: "1.2.0",
  blocks: {
    body: 0.3333,
    activity: 0.3333,
    expectation: 0.3334,
  },
};
