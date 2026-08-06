/**
 * Logique pure de l'onglet « Régularité » du module Bouger (M7) : décroissance de la protection
 * cardiovasculaire estimée jour par jour sans activité, et son codage couleur. Extraite du
 * composant (2026-08-06, `plans/recette-outils-2026-08/S3.md`) pour figer par test la cohérence
 * avec le repère affiché à l'écran (« pas plus de 2 jours consécutifs sans activité ») — un jour
 * actif ramène la protection à 100, chaque jour inactif la fait décroître, plancher 0.
 */

/**
 * Décroissance de la protection : -30 par jour sans activité. Réglée pour que 2 jours de repos
 * consécutifs restent vert/ambre et que le rouge n'arrive qu'au 3ᵉ jour — quand le repère
 * « pas plus de 2 jours consécutifs » est effectivement dépassé. (Avant réglage : -45/jour,
 * seuils 60/25 — le 2ᵉ jour de repos passait déjà au rouge, contraire au principe « jauge sans
 * plafond » du brief M7.)
 */
export const PROTECTION_DECAY = 30;

export function protectionColor(v: number): string {
  if (v >= 55) return 'var(--color-confort)';
  if (v >= 20) return 'var(--color-vigilance)';
  return 'var(--color-toxique)';
}

/** Valeur de protection (0-100) pour chaque jour de `weekActive`, dans l'ordre. */
export function protectionValues(weekActive: boolean[]): number[] {
  let prot = 0;
  return weekActive.map((on) => {
    prot = on ? 100 : Math.max(0, prot - PROTECTION_DECAY);
    return prot;
  });
}
