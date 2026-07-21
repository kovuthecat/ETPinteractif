import { useMemo, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import CourbeGlycemie, {
  COURBE_GRAPH_WIDTH,
  COURBE_GRAPH_HEIGHT,
  bandeToY,
  type CourbeDef,
  type MarqueurDef,
} from '../components/CourbeGlycemie';
import {
  sampleRepas,
  sampleRepasAvecBolus,
  toSvgPath,
  LEVEL_MAX,
  BASELINE,
  BANDE_CIBLE_DEFAUT,
  type RepasParams,
} from '../lib/glycemieCurve';
import styles from './InsulineRapideModule.module.css';

/**
 * Module 10 — Insuline rapide (pré-prandial). Contenu : `docs/diabete/10-insuline-rapide.md`
 * (autorité) ; modèle : `sampleRepasAvecBolus` (`lib/glycemieCurve.ts`). Distinct du module 9
 * (insuline basale) : ici on couvre le repas, pas la glycémie à jeun. 5 temps (S10-implementation
 * §0 + plans/insuline-affinements-2026-07/S5, IA6) : ① couvrir le repas, ② le bon moment,
 * ③ corriger avant le repas, ④ le piège du cumul, ⑤ et si je ne mange pas (repas sauté = hypo,
 * G5 : onglet distinct, PAS une variante du ④). Aucun chiffre à l'écran (dose/minutes) — paliers
 * qualitatifs uniquement, cf. garde-fou du plan.
 */

type Temps = 1 | 2 | 3 | 4 | 5;

const TEMPS_TABS: { n: Temps; label: string }[] = [
  { n: 1, label: '① Couvrir le repas' },
  { n: 2, label: '② Le bon moment' },
  { n: 3, label: '③ Corriger avant le repas' },
  { n: 4, label: '④ Le piège du cumul' },
  // 5ᵉ onglet DISTINCT (G5, tranché Thibault 2026-07-21 — le ④ traite le cumul, un autre sujet ;
  // cf. docs/diabete/10-insuline-rapide.md §3 temps ⑤). Positionnement par défaut : à la fin, après
  // le ④ — proposition de l'implémenteur, `// à revalider (Thibault)` (validation visuelle : la
  // barre à 5 onglets tient-elle à ~1 m ? `.tabs` a déjà `flex-wrap: wrap`, donc un repli sur 2
  // lignes est automatique si besoin, sans changement de code).
  { n: 5, label: '⑤ Et si je ne mange pas ?' },
];

function handleTabsKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, index: number, onSelect: (n: Temps) => void) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const nextIndex = (index + (e.key === 'ArrowRight' ? 1 : -1) + TEMPS_TABS.length) % TEMPS_TABS.length;
  onSelect(TEMPS_TABS[nextIndex].n);
}

// --- Repère temporel commun aux 4 temps : repas fixé à t=0, domaine -60→+180 min (span 240),
// ce qui aligne exactement l'étiquette « Repas » sur la 2ᵉ des 5 étiquettes d'axe. ---
const T_MIN = -60;
const T_MAX = 180;
const T_SPAN = T_MAX - T_MIN;
const AXE_LABELS = ['-1h', 'Repas', '+1h', '+2h', '+3h'];

function frac(t: number): number {
  return (t - T_MIN) / T_SPAN;
}

const DOMAIN_OPTS = {
  width: COURBE_GRAPH_WIDTH,
  height: COURBE_GRAPH_HEIGHT,
  tMin: T_MIN,
  tMax: T_MAX,
  vMin: 0,
  vMax: LEVEL_MAX,
};

const REPAS_MARQUEUR: MarqueurDef = { t: frac(0), type: 'repas', label: 'Repas' };

// --- Temps ① — trois crans qualitatifs de glucides (mêmes proportions frein/retard, seule la
// charge varie). La dose de rapide est FIXE (calée sur le repas moyen via `DOSE_ADEQUATE`), plus
// proportionnelle à la charge : le résultat suit donc l'écart (dose − glucides) — c'est la
// correction de fond du point 11 de l'audit (S5.md T1-E). L'écart de charge peu/moyen/beaucoup est
// volontairement large pour que la MÊME dose fixe donne un résultat nettement contrasté
// (hypo pour un petit repas / cible pour un moyen / reste haut pour un gros). `// à revalider (Thibault)`. ---
type RepasCranId = 'peu' | 'moyen' | 'beaucoup';
type RepasCran = { id: RepasCranId; label: string; params: RepasParams };

const REPAS_CRANS: RepasCran[] = [
  { id: 'peu', label: 'Peu de glucides', params: { charge: 0.2, frein: 0.35, retard: 0.3 } }, // à revalider (Thibault)
  { id: 'moyen', label: 'Repas moyen', params: { charge: 0.55, frein: 0.35, retard: 0.3 } },
  { id: 'beaucoup', label: 'Beaucoup de glucides', params: { charge: 1.0, frein: 0.35, retard: 0.3 } }, // à revalider (Thibault)
];

