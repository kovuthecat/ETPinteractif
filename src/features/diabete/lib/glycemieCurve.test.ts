import { describe, it, expect } from 'vitest';
import {
  LEVEL_MAX,
  BASELINE,
  BANDE_CIBLE_DEFAUT,
  paramsFromAssiette,
  sampleRepas,
  sampleActivite,
  sampleRecuperation,
  sampleJournee,
  sampleNuits,
  tempsDansCible,
  toSvgPath,
  mgFromLevel,
  type Assiette,
  type AlimentRepas,
  type RepasParams,
  type Point,
  type ScenarioTrace,
} from './glycemieCurve';

function peakOf(points: Point[]): { v: number; t: number } {
  let best = points[0];
  for (const p of points) if (p.v > best.v) best = p;
  return { v: best.v, t: best.t };
}

function valueAt(points: Point[], t: number): number {
  const found = points.find((p) => p.t === t);
  if (!found) throw new Error(`no sample at t=${t}`);
  return found.v;
}

// Aliments représentatifs (ordres de grandeur repris de `alimentation/data.ts`, S14 §0.c.1) —
// dupliqués ici en littéraux pour garder la lib découplée des modules (elle ne connaît plus
// les familles).
const RIZ_BLANC: AlimentRepas = { cg: 28, fibres: 1, proteines: 4, lipides: 0.5 };
const RIZ_BASMATI: AlimentRepas = { cg: 19, fibres: 1.5, proteines: 4, lipides: 0.5 };
const RIZ_COMPLET: AlimentRepas = { cg: 16, fibres: 3, proteines: 4.5, lipides: 1.5 };
const BAGUETTE: AlimentRepas = { cg: 22, fibres: 1.5, proteines: 4, lipides: 1 };
const PAIN_COMPLET: AlimentRepas = { cg: 14, fibres: 3.5, proteines: 5, lipides: 1.5 };
const BROCOLI: AlimentRepas = { cg: 1, fibres: 4, proteines: 3, lipides: 0 };
const HUILE_OLIVE: AlimentRepas = { cg: 0, fibres: 0, proteines: 0, lipides: 10 };
const POULET: AlimentRepas = { cg: 0, fibres: 0, proteines: 28, lipides: 4 };
const LENTILLES: AlimentRepas = { cg: 6, fibres: 8, proteines: 12, lipides: 0.5 };
const GALETTE_RIZ: AlimentRepas = { cg: 17, fibres: 0.5, proteines: 1, lipides: 0.5 };
const PASTEQUE: AlimentRepas = { cg: 4, fibres: 0.5, proteines: 0.5, lipides: 0 };

// ---------------------------------------------------------------------------
// Invariant 0.a — assiette vide -> courbe plate.
// ---------------------------------------------------------------------------

describe('0.a — assiette vide (charge nulle) -> courbe plate à la baseline', () => {
  it('paramsFromAssiette({aliments: []}) -> sampleRepas reste exactement à BASELINE partout', () => {
    const params = paramsFromAssiette({ aliments: [] });
    expect(params.charge).toBe(0);
    for (const p of sampleRepas(params)) expect(p.v).toBe(BASELINE);
  });
});

// ---------------------------------------------------------------------------
// Invariant 0.b — ordre gradué du féculent.
// ---------------------------------------------------------------------------

describe('0.b — ordreFeculent gradué', () => {
  const aliments: AlimentRepas[] = [RIZ_BLANC];

  it('pic(féculent en premier) > pic(au milieu) > pic(en dernier), à assiette égale', () => {
    const peakPremier = peakOf(sampleRepas(paramsFromAssiette({ aliments, ordreFeculent: 0 }))).v;
    const peakMilieu = peakOf(sampleRepas(paramsFromAssiette({ aliments, ordreFeculent: 0.5 }))).v;
    const peakDernier = peakOf(sampleRepas(paramsFromAssiette({ aliments, ordreFeculent: 1 }))).v;
    expect(peakPremier).toBeGreaterThan(peakMilieu);
    expect(peakMilieu).toBeGreaterThan(peakDernier);
  });

  it('ordreFeculent absent équivaut à 0 (féculent en premier, comportement par défaut)', () => {
    const sansOrdre = paramsFromAssiette({ aliments });
    const avecZero = paramsFromAssiette({ aliments, ordreFeculent: 0 });
    expect(sansOrdre).toEqual(avecZero);
  });
});

