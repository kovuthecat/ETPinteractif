export type PilierId = 'physique' | 'psychologique' | 'comportementale';

export interface SituationDef {
  id: string;
  label: string;
  pilier: PilierId;
}

export const SITUATIONS: SituationDef[] = [
  // Physique — signes du manque
  { id: 'manque', label: 'Manque', pilier: 'physique' },
  { id: 'irritabilite', label: 'Irritabilité', pilier: 'physique' },
  { id: 'nervosite', label: 'Nervosité', pilier: 'physique' },
  { id: 'concentration', label: 'Concentration difficile', pilier: 'physique' },
  { id: 'sommeil', label: 'Sommeil perturbé', pilier: 'physique' },
  { id: 'fringales', label: 'Fringales', pilier: 'physique' },
  { id: 'craving', label: 'Envie irrépressible', pilier: 'physique' },
  // Psychologique — fonctions de la cigarette
  { id: 'stress', label: 'Stress', pilier: 'psychologique' },
  { id: 'anxiete', label: 'Anxiété', pilier: 'psychologique' },
  { id: 'ennui', label: 'Ennui', pilier: 'psychologique' },
  { id: 'plaisir', label: 'Plaisir / récompense', pilier: 'psychologique' },
  { id: 'stimulation', label: 'Stimulation', pilier: 'psychologique' },
  { id: 'deprime', label: '« Anti-déprime »', pilier: 'psychologique' },
  // Comportementale — automatismes
  { id: 'cafe', label: 'Café-clope', pilier: 'comportementale' },
  { id: 'repas', label: 'Après les repas', pilier: 'comportementale' },
  { id: 'pause', label: 'En pause', pilier: 'comportementale' },
  { id: 'voiture', label: 'En voiture', pilier: 'comportementale' },
  { id: 'telephone', label: 'Avec le téléphone', pilier: 'comportementale' },
  { id: 'social', label: 'En société', pilier: 'comportementale' },
  { id: 'alcool', label: "Avec l'alcool", pilier: 'comportementale' },
];

/** Forme (non garantie) du contexte de navigation addiction → boîte à outils. */
export interface SelectionSituations {
  situations: string[];
}

export function parseSelectionSituations(context: unknown): string[] {
  if (
    typeof context === 'object' && context !== null &&
    Array.isArray((context as SelectionSituations).situations)
  ) {
    const valides = new Set(SITUATIONS.map((s) => s.id));
    return (context as SelectionSituations).situations.filter(
      (id): id is string => typeof id === 'string' && valides.has(id),
    );
  }
  return [];
}
