import { createElement } from 'react';
import type { ComponentType } from 'react';
import type { Outil } from '../../../../content/tabac/outils';
import RespirationGuidee from '../../../../components/RespirationGuidee';
import VagueCraving from '../VagueCraving';
import type { OutilInteractifProps } from './types';

/**
 * Registre `interactif → composant` (OI1) : remplace le test en dur
 * `interactif === 'vague4d'` (`BoiteAOutilsModule.tsx`). Ajouter un outil interactif = créer
 * un composant respectant `OutilInteractifProps` + une entrée ici. Les deux bundles
 * (consultation, patient) consomment ce registre pour afficher le bouton de lancement
 * (« Lancer l'outil » / « Démarrer ») et monter le composant avec leur propre `store`.
 *
 * `Partial` : toutes les valeurs de `Outil['interactif']` n'ont pas forcément une entrée.
 * Les 7 stubs restants (OI3) seront ajoutés au fil de la Vague 2 (S2-S7) sans changer
 * cette forme de registre — seul le fichier du composant change.
 *
 * Fichier `.ts` (pas `.tsx`) : les wrappers utilisent `createElement` plutôt que la syntaxe
 * JSX pour rester compilables sans changer l'extension prévue au plan.
 */

// `VagueCraving` garde sa propre fiche interne (« Ma carte anti-envie », X2) et n'utilise
// aucune persistance injectée — son wrapper ignore `store`/`contexte`. Seule adaptation :
// `onBack` (prop existante de VagueCraving) reçoit `onClose` (contrat du registre).
function VagueCravingOutil({ onClose }: OutilInteractifProps) {
  return createElement(VagueCraving, { onBack: onClose });
}

// `RespirationGuidee` est déjà autonome et bundle-agnostique (zéro persistance) : son
// wrapper ignore lui aussi `store`/`contexte`.
function RespirationGuideeOutil({ onClose }: OutilInteractifProps) {
  return createElement(RespirationGuidee, { onClose });
}

export const OUTILS_INTERACTIFS: Partial<
  Record<NonNullable<Outil['interactif']>, ComponentType<OutilInteractifProps>>
> = {
  vague4d: VagueCravingOutil,
  respiration: RespirationGuideeOutil,
};
