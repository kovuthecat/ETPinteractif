/**
 * Données locales du module 8 « Manger pour ses artères » (C14, plans/theme-cardio-2026-07/S10.md).
 * Deux jeux de données, reflet des 2 onglets — jamais mélangés :
 *
 * - `REPERES_ALIMENTS` (onglet Familles) : 10 repères **génériques** (amis des artères / à
 *   limiter) — pas des aliments d'une cuisine en particulier. Volontairement générique (huile,
 *   oméga-3, légumineuses, céréales complètes…) pour rester ouvert à toutes les traditions
 *   culinaires **sans construire de base de données** (piège explicite §M8,
 *   docs/cardio/CONTENU_cardio.md : « diversité culturelle sans base de données »).
 *   Textes portés par le prototype (§MODULE 8, logique 816-827), reformulés pour ne **jamais**
 *   afficher de chiffre/quantité (G1 : « jamais de chiffres imposés » — brief M8, pas seulement
 *   le sel).
 *
 * - `ALIMENTS_PLATEAU` (onglet Assiette, garde-manger) : 54 aliments concrets. +1 « Pâtes
 *   blanches » (symétrisée le 2026-07-24 avec `diabete/alimentation/data.ts`, qui l'avait déjà
 *   depuis S7 illustrations-diabete 2026-07-10) ; +4 diversité orientale/pakistanaise (naan,
 *   agneau/bœuf, ghee, pâte d'arachide) pour enrichir les repas-types du 2026-07-24. Champs
 *   `sel`/`graisses` = paliers qualitatifs (jamais un gramme), utilisés uniquement pour compter
 *   les ajouts à surveiller (avertissement qualitatif « limiter le sel », jamais un seuil
 *   chiffré, cf. G1).
 *
 *   Illustrations (`public/illustrations/cardio/aliment-*.png`) : la correspondance stricte
 *   « un PNG par aliment, aucun de plus/moins » (26 aliments d'origine) ne tient plus depuis
 *   l'enrichissement 2026-07-23. Le rayon Légumes n'avait que 2 items (brocoli, carotte) alors
 *   que la pédagogie répète « moitié de l'assiette en légumes » (+10 légumes) ; +7
 *   aliments-situations reflétant des repas réels de la population suivie (MSP) ; +6 aliments
 *   apportant la diversité culturelle déjà présente côté diabète (manioc, igname, banane
 *   plantain, couscous complet, galette de riz, dattes — PNG copiés depuis
 *   `public/illustrations/diabete/`, partagés entre les deux thèmes). Les 17 aliments
 *   « légumes + situations » n'ont pas encore d'illustration : `IllustrationSlot` affiche son
 *   placeholder en attendant qu'elles soient générées (pas bloquant).
 */

export type CategoriePlateau = 'legumes' | 'feculents' | 'proteines' | 'lipides' | 'fruits' | 'laitiers';

interface CategorieDef {
  id: CategoriePlateau;
  label: string;
  /** Token CSS (jamais de oklch/hex en dur). Les 3 catégories-cœur (légumes/féculents/protéines)
   *  reprennent les 3 couleurs sémantiques du projet pour l'assiette conique — proto §MODULE 8,
   *  logique 836-838 (mêmes valeurs oklch que `--color-confort-strong`/`--color-nav`/`--color-toxique`,
   *  cf. tokens.css). Les 3 « extras » (matières grasses/fruits/laitiers) n'ont pas de charge
   *  sémantique de risque propre : couleur neutre. */
  colorVar: string;
}

export const CATEGORIES_PLATEAU: CategorieDef[] = [
  { id: 'legumes', label: 'Légumes', colorVar: '--color-confort-strong' },
  { id: 'feculents', label: 'Féculents', colorVar: '--color-nav' },
  { id: 'proteines', label: 'Protéines', colorVar: '--color-toxique' },
  { id: 'lipides', label: 'Matières grasses', colorVar: '--color-text-soft' },
  { id: 'fruits', label: 'Fruits', colorVar: '--color-text-soft' },
  { id: 'laitiers', label: 'Laitiers', colorVar: '--color-text-soft' },
];

