/**
 * Modèle pharmacologiquement plausible de la nicotinémie (thème tabac), sur le
 * même patron que `src/features/diabete/lib/glycemieCurve.ts` : lib pure, sans
 * état, échantillonnage temporel → niveaux/tensions, une seule identité de
 * courbe réutilisée aux modules 2 (Nicotine) et 5 (Soulagement).
 *
 * Modèle (refonte S3, 2026-07-09 — remplace la rampe linéaire/exponentielle
 * simple de la première réécriture, transcrite telle quelle de la maquette) :
 * - **Élimination commune** : la nicotine est la même molécule quelle que soit
 *   la forme consommée → une seule demi-vie plasmatique `T_HALF ≈ 2 h`, qui
 *   gouverne la décroissance de toute contribution après son pic (accumulation
 *   en journée, clairance nocturne quasi complète en ~8 h ≈ 4 demi-vies).
 * - **Profils d'absorption par source** (contribution brute d'un événement,
 *   dt = t − event.time, toujours nulle si dt < 0 — un événement futur
 *   n'influence jamais le passé) : cigarette = profil de Bateman à montée
 *   très rapide (bolus artériel de l'inhalation, pic < 10 min) ; substitut oral
 *   = même forme, montée lente (absorption buccale, pic ≈ 30 min), amplitude
 *   nettement sous la cigarette ; patch = délivrance continue, montée
 *   exponentielle vers un plateau atteint vers 3-4 h puis stable jusqu'à la fin
 *   de la frise (patch posé le matin, porté 24 h — le retrait n'est pas
 *   modélisé).
 * - **Saturation (tolérance)** : la somme des contributions brutes passe par
 *   une compression de type Emax avant affichage — plafonne l'enchaînement
 *   rapproché vers le surdosage au lieu d'exploser linéairement, comme le fait
 *   la tolérance des récepteurs. Le résultat reste toujours dans [BASELINE,
 *   LEVEL_MAX[ par construction (clamp final conservé par sécurité).
 * - **Tension du manque dérivée du niveau** (module 5) : `tensionLevelAt`
 *   calcule le niveau de nicotine induit par les seules cigarettes (même
 *   modèle d'absorption/élimination/saturation que ci-dessus, sur des
 *   événements cigarette), puis le convertit en tension — plancher
 *   `TENSION_TROUGH` quand la nicotinémie est haute, plafond `TENSION_HIGH`
 *   quand elle est basse. Le manque devient une conséquence visible de la
 *   chute de la nicotinémie, pas un modèle séparé comme avant.
 *
 * Ordres de grandeur (pharmacocinétique de la nicotine) : demi-vie plasmatique
 * ≈ 2 h, pic artériel après inhalation < 10 min, pic patch transdermique 2-4 h.
 * ⚠️ Modèle **pédagogique**, pas un simulateur clinique : échelle 0-100 sans
 * unité, amplitudes calibrées pour que les messages des modules 2 et 5 restent
 * exacts (cf. `nicotineCurve.test.ts`), pas pour reproduire une posologie réelle.
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
 * Exports supplémentaires (S3, réservés aux tests d'invariants — aucun module
 * consommateur n'en dépend) : T_HALF, K_SAT, N_APAISEMENT, TENSION_EXPONENT,
 * cigaretteContributionRaw / substitutContributionRaw / patchContributionRaw
 * (contribution brute d'un événement isolé, avant saturation — nécessaire pour
 * tester les profils d'absorption et l'élimination commune indépendamment de la
 * compression Emax), tensionFromNiveau (conversion pure niveau → tension).
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

// ---------------------------------------------------------------------------
// 1. Élimination commune
// ---------------------------------------------------------------------------

/** Demi-vie plasmatique réelle ≈ 2 h, commune à toutes les formes (même molécule). */
export const T_HALF = 2;
const KE = Math.LN2 / T_HALF;

// ---------------------------------------------------------------------------
// 2. Profils d'absorption par source (contribution brute, avant saturation)
// ---------------------------------------------------------------------------

/** Constante d'absorption cigarette (bolus artériel de l'inhalation) : pic < 10 min. */
const KA_CIGARETTE = 80;
/** Constante d'absorption substitut oral (absorption buccale, plus lente) : pic ≈ 30 min. */
const KA_SUBSTITUT = 6;
/** Constante de montée du patch (délivrance continue) : plateau sensible vers 3-4 h. */
const TAU_PATCH = 1.2;

