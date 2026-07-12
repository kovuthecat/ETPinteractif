import type { CourbeDef, SegmentDef } from '../components/CourbeGlycemie';
import { COURBE_GRAPH_WIDTH, COURBE_GRAPH_HEIGHT, bandeToY } from '../components/CourbeGlycemie';
import { sampleNuits, toSvgPath } from '../lib/glycemieCurve';
import type { Point, ScenarioTrace } from '../lib/glycemieCurve';

export { bandeToY };

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

export type SituationId = 'tendance' | 'descend' | 'rapide' | 'bas';
export type ActionTon = 'vigilance' | 'neutre' | 'toxique';

export interface SituationDef {
  id: SituationId;
  label: string;
  desc: string;
  action: string;
  ton: ActionTon;
  scenario: ScenarioTrace;
}

/**
 * Les 3 lectures de la nuit (temps ③, carte ①) — SPEC §13.5. Évolution S14 §B7 (demande
 * Thibault 2026-07-09) : le chip « Une seule nuit isolée » disparaît (rendait la nuit
 * déviante comme trace principale, lisible comme « la courbe plonge » plutôt que comme du
 * bruit) — son enseignement (plusieurs nuits d'affilée = tendance, une seule nuit qui dévie
 * = du bruit) est reporté dans la desc du chip `tendance`. Le chip `descend` couvre le cas
 * d'école du cran de moins sur la lente (descente nocturne → hypo au petit matin).
 */
export const SUB_SITUATIONS: SituationDef[] = [
  {
    id: 'tendance',
    label: 'Plusieurs nuits qui montent',
    desc: "Le taux grimpe pendant la nuit, loin de tout repas — et ça se répète, nuit après nuit, plusieurs nuits d'affilée : une vraie dérive de la lente. Une seule nuit qui dévie, c'est du bruit : on ne bouge pas.",
    action: 'Un cran de plus sur la lente — puis on attend ~3 jours sans retoucher.',
    ton: 'vigilance',
    scenario: 'derive_haute',
  },
  {
    id: 'descend',
    label: 'Ça descend la nuit, bas au réveil',
    desc: 'La trace glisse vers le bas au fil de la nuit et finit près du plancher au petit matin — plusieurs nuits d\'affilée : la lente est trop forte.',
    action: 'Un cran de moins sur la lente — puis on attend ~3 jours sans retoucher.',
    ton: 'vigilance',
    scenario: 'descend_hypo_matinale',
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
  descend: SUB_SITUATIONS[1],
  rapide: SUB_SITUATIONS[2],
  bas: BAS,
};

export type Ajustement = 'baisse' | 'pareil' | 'hausse';

/** Effet d'un réglage de la lente sur une situation → scénario résultant (réutilise les
 *  scénarios existants ; `// à revalider (Thibault)` — mapping pédagogique, pas une prescription). */
const AJUSTEMENT_RESULT: Record<'tendance' | 'descend' | 'rapide', Record<Ajustement, ScenarioTrace>> = {
  tendance: { baisse: 'descend_hypo_matinale', pareil: 'derive_haute', hausse: 'stable' },
  descend: { baisse: 'stable', pareil: 'descend_hypo_matinale', hausse: 'derive_haute' },
  rapide: { baisse: 'haut_stable_apres_repas', pareil: 'haut_stable_apres_repas', hausse: 'haut_stable_apres_repas' },
};

export function resultScenario(situationId: SituationId, ajustement: Ajustement): ScenarioTrace {
  if (situationId === 'bas') return SITUATIONS.bas.scenario; // pas d'expérimentation sur l'hypo
  return AJUSTEMENT_RESULT[situationId][ajustement];
}

/** Message qualitatif dérivé du scénario résultant (aucun chiffre). */
export function outcomeMessage(result: ScenarioTrace): { texte: string; ton: ActionTon } {
  switch (result) {
    case 'stable':
      return { texte: 'La dérive s’aplatit : on est revenu dans la cible.', ton: 'neutre' };
    case 'derive_haute':
      return { texte: 'Ça continue de monter la nuit : on s’éloigne de la cible.', ton: 'vigilance' };
    case 'descend_hypo_matinale':
      return { texte: 'Ça descend trop : on frôle l’hypo au petit matin.', ton: 'toxique' };
    case 'haut_stable_apres_repas':
      return {
        texte: 'La lente n’y change presque rien : c’est le rapide du soir qu’on revoit.',
        ton: 'neutre',
      };
    default:
      return { texte: '', ton: 'neutre' };
  }
}

/** Nuits superposées par trace (1 principale + estompées) — « profil type du Libre ». */
const N_NUITS = 3;

/** Seed fixe par scénario : rendu stable d'une visite à l'autre (Décision clé S12). */
const SEED_BY_SCENARIO: Record<ScenarioTrace, number> = {
  stable: 101,
  derive_haute: 202,
  descend_hypo_matinale: 303,
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