// ---------------------------------------------------------------------------
// Invariant 0.c.4 — composition réelle (charge/fibres/protéines/lipides).
// ---------------------------------------------------------------------------

describe('composition : chaque ajout baisse le pic, le retarde, adoucit la descente', () => {
  const feculentSeul: Assiette = { aliments: [RIZ_BLANC] };
  const plusFibre: Assiette = { aliments: [...feculentSeul.aliments, BROCOLI] };
  const plusProteine: Assiette = { aliments: [...plusFibre.aliments, POULET] };
  const plusLipide: Assiette = { aliments: [...plusProteine.aliments, HUILE_OLIVE] };

  const etapes = [feculentSeul, plusFibre, plusProteine, plusLipide].map((assiette) => {
    const params = paramsFromAssiette(assiette);
    const curve = sampleRepas(params);
    return { params, peak: peakOf(curve) };
  });

  it('féculent seul : pic net et relativement précoce, jamais plat, jamais sous la baseline', () => {
    const [seul] = etapes;
    expect(seul.peak.v).toBeGreaterThan(BASELINE + 15);
    expect(seul.peak.t).toBeLessThanOrEqual(55);
    for (const p of sampleRepas(seul.params)) expect(p.v).toBeGreaterThanOrEqual(BASELINE - 1e-9);
  });

  it('chaque ajout baisse le pic (hauteur)', () => {
    for (let i = 1; i < etapes.length; i++) expect(etapes[i].peak.v).toBeLessThan(etapes[i - 1].peak.v);
  });

  it('chaque ajout retarde le pic (moment)', () => {
    for (let i = 1; i < etapes.length; i++) expect(etapes[i].peak.t).toBeGreaterThan(etapes[i - 1].peak.t);
  });

  it('chaque ajout augmente le frein (descente plus tardive)', () => {
    for (let i = 1; i < etapes.length; i++) expect(etapes[i].params.frein).toBeGreaterThan(etapes[i - 1].params.frein);
  });

  it('la charge glycémique reste quasi constante (aliments ajoutés à CG quasi nulle)', () => {
    for (let i = 1; i < etapes.length; i++) expect(etapes[i].params.charge).toBeCloseTo(etapes[0].params.charge, 1);
  });
});

describe('invariant CG : baguette vs pain complet, riz blanc vs basmati vs complet', () => {
  it('pain complet vs baguette : pic plus bas et plus tardif', () => {
    const baguette = peakOf(sampleRepas(paramsFromAssiette({ aliments: [BAGUETTE] })));
    const painComplet = peakOf(sampleRepas(paramsFromAssiette({ aliments: [PAIN_COMPLET] })));
    expect(painComplet.v).toBeLessThan(baguette.v);
    expect(painComplet.t).toBeGreaterThan(baguette.t);
  });

  it('riz blanc > riz basmati > riz complet : chaque version plus complète a un pic plus bas et plus tardif', () => {
    const blanc = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC] })));
    const basmati = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BASMATI] })));
    const complet = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_COMPLET] })));
    expect(basmati.v).toBeLessThan(blanc.v);
    expect(complet.v).toBeLessThan(basmati.v);
    expect(basmati.t).toBeGreaterThan(blanc.t);
    expect(complet.t).toBeGreaterThan(basmati.t);
  });
});

describe('invariant fibres/lipides/protéines pris isolément (à partir du riz blanc)', () => {
  const rizSeul = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC] })));

  it('riz blanc + brocoli (fibres) : pic plus bas que riz blanc seul', () => {
    const avecBrocoli = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC, BROCOLI] })));
    expect(avecBrocoli.v).toBeLessThan(rizSeul.v);
  });

  it("riz blanc + huile d'olive (lipides) : pic plus bas et nettement plus tardif", () => {
    const avecHuile = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC, HUILE_OLIVE] })));
    expect(avecHuile.v).toBeLessThan(rizSeul.v);
    expect(avecHuile.t - rizSeul.t).toBeGreaterThan(15);
  });

  it('riz blanc + poulet (protéines) : pic plus bas', () => {
    const avecPoulet = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC, POULET] })));
    expect(avecPoulet.v).toBeLessThan(rizSeul.v);
  });
});

