import { describe, it, expect } from 'vitest';
import {
  PATCH_PLATEAU,
  THRESHOLD_LOW,
  THRESHOLD_HIGH,
  STRESS_BASAL_NON_FUMEUR,
  STRESS_BASAL_FUMEUR,
  STRESS_AMPLITUDE_MANQUE,
  classifyZone,
  sampleCurve,
  sampleStress,
  toSvgPath,
  type CurveEvent,
} from './nicotineCurve';

describe('sampleCurve', () => {
  it('sans patch ni event, renvoie n valeurs (defaut 120) toutes dans [0,1]', () => {
    const ys = sampleCurve({ patch: false, events: [] });
    expect(ys).toHaveLength(120);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  it('une cigarette a t=0.2 cree un pic non nul proche de t', () => {
    const t = 0.2;
    const ys = sampleCurve({ patch: false, events: [{ kind: 'cigarette', t }] });
    const max = Math.max(...ys);
    expect(max).toBeGreaterThan(0);
    const peakT = ys.indexOf(max) / (ys.length - 1);
    expect(Math.abs(peakT - t)).toBeLessThan(0.05);
  });

  it('a t egal, le pic cigarette depasse le pic ponctuel', () => {
    const t = 0.2;
    const cigarette = sampleCurve({ patch: false, events: [{ kind: 'cigarette', t }] });
    const ponctuel = sampleCurve({ patch: false, events: [{ kind: 'ponctuel', t }] });
    expect(Math.max(...cigarette)).toBeGreaterThan(Math.max(...ponctuel));
  });

  it('une seule cigarette culmine en zone confort, au milieu des seuils (V3)', () => {
    const ys = sampleCurve({ patch: false, events: [{ kind: 'cigarette', t: 0.2 }] });
    const max = Math.max(...ys);
    expect(max).toBeGreaterThanOrEqual(0.40);
    expect(max).toBeLessThanOrEqual(0.65);
    expect(classifyZone(max)).toBe('confort');
  });

  it('3 cigarettes rapprochees (pas 0.05, cf. EVENT_STEP) cumulent en surdosage (V3)', () => {
    const events: CurveEvent[] = [0.2, 0.25, 0.3].map((t) => ({ kind: 'cigarette', t }));
    const ys = sampleCurve({ patch: false, events });
    expect(Math.max(...ys)).toBeGreaterThan(THRESHOLD_HIGH);
  });

  it('patch + 2 cigarettes rapprochees cumulent en surdosage (V3)', () => {
    const events: CurveEvent[] = [
      { kind: 'patch', t: 0 },
      { kind: 'cigarette', t: 0.2 },
      { kind: 'cigarette', t: 0.25 },
    ];
    const ys = sampleCurve({ patch: false, events });
    expect(Math.max(...ys)).toBeGreaterThan(THRESHOLD_HIGH);
  });

  it('avec patch, la courbe forme un plateau proche de PATCH_PLATEAU apres la rampe (x >= 0.1)', () => {
    const ys = sampleCurve({ patch: true, events: [] });
    const n = ys.length;
    ys.forEach((y, i) => {
      const x = i / (n - 1);
      if (x >= 0.1) {
        expect(y).toBeCloseTo(PATCH_PLATEAU, 2);
      }
    });
  });

  it('la composition de plusieurs events reste toujours clampee a 1', () => {
    const events: CurveEvent[] = [
      { kind: 'cigarette', t: 0.1 },
      { kind: 'cigarette', t: 0.15 },
      { kind: 'vapoteuse', t: 0.12 },
      { kind: 'ponctuel', t: 0.18 },
    ];
    const ys = sampleCurve({ patch: true, events });
    for (const y of ys) {
      expect(y).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(0);
    }
  });

  it('un event "patch" ne produit rien avant t0 puis rampe vers PATCH_PLATEAU', () => {
    const t0 = 0.3;
    const ys = sampleCurve({ patch: false, events: [{ kind: 'patch', t: t0 }] });
    const n = ys.length;
    ys.forEach((y, i) => {
      const x = i / (n - 1);
      if (x < t0) expect(y).toBe(0);
    });
    expect(ys[ys.length - 1]).toBeCloseTo(PATCH_PLATEAU, 2);
  });
});

describe('sampleStress', () => {
  it('non-fumeur : palier bas constant, sans dependre des events', () => {
    const ys = sampleStress({ fumeur: false, n: 50 });
    expect(ys).toHaveLength(50);
    for (const y of ys) expect(y).toBe(STRESS_BASAL_NON_FUMEUR);
  });

  it('fumeur sans event : reste au plafond de manque (jamais soulage)', () => {
    const ys = sampleStress({ fumeur: true, events: [], n: 10 });
    for (const y of ys) {
      expect(y).toBeCloseTo(STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE, 5);
    }
  });

  it('fumeur : le palier de manque depasse le palier bas du non-fumeur', () => {
    expect(STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE).toBeGreaterThan(STRESS_BASAL_NON_FUMEUR);
    expect(STRESS_BASAL_FUMEUR).toBeGreaterThan(STRESS_BASAL_NON_FUMEUR);
  });

  it('fumeur : une cigarette cree un creux de stress synchronise avec le pic de nicotine', () => {
    const t = 0.3;
    const events: CurveEvent[] = [{ kind: 'cigarette', t }];
    const nicotine = sampleCurve({ patch: false, events, n: 120 });
    const stress = sampleStress({ fumeur: true, events, n: 120 });

    const peakNicotine = Math.max(...nicotine);
    const peakNicotineIndex = nicotine.indexOf(peakNicotine);
    const minStressIndex = stress.indexOf(Math.min(...stress));
    expect(minStressIndex).toBe(peakNicotineIndex);

    const expectedMinStress = STRESS_BASAL_FUMEUR + STRESS_AMPLITUDE_MANQUE * (1 - peakNicotine);
    expect(Math.min(...stress)).toBeCloseTo(expectedMinStress, 5);
  });

  it('fumeur : reste toujours dans [0,1] meme avec plusieurs cigarettes', () => {
    const events: CurveEvent[] = [0.1, 0.3, 0.5, 0.7, 0.9].map((t) => ({ kind: 'cigarette', t }));
    const ys = sampleStress({ fumeur: true, events, n: 120 });
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  it('fumeur : meme quand plusieurs cigarettes saturent la nicotine a 1, le creux le plus bas du stress reste strictement au-dessus du basal non-fumeur (invariant R5)', () => {
    const n = 200;
    const events: CurveEvent[] = Array.from({ length: 6 }, (_, i) => ({
      kind: 'cigarette',
      t: 0.3 + i * 0.001,
    }));
    const nicotine = sampleCurve({ patch: false, events, n });
    expect(Math.max(...nicotine)).toBe(1);
    const stress = sampleStress({ fumeur: true, events, n });
    expect(Math.min(...stress)).toBeCloseTo(STRESS_BASAL_FUMEUR, 5);
    expect(Math.min(...stress)).toBeGreaterThan(STRESS_BASAL_NON_FUMEUR);
  });

  it('fumeur : une cigarette cree un creux synchronise sur son pic puis un rebond monotone vers le plafond de manque', () => {
    // n=101 choisi pour que t0=0.3 tombe exactement sur un index (30/100), sans arrondi.
    const n = 101;
    const t0 = 0.3;
    const events: CurveEvent[] = [{ kind: 'cigarette', t: t0 }];
    const stress = sampleStress({ fumeur: true, events, n });
    const t0Index = t0 * (n - 1);
    expect(Number.isInteger(t0Index)).toBe(true);

    // plateau constant avant la cigarette (rien a soulager tant qu'elle n'a pas ete "fumee")
    for (let i = 1; i < t0Index; i++) {
      expect(stress[i]).toBeCloseTo(stress[0], 5);
    }

    // le creux est exactement synchronise avec le pic de nicotine (cf. VALIDATION.md §C4)
    expect(stress[t0Index]).toBeLessThan(stress[0]);
    expect(stress.indexOf(Math.min(...stress))).toBe(t0Index);

    // rebond monotone (non decroissant) apres le creux, jusqu'a la fin du balayage
    for (let i = t0Index + 1; i < n; i++) {
      expect(stress[i]).toBeGreaterThanOrEqual(stress[i - 1]);
    }
  });
});

describe('toSvgPath', () => {
  it('renvoie une string non vide commencant par M', () => {
    const path = toSvgPath([0, 1], 100, 50);
    expect(path.length).toBeGreaterThan(0);
    expect(path.startsWith('M')).toBe(true);
  });
});

describe('classifyZone', () => {
  it('renvoie "manque" strictement sous THRESHOLD_LOW', () => {
    expect(classifyZone(0)).toBe('manque');
    expect(classifyZone(THRESHOLD_LOW - 0.01)).toBe('manque');
  });

  it('renvoie "confort" entre les deux seuils, frontieres incluses', () => {
    expect(classifyZone(THRESHOLD_LOW)).toBe('confort');
    expect(classifyZone((THRESHOLD_LOW + THRESHOLD_HIGH) / 2)).toBe('confort');
    expect(classifyZone(THRESHOLD_HIGH)).toBe('confort');
  });

  it('renvoie "haut" strictement au-dessus de THRESHOLD_HIGH', () => {
    expect(classifyZone(THRESHOLD_HIGH + 0.01)).toBe('haut');
    expect(classifyZone(1)).toBe('haut');
  });
});