export interface AlimentPlateau {
  id: string;
  name: string;
  categorie: CategoriePlateau;
  /** Palier qualitatif de sel — jamais un gramme (G1). Absent = non pertinent (ex. huile, noix). */
  sel?: 'faible' | 'modere' | 'eleve';
  /** Qualité dominante des graisses. Absent = quasi sans graisses. */
  graisses?: 'insaturees' | 'saturees' | 'mixte';
}

// prettier-ignore
export const ALIMENTS_PLATEAU: AlimentPlateau[] = [
  { id: 'baguette', name: 'Baguette blanche', categorie: 'feculents', sel: 'eleve' },
  { id: 'pain-complet', name: 'Pain complet', categorie: 'feculents', sel: 'modere' },
  { id: 'pain-pita', name: 'Pain pita', categorie: 'feculents', sel: 'modere' },
  { id: 'riz-blanc', name: 'Riz blanc', categorie: 'feculents', sel: 'faible' },
  { id: 'riz-basmati', name: 'Riz basmati', categorie: 'feculents', sel: 'faible' },
  { id: 'riz-complet', name: 'Riz complet', categorie: 'feculents', sel: 'faible' },
  { id: 'semoule-couscous', name: 'Semoule / couscous', categorie: 'feculents', sel: 'faible' },
  { id: 'pomme-de-terre', name: 'Pomme de terre', categorie: 'feculents', sel: 'modere' },
  { id: 'patate-douce', name: 'Patate douce', categorie: 'feculents', sel: 'faible' },
  { id: 'lentilles', name: 'Lentilles', categorie: 'feculents', sel: 'faible' },
  { id: 'pois-chiches', name: 'Pois chiches', categorie: 'feculents', sel: 'faible' },
  { id: 'pates-blanches', name: 'Pâtes blanches', categorie: 'feculents', sel: 'faible' },
  { id: 'pates-completes', name: 'Pâtes complètes', categorie: 'feculents', sel: 'faible' },
  { id: 'haricots-rouges', name: 'Haricots rouges', categorie: 'feculents', sel: 'faible' },
  { id: 'brocoli', name: 'Brocoli', categorie: 'legumes', sel: 'faible' },
  { id: 'carotte', name: 'Carotte', categorie: 'legumes', sel: 'faible' },
  { id: 'pomme', name: 'Pomme', categorie: 'fruits', sel: 'faible' },
  { id: 'banane', name: 'Banane', categorie: 'fruits', sel: 'faible' },
  { id: 'pasteque', name: 'Pastèque', categorie: 'fruits', sel: 'faible' },
  { id: 'yaourt', name: 'Yaourt nature', categorie: 'laitiers', sel: 'faible' },
  { id: 'poulet', name: 'Poulet', categorie: 'proteines', sel: 'faible', graisses: 'mixte' },
  { id: 'oeuf', name: 'Œuf', categorie: 'proteines', sel: 'faible', graisses: 'saturees' },
  { id: 'sardine', name: 'Sardine', categorie: 'proteines', sel: 'eleve', graisses: 'insaturees' },
  { id: 'saumon', name: 'Saumon', categorie: 'proteines', sel: 'faible', graisses: 'insaturees' },
  { id: 'avocat', name: 'Avocat', categorie: 'lipides', sel: 'faible', graisses: 'insaturees' },
  { id: 'huile-olive', name: "Huile d'olive", categorie: 'lipides', graisses: 'insaturees' },
  { id: 'noix', name: 'Noix', categorie: 'lipides', graisses: 'insaturees' },

  // Légumes — enrichissement 2026-07-23 (audit consultation : rayon limité à 2 items alors que
  // la pédagogie répète « moitié de l'assiette en légumes »). Mêmes 10 aliments que côté
  // diabète (`diabete/alimentation/data.ts`), sans les grammes (cardio n'en a pas besoin).
  { id: 'tomate', name: 'Tomate', categorie: 'legumes', sel: 'faible' },
  { id: 'courgette', name: 'Courgette', categorie: 'legumes', sel: 'faible' },
  { id: 'aubergine', name: 'Aubergine', categorie: 'legumes', sel: 'faible' },
  { id: 'poivron', name: 'Poivron', categorie: 'legumes', sel: 'faible' },
  { id: 'epinards', name: 'Épinards', categorie: 'legumes', sel: 'faible' },
  { id: 'haricots-verts', name: 'Haricots verts', categorie: 'legumes', sel: 'faible' },
  { id: 'oignon', name: 'Oignon', categorie: 'legumes', sel: 'faible' },
  { id: 'gombo', name: 'Gombo (okra)', categorie: 'legumes', sel: 'faible' },
  { id: 'potiron', name: 'Potiron / courge', categorie: 'legumes', sel: 'faible' },
  { id: 'chou', name: 'Chou', categorie: 'legumes', sel: 'faible' },

  // Aliments-situations — enrichissement 2026-07-23, repas réels de la population suivie (MSP).
  { id: 'thon', name: 'Thon (conserve au naturel)', categorie: 'proteines', sel: 'eleve', graisses: 'insaturees' },
  { id: 'merguez', name: 'Merguez', categorie: 'proteines', sel: 'eleve', graisses: 'saturees' },
  { id: 'fromage', name: 'Fromage (pâte pressée)', categorie: 'laitiers', sel: 'eleve', graisses: 'saturees' },
  { id: 'feta', name: 'Féta', categorie: 'laitiers', sel: 'eleve', graisses: 'saturees' },
  { id: 'olives', name: 'Olives', categorie: 'lipides', sel: 'eleve', graisses: 'insaturees' },
  { id: 'houmous', name: 'Houmous', categorie: 'lipides', sel: 'modere', graisses: 'insaturees' },
  { id: 'pois-casses', name: 'Pois cassés / niébé', categorie: 'feculents', sel: 'faible' },

  // Diversité culturelle 2026-07-23 (rattrape le thème diabète, cf. `diabete/alimentation/data.ts`
  // — mêmes id/name/sel). Assets copiés depuis `public/illustrations/diabete/` vers
  // `public/illustrations/cardio/` (mêmes PNG, partagés entre les deux thèmes).
  { id: 'manioc', name: 'Manioc / attiéké', categorie: 'feculents', sel: 'faible' },
  { id: 'igname', name: 'Igname', categorie: 'feculents', sel: 'faible' },
  { id: 'banane-plantain', name: 'Banane plantain', categorie: 'feculents', sel: 'faible' },
  { id: 'couscous-complet', name: 'Couscous complet', categorie: 'feculents', sel: 'faible' },
  { id: 'galette-riz', name: 'Galette de riz soufflé', categorie: 'feculents', sel: 'faible' },
  { id: 'dattes', name: 'Dattes', categorie: 'fruits', sel: 'faible' },

  // Diversité culturelle 2026-07-24 (enrichissement des repas-types, familles orientale/
  // pakistanaise et cuisine à sauce arachide — mêmes id/name/sel que
  // `diabete/alimentation/data.ts`, valeurs à revalider Thibault).
  { id: 'naan', name: 'Naan', categorie: 'feculents', sel: 'eleve' },
  { id: 'viande-rouge', name: 'Agneau / bœuf', categorie: 'proteines', sel: 'faible', graisses: 'saturees' },
  { id: 'ghee', name: 'Ghee (beurre clarifié)', categorie: 'lipides', graisses: 'saturees' },
  { id: 'arachide', name: "Pâte d'arachide", categorie: 'lipides', sel: 'modere', graisses: 'mixte' },
];