describe('invariant légumineuses / galette / pastèque (pièges pédagogiques du brief)', () => {
  // Seuils absolus recalibrés S2 (corrections-visuelles-diabete, 2026-07-11) après
  // désaturation de K_CHARGE/K_FREIN (60/6 → 20/20, cf. glycemieCurve.ts) : le plancher de
  // pic remonte pour TOUS les aliments (même CG basse), donc le seuil qualitatif se déplace
  // avec lui. L'invariant qui compte reste l'écart relatif (piège pédagogique préservé, cf.
  // ci-dessous), pas la valeur absolue.
  const SEUIL_PIC_BAS = BASELINE + 20;

  it('lentilles ≪ riz blanc (légumineuses : CG basse + fibres)', () => {
    const lentilles = peakOf(sampleRepas(paramsFromAssiette({ aliments: [LENTILLES] }))).v;
    const rizBlanc = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC] }))).v;
    expect(lentilles).toBeLessThan(SEUIL_PIC_BAS);
    expect(rizBlanc).toBeGreaterThan(BASELINE + 15);
    expect(lentilles).toBeLessThan(rizBlanc - 25);
  });

  it('galette de riz : pic haut et précoce malgré l\'image "légère" (fibres quasi nulles)', () => {
    const galette = peakOf(sampleRepas(paramsFromAssiette({ aliments: [GALETTE_RIZ] })));
    const painComplet = peakOf(sampleRepas(paramsFromAssiette({ aliments: [PAIN_COMPLET] })));
    expect(galette.v).toBeGreaterThan(painComplet.v);
    expect(galette.t).toBeLessThan(painComplet.t);
  });

  it('pastèque : petit pic (CG basse malgré l\'IG réputé haut)', () => {
    const pasteque = peakOf(sampleRepas(paramsFromAssiette({ aliments: [PASTEQUE] }))).v;
    const rizBlanc = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC] }))).v;
    expect(pasteque).toBeLessThan(SEUIL_PIC_BAS);
    expect(pasteque).toBeLessThan(rizBlanc - 25);
  });
});

// ---------------------------------------------------------------------------
// S2 (corrections-visuelles-diabete, 2026-07-11, captures #6/#9) — pic féculents lisible
// + effet d'ordre nettement visible.
// ---------------------------------------------------------------------------

describe('S2 — pic féculents cumulés nettement plus haut + ordre nettement lisible', () => {
  it('pic(3 féculents identiques) > pic(1 féculent seul), et proche du plafond', () => {
    const un = peakOf(sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC] }))).v;
    const trois = peakOf(
      sampleRepas(paramsFromAssiette({ aliments: [RIZ_BLANC, RIZ_BLANC, RIZ_BLANC] })),
    ).v;
    expect(trois).toBeGreaterThan(un);
    expect(trois).toBeGreaterThan(LEVEL_MAX - 15);
  });

  it('pic(féculent en premier) − pic(féculent en dernier) ≥ 15 points, sur une assiette type du défi ③', () => {
    const aliments = [RIZ_BLANC, POULET, BROCOLI];
    const premier = peakOf(sampleRepas(paramsFromAssiette({ aliments, ordreFeculent: 0 }))).v;
    const dernier = peakOf(sampleRepas(paramsFromAssiette({ aliments, ordreFeculent: 1 }))).v;
    expect(premier - dernier).toBeGreaterThanOrEqual(15);
  });
});

describe('B3 émergent : remplacer une portion de féculent par une portion de protéine ne fait jamais monter le pic', () => {
  function plate(nFeculent: number, nProteine: number): Assiette {
    return {
      aliments: [
        ...Array.from({ length: nFeculent }, () => RIZ_BLANC),
        ...Array.from({ length: nProteine }, () => POULET),
      ],
    };
  }

  it('à portions totales constantes (3), chaque échange féculent -> protéine baisse (ou stagne) le pic', () => {
    const peaks = [0, 1, 2, 3].map((n) => peakOf(sampleRepas(paramsFromAssiette(plate(3 - n, n)))).v);
    for (let i = 1; i < peaks.length; i++) expect(peaks[i]).toBeLessThanOrEqual(peaks[i - 1] + 1e-9);
    expect(peaks[peaks.length - 1]).toBeLessThan(peaks[0]);
  });
});

