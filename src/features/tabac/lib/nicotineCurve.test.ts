import { describe, it, expect } from 'vitest';
import {
  TIME_MAX,
  LEVEL_MAX,
  BASELINE,
  ZONE_THRESHOLD_LOW,
  ZONE_THRESHOLD_HIGH,
  TENSION_HIGH,
  TENSION_TROUGH,
  TENSION_NONSMOKER,
  T_HALF,
  sampleLevel,
  sampleCurve,
  classifyZone,
  tensionLevelAt,
  sampleTension,
  toSvgPath,
  cigaretteContributionRaw,
  substitutContributionRaw,
  patchContributionRaw,
  tensionFromNiveau,
  type NicotineEvent,
} from './nicotineCurve';

/** Argmax d'une fonction réelle sur [tStart, tEnd] par balayage à pas fixe. */
function argmax(fn: (t: number) => number, tStart: number, tEnd: number, step: number): { t: number; v: number } {
  let bestT = tStart;
  let bestV = -Infinity;
  for (let t = tStart; t <= tEnd; t += step) {
    const v = fn(t);
    if (v > bestV) {
      bestV = v;
      bestT = t;
    }
  }
  return { t: bestT, v: bestV };
}

const CONFORT_MID = (ZONE_THRESHOLD_LOW + ZONE_THRESHOLD_HIGH) / 2;
const TENSION_MID = (TENSION_TROUGH + TENSION_HIGH) / 2;

// ---------------------------------------------------------------------------
// Invariants 1-6 : préservés (adaptés à la saturation Emax pour 1 et 5)
// ---------------------------------------------------------------------------

describe('sampleLevel / sampleCurve — invariants de base', () => {
  it('1. sans événement, le niveau est constant à BASELINE partout sur [0, TIME_MAX]', () => {
    const ys = sampleCurve({ events: [] });
    expect(ys).toHaveLength(201);
    for (const y of ys) expect(y).toBe(BASELINE);
    expect(sampleLevel([], 0)).toBe(BASELINE);
    expect(sampleLevel([], TIME_MAX)).toBe(BASELINE);
  });

  it('1. le niveau reste toujours dans [0, LEVEL_MAX] ; avec la saturation Emax, il plafonne '
    + 'près de LEVEL_MAX sans jamais l\'atteindre exactement (remplace le clamp dur de l\'ancien modèle)', () => {
    const events: NicotineEvent[] = Array.from({ length: 12 }, () => ({
      type: 'patch',
      time: 0,
      dose: 4,
    }));
    const ys = sampleCurve({ events, n: 400 });
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(LEVEL_MAX);
    }
    const max = Math.max(...ys);
    expect(max).toBeLessThan(LEVEL_MAX);
    expect(max).toBeGreaterThan(95);
  });

  it("2. avant l'instant t0 d'un événement, sa contribution est nulle (niveau = BASELINE)", () => {
    const t0 = 10;
    const events: NicotineEvent[] = [{ type: 'cigarette', time: t0 }];
    expect(sampleLevel(events, t0 - 0.01)).toBe(BASELINE);
  });

  it("2. les événements futurs n'influencent pas le passé (niveau)", () => {
    const t = 5;
    const before = sampleLevel([{ type: 'cigarette', time: 2 }], t);
    const withFuture = sampleLevel(
      [
        { type: 'cigarette', time: 2 },
        { type: 'cigarette', time: 20 },
      ],
      t,
    );
    expect(withFuture).toBe(before);
  });

  it("2. les événements futurs n'influencent pas le passé (tension)", () => {
    const t = 5;
    const before = tensionLevelAt(t, [2]);
    const withFuture = tensionLevelAt(t, [2, 20]);
    expect(withFuture).toBe(before);
  });

  it('4. cumul (V3) : deux cigarettes rapprochées donnent un niveau supérieur à une seule', () => {
    const t0 = 10;
    const single = sampleLevel([{ type: 'cigarette', time: t0 }], t0 + 0.3);
    const double = sampleLevel(
      [
        { type: 'cigarette', time: t0 },
        { type: 'cigarette', time: t0 + 0.1 },
      ],
      t0 + 0.3,
    );
    expect(double).toBeGreaterThan(single);
  });

  it("4. cumul (V3) : l'ordre des événements est indifférent (somme commutative)", () => {
    const eventsA: NicotineEvent[] = [
      { type: 'cigarette', time: 8 },
      { type: 'patch', time: 6, dose: 1 },
    ];
    const eventsB: NicotineEvent[] = [
      { type: 'patch', time: 6, dose: 1 },
      { type: 'cigarette', time: 8 },
    ];
    expect(sampleLevel(eventsA, 9)).toBe(sampleLevel(eventsB, 9));
  });
});

