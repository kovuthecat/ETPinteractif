/**
 * Module 6 — Suivi : fonctions pures du cadran de l'année + fiche calendrier.
 * Portage fidèle de la logique de la maquette
 * (`Module 6 - Suivi.dc.html` <script data-dc-script>), avec une entorse voulue
 * (cf. `plans/theme-diabete/S9.md` §Décision clé) :
 *   1. Le mois/l'année/le jour "courants" ne sont plus des constantes figées : ils sont
 *      calculés à l'affichage à partir d'une vraie `Date` (passée en paramètre par le
 *      composant), pour que l'aiguille pointe le jour réel.
 * Le reste (angles, statuts, cycles longs) est repris de la maquette.
 *
 * Évolution plan P1/S6 (revue d'usage 2026-10-06, c-4-40 à c-4-43) : chaque examen a sa
 * **propre fréquence en mois**, indépendante du rythme des consultations ; il tombe aux mois
 * `startMonth + k × fréquence`, sans « snap » sur une consultation ; et « Fait » vaut **par
 * rendez-vous** (clé `(examId, mois)`), pas par examen. Fonctions pures, testées dans `logic.test.ts`.
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
 * Fréquence par défaut de chaque examen — `frequenceMois` en **mois**, indépendante du rythme
 * des consultations ; `startMonth` (0 = janvier) est le mois du premier rendez-vous de l'année :
 * l'examen tombe aux mois `startMonth + k × frequenceMois`, y compris hors d'un mois de
 * consultation.
 * Conversion des anciennes valeurs « en nombre de consultations » (base de port : 3 mois) :
 * 1 → 3 mois, 4 → 12 mois, 8 → 24 mois. Seule l'unité change, pas la recommandation.
 * // à revalider (Thibault — ADA/HAS-SFD) : ports fidèles de la maquette, jamais vérifiés
 * cliniquement au câblage.
 */
const DEFAULT_EXAM_FREQUENCY: Record<ExamId, { frequenceMois: number; startMonth: number }> = {
  hba1c: { frequenceMois: 3, startMonth: 0 }, // à revalider (Thibault — ADA/HAS-SFD) — tous les 3 mois
  bilan_lipidique: { frequenceMois: 12, startMonth: 6 }, // à revalider (Thibault — ADA/HAS-SFD) — 1×/an
  rein: { frequenceMois: 12, startMonth: 3 }, // à revalider (Thibault — ADA/HAS-SFD) — 1×/an
  fond_oeil: { frequenceMois: 12, startMonth: 0 }, // à revalider (Thibault — ADA/HAS-SFD) — 1×/an
  pied_complet: { frequenceMois: 12, startMonth: 9 }, // à revalider (Thibault — ADA/HAS-SFD) — 1×/an
  dentiste: { frequenceMois: 12, startMonth: 9 }, // à revalider (Thibault — ADA/HAS-SFD) — 1×/an
  vaccins: { frequenceMois: 24, startMonth: 0 }, // à revalider (Thibault — ADA/HAS-SFD) — 1×/2 ans
};

/** Crans de fréquence proposés à chaque examen (mois). // à revalider (Thibault — ADA/HAS-SFD) */
export const EXAM_FREQUENCY_OPTIONS = [3, 6, 12, 24, 60];

export interface ConsultConfig {
  interval: number;
  startMonth: number;
}

export interface ExamConfig {
  /** Fréquence propre de l'examen, en mois. */
  frequenceMois: number;
  /** Mois (0 = janvier) du premier rendez-vous de l'année. */
  startMonth: number;
}

/** Statuts posés par l'utilisateur, par rendez-vous : clé `examKey(examId, mois)`. Absent = statut par défaut. */
export type ExamStatusOverrides = Record<string, Status>;