/** Amplitudes brutes (unités arbitraires, calibrées par les invariants testés). */
const A_CIGARETTE = 1.337;
const A_SUBSTITUT = 0.9;
const A_PATCH = 1.8;

/**
 * Contribution brute (avant saturation) d'une cigarette isolée, profil de
 * Bateman : montée très rapide (`KA_CIGARETTE`) puis décroissance en `T_HALF`.
 * dt = t − instant de la cigarette, en heures ; nulle si dt < 0.
 */
export function cigaretteContributionRaw(dt: number): number {
  if (dt < 0) return 0;
  return A_CIGARETTE * (Math.exp(-KE * dt) - Math.exp(-KA_CIGARETTE * dt));
}

/**
 * Contribution brute (avant saturation) d'un substitut oral isolé : même profil
 * de Bateman que la cigarette, montée lente (`KA_SUBSTITUT`), même élimination.
 */
export function substitutContributionRaw(dt: number): number {
  if (dt < 0) return 0;
  return A_SUBSTITUT * (Math.exp(-KE * dt) - Math.exp(-KA_SUBSTITUT * dt));
}

/**
 * Contribution brute (avant saturation) d'un patch : montée exponentielle vers
 * un plateau (`TAU_PATCH`), pas de décroissance tant que le patch est porté
 * (retrait non modélisé — cf. doc d'en-tête). `dose` en quarts (0.25 → 4).
 */
export function patchContributionRaw(dt: number, dose: number): number {
  if (dt < 0) return 0;
  return A_PATCH * dose * (1 - Math.exp(-dt / TAU_PATCH));
}

function contributionFor(event: NicotineEvent, t: number): number {
  const dt = t - event.time;
  if (event.type === 'cigarette') return cigaretteContributionRaw(dt);
  if (event.type === 'patch') return patchContributionRaw(dt, event.dose ?? 1);
  return substitutContributionRaw(dt);
}

// ---------------------------------------------------------------------------
// 3. Saturation (tolérance) — compression Emax de la somme des contributions
// ---------------------------------------------------------------------------

/**
 * Constante de saturation (Emax) : `niveau = BASELINE + (LEVEL_MAX-BASELINE)·S/(S+K_SAT)`
 * où `S` est la somme des contributions brutes. Plus `K_SAT` est petit, plus le
 * plafonnement (tolérance) survient tôt. À S=0 (aucun événement actif), le
 * niveau vaut exactement `BASELINE` — la formule n'a pas besoin d'inclure la
 * baseline dans le terme saturé pour ça (rescaling implicite).
 */
export const K_SAT = 1;

export function sampleLevel(events: NicotineEvent[], t: number): number {
  let sum = 0;
  for (const event of events) sum += contributionFor(event, t);
  const level = BASELINE + (LEVEL_MAX - BASELINE) * (sum / (sum + K_SAT));
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

// ---------------------------------------------------------------------------
// 4. Tension du manque dérivée du niveau (module 5)
// ---------------------------------------------------------------------------

/** Niveau de nicotine (échelle du modèle) à partir duquel la tension est au plancher. */
export const N_APAISEMENT = 50;
/** Exposant de la conversion niveau → tension (< 1 : bascule franche près de N_APAISEMENT). */
export const TENSION_EXPONENT = 0.3;

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/**
 * Conversion pure niveau de nicotine → tension liée au manque : plancher
 * `TENSION_TROUGH` dès que le niveau atteint `N_APAISEMENT`, plafond
 * `TENSION_HIGH` à niveau nul (cf. doc d'en-tête, §4).
 */
export function tensionFromNiveau(niveau: number): number {
  const f = clamp01(1 - niveau / N_APAISEMENT);
  return TENSION_TROUGH + (TENSION_HIGH - TENSION_TROUGH) * Math.pow(f, TENSION_EXPONENT);
}

/**
 * Tension à l'instant t, dérivée du niveau de nicotine induit par les seules
 * cigarettes (`cigTimes`). Une cigarette virtuelle à `TENSION_VIRTUAL_START`
 * (avant 0 h) est toujours présente : le fumeur régulier démarre la frise en
 * tension élevée (mais pas maximale) même sans cigarette encore posée.
 */
export function tensionLevelAt(t: number, cigTimes: number[]): number {
  const events: NicotineEvent[] = [{ type: 'cigarette', time: TENSION_VIRTUAL_START }];
  for (const c of cigTimes) events.push({ type: 'cigarette', time: c });
  return tensionFromNiveau(sampleLevel(events, t));
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
