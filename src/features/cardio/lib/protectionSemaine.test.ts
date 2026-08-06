import { describe, it, expect } from 'vitest';
import { PROTECTION_DECAY, protectionColor, protectionValues } from './protectionSemaine';

// ---------------------------------------------------------------------------
// Table de vérité (plans/recette-outils-2026-08/S3.md, G-baremes) : le repère affiché à
// l'écran dit « pas plus de 2 jours consécutifs sans activité ». Les barres ne doivent donc
// jamais passer au rouge avant le 3ᵉ jour de repos, sous peine de sanctionner un comportement
// que le texte du module valide.
// ---------------------------------------------------------------------------

describe('protectionValues — décroissance jour par jour', () => {
  it('un jour actif ramène systématiquement la protection à 100', () => {
    expect(protectionValues([true])).toEqual([100]);
    expect(protectionValues([false, false, true])).toEqual([0, 0, 100]);
  });

  it('la protection décroît de PROTECTION_DECAY par jour inactif, plancher 0', () => {
    const [j1, j2, j3, j4] = protectionValues([true, false, false, false]);
    expect(j1).toBe(100);
    expect(j2).toBe(100 - PROTECTION_DECAY);
    expect(j3).toBe(Math.max(0, 100 - 2 * PROTECTION_DECAY));
    expect(j4).toBe(Math.max(0, 100 - 3 * PROTECTION_DECAY));
  });

  it('ne descend jamais sous 0', () => {
    const values = protectionValues([true, false, false, false, false, false, false]);
    expect(values.every((v) => v >= 0)).toBe(true);
  });
});

describe('protectionColor × protectionValues — cohérence avec le repère « 2 jours consécutifs »', () => {
  it('1 jour de repos reste vert ou ambre, jamais rouge', () => {
    const [, j2] = protectionValues([true, false]);
    expect(protectionColor(j2)).not.toBe('var(--color-toxique)');
  });

  it('2 jours de repos consécutifs restent vert ou ambre, jamais rouge (le repère les tolère)', () => {
    const [, , j3] = protectionValues([true, false, false]);
    expect(protectionColor(j3)).not.toBe('var(--color-toxique)');
  });

  it('3 jours de repos consécutifs passent au rouge (le repère est dépassé)', () => {
    const [, , , j4] = protectionValues([true, false, false, false]);
    expect(protectionColor(j4)).toBe('var(--color-toxique)');
  });

  it('un patient actif lundi et jeudi (2 jours d’écart, conforme au repère) ne voit jamais de rouge', () => {
    // L=actif, M=inactif, M=inactif, J=actif, V/S/D=inactif
    const values = protectionValues([true, false, false, true, false, false, false]);
    const [, mardi, mercredi] = values;
    expect(protectionColor(mardi)).not.toBe('var(--color-toxique)');
    expect(protectionColor(mercredi)).not.toBe('var(--color-toxique)');
  });
});