describe('classifyZone — invariant 3 (bornes 12/82, inchangées)', () => {
  it('manque strictement sous le seuil bas', () => {
    expect(classifyZone(0)).toBe('manque');
    expect(classifyZone(ZONE_THRESHOLD_LOW - 0.01)).toBe('manque');
  });

  it('confort entre les deux seuils, bornes incluses', () => {
    expect(classifyZone(ZONE_THRESHOLD_LOW)).toBe('confort');
    expect(classifyZone(CONFORT_MID)).toBe('confort');
    expect(classifyZone(ZONE_THRESHOLD_HIGH)).toBe('confort');
  });

  it('surdosage strictement au-dessus du seuil haut', () => {
    expect(classifyZone(ZONE_THRESHOLD_HIGH + 0.01)).toBe('surdosage');
    expect(classifyZone(LEVEL_MAX)).toBe('surdosage');
  });
});

describe('R5 (préservé, adapté) : creux fumeur / non-fumeur, monotonie chute puis remontée', () => {
  it('creux du fumeur (TENSION_TROUGH) strictement au-dessus du basal non-fumeur (TENSION_NONSMOKER)', () => {
    expect(TENSION_TROUGH).toBeGreaterThan(TENSION_NONSMOKER);
  });

  it(
    "la tension chute puis remonte autour d'une cigarette ; le creux survient peu après " +
      "l'allumage (temps d'absorption, pas instantanément comme dans l'ancien modèle)",
    () => {
      const t0 = 10;
      const ts: number[] = [];
      for (let t = t0; t <= t0 + 3; t += 0.01) ts.push(t);
      const values = ts.map((t) => tensionLevelAt(t, [t0]));
      let minIdx = 0;
      for (let i = 1; i < values.length; i++) if (values[i] < values[minIdx]) minIdx = i;

      for (let i = 1; i <= minIdx; i++) expect(values[i]).toBeLessThanOrEqual(values[i - 1] + 1e-9);
      for (let i = minIdx + 1; i < values.length; i++) expect(values[i]).toBeGreaterThanOrEqual(values[i - 1] - 1e-9);

      const troughDelayMin = (ts[minIdx] - t0) * 60;
      expect(troughDelayMin).toBeGreaterThanOrEqual(0);
      expect(troughDelayMin).toBeLessThan(15);
    },
  );
});

