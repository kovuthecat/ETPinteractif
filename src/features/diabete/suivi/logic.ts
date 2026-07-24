/**
 * Module 6 — Suivi : fonctions pures du cadran de l'année + fiche calendrier.
 * Portage fidèle de la logique de la maquette
 * (`Module 6 - Suivi.dc.html` <script data-dc-script>), avec une entorse voulue
 * (cf. `plans/theme-diabete/S9.md` §Décision clé) :
 *   1. Le mois/l'année/le jour "courants" ne sont plus des constantes figées : ils sont
 *      calculés à l'affichage à partir d'une vraie `Date` (passée en paramètre par le
 *      composant), pour que l'aiguille pointe le jour réel.
 * Tout le reste (angles, occurrences, snap, statuts, cycles longs) est repris tel quel.
 * Testable à l'œil nu (fonctions pures) — pas de suite de tests exigée par S9.md.
 *
 * Évolution S14 §B5 (revue visuelle 2026-07-09, inverse D9 décision clé n°2) : le cadran
 * démarre **vide** au montage (comme la maquette), l'utilisateur le construit élément par
 * élément — le pré-peuplement automatique est retiré, `initRevealedPrepeuple` a disparu.
 */

export type ExamId =
  | 'hba1c'
  | 'bilan_lipidique'
  | 'rein'
  | 'fond_oeil'
  | 'pied_complet'
  | 'dentiste'
  | 'vaccins';

export type ProtectsId = 'vaisseaux' | 'coeur' | 'reins' | 'yeux' | 'pied' | 'bouche' | 'defenses';

export type Status = 'fait' | 'a_programmer' | 'a_venir';

export interface ExamDef {
  id: ExamId;
  name: string;
  bio: boolean;
  protects: ProtectsId;
}

/** Verbatim maquette. */
export const EXAM_DEFS: ExamDef[] = [
  { id: 'hba1c', name: 'HbA1c', bio: true, protects: 'vaisseaux' },
  { id: 'bilan_lipidique', name: 'Bilan lipidique', bio: true, protects: 'coeur' },
  { id: 'rein', name: 'Bilan rénal (DFG)', bio: true, protects: 'reins' },
  { id: 'fond_oeil', name: "Fond d'œil", bio: false, protects: 'yeux' },
  { id: 'pied_complet', name: 'Pied complet', bio: false, protects: 'pied' },
  { id: 'dentiste', name: 'Dentiste', bio: false, protects: 'bouche' },
  { id: 'vaccins', name: 'Vaccins', bio: false, protects: 'defenses' },
];

/** Verbatim maquette. */
export const PROTECTS_INFO: Record<ProtectsId, { name: string; text: string }> = {
  vaisseaux: {
    name: 'Vaisseaux',
    text: "Un taux de sucre trop élevé abîme les petits et grands vaisseaux avec le temps — l'HbA1c mesure la moyenne des 3 derniers mois pour garder ce fil sous contrôle.",
  },
  coeur: {
    name: 'Cœur',
    text: "Le cholestérol en excès favorise les dépôts dans les artères — ce bilan surveille ce risque avant l'accident cardiovasculaire.",
  },
  reins: {
    name: 'Reins',
    text: 'Les reins filtrent un peu moins bien avec le temps, souvent sans aucun signe — ce bilan les surveille avant toute perte de fonction.',
  },
  yeux: {
    name: 'Yeux',
    text: "De petits vaisseaux de la rétine s'abîment avec le temps — le fond d'œil les surveille avant que la vue ne se trouble.",
  },
  pied: {
    name: 'Pied',
    text: 'Une petite plaie peut passer inaperçue si la sensibilité a diminué — cet examen complète votre auto-examen quotidien.',
  },
  bouche: {
    name: 'Bouche & gencives',
    text: 'Le diabète favorise les infections des gencives, qui peuvent en retour déséquilibrer la glycémie — d’où ce suivi régulier.',
  },
  defenses: {
    name: 'Défenses immunitaires',
    text: 'Le diabète peut affaiblir la réponse immunitaire face à certaines infections — les vaccins recommandés comblent ce point faible.',
  },
};

export const MONTHS = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
export const MONTHS_FULL = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

// ── Fréquences (⚠️ à revalider (Thibault — ADA/HAS-SFD) avant usage en consultation) ──
// Regroupées ici pour qu'une revue clinique ultérieure les retrouve d'un coup d'œil.

/** Crans fermés de fréquence des consultations (mois). // à revalider (Thibault) */
export const CONSULT_INTERVAL_OPTIONS = [3, 4, 6];
// S3-v2 : libellés courts (repasse side-by-side, la colonne examens doit tenir en demi-largeur).
export const CONSULT_INTERVAL_LABELS: Record<number, string> = {
  3: '3 mois',
  4: '4 mois',
  6: '6 mois',
};

/**
 * Fréquence par défaut de chaque examen — `everyN` compte en "nombre de consultations"
 * (1 = chaque consultation, annualN = 1×/an pour l'intervalle courant, etc.) et
 * `startMonth` est le mois de départ avant snap sur la consultation la plus proche.
 * // à revalider (Thibault — ADA/HAS-SFD) : ports fidèles de la maquette, jamais vérifiés
 * cliniquement au câblage.
 */