describe('assiette-modèle émergente (½ légumes · ¼ protéines · ¼ féculents)', () => {
  it('plus douce que 100 % féculents, à portions égales (4), sans aucun paramètre "proportions" dans la lib', () => {
    const modele: Assiette = { aliments: [BROCOLI, BROCOLI, POULET, RIZ_BLANC] };
    const toutFeculent: Assiette = { aliments: [RIZ_BLANC, RIZ_BLANC, RIZ_BLANC, RIZ_BLANC] };
    const peakModele = peakOf(sampleRepas(paramsFromAssiette(modele))).v;
    const peakFeculent = peakOf(sampleRepas(paramsFromAssiette(toutFeculent))).v;
    expect(peakModele).toBeLessThan(peakFeculent);
  });
});

// ---------------------------------------------------------------------------
// Invariant 5 — activité (marche).
// ---------------------------------------------------------------------------

describe('invariant 5 — sampleActivite (marche)', () => {
  const params: RepasParams = { charge: 1, frein: 1, retard: 1 };
  const repasSeul = sampleRepas(params);
  const picRepas = peakOf(repasSeul);

  function avecMarche(debut: number) {
    return sampleActivite(params, { debut, duree: 15, type: 'marche' });
  }

  it('la courbe suit exactement sampleRepas jusqu\'à `debut`', () => {
    const curve = avecMarche(60);
    for (const p of curve) {
      if (p.t < 60) {
        const attendu = repasSeul.find((r) => r.t === p.t);
        if (attendu) expect(p.v).toBeCloseTo(attendu.v, 6);
      }
    }
  });

  it('marche à +15 min écrête le pic ; marche à +60 min écrête moins ; marche à +150 min ne change pas le pic', () => {
    const effet15 = picRepas.v - peakOf(avecMarche(15)).v;
    const effet60 = picRepas.v - peakOf(avecMarche(60)).v;
    const effet150 = picRepas.v - peakOf(avecMarche(150)).v;

    expect(effet15).toBeGreaterThan(effet60);
    expect(effet60).toBeGreaterThan(effet150);
    expect(effet150).toBeCloseTo(0, 6);
  });

  it('marche tardive (+120 min, après le pic) : pic identique (±ε), seule la queue plonge plus vite', () => {
    const curve120 = avecMarche(120);
    const pic120 = peakOf(curve120);
    expect(pic120.v).toBeCloseTo(picRepas.v, 6);

    const queueSansActivite = valueAt(repasSeul, 150);
    const queueAvecActivite = valueAt(curve120, 150);
    expect(queueAvecActivite).toBeLessThan(queueSansActivite);
  });

  it('jamais sous la baseline', () => {
    for (const p of avecMarche(15)) expect(p.v).toBeGreaterThanOrEqual(BASELINE - 1e-9);
  });
});

describe('invariant 6 — sampleActivite (microcoupures)', () => {
  const params: RepasParams = { charge: 1, frein: 1, retard: 1 };
  const repasSeul = sampleRepas(params);

  function avecCoupures(coupures: number) {
    return sampleActivite(params, { debut: 0, duree: 0, type: 'microcoupures', coupures });
  }

  it('6 coupures > 3 coupures > 0 en abaissement cumulé (t=110)', () => {
    const reference = valueAt(repasSeul, 110);
    const abaissement0 = reference - valueAt(avecCoupures(0), 110);
    const abaissement3 = reference - valueAt(avecCoupures(3), 110);
    const abaissement6 = reference - valueAt(avecCoupures(6), 110);

    expect(abaissement0).toBeCloseTo(0, 6);
    expect(abaissement3).toBeGreaterThan(abaissement0);
    expect(abaissement6).toBeGreaterThan(abaissement3);
  });

  it('la courbe reste continue (pas de saut brusque d\'un échantillon au suivant)', () => {
    const curve = avecCoupures(6);
    let maxJump = 0;
    for (let i = 1; i < curve.length; i++) {
      maxJump = Math.max(maxJump, Math.abs(curve[i].v - curve[i - 1].v));
    }
    expect(maxJump).toBeLessThan(4);
  });
});

