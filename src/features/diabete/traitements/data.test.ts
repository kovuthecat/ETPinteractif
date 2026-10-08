import { describe, expect, it } from 'vitest';
import { CLASSES, ZONE_MSG, classById, lignesInitiales, newLigne, phraseEffet } from './data';

describe('Traitements diabète — effet énoncé au nom de la classe (c-4-46)', () => {
  it('une ordonnance s’ouvre vide et une ligne neuve n’a aucune classe', () => {
    expect(lignesInitiales()).toEqual([]);
    expect(newLigne('').classId).toBe('');
    expect(classById('')).toBeUndefined();
  });

  it('sans classe choisie, aucun effet', () => {
    expect(phraseEffet('')).toBeNull();
    expect(phraseEffet('inconnue')).toBeNull();
  });

  it('un nom libre ne figure jamais dans la phrase : elle ne dépend que de la classe', () => {
    const ligne = newLigne('Énergie café ☕ après-midi 😤');
    expect(phraseEffet(ligne.classId)).toBeNull();
    const choisie = { ...ligne, classId: 'metformine' };
    const phrase = phraseEffet(choisie.classId);
    expect(phrase).not.toBeNull();
    expect(phrase).not.toContain('Énergie');
    expect(phrase).not.toContain('café');
    expect(phrase).toContain(classById('metformine')!.label);
    expect(phrase).toContain(ZONE_MSG.sucre);
  });

  it('chaque classe a une phrase au nom de sa classe, avec tous les messages de ses zones', () => {
    CLASSES.forEach((c) => {
      const phrase = phraseEffet(c.id)!;
      expect(phrase.startsWith(`La classe « ${c.label} » `)).toBe(true);
      c.zones.forEach((z) => expect(phrase).toContain(ZONE_MSG[z]));
    });
  });
});
