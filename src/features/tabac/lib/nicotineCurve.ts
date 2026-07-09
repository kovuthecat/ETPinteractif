/**
 * Modèle cible (refonte, transcrit de `maquettes/handoff/dc-script.extracted.js`) :
 * niveau de nicotine sur une échelle 0–100, axe temps 0–24 h, alimenté par des
 * événements datés (cigarette / patch / substitut). La tension (soulagement) est
 * un modèle séparé, qui ne dépend que des instants de cigarette (plus du niveau
 * de nicotine).
 *
 * API gelée pour les modules consommateurs (S4 = nicotine, S7 = soulagement) :
 * - constantes : TIME_MAX, LEVEL_MAX, BASELINE, ZONE_THRESHOLD_LOW/HIGH,
 *   TENSION_HIGH, TENSION_TROUGH, TENSION_NONSMOKER, TENSION_TAU, TENSION_VIRTUAL_START
 * - types : NicotineEventType, NicotineEvent, NicotineZone
 * - sampleLevel(events, t) : niveau ponctuel à l'instant t
 * - sampleCurve({ events, n }) : n+1 niveaux échantillonnés sur [0, TIME_MAX]
 * - classifyZone(level) : zone MANQUE / CONFORT / SURDOSAGE
 * - tensionLevelAt(t, cigTimes) : tension ponctuelle à l'instant t
 * - sampleTension({ cigTimes, n }) : n+1 tensions échantillonnées sur [0, TIME_MAX]
 * - toSvgPath(values, { width, height, min?, max? }) : chemin SVG (les modules
 *   fournissent leur propre viewBox/domaine ; min/max par défaut = [0, LEVEL_MAX])
 *
 * Zones (bornes lues dans `ETP Tabac.dc.html`, bandes SVG du graphe nicotine) :
 * rect SURDOSAGE y∈[20,56], CONFORT y∈[56,196], MANQUE y∈[196,220] avec
 * levelToY(l) = 220 − (l/100)·200 ⇒ seuils en niveau : 12 (MANQUE/CONFORT) et 82
 * (CONFORT/SURDOSAGE).
 */

export const TIME_MAX = 24;
export const LEVEL_MAX = 100;
export const BASELINE = 4;

export const ZONE_THRESHOLD_LOW = 12;
export const ZONE_THRESHOLD_HIGH = 82;

export const TENSION_HIGH = 90;
export const TENSION_TROUGH = 15;
export const TENSION_NONSMOKER = 4;
export const TENSION_TAU = 2.2;
export const TENSION_VIRTUAL_START = -2.5;

export type NicotineEventType = 'cigarette' | 'patch' | 'substitut';
export type NicotineEvent = { type: NicotineEventType; time: number; dose?: number };
export type NicotineZone = 'manque' | 'confort' | 'surdosage';

const LN2 = Math.LN2;

function cigaretteContribution(dt: number): number {
  if (dt < 0) return 0;
  return 40 * (1 - Math.exp(-dt / 0.04)) * Math.exp((-dt * LN2) / 1.2);
}

function patchContribution(dt: number, dose: number): number {
  if (dt < 0) return 0;
  const amp = 30 * dose;
  if (dt < 0.5) return amp * (dt / 0.5);
  return amp;
}

function substitutContribution(dt: number): number {
  if (dt < 0) return 0;
  return 26 * (1 - Math.exp(-dt / 0.35)) * Math.exp((-dt * LN2) / 2.2);
}

function contributionFor(event: NicotineEvent, t: number): number {
  const dt = t - event.time;
  if (event.type === 'cigarette') return cigaretteContribution(dt);
  if (event.type === 'patch') return patchContribution(dt, event.dose ?? 1);
  return substitutContribution(dt);
}

export function sampleLevel(events: NicotineEvent[], t: number): number {
  let level = BASELINE;
  for (const event of events) level += contributionFor(event, t);
  return Math.min(LEVEL_MAX, Math.max(0, level));
}

export function sampleCurve(opts: { events: NicotineEvent[]; n?: number }): number[] {
  const n = opts.n ?? 200;
  const levels: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * TIME_MAX;
    levels.push(sampleLevel(opts.events, t));
  }
  return levels;
}

export function classifyZone(level: number): NicotineZone {
  if (level < ZONE_THRESHOLD_LOW) return 'manque';
  if (level > ZONE_THRESHOLD_HIGH) return 'surdosage';
  return 'confort';
}

export function tensionLevelAt(t: number, cigTimes: number[]): number {
  let lastT = TENSION_VIRTUAL_START;
  for (const c of cigTimes) if (c <= t && c > lastT) lastT = c;
  const dt = t - lastT;
  return TENSION_HIGH - (TENSION_HIGH - TENSION_TROUGH) * Math.exp(-dt / TENSION_TAU);
}

export function sampleTension(opts: { cigTimes: number[]; n?: number }): number[] {
  const n = opts.n ?? 200;
  const levels: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * TIME_MAX;
    levels.push(tensionLevelAt(t, opts.cigTimes));
  }
  return levels;
}

export function toSvgPath(
  values: number[],
  opts: { width: number; height: number; min?: number; max?: number },
): string {
  if (values.length === 0) return '';
  const min = opts.min ?? 0;
  const max = opts.max ?? LEVEL_MAX;
  const n = values.length;
  const points = values.map((value, i) => {
    const x = n === 1 ? 0 : (i / (n - 1)) * opts.width;
    const clamped = Math.min(max, Math.max(min, value));
    const y = opts.height - ((clamped - min) / (max - min)) * opts.height;
    return `${x},${y}`;
  });
  const [first, ...rest] = points;
  return rest.length > 0 ? `M${first} L${rest.join(' ')}` : `M${first}`;
}
