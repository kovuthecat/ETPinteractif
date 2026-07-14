import type { ModuleId } from '../../features/types';

/**
 * Données du module « Stratégies & outils » (plans/boite-a-outils/S2.md).
 * Les 14 outils sont transcrits verbatim depuis le rapport OpenEvidence adapté —
 * ne pas reformuler `principe` / `proposition` / `consigneFiche` sans repasser par le plan.
 */

export type Preuve = 'demontree' | 'experts';

export const PREUVE_LABELS: Record<Preuve, string> = {
  demontree: 'Efficacité démontrée dans les études',
  experts: 'Recommandé par les experts du sevrage',
};

export interface Outil {
  /** = id d'illustration (public/illustrations/tabac/<id>.png). */
  id: string;
  titre: string;
  accroche: string; // 1 ligne, carte
  situations: string[]; // ids de situations.ts
  transverse?: boolean; // affiché quel que soit le filtre
  principe: string; // 1-2 phrases, panneau détail
  proposition: string; // « Comment le proposer » — formulation patient
  preuve: Preuve;
  consigneFiche: string; // 1 ligne, fiche imprimée
  renvoi?: { id: ModuleId; label: string };
  interactif?: 'vague4d'; // ouvre l'outil interactif au lieu d'un simple détail
}

export const OUTILS: Outil[] = [
  {
    id: 'outil-vague-4d',
    titre: 'Laisser passer la vague — les 4D',
    accroche: "L'envie monte, culmine, puis retombe d'elle-même en quelques minutes.",
    situations: [],
    transverse: true,
    principe:
      "Une envie de fumer est une vague de 3 à 5 minutes : elle redescend toujours, qu'on fume ou non. Les 4D — Différer, Détourner l'attention, se Détendre, boire De l'eau — aident à tenir pendant le pic.",
    proposition:
      "Quand l'envie arrive, ne luttez pas de front : regardez l'heure, et tenez quelques minutes avec un des 4D. Chronométrez si besoin : vous constaterez que l'envie passe réellement.",
    preuve: 'experts',
    consigneFiche: "Différer · Détourner · Détendre · D'eau — l'envie passe en 3 à 5 min.",
    interactif: 'vague4d',
  },
  {
    id: 'outil-si-alors',
    titre: 'Mes plans “SI… ALORS…”',
    accroche: "Décider sa parade à l'avance, pour ne pas avoir à décider au moment critique.",
    situations: [],
    transverse: true,
    principe:
      "Pré-programmer une réponse précise pour chaque situation à risque court-circuite la décision au moment où l'envie frappe. C'est la technique la mieux démontrée du sevrage comportemental.",
    proposition:
      "Formulez 3 à 5 plans précis : “SI un collègue me propose une cigarette, ALORS je réponds : non merci, j'ai arrêté — et je prends un verre d'eau.” “SI l'envie monte après le repas, ALORS je sors marcher 5 minutes.” Écrivez-les, et relisez-les chaque matin les premières semaines.",
    preuve: 'demontree',
    consigneFiche: "J'écris 3 à 5 plans “SI… ALORS…” et je les relis chaque matin.",
  },
  {
    id: 'outil-bouger',
    titre: 'Bouger 10 minutes',
    accroche: "L'effet anti-envie le plus rapide : le corps en mouvement.",
    situations: ['craving', 'stress', 'ennui', 'stimulation', 'deprime', 'fringales'],
    principe:
      "Un exercice bref — même 10 minutes de marche rapide — fait nettement baisser l'envie de fumer, avec un effet qui persiste 20 à 30 minutes après l'effort.",
    proposition:
      "Quand l'envie est forte : sortez marcher d'un bon pas 10 minutes, ou montez et descendez un escalier 3-4 fois. Si vous ne pouvez pas bouger : serrez fort les poings et les bras 10 secondes, relâchez, recommencez 5 fois.",
    preuve: 'demontree',
    consigneFiche: "Envie forte → 10 min de marche rapide, un escalier, ou 5 contractions des poings.",
  },
  {
    id: 'outil-respiration',
    titre: 'Respirer pour redescendre',
    accroche: "Deux minutes de respiration lente calment plus durablement qu'une cigarette.",
    situations: ['stress', 'anxiete', 'nervosite', 'irritabilite'],
    principe:
      "La respiration lente active le système d'apaisement du corps. Rappel utile : la cigarette ne réduit pas le stress — elle soulage le manque qu'elle a elle-même créé ; après le sevrage, le niveau de stress de fond diminue chez la plupart des personnes.",
    proposition:
      "Quand le stress monte : inspirez par le nez en comptant jusqu'à 4, retenez jusqu'à 7, soufflez lentement par la bouche jusqu'à 8. Répétez 3 fois — moins de 2 minutes, faisable partout. Autre option : une main sur le ventre, 10 respirations lentes en gonflant le ventre.",
    preuve: 'experts',
    consigneFiche: 'Inspirez 4 s — retenez 7 s — soufflez 8 s, 3 fois.',
    renvoi: { id: 'soulagement', label: 'Pourquoi la cigarette ne détend pas vraiment' },
  },
  {
    id: 'outil-surfer',
    titre: "Surfer sur l'envie",
    accroche: "Observer l'envie sans lutter ni céder — elle s'épuise d'elle-même.",
    situations: ['anxiete', 'craving', 'manque'],
    principe:
      "Observer l'envie comme une vague qu'on regarde passer, sans la juger, affaiblit peu à peu le lien entre la situation et la cigarette.",
    proposition:
      "Quand l'envie arrive, dites-vous : “Je ressens une envie. Elle est là. Je la laisse passer.” Observez ce qui se passe dans le corps — gorge serrée, mains agitées — sans réagir. En 2 à 3 minutes, elle redescend seule. Chaque envie surfée sans fumer affaiblit la suivante.",
    preuve: 'experts',
    consigneFiche: "J'observe l'envie comme une vague : elle monte, elle redescend seule.",
  },
  {
    id: 'outil-place-nette',
    titre: 'Faire place nette',
    accroche: "Ce qu'on ne voit plus déclenche moins l'envie.",
    situations: ['cafe', 'repas', 'voiture'],
    principe:
      "Chaque objet ou lieu associé à la cigarette est un déclencheur. Les retirer du champ de vision désamorce l'automatisme avant qu'il ne se lance.",
    proposition:
      "Avant le jour J : rangez cendriers et briquets hors de vue, ne gardez plus de cigarettes à la maison, videz la voiture (cendrier, boîte à gants) et mettez des pastilles à la menthe à la place. L'objectif est que la situation ne “propose” plus la cigarette.",
    preuve: 'experts',
    consigneFiche: 'Cendriers, briquets, paquets : hors de vue — maison et voiture.',
  },
  {
    id: 'outil-routine',
    titre: 'Casser la routine',
    accroche: 'Changer un détail du rituel suffit souvent à désamorcer le geste.',
    situations: ['cafe', 'repas', 'pause', 'voiture', 'telephone'],
    principe:
      "Le café, la fin du repas ou la pause déclenchent la cigarette parce qu'ils forment une séquence automatique. Modifier un élément de la séquence — lieu, ordre, boisson — casse l'enchaînement.",
    proposition:
      "Prenez votre café dans une autre pièce, debout, ou remplacez-le par un thé les 2-3 premières semaines. Dès la dernière bouchée du repas, levez-vous de table : brossage de dents, vaisselle, 5 minutes dehors. Prenez vos pauses dans un lieu où on ne peut pas fumer. Au bout de quelques jours, le café ou le repas redeviennent des plaisirs indépendants de la cigarette.",
    preuve: 'experts',
    consigneFiche: 'Je change un détail de chaque rituel : lieu, ordre, boisson.',
  },
  {
    id: 'outil-mains-bouche',
    titre: 'Occuper les mains et la bouche',
    accroche: 'Un geste de remplacement, incompatible avec la cigarette.',
    situations: ['fringales', 'ennui', 'telephone', 'craving', 'cafe'],
    principe:
      "La cigarette occupe la main et la bouche : lui substituer un autre geste comble le vide sensoriel pendant que l'envie redescend.",
    proposition:
      "Gardez à portée de main : chewing-gum sans sucre, balle anti-stress, grand verre d'eau à boire par petites gorgées, un stylo à manipuler. Occupez la main qui tenait la cigarette.",
    preuve: 'experts',
    consigneFiche: "Chewing-gum, balle anti-stress, grand verre d'eau.",
  },
  {
    id: 'outil-journal',
    titre: "Une semaine d'observation",
    accroche: "Avant d'arrêter : repérer ses automatismes pour préparer ses parades.",
    situations: [],
    transverse: true,
    principe:
      "Noter chaque cigarette avec son contexte fait apparaître les schémas répétitifs — c'est la première étape recommandée pour planifier des alternatives ciblées.",
    proposition:
      "Pendant la semaine qui précède l'arrêt, notez chaque cigarette : l'heure, où vous êtes, ce que vous faites, ce que vous ressentez. Vous verrez vos situations à risque se dessiner — ce sont elles qu'on équipera d'une parade.",
    preuve: 'experts',
    consigneFiche: "Avant l'arrêt : je note chaque cigarette (quand, où, avec quoi, en ressentant quoi).",
  },
  {
    id: 'outil-refus',
    titre: 'Ma phrase de refus',
    accroche: 'Une réponse courte, ferme, préparée à l\'avance.',
    situations: ['social', 'alcool', 'pause'],
    principe:
      "La pression sociale — l'offre de cigarette, l'ambiance festive — est un déclencheur majeur. Une phrase de refus préparée évite d'avoir à improviser au moment vulnérable. Vigilance particulière avec l'alcool, qui baisse la garde : les premières semaines, mieux vaut le limiter.",
    proposition:
      "Préparez votre réponse avant la soirée : “Non merci, j'ai arrêté.” Courte, ferme, sans justification. Gardez un verre non alcoolisé en main — ça occupe le geste. Si l'envie monte, éloignez-vous quelques minutes. Chaque soirée tenue affaiblit l'association.",
    preuve: 'experts',
    consigneFiche: "“Non merci, j'ai arrêté.” Court, ferme, préparé à l'avance.",
  },
  {
    id: 'outil-recompense',
    titre: 'Se récompenser — la tirelire',
    accroche: 'Remplacer la récompense de la cigarette par de vraies récompenses.',
    situations: ['plaisir', 'deprime', 'stimulation'],
    principe:
      "Le cerveau était habitué à une “récompense” nicotinique répétée. Les premières semaines, planifier des plaisirs de remplacement — et matérialiser l'argent économisé — soutient la motivation. Ce n'est pas du luxe, c'est une stratégie.",
    proposition:
      "Chaque jour, prévoyez au moins un petit plaisir : un bon repas, un bain, un épisode de votre série, un appel à un ami. Et chaque soir, mettez de côté l'argent des cigarettes du jour ; au bout d'une semaine, offrez-vous quelque chose avec. Voir la somme grandir est un moteur puissant.",
    preuve: 'experts',
    consigneFiche: "L'argent des cigarettes va dans une tirelire ; chaque semaine, un plaisir.",
  },
  {
    id: 'outil-anti-ennui',
    titre: 'La liste anti-ennui',
    accroche: "L'envie a besoin de vide pour s'installer.",
    situations: ['ennui', 'stimulation', 'telephone'],
    principe:
      "L'ennui est un piège classique : la cigarette remplissait un vide de temps et de sensations. Une liste d'activités courtes, préparée à l'avance, évite de rester inactif face à une envie.",
    proposition:
      "Préparez une liste de 10 activités de 5 à 15 minutes : appeler quelqu'un, ranger un tiroir, arroser les plantes, s'étirer, écouter un podcast, marcher en mâchant un chewing-gum… Affichez-la sur le frigo et dans le téléphone, et piochez dedans dès que l'ennui s'installe.",
    preuve: 'experts',
    consigneFiche: 'Ma liste de 10 activités courtes, affichée sur le frigo et dans le téléphone.',
  },
  {
    id: 'outil-faux-pas',
    titre: "Si j'ai un écart — le plan de secours",
    accroche: "Un faux pas n'est pas une rechute — à condition de savoir quoi faire juste après.",
    situations: [],
    transverse: true,
    principe:
      "Fumer une cigarette pendant le sevrage n'efface rien de ce qui est acquis. Ce qui transforme un écart en rechute, c'est la pensée “tout est foutu”. La plupart des ex-fumeurs ont connu des faux pas en chemin ; ce qui compte, c'est le geste d'après.",
    proposition:
      "Préparez, avant le jour J, un plan de secours en 3 gestes : 1. Je jette immédiatement le paquet et le briquet. 2. J'appelle quelqu'un — un proche, mon soignant, le 39 89. 3. Je relis mes raisons d'arrêter. Puis je continue mes substituts exactement comme avant : les 24 heures qui suivent sont décisives, et une cigarette ne fait pas de vous un fumeur — c'est acheter un paquet qui le ferait. Comprendre ce qui a déclenché l'écart, sans se blâmer, prépare la suite.",
    preuve: 'experts',
    consigneFiche: "Un écart n'est pas une rechute : je jette le paquet, j'appelle, je relis mes raisons.",
  },
  {
    id: 'outil-substituts',
    titre: 'Traiter le manque — les substituts',
    accroche: 'Les signes physiques du manque se traitent — c\'est le rôle des substituts.',
    situations: ['manque', 'irritabilite', 'nervosite', 'concentration', 'sommeil', 'fringales', 'craving'],
    principe:
      "Irritabilité, nervosité, troubles de la concentration ou du sommeil, fringales : ces signes traduisent le manque de nicotine. Bien dosés, les substituts les font disparaître — et toutes les techniques de cette boîte à outils marchent mieux avec eux.",
    proposition:
      "Le patch assure un fond stable toute la journée ; une forme orale (gomme, pastille, spray) répond aux pics d'envie. Le bon dosage est celui qui fait disparaître les signes de manque — il s'ajuste, avec un professionnel.",
    preuve: 'demontree',
    consigneFiche: "Patch pour le fond + forme orale pour les pics d'envie.",
    renvoi: { id: 'substituts', label: 'Voir les substituts et la titration' },
  },
];