describe('toSvgPath — inchangé', () => {
  it('renvoie une chaîne non vide commençant par M', () => {
    const path = toSvgPath([0, 100], { width: 100, height: 50 });
    expect(path.length).toBeGreaterThan(0);
    expect(path.startsWith('M')).toBe(true);
  });

  it('mappe min/max vers height/0 par défaut sur [0, LEVEL_MAX]', () => {
    const path = toSvgPath([0, LEVEL_MAX], { width: 10, height: 50 });
    expect(path).toBe('M0,50 L10,0');
  });

  it('accepte un domaine [min,max] explicite (ex. tension)', () => {
    const path = toSvgPath([TENSION_TROUGH, TENSION_HIGH], {
      width: 10,
      height: 50,
      min: TENSION_TROUGH,
      max: TENSION_HIGH,
    });
    expect(path).toBe('M0,50 L10,0');
  });

  it('liste vide renvoie une chaîne vide', () => {
    expect(toSvgPath([], { width: 10, height: 10 })).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Invariants nouveaux (réalisme) — 7 à 17
// ---------------------------------------------------------------------------

describe('7. Pic cigarette < 10 min (contribution brute)', () => {
  it('argmax de la contribution isolée survient à moins de 10 minutes', () => {
    const { t } = argmax((dt) => cigaretteContributionRaw(dt), 0, 1, 1 / 3600);
    expect(t * 60).toBeLessThan(10);
  });
});

describe('8. Pic forme orale ≈ 30 min, amplitude sous la cigarette', () => {
  it('argmax de la contribution substitut isolée entre 20 et 45 min', () => {
    const { t } = argmax((dt) => substitutContributionRaw(dt), 0, 2, 1 / 3600);
    expect(t * 60).toBeGreaterThanOrEqual(20);
    expect(t * 60).toBeLessThanOrEqual(45);
  });

  it('le pic (amplitude brute) du substitut est nettement inférieur à celui de la cigarette', () => {
    const cigPeak = argmax((dt) => cigaretteContributionRaw(dt), 0, 1, 1 / 3600).v;
    const subPeak = argmax((dt) => substitutContributionRaw(dt), 0, 2, 1 / 3600).v;
    expect(subPeak).toBeLessThan(cigPeak);
  });
});

describe('9. Élimination commune : demi-vie T_HALF sur les contributions brutes', () => {
  it('cigarette : longtemps après le pic, c(t+T_HALF)/c(t) → 1/2', () => {
    const tProbe = 3; // bien après le pic (< 10 min)
    const ratio = cigaretteContributionRaw(tProbe + T_HALF) / cigaretteContributionRaw(tProbe);
    expect(ratio).toBeCloseTo(0.5, 2);
  });

  it('substitut : longtemps après le pic, c(t+T_HALF)/c(t) → 1/2', () => {
    const tProbe = 3; // bien après le pic (≈ 30 min)
    const ratio = substitutContributionRaw(tProbe + T_HALF) / substitutContributionRaw(tProbe);
    expect(ratio).toBeCloseTo(0.5, 2);
  });
});

describe('10. Clairance nocturne', () => {
  it('une cigarette à t=0 : le niveau à t=8h est repassé sous le seuil bas (retour proche baseline)', () => {
    const level = sampleLevel([{ type: 'cigarette', time: 0 }], 8);
    expect(level).toBeLessThan(ZONE_THRESHOLD_LOW);
  });
});

describe('11. Accumulation journalière (1 cigarette/heure de 8h à 20h)', () => {
  it('les creux entre cigarettes montent puis se stabilisent, sans franchir durablement le surdosage', () => {
    const events: NicotineEvent[] = [];
    for (let h = 8; h <= 20; h++) events.push({ type: 'cigarette', time: h });
    const lvl = (t: number) => sampleLevel(events, t);

    const minima: number[] = [];
    for (let h = 8; h < 20; h++) {
      let m = Infinity;
      for (let t = h + 0.01; t <= h + 0.99; t += 0.01) m = Math.min(m, lvl(t));
      minima.push(m);
    }

    // Croissant sur toute la séquence (jamais de recul du plancher).
    for (let i = 1; i < minima.length; i++) expect(minima[i]).toBeGreaterThan(minima[i - 1]);

    // Les premiers paliers (4-5 premières heures) montent nettement plus que les derniers
    // (quasi-stationnaire en fin de journée = plateau du fumeur régulier).
    const earlyGain = minima[4] - minima[0];
    const lateGain = minima[minima.length - 1] - minima[minima.length - 5];
    expect(earlyGain).toBeGreaterThan(lateGain * 5);

    // Les creux (plateau de fumeur régulier) restent en zone de confort, sans y séjourner en surdosage.
    for (const m of minima) expect(m).toBeLessThan(ZONE_THRESHOLD_HIGH);
  });
});

describe('12. Saturation : 4 puis 8 cigarettes en 1 h (compression Emax)', () => {
  function peakForNCigarettesInOneHour(n: number): number {
    const events: NicotineEvent[] = Array.from({ length: n }, (_, i) => ({
      type: 'cigarette',
      time: i / n,
    }));
    let peak = -Infinity;
    for (let t = 0; t <= 2; t += 0.005) peak = Math.max(peak, sampleLevel(events, t));
    return peak;
  }

  it('4 cigarettes en 1h : le pic franchit le seuil de surdosage', () => {
    expect(peakForNCigarettesInOneHour(4)).toBeGreaterThan(ZONE_THRESHOLD_HIGH);
  });

  it('8 cigarettes en 1h : le pic est supérieur à celui de 4, mais reste < LEVEL_MAX, '
    + 'et la compression Emax réduit l\'écart marginal (4→8 < 0→4)', () => {
    const peak0 = BASELINE;
    const peak4 = peakForNCigarettesInOneHour(4);
    const peak8 = peakForNCigarettesInOneHour(8);
    expect(peak8).toBeGreaterThan(peak4);
    expect(peak8).toBeLessThan(LEVEL_MAX);
    expect(peak8 - peak4).toBeLessThan(peak4 - peak0);
  });
});

describe('13. Une cigarette isolée depuis la baseline', () => {
  it('le pic se situe en zone de confort, moitié haute (ni manque, ni surdosage)', () => {
    const { v: peak } = argmax((t) => sampleLevel([{ type: 'cigarette', time: 0 }], t), 0, 2, 1 / 600);
    expect(peak).toBeGreaterThan(CONFORT_MID);
    expect(peak).toBeLessThan(ZONE_THRESHOLD_HIGH);
  });
});

describe('14. Patch sans pic, montée progressive, surdosage possible à forte dose', () => {
  it('aucun maximum local strict : la contribution brute est monotone non-décroissante', () => {
    let prev = patchContributionRaw(0, 1);
    for (let dt = 0.05; dt <= 24; dt += 0.05) {
      const v = patchContributionRaw(dt, 1);
      expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = v;
    }
  });

  it('dose 1 : niveau sensible (>25% du plateau) à 0.75h, quasi au plateau (≥95%) à 4h, plateau en confort', () => {
    const plateau = sampleLevel([{ type: 'patch', time: 0, dose: 1 }], 24);
    const at045 = sampleLevel([{ type: 'patch', time: 0, dose: 1 }], 0.75);
    const at4 = sampleLevel([{ type: 'patch', time: 0, dose: 1 }], 4);

    expect((at045 - BASELINE) / (plateau - BASELINE)).toBeGreaterThan(0.25);
    expect((at4 - BASELINE) / (plateau - BASELINE)).toBeGreaterThanOrEqual(0.95);
    expect(classifyZone(plateau)).toBe('confort');
  });

  it('dose 4 : le plateau franchit le seuil de surdosage', () => {
    const plateau4 = sampleLevel([{ type: 'patch', time: 0, dose: 4 }], 24);
    expect(classifyZone(plateau4)).toBe('surdosage');
  });
});

describe('15. Tension liée au niveau', () => {
  it('à niveau haut, la tension est exactement au plancher (TENSION_TROUGH)', () => {
    expect(tensionFromNiveau(80)).toBe(TENSION_TROUGH);
  });

  it('à niveau nul, la tension est exactement au plafond (TENSION_HIGH)', () => {
    expect(tensionFromNiveau(0)).toBe(TENSION_HIGH);
  });

  it('au réveil (t=0, aucune cigarette posée mais fumeur virtuel), la tension est élevée (> moitié de l\'échelle)', () => {
    expect(tensionLevelAt(0, [])).toBeGreaterThan(TENSION_MID);
  });
});

describe('16. Cohérence inter-modules : minima de tension ↔ maxima de niveau', () => {
  it('pour un même horaire de cigarettes, chaque minimum local de tension suit un maximum local de niveau', () => {
    const cigTimes = [6, 10, 15];
    const nicotineEvents: NicotineEvent[] = cigTimes.map((time) => ({ type: 'cigarette', time }));

    const step = 0.01;
    const niveauMaxima: number[] = [];
    const tensionMinima: number[] = [];
    let prevSlopeN: number | null = null;
    let prevSlopeT: number | null = null;
    let lastN: number | null = null;
    let lastT: number | null = null;

    for (let t = 0; t <= TIME_MAX; t += step) {
      const n = sampleLevel(nicotineEvents, t);
      const te = tensionLevelAt(t, cigTimes);
      if (lastN !== null && lastT !== null) {
        const slopeN = n - lastN;
        const slopeT = te - lastT;
        if (prevSlopeN !== null && prevSlopeN > 0 && slopeN <= 0) niveauMaxima.push(t);
        if (prevSlopeT !== null && prevSlopeT < 0 && slopeT >= 0) tensionMinima.push(t);
        prevSlopeN = slopeN;
        prevSlopeT = slopeT;
      }
      lastN = n;
      lastT = te;
    }

    expect(niveauMaxima.length).toBe(cigTimes.length);
    expect(tensionMinima.length).toBe(cigTimes.length);
    for (let i = 0; i < cigTimes.length; i++) {
      expect(Math.abs(niveauMaxima[i] - tensionMinima[i])).toBeLessThan(0.1);
    }
  });
});

describe('17. Scénario titration (enseignement de Thibault, prioritaire)', () => {
  it('a) titration granulaire et monotone : chaque +¼ de dose élève le plateau, '
    + "et il existe une dose dont le plateau tombe en zone de confort haute (≈70-82)", () => {
    const plateauForDose = (dose: number) => sampleLevel([{ type: 'patch', time: 0, dose }], 24);

    let prev = plateauForDose(0.25);
    let foundConfortHaute = false;
    for (let n = 2; n <= 16; n++) {
      const dose = n * 0.25;
      const plateau = plateauForDose(dose);
      expect(plateau).toBeGreaterThan(prev); // granulaire : chaque palier est visible
      prev = plateau;
    }
    for (let n = 1; n <= 16; n++) {
      const plateau = plateauForDose(n * 0.25);
      if (plateau >= 70 && plateau < ZONE_THRESHOLD_HIGH) foundConfortHaute = true;
    }
    expect(foundConfortHaute).toBe(true);
  });

  it('b) patch bien titré (plateau en confort haute) + une cigarette au plateau : le pic franchit '
    + 'le surdosage puis redescend en confort en ~2-3h', () => {
    const doseTitree = 2;
    const patchEvent: NicotineEvent = { type: 'patch', time: 0, dose: doseTitree };
    const tPlateauAtteint = 6; // bien après le plateau du patch (~3-4h)

    const plateauSeul = sampleLevel([patchEvent], tPlateauAtteint);
    expect(plateauSeul).toBeGreaterThanOrEqual(70);
    expect(plateauSeul).toBeLessThan(ZONE_THRESHOLD_HIGH);

    const cigEvent: NicotineEvent = { type: 'cigarette', time: tPlateauAtteint };
    const { v: peakAvecCig } = argmax(
      (t) => sampleLevel([patchEvent, cigEvent], t),
      tPlateauAtteint,
      tPlateauAtteint + 1,
      1 / 600,
    );
    expect(peakAvecCig).toBeGreaterThan(ZONE_THRESHOLD_HIGH);

    const niveauApres3h = sampleLevel([patchEvent, cigEvent], tPlateauAtteint + 3);
    expect(niveauApres3h).toBeLessThanOrEqual(ZONE_THRESHOLD_HIGH);
  });

  it('c) le même patch sans cigarette ne franchit jamais le seuil de surdosage sur 24h', () => {
    const doseTitree = 2;
    const patchEvent: NicotineEvent = { type: 'patch', time: 0, dose: doseTitree };
    let max = -Infinity;
    for (let t = 0; t <= TIME_MAX; t += 0.05) max = Math.max(max, sampleLevel([patchEvent], t));
    expect(max).toBeLessThanOrEqual(ZONE_THRESHOLD_HIGH);
  });
});

describe('sampleTension — longueur et bornes', () => {
  it('sampleTension retourne n+1 valeurs, toutes dans [TENSION_TROUGH, TENSION_HIGH]', () => {
    const ys = sampleTension({ cigTimes: [10], n: 400 });
    expect(ys).toHaveLength(401);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(TENSION_TROUGH);
      expect(y).toBeLessThanOrEqual(TENSION_HIGH);
    }
  });
});
