/**
 * Garde-manger du module 2 (S5). Base de la maquette (12 aliments) complétée à ~24
 * pour la diversité culturelle demandée (SPEC §6.5 : couscous/semoule, riz basmati,
 * igname/manioc, dattes, galettes de riz, pastèque, pain/pita, pois chiches, patate
 * douce…). Ce n'est PAS une base de données nutritionnelle : l'outil enseigne un
 * principe (composition/qualité/ordre/proportion), pas des valeurs au gramme près.
 *
 * Évolution 2026-07-09 (S14 §0.c, demande Thibault) : `cg`/`fibres`/`proteines`/`lipides`
 * sont désormais des **grammes/charge réels par portion usuelle** (ordres de grandeur des
 * tables internationales GI/GL), qui nourrissent directement `glycemieCurve.paramsFromAssiette`
 * — jamais l'index glycémique (IG) seul. `cg` = charge glycémique réelle de la portion
 * (IG × glucides de la portion / 100). C'est ce qui règle le piège pastèque (IG haut / CG
 * basse, brief §6.5) : on reste on-message. La `famille` (regroupement pédagogique par type
 * d'aliment) ne vit plus que côté modules — la lib ne la connaît pas.
 * Sources : ordres de grandeur qualitatifs (tables internationales GI/GL, repères SFD) — pas
 * des valeurs cliniques validées. // à revalider (Thibault)
 *
 * Évolution 2026-07-10 (alimentation-v2 S1, 2ᵉ niveau de lecture) : ajout de `portion`,
 * `sel`, `graisses`, `omega3`, `atout` (champs d'affichage du 2ᵉ niveau de lecture — jamais
 * consommés par `glycemieCurve`), + paliers dérivés `fibresPalier`/`proteinesPalier` (pas de
 * nouveau champ, calculés depuis les grammes existants). **Toutes** les valeurs
 * sel/graisses/omega3/atout ci-dessous sont des ordres de grandeur qualitatifs
 * (tables Ciqual/GI-GL, repères SFD) à revalider par Thibault — voir le rapport de session
 * S1 / `VALIDATION.md`. Ajout de 3 aliments porteurs d'oméga-3 (sardine, saumon, noix, C4) :
 * CG ~nulle, aucun impact sur les seuils du défi ② (paliers de pic non recalibrés).
 */

import type { AlimentRepas } from '../lib/glycemieCurve';

export type Famille = 'feculents' | 'proteines' | 'lipides' | 'legumes' | 'fruits' | 'laitiers';

export type CgTier = 'vert' | 'orange' | 'rouge';

export interface Food extends AlimentRepas {
  id: string;
  name: string;
  famille: Famille;
  // Champs d'affichage du 2ᵉ niveau de lecture — jamais consommés par `glycemieCurve`
  // (glycemieCurve.paramsFromAssiette ne lit que cg/fibres/proteines/lipides via AlimentRepas).
  /** Portion usuelle affichée (ex. « 50 g », « 150 g cuit », « ½ avocat »). */
  portion: string;
  /** Teneur en sel, palier qualitatif. Absent = non pertinent (affiché « — »). */
  sel?: 'faible' | 'modere' | 'eleve';
  /** Qualité dominante des graisses. Absent = quasi sans graisses (affiché « — »). */
  graisses?: 'insaturees' | 'saturees' | 'mixte';
  /** Source notable d'oméga-3 (badge dédié dans le panneau détail). */
  omega3?: boolean;
  /** Phrase-clé pédagogique optionnelle (ex. le piège pastèque). Une seule phrase courte. */
  atout?: string;
}

/** Seuils standards publiés de la pastille CG (charge glycémique réelle par portion). */
const CG_TIER_VERT_MAX = 10;
const CG_TIER_ORANGE_MAX = 19;

export function cgTier(cg: number): CgTier {
  if (cg <= CG_TIER_VERT_MAX) return 'vert';
  if (cg <= CG_TIER_ORANGE_MAX) return 'orange';
  return 'rouge';
}

export const CG_TIER_COLOR_VAR: Record<CgTier, string> = {
  vert: '--color-confort',
  orange: '--color-vigilance',
  rouge: '--color-toxique',
};

