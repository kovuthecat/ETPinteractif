import { describe, it, expect } from 'vitest';
import {
  syntheseCarnet,
  entreesSur7Jours,
  VOLUME_MIN_SYNTHESE,
  type CarnetEntry,
} from './carnetSynthese';

const MAINTENANT = new Date('2026-08-06T20:00');

function entry(id: string, dateHeure: string, contexte = '', ressenti = ''): CarnetEntry {
  return { id, dateHeure, contexte, ressenti };
}

describe('entreesSur7Jours', () => {
  it('exclut une entrée de plus de 7 jours, inclut une entrée dans la fenêtre', () => {
    const dedans = entry('a', '2026-08-01T08:00'); // 5 jours avant
    const dehors = entry('b', '2026-07-29T08:00'); // 8 jours avant
    const res = entreesSur7Jours([dedans, dehors], MAINTENANT);
    expect(res.map((e) => e.id)).toEqual(['a']);
  });

  it('ignore une date invalide sans planter', () => {
    const res = entreesSur7Jours([entry('a', 'pas-une-date')], MAINTENANT);
    expect(res).toEqual([]);
  });
});

describe('syntheseCarnet — volume minimal', () => {
  it('retourne null sous le volume minimal', () => {
    const entries = Array.from({ length: VOLUME_MIN_SYNTHESE - 1 }, (_, i) =>
      entry(`${i}`, '2026-08-06T08:00'),
    );
    expect(syntheseCarnet(entries, MAINTENANT)).toBeNull();
  });

  it('affiche la synthèse à partir du volume minimal', () => {
    const entries = Array.from({ length: VOLUME_MIN_SYNTHESE }, (_, i) =>
      entry(`${i}`, '2026-08-06T08:00'),
    );
    expect(syntheseCarnet(entries, MAINTENANT)).not.toBeNull();
  });

  it('ne compte que les entrées des 7 derniers jours dans le volume minimal', () => {
    // 4 récentes + 4 anciennes : sous le seuil malgré 8 entrées au total.
    const recentes = Array.from({ length: 4 }, (_, i) => entry(`r${i}`, '2026-08-06T08:00'));
    const anciennes = Array.from({ length: 4 }, (_, i) => entry(`a${i}`, '2026-07-01T08:00'));
    expect(syntheseCarnet([...recentes, ...anciennes], MAINTENANT)).toBeNull();
  });
});

describe('syntheseCarnet — répartition par tranche horaire', () => {
  it('classe correctement matin/midi/après-midi/soir, minuit inclus dans soir', () => {
    const entries = [
      entry('1', '2026-08-06T07:00'), // matin
      entry('2', '2026-08-06T12:30'), // midi
      entry('3', '2026-08-06T15:00'), // après-midi
      entry('4', '2026-08-06T19:00'), // soir
      entry('5', '2026-08-06T00:30'), // soir (nuit)
    ];
    const synth = syntheseCarnet(entries, MAINTENANT)!;
    expect(synth.parTranche).toEqual({ matin: 1, midi: 1, 'apres-midi': 1, soir: 2 });
  });
});

describe('syntheseCarnet — contextes fréquents', () => {
  it('regroupe un contexte malgré casse/espaces différents', () => {
    const entries = [
      entry('1', '2026-08-06T08:00', 'Café'),
      entry('2', '2026-08-06T09:00', 'café'),
      entry('3', '2026-08-06T10:00', '  café  '),
      entry('4', '2026-08-06T11:00', 'stress'),
      entry('5', '2026-08-06T12:00', ''),
    ];
    const synth = syntheseCarnet(entries, MAINTENANT)!;
    expect(synth.topContextes[0]).toEqual({ libelle: 'Café', count: 3 });
    expect(synth.topContextes[1]).toEqual({ libelle: 'stress', count: 1 });
  });

  it('limite à 3 contextes, triés du plus au moins fréquent', () => {
    const entries = [
      ...Array.from({ length: 3 }, (_, i) => entry(`a${i}`, '2026-08-06T08:00', 'café')),
      ...Array.from({ length: 2 }, (_, i) => entry(`b${i}`, '2026-08-06T09:00', 'stress')),
      entry('c', '2026-08-06T10:00', 'après repas'),
      entry('d', '2026-08-06T11:00', 'social'),
    ];
    const synth = syntheseCarnet(entries, MAINTENANT)!;
    expect(synth.topContextes).toHaveLength(3);
    expect(synth.topContextes.map((c) => c.libelle)).toEqual(['café', 'stress', 'après repas']);
  });

  it('liste vide si aucun contexte saisi', () => {
    const entries = Array.from({ length: VOLUME_MIN_SYNTHESE }, (_, i) => entry(`${i}`, '2026-08-06T08:00'));
    const synth = syntheseCarnet(entries, MAINTENANT)!;
    expect(synth.topContextes).toEqual([]);
  });
});

describe('syntheseCarnet — total sur 7 jours', () => {
  it('compte uniquement les entrées de la fenêtre de 7 jours', () => {
    const recentes = Array.from({ length: 6 }, (_, i) => entry(`r${i}`, '2026-08-06T08:00'));
    const ancienne = entry('vieille', '2026-07-01T08:00');
    const synth = syntheseCarnet([...recentes, ancienne], MAINTENANT)!;
    expect(synth.total7Jours).toBe(6);
  });
});
