import { describe, expect, it } from 'vitest';
import { indexSuivant } from './useModalFocus';

describe('indexSuivant', () => {
  it('avance et boucle', () => {
    expect(indexSuivant(0, 3, false)).toBe(1);
    expect(indexSuivant(2, 3, false)).toBe(0);
  });
  it('recule et boucle', () => {
    expect(indexSuivant(1, 3, true)).toBe(0);
    expect(indexSuivant(0, 3, true)).toBe(2);
  });
  it('hors liste : premier ou dernier', () => {
    expect(indexSuivant(-1, 3, false)).toBe(0);
    expect(indexSuivant(-1, 3, true)).toBe(2);
  });
  it('liste vide', () => {
    expect(indexSuivant(0, 0, false)).toBe(-1);
  });
});