const DEFAULT_EXAM_FREQUENCY: Record<ExamId, { everyN: number; startMonth: number }> = {
  hba1c: { everyN: 1, startMonth: 0 }, // à revalider (Thibault) — chaque consultation (~3-4 mois)
  bilan_lipidique: { everyN: 4, startMonth: 6 }, // à revalider (Thibault) — 1×/an
  rein: { everyN: 4, startMonth: 3 }, // à revalider (Thibault) — 1×/an
  fond_oeil: { everyN: 4, startMonth: 0 }, // à revalider (Thibault) — 1×/an
  pied_complet: { everyN: 4, startMonth: 9 }, // à revalider (Thibault) — 1×/an
  dentiste: { everyN: 4, startMonth: 9 }, // à revalider (Thibault) — 1×/an
  vaccins: { everyN: 8, startMonth: 0 }, // à revalider (Thibault) — 1×/2 ans
};

export interface ConsultConfig {
  interval: number;
  startMonth: number;
}

export interface ExamConfig {
  everyN: number;
  startMonth: number;
  status: Status;
}

/** Angle (radians) du mois `m` (0=janvier) sur le cadran, 0h en haut (verbatim maquette). */
export function angleForMonth(m: number): number {
  return ((m * 30 - 90) * Math.PI) / 180;
}

export function pt(cx: number, cy: number, r: number, angleRad: number): { x: number; y: number } {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

/** Mois (0-11) des consultations sur l'année, à partir de l'intervalle + mois de départ. */
export function computeConsultMonths(cfg: ConsultConfig): number[] {
  const months: number[] = [];
  for (let m = cfg.startMonth; m < cfg.startMonth + 12; m += cfg.interval) {
    months.push(m % 12);
  }
  return months;
}

/**
 * Statut par défaut d'un mois donné par rapport au mois courant réel — RÈGLE GRAVÉE ①
 * appliquée ici seulement au moment du calcul initial : passé et mois courant = à
 * programmer (état neutre, rien n'est présumé fait sans confirmation), futur = à venir.
 * Le statut se fige ensuite (l'utilisateur le change via un clic), il ne se recalcule
 * jamais tout seul sur l'année civile.
 *
 * Décision Thibault (2026-07-24, gate G-Suivi) : un mois passé ne pré-suppose plus que
 * l'examen a été fait — l'app ne connaît pas le vécu réel du patient. Avant ce
 * changement, `month < currentMonth` renvoyait `'fait'`, ce qui pré-cochait
 * automatiquement janvier/mai/etc. comme si les examens avaient eu lieu. Repli sur
 * l'état neutre `'a_programmer'`, cochable manuellement par l'utilisateur (clic).
 */
export function statusForMonth(month: number, currentMonth: number): Status {
  if (month <= currentMonth) return 'a_programmer';
  return 'a_venir';
}

export function defaultConsultStatus(months: number[], currentMonth: number): Record<number, Status> {
  const st: Record<number, Status> = {};
  months.forEach((m) => {
    st[m] = statusForMonth(m, currentMonth);
  });
  return st;
}

/** Configuration initiale des 7 examens (fréquences par défaut + statut dérivé du jour réel). */
export function initExamConfig(consultMonths: number[], currentMonth: number): Record<ExamId, ExamConfig> {
  const out = {} as Record<ExamId, ExamConfig>;
  EXAM_DEFS.forEach((def) => {
    const freq = DEFAULT_EXAM_FREQUENCY[def.id];
    const snapped = nearestConsultMonth(freq.startMonth, consultMonths);
    out[def.id] = { everyN: freq.everyN, startMonth: freq.startMonth, status: statusForMonth(snapped, currentMonth) };
  });
  return out;
}

/** Cadran vide (montage initial, S14 §B5 — et « Tout réinitialiser », même geste). */
export function initRevealedVide(): Record<ExamId, boolean> {
  const r = {} as Record<ExamId, boolean>;
  EXAM_DEFS.forEach((d) => {
    r[d.id] = false;
  });
  return r;
}

/** Mois de consultation le plus proche d'un mois donné (distance circulaire). */
export function nearestConsultMonth(month: number, consultMonths: number[]): number {
  let best = consultMonths[0];
  let bestDist = Infinity;
  consultMonths.forEach((m) => {
    const d = Math.min(Math.abs(m - month), 12 - Math.abs(m - month));
    if (d < bestDist) {
      bestDist = d;
      best = m;
    }
  });
  return best;
}

/** Mois d'occurrence d'un examen sur l'année, snappé sur les mois de consultation. */
export function examOccurrenceMonths(cfg: ExamConfig, consultMonths: number[]): number[] {
  const snapped = nearestConsultMonth(cfg.startMonth, consultMonths);
  const idx = consultMonths.indexOf(snapped);
  const out: number[] = [];
  for (let i = idx; i < consultMonths.length; i += cfg.everyN) out.push(consultMonths[i]);
  return out.length ? out : [snapped];
}

/** Un examen est "cycle long" (bisannuel+) quand sa fréquence dépasse le nombre de consultations/an. */
export function isLongCycle(cfg: ExamConfig, consultMonths: number[]): boolean {
  return cfg.everyN > consultMonths.length;
}

/** Nombre d'années du cycle long (arrondi), à partir de l'intervalle de consultation courant. */
export function longCycleYears(cfg: ExamConfig, consultInterval: number): number {
  return Math.round((cfg.everyN * consultInterval) / 12);
}

/**
 * Année de la "prochaine" occurrence d'un cycle long, affichée en badge
 * (« tous les 2 ans — prochain : 20XX »), jamais évaporée (règle gravée ②, cf. brief).
 * Port fidèle de la relation de la maquette (REF_YEAR = année courante − 1).
 */
export function longCycleNextYear(cfg: ExamConfig, consultInterval: number, currentYear: number): number {
  return currentYear - 1 + longCycleYears(cfg, consultInterval);
}