// ---------------------------------------------------------------------------
// Onglet Familles — repères génériques (amis des artères / à limiter). Cf. en-tête de fichier :
// volontairement générique, jamais un catalogue par origine culinaire.
// ---------------------------------------------------------------------------

export interface RepereAliment {
  id: string;
  label: string;
  /** true = ami des artères, false = à limiter. */
  ami: boolean;
  texte: string;
}

export const REPERES_ALIMENTS: RepereAliment[] = [
  {
    id: 'huiles',
    label: 'Huiles végétales',
    ami: true,
    texte:
      "L'huile d'olive, riche en graisses insaturées, fait baisser le LDL et protège la paroi des artères : à utiliser au quotidien, y compris pour cuisiner. Les huiles de colza, lin ou noix apportent en plus des oméga-3, mais supportent mal la cuisson : à réserver pour l'assaisonnement à froid (vinaigrette, filet en fin de préparation).",
  },
  {
    id: 'omega3',
    label: 'Oméga-3',
    ami: true,
    texte: "Poissons gras, noix, graines de lin : réduisent l'inflammation et protègent les artères.",
  },
  {
    id: 'legumes',
    label: 'Légumes',
    ami: true,
    texte:
      "Riches en fibres et en potassium : aident à réguler la tension et à limiter l'absorption du cholestérol.",
  },
  {
    id: 'legumineuses',
    label: 'Légumineuses',
    ami: true,
    texte: 'Lentilles, pois chiches : fibres et protéines végétales, une alternative qui ménage les artères.',
  },
  {
    id: 'oleagineux',
    label: 'Oléagineux',
    ami: true,
    texte: 'Amandes, noisettes, noix non salées : associés à un meilleur profil lipidique.',
  },
  {
    id: 'cerealescompletes',
    label: 'Céréales complètes',
    ami: true,
    texte:
      'Pain, riz, pâtes complets : plus de fibres, un effet plus doux sur le cholestérol et la glycémie que les versions raffinées.',
  },
  {
    id: 'charcuterie',
    label: 'Charcuterie',
    ami: false,
    texte: 'Riche en graisses saturées et en sel : fait monter le LDL et la tension en même temps.',
  },
  {
    id: 'graisses-saturees',
    label: 'Graisses saturées',
    ami: false,
    texte:
      'Beurre, crème, viandes grasses, charcuterie, fritures : font monter le LDL et nourrissent la plaque, à limiter au profit des huiles végétales.',
  },
  {
    id: 'sucreries',
    label: 'Sucreries',
    ami: false,
    texte: 'Le sucre en excès fait monter les triglycérides et favorise la prise de poids.',
  },
  {
    id: 'sel',
    label: 'Sel',
    ami: false,
    texte:
      'En excès, fait monter la tension artérielle — donc la pression sur la paroi des artères. Limiter la charcuterie, les plats industriels et le sel ajouté.',
  },
];

