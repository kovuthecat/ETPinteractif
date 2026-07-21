import type { ComponentType } from 'react';
import type { Outil } from '../../../../content/tabac/outils';
import type { SituationDef } from '../../../../content/tabac/situations';

/**
 * Contrat du socle « outils interactifs » (S1, OI1 — plans/outils-interactifs-2026-07/S1.md).
 * Un outil interactif est un composant bundle-agnostique (comme `RespirationGuidee`, déjà
 * dans `src/components/`) : il ne connaît ni `SelectionContext` (consultation) ni
 * `localStorage` (patient) — la persistance lui est injectée par le bundle qui le monte via
 * `store`. Précédent d'extraction paramétrée : `TitrationPatch` (revue-chrome-2026-07 / S8).
 */

/** Persistance injectée par le bundle : `get`/`setList` sur des `string[]`, clé = `outil.id`
 *  (ou `outil.id`.sous-clé). Consultation → mémoire de session (`useConsultationStore`,
 *  invariant #1 maintenu) ; patient → `localStorage` (`usePatientStore`). */
export interface OutilStore {
  get(key: string): string[];
  setList(key: string, values: string[]): void;
}

/** Contexte lecture seule injecté par le bundle (G2, index.md « Décisions structurantes ») —
 *  jamais d'écriture par ce canal : l'écriture passe exclusivement par `store`. */
export interface OutilContexte {
  /** situations cochées en Composantes (consultation) / situation active (patient). */
  situationsActives?: SituationDef[];
  /** raisons d'arrêter (SelectionState.raisons) — pour le plan de secours. */
  raisons?: string[];
}

export interface OutilInteractifProps {
  /** l'outil source (titre, principe, proposition…). */
  outil: Outil;
  /** persistance injectée par le bundle. */
  store: OutilStore;
  /** contexte lecture seule (situations, raisons). */
  contexte?: OutilContexte;
  /** retour à la liste / fermeture overlay. */
  onClose: () => void;
}

export type OutilInteractifComponent = ComponentType<OutilInteractifProps>;