const REPAS_MOYEN = REPAS_CRANS[1].params;
/** Dose de référence (« habituelle ») calée pour couvrir un repas moyen, injectée juste avant —
 *  utilisée aux temps ①②③④. Abaissée 0.5 → 0.40 (S5.md T1-E/T2-E) pour que le creux du cas
 *  « repas moyen / dose habituelle » (identique au temps ③ « cible + habituelle ») ne passe plus
 *  sous la bande-cible. `// à revalider (Thibault)`. */
const DOSE_ADEQUATE = 0.4;
/** Timing standard « juste avant le repas » — `// à revalider (Thibault)`. */
const T_INJECTION_DEFAUT = -15;

// --- Temps ⑤ — « Et si je ne mange pas ? » (item 2, ajout 2026-07-21, G5 : onglet distinct).
// Repas de charge NULLE (`peakAmplitude` renvoie 0 dès que `charge<=0` → `sampleRepas` reste une
// trace plate à la baseline, quels que soient frein/retard) vs le MÊME repas + le bolus habituel
// (`DOSE_ADEQUATE`, même injection `T_INJECTION_DEFAUT` que les autres temps) injecté quand même →
// plonge nettement sous la bande (aucun glucide pour « nourrir » l'insuline). Aucune interactivité
// ici (scénario fixe, illustratif) : contenu verbatim `docs/diabete/10-insuline-rapide.md` §3 temps
// ⑤ (validé G1 2026-07-21). Calculs au niveau module (pas de useMemo) : aucune dépendance à l'état. ---
const REPAS_VIDE: RepasParams = { charge: 0, frein: 0.35, retard: 0.3 };

const T5_POINTS = {
  sans: sampleRepas(REPAS_VIDE, { tStart: T_MIN, tEnd: T_MAX }),
  avec: sampleRepasAvecBolus(REPAS_VIDE, { dose: DOSE_ADEQUATE, tInjection: T_INJECTION_DEFAUT }),
};
const T5_COURBES: CourbeDef[] = [
  { id: 'sans', d: toSvgPath(T5_POINTS.sans, DOMAIN_OPTS), label: 'Sans rapide', variante: 'fantome' },
  { id: 'avec', d: toSvgPath(T5_POINTS.avec, DOMAIN_OPTS), label: 'Avec rapide', variante: 'principale' },
];

/** Message principal du temps ⑤ — **verbatim** du doc validé G1 (`10-insuline-rapide.md` §3 temps
 *  ⑤ + plans/insuline-affinements-2026-07/S5.md, étape 3). Ne pas reformuler sans revalidation. */
const MESSAGE_SANS_REPAS =
  "Rapide sans manger → le sucre plonge : on n'injecte pas la rapide si on ne mange pas ; si le repas saute après → on resucre.";

/** Option post-prandiale (doc §3 temps ⑤, 3ᵉ message) : présentée comme une EXCEPTION
 *  (inappétence/maladie), jamais comme une méthode — le pré-prandial reste la référence.
 *  `// à revalider (Thibault)`. */
const MESSAGE_EXCEPTION_POST_PRANDIAL =
  "Exception, pas une méthode : en cas d'appétit incertain (personne âgée fragile, nausées), la " +
  "rapide peut s'injecter après le repas, ajustée à ce qui a été réellement mangé — à voir avec le " +
  'soignant. Le pré-prandial reste la référence.';

/** Pont inter-modules (item 8b, plan insuline-affinements-2026-07/S1 §Décisions structurantes) :
 *  relie le zoom de CE module (un repas, −1 h/+3 h) à la lente, qui couvre la journée entière
 *  (coucher → coucher, module Insuline basale). Paire avec la phrase-pont symétrique du module
 *  basale (S4, item 8a) — même paire de zooms, formulée dans les deux sens. `// à revalider
 *  (Thibault)` : à comparer à la formulation retenue côté basale pour la cohérence finale.  */
const PONT_VERS_BASALE =
  "La rapide ne couvre que ce repas ; le reste de la journée entière — et la nuit — c'est la lente qui s'en charge.";

// --- Temps ② — délai d'injection, de « bien avant » à « après le repas » (jamais affiché en
// minutes, cf. garde-fou : le curseur pilote le modèle, seuls des mots qualitatifs sont visibles). ---
const DELAY_MIN = -60;
const DELAY_MAX = 90;
const DELAY_STEP = 5;

