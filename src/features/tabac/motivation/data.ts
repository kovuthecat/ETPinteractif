import { Bird, HeartPulse, Star, Users, Utensils, Wallet, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Contenu partagé du module « Motivation » (S11) : graines de raisons + icône
 * associée à chaque libellé. Extrait de `MotivationModule` pour être réutilisé
 * sans duplication par le livret d'accompagnement (PrintableLivret) et par
 * « Mon plan d'arrêt » (mêmes libellés que la réserve du tableau des raisons).
 */

export const MOTIVATION_SEED = [
  'Ma santé',
  'Mes proches',
  'Le budget',
  "Le goût / l'odorat",
  'Mon souffle / ma forme',
  'Ma liberté',
];

export const RAISON_ICONS: Record<string, LucideIcon> = {
  'Ma santé': HeartPulse,
  "Le goût / l'odorat": Utensils,
  'Mes proches': Users,
  'Le budget': Wallet,
  'Mon souffle / ma forme': Wind,
  'Ma liberté': Bird,
};

/** Icône d'une raison (fallback `Star` pour une raison libre non répertoriée). */
export function iconForRaison(label: string): LucideIcon {
  return RAISON_ICONS[label] ?? Star;
}
