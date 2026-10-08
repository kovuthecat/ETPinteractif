import { describe, it, expect } from 'vitest';
import { calculerEconomies, normaliserCigsParPaquet, parseEntree } from './tirelireCalcul';

describe('calculerEconomies', () => {
  it('6,5 cig/j, paquet de 20 à 12 € → 3,90 €/jour', () => {
    const e = calculerEconomies(6.5, 12, 20);
    expect(e.parJour).toBeCloseTo(3.9, 10);
    expect(e.parSemaine).toBeCloseTo(27.3, 10);
    expect(e.parMois).toBeCloseTo(117, 10);
    expect(e.parAn).toBeCloseTo(1423.5, 10);
  });

  it('10 cig/j à 12 €/20 → 6,00 €/jour', () => {
    expect(calculerEconomies(10, 12, 20).parJour).toBeCloseTo(6, 10);
  });

  it('paquet à 0 : pas de division par zéro', () => {
    expect(calculerEconomies(10, 12, 0).parJour).toBe(0);
  });
});

describe('normaliserCigsParPaquet', () => {
  it('0 est corrigé à 1 avec signalement', () => {
    expect(normaliserCigsParPaquet(0)).toEqual({ valeur: 1, corrige: true });
  });
  it('une valeur valide est conservée', () => {
    expect(normaliserCigsParPaquet(20)).toEqual({ valeur: 20, corrige: false });
  });
});

describe('parseEntree', () => {
  it('accepte la virgule comme le point', () => {
    expect(parseEntree('6,5', 0)).toBe(6.5);
    expect(parseEntree('6.5', 0)).toBe(6.5);
  });
  it('repli sur valeur invalide ou négative', () => {
    expect(parseEntree('abc', 3)).toBe(3);
    expect(parseEntree('-2', 3)).toBe(3);
  });
});
