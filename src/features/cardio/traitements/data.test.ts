import { describe, expect, it } from 'vitest';
import { CLASSES, classById, effetDeClasse, lignesInitiales, newLigne } from './data';

describe('Traitements cardio — effet énoncé au nom de la classe (c-6-22)', () => {
  it('une ordonnance s’ouvre vide et une ligne neuve n’a aucune classe (pas de CLASSES[0])', () => {
    expect(lignesInitiales()).toEqual([]);
    expect(newLigne('').classId).toBe('');
    expect(classById('')).toBeUndefined();
  });

  it('sans classe choisie, aucun effet', () => {
    expect(effetDeClasse('')).toBeNull();
    expect(effetDeClasse('inconnue')).toBeNull();
  });

  it('le sujet est la classe, jamais le texte libre de la ligne', () => {
    const ligne = { ...newLigne('Tisane du soir 🌙'), classId: 'ieca' };
    const effet = effetDeClasse(ligne.classId)!;
    expect(effet.sujet).toBe(classById('ieca')!.label);
    expect(effet.sujet).not.toContain('Tisane');
    expect(effet.message).not.toContain('Tisane');
  });

  it('chaque classe renvoie son message', () => {
    CLASSES.forEach((c) => expect(effetDeClasse(c.id)).toEqual({ sujet: c.label, message: c.message }));
  });
});
