/**
 * Données statiques du module 3 (Activité physique) : reprises verbatim de la
 * maquette (`Module 3 - Activite physique.dc.html`, script `ACTIVITIES` + textes des
 * 4 rayons du temps ①). Séparé du composant pour rester lisible — pas de logique ici.
 *
 * `ActiviteDef`/`ACTIVITIES`/`ACT_MIN_*` (temps ②) vivent désormais dans `src/content/activites.ts`,
 * partagées avec `cardio/bouger/BougerModule.tsx` (2026-08-06, `plans/recette-outils-2026-08/S7.md`)
 * — ré-exportées ici pour ne pas casser les imports existants de `ActiviteModule.tsx`.
 */
export {
  ACTIVITIES,
  ACT_MIN_STEP,
  ACT_MIN_FLOOR,
  ACT_MIN_CEIL,
  type ActiviteDef,
} from '../../../content/activites';

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
