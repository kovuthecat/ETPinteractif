import type { ModuleId } from '../../types';

export type Verdict = 'vrai' | 'faux';

export interface IdeeRecue {
  /** = id d'illustration S4 (public/illustrations/tabac/<id>.png). */
  id: string;
  affirmation: string;
  verdict: Verdict;
  /** Présence du champ = déclenche le badge secondaire « …et c'est plus nuancé ». */
  nuance?: string;
  explication: string;
  source: string;
  renvoi?: ModuleId;
  /** Toutes les cartes sont livrées actives (décision Thibault 2026-07-10). Le champ
   * reste pour pouvoir en retirer après revue. */
  actif: boolean;
}

/** Libellés courts pour le bouton « Approfondir → [titre court] », dérivés des titres
 * de `registry.ts` (pas d'import direct pour éviter un cycle registry → module → data). */
export const RENVOI_LABELS: Record<string, string> = {
  addiction: "Les composantes de l'addiction",
  'nicotine-toxique': "La nicotine n'est pas le toxique",
  soulagement: 'Le piège du soulagement',
  substituts: 'Utilisation des substituts',
  craving: 'Gérer le craving',
  'plan-arret': "Mon plan d'arrêt",
  motivation: 'Explorer ma motivation',
  'benefices-arret': "Ce que l'arrêt répare",
};

