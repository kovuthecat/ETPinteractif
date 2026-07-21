/**
 * Données des 4 checklists servies par `OutilChecklist.tsx` (OI7,
 * plans/outils-interactifs-2026-07/S4.md). Fichier volontairement séparé de
 * `src/content/tabac/outils.ts` (zone disjointe des autres sessions Vague 2).
 *
 * Contenu transcrit verbatim depuis `proposition`/`consigneFiche` des outils correspondants
 * dans `outils.ts` (place-nette l.129-141, mains-bouche l.156-168, anti-ennui l.211-223,
 * routine l.142-155) — NE PAS reformuler le sens. Listes figées G4 (2026-07-21) : items
 * pré-remplis + ajout libre pour les 4 outils.
 */

export interface ChecklistGroupe {
  label: string;
  items: string[];
}

export interface ChecklistPaire {
  rituel: string;
  /** substitution suggérée, éditable par le patient dans `OutilChecklist`. */
  suggestion: string;
}

export interface ChecklistData {
  /** checklist groupée (place-nette : Maison / Voiture). */
  groupes?: ChecklistGroupe[];
  /** checklist plate à cocher (mains-bouche, anti-ennui). */
  items?: string[];
  /** paires rituel → substitution éditable (routine). */
  paires?: ChecklistPaire[];
  /** l'outil autorise l'ajout de lignes libres, en plus des suggestions. */
  ajoutLibre: boolean;
  /** objectif indicatif de nombre d'items choisis (anti-ennui : ~10) — jamais bloquant. */
  cible?: number;
}

/** Sous-ensemble de `Outil['interactif']` servi par ce composant générique (S4, OI7). */
export type ChecklistInteractifId = 'place-nette' | 'mains-bouche' | 'anti-ennui' | 'routine';

export const CHECKLISTS: Record<ChecklistInteractifId, ChecklistData> = {
  'place-nette': {
    groupes: [
      {
        label: 'Maison',
        items: ['Ranger cendriers et briquets hors de vue', 'Ne plus garder de cigarettes à la maison'],
      },
      {
        label: 'Voiture',
        items: [
          'Vider le cendrier',
          'Vider la boîte à gants',
          'Mettre des pastilles à la menthe à la place',
        ],
      },
    ],
    ajoutLibre: true,
  },
  'mains-bouche': {
    items: ['Chewing-gum sans sucre', 'Balle anti-stress', "Grand verre d'eau", 'Stylo à manipuler'],
    ajoutLibre: true,
  },
  'anti-ennui': {
    items: [
      "Appeler quelqu'un",
      'Ranger un tiroir',
      'Arroser les plantes',
      "S'étirer",
      'Écouter un podcast',
      'Marcher en mâchant un chewing-gum',
    ],
    ajoutLibre: true,
    cible: 10,
  },
  routine: {
    paires: [
      {
        rituel: 'Café',
        suggestion: 'Une autre pièce / debout, ou un thé les 2-3 premières semaines',
      },
      {
        rituel: 'Fin de repas',
        suggestion: 'Se lever de table aussitôt (dents, vaisselle, 5 min dehors)',
      },
      { rituel: 'Pause', suggestion: 'Dans un lieu où on ne peut pas fumer' },
    ],
    ajoutLibre: true,
  },
};

export function isChecklistInteractifId(id: string | undefined): id is ChecklistInteractifId {
  return id !== undefined && Object.prototype.hasOwnProperty.call(CHECKLISTS, id);
}
