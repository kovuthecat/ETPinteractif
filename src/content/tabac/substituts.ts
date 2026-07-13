/**
 * Contenu clinique des formes de substitut nicotinique (bonnes pratiques / erreurs).
 * Extrait de `SubstitutsModule` (S11) pour être partagé sans duplication entre le
 * module interactif ET le livret d'accompagnement (PrintableLivret).
 * Ne pas reformuler ces textes sans repasser par `docs/contenu-modules-tabac.md`.
 */

export type FormeId =
  | 'patch'
  | 'gomme'
  | 'pastille'
  | 'sublingual'
  | 'spray'
  | 'vapoteuse';

export interface FormeContent {
  label: string;
  bonnesPratiques: string[];
  erreurs: string[];
}

export const FORMES_DATA: Record<FormeId, FormeContent> = {
  patch: {
    label: 'Patch (24 h / 16 h)',
    bonnesPratiques: [
      "Appliquer 1 patch le matin au réveil.",
      "Changer de site d'application chaque jour.",
      "L'effet commence à se faire sentir ~30 min après l'application.",
      "Autant que possible, garder le patch la nuit pour ne pas manquer de nicotine le matin.",
    ],
    erreurs: [
      "Attendre un effet immédiat (il faut ~30 min).",
      "Retirer le patch la nuit alors qu'on a besoin de nicotine au réveil (sauf sommeil perturbé → dose de nuit plus faible, cf. titration).",
      "Reposer le patch toujours au même endroit.",
    ],
  },
  gomme: {
    label: 'Gomme',
    bonnesPratiques: [
      "Prendre une gomme dès que l'envie de fumer se fait sentir.",
      "Mâcher lentement 5–6 fois, puis garder la gomme contre la joue ~2 min (la nicotine se libère et est absorbée par la muqueuse buccale).",
      "Remâcher lentement puis reposer contre la joue, et recommencer ainsi pendant ~30 min.",
      "Gérer « au coup par coup » : une gomme dès que l'envie réapparaît dans la journée.",
    ],
    erreurs: [
      "Mâcher vite et en continu comme un chewing-gum (la nicotine est avalée, moins efficace).",
      "Avaler la salive au lieu de laisser absorber par la joue.",
    ],
  },
  pastille: {
    label: 'Pastille',
    bonnesPratiques: [
      "Prendre une pastille dès que l'envie de fumer se fait sentir.",
      "Laisser se dissoudre sous la langue, ou contre la joue en la déplaçant régulièrement d'un côté à l'autre de la bouche.",
      "En 2–3 min, l'effet se fait sentir et l'envie s'estompe.",
    ],
    erreurs: [
      "Croquer ou avaler la pastille (elle doit fondre lentement).",
    ],
  },
  sublingual: {
    label: 'Comprimé sublingual',
    bonnesPratiques: [
      "Prendre un ou deux comprimés dès que l'envie se fait sentir.",
      "Placer le comprimé sous la langue ou contre la joue et le laisser fondre.",
      "L'effet se fait sentir en quelques minutes.",
    ],
    erreurs: [
      "Croquer ou avaler le comprimé.",
    ],
  },
  spray: {
    label: 'Spray buccal',
    bonnesPratiques: [
      "Une ou deux pulvérisations à chaque fois que l'envie de fumer se fait sentir.",
      "Pulvériser dans la bouche, sur l'intérieur des joues (placer le spray un peu de côté pour atteindre l'intérieur de la joue).",
      "On peut vaporiser sous la langue puis répartir sur l'intérieur des joues en bougeant la langue ; l'essentiel est de bien couvrir la muqueuse des joues.",
      "Efficace en ~1 min.",
    ],
    erreurs: [
      "Viser le fond de la gorge / inhaler la pulvérisation.",
    ],
  },
  vapoteuse: {
    label: 'Vapoteuse',
    bonnesPratiques: [
      "Choisir le dosage de nicotine avec un professionnel : assez dosé pour calmer réellement les envies — un dosage trop faible est la première cause de retour à la cigarette.",
      "Tirer lentement, en bouffées longues et espacées : la nicotine arrive plus progressivement qu'avec une cigarette (quelques minutes).",
      "Vapoter dès les premiers signes d'envie, sans attendre que le manque soit intense, autant que nécessaire dans la journée.",
      "Objectif : remplacer complètement le tabac fumé. Ensuite, à distance et sans se presser, réduire progressivement le dosage de nicotine.",
    ],
    erreurs: [
      "Sous-doser la nicotine « pour faire moins fort » : l'envie revient, et la cigarette avec.",
      "Continuer à fumer en parallèle durablement : le bénéfice n'existe que si la vapoteuse remplace complètement le tabac (piège du double usage).",
      "Reproduire les bouffées courtes et rapides de la cigarette.",
      "Acheter du matériel ou des e-liquides hors des circuits contrôlés (normes UE/AFNOR).",
    ],
  },
  // Contenu vapoteuse rédigé d'après HAS/HCSP + rapport OE — à revalider (Thibault)
};

/** Formes à prise ponctuelle (orales) — utilisées par la fiche « méthode patch ». */
export const FORMES_PONCTUELLES: FormeId[] = ['gomme', 'pastille', 'sublingual', 'spray'];