export const CARDS: IdeeRecue[] = [
  {
    id: 'vf-detente',
    affirmation: '« Fumer me détend. »',
    verdict: 'faux',
    explication:
      "La nicotine est un stimulant, pas un calmant. La sensation de détente vient surtout du soulagement du manque — créé par la cigarette précédente. Après le sevrage, le niveau moyen de stress et d'anxiété diminue chez la plupart des personnes.",
    source: 'Tabac Info Service',
    renvoi: 'soulagement',
    actif: true,
  },
  {
    id: 'vf-substituts-coeur',
    affirmation: '« Les substituts nicotiniques sont dangereux pour le cœur. »',
    verdict: 'faux',
    explication:
      "Ce qui abîme le cœur et les vaisseaux, c'est la fumée (monoxyde de carbone, particules) — pas la nicotine seule. Les substituts délivrent la nicotine sans combustion : ils sont utilisables, y compris en cas de maladie cardiaque, avec l'avis d'un professionnel.",
    source: 'HAS · Tabac Info Service',
    renvoi: 'nicotine-toxique',
    actif: true,
  },
  {
    id: 'vf-trop-tard',
    affirmation: "« J'ai fumé trop longtemps, ça ne sert plus à rien d'arrêter. »",
    verdict: 'faux',
    explication:
      "Les bénéfices commencent 20 minutes après la dernière cigarette et s'accumulent pendant des années, quel que soit l'âge et l'ancienneté du tabagisme. Arrêter après 60 ans améliore encore la santé et l'espérance de vie.",
    source: 'Tabac Info Service · OMS',
    renvoi: 'benefices-arret',
    actif: true,
  },
  {
    id: 'vf-petit-fumeur',
    affirmation: "« Quelques cigarettes par jour, ce n'est pas vraiment dangereux. »",
    verdict: 'faux',
    // Pas de champ `nuance` ici : le badge « …et c'est plus nuancé » n'apparaît que sur
    // les cartes 8, 14 et 15 (cf. S6.md, validation humaine). La nuance reste dans le texte.
    explication:
      "Il n'existe pas de seuil sans risque : même 1 à 5 cigarettes par jour exposent à une part importante du risque d'infarctus et d'AVC — le risque cardiovasculaire n'est pas proportionnel au nombre de cigarettes. (Nuance : réduire reste un pas — mais c'est l'arrêt qui protège.)",
    source: 'Santé publique France', // à revalider (Thibault)
    actif: true,
  },
  {
    id: 'vf-light-roule',
    affirmation: '« Les cigarettes “light” ou roulées sont moins nocives. »',
    verdict: 'faux',
    explication:
      "Les « light » n'ont jamais réduit le risque : on compense en tirant plus fort et plus profondément (l'appellation est d'ailleurs interdite depuis 2003). Le tabac à rouler délivre au moins autant — souvent plus — de goudrons et de monoxyde de carbone.",
    source: 'Tabac Info Service',
    renvoi: 'nicotine-toxique',
    actif: true,
  },
  {
    id: 'vf-poids',
    affirmation: "« Si j'arrête, je vais forcément prendre beaucoup de poids. »",
    verdict: 'faux',
    explication:
      "La prise moyenne est de 2 à 4 kg, et environ une personne sur trois n'en prend pas. La nicotine augmentait les dépenses d'énergie : le corps se rééquilibre. Les substituts bien dosés et l'activité physique limitent nettement cette prise — et rien n'oblige à tout mener de front.",
    source: 'Tabac Info Service · HAS',
    renvoi: 'substituts',
    actif: true,
  },
  {
    id: 'vf-volonte',
    affirmation: "« Arrêter de fumer, c'est juste une question de volonté. »",
    verdict: 'faux',
    explication:
      "La dépendance est un mécanisme neurobiologique (les récepteurs à la nicotine du cerveau), pas un trait de caractère. La volonté compte, mais un accompagnement et des substituts bien dosés multiplient par 1,5 à 2 les chances de réussite. Demander de l'aide n'est pas un aveu de faiblesse.",
    source: 'HAS · Cochrane',
    renvoi: 'addiction',
    actif: true,
  },
  {
    id: 'vf-patch-marche-pas',
    affirmation: "« J'ai déjà essayé les patchs : ça ne marche pas sur moi. »",
    verdict: 'faux',
    nuance: 'Une tentative « ratée » renseigne surtout sur le bon réglage pour la prochaine.',
    explication:
      "Le plus souvent, ce n'est pas le patch qui a échoué : c'est la dose qui était trop faible, ou la durée trop courte. La dose s'ajuste au ressenti (par quarts de patch) et se complète d'une forme orale pour les envies. Une tentative « ratée » renseigne surtout sur le bon réglage pour la prochaine.",
    source: 'HAS',
    renvoi: 'substituts',
    actif: true,
  },
  {
    id: 'vf-faux-pas',
    affirmation: '« Une cigarette pendant le sevrage, et tout est à refaire. »',
    verdict: 'faux',
    explication:
      "Un écart n'est pas une rechute : il n'efface ni les bénéfices déjà acquis, ni ce que vous avez appris. Ce qui compte, c'est la trajectoire d'ensemble, pas la perfection. Comprendre ce qui a déclenché l'écart prépare la suite.",
    source: 'Tabac Info Service',
    renvoi: 'craving',
    actif: true,
  },
  {
    id: 'vf-20min',
    affirmation: "« Le corps commence à se réparer moins d'une heure après la dernière cigarette. »",
    verdict: 'vrai',
    explication:
      "Dès 20 minutes, la pression artérielle et la fréquence cardiaque redeviennent normales. En 24 à 48 heures, le monoxyde de carbone est éliminé, le goût et l'odorat reviennent. La réparation démarre tout de suite — et continue pendant des années.",
    source: 'Tabac Info Service',
    renvoi: 'benefices-arret',
    actif: true,
  },
  {
    id: 'vf-combinaison',
    affirmation: '« On peut utiliser un patch et une gomme en même temps. »',
    verdict: 'vrai',
    explication:
      "C'est même recommandé quand les envies persistent : le patch assure un fond stable, la forme orale (gomme, pastille, spray) répond aux pics d'envie. Cette association augmente les chances de réussite — elle se règle avec un professionnel.",
    source: 'HAS · Cochrane',
    renvoi: 'substituts',
    actif: true,
  },
  {
    id: 'vf-tentatives',
    affirmation: "« Il faut souvent plusieurs tentatives avant d'arrêter pour de bon. »",
    verdict: 'vrai',
    explication:
      "La plupart des ex-fumeurs ont fait plusieurs tentatives avant l'arrêt durable. Chaque tentative n'est pas un échec : c'est un entraînement qui augmente les chances de la suivante.",
    source: 'Tabac Info Service',
    renvoi: 'motivation',
    actif: true,
  },
  {
    id: 'vf-vague',
    affirmation: '« Une envie de fumer finit toujours par passer, même sans fumer. »',
    verdict: 'vrai',
    explication:
      "Une envie est une vague de quelques minutes : elle monte, culmine, puis retombe d'elle-même — qu'on fume ou non. Les techniques des 4D aident à la laisser passer, et les vagues s'espacent avec le temps.",
    source: 'Tabac Info Service',
    renvoi: 'craving',
    actif: true,
  },
  {
    id: 'vf-vapoteuse',
    affirmation: '« La vapoteuse est aussi dangereuse que la cigarette. »',
    verdict: 'faux',
    nuance: "Elle n'est pas anodine pour autant, et l'objectif reste de s'en libérer aussi.",
    explication:
      "En l'état des connaissances, la vapoteuse est nettement moins nocive que la cigarette, car il n'y a pas de combustion — donc ni goudrons ni monoxyde de carbone. Elle n'est pas anodine pour autant, et l'objectif reste de s'en libérer aussi. À discuter avec un professionnel.",
    source: 'Santé publique France', // à revalider (Thibault)
    renvoi: 'nicotine-toxique',
    actif: true,
  },
  {
    id: 'vf-reduire',
    affirmation: '« Réduire sa consommation sans arrêter protège déjà la santé. »',
    verdict: 'faux',
    nuance:
      'En revanche, réduire avec des substituts, comme étape préparant l\'arrêt complet, est une stratégie valable.',
    explication:
      "Réduire seul protège peu : on compense souvent en tirant davantage sur chaque cigarette, et le risque cardiovasculaire persiste même à faible consommation. En revanche, réduire avec des substituts, comme étape préparant l'arrêt complet, est une stratégie valable.",
    source: 'HAS', // à revalider (Thibault)
    renvoi: 'plan-arret',
    actif: true,
  },
];