// --- Temps ③ — glycémie de départ avant le repas, 3 paliers qualitatifs. `basse` remontée -10 → -7
// (S5.md T2-E) pour un léger retour vers la cible pendant le repas (le message « traiter l'hypo
// d'abord » reste juste) ; `haute` montée +30 → +45 pour démarrer NETTEMENT dans le rouge (à +30
// le départ était posé pile sur la limite cible/hyper). `// à revalider (Thibault)`. ---
type DepartId = 'basse' | 'cible' | 'haute';
const DEPART_OPTIONS: { id: DepartId; label: string; value: number }[] = [
  { id: 'basse', label: 'Basse', value: BASELINE - 7 }, // à revalider (Thibault)
  { id: 'cible', label: 'Dans la cible', value: BASELINE },
  { id: 'haute', label: 'Haute', value: BASELINE + 45 }, // à revalider (Thibault)
];
// --- Axe de dose partagé aux temps ①/③ (audit itération 2, points 5/6) : 3 crans qualitatifs
// appliqués en facteur à la dose de référence de chaque temps (charge du repas au ①, dose adéquate
// au ③). Croisés avec les 3 crans de chaque temps → 9 combinaisons. Jamais affichés en unités. ---
type DoseNiveau = 'moins' | 'standard' | 'plus';
const DOSE_NIVEAUX: { id: DoseNiveau; label: string }[] = [
  { id: 'moins', label: 'Moins de dose' },
  { id: 'standard', label: 'Dose habituelle' },
  { id: 'plus', label: 'Plus de dose' },
];
/** Facteur qualitatif appliqué à la dose de référence — `// à revalider (Thibault)`. L'effet
 *  étant proportionnel à la dose, l'écart absolu est plus marqué pour un gros repas / un départ
 *  haut que pour un petit, comme attendu par l'audit. */
const DOSE_FACTOR: Record<DoseNiveau, number> = { moins: 0.6, standard: 1, plus: 1.5 };

// --- Temps ④ — deux situations cliniques expérimentables (point 12, décision Thibault
// 2026-07-12, cf. plans/audit-diabete/S5.md T10) : « la glycémie redescend seule » (A) vs
// « la glycémie reste haute » (B, via `exces` — cf. glycemieCurve.ts), croisées avec 3 choix de
// recorrection (aucune / tout de suite / après attente). ---
type SituationCumul = 'revient' | 'reste-haut';
type Recorrection = 'aucune' | 'tot' | 'attente';

const SITUATION_CUMUL_OPTIONS: { id: SituationCumul; label: string }[] = [
  { id: 'revient', label: 'La glycémie redescend toute seule' },
  { id: 'reste-haut', label: 'La glycémie reste haute' },
];

const RECORRECTION_OPTIONS: { id: Recorrection; label: string }[] = [
  { id: 'aucune', label: "Je n'ajoute pas de dose" },
  { id: 'tot', label: 'Je recorrige tout de suite' },
  { id: 'attente', label: "J'attends que la 1ʳᵉ ait fini, puis je recorrige" },
];

/** Repas de référence du temps ④ (« piège du cumul »), COMMUN aux deux situations. Charge relevée
 *  (0.85 vs 0.55 du repas moyen) pour que la montée post-prandiale de la courbe de base (dose de
 *  repas volontairement faible, cf. `DOSE_BASE_CUMUL`) culmine NETTEMENT dans le rouge (au-dessus du
 *  haut de cible) et donne « envie » de recorriger (correctif A, 2026-07-14), tout en revenant à la
 *  baseline avant +3h (situation A). Frein/retard relevés pour un pic un peu plus tardif et étalé.
 *  `// à revalider (Thibault)`. */
const REPAS_CUMUL: RepasParams = { charge: 0.85, frein: 0.45, retard: 0.4 }; // à revalider (Thibault)
/** Dose du repas (« 1ʳᵉ dose ») du temps ④, COMMUNE aux deux situations pour que leurs courbes de
 *  base (« je n'ajoute pas de dose ») aient exactement le même départ (plat, à la baseline) et la
 *  même montée (correctif B, 2026-07-14). Volontairement faible : elle ne couvre pas tout le repas →
 *  le pic monte haut dans le rouge (correctif A). `// à revalider (Thibault)`. */
const DOSE_BASE_CUMUL = 0.1; // à revalider (Thibault)
/** Élévation persistante (situation B « reste haute ») : `exces` de `glycemieCurve.ts`, désormais
 *  **gaté** (n'apparaît qu'après le pic post-prandial, cf. `excesGate`) → plateau haut ~BASELINE+exces
 *  atteint après le pic, sans relever le départ ni la montée. `// à caler (Thibault)`. */
const EXCES_SITUATION_B = 36; // à revalider (Thibault)
/** Dose de la recorrection (2ᵉ dose) du temps ④. Plus généreuse que la dose de repas de base : elle
 *  doit faire PLONGER sous la cible quand on recorrige à tort/trop tôt (situation A « aucune dose
 *  n'était nécessaire » et situation B « recorriger tout de suite »), tout en laissant « B + attente »
 *  revenir dans la cible. Calée avec le repas plus chargé du temps ④. `// à revalider (Thibault)`. */