/**
 * Pont onglet Assiette → onglet Familles (correction Thibault 2026-07-23, « enrichir l'analyse
 * avec les messages du module Familles ») : associe un aliment concret du garde-manger
 * (`ALIMENTS_PLATEAU`) au repère générique qu'il illustre, quand la correspondance est
 * univoque. Absent = aliment sans repère dédié (ex. yaourt, œuf) — pas de correspondance forcée.
 * Utilisé par `MangerModule` pour piocher le texte du repère correspondant plutôt que d'écrire
 * un second message qui dirait la même chose autrement.
 */
export const REPERE_PAR_ALIMENT: Record<string, string> = {
  'huile-olive': 'huiles',
  avocat: 'huiles',
  noix: 'oleagineux',
  saumon: 'omega3',
  sardine: 'omega3',
  lentilles: 'legumineuses',
  'pois-chiches': 'legumineuses',
  'haricots-rouges': 'legumineuses',
  'pois-casses': 'legumineuses',
  houmous: 'legumineuses',
  'pain-complet': 'cerealescompletes',
  'riz-complet': 'cerealescompletes',
  'pates-completes': 'cerealescompletes',
  // Diversité 2026-07-24 : arachide = légumineuse (comme lentilles/pois chiches), ghee/viande
  // rouge = graisses saturées (repère « à limiter », cohérent avec beurre/viandes grasses).
  arachide: 'legumineuses',
  ghee: 'graisses-saturees',
  'viande-rouge': 'graisses-saturees',
};