export const CG_TIER_LABEL: Record<CgTier, string> = {
  vert: 'Charge glycémique basse',
  orange: 'Charge glycémique moyenne',
  rouge: 'Charge glycémique haute',
};

// ---------------------------------------------------------------------------
// Paliers qualitatifs dérivés (2ᵉ niveau de lecture, alimentation-v2 S1). Pas de nouveau
// champ sur Food : fibres/proteines restent des grammes réels (consommés par la courbe) ;
// ces fonctions dérivent un palier d'affichage à la volée. Seuils = ordres de grandeur
// pédagogiques, pas des repères nutritionnels cliniques.
// ---------------------------------------------------------------------------

export type Palier3 = 1 | 2 | 3; // 1 = faible · 2 = bon/modéré · 3 = élevé

const FIBRES_PALIER_FAIBLE_MAX = 2; // g, exclu — en dessous : « peu ». à revalider (Thibault)
const FIBRES_PALIER_BON_MAX = 4; // g, inclus — au-dessus : « très riche ». à revalider (Thibault)

const PROTEINES_PALIER_FAIBLE_MAX = 5; // g, exclu. à revalider (Thibault)
const PROTEINES_PALIER_BON_MAX = 15; // g, inclus. à revalider (Thibault)

export function fibresPalier(g: number): Palier3 {
  if (g < FIBRES_PALIER_FAIBLE_MAX) return 1;
  if (g <= FIBRES_PALIER_BON_MAX) return 2;
  return 3;
}

export function proteinesPalier(g: number): Palier3 {
  if (g < PROTEINES_PALIER_FAIBLE_MAX) return 1;
  if (g <= PROTEINES_PALIER_BON_MAX) return 2;
  return 3;
}

export const PALIER_FIBRES_LABEL: Record<Palier3, string> = {
  1: 'peu',
  2: 'bonne source',
  3: 'très riche',
};

export const PALIER_PROTEINES_LABEL: Record<Palier3, string> = {
  1: 'peu',
  2: 'bonne source',
  3: 'très riche',
};

export const SEL_LABEL: Record<NonNullable<Food['sel']>, string> = {
  faible: 'faible',
  modere: 'modéré',
  eleve: 'élevé',
};

// Texte simple, sans emoji (la mise en forme visuelle appartient à S3).
export const GRAISSES_LABEL: Record<NonNullable<Food['graisses']>, string> = {
  insaturees: 'insaturées',
  saturees: 'saturées',
  mixte: 'mixte',
};

export const FAMILIES: { id: Famille; label: string }[] = [
  { id: 'feculents', label: 'Féculents' },
  { id: 'legumes', label: 'Légumes' },
  { id: 'proteines', label: 'Protéines' },
  { id: 'lipides', label: 'Lipides' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'laitiers', label: 'Laitiers' },
];