const DOSE_RECORRECTION = 0.6; // à revalider (Thibault)
/** Délais (minutes, non affichés) de la 2ᵉ dose selon le choix de recorrection — « tôt » : recorrige
 *  pendant la montée / vers le pic (cumul → plonge) ; « attente » : recorrige tard, la 1ʳᵉ dose ayant
 *  quasi fini d'agir. `// à caler (Thibault)`. */
const RECORR_DELAIS: Record<Exclude<Recorrection, 'aucune'>, number> = {
  tot: T_INJECTION_DEFAUT + 45,
  attente: T_INJECTION_DEFAUT + 150,
};

/** Message + issue (plonge ou non) pour la case courante de la matrice (audit point 12, cf.
 *  S5.md T10 §Décision clé). Jamais de chiffre — raison qualitative courte. */
function matriceCumul(situation: SituationCumul, recorrection: Recorrection): { message: string; plonge: boolean } {
  if (situation === 'revient') {
    if (recorrection === 'aucune') {
      return { message: 'Le repas fait monter la glycémie assez haut — on aurait envie d’ajouter une dose — mais elle redescend seule dans la cible : inutile de recorriger.', plonge: false }; // à revalider (Thibault)
    }
    if (recorrection === 'tot') {
      return { message: "Recorriger tout de suite, alors que ce n'était pas nécessaire, fait plonger sous la cible.", plonge: true };
    }
    return { message: "Même après avoir attendu, ajouter une dose qui n'était pas nécessaire fait plonger sous la cible.", plonge: true };
  }
  if (recorrection === 'aucune') {
    return { message: 'Le repas fait monter la glycémie de la même façon, mais cette fois, sans correction, elle reste haute au lieu de redescendre.', plonge: false }; // à revalider (Thibault)
  }
  if (recorrection === 'tot') {
    return { message: "Recorriger tout de suite, pendant que la 1ʳᵉ dose agit encore, fait plonger sous la cible : les deux doses s'additionnent.", plonge: true };
  }
  return { message: "Attendre que la 1ʳᵉ dose ait fini d'agir, puis recorriger, ramène la glycémie dans la cible.", plonge: false };
}

// --- Temps ② — phase qualitative du délai d'injection : SOURCE DE VÉRITÉ UNIQUE pour le
// message (`timingHint`) et le libellé dynamique affiché sous le curseur (item 6 de l'audit
// produit 2026-07-21 : les 4 anciennes étiquettes de piste étaient équiréparties sur
// [DELAY_MIN, DELAY_MAX] alors que ces seuils ne le sont pas, d'où des contradictions
// étiquette/message/marqueur à certaines positions). Mêmes bornes que l'ancien `timingHint`,
// seule la bascule juste-avant/au-moment vaut la peine d'être revue. `// à revalider (Thibault)`. ---
type TimingPhaseKey = 'bien-avant' | 'juste-avant' | 'au-moment' | 'apres';

interface TimingPhase {
  cle: TimingPhaseKey;
  libelle: string;
}

function timingPhase(delay: number): TimingPhase {
  if (delay <= -30) return { cle: 'bien-avant', libelle: 'bien avant' }; // à revalider (Thibault)
  if (delay < 0) return { cle: 'juste-avant', libelle: 'juste avant' }; // à revalider (Thibault) : bascule juste-avant/au-moment
  if (delay === 0) return { cle: 'au-moment', libelle: 'au moment du repas' };
  return { cle: 'apres', libelle: 'après le repas' };
}

const TIMING_HINTS: Record<TimingPhaseKey, string> = {
  'bien-avant': 'Injectée bien avant, la rapide a déjà commencé à agir quand le repas fait monter le sucre.',
  'juste-avant': 'Injectée juste avant le repas, la rapide est prête à temps pour couvrir le pic.',
  'au-moment': 'Injectée au moment du repas, la rapide part avec un léger retard sur la montée du sucre.',
  apres: "Injectée après le repas, la rapide arrive en retard : le pic a une longueur d'avance sur elle.",
};

function timingHint(delay: number): string {
  return TIMING_HINTS[timingPhase(delay).cle];
}

/** Temps ① — message selon LE REPAS **et** LA DOSE (point 11 : la dose « habituelle » est fixe, le
 *  résultat suit l'écart dose − glucides, pas la dose seule). 9 cases cohérentes avec la courbe ;
 *  la diagonale (peu+moins, moyen+habituelle, beaucoup+plus) est le cas couvert. `// à revalider (Thibault)`. */
