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
 */

import type { AlimentRepas } from '../lib/glycemieCurve';

export type Famille = 'feculents' | 'proteines' | 'lipides' | 'legumes' | 'fruits' | 'laitiers';

export type CgTier = 'vert' | 'orange' | 'rouge';

export interface Food extends AlimentRepas {
  id: string;
  name: string;
  famille: Famille;
  /** Portion usuelle documentée (commentaire, pas un champ consommé par la courbe). */
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
  { id: 'baguette', name: 'Baguette blanche', famille: 'feculents', cg: 22, fibres: 1.5, proteines: 4, lipides: 1 }, // 50 g
  { id: 'pain-complet', name: 'Pain complet', famille: 'feculents', cg: 14, fibres: 3.5, proteines: 5, lipides: 1.5 }, // 50 g
  { id: 'pain-pita', name: 'Pain pita', famille: 'feculents', cg: 19, fibres: 2, proteines: 5, lipides: 1 }, // 60 g
  { id: 'riz-blanc', name: 'Riz blanc', famille: 'feculents', cg: 28, fibres: 1, proteines: 4, lipides: 0.5 }, // 150 g cuit
  { id: 'riz-basmati', name: 'Riz basmati', famille: 'feculents', cg: 19, fibres: 1.5, proteines: 4, lipides: 0.5 }, // 150 g cuit
  { id: 'riz-complet', name: 'Riz complet', famille: 'feculents', cg: 16, fibres: 3, proteines: 4.5, lipides: 1.5 }, // 150 g cuit
  { id: 'semoule-couscous', name: 'Semoule / couscous', famille: 'feculents', cg: 23, fibres: 2, proteines: 5, lipides: 0.5 }, // 150 g cuit
  { id: 'pomme-de-terre', name: 'Pomme de terre / purée', famille: 'feculents', cg: 18, fibres: 2, proteines: 3, lipides: 0.5 }, // 150 g
  { id: 'patate-douce', name: 'Patate douce', famille: 'feculents', cg: 12, fibres: 4, proteines: 2.5, lipides: 0 }, // 150 g
  { id: 'igname', name: 'Igname', famille: 'feculents', cg: 13, fibres: 4, proteines: 2.5, lipides: 0 }, // 150 g
  { id: 'manioc', name: 'Manioc / attiéké', famille: 'feculents', cg: 14, fibres: 2.5, proteines: 1.5, lipides: 0.5 }, // 150 g
  { id: 'galette-riz', name: 'Galette de riz soufflé', famille: 'feculents', cg: 17, fibres: 0.5, proteines: 1, lipides: 0.5 }, // 3 galettes (~25 g)
  { id: 'lentilles', name: 'Lentilles', famille: 'feculents', cg: 6, fibres: 8, proteines: 12, lipides: 0.5 }, // 150 g cuites
  { id: 'pois-chiches', name: 'Pois chiches', famille: 'feculents', cg: 8, fibres: 7, proteines: 10, lipides: 3 }, // 150 g cuits

  // Fruits — la pastèque est le piège CG explicite (SPEC §6.5) : IG réputé haut,
  // CG basse (petite quantité de glucides par portion) → pastille verte malgré l'idée reçue.
  { id: 'pomme', name: 'Pomme', famille: 'fruits', cg: 6, fibres: 3, proteines: 0.5, lipides: 0 }, // 1 (120 g)
  { id: 'banane', name: 'Banane mûre', famille: 'fruits', cg: 12, fibres: 2.5, proteines: 1, lipides: 0 }, // 1 (120 g)
  { id: 'dattes', name: 'Dattes', famille: 'fruits', cg: 25, fibres: 4, proteines: 1.5, lipides: 0 }, // 5 (~60 g)
  { id: 'pasteque', name: 'Pastèque', famille: 'fruits', cg: 4, fibres: 0.5, proteines: 0.5, lipides: 0 }, // 120 g

  // Légumes — message : presque tous verts.
  { id: 'brocoli', name: 'Brocoli', famille: 'legumes', cg: 1, fibres: 4, proteines: 3, lipides: 0 }, // 100 g
  { id: 'carotte', name: 'Carotte', famille: 'legumes', cg: 2, fibres: 3, proteines: 1, lipides: 0 }, // 80 g

  // Laitages
  { id: 'yaourt', name: 'Yaourt nature', famille: 'laitiers', cg: 3, fibres: 0, proteines: 5, lipides: 3 }, // 125 g

  // Protéines — CG ~nulle, rôle : aplatir (frein).
  { id: 'poulet', name: 'Poulet', famille: 'proteines', cg: 0, fibres: 0, proteines: 28, lipides: 4 }, // 120 g
  { id: 'oeuf', name: 'Œuf', famille: 'proteines', cg: 0, fibres: 0, proteines: 13, lipides: 10 }, // 2 œufs

  // Matières grasses — CG ~nulle, rôle : aplatir (frein).
  { id: 'avocat', name: 'Avocat', famille: 'lipides', cg: 0, fibres: 5, proteines: 2, lipides: 15 }, // ½
  { id: 'huile-olive', name: "Huile d'olive", famille: 'lipides', cg: 0, fibres: 0, proteines: 0, lipides: 10 }, // 1 c. à s.
];

export function foodById(id: string): Food | undefined {
  return FOODS.find((f) => f.id === id);
}
