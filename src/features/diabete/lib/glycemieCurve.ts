/**
 * Modèle physiologique de glycémie (thème diabète), sur le patron de
 * `src/features/tabac/lib/nicotineCurve.ts` : lib pure, sans état, échantillonnage
 * temporel → `Point[]`, une seule identité de courbe réutilisée aux modules 2, 3, 8, 9
 * (brief §1.2 « LA COURBE »). Remplace le « score → bosse » de la maquette par un
 * modèle où la forme découle des situations illustrées (composition du repas, ordre,
 * proportions, activité physique, resucrage, scénarios nocturnes).
 *
 * Unités : temps en **minutes**, niveau **0–100** (échelle relative) :
 * ~15 = plancher hypo, ~30 = baseline à jeun, ~45-60 = bande cible post-repas,
 * 100 = pic majeur. Les mg/dL ne sont qu'une conversion indicative d'affichage
 * hover (`mgFromLevel`) — jamais enseignée telle quelle (SPEC §6.3).
 *
 * ⚠️ Modèle pédagogique, pas un simulateur métabolique validé : chaque affirmation
 * du brief/SPEC (hauteur du pic, moment du pic, douceur de la descente, écrêtage par
 * l'activité, overshoot du resucrage, dérive nocturne…) est un **invariant testé**
 * dans `glycemieCurve.test.ts`, pas une valeur au mg/dL près.
 *
 * API gelée (plan `theme-diabete/S2.md`) pour les modules consommateurs
 * (S5 = alimentation, S6 = activité, S11 = hypoglycémie, S12 = insuline) :
 * - constantes : LEVEL_MAX, BASELINE, BANDE_CIBLE_DEFAUT
 * - types : Point, AlimentRepas, Assiette, RepasParams, ActiviteParams,
 *   ScenarioTrace
 * - paramsFromAssiette(assiette) : RepasParams
 * - sampleRepas(params, opts?) : Point[] — courbe post-repas 0→180 min
 * - sampleActivite(params, activite) : Point[] — courbe + effet d'un mouvement
 * - sampleRepasAvecBolus(params, bolus) : Point[] — courbe + effet d'un bolus rapide (S10)
 * - sampleRecuperation(opts) : Point[] — courbe de récupération après resucrage(s)
 * - sampleJournee(scenario, seed) : Point[] — trace 24 h (coucher → coucher)
 * - sampleNuits(scenario, n, seed) : Point[][] — n traces superposées
 * - tempsDansCible(traces, bande) : { bas, cible, haut } (pourcentages, somme 100)
 * - toSvgPath(points, viewBox) : chemin SVG
 * - mgFromLevel(v) : conversion indicative (hover uniquement)
 *
 * Évolution 2026-07-09 (S14, demande Thibault) : `paramsFromAssiette` dérive désormais
 * la courbe de la **composition réelle approximative** du repas (charge glycémique,
 * fibres, protéines, lipides) plutôt que d'heuristiques de familles + proximité à une
 * assiette-modèle — `Famille` et les proportions sortent de la lib (ne vivent plus que
 * côté modules). L'ordre du féculent devient gradué (`ordreFeculent` 0→1, l'ancien booléen
 * `ordreFeculentDernier` disparaît). Le scénario nocturne `nuit_isolee` est remplacé par
 * `descend_hypo_matinale`, et le raccord nuit→jour de `sampleJournee` est continu.
 */

export const LEVEL_MAX = 100;
export const BASELINE = 30;
/** Plancher hypo indicatif (SPEC §12) — non exporté : usage interne uniquement. */
const HYPO_FLOOR = 15;

/** Bande-cible par défaut (module 9 : réglable par le soignant : voir SPEC §13.3). */
export const BANDE_CIBLE_DEFAUT: { basse: number; haute: number } = { basse: 25, haute: 60 };

export type Point = { t: number; v: number };

// ---------------------------------------------------------------------------
// Repas (modules 2 / 3)
// ---------------------------------------------------------------------------

export type AlimentRepas = { cg: number; fibres: number; proteines: number; lipides: number };

