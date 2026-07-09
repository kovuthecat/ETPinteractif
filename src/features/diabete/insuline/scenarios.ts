import type { CourbeDef, BandeCible, SegmentDef } from '../components/CourbeGlycemie';
import { COURBE_GRAPH_WIDTH, COURBE_GRAPH_HEIGHT } from '../components/CourbeGlycemie';
import { LEVEL_MAX, sampleNuits, toSvgPath } from '../lib/glycemieCurve';
import type { Point, ScenarioTrace } from '../lib/glycemieCurve';

/**
 * Mapping situations du module 9 (textes verbatim de la maquette
 * `Module 9 - Insuline.dc.html`) → scénarios de la lib `glycemieCurve` (S2) + textes.
 * Aucune trace codée en dur : tout vient de `sampleNuits` (cf. plan `S12.md` « Décision
 * clé ») — remplace le `dayPath(bedtime, wake)` à bosses figées de la maquette.
 */

export type ProfileId = 'jeune' | 'age';

export interface ProfileDef {
  id: ProfileId;
  nom: string;
  desc: string;
  /** Bande-cible dans l'échelle 0–100 de la lib (BASELINE=30, cf. glycemieCurve.ts en-tête). */
  bande: { basse: number; haute: number };
}

// jeune = bande basse et serrée (contrôle strict) ; âgé/fragile = bande plus haute et plus
// large, la marge basse s'éloigne du plancher hypo pour prioriser l'évitement de l'hypo
// (SPEC §13.3 : « on vise plus doux, éviter l'hypo prime »).
export const PROFILES: Record<ProfileId, ProfileDef> = {
  jeune: {
    id: 'jeune',
    nom: 'Profil jeune, actif',
    desc: 'Zone-cible basse et serrée : on vise un contrôle plus strict.',
    bande: { basse: 22, haute: 45 },
  },
  age: {
    id: 'age',
    nom: 'Profil âgé / fragile',
    desc: "Zone-cible plus haute et plus large : éviter l'hypo prime avant tout.",
    bande: { basse: 30, haute: 68 },
  },
};

export type SituationId = 'tendance' | 'bruit' | 'rapide' | 'bas';
export type ActionTon = 'vigilance' | 'neutre' | 'toxique';

export interface SituationDef {
  id: SituationId;
  label: string;
  desc: string;
  action: string;
  ton: ActionTon;
  scenario: ScenarioTrace;
}

/** Les 3 lectures de la nuit (temps ③, carte ①) — SPEC §13.5, verbatim maquette. */
export const SUB_SITUATIONS: SituationDef[] = [
  {
    id: 'tendance',
    label: 'Plusieurs nuits qui montent',
    desc: "Le taux grimpe pendant la nuit, loin de tout repas — et ça se répète, nuit après nuit : une vraie dérive de la lente.",
    action: 'Un cran de plus sur la lente — puis on attend ~3 jours sans retoucher.',
    ton: 'vigilance',
    scenario: 'derive_haute',
  },
  {
    id: 'bruit',
    label: 'Une seule nuit isolée',
    desc: "Une seule nuit s'écarte des autres, qui restent normales — c'est le corollaire de la tendance : ici, du bruit, pas une tendance.",
    action: 'On ne bouge pas.',
    ton: 'neutre',
    scenario: 'nuit_isolee',
  },
  {
    id: 'rapide',
    label: 'Déjà haut après le repas, stable',
    desc: "Le taux est déjà haut juste après le dîner et reste stable toute la nuit, sans grimper davantage — ce n'est pas la nuit qui pose problème.",
    action: "Ce n'est pas la lente : on revoit le rapide du soir.",
    ton: 'vigilance',
    scenario: 'haut_stable_apres_repas',
  },
];

/** La situation basse (carte ②, temps ③) — porte vers le module 8 (hypo). */
export const BAS: SituationDef = {
  id: 'bas',
  label: 'La trace plonge dans le bas',
  desc: 'Le taux plonge côté bas, plusieurs nuits de suite.',
  action: "un cran de moins — et on traite l'hypo en priorité",
  ton: 'toxique',
  scenario: 'plonge_bas',
};

