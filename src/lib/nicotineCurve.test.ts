import { describe, it, expect } from 'vitest';
import {
  PATCH_PLATEAU,
  THRESHOLD_LOW,
  THRESHOLD_HIGH,
  classifyZone,
  sampleCurve,
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

  it('a t egal, le pic cigarette (0.90) depasse le pic ponctuel (0.35)', () => {
    const t = 0.2;
    const cigarette = sampleCurve({ patch: false, events: [{ kind: 'cigarette', t }] });
    const ponctuel = sampleCurve({ patch: false, events: [{ kind: 'ponctuel', t }] });
    expect(Math.max(...cigarette)).toBeGreaterThan(Math.max(...ponctuel));
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
