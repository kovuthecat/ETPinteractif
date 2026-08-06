/**
 * Les 13 activités du quotidien, partagées entre `diabete/activite/ActiviteModule.tsx` (temps ②,
 * jauge ouverte) et `cardio/bouger/BougerModule.tsx` (onglet Volume) — extraites le 2026-08-06
 * (`plans/recette-outils-2026-08/S7.md`) après constat de duplication verbatim entre les deux
 * `data.ts`/modules (mêmes `id`/`nom`/`minutes`/`muscle`, seul `intensite` différait). Même
 * principe de partage que `repas-types.ts` et `content/tabac/substituts.ts`.
 *
 * `intensite` reste optionnelle : seul le diabète l'affiche (filtre « toniques uniquement »,
 * taille d'illustration) — le cardio ne la lit pas.
 */

export interface ActiviteDef {
  id: string;
  nom: string;
  /** Minutes par défaut (ajustables par pas de 5, cf. `ACT_MIN_STEP`/`ACT_MIN_FLOOR`/`ACT_MIN_CEIL`). */
  minutes: number;
  /** Utilisée uniquement côté diabète (filtre « toniques uniquement », taille d'illustration). */
  intensite?: 'légère' | 'modérée';
  /** Marqueur discret « bon pour les muscles » — jamais une catégorie séparée. */
  muscle: boolean;
}

/** Les 13 activités, verbatim (id/nom/minutes/intensité/muscle). */
export const ACTIVITIES: ActiviteDef[] = [
  { id: 'marche', nom: 'Marche', minutes: 20, intensite: 'légère', muscle: false },
  { id: 'velo', nom: 'Vélo', minutes: 30, intensite: 'modérée', muscle: false },
  { id: 'menage', nom: 'Ménage', minutes: 15, intensite: 'légère', muscle: false },
  { id: 'bricolage', nom: 'Bricolage', minutes: 25, intensite: 'modérée', muscle: false },
  { id: 'jardinage', nom: 'Jardinage', minutes: 30, intensite: 'modérée', muscle: false },
  { id: 'courses', nom: 'Porter les courses', minutes: 10, intensite: 'légère', muscle: true },
  { id: 'escaliers', nom: 'Prendre les escaliers', minutes: 5, intensite: 'modérée', muscle: true },
  { id: 'chaise', nom: 'Se lever d’une chaise', minutes: 5, intensite: 'légère', muscle: true },
  { id: 'danse', nom: 'Danser', minutes: 20, intensite: 'modérée', muscle: false },
  { id: 'petitsenfants', nom: 'Jouer avec les enfants', minutes: 15, intensite: 'légère', muscle: false },
  { id: 'voiture', nom: 'Laver la voiture', minutes: 20, intensite: 'modérée', muscle: false },
  { id: 'chien', nom: 'Marcher le chien', minutes: 15, intensite: 'légère', muscle: false },
  { id: 'sol', nom: 'Se relever du sol', minutes: 5, intensite: 'légère', muscle: true },
];

export const ACT_MIN_STEP = 5;
export const ACT_MIN_FLOOR = 5;
export const ACT_MIN_CEIL = 180;
