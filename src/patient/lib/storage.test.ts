import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { effacerDonneesPatient, readJSON, surEffacementDonnees, writeJSON } from './storage';

/** Fake `localStorage` minimal (l'environnement de test vitest est `node`, sans DOM). */
class FakeStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
  get length(): number {
    return this.store.size;
  }
  key(i: number): string | null {
    return [...this.store.keys()][i] ?? null;
  }
}

const KEY = 'etp.patient.test';

describe('readJSON / writeJSON', () => {
  const original = (globalThis as { localStorage?: unknown }).localStorage;

  afterEach(() => {
    if (original === undefined) {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    } else {
      (globalThis as { localStorage?: unknown }).localStorage = original;
    }
  });

  it('renvoie le fallback quand localStorage est indisponible (SSR / mode privé strict)', () => {
    delete (globalThis as { localStorage?: unknown }).localStorage;
    expect(readJSON(KEY, { a: 1 })).toEqual({ a: 1 });
    expect(() => writeJSON(KEY, { a: 2 })).not.toThrow();
  });

  it("écrit puis relit la même valeur", () => {
    (globalThis as unknown as { localStorage: FakeStorage }).localStorage = new FakeStorage();
    writeJSON(KEY, { quartsJour: 4, quartsNuit: 4, jourNuit: false });
    expect(readJSON(KEY, null)).toEqual({ quartsJour: 4, quartsNuit: 4, jourNuit: false });
  });

  it('renvoie le fallback si la clé est absente', () => {
    (globalThis as unknown as { localStorage: FakeStorage }).localStorage = new FakeStorage();
    expect(readJSON('etp.patient.absente', 'défaut')).toBe('défaut');
  });

  it('renvoie le fallback si le contenu stocké est du JSON invalide', () => {
    const fake = new FakeStorage();
    fake.setItem(KEY, '{ invalide');
    (globalThis as unknown as { localStorage: FakeStorage }).localStorage = fake;
    expect(readJSON(KEY, 'défaut')).toBe('défaut');
  });

  it("n'explose pas si setItem lève (quota dépassé)", () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    (globalThis as unknown as { localStorage: typeof throwing }).localStorage = throwing;
    expect(() => writeJSON(KEY, { x: 1 })).not.toThrow();
  });

  beforeEach(() => {
    // rien à faire : chaque test pose son propre état de `globalThis.localStorage`.
  });
});

describe('effacerDonneesPatient', () => {
  const original = (globalThis as { localStorage?: unknown }).localStorage;

  afterEach(() => {
    if (original === undefined) {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    } else {
      (globalThis as { localStorage?: unknown }).localStorage = original;
    }
  });

  it('supprime toutes les clés etp.* et garde les clés étrangères', () => {
    const fake = new FakeStorage();
    fake.setItem('etp.patient.carnetConso', '[1]');
    fake.setItem('etp.tabac.outil-recompense.params', '["6.5"]');
    fake.setItem('autre.cle', 'garde');
    (globalThis as unknown as { localStorage: FakeStorage }).localStorage = fake;
    effacerDonneesPatient();
    expect(fake.length).toBe(1);
    expect(fake.getItem('autre.cle')).toBe('garde');
  });

  it("ne plante pas quand localStorage est indisponible ou lève, et prévient les miroirs", () => {
    delete (globalThis as { localStorage?: unknown }).localStorage;
    let appels = 0;
    const off = surEffacementDonnees(() => appels++);
    expect(() => effacerDonneesPatient()).not.toThrow();
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      get length(): number {
        throw new Error('SecurityError');
      },
      key: () => null,
      removeItem: () => undefined,
    };
    expect(() => effacerDonneesPatient()).not.toThrow();
    off();
    effacerDonneesPatient();
    expect(appels).toBe(2);
  });
});
