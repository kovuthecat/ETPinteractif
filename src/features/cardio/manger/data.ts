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
 * - `ALIMENTS_PLATEAU` (onglet Assiette, garde-manger) : 26 aliments concrets, un par
 *   illustration présente dans `public/illustrations/cardio/aliment-*.png` (aucun de plus, aucun
 *   de moins — vérifié contre le dossier d'assets). Champs `sel`/`graisses` = paliers qualitatifs
 *   (jamais un gramme), utilisés uniquement pour compter les ajouts à surveiller (avertissement
 *   qualitatif « limiter le sel », jamais un seuil chiffré, cf. G1).
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
    id: 'huile',
    label: "Huile d'olive",
    ami: true,
    texte:
      "Riche en graisses insaturées : fait baisser le LDL et protège la paroi des artères. Base de l'alimentation méditerranéenne.",
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
    id: 'fritures',
    label: 'Fritures',
    ami: false,
    texte: 'Graisses souvent réutilisées et caloriques : dégradent le profil lipidique.',
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