export const SITUATIONS: Record<SituationId, SituationDef> = {
  tendance: SUB_SITUATIONS[0],
  bruit: SUB_SITUATIONS[1],
  rapide: SUB_SITUATIONS[2],
  bas: BAS,
};

/** Nuits superposées par trace (1 principale + estompées) — « profil type du Libre ». */
const N_NUITS = 3;

/** Seed fixe par scénario : rendu stable d'une visite à l'autre (Décision clé S12). */
const SEED_BY_SCENARIO: Record<ScenarioTrace, number> = {
  stable: 101,
  derive_haute: 202,
  nuit_isolee: 303,
  haut_stable_apres_repas: 404,
  plonge_bas: 505,
};

/**
 * Nuit = premier tiers de la trace 24h (8h de nuit / 24h — contrat documenté en tête de
 * `glycemieCurve.ts` : « NUIT_MINUTES = 480 » sur une trace « coucher → coucher »). Constante
 * locale non exportée par la lib (API gelée) : dérivée du contrat, pas une valeur inventée.
 */
const NUIT_FRACTION = 1 / 3;

export function tracesForScenario(scenario: ScenarioTrace): Point[][] {
  return sampleNuits(scenario, N_NUITS, SEED_BY_SCENARIO[scenario]);
}

/** Traces → CourbeDef[] : la dernière trace en principale (trait plein), les autres estompées. */
export function buildCourbes(traces: Point[][]): CourbeDef[] {
  return traces.map((points, i) => {
    const d = toSvgPath(points, { width: COURBE_GRAPH_WIDTH, height: COURBE_GRAPH_HEIGHT });
    const principale = i === traces.length - 1;
    return {
      id: `nuit-${i}`,
      d,
      label: principale ? 'Nuit la plus récente' : 'Nuit précédente',
      variante: principale ? 'principale' : 'estompee',
    };
  });
}

export function bandeToY(bande: { basse: number; haute: number }): BandeCible {
  return {
    hauteY: COURBE_GRAPH_HEIGHT - (bande.haute / LEVEL_MAX) * COURBE_GRAPH_HEIGHT,
    basseY: COURBE_GRAPH_HEIGHT - (bande.basse / LEVEL_MAX) * COURBE_GRAPH_HEIGHT,
  };
}

/** Segment nuit / à jeun ↔ la lente ; bosses post-repas ↔ le bolus (SPEC §13.4). */
export const SEGMENTS: SegmentDef[] = [
  { id: 'nuit', t0: 0, t1: NUIT_FRACTION, label: 'Segment nuit / à jeun' },
  { id: 'repas', t0: NUIT_FRACTION, t1: 1, label: 'Bosses post-repas' },
];

export type TrendArrow = '↗' | '↘' | '→';

const TREND_THRESHOLD = 8;

/** Excursion nocturne nette d'une trace : (max-début) − (début-min), signée. */
function nightExcursion(points: Point[]): number {
  if (points.length === 0) return 0;
  const tMin = points[0].t;
  const tMax = points[points.length - 1].t;
  const nightEndT = tMin + NUIT_FRACTION * (tMax - tMin);
  const nightPoints = points.filter((p) => p.t <= nightEndT);
  if (nightPoints.length === 0) return 0;
  const start = nightPoints[0].v;
  let min = start;
  let max = start;
  for (const p of nightPoints) {
    if (p.v < min) min = p.v;
    if (p.v > max) max = p.v;
  }
  return max - start - (start - min);
}

/**
 * Flèche de tendance dérivée de la pente nocturne réelle des traces (jamais un mapping en
 * dur, Décision clé S12) : médiane des excursions nocturnes de chaque trace — robuste à une
 * seule nuit isolée (bruit), qui ne doit pas déclencher la même flèche qu'une vraie dérive
 * répétée sur toutes les nuits (le cœur pédagogique du module).
 */
export function computeTrendArrow(traces: Point[][]): TrendArrow {
  const excursions = traces.map(nightExcursion).sort((a, b) => a - b);
  const mid = Math.floor(excursions.length / 2);
  const median =
    excursions.length % 2 === 0 ? (excursions[mid - 1] + excursions[mid]) / 2 : excursions[mid];
  if (median > TREND_THRESHOLD) return '↗';
  if (median < -TREND_THRESHOLD) return '↘';
  return '→';
}
