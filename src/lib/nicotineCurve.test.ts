import { describe, it, expect } from 'vitest';
import { PATCH_PLATEAU, sampleCurve, toSvgPath, type CurveEvent } from './nicotineCurve';

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
});

describe('toSvgPath', () => {
  it('renvoie une string non vide commencant par M', () => {
    const path = toSvgPath([0, 1], 100, 50);
    expect(path.length).toBeGreaterThan(0);
    expect(path.startsWith('M')).toBe(true);
  });
});