function messageCouvrir(repas: RepasCranId, dose: DoseNiveau): string {
  const MESSAGES: Record<RepasCranId, Record<DoseNiveau, string>> = {
    peu: {
      moins: 'Petit repas, un peu moins de rapide : le sucre reste tranquillement dans la cible.',
      standard: "Petit repas mais dose habituelle : c'est trop de rapide pour si peu de glucides, le sucre plonge sous la cible.",
      plus: 'Petit repas et encore plus de rapide : le sucre plonge nettement sous la cible — risque d’hypo.',
    },
    moyen: {
      moins: "Repas moyen, un peu moins de rapide : le pic n'est pas tout à fait couvert, le sucre reste un peu plus haut.",
      standard: 'Repas moyen et dose habituelle : le pic est couvert, le sucre revient dans la cible.',
      plus: 'Repas moyen mais plus de rapide que nécessaire : le sucre passe sous la cible — risque d’hypo.',
    },
    beaucoup: {
      moins: "Gros repas et peu de rapide : le pic n'est pas couvert, le sucre reste très haut.",
      standard: 'Gros repas mais seulement la dose habituelle : elle ne couvre pas tous les glucides, le sucre reste haut.',
      plus: 'Gros repas et plus de rapide : cette fois le pic est couvert, le sucre revient vers la cible.',
    },
  };
  return MESSAGES[repas][dose];
}

/** Temps ③ — message selon la glycémie de départ ET la dose de correction (point 6). La bonne
 *  dose dépend du départ : sur un départ haut c'est « plus » qui ramène dans la cible, sur un
 *  départ dans la cible c'est « habituelle », et un départ bas ne se corrige pas au rapide. */
function messageCorriger(depart: DepartId, dose: DoseNiveau): string {
  if (depart === 'basse') {
    return dose === 'plus'
      ? "Glycémie basse avant de manger : ajouter de la dose ici creuse l'hypo. On traite l'hypo d'abord."
      : "Glycémie basse avant de manger : on ne corrige pas par plus de rapide, on traite l'hypo d'abord.";
  }
  if (depart === 'cible') {
    switch (dose) {
      case 'moins':
        return "Un peu moins de rapide que d'habitude : le pic du repas n'est pas tout à fait couvert, ça reste au-dessus de la cible.";
      case 'plus':
        return 'Plus de rapide sans en avoir besoin : le sucre passe sous la cible — risque d’hypo.';
      default:
        return 'Dans la cible : la dose habituelle suffit, le repas est couvert.';
    }
  }
  // haute : la correction se justifie ; c'est « plus » qui ramène dans la cible.
  switch (dose) {
    case 'moins':
      return 'Départ déjà haut et trop peu de rapide : ça reste nettement au-dessus de la cible.';
    case 'plus':
      return 'Un peu plus de rapide, en plus de la couverture du repas, ramène la courbe vers la cible.';
    default:
      return 'Départ haut, dose habituelle : ça reste au-dessus de la cible ; une correction en plus rapprocherait de la cible.';
  }
}

/** Sélecteur de dose mutualisé (temps ①/③) — 3 crans qualitatifs, même grammaire visuelle que
 *  les autres chips du module (audit itération 2 : implémentation mutualisée demandée). */
