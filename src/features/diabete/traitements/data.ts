/**
 * Module 7 — Traitements : données CLASSES/ZONE_MSG, portées **verbatim** depuis la maquette
 * (`Module 7 - Traitements.dc.html`), cf. plans/theme-diabete/S10.md « Décision clé ».
 *
 * Anti-obsolescence (brief §Module 7) : la zone d'action est attachée à la CLASSE (durable),
 * jamais à la molécule (étiquette volatile saisie par le soignant). Ajouter un médicament =
 * ajouter une étiquette + choisir sa classe, rien à redessiner ici.
 *
 * // à revalider (Thibault) : fréquences et libellés « quoi surveiller » de ce fichier sont
 * repris de la maquette telle quelle — à valider cliniquement avant tout usage en consultation
 * (cf. garde-fous transverses de l'index du plan).
 */

/** Zones défendues par une classe. `sucre` est systémique (halo), `coeur`/`reins` sont des
 *  ancres réelles de `Silhouette` (S3). */
export type ZoneTraitementId = 'sucre' | 'coeur' | 'reins';

export interface ClasseTraitement {
  id: string;
  label: string;
  zones: ZoneTraitementId[];
  /** Quand, en picto/texte sur la ligne. */
  freq: string;
  /** Pastille 2ᵉ niveau « Quoi surveiller » (verbatim maquette, préfixe inclus). */
  watch: string;
  /** Cette classe peut faire l'hypo → la pastille « quoi surveiller » devient aussi une porte
   *  vers le module Hypoglycémie (D10). */
  peutHypo?: boolean;
  /** Classe insuline → porte supplémentaire vers le module Insuline (D10). */
  estInsuline?: boolean;
  /** Métaphore clé/serrure (module « C'est quoi le diabète ») : 'serrure' = agit sur
   *  l'insulinorésistance (cellule verrouillée) ; 'cle' = agit sur la sécrétion d'insuline.
   *  Optionnel : les classes hors métaphore (action rénale, cardio, lipidique) n'en ont pas.
   *  // à revalider (Thibault) — notamment le classement iDPP4/aGLP1 en « sécrétion ». */
  picto?: 'serrure' | 'cle';
}

export const CLASSES: ClasseTraitement[] = [
  {
    id: 'metformine',
    label: 'Metformine (biguanide)',
    zones: ['sucre'],
    freq: 'Matin et soir, au repas',
    watch: 'Quoi surveiller : troubles digestifs possibles au début',
    picto: 'serrure',
  },
  {
    id: 'sulfamide',
    label: 'Sulfamide hypoglycémiant',
    zones: ['sucre'],
    freq: 'Avant les repas',
    watch: "Quoi surveiller : peut faire l'hypoglycémie",
    peutHypo: true,
    picto: 'cle',
  },
  {
    id: 'idpp4',
    label: 'iDPP4 (inhibiteur DPP-4)',
    zones: ['sucre'],
    freq: '1 fois par jour',
    watch: 'Quoi surveiller : généralement bien toléré',
    picto: 'cle',
  },
  {
    id: 'aglp1',
    label: 'aGLP1 (agoniste du GLP-1)',
    zones: ['sucre', 'coeur'],
    freq: '1 fois par semaine (injection)',
    watch: 'Quoi surveiller : peut donner des nausées au début',
    picto: 'cle',
  },
  {
    id: 'gliflozine',
    label: 'Gliflozine (iSGLT2)',
    zones: ['sucre', 'coeur', 'reins'],
    freq: '1 fois par jour, le matin',
    watch: "Quoi surveiller : bien s'hydrater ; risque d'infection urinaire",
  },
  {
    id: 'ieca',
    label: 'IEC / ARA2',
    zones: ['coeur', 'reins'],
    freq: '1 fois par jour',
    watch: 'Quoi surveiller : tension et fonction rénale contrôlées régulièrement',
  },
  {
    id: 'statine',
    label: 'Statine',
    zones: ['coeur'],
    freq: '1 fois par jour, le soir',
    watch: 'Quoi surveiller : douleurs musculaires (rares) à signaler',
  },
  {
    id: 'insuline',
    label: 'Insuline basale',
    zones: ['sucre'],
    freq: '1 fois par jour, le soir',
    watch: "Quoi surveiller : peut faire l'hypoglycémie — voir le module Hypoglycémie",
    peutHypo: true,
    estInsuline: true,
    picto: 'cle',
  },
];

export function classById(id: string): ClasseTraitement {
  return CLASSES.find((c) => c.id === id) ?? CLASSES[0];
}

/** Phrase composée sur la zone, verbatim maquette. */
export const ZONE_MSG: Record<ZoneTraitementId, string> = {
  sucre: 'agit sur le sucre : elle aide le corps à mieux le réguler.',
  coeur: 'protège aussi le cœur.',
  reins: 'protège aussi les reins.',
};

export interface Ligne {
  uid: string;
  molecule: string;
  classId: string;
}

let ligneUid = 0;
export function newLigne(molecule: string, classId: string): Ligne {
  ligneUid += 1;
  return { uid: `l${ligneUid}`, molecule, classId };
}

/** Lignes initiales (C3 « revue-chrome-2026-07 ») : ordonnance vide à l'ouverture. */
export function lignesInitiales(): Ligne[] {
  return [];
}