// ---------------------------------------------------------------------------
// Invariant 7 — récupération / resucrage.
// ---------------------------------------------------------------------------

describe('invariant 7 — sampleRecuperation', () => {
  it('1 resucrage -> retour en bande cible sans la dépasser', () => {
    const curve = sampleRecuperation({ resucrages: [0] });
    const max = Math.max(...curve.map((p) => p.v));
    expect(max).toBeGreaterThan(BANDE_CIBLE_DEFAUT.basse);
    expect(max).toBeLessThanOrEqual(BANDE_CIBLE_DEFAUT.haute);
  });

  it('2 resucrages à 5 min d\'écart -> overshoot net au-dessus de la bande', () => {
    const curve = sampleRecuperation({ resucrages: [0, 5], second: true });
    const max = Math.max(...curve.map((p) => p.v));
    expect(max).toBeGreaterThan(BANDE_CIBLE_DEFAUT.haute);
  });

  it('la remontée ne commence pas avant ~5 min (latence)', () => {
    const curve = sampleRecuperation({ resucrages: [0] });
    expect(valueAt(curve, 4)).toBeCloseTo(15, 6);
    expect(valueAt(curve, 10)).toBeGreaterThan(valueAt(curve, 4));
  });
});

// ---------------------------------------------------------------------------
// Invariant 8 — nuits.
// ---------------------------------------------------------------------------

function nightSegment(trace: Point[]): Point[] {
  return trace.filter((p) => p.t <= 480);
}

describe('invariant 8 — sampleJournee / sampleNuits', () => {
  it('derive_haute : pente nocturne moyenne positive sur toutes les traces', () => {
    const traces = sampleNuits('derive_haute', 4, 1234);
    for (const trace of traces) {
      const nuit = nightSegment(trace);
      const debut = nuit.slice(0, 4).reduce((s, p) => s + p.v, 0) / 4;
      const fin = nuit.slice(-4).reduce((s, p) => s + p.v, 0) / 4;
      expect(fin).toBeGreaterThan(debut);
    }
  });

  it('plonge_bas : minimum nocturne sous la bande basse, sur toutes les traces', () => {
    const traces = sampleNuits('plonge_bas', 3, 7);
    for (const trace of traces) {
      const min = Math.min(...nightSegment(trace).map((p) => p.v));
      expect(min).toBeLessThan(BANDE_CIBLE_DEFAUT.basse);
    }
  });

  it('déterminisme : même seed -> mêmes traces', () => {
    const a = sampleJournee('derive_haute', 99);
    const b = sampleJournee('derive_haute', 99);
    expect(a).toEqual(b);

    const traceA = sampleNuits('plonge_bas', 3, 5);
    const traceB = sampleNuits('plonge_bas', 3, 5);
    expect(traceA).toEqual(traceB);
  });
});

describe('0.d — descend_hypo_matinale : descente progressive, minimum en fin de nuit', () => {
  it('toutes les traces descendent nettement pendant la nuit', () => {
    const traces = sampleNuits('descend_hypo_matinale', 4, 55);
    for (const trace of traces) {
      const nuit = nightSegment(trace);
      const debut = nuit.slice(0, 4).reduce((s, p) => s + p.v, 0) / 4;
      const fin = nuit.slice(-4).reduce((s, p) => s + p.v, 0) / 4;
      expect(fin).toBeLessThan(debut - 5);
    }
  });

  it('le minimum nocturne est atteint en fin de nuit, proche du plancher hypo', () => {
    const traces = sampleNuits('descend_hypo_matinale', 3, 21);
    for (const trace of traces) {
      const nuit = nightSegment(trace);
      let minIdx = 0;
      for (let i = 1; i < nuit.length; i++) if (nuit[i].v < nuit[minIdx].v) minIdx = i;
      expect(minIdx).toBeGreaterThan(nuit.length * 0.8);
      expect(nuit[minIdx].v).toBeLessThan(BANDE_CIBLE_DEFAUT.basse + 8);
    }
  });

  it('déterminisme : même seed -> mêmes traces', () => {
    const a = sampleJournee('descend_hypo_matinale', 17);
    const b = sampleJournee('descend_hypo_matinale', 17);
    expect(a).toEqual(b);
  });
});

