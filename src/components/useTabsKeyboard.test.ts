import { describe, expect, it } from 'vitest';
import { indexOngletSuivant } from './useTabsKeyboard';

describe('indexOngletSuivant', () => {
  it('→ au milieu avance', () => {
    expect(indexOngletSuivant('ArrowRight', 1, 4)).toBe(2);
  });
  it('→ sur le dernier boucle au premier', () => {
    expect(indexOngletSuivant('ArrowRight', 3, 4)).toBe(0);
  });
  it('← sur le premier boucle au dernier', () => {
    expect(indexOngletSuivant('ArrowLeft', 0, 4)).toBe(3);
  });
  it('Home et End', () => {
    expect(indexOngletSuivant('Home', 2, 4)).toBe(0);
    expect(indexOngletSuivant('End', 1, 4)).toBe(3);
  });
  it('touche ignorée', () => {
    expect(indexOngletSuivant('a', 1, 4)).toBeNull();
    expect(indexOngletSuivant('ArrowDown', 1, 4)).toBeNull();
  });
  it('vertical : ↑/↓, pas ←/→', () => {
    expect(indexOngletSuivant('ArrowDown', 0, 3, 'vertical')).toBe(1);
    expect(indexOngletSuivant('ArrowUp', 0, 3, 'vertical')).toBe(2);
    expect(indexOngletSuivant('ArrowRight', 0, 3, 'vertical')).toBeNull();
  });
  it('liste vide', () => {
    expect(indexOngletSuivant('Home', 0, 0)).toBeNull();
  });
});
