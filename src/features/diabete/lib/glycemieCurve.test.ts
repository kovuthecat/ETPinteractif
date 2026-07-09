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
  type RepasParams,
  type Point,
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

// ---------------------------------------------------------------------------
// Invariant 1 — composition : chaque ajout baisse le pic, le retarde, adoucit la
// descente, avec rendements décroissants.
// ---------------------------------------------------------------------------

describe('paramsFromAssiette / sampleRepas — composition (invariant 1)', () => {
  const feculentSeul: Assiette = { aliments: [{ cg: 80, famille: 'feculents' }] };
  const plusProteine: Assiette = {
    aliments: [
      { cg: 80, famille: 'feculents' },
      { cg: 0, famille: 'proteines' },
    ],
  };
  const plusLegume: Assiette = {
    aliments: [
      { cg: 80, famille: 'feculents' },
      { cg: 0, famille: 'proteines' },
      { cg: 0, famille: 'legumes' },
    ],
  };
  const plusLipide: Assiette = {
    aliments: [
      { cg: 80, famille: 'feculents' },
      { cg: 0, famille: 'proteines' },
      { cg: 0, famille: 'legumes' },
      { cg: 0, famille: 'lipides' },
    ],
  };

  const etapes = [feculentSeul, plusProteine, plusLegume, plusLipide].map((assiette) => {
    const params = paramsFromAssiette(assiette);
    const curve = sampleRepas(params);
    return { params, peak: peakOf(curve) };
  });

  it('féculent seul : pic haut et précoce, jamais plat, jamais sous la baseline', () => {
    const [seul] = etapes;
    expect(seul.peak.v).toBeGreaterThan(BASELINE + 30);
    expect(seul.peak.t).toBeLessThanOrEqual(45);
    for (const p of sampleRepas(seul.params)) expect(p.v).toBeGreaterThanOrEqual(BASELINE - 1e-9);
  });

  it('chaque ajout baisse le pic (hauteur)', () => {
    for (let i = 1; i < etapes.length; i++) {
      expect(etapes[i].peak.v).toBeLessThan(etapes[i - 1].peak.v);
    }
  });

  it('chaque ajout retarde le pic (moment)', () => {
    for (let i = 1; i < etapes.length; i++) {
      expect(etapes[i].peak.t).toBeGreaterThan(etapes[i - 1].peak.t);
    }
  });

  it('chaque ajout adoucit la descente (frein croissant -> retour baseline plus tardif)', () => {
    for (let i = 1; i < etapes.length; i++) {
      expect(etapes[i].params.frein).toBeGreaterThan(etapes[i - 1].params.frein);
    }
  });

  it('rendements décroissants : effet du 3e ajout (sur le pic) < effet du 1er ajout', () => {
    const deltaPremier = etapes[0].peak.v - etapes[1].peak.v;
    const deltaTroisieme = etapes[2].peak.v - etapes[3].peak.v;
    expect(deltaTroisieme).toBeLessThan(deltaPremier);
  });

  it('la charge glycémique reste quasi constante (aliments ajoutés à CG nulle)', () => {
    for (let i = 1; i < etapes.length; i++) {
      expect(etapes[i].params.charge).toBeCloseTo(etapes[0].params.charge, 5);
    }
  });
});

// ---------------------------------------------------------------------------
// Invariant 2 — monotonie CG à frein constant.
// ---------------------------------------------------------------------------

describe('invariant 2 — monotonie de la charge glycémique', () => {
  function peakPourCg(cg: number): number {
    const assiette: Assiette = { aliments: [{ cg, famille: 'feculents' }] };
    return peakOf(sampleRepas(paramsFromAssiette(assiette))).v;
  }

  it('pic(CG 85) > pic(CG 55) > pic(CG 25), jamais plat, jamais sous la baseline', () => {
    const p25 = peakPourCg(25);
    const p55 = peakPourCg(55);
    const p85 = peakPourCg(85);
    expect(p85).toBeGreaterThan(p55);
    expect(p55).toBeGreaterThan(p25);
    expect(p25).toBeGreaterThan(BASELINE);
  });
});

// ---------------------------------------------------------------------------
// Invariant 3 — ordre.
// ---------------------------------------------------------------------------

describe('invariant 3 — ordreFeculentDernier', () => {
  const base: Assiette = {
    aliments: [
      { cg: 80, famille: 'feculents' },
      { cg: 0, famille: 'proteines' },
      { cg: 0, famille: 'legumes' },
    ],
  };
  const avecOrdre: Assiette = { ...base, ordreFeculentDernier: true };

  const peakSansOrdre = peakOf(sampleRepas(paramsFromAssiette(base)));
  const peakAvecOrdre = peakOf(sampleRepas(paramsFromAssiette(avecOrdre)));

  it('pic réduit d\'environ un tiers (entre 20 % et 50 % de réduction)', () => {
    const excesSansOrdre = peakSansOrdre.v - BASELINE;
    const excesAvecOrdre = peakAvecOrdre.v - BASELINE;
    const ratio = excesAvecOrdre / excesSansOrdre;
    expect(ratio).toBeLessThan(0.8);
    expect(ratio).toBeGreaterThan(0.5);
  });

  it('pic retardé', () => {
    expect(peakAvecOrdre.t).toBeGreaterThan(peakSansOrdre.t);
  });
});

// ---------------------------------------------------------------------------
// Invariant 4 — proportions.
// ---------------------------------------------------------------------------

describe('invariant 4 — proportions (assiette-modèle vs ¾ féculents)', () => {
  const aliments: Assiette['aliments'] = [
    { cg: 80, famille: 'feculents' },
    { cg: 0, famille: 'proteines' },
    { cg: 0, famille: 'legumes' },
  ];
  const assietteModele: Assiette = {
    aliments,
    proportions: { legumes: 0.5, proteines: 0.25, feculents: 0.25 },
  };
  const assietteTroisQuarts: Assiette = {
    aliments,
    proportions: { legumes: 0.125, proteines: 0.125, feculents: 0.75 },
  };

  it('assiette-modèle ½/¼/¼ -> pic < assiette ¾ féculents, aliments comparables', () => {
    const peakModele = peakOf(sampleRepas(paramsFromAssiette(assietteModele))).v;
    const peakTroisQuarts = peakOf(sampleRepas(paramsFromAssiette(assietteTroisQuarts))).v;
    expect(peakModele).toBeLessThan(peakTroisQuarts);
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

  it('nuit_isolee : une seule trace s\'écarte nettement, les autres restent stables', () => {
    const traces = sampleNuits('nuit_isolee', 4, 42);
    const mins = traces.map((trace) => Math.min(...nightSegment(trace).map((p) => p.v)));
    const autresMins = mins.slice(0, -1);
    const traceIsolee = mins[mins.length - 1];

    for (const m of autresMins) expect(m).toBeGreaterThan(BASELINE - 6);
    expect(traceIsolee).toBeLessThan(BANDE_CIBLE_DEFAUT.basse);

    const autresMedianes = traces.slice(0, -1).map((trace) => {
      const vals = nightSegment(trace).map((p) => p.v);
      const mid = Math.floor(vals.length / 2);
      return vals.sort((a, b) => a - b)[mid];
    });
    for (const med of autresMedianes) expect(Math.abs(med - BASELINE)).toBeLessThan(6);
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
