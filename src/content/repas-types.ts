/**
 * Repas-types partagés cardio + diabète (chantier `enrichissement-visuel-2026-07`, demande
 * Thibault 2026-07-23) : « presets » illustrant des situations concrètes de la population
 * suivie (MSP Paris 20e, cultures française, maghrébine, africaine subsaharienne, orientale/
 * pakistanaise et un peu asiatique), plutôt que de toujours partir d'une assiette vide dans les
 * garde-manger `cardio/manger/MangerModule.tsx` (onglet « Composer mon assiette ») et
 * `diabete/alimentation/AlimentationModule.tsx` (défi « ★ Repas complet »).
 *
 * Source commune : chaque `id` d'aliment ci-dessous existe à la fois dans
 * `features/cardio/manger/data.ts` (`ALIMENTS_PLATEAU`) et `features/diabete/alimentation/data.ts`
 * (`FOODS`) — vérifié par lecture directe des deux fichiers. Si l'un des deux `data.ts` change,
 * revérifier cette liste (un id manquant dans un thème afficherait un aliment absent du
 * garde-manger de ce thème).
 *
 * Composition ET proportions/portions réelles = ordres de grandeur pédagogiques
 * // à revalider (Thibault) — ce sont des points de départ illustratifs pour la discussion,
 * pas des recommandations nutritionnelles chiffrées.
 *
 * Un preset n'est jamais un état verrouillé : une fois chargé, le patient peut librement
 * ajouter, retirer ou remplacer des aliments — même principe déjà en place dans le projet
 * pour les portes/renvois inter-modules (jamais d'enchaînement forcé).
 *
 * Matières grasses de cuisson (2026-07-24, revue Thibault) : les lipides pèsent lourd dans le
 * moteur de courbe (`glycemieCurve.ts`, effet « frein » sur le pic) et dans le profil cardio —
 * un plat dont la seule graisse vient d'une protéine (merguez, saumon) sous-représente la
 * matière grasse de cuisson réelle. `huile-olive`/`ghee` ajoutés explicitement là où la
 * préparation réelle en comporte (plantain frit, riz sauté, sauce arachide…).
 *
 * Proportions (2026-07-24, demande Thibault) : jusqu'ici un preset n'était qu'une liste
 * d'aliments à portion unique (diabète) ou remettait le camembert cardio à parts égales quel
 * que soit le plat (cardio) — aucune pondération réaliste. Deux mécanismes désormais :
 * - `portions` par aliment (diabète) : nombre de portions canoniques de cet aliment dans le
 *   plat (répété N fois dans l'assiette, donc pèse N fois dans la somme cg/fibres/proteines/
 *   lipides qui alimente la courbe) — défaut 1 si omis.
 * - `proportionsCoeur` (cardio) : poids relatifs des 3 catégories-cœur du camembert
 *   (légumes/féculents/protéines), non normalisés (ex. `{ feculents: 3, legumes: 2, proteines: 1 }`
 *   = féculents ~50 %, légumes ~33 %, protéines ~17 %). Absent = parts égales (comportement
 *   antérieur, conservé pour compatibilité). Ce sont des poids de **catégorie**, pas de la somme
 *   des `portions` des aliments individuels : un plat où le féculent domine visuellement doit
 *   avoir un poids féculent élevé même si plusieurs aliments légers composent la garniture.
 * Ordres de grandeur pédagogiques // à revalider (Thibault), comme le reste de la composition.
 */

export interface RepasTypeAliment {
  id: string;
  /** Portions canoniques de cet aliment dans le plat (diabète : répété N fois dans l'assiette
   *  pour pondérer la courbe proportionnellement). Défaut 1 si omis. */
  portions?: number;
}

export type CategorieCoeurRepas = 'legumes' | 'feculents' | 'proteines';

export interface RepasType {
  id: string;
  label: string;
  /** Phrase courte de contexte (ex. « Couscous classique du dimanche »), optionnelle. */
  description?: string;
  /** Aliments du plat, mêmes ids que dans `diabete/alimentation/data.ts` ET
   *  `cardio/manger/data.ts` (vérifiés présents dans les deux). */
  aliments: RepasTypeAliment[];
  /** Poids relatifs des 3 catégories-cœur pour le camembert cardio (non normalisés). Absent =
   *  parts égales par défaut. */
  proportionsCoeur?: Partial<Record<CategorieCoeurRepas, number>>;
}

