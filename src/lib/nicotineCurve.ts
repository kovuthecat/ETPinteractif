export const THRESHOLD_LOW = 0.25;
export const THRESHOLD_HIGH = 0.80;
export const PATCH_PLATEAU = 0.45;
export const PATCH_RAMP = 0.1;

/**
 * Modèle de stress illustratif (C4) : non-fumeur = palier bas constant ;
 * fumeur = palier légèrement plus haut (relief, juste après une prise) qui
 * remonte vers un plafond (manque) au fur et à mesure que la nicotine redescend.
 * Valeurs pédagogiques, pas cliniques — cf. AUDIT_VISUEL_UX_2026-06-28.md §6.
 */
export const STRESS_BASAL_NON_FUMEUR = 0.25;
export const STRESS_BASAL_FUMEUR = 0.30;
export const STRESS_AMPLITUDE_MANQUE = 0.35;

export type CurveEvent = { kind: 'cigarette' | 'ponctuel' | 'vapoteuse' | 'patch'; t: number };
export type Zone = 'manque' | 'confort' | 'haut';

function cigaretteKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  // Amplitude ~0.50 (milieu de la zone confort) et décroissance assez lente
  // pour que des prises rapprochées (cf. EVENT_STEP) cumulent au-delà de
  // THRESHOLD_HIGH — cf. plans/corrections-v3/V3-nicotine-cumul.md.
  return 0.50 * Math.exp(-(x - t0) / 0.07);
}

function ponctuelKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  const v = 0.35 * (Math.exp(-(x - t0) / 0.12) - Math.exp(-(x - t0) / 0.04));
  return Math.max(0, v);
}

function vapoteuseKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  const v = 0.50 * (Math.exp(-(x - t0) / 0.07) - Math.exp(-(x - t0) / 0.03));
  return Math.max(0, v);
}

function patchKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  const dt = x - t0;
  if (dt < PATCH_RAMP) return PATCH_PLATEAU * (dt / PATCH_RAMP);
  return PATCH_PLATEAU;
}

export function sampleCurve(opts: { patch: boolean; events: CurveEvent[]; n?: number }): number[] {
  const n = opts.n ?? 120;
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : i / (n - 1);
    let y = opts.patch ? patchKernel(x, 0) : 0;
    for (const event of opts.events) {
      if (event.kind === 'cigarette') y += cigaretteKernel(x, event.t);
      else if (event.kind === 'ponctuel') y += ponctuelKernel(x, event.t);
      else if (event.kind === 'vapoteuse') y += vapoteuseKernel(x, event.t);
      else y += patchKernel(x, event.t);
    }
    ys.push(Math.min(1, Math.max(0, y)));
  }
  return ys;
}

export function sampleStress(opts: { fumeur: boolean; events?: CurveEvent[]; n?: number }): number[] {
  const n = opts.n ?? 120;
  if (!opts.fumeur) return Array.from({ length: n }, () => STRESS_BASAL_NON_FUMEUR);
  const nicotine = sampleCurve({ patch: false, events: opts.events ?? [], n });
  return nicotine.map((y) =>
    Math.min(1, Math.max(0, STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE * (1 - y))),
  );
}

export function classifyZone(y: number): Zone {
  if (y < THRESHOLD_LOW) return 'manque';
  if (y > THRESHOLD_HIGH) return 'haut';
  return 'confort';
}

export function toSvgPath(ys: number[], width: number, height: number): string {
  if (ys.length === 0) return '';
  const n = ys.length;
  const points = ys.map((y, i) => {
    const x = n === 1 ? 0 : (i / (n - 1)) * width;
    const svgY = (1 - y) * height;
    return `${x},${svgY}`;
  });
  const [first, ...rest] = points;
  return rest.length > 0 ? `M${first} L${rest.join(' ')}` : `M${first}`;
}
