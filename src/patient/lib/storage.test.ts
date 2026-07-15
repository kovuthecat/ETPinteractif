import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readJSON, writeJSON } from './storage';

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
