import type { ZoneId } from '../components/Silhouette';

/**
 * Contenu du module 5 — Complications (plan theme-diabete/S8.md). Textes repris
 * verbatim de la maquette (Module 5 - Complications.dc.html, blocs LOCKED / ORGANS /
 * FICHE_ITEMS / POINTS_CONTROLE) — voir docs/diabete/SPEC_outil_ETP_diabete.md §9.4
 * et BRIEF_DESIGN_diabete.md §Module 5 pour la structure en 3 temps (menace →
 * évitable et dépistable → geste) et la branche pied renforcée.
 */

export interface OrganeVerrouille {
  id: Extract<ZoneId, 'cerveau' | 'coeur'>;
  nom: string;
}

/** Cœur + cerveau : déjà explorés au module 4 (macro) — ici on ne regarde que le micro. */
export const ORGANES_VERROUILLES: OrganeVerrouille[] = [
  { id: 'cerveau', nom: 'Cerveau' },
  { id: 'coeur', nom: 'Cœur' },
];

export interface Organe {
  id: Extract<ZoneId, 'yeux' | 'reins' | 'nerfs' | 'pied'>;
  nom: string;
  /** Temps 1 — la menace, amenée sobrement. */
  menace: string;
  /** Temps 2 — mais c'est évitable et dépistable (texte affiché avec SignatureEvitable). */
  evitable: string;
  /** Temps 3 — le geste ou le suivi concret. */
  geste: string;
  /** 2ᵉ niveau, affiché au survol/focus du badge SignatureEvitable. */
  stat: string;
  /** Branche renforcée (pied uniquement) : illustration + points de contrôle + fiche. */
  brancheRenforcee?: boolean;
}

export const ORGANES: Organe[] = [
  {
    id: 'yeux',
    nom: 'Yeux',
    menace:
      "De petits vaisseaux de la rétine s'abîment avec le temps — la vue peut se troubler, parfois sans prévenir.",
    evitable: "Un dépistage repère l'atteinte avant qu'elle ne gêne la vue.",
    geste: "Fond d'œil (dilaté), 1 fois par an.",
    stat: 'DCCT/UKPDS : jusqu\'à -76 % de rétinopathie sévère avec un bon contrôle glycémique.',
  },
  {
    id: 'reins',
    nom: 'Reins',
    menace: 'Les reins filtrent un peu moins bien — souvent sans aucun signe pendant longtemps.',
    evitable: "Une prise de sang et une analyse d'urine la repèrent tôt.",
    geste: 'Bilan rénal (créatinine + albuminurie), 1 fois par an.',
    stat: "Un dépistage précoce permet d'adapter le traitement avant toute perte de fonction.",
  },
  {
    id: 'nerfs',
    nom: 'Nerfs',
    menace:
      'Les sensations diminuent peu à peu aux pieds et aux mains — on peut se blesser sans le sentir.',
    evitable: 'Un simple test au fil (monofilament) la repère avant la perte de sensibilité.',
    geste: 'Test de sensibilité des pieds, 1 fois par an chez le soignant.',
    stat: 'DCCT/UKPDS : -60 % de neuropathie avec un bon contrôle glycémique.',
  },
  {
    id: 'pied',
    nom: 'Pied',
    menace:
      'Une petite plaie au pied peut passer inaperçue si la sensibilité a diminué — et s\'infecter sans douleur qui prévient.',
    evitable:
      "Regardé chaque jour, un problème se repère avant de s'aggraver — c'est le geste qui protège le plus.",
    geste: 'Auto-examen quotidien : dessus, dessous (au miroir), entre les orteils.',
    stat: "Les programmes d'éducation réduisent jusqu'à -2/3 le risque d'amputation.",
    brancheRenforcee: true,
  },
];

/** Points de contrôle illustrés (bloc pied, à côté de l'IllustrationSlot). */
export const POINTS_CONTROLE: string[] = ['Dessus du pied', 'Dessous, au miroir', 'Entre les orteils'];

/** Fiche pied — checklist de l'auto-examen quotidien (fiche-mémo de référence, contenu identique pour tous). */
export const FICHE_ITEMS: string[] = [
  'Regarder le dessus du pied',
  'Regarder le dessous, à l\'aide d\'un miroir',
  'Regarder entre les orteils',
  "Vérifier qu'aucun objet n'est resté dans la chaussure",
  'Ne jamais marcher pieds nus',
  'Consulter rapidement en cas de plaie, rougeur ou coupure qui ne cicatrise pas',
];

/** Encadré chiffré de la fiche pied (levier émotionnel — SPEC §9.4). */
export const FICHE_STAT = "Ce geste, répété chaque jour, réduit jusqu'à 2/3 le risque d'amputation.";

/** Dernier item de la checklist, remonté en bandeau « conduite à tenir si une plaie apparaît » (SPEC §9.4/§9.5). */
export const FICHE_CONDUITE_PLAIE = FICHE_ITEMS[FICHE_ITEMS.length - 1];