/** Libellé d'une fréquence en mois : il dit toujours la fréquence réellement appliquée. */
export function frequencyLabel(frequenceMois: number): string {
  if (frequenceMois === 12) return '1×/an';
  if (frequenceMois > 12 && frequenceMois % 12 === 0) return `tous les ${frequenceMois / 12} ans`;
  return `tous les ${frequenceMois} mois`;
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

/** Configuration initiale des 7 examens (fréquences par défaut, propres à chacun). */
export function initExamConfig(): Record<ExamId, ExamConfig> {
  const out = {} as Record<ExamId, ExamConfig>;
  EXAM_DEFS.forEach((def) => {
    const freq = DEFAULT_EXAM_FREQUENCY[def.id];
    out[def.id] = { frequenceMois: freq.frequenceMois, startMonth: freq.startMonth };
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

/**
 * Mois (0-11, croissants) où un examen tombe sur l'année : `startMonth + k × frequenceMois`,
 * ancrés sur son propre mois, hors de tout mois de consultation. Une fréquence d'un an ou plus
 * donne un seul rendez-vous dans l'année affichée.
 */
export function examOccurrenceMonths(cfg: ExamConfig): number[] {
  const out: number[] = [];
  for (let k = 0; k * cfg.frequenceMois < 12; k++) out.push((cfg.startMonth + k * cfg.frequenceMois) % 12);
  return out.sort((a, b) => a - b);
}

/** Un examen est « cycle long » (bisannuel+) quand il tombe moins d'1×/an. */
export function isLongCycle(cfg: ExamConfig): boolean {
  return cfg.frequenceMois > 12;
}

/** Nombre d'années du cycle long (arrondi). */
export function longCycleYears(cfg: ExamConfig): number {
  return Math.round(cfg.frequenceMois / 12);
}

/**
 * Année de la « prochaine » occurrence d'un cycle long, affichée en badge
 * (« tous les 2 ans — prochain : 20XX »), jamais évaporée (règle gravée ②, cf. brief).
 * Port fidèle de la relation de la maquette (REF_YEAR = année courante − 1).
 */
export function longCycleNextYear(cfg: ExamConfig, currentYear: number): number {
  return currentYear - 1 + longCycleYears(cfg);
}

// ── Statut par rendez-vous : clé (examId, mois) ──────────────────────────────────────────────

/** Clé d'un rendez-vous d'examen : un examen à un mois donné. */
export function examKey(id: ExamId, month: number): string {
  return `${id}:${month}`;
}

/** Statut d'un rendez-vous : celui posé par l'utilisateur, sinon le statut par défaut du mois. */
export function occurrenceStatus(
  overrides: ExamStatusOverrides,
  id: ExamId,
  month: number,
  currentMonth: number,
): Status {
  return overrides[examKey(id, month)] ?? statusForMonth(month, currentMonth);
}

/** Un seul état pour plusieurs statuts : tout fait → fait ; sinon un à programmer → à programmer ; sinon à venir. */
export function aggregateStatus(statuses: Status[]): Status {
  if (statuses.length > 0 && statuses.every((s) => s === 'fait')) return 'fait';
  if (statuses.some((s) => s === 'a_programmer')) return 'a_programmer';
  return 'a_venir';
}

/**
 * Bascule d'un rendez-vous (une station, groupée ou non) : les examens `ids` au mois `month`
 * passent **tous ensemble** de Fait à À programmer, ou à Fait sinon, d'après l'état unique affiché.
 * Aucun autre mois ni autre examen ne bouge. Renvoie un nouvel objet.
 */
export function toggleOccurrenceGroup(
  overrides: ExamStatusOverrides,
  ids: ExamId[],
  month: number,
  currentMonth: number,
): ExamStatusOverrides {
  const shown = aggregateStatus(ids.map((id) => occurrenceStatus(overrides, id, month, currentMonth)));
  const next: Status = shown === 'fait' ? 'a_programmer' : 'fait';
  const out = { ...overrides };
  ids.forEach((id) => {
    out[examKey(id, month)] = next;
  });
  return out;
}