export type Assiette = {
  aliments: AlimentRepas[];
  /** Position du féculent dans le repas, 0 = mangé en premier … 1 = mangé en dernier. */
  ordreFeculent?: number;
};

export type RepasParams = { charge: number; frein: number; retard: number };

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

function clampRange(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/**
 * Constante de saturation de la charge glycémique cumulée (jamais de cumul linéaire infini).
 * Corrections-visuelles S2 (2026-07-11, revue Thibault #9) : abaissée de 60 à 20 — un féculent
 * seul « rouge » (CG ~20-30) doit déjà culminer haut (~75-85/100), et 2-3 féculents cumulés
 * doivent approcher le plafond (~90/100). `// à revalider (Thibault)` — calibrage pédagogique,
 * pas un score métabolique validé.
 */
const K_CHARGE = 20;
/**
 * Constantes de saturation du frein (aplatissement) et du retard (décalage du pic) liés à
 * la composition réelle du repas (fibres/lipides/protéines, S14 §0.c.3) — calibrées pour que
 * les assiettes types du module restent dans la dynamique visuelle du modèle. Corrections-
 * visuelles S2 (2026-07-11) : relevées de 6/5 à 20/14 en même temps que `K_CHARGE` — sans
 * ce réajustement conjoint, le frein cumulé de plusieurs féculents identiques (chacun
 * apportant ses propres fibres/lipides/protéines) rattraperait le gain de charge et
 * empêcherait « 3 féculents » de culminer plus haut qu'« 1 seul » (cf. VALIDATION.md §S2).
 */
const K_FREIN = 20;
const K_RETARD = 14;

/**
 * Bonus d'ordre (défi ③) : amplifiés S2 (0.45→0.6, 0.35→0.5) pour que « féculent en dernier »
 * vs « en premier » produise un écart de pic nettement lisible (delta ≥ ~15 points sur les
 * assiettes types du défi). `// à revalider (Thibault)` — effet réel plus modeste dans la vraie
 * vie, accentué ici pour la pédagogie (cf. index.md §Décisions).
 */
const ORDRE_FREIN_BONUS = 0.6;
const ORDRE_RETARD_BONUS = 0.5;

/**
 * Agrège une assiette en paramètres de repas à partir de sa composition réelle approximative
 * (S14 §0.c) : les fibres freinent fort l'absorption et retardent modérément le pic, les
 * lipides ralentissent fort la vidange gastrique (retardent, allongent la descente) et
 * aplatissent modérément, les protéines aplatissent modérément et retardent peu. L'ordre du
 * féculent (0 = en premier … 1 = en dernier) ajoute un bonus gradué aux deux effets.
 */
export function paramsFromAssiette(assiette: Assiette): RepasParams {
  const aliments = assiette.aliments ?? [];

  const totalCg = aliments.reduce((sum, a) => sum + Math.max(0, a.cg), 0);
  const charge = clamp01(1 - Math.exp(-totalCg / K_CHARGE));

  const totalFibres = aliments.reduce((sum, a) => sum + Math.max(0, a.fibres), 0);
  const totalLipides = aliments.reduce((sum, a) => sum + Math.max(0, a.lipides), 0);
  const totalProteines = aliments.reduce((sum, a) => sum + Math.max(0, a.proteines), 0);

  const freinRaw = clamp01(
    1 - Math.exp(-(1.0 * totalFibres + 0.25 * totalLipides + 0.15 * totalProteines) / K_FREIN),
  );
  const retardRaw = clamp01(
    1 - Math.exp(-(0.5 * totalFibres + 1.0 * totalLipides + 0.15 * totalProteines) / K_RETARD),
  );

  const ordreFrac = clamp01(assiette.ordreFeculent ?? 0);
  const frein = clamp01(freinRaw + ORDRE_FREIN_BONUS * ordreFrac);
  const retard = clamp01(retardRaw + ORDRE_RETARD_BONUS * ordreFrac);

  return { charge, frein, retard };
}

const AMP_MAX = LEVEL_MAX - BASELINE; // 70
/** Fraction minimale du pic (pic minimal visible même pour une assiette entièrement verte). */
const AMP_FLOOR_FRACTION = 0.06;
/** Latence avant que la montée ne débute (SPEC : « latence ~10-15 min »). */
const LATENCE_REPAS = 12;

function ease(f: number): number {
  const c = clamp01(f);
  return (1 - Math.cos(Math.PI * c)) / 2;
}

function peakAmplitude(params: RepasParams): number {
  if (params.charge <= 0) return 0;
  const heightFactor = clamp01(params.charge) * (1 - 0.6 * clamp01(params.frein));
  return AMP_MAX * (AMP_FLOOR_FRACTION + (1 - AMP_FLOOR_FRACTION) * heightFactor);
}

/** Instant du pic (minutes après le repas) : ~30 min (charge forte, frein nul) à ~75 min (mixte). */
function peakTimeMinutes(params: RepasParams): number {
  return 30 + 45 * clamp01(params.retard);
}

/** Retour à la baseline (minutes après le repas) : ~120 min à ~180 min selon le frein. */
function endTimeMinutes(params: RepasParams): number {
  return 120 + 60 * clamp01(params.frein);
}

/** Niveau ponctuel de la courbe post-repas à l'instant t (minutes, t=0 = repas). */
function repasLevelAt(params: RepasParams, t: number): number {
  if (t <= LATENCE_REPAS) return BASELINE;
  const amp = peakAmplitude(params);
  const peakT = peakTimeMinutes(params);
  const endT = endTimeMinutes(params);
  if (t <= peakT) {
    const f = (t - LATENCE_REPAS) / (peakT - LATENCE_REPAS);
    return BASELINE + amp * ease(f);
  }
  if (t <= endT) {
    const f = (t - peakT) / (endT - peakT);
    return BASELINE + amp * (1 - ease(f));
  }
  return BASELINE;
}

function sampleRange(tStart: number, tEnd: number, stepMinutes: number, levelAt: (t: number) => number): Point[] {
  const points: Point[] = [];
  const epsilon = 1e-9;
  for (let t = tStart; t <= tEnd + epsilon; t += stepMinutes) {
    const tr = Math.round(t * 100) / 100;
    points.push({ t: tr, v: clampRange(levelAt(tr), 0, LEVEL_MAX) });
  }
  return points;
}

/** Courbe post-repas sur 0→180 min (par défaut plateau baseline visible dès -20 min). */
export function sampleRepas(
  params: RepasParams,
  opts?: { tStart?: number; tEnd?: number; stepMinutes?: number },
): Point[] {
  const tStart = opts?.tStart ?? -20;
  const tEnd = opts?.tEnd ?? 180;
  const step = opts?.stepMinutes ?? 1;
  return sampleRange(tStart, tEnd, step, (t) => repasLevelAt(params, t));
}

// ---------------------------------------------------------------------------
// Activité (module 3)
// ---------------------------------------------------------------------------

export type ActiviteParams = {
  debut: number;
  duree: number;
  type: 'marche' | 'microcoupures';
  coupures?: number;
};

/** Fenêtre de rémanence après la fin de l'activité (SPEC §8.1-③). */
const REMANENCE_MINUTES = 30;
const NOTCH_STRENGTH = 0.09;
const NOTCH_RAMP_MINUTES = 4;
const MAX_COUPURES = 6;

/**
 * Facteur multiplicatif [floor, 1] appliqué à l'excès au-dessus de la baseline.
 * Vaut exactement 1 avant `debut` (la courbe suit exactement `sampleRepas` jusque-là).
 * Marche : ramp continue sur la fenêtre + rémanence, puis plateau bas (pas de retour à 1 —
 * le sucre consommé ne revient pas). Micro-coupures : encoches discrètes cumulatives,
 * chacune une brève accélération rampée (continuité garantie).
 */
function activiteMultiplier(t: number, activite: ActiviteParams): number {
  if (t < activite.debut) return 1;

  if (activite.type === 'marche') {
    const strength = clampRange(0.25 + activite.duree * 0.015, 0.25, 0.6);
    const windowEnd = activite.debut + activite.duree + REMANENCE_MINUTES;
    if (t >= windowEnd) return 1 - strength;
    const f = (t - activite.debut) / (windowEnd - activite.debut);
    return 1 - strength * ease(f);
  }

  // microcoupures
  const coupures = clampRange(Math.round(activite.coupures ?? 0), 0, MAX_COUPURES);
  let m = 1;
  for (let i = 0; i < coupures; i++) {
    const ti = activite.debut + i * 30;
    if (t < ti) continue;
    const f = Math.min(1, (t - ti) / NOTCH_RAMP_MINUTES);
    m *= 1 - NOTCH_STRENGTH * f;
  }
  return m;
}

/**
 * Courbe post-repas + effet d'une activité physique. Suit exactement `sampleRepas`
 * jusqu'à `debut` ; au-delà, la consommation musculaire accélère la baisse pendant la
 * fenêtre + ~30 min de rémanence. Conséquences émergentes (non codées en dur) :
 * marche pendant la montée → pic écrêté ; marche tardive → pic intact, seule la queue
 * plonge plus vite.
 */
export function sampleActivite(params: RepasParams, activite: ActiviteParams): Point[] {
  const extra =
    activite.type === 'microcoupures'
      ? clampRange(Math.round(activite.coupures ?? 0), 0, MAX_COUPURES) * 30 + 20
      : activite.duree + REMANENCE_MINUTES + 10;
  const tEnd = Math.max(180, activite.debut + extra);
  return sampleRange(-20, tEnd, 1, (t) => {
    const base = repasLevelAt(params, t);
    const mult = activiteMultiplier(t, activite);
    return BASELINE + Math.max(0, base - BASELINE) * mult;
  });
}

// ---------------------------------------------------------------------------
// Bolus rapide / pré-prandial (module 10)
// ---------------------------------------------------------------------------

export type BolusParams = {
  /** Quantité de rapide, qualitative [0,1] : 0 = pas de bolus, ~0.5 = couvre un repas moyen,
   *  1 = forte dose. Jamais convertie en unités affichées. */
  dose: number;
  /** Instant d'injection en minutes relatives au repas (t=0). Négatif = avant le repas
   *  (ex. -15 = 15 min avant). // à revalider (Thibault) : -15 = optimum analogue rapide. */
  tInjection: number;
  /** Glycémie de départ avant le repas, échelle 0–100 (défaut BASELINE). Sert au temps ③
   *  (correction) : point de départ plus haut/bas. */
  depart?: number;
  /** Instant d'une 2ᵉ dose de correction (minutes, t=0 = repas). Absent = pas de cumul.
   *  Sert au temps ④ : une 2ᵉ dose rapprochée creuse sous la cible. */
  tSecondeDose?: number;
};

/** Profil PK/PD qualitatif d'un analogue rapide (`// à revalider (Thibault)`, cf.
 *  `docs/diabete/10-insuline-rapide.md` §5 — Slattery 2018, De Block 2022, Walsh 2014). */
const BOLUS_LATENCE = 15; // début d'action ~15 min après injection
const BOLUS_PIC = 60; // pic d'action ~60 min après injection
// durée d'action ~3 h (borne basse de l'activité clinique 3-4 h) : calibrée à la borne basse
// plutôt qu'à 4 h pour qu'un bolus unique bien dosé/bien timé ne laisse pas une traîne
// résiduelle qui creuse artificiellement sous la baseline après le retour à baseline du repas
// (cf. glycemieCurve.test.ts « invariant 10 », qui distingue dose unique vs cumul) — reste
// dans la fourchette sourcée, // à revalider (Thibault).
const BOLUS_DUREE = 180;
const BOLUS_EFFET_MAX = 55; // baisse max (points d'échelle 0–100) à dose=1 // à caler

/** Effet hypoglycémiant instantané d'un bolus (points 0–100 soustraits), à `dtDepuisInjection`
 *  minutes de l'injection. Cloche : 0 avant la latence, monte jusqu'au pic, décroît à 0 en fin
 *  de durée d'action. `dose` [0,1] met à l'échelle l'amplitude. */
function bolusEffet(dtDepuisInjection: number, dose: number): number {
  if (dose <= 0 || dtDepuisInjection <= BOLUS_LATENCE || dtDepuisInjection >= BOLUS_DUREE) return 0;
  const montee = BOLUS_PIC - BOLUS_LATENCE;
  const descente = BOLUS_DUREE - BOLUS_PIC;
  const f =
    dtDepuisInjection <= BOLUS_PIC
      ? ease((dtDepuisInjection - BOLUS_LATENCE) / montee)
      : 1 - ease((dtDepuisInjection - BOLUS_PIC) / descente);
  return dose * BOLUS_EFFET_MAX * f;
}

/**
 * Courbe post-repas + effet d'un bolus rapide (avec correction de départ et 2ᵉ dose
 * optionnelle). Sur le patron de `sampleActivite` : n'altère jamais `repasLevelAt`, se
 * contente de soustraire l'effet du bolus par-dessus.
 */
export function sampleRepasAvecBolus(params: RepasParams, bolus: BolusParams): Point[] {
  const depart = bolus.depart ?? BASELINE;
  const decalageDepart = depart - BASELINE; // temps ③ : correction du point de départ
  const tEnd = Math.max(180, (bolus.tSecondeDose ?? 0) + BOLUS_DUREE);
  return sampleRange(-20, tEnd, 1, (t) => {
    const repas = repasLevelAt(params, t) + decalageDepart;
    let effet = bolusEffet(t - bolus.tInjection, bolus.dose);
    if (bolus.tSecondeDose !== undefined) {
      // 2ᵉ dose de correction (même dose qualitative que la principale, à défaut d'un réglage) :
      effet += bolusEffet(t - bolus.tSecondeDose, bolus.dose);
    }
    return clampRange(repas - effet, 0, LEVEL_MAX);
  });
}

// ---------------------------------------------------------------------------
// Récupération / resucrage (module 8)
// ---------------------------------------------------------------------------

/** Départ en zone basse (~15, SPEC §12.1). */
const HYPO_START = HYPO_FLOOR;
const RESUCRAGE_LATENCE = 5;
const RESUCRAGE_RISE = 15;
const RESUCRAGE_AMP = 25;

function resucrageContribution(dt: number): number {
  if (dt < RESUCRAGE_LATENCE) return 0;
  const rampT = dt - RESUCRAGE_LATENCE;
  if (rampT < RESUCRAGE_RISE) return RESUCRAGE_AMP * ease(rampT / RESUCRAGE_RISE);
  return RESUCRAGE_AMP;
}

/**
 * Courbe de récupération après un ou plusieurs resucrages de 15 g. Une prise → retour
 * en bande cible sans la dépasser. Une deuxième prise avant t+15 → overshoot net
 * au-dessus de la bande (on montre pourquoi on attend, SPEC §12.2).
 * `second` : information pour le module consommateur (ex. badge « 2e prise »), la
 * courbe elle-même suit exactement les instants fournis dans `resucrages`.
 */
export function sampleRecuperation(opts: { resucrages: number[]; second?: boolean }): Point[] {
  const resucrages = opts.resucrages ?? [];
  const last = resucrages.length > 0 ? Math.max(...resucrages) : 0;
  const tEnd = Math.max(45, last + 35);
  return sampleRange(0, tEnd, 1, (t) => {
    let v = HYPO_START;
    for (const r of resucrages) v += resucrageContribution(t - r);
    return v;
  });
}

// ---------------------------------------------------------------------------
// Journée / nuits (module 9)
// ---------------------------------------------------------------------------

export type ScenarioTrace =
  | 'stable'
  | 'derive_haute'
  | 'descend_hypo_matinale'
  | 'haut_stable_apres_repas'
  | 'plonge_bas';

const NUIT_MINUTES = 480; // 8h de nuit
const JOUR_MINUTES = 960; // 16h de jour
const JOURNEE_MINUTES = NUIT_MINUTES + JOUR_MINUTES; // 24h, coucher -> coucher
/** Durée du raccord nuit→jour (S14 §0.d.3) : la portion jour repart du niveau de fin de nuit
 *  et revient vers BASELINE en douceur, plutôt qu'un saut brutal. */
const RACCORD_MATIN_MINUTES = 90;

/** Repas représentatif utilisé pour les 3 bosses de la trace 24h (mêmes formes qu'au module 2). */
const REPAS_JOURNEE: RepasParams = { charge: 0.55, frein: 0.35, retard: 0.3 };
/** Offsets des 3 repas depuis le réveil (minutes dans la portion « jour »). */
const OFFSETS_REPAS_JOUR = [60, 300, 660];

function bumpNocturne(x: number): number {
  // bosse douce centrée vers 60% de la nuit (~3-4h du matin), forme gaussienne.
  const c = 0.6;
  const w = 0.25;
  const d = (x - c) / w;
  return Math.exp(-d * d);
}

/** Niveau de base nocturne (sans bruit) selon le scénario, x = position dans la nuit [0,1]. */
function nightBaseLevel(scenario: ScenarioTrace, x: number): number {
  switch (scenario) {
    case 'derive_haute':
      return BASELINE + 28 * x;
    case 'plonge_bas':
      return BASELINE - 22 * bumpNocturne(x);
    case 'haut_stable_apres_repas':
      return BASELINE + 30;
    case 'descend_hypo_matinale':
      // Descente progressive (ease) jusqu'à frôler le plancher hypo au petit matin.
      return BASELINE - (BASELINE - (HYPO_FLOOR + 3)) * ease(x);
    default:
      // 'stable'
      return BASELINE;
  }
}

/**
 * Niveau de la portion jour : repart du niveau de fin de nuit (`nightEndLevel`) et revient
 * vers BASELINE en ~`RACCORD_MATIN_MINUTES` (décroissance ease de l'écart), les bosses repas
 * s'ajoutant par-dessus (S14 §0.d.3 — corrige le saut brutal au passage nuit→jour).
 */
function dayLevelAt(xMinutes: number, nightEndLevel: number): number {
  const ecart = nightEndLevel - BASELINE;
  const raccord = xMinutes < RACCORD_MATIN_MINUTES ? ecart * (1 - ease(xMinutes / RACCORD_MATIN_MINUTES)) : 0;
  let v = BASELINE + raccord;
  for (const offset of OFFSETS_REPAS_JOUR) {
    v += Math.max(0, repasLevelAt(REPAS_JOURNEE, xMinutes - offset) - BASELINE);
  }
  return v;
}

/** PRNG déterministe mulberry32 (jamais `Math.random()` — traces reproductibles). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOISE_ANCHOR_STEP = 30; // minutes
const NOISE_AMPLITUDE = 2;

/** Bruit doux déterministe : anchors espacées de 30 min, interpolées linéairement. */
function buildNoiseAnchors(rng: () => number): number[] {
  const count = Math.floor(JOURNEE_MINUTES / NOISE_ANCHOR_STEP) + 2;
  const anchors: number[] = [];
  for (let i = 0; i < count; i++) anchors.push((rng() - 0.5) * 2 * NOISE_AMPLITUDE);
  return anchors;
}

function noiseAt(anchors: number[], t: number): number {
  const idx = t / NOISE_ANCHOR_STEP;
  const i0 = Math.floor(idx);
  const i1 = Math.min(anchors.length - 1, i0 + 1);
  const f = idx - i0;
  const a0 = anchors[Math.min(anchors.length - 1, Math.max(0, i0))];
  const a1 = anchors[i1];
  return a0 + (a1 - a0) * f;
}

/**
 * Trace 24 h (coucher → coucher) : segment nuit (pente selon scénario) + bosses
 * post-repas (mêmes formes qu'au module 2 — continuité voulue). Bruit doux
 * déterministe (mulberry32 seedé, jamais `Math.random()`).
 */
export function sampleJournee(scenario: ScenarioTrace, seed: number): Point[] {
  const rng = mulberry32(seed);
  const anchors = buildNoiseAnchors(rng);
  const stepMinutes = 5;
  const nightEndLevel = nightBaseLevel(scenario, 1) + noiseAt(anchors, NUIT_MINUTES);
  return sampleRange(0, JOURNEE_MINUTES, stepMinutes, (t) => {
    if (t <= NUIT_MINUTES) {
      const x = t / NUIT_MINUTES;
      return nightBaseLevel(scenario, x) + noiseAt(anchors, t);
    }
    const xJour = t - NUIT_MINUTES;
    return dayLevelAt(xJour, nightEndLevel) + noiseAt(anchors, t) * 0.4;
  });
}

/**
 * n traces pour superposition (profil type du Libre, SPEC §13.4). `derive_haute` :
 * pente nocturne positive répétée sur toutes les nuits. `descend_hypo_matinale` :
 * descente progressive répétée sur toutes les nuits, minimum en fin de nuit (proche du
 * plancher hypo, S14 §0.d). `plonge_bas` : plongées basses répétées. `haut_stable_apres_repas` :
 * départ haut dès le coucher sur toutes les nuits. Même seed → mêmes traces (déterminisme).
 */
export function sampleNuits(scenario: ScenarioTrace, n: number, seed: number): Point[][] {
  const traces: Point[][] = [];
  for (let i = 0; i < n; i++) {
    traces.push(sampleJournee(scenario, seed + i));
  }
  return traces;
}

/**
 * « Temps dans la cible » (module 9, SPEC §13.4) : pourcentages bas / cible / haut
 * calculés depuis les traces, selon la bande fournie (réglable par le soignant).
 */
export function tempsDansCible(
  traces: Point[][],
  bande: { basse: number; haute: number },
): { bas: number; cible: number; haut: number } {
  let bas = 0;
  let cible = 0;
  let haut = 0;
  let total = 0;
  for (const trace of traces) {
    for (const p of trace) {
      total += 1;
      if (p.v < bande.basse) bas += 1;
      else if (p.v > bande.haute) haut += 1;
      else cible += 1;
    }
  }
  if (total === 0) return { bas: 0, cible: 0, haut: 0 };
  return { bas: (bas / total) * 100, cible: (cible / total) * 100, haut: (haut / total) * 100 };
}

// ---------------------------------------------------------------------------
// Helpers transverses
// ---------------------------------------------------------------------------

/**
 * Chemin SVG pour une série de `Point` (même esprit que `nicotineCurve.toSvgPath`) :
 * `t` est mappé sur l'axe X (domaine [tMin,tMax], par défaut le domaine des points),
 * `v` sur l'axe Y (domaine [vMin,vMax], par défaut [0, LEVEL_MAX]).
 */
export function toSvgPath(
  points: Point[],
  viewBox: { width: number; height: number; tMin?: number; tMax?: number; vMin?: number; vMax?: number },
): string {
  if (points.length === 0) return '';
  const tMin = viewBox.tMin ?? points[0].t;
  const tMax = viewBox.tMax ?? points[points.length - 1].t;
  const vMin = viewBox.vMin ?? 0;
  const vMax = viewBox.vMax ?? LEVEL_MAX;
  const tSpan = tMax - tMin || 1;
  const vSpan = vMax - vMin || 1;

  const coords = points.map((p) => {
    const x = ((p.t - tMin) / tSpan) * viewBox.width;
    const clampedV = clampRange(p.v, vMin, vMax);
    const y = viewBox.height - ((clampedV - vMin) / vSpan) * viewBox.height;
    return `${x},${y}`;
  });
  const [first, ...rest] = coords;
  return rest.length > 0 ? `M${first} L${rest.join(' ')}` : `M${first}`;
}

/**
 * Conversion indicative niveau → mg/dL (hover uniquement, jamais enseignée telle
 * quelle — SPEC §6.3). Affine, ancrée sur BASELINE(30) → 100 mg/dL et 60 → 250 mg/dL
 * (brief §1.2). Non pertinente aux extrêmes (v < ~20) : usage hover dans la plage
 * réaliste des courbes du modèle seulement.
 */
export function mgFromLevel(v: number): number {
  return 5 * v - 50;
}
