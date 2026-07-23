/**
 * Repas-types partagés cardio + diabète (chantier `enrichissement-visuel-2026-07`, demande
 * Thibault 2026-07-23) : « presets » illustrant des situations concrètes de la population
 * suivie (MSP Paris 20e, cultures maghrébine/africaine/antillaise), plutôt que de toujours
 * partir d'une assiette vide dans les garde-manger `cardio/manger/MangerModule.tsx` (onglet
 * « Composer mon assiette ») et `diabete/alimentation/AlimentationModule.tsx` (défi
 * « ★ Repas complet »).
 *
 * Source commune : chaque `id` d'aliment ci-dessous existe à la fois dans
 * `features/cardio/manger/data.ts` (`ALIMENTS_PLATEAU`) et `features/diabete/alimentation/data.ts`
 * (`FOODS`) — vérifié par lecture directe des deux fichiers après l'enrichissement du
 * 2026-07-23. Si l'un des deux `data.ts` change, revérifier cette liste (un id manquant dans
 * un thème afficherait un aliment absent du garde-manger de ce thème).
 *
 * Composition ET proportions/portions réelles = ordres de grandeur pédagogiques
 * // à revalider (Thibault) — ce sont des points de départ illustratifs pour la discussion,
 * pas des recommandations nutritionnelles chiffrées.
 *
 * Un preset n'est jamais un état verrouillé : une fois chargé, le patient peut librement
 * ajouter, retirer ou remplacer des aliments — même principe déjà en place dans le projet
 * pour les portes/renvois inter-modules (jamais d'enchaînement forcé).
 */

export interface RepasType {
  id: string;
  label: string;
  /** Phrase courte de contexte (ex. « Couscous classique du dimanche »), optionnelle. */
  description?: string;
  /** Ids d'aliments (mêmes ids que dans `diabete/alimentation/data.ts` ET
   *  `cardio/manger/data.ts` — vérifiés présents dans les deux). */
  aliments: string[];
}

export const REPAS_TYPES: RepasType[] = [
  {
    id: 'couscous-merguez',
    label: 'Couscous légumes-merguez',
    aliments: ['semoule-couscous', 'courgette', 'carotte', 'poivron', 'pois-chiches', 'merguez'],
  },
  {
    id: 'riz-poisson',
    label: 'Riz-poisson (façon thiéboudienne)',
    description: 'Poisson générique (saumon) en remplacement du thiof — à ajuster si besoin.',
    aliments: ['riz-complet', 'saumon', 'carotte', 'chou', 'aubergine'],
  },
  {
    id: 'poulet-plantain',
    label: 'Poulet-plantain',
    aliments: ['banane-plantain', 'poulet', 'haricots-verts'],
  },
  {
    id: 'vegetarien',
    label: 'Assiette végétarienne (lentilles, œuf)',
    aliments: ['riz-complet', 'lentilles', 'brocoli', 'oeuf', 'huile-olive'],
  },
  {
    id: 'petit-dej-leger',
    label: 'Petit-déjeuner / assiette légère méditerranéenne',
    aliments: ['pain-complet', 'oeuf', 'tomate', 'avocat', 'olives'],
  },
];