function DoseSelector({ value, onChange }: { value: DoseNiveau; onChange: (n: DoseNiveau) => void }) {
  return (
    <div className={styles.chipRow} role="radiogroup" aria-label="Dose de rapide">
      {DOSE_NIVEAUX.map((d) => {
        const active = value === d.id;
        return (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
            onClick={() => onChange(d.id)}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}

export default function InsulineRapideModule({ onNavigate, shell }: ModuleProps) {
  const [temps, setTemps] = useState<Temps>(1);
  const [repasId, setRepasId] = useState<RepasCranId>('moyen');
  const [delay, setDelay] = useState(T_INJECTION_DEFAUT);
  const [departId, setDepartId] = useState<DepartId>('cible');
  const [doseCouvrir, setDoseCouvrir] = useState<DoseNiveau>('standard');
  const [doseCorriger, setDoseCorriger] = useState<DoseNiveau>('standard');
  const [situationCumul, setSituationCumul] = useState<SituationCumul>('revient');
  const [recorrection, setRecorrection] = useState<Recorrection>('aucune');

  const cran = REPAS_CRANS.find((c) => c.id === repasId) ?? REPAS_CRANS[1];
  const departValue = DEPART_OPTIONS.find((d) => d.id === departId)?.value ?? BASELINE;

  const bandes = useMemo(() => bandeToY(BANDE_CIBLE_DEFAUT), []);

  // ── Temps ① — couvrir le repas ──────────────────────────────────────────
  const t1Points = useMemo(
    () => ({
      sans: sampleRepas(cran.params, { tStart: T_MIN, tEnd: T_MAX }),
      avec: sampleRepasAvecBolus(cran.params, {
        // Dose FIXE (calée sur le repas moyen), indépendante de la charge du repas — comme au
        // temps ③ : c'est ce qui fait dépendre le résultat de l'écart (dose − glucides) et non de
        // la dose seule (correction du point 11, S5.md T1-E).
        dose: DOSE_ADEQUATE * DOSE_FACTOR[doseCouvrir],
        tInjection: T_INJECTION_DEFAUT,
      }),
    }),
    [cran, doseCouvrir],
  );
  const t1Courbes: CourbeDef[] = useMemo(
    () => [
      { id: 'sans', d: toSvgPath(t1Points.sans, DOMAIN_OPTS), label: 'Sans rapide', variante: 'fantome' },
      { id: 'avec', d: toSvgPath(t1Points.avec, DOMAIN_OPTS), label: 'Avec rapide', variante: 'principale' },
    ],
    [t1Points],
  );

  // ── Temps ② — le bon moment ──────────────────────────────────────────────
  const t2Points = useMemo(
    () => ({
      sans: sampleRepas(REPAS_MOYEN, { tStart: T_MIN, tEnd: T_MAX }),
      avec: sampleRepasAvecBolus(REPAS_MOYEN, { dose: DOSE_ADEQUATE, tInjection: delay }),
    }),
    [delay],
  );
  const t2Courbes: CourbeDef[] = useMemo(
    () => [
      { id: 'sans', d: toSvgPath(t2Points.sans, DOMAIN_OPTS), label: 'Sans rapide', variante: 'estompee' },
      { id: 'avec', d: toSvgPath(t2Points.avec, DOMAIN_OPTS), label: 'Avec rapide', variante: 'principale' },
    ],
    [t2Points],
  );
  const t2Marqueurs: MarqueurDef[] = useMemo(
    () => [REPAS_MARQUEUR, { t: frac(delay), type: 'activite', label: 'Injection' }],
    [delay],
  );

  // ── Temps ③ — corriger avant le repas ────────────────────────────────────
  const t3Points = useMemo(
    () => ({
      reference: sampleRepasAvecBolus(REPAS_MOYEN, { dose: DOSE_ADEQUATE, tInjection: T_INJECTION_DEFAUT }),
      selection: sampleRepasAvecBolus(REPAS_MOYEN, {
        dose: DOSE_ADEQUATE * DOSE_FACTOR[doseCorriger],
        tInjection: T_INJECTION_DEFAUT,
        depart: departValue,
      }),
    }),
    [departValue, doseCorriger],
  );
  const t3Courbes: CourbeDef[] = useMemo(
    () => [
      { id: 'reference', d: toSvgPath(t3Points.reference, DOMAIN_OPTS), label: 'Départ dans la cible', variante: 'estompee' },
      { id: 'selection', d: toSvgPath(t3Points.selection, DOMAIN_OPTS), label: 'Mon départ', variante: 'principale' },
    ],
    [t3Points],
  );

  // ── Temps ④ — le piège du cumul (2 situations × 3 recorrections, point 12) ──────────────
  const t4BolusBase = useMemo(
    () =>
      situationCumul === 'reste-haut'
        ? // Situation B « reste haute » : même dose de repas + même repas (REPAS_CUMUL) que A, PLUS
          // l'excès persistant. Celui-ci étant gaté post-pic (cf. glycemieCurve.ts `excesGate`), le
          // départ et la montée restent superposés à A ; la divergence n'a lieu qu'après le pic
          // (la glycémie plafonne haut au lieu de redescendre) — correctif B (2026-07-14).
          { dose: DOSE_BASE_CUMUL, tInjection: T_INJECTION_DEFAUT, exces: EXCES_SITUATION_B }
        : // Situation A « redescend toute seule » : dose de repas faible → montée post-prandiale nette
          // (haut dans le rouge, correctif A) puis retour spontané dans la cible vers +3h.
          { dose: DOSE_BASE_CUMUL, tInjection: T_INJECTION_DEFAUT },
    [situationCumul],
  );
  const t4Points = useMemo(
    () => ({
      sansRecorrection: sampleRepasAvecBolus(REPAS_CUMUL, t4BolusBase),
      avecRecorrection:
        recorrection === 'aucune'
          ? null
          : sampleRepasAvecBolus(REPAS_CUMUL, {
              ...t4BolusBase,
              tSecondeDose: RECORR_DELAIS[recorrection],
              // La recorrection est une vraie dose de correction, plus généreuse que la dose de repas
              // de base → l'ajout fait plonger sous la cible quand il n'était pas nécessaire (A) ou
              // trop précoce (B, cumul).
              doseCorrection: DOSE_RECORRECTION,
            }),
    }),
    [t4BolusBase, recorrection],
  );
  const t4Issue = useMemo(() => matriceCumul(situationCumul, recorrection), [situationCumul, recorrection]);
  const t4Courbes: CourbeDef[] = useMemo(() => {
    const list: CourbeDef[] = [
      {
        id: 'base',
        d: toSvgPath(t4Points.sansRecorrection, DOMAIN_OPTS),
        label: situationCumul === 'revient' ? 'Sans recorrection : redescend seule' : 'Sans recorrection : reste haute',
        variante: 'principale',
      },
    ];
    if (t4Points.avecRecorrection) {
      list.push({
        id: 'recorrection',
        d: toSvgPath(t4Points.avecRecorrection, DOMAIN_OPTS),
        label: recorrection === 'tot' ? 'Avec recorrection trop tôt' : 'Avec recorrection après attente',
        variante: 'fantome',
      });
    }
    return list;
  }, [t4Points, situationCumul, recorrection]);
  const t4Marqueurs: MarqueurDef[] = useMemo(() => {
    const list: MarqueurDef[] = [REPAS_MARQUEUR, { t: frac(T_INJECTION_DEFAUT), type: 'activite', label: '1ʳᵉ dose' }];
    if (recorrection !== 'aucune') {
      list.push({ t: frac(RECORR_DELAIS[recorrection]), type: 'activite', label: '2ᵉ dose' });
    }
    return list;
  }, [recorrection]);

  if (!shell) return null;

  const navBar = (
    <div className={styles.tabs} role="tablist" aria-label="Les 5 temps du module Insuline rapide">
      {TEMPS_TABS.map((tab, index) => (
        <button
          key={tab.n}
          type="button"
          role="tab"
          id={`m10-tab-${tab.n}`}
          aria-selected={temps === tab.n}
          aria-controls={`m10-panel-${tab.n}`}
          tabIndex={temps === tab.n ? 0 : -1}
          className={temps === tab.n ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setTemps(tab.n)}
          onKeyDown={(e) => handleTabsKeyDown(e, index, setTemps)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide nav={navBar}>
    <div className={styles.module}>
      {/* ── Temps ① — Couvrir le repas ────────────────────────────────────── */}
      <section id="m10-panel-1" role="tabpanel" aria-labelledby="m10-tab-1" hidden={temps !== 1} className={styles.panel}>
        <div className={`card ${styles.situationCard}`}>
          <div className={styles.chipRow} role="radiogroup" aria-label="Glucides du repas">
            {REPAS_CRANS.map((c) => {
              const active = repasId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
                  onClick={() => setRepasId(c.id)}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <DoseSelector value={doseCouvrir} onChange={setDoseCouvrir} />

          <div className={styles.courbeCard}>
            <p className="eyebrow">Ce que fait le sucre après le repas</p>
            <CourbeGlycemie courbes={t1Courbes} bandes={bandes} marqueurs={[REPAS_MARQUEUR]} axeLabels={AXE_LABELS} />
            <div className={styles.legendeRow}>
              <span className={styles.legendeFantome}>- - Sans rapide</span>
              <span className={styles.legendePrincipale}>— Avec rapide, à la dose choisie</span>
            </div>
          </div>

          <p className={styles.message}>{messageCouvrir(repasId, doseCouvrir)}</p>
        </div>
      </section>

      {/* ── Temps ② — Le bon moment ───────────────────────────────────────── */}
      <section id="m10-panel-2" role="tabpanel" aria-labelledby="m10-tab-2" hidden={temps !== 2} className={styles.panel}>
        <div className={`card ${styles.courbeCard}`}>
          <p className="eyebrow">Glycémie après le repas, selon le moment de l'injection</p>
          <CourbeGlycemie courbes={t2Courbes} bandes={bandes} marqueurs={t2Marqueurs} axeLabels={AXE_LABELS} />

          <div className={styles.sliderBlock}>
            <input
              type="range"
              min={DELAY_MIN}
              max={DELAY_MAX}
              step={DELAY_STEP}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className={styles.slider}
              aria-label="Moment de l'injection de la rapide par rapport au repas"
            />
            {/* Libellé dynamique, seule source visuelle de la phase courante sur la piste (item 6) :
                remplace les 4 anciennes étiquettes équiréparties, incohérentes avec les seuils réels
                de `timingPhase`. Centré plutôt que calé sous le pouce du <input type=range> : suivre
                le pouce au pixel près est fragile cross-navigateur (largeur de thumb non uniforme) —
                un libellé centré reste toujours exact quant à la phase, ce qui est le seul invariant
                exigé (cf. S2.md « Si bloqué »). */}
            <p className={styles.sliderLabel} aria-live="polite">
              {timingPhase(delay).libelle}
            </p>
          </div>
        </div>

        <p className={styles.message}>{timingHint(delay)}</p>
      </section>

      {/* ── Temps ③ — Corriger avant le repas ─────────────────────────────── */}
      <section id="m10-panel-3" role="tabpanel" aria-labelledby="m10-tab-3" hidden={temps !== 3} className={styles.panel}>
        <div className={`card ${styles.situationCard}`}>
          <div className={styles.chipRow} role="radiogroup" aria-label="Glycémie avant le repas">
            {DEPART_OPTIONS.map((d) => {
              const active = departId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
                  onClick={() => setDepartId(d.id)}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          <DoseSelector value={doseCorriger} onChange={setDoseCorriger} />

          <div className={styles.courbeCard}>
            <p className="eyebrow">Ce que fait le sucre, selon la glycémie de départ et la dose</p>
            <CourbeGlycemie courbes={t3Courbes} bandes={bandes} marqueurs={[REPAS_MARQUEUR]} axeLabels={AXE_LABELS} />
          </div>

          <div className={styles.bridgeRow}>
            <p className={styles.message}>{messageCorriger(departId, doseCorriger)}</p>
            {departId === 'basse' && (
              <button type="button" className="btn btn--ghost" onClick={() => onNavigate('hypoglycemie')}>
                Traiter l'hypo d'abord
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Temps ④ — Le piège du cumul ───────────────────────────────────── */}
      <section id="m10-panel-4" role="tabpanel" aria-labelledby="m10-tab-4" hidden={temps !== 4} className={styles.panel}>
        <div className={`card ${styles.situationCard}`}>
          <div className={styles.chipRow} aria-label="Après le repas">
            {SITUATION_CUMUL_OPTIONS.map((opt) => {
              const active = situationCumul === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
                  onClick={() => {
                    setSituationCumul(opt.id);
                    setRecorrection('aucune');
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className={styles.chipRow} aria-label="Recorriger ou attendre">
            {RECORRECTION_OPTIONS.map((opt) => {
              const active = recorrection === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
                  onClick={() => setRecorrection(opt.id)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className={styles.courbeCard}>
            <p className="eyebrow">Ce que fait le sucre selon ce qu'on fait après le repas</p>
            <CourbeGlycemie courbes={t4Courbes} bandes={bandes} marqueurs={t4Marqueurs} axeLabels={AXE_LABELS} />
            <div className={styles.legendeRow}>
              <span className={styles.legendePrincipale}>
                — {situationCumul === 'revient' ? 'Sans recorrection : redescend seule' : 'Sans recorrection : reste haute'}
              </span>
              {recorrection !== 'aucune' && (
                <span className={t4Issue.plonge ? styles.legendeVigilance : styles.legendePrincipale}>
                  - - {t4Issue.plonge ? 'Avec cette recorrection : ça plonge sous la cible' : 'Avec cette recorrection : ça revient dans la cible'}
                </span>
              )}
            </div>
          </div>

          <div className={styles.bridgeRow}>
            <p className={styles.message}>{t4Issue.message}</p>
            {t4Issue.plonge && (
              <button type="button" className="btn btn--ghost" onClick={() => onNavigate('hypoglycemie')}>
                Ça ressemble à une hypo → le réflexe
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Temps ⑤ — Et si je ne mange pas ? (G5 : onglet distinct, item 2, S5.md IA6) ────── */}
      <section id="m10-panel-5" role="tabpanel" aria-labelledby="m10-tab-5" hidden={temps !== 5} className={styles.panel}>
        <div className={`card ${styles.situationCard}`}>
          <div className={styles.courbeCard}>
            <p className="eyebrow">Ce que fait le sucre si le repas est sauté</p>
            <CourbeGlycemie courbes={T5_COURBES} bandes={bandes} marqueurs={[REPAS_MARQUEUR]} axeLabels={AXE_LABELS} />
            <div className={styles.legendeRow}>
              <span className={styles.legendeFantome}>- - Sans rapide</span>
              <span className={styles.legendeVigilance}>— Avec rapide, injectée quand même</span>
            </div>
          </div>

          <div className={styles.bridgeRow}>
            <p className={styles.message}>{MESSAGE_SANS_REPAS}</p>
            <button type="button" className="btn btn--ghost" onClick={() => onNavigate('hypoglycemie')}>
              Ça ressemble à une hypo → le réflexe
            </button>
          </div>

          {/* Option post-prandiale : EXCEPTION (inappétence/maladie), jamais une méthode de
              routine (doc §3 temps ⑤, S5.md étape 4). `// à revalider (Thibault)`. */}
          <p className={styles.exceptionNote}>{MESSAGE_EXCEPTION_POST_PRANDIAL}</p>
        </div>
      </section>

      <div className={styles.piedRefrain}>
        <p className="filrouge">La bonne dose, c'est celle de votre protocole — ici on apprend le raisonnement, pas les chiffres.</p>
        {/* Pont (item 8b) : relie « ce repas » (rapide) à « la journée entière » (basale) — paire
            avec la phrase-pont symétrique du module basale (S4, item 8a). `// à revalider (Thibault)`. */}
        <p className={styles.pont}>{PONT_VERS_BASALE}</p>
      </div>
    </div>
    </ModuleShell>
  );
}