describe('0.d.3 — raccord nuit -> jour sans falaise', () => {
  const scenarios: ScenarioTrace[] = [
    'stable',
    'derive_haute',
    'plonge_bas',
    'haut_stable_apres_repas',
    'descend_hypo_matinale',
  ];

  // Continuité au raccord (au sens de la correction B7 : la « falaise » de saut brutal au
  // passage nuit → jour, ex. −28 sur `derive_haute`). Le seuil <5 est vérifié autour de la
  // jonction (t=480, ±40 min) — pas sur toute la trace : les bosses repas de la portion jour
  // ont, elles, une pente ease intrinsèquement plus raide sur le pas d'échantillonnage à
  // 5 min (comportement du modèle inchangé par S14, pas la « falaise » visée par ce test).
  it('aucun saut > 5 entre deux pas consécutifs autour de la jonction nuit -> jour', () => {
    for (const scenario of scenarios) {
      const trace = sampleJournee(scenario, 999);
      const aroundBoundary = trace.filter((p) => p.t >= 440 && p.t <= 520);
      for (let i = 1; i < aroundBoundary.length; i++) {
        expect(Math.abs(aroundBoundary[i].v - aroundBoundary[i - 1].v)).toBeLessThan(5);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Invariant 9 — temps dans la cible (TIR).
// ---------------------------------------------------------------------------

describe('invariant 9 — tempsDansCible', () => {
  const traces = sampleNuits('plonge_bas', 3, 11);

  it('bande plus large (profil âgé) -> cible >= bande serrée, sur les mêmes traces', () => {
    const bandeServree = { basse: 30, haute: 50 };
    const bandeLarge = { basse: 20, haute: 70 };
    const tirServree = tempsDansCible(traces, bandeServree);
    const tirLarge = tempsDansCible(traces, bandeLarge);
    expect(tirLarge.cible).toBeGreaterThanOrEqual(tirServree.cible);
  });

  it('les trois pourcentages somment à 100', () => {
    const tir = tempsDansCible(traces, BANDE_CIBLE_DEFAUT);
    expect(tir.bas + tir.cible + tir.haut).toBeCloseTo(100, 6);
  });

  it('traces vides -> tout à zéro (pas de division par zéro)', () => {
    expect(tempsDansCible([], BANDE_CIBLE_DEFAUT)).toEqual({ bas: 0, cible: 0, haut: 0 });
  });
});

// ---------------------------------------------------------------------------
// Helpers transverses.
// ---------------------------------------------------------------------------

describe('toSvgPath', () => {
  it('renvoie une chaîne non vide commençant par M', () => {
    const path = toSvgPath(
      [
        { t: 0, v: 0 },
        { t: 10, v: LEVEL_MAX },
      ],
      { width: 100, height: 50 },
    );
    expect(path.startsWith('M')).toBe(true);
  });

  it('mappe le domaine par défaut [0, LEVEL_MAX] vers [height, 0]', () => {
    const path = toSvgPath(
      [
        { t: 0, v: 0 },
        { t: 10, v: LEVEL_MAX },
      ],
      { width: 10, height: 50 },
    );
    expect(path).toBe('M0,50 L10,0');
  });

  it('liste vide renvoie une chaîne vide', () => {
    expect(toSvgPath([], { width: 10, height: 10 })).toBe('');
  });
});

describe('mgFromLevel', () => {
  it('ancré sur BASELINE(30) -> 100 mg/dL et 60 -> 250 mg/dL (brief §1.2)', () => {
    expect(mgFromLevel(BASELINE)).toBeCloseTo(100, 6);
    expect(mgFromLevel(60)).toBeCloseTo(250, 6);
  });
});