// prettier-ignore
export const FOODS: Food[] = [
  // Féculents & pains — cœur du jeu (SPEC §6.5) : variété au sein de la famille pour
  // comparer (défi 2 « Qualité »). Lentilles/pois chiches = légumineuses, la « pépite
  // pédagogique » : féculent ET riches en fibres → CG basse malgré la famille.
  // sel/graisses/omega3/atout : ordres de grandeur qualitatifs (Ciqual/GI-GL, repères SFD) —
  // à revalider (Thibault) dans leur intégralité (cf. rapport de session S1 / VALIDATION.md).
  { id: 'baguette', name: 'Baguette blanche', famille: 'feculents', cg: 22, fibres: 1.5, proteines: 4, lipides: 1, portion: '50 g', sel: 'eleve', atout: 'Le pain, une source de sel insoupçonnée du quotidien.' },
  { id: 'pain-complet', name: 'Pain complet', famille: 'feculents', cg: 14, fibres: 3.5, proteines: 5, lipides: 1.5, portion: '50 g', sel: 'modere' },
  { id: 'pain-pita', name: 'Pain pita', famille: 'feculents', cg: 19, fibres: 2, proteines: 5, lipides: 1, portion: '60 g', sel: 'modere' },
  { id: 'riz-blanc', name: 'Riz blanc', famille: 'feculents', cg: 28, fibres: 1, proteines: 4, lipides: 0.5, portion: '150 g cuit', sel: 'faible' },
  { id: 'riz-basmati', name: 'Riz basmati', famille: 'feculents', cg: 19, fibres: 1.5, proteines: 4, lipides: 0.5, portion: '150 g cuit', sel: 'faible' },
  { id: 'riz-complet', name: 'Riz complet', famille: 'feculents', cg: 16, fibres: 3, proteines: 4.5, lipides: 1.5, portion: '150 g cuit', sel: 'faible' },
  { id: 'semoule-couscous', name: 'Semoule / couscous', famille: 'feculents', cg: 23, fibres: 2, proteines: 5, lipides: 0.5, portion: '150 g cuit', sel: 'faible' },
  { id: 'pomme-de-terre', name: 'Pomme de terre / purée', famille: 'feculents', cg: 18, fibres: 2, proteines: 3, lipides: 0.5, portion: '150 g', sel: 'modere' }, // sel : purée généralement salée/beurrée — à revalider (nature vs purée)
  { id: 'patate-douce', name: 'Patate douce', famille: 'feculents', cg: 12, fibres: 4, proteines: 2.5, lipides: 0, portion: '150 g', sel: 'faible' },
  { id: 'igname', name: 'Igname', famille: 'feculents', cg: 13, fibres: 4, proteines: 2.5, lipides: 0, portion: '150 g', sel: 'faible' },
  { id: 'manioc', name: 'Manioc / attiéké', famille: 'feculents', cg: 14, fibres: 2.5, proteines: 1.5, lipides: 0.5, portion: '150 g', sel: 'faible' },
  { id: 'galette-riz', name: 'Galette de riz soufflé', famille: 'feculents', cg: 17, fibres: 0.5, proteines: 1, lipides: 0.5, portion: '3 galettes (~25 g)', sel: 'faible' },
  { id: 'lentilles', name: 'Lentilles', famille: 'feculents', cg: 6, fibres: 8, proteines: 12, lipides: 0.5, portion: '150 g cuites', sel: 'faible', atout: 'Légumineuse : un féculent qui monte doucement (riche en fibres et protéines).' },
  { id: 'pois-chiches', name: 'Pois chiches', famille: 'feculents', cg: 8, fibres: 7, proteines: 10, lipides: 3, portion: '150 g cuits', sel: 'faible', atout: 'Légumineuse : un féculent qui monte doucement (riche en fibres et protéines).' },

  // Fruits — la pastèque est le piège CG explicite (SPEC §6.5) : IG réputé haut,
  // CG basse (petite quantité de glucides par portion) → pastille verte malgré l'idée reçue.
  { id: 'pomme', name: 'Pomme', famille: 'fruits', cg: 6, fibres: 3, proteines: 0.5, lipides: 0, portion: '1 (120 g)', sel: 'faible' },
  { id: 'banane', name: 'Banane mûre', famille: 'fruits', cg: 12, fibres: 2.5, proteines: 1, lipides: 0, portion: '1 (120 g)', sel: 'faible' },
  { id: 'dattes', name: 'Dattes', famille: 'fruits', cg: 25, fibres: 4, proteines: 1.5, lipides: 0, portion: '5 (~60 g)', sel: 'faible' },
  { id: 'pasteque', name: 'Pastèque', famille: 'fruits', cg: 4, fibres: 0.5, proteines: 0.5, lipides: 0, portion: '120 g', sel: 'faible', atout: 'IG réputé haut, mais charge glycémique basse par portion — la pastèque, ça va.' },

  // Légumes — message : presque tous verts.
  { id: 'brocoli', name: 'Brocoli', famille: 'legumes', cg: 1, fibres: 4, proteines: 3, lipides: 0, portion: '100 g', sel: 'faible' },
  { id: 'carotte', name: 'Carotte', famille: 'legumes', cg: 2, fibres: 3, proteines: 1, lipides: 0, portion: '80 g', sel: 'faible' },

  // Laitages
  { id: 'yaourt', name: 'Yaourt nature', famille: 'laitiers', cg: 3, fibres: 0, proteines: 5, lipides: 3, portion: '125 g', sel: 'faible' }, // graisses : quasi sans graisses au sens du palier d'affichage malgré 3 g de lipides — à revalider

  // Protéines — CG ~nulle, rôle : aplatir (frein).
  { id: 'poulet', name: 'Poulet', famille: 'proteines', cg: 0, fibres: 0, proteines: 28, lipides: 4, portion: '120 g', sel: 'faible', graisses: 'mixte' }, // sel/graisses : poulet nature présumé, très variable selon préparation — à revalider
  { id: 'oeuf', name: 'Œuf', famille: 'proteines', cg: 0, fibres: 0, proteines: 13, lipides: 10, portion: '2 œufs', sel: 'faible', graisses: 'saturees' }, // graisses : jaune riche en graisses plutôt saturées — à revalider

  // Matières grasses — CG ~nulle, rôle : aplatir (frein).
  { id: 'avocat', name: 'Avocat', famille: 'lipides', cg: 0, fibres: 5, proteines: 2, lipides: 15, portion: '½', sel: 'faible', graisses: 'insaturees' },
  { id: 'huile-olive', name: "Huile d'olive", famille: 'lipides', cg: 0, fibres: 0, proteines: 0, lipides: 10, portion: '1 c. à s.', graisses: 'insaturees' }, // sel : non pertinent (matière grasse pure)

  // Oméga-3 (C4, validé Thibault 2026-07-09) — CG ~nulle, aucun impact sur les seuils
  // PEAK_BAS_MAX/PEAK_HAUT_MIN du défi ② (pas de recalibrage nécessaire).
  { id: 'sardine', name: 'Sardine', famille: 'proteines', cg: 0, fibres: 0, proteines: 20, lipides: 10, portion: '~100 g', sel: 'eleve', omega3: true, graisses: 'insaturees' }, // sel : conserve, généralement salée — à revalider ; grammes proteines/lipides à revalider
  { id: 'saumon', name: 'Saumon', famille: 'proteines', cg: 0, fibres: 0, proteines: 24, lipides: 13, portion: '~120 g', sel: 'faible', omega3: true, graisses: 'insaturees' }, // sel : saumon nature présumé (hors fumé) — à revalider ; grammes à revalider
  { id: 'noix', name: 'Noix', famille: 'lipides', cg: 1, fibres: 2, proteines: 4, lipides: 20, portion: 'poignée (~30 g)', omega3: true, graisses: 'insaturees' }, // grammes à revalider ; sel non pertinent (non salées)

  // S7 (illustrations-diabete, 2026-07-10) : 5 aliments féculents supplémentaires, ordres de
  // grandeur Ciqual/GI-GL — // à revalider (Thibault) dans leur intégralité, comme le reste
  // de la table. Pâtes (GI plus bas que le riz blanc) et couscous complet en écho aux
  // versions déjà présentes (riz complet, pain complet) ; plantain classé féculent (cuisiné
  // comme un féculent, à la différence de la banane mûre) ; haricots rouges = légumineuse,
  // même « pépite pédagogique » que lentilles/pois chiches.
  { id: 'pates-blanches', name: 'Pâtes blanches', famille: 'feculents', cg: 18, fibres: 2, proteines: 5.5, lipides: 1, portion: '150 g cuites', sel: 'faible' }, // à revalider (Thibault)
  { id: 'pates-completes', name: 'Pâtes complètes', famille: 'feculents', cg: 12, fibres: 4, proteines: 6, lipides: 1.5, portion: '150 g cuites', sel: 'faible' }, // à revalider (Thibault)
  { id: 'couscous-complet', name: 'Couscous complet', famille: 'feculents', cg: 14, fibres: 4, proteines: 5.5, lipides: 1, portion: '150 g cuit', sel: 'faible' }, // à revalider (Thibault)
  { id: 'banane-plantain', name: 'Banane plantain', famille: 'feculents', cg: 20, fibres: 3, proteines: 1.5, lipides: 0.3, portion: '150 g cuite', sel: 'faible' }, // à revalider (Thibault)
  { id: 'haricots-rouges', name: 'Haricots rouges', famille: 'feculents', cg: 7, fibres: 7, proteines: 9, lipides: 0.5, portion: '150 g cuits', sel: 'faible', atout: 'Légumineuse : un féculent qui monte doucement (riche en fibres et protéines).' }, // à revalider (Thibault)
];

export function foodById(id: string): Food | undefined {
  return FOODS.find((f) => f.id === id);
}
