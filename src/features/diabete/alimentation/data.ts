import type { Famille } from '../lib/glycemieCurve';

/**
 * Garde-manger du module 2 (S5). Base de la maquette (12 aliments) complétée à ~24
 * pour la diversité culturelle demandée (SPEC §6.5 : couscous/semoule, riz basmati,
 * igname/manioc, dattes, galettes de riz, pastèque, pain/pita, pois chiches, patate
 * douce…). Ce n'est PAS une base de données nutritionnelle : l'outil enseigne un
 * principe (composition/qualité/ordre/proportion), pas des valeurs au gramme près.
 *
 * `cg` est une charge glycémique **relative** (échelle 0–100, du même ordre de
 * grandeur que celle utilisée par la maquette d'origine), calibrée pour nourrir
 * `glycemieCurve.paramsFromAssiette` — jamais l'index glycémique (IG). C'est ce qui
 * règle le piège pastèque (IG haut / CG basse, brief §6.5) : on reste on-message.
 * Sources : ordres de grandeur qualitatifs (tables internationales GI/GL, repères
 * SFD) — pas des valeurs cliniques validées. // à revalider (Thibault)
 */

export type CgTier = 'vert' | 'orange' | 'rouge';

export interface Food {
  id: string;
  name: string;
  famille: Famille;
  cg: number;
}

/** Seuils de la pastille CG (relatif, pas l'IG) — cohérents avec la base ci-dessous. */
const CG_TIER_VERT_MAX = 25;
const CG_TIER_ORANGE_MAX = 65;

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
  { id: 'baguette', name: 'Baguette blanche', famille: 'feculents', cg: 85 },
  { id: 'pain-complet', name: 'Pain complet', famille: 'feculents', cg: 55 },
  { id: 'pain-pita', name: 'Pain pita', famille: 'feculents', cg: 72 },
  { id: 'riz-blanc', name: 'Riz blanc', famille: 'feculents', cg: 78 },
  { id: 'riz-basmati', name: 'Riz basmati', famille: 'feculents', cg: 58 },
  { id: 'riz-complet', name: 'Riz complet', famille: 'feculents', cg: 50 },
  { id: 'semoule-couscous', name: 'Semoule / couscous', famille: 'feculents', cg: 60 },
  { id: 'pomme-de-terre', name: 'Pomme de terre / purée', famille: 'feculents', cg: 82 },
  { id: 'patate-douce', name: 'Patate douce', famille: 'feculents', cg: 48 },
  { id: 'igname', name: 'Igname', famille: 'feculents', cg: 45 },
  { id: 'manioc', name: 'Manioc / attiéké', famille: 'feculents', cg: 65 },
  { id: 'galette-riz', name: 'Galette de riz soufflé', famille: 'feculents', cg: 80 },
  { id: 'lentilles', name: 'Lentilles', famille: 'feculents', cg: 22 },
  { id: 'pois-chiches', name: 'Pois chiches', famille: 'feculents', cg: 24 },

  // Fruits — la pastèque est le piège CG explicite (SPEC §6.5) : IG réputé haut,
  // CG basse (petite quantité de glucides par portion) → pastille verte malgré l'idée reçue.
  { id: 'pomme', name: 'Pomme', famille: 'fruits', cg: 15 },
  { id: 'banane', name: 'Banane mûre', famille: 'fruits', cg: 38 },
  { id: 'dattes', name: 'Dattes', famille: 'fruits', cg: 68 },
  { id: 'pasteque', name: 'Pastèque', famille: 'fruits', cg: 18 },

  // Légumes — message : presque tous verts.
  { id: 'brocoli', name: 'Brocoli', famille: 'legumes', cg: 5 },
  { id: 'carotte', name: 'Carotte', famille: 'legumes', cg: 8 },

  // Laitages
  { id: 'yaourt', name: 'Yaourt nature', famille: 'laitiers', cg: 8 },

  // Protéines — CG ~nulle, rôle : aplatir (frein).
  { id: 'poulet', name: 'Poulet', famille: 'proteines', cg: 5 },
  { id: 'oeuf', name: 'Œuf', famille: 'proteines', cg: 5 },

  // Matières grasses — CG ~nulle, rôle : aplatir (frein).
  { id: 'avocat', name: 'Avocat', famille: 'lipides', cg: 3 },
  { id: 'huile-olive', name: "Huile d'olive", famille: 'lipides', cg: 0 },
];

export function foodById(id: string): Food | undefined {
  return FOODS.find((f) => f.id === id);
}
