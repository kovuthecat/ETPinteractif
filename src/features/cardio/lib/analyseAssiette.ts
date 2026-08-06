/**
 * Analyse croisée de l'assiette (M8 Manger) : proportions du camembert (½ · ¼ · ¼) × variété des
 * aliments réellement déposés par catégorie-cœur. Extraite de `MangerModule.tsx` le 2026-08-06
 * (`plans/recette-outils-2026-08/S4.md`, gate G-assiette) : jusque-là l'analyse ne lisait que le
 * camembert — ajouter 6 légumes sans toucher aux frontières laissait « Pas assez de légumes » à
 * l'écran, contredisant le geste du patient (constat recette navigateur, 2026-08-06).
 *
 * ⚠️ Messages proposés par Claude, à valider par Thibault comme le reste du contenu du module —
 * reprennent au plus près les 3 exemples du plan (`plans/recette-outils-2026-08/S4.md` §Cible) :
 * « proportions bonnes + peu d'aliments », « beaucoup de légumes + part faible », « les deux bons ».
 * Jamais de seuil chiffré imprimé (invariant module 8), jamais de moralisation.
 */

/** Tolérance (points de %) autour du modèle ½ · ¼ · ¼ pour considérer une part « bonne ». */
export const EQUILIBRE_TOLERANCE = 12;
/** Seuils de déséquilibre — jamais imprimés tels quels, seulement des branches de texte qualitatif. */
export const SEUIL_LEGUMES_BAS = 35;
export const SEUIL_PROTEINES_HAUT = 40;
export const SEUIL_FECULENTS_HAUT = 40;
/** Nombre d'aliments distincts, dans une catégorie-cœur, à partir duquel on considère que le
 *  patient « varie » (par opposition à un seul aliment répété). */
export const VARIETE_MIN = 2;

export interface AssietteEquilibre {
  /** Parts du camembert, en pourcentage entier (0-100), sommant ~100. */
  pctLegumes: number;
  pctFeculents: number;
  pctProteines: number;
  /** Nombre d'aliments distincts déposés dans chaque catégorie-cœur (pas seulement le dernier). */
  varieteLegumes: number;
  varieteFeculents: number;
  varieteProteines: number;
}

function proportionsDansLaCible(a: AssietteEquilibre): boolean {
  return (
    Math.abs(a.pctLegumes - 50) <= EQUILIBRE_TOLERANCE &&
    Math.abs(a.pctFeculents - 25) <= EQUILIBRE_TOLERANCE &&
    Math.abs(a.pctProteines - 25) <= EQUILIBRE_TOLERANCE
  );
}

/** Assiette vide : aucun aliment déposé dans aucune des 3 catégories-cœur. */
export function analyseAssietteVide(): string {
  return 'Glissez ou touchez un aliment du garde-manger pour composer votre assiette.';
}

export function analyseEquilibreAssiette(a: AssietteEquilibre): string {
  if (proportionsDansLaCible(a)) {
    const varieteBonnePartout =
      a.varieteLegumes >= VARIETE_MIN && a.varieteFeculents >= VARIETE_MIN && a.varieteProteines >= VARIETE_MIN;
    if (varieteBonnePartout) {
      return "Bel équilibre et une belle variété — parfait pour vos artères.";
    }
    // Proportions bonnes mais peu de variété quelque part : on nomme la catégorie la moins variée
    // (légumes d'abord — c'est la catégorie la plus travaillée pédagogiquement dans ce module).
    if (a.varieteLegumes < VARIETE_MIN) return 'De bonnes proportions ; variez les légumes.';
    if (a.varieteFeculents < VARIETE_MIN) return 'De bonnes proportions ; variez les féculents.';
    return 'De bonnes proportions ; variez les protéines.';
  }

  if (a.pctLegumes < SEUIL_LEGUMES_BAS) {
    // Le patient a déjà ajouté plusieurs légumes différents : on crédite le geste plutôt que de
    // répéter un manque que l'écran contredirait (c'est exactement le défaut constaté en recette).
    if (a.varieteLegumes >= VARIETE_MIN) {
      return 'De beaux légumes — laissez-leur plus de place.';
    }
    return 'Pas assez de légumes : pensez à leur laisser la moitié de l’assiette, pour les fibres et le potassium.';
  }

  if (a.pctProteines > SEUIL_PROTEINES_HAUT) {
    return 'Beaucoup de protéines par rapport aux légumes : allégez un peu ce côté de l’assiette.';
  }

  if (a.pctFeculents > SEUIL_FECULENTS_HAUT) {
    return 'Beaucoup de féculents : laissez plus de place aux légumes.';
  }

  return 'Assiette correcte — encore un peu de rééquilibrage possible vers le modèle ½ · ¼ · ¼.';
}
