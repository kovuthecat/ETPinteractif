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
  sampleLevel,
  sampleCurve,
  classifyZone,
  tensionLevelAt,
  sampleTension,
  toSvgPath,
  type NicotineEvent,
} from './nicotineCurve';

describe('sampleLevel / sampleCurve', () => {
  it('sans événement, le niveau est constant à BASELINE partout sur [0, TIME_MAX]', () => {
    const ys = sampleCurve({ events: [] });
    expect(ys).toHaveLength(201);
    for (const y of ys) expect(y).toBe(BASELINE);
    expect(sampleLevel([], 0)).toBe(BASELINE);
    expect(sampleLevel([], TIME_MAX)).toBe(BASELINE);
  });

  it('le niveau reste toujours dans [0, LEVEL_MAX], même avec de nombreux événements cumulés', () => {
    const events: NicotineEvent[] = Array.from({ length: 6 }, (_, i) => ({
      type: 'cigarette',
      time: 5 + i * 0.05,
    }));
    const ys = sampleCurve({ events, n: 400 });
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(LEVEL_MAX);
    }
    // avec 6 cigarettes rapprochées la somme dépasse largement LEVEL_MAX avant clamp
    expect(Math.max(...ys)).toBe(LEVEL_MAX);
  });

  it('avant l\'instant t0 d\'un événement, sa contribution est nulle (niveau = BASELINE)', () => {
    const t0 = 10;
    const events: NicotineEvent[] = [{ type: 'cigarette', time: t0 }];
    expect(sampleLevel(events, t0 - 0.01)).toBe(BASELINE);
  });

  it('cigarette : le niveau monte juste après t0 puis décroît avec une demi-vie ≈ 1.2 h', () => {
    const t0 = 8;
    const events: NicotineEvent[] = [{ type: 'cigarette', time: t0 }];

    // montée rapide (constante de rampe 0.04h) puis décroissance
    const early = sampleLevel(events, t0 + 0.02);
    const risen = sampleLevel(events, t0 + 0.3);
    const later = sampleLevel(events, t0 + 1.5);
    expect(risen).toBeGreaterThan(early);
    expect(risen).toBeGreaterThan(later);

    // demi-vie : une fois la rampe saturée, +1.2h divise la contribution par ~2
    const a = sampleLevel(events, t0 + 0.5) - BASELINE;
    const b = sampleLevel(events, t0 + 0.5 + 1.2) - BASELINE;
    expect(b / a).toBeCloseTo(0.5, 2);
  });

  it('substitut : pic plus bas et décroissance plus lente que la cigarette', () => {
    const t0 = 8;
    const cigEvents: NicotineEvent[] = [{ type: 'cigarette', time: t0 }];
    const subEvents: NicotineEvent[] = [{ type: 'substitut', time: t0 }];

    const cigCurve = sampleCurve({ events: cigEvents, n: 400 });
    const subCurve = sampleCurve({ events: subEvents, n: 400 });
    expect(Math.max(...subCurve)).toBeLessThan(Math.max(...cigCurve));

    // 2h après l'événement, le substitut a perdu proportionnellement moins que la cigarette
    const cigAt2h = sampleLevel(cigEvents, t0 + 2) - BASELINE;
    const subAt2h = sampleLevel(subEvents, t0 + 2) - BASELINE;
    const cigRatio = cigAt2h / (Math.max(...cigCurve) - BASELINE);
    const subRatio = subAt2h / (Math.max(...subCurve) - BASELINE);
    expect(subRatio).toBeGreaterThan(cigRatio);
  });

  it('patch dose 1 : plateau ≈ 30 après 0.5h ; dose 2 : plateau ≈ 60', () => {
    const t0 = 6;
    const dose1: NicotineEvent[] = [{ type: 'patch', time: t0, dose: 1 }];
    const dose2: NicotineEvent[] = [{ type: 'patch', time: t0, dose: 2 }];

    expect(sampleLevel(dose1, t0 + 0.5) - BASELINE).toBeCloseTo(30, 5);
    expect(sampleLevel(dose1, t0 + 5) - BASELINE).toBeCloseTo(30, 5);
    expect(sampleLevel(dose2, t0 + 0.5) - BASELINE).toBeCloseTo(60, 5);
    expect(sampleLevel(dose2, t0 + 5) - BASELINE).toBeCloseTo(60, 5);
  });

  it('patch sans dose précisée : défaut = ×1', () => {
    const t0 = 6;
    const events: NicotineEvent[] = [{ type: 'patch', time: t0 }];
    expect(sampleLevel(events, t0 + 5) - BASELINE).toBeCloseTo(30, 5);
  });

  it('patch : rampe linéaire avant 0.5h (mi-rampe = moitié du plateau)', () => {
    const t0 = 6;
    const events: NicotineEvent[] = [{ type: 'patch', time: t0, dose: 1 }];
    expect(sampleLevel(events, t0 + 0.25) - BASELINE).toBeCloseTo(15, 5);
  });
});

describe('classifyZone', () => {
  it('manque strictement sous le seuil bas', () => {
    expect(classifyZone(0)).toBe('manque');
    expect(classifyZone(ZONE_THRESHOLD_LOW - 0.01)).toBe('manque');
  });

  it('confort entre les deux seuils, bornes incluses', () => {
    expect(classifyZone(ZONE_THRESHOLD_LOW)).toBe('confort');
    expect(classifyZone((ZONE_THRESHOLD_LOW + ZONE_THRESHOLD_HIGH) / 2)).toBe('confort');
    expect(classifyZone(ZONE_THRESHOLD_HIGH)).toBe('confort');
  });

  it('surdosage strictement au-dessus du seuil haut', () => {
    expect(classifyZone(ZONE_THRESHOLD_HIGH + 0.01)).toBe('surdosage');
    expect(classifyZone(LEVEL_MAX)).toBe('surdosage');
  });
});

describe('tensionLevelAt / sampleTension', () => {
  it('au moment précis d\'une cigarette, la tension est exactement au creux (TROUGH)', () => {
    const cigTimes = [10];
    expect(tensionLevelAt(10, cigTimes)).toBeCloseTo(TENSION_TROUGH, 10);
  });

  it('longtemps après une cigarette, la tension tend vers le plafond HIGH', () => {
    const cigTimes = [10];
    expect(tensionLevelAt(10 + 50, cigTimes)).toBeCloseTo(TENSION_HIGH, 5);
  });

  it('sans aucune cigarette, la tension part du départ virtuel et tend aussi vers HIGH', () => {
    const ys = sampleTension({ cigTimes: [], n: 400 });
    expect(ys[ys.length - 1]).toBeCloseTo(TENSION_HIGH, 1);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(TENSION_TROUGH);
      expect(y).toBeLessThanOrEqual(TENSION_HIGH);
    }
  });

  it('la tension ne dépend que des instants de cigarette : ne pas être influencée par un instant futur', () => {
    const t = 5;
    const before = tensionLevelAt(t, [2]);
    const withFuture = tensionLevelAt(t, [2, 20]);
    expect(withFuture).toBe(before);
  });

  it('repère non-fumeur (constante) toujours strictement sous le creux fumeur (TROUGH)', () => {
    expect(TENSION_NONSMOKER).toBeLessThan(TENSION_TROUGH);
  });
});

describe('toSvgPath', () => {
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