export const REPAS_TYPES: RepasType[] = [
  // ── Maghrébine ────────────────────────────────────────────────────────
  {
    id: 'couscous-merguez',
    label: 'Couscous légumes-merguez',
    aliments: [
      { id: 'semoule-couscous', portions: 2 },
      { id: 'courgette' },
      { id: 'carotte' },
      { id: 'poivron' },
      { id: 'pois-chiches' },
      { id: 'merguez' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 3, feculents: 3, proteines: 1 },
  },
  {
    id: 'tajine-poulet-olives',
    label: 'Tajine poulet-olives-citron',
    description: 'Citron confit non représenté (aromate, pas d’impact nutritionnel notable).',
    aliments: [
      { id: 'poulet' },
      { id: 'pomme-de-terre', portions: 2 },
      { id: 'oignon' },
      { id: 'olives' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 2, proteines: 2 },
  },

  // ── Afrique subsaharienne ────────────────────────────────────────────
  {
    id: 'riz-poisson',
    label: 'Riz-poisson (façon thiéboudienne)',
    description: 'Poisson générique (saumon) en remplacement du thiof — à ajuster si besoin.',
    aliments: [
      { id: 'riz-complet', portions: 2 },
      { id: 'saumon' },
      { id: 'carotte' },
      { id: 'chou' },
      { id: 'aubergine' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 3, feculents: 3, proteines: 2 },
  },
  {
    id: 'poulet-plantain',
    label: 'Poulet-plantain',
    description: 'Plantain traditionnellement frit (alloco) — huile ajoutée pour refléter la préparation réelle.',
    aliments: [
      { id: 'banane-plantain', portions: 2 },
      { id: 'poulet' },
      { id: 'haricots-verts' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 3, proteines: 2 },
  },
  {
    id: 'riz-au-gras',
    label: 'Riz au gras (façon jollof)',
    description: 'Riz mijoté à la tomate — plat de fête ouest-africain, décliné dans toute la sous-région.',
    aliments: [
      { id: 'riz-basmati', portions: 2 },
      { id: 'tomate' },
      { id: 'oignon' },
      { id: 'poivron' },
      { id: 'poulet' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 2, feculents: 4, proteines: 1 },
  },
  {
    id: 'attieke-poisson',
    label: 'Attiéké-poisson',
    description: 'Semoule de manioc ivoirienne, traditionnellement avec du poisson braisé.',
    aliments: [
      { id: 'manioc', portions: 2 },
      { id: 'tomate' },
      { id: 'oignon' },
      { id: 'saumon' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 2, proteines: 2 },
  },
  {
    id: 'mafe-riz',
    label: 'Mafé (riz, sauce arachide)',
    description: 'Sauce à base de pâte d’arachide — plat ouest-africain courant, riche en matière grasse.',
    aliments: [
      { id: 'riz-blanc', portions: 2 },
      { id: 'poulet' },
      { id: 'chou' },
      { id: 'carotte' },
      { id: 'arachide' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 2, proteines: 2 },
  },

  // ── Orientale / pakistanaise ─────────────────────────────────────────
  {
    id: 'dal-riz-basmati',
    label: 'Dal (lentilles) - riz basmati',
    description: 'Plat végétarien courant du sous-continent indien/pakistanais.',
    aliments: [
      { id: 'riz-basmati' },
      { id: 'lentilles', portions: 2 },
      { id: 'epinards' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 4, proteines: 0 },
  },
  {
    id: 'curry-agneau-riz-naan',
    label: 'Curry d’agneau, riz basmati, naan',
    description: 'Cuisson traditionnellement au ghee — ajouté pour refléter la préparation réelle.',
    aliments: [
      { id: 'riz-basmati' },
      { id: 'naan' },
      { id: 'tomate' },
      { id: 'oignon' },
      { id: 'viande-rouge' },
      { id: 'ghee' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 2, proteines: 2 },
  },

  // ── Asiatique (générique) ────────────────────────────────────────────
  {
    id: 'riz-poulet-legumes-sautes',
    label: 'Riz-poulet-légumes sautés',
    description: 'Assiette générique façon wok — sans sauce soja (absente du garde-manger).',
    aliments: [
      { id: 'riz-complet' },
      { id: 'poulet' },
      { id: 'brocoli' },
      { id: 'carotte' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 2, feculents: 2, proteines: 1 },
  },

  // ── Française ────────────────────────────────────────────────────────
  {
    id: 'poulet-roti-legumes',
    label: 'Poulet rôti, pommes de terre, haricots verts',
    description: 'Plat familial classique du dimanche.',
    aliments: [
      { id: 'poulet' },
      { id: 'pomme-de-terre', portions: 2 },
      { id: 'haricots-verts', portions: 2 },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 2, feculents: 2, proteines: 2 },
  },
  {
    id: 'salade-composee',
    label: 'Salade composée (thon, œuf, olives)',
    description: 'Repas léger sans féculent — proportion illustrant qu’un plat n’en a pas toujours besoin.',
    aliments: [{ id: 'thon' }, { id: 'oeuf' }, { id: 'tomate' }, { id: 'avocat' }, { id: 'olives' }],
    proportionsCoeur: { legumes: 1, feculents: 0, proteines: 2 },
  },

  // ── Méditerranéenne / générique ──────────────────────────────────────
  {
    id: 'vegetarien',
    label: 'Assiette végétarienne (lentilles, œuf)',
    aliments: [
      { id: 'riz-complet' },
      { id: 'lentilles', portions: 2 },
      { id: 'brocoli' },
      { id: 'oeuf' },
      { id: 'huile-olive' },
    ],
    proportionsCoeur: { legumes: 1, feculents: 3, proteines: 1 },
  },
  {
    id: 'petit-dej-leger',
    label: 'Petit-déjeuner / assiette légère méditerranéenne',
    aliments: [{ id: 'pain-complet' }, { id: 'oeuf' }, { id: 'tomate' }, { id: 'avocat' }, { id: 'olives' }],
    proportionsCoeur: { legumes: 1, feculents: 1, proteines: 1 },
  },
];
