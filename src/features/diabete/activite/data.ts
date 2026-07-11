/**
 * Données statiques du module 3 (Activité physique) : reprises verbatim de la
 * maquette (`Module 3 - Activite physique.dc.html`, script `ACTIVITIES` + textes des
 * 4 rayons du temps ①). Séparé du composant pour rester lisible — pas de logique ici.
 */

/** Un des 4 bénéfices du temps ① (rayonnement). */
export type RayonId = 'sucre' | 'coeur' | 'tete' | 'autonomie';

export interface RayonDef {
  id: RayonId;
  /** Libellé court affiché sur le nœud (peut tenir sur 2 lignes). */
  label: string[];
  /** Texte affiché en légende quand ce rayon (et lui seul) est actif — verbatim maquette. */
  desc: string;
  /**
   * Ordre de grandeur sourcé (2ᵉ niveau, au survol uniquement — SPEC §8.1 : jamais de
   * SMD/HR brut à l'écran). `undefined` pour les rayons sans chiffre publiable en l'état.
   */
  source?: string;
}

/** Les 4 rayons, dans l'ordre du motif (haut · droite · bas · gauche) — cf. BRIEF §8.1. */
export const RAYONS: RayonDef[] = [
  {
    id: 'sucre',
    label: ['Sucre'],
    desc: 'Écrête le pic de glycémie après le repas — porte vers la suite.',
    source: "Exercice structuré : −0,5 à −0,8 point d'HbA1c, un effet comparable à la metformine.",
  },
  {
    id: 'coeur',
    label: ['Cœur &', 'vaisseaux'],
    desc: 'Protège le cœur et les vaisseaux.',
    source: 'Bénéfice démontré sur la tension, le cholestérol et le risque cardiovasculaire.',
  },
  {
    id: 'tete',
    label: ['Tête'],
    desc: 'Moral, sommeil et stress apaisés.',
    source: "Effet comparable à d'autres approches non médicamenteuses de l'anxiété et de la dépression.",
  },
  {
    id: 'autonomie',
    label: ['Autonomie'],
    desc: 'Force, équilibre, moins de chutes.',
    source: 'Renforcement musculaire et équilibre : moins de chutes, plus de facilité au quotidien.',
  },
];

/** Une activité du quotidien proposée au temps ② (jauge ouverte). */
export interface ActiviteDef {
  id: string;
  nom: string;
  /** Minutes par défaut (ajustables ±5 par l'utilisateur, cf. `ACT_MIN_STEP`/`ACT_MIN_FLOOR`). */
  minutes: number;
  intensite: 'légère' | 'modérée';
  /** Marqueur discret « bon pour les muscles » — jamais une catégorie séparée (BRIEF §8.1-②). */
  muscle: boolean;
}

/** Les 12 activités de la maquette, verbatim (id/nom/minutes/intensité/muscle). */
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
