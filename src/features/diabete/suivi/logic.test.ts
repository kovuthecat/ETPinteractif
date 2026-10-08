import { describe, expect, it } from 'vitest';
import {
  EXAM_DEFS,
  EXAM_FREQUENCY_OPTIONS,
  aggregateStatus,
  computeConsultMonths,
  examKey,
  examOccurrenceMonths,
  frequencyLabel,
  initExamConfig,
  isLongCycle,
  longCycleNextYear,
  longCycleYears,
  occurrenceStatus,
  toggleOccurrenceGroup,
} from './logic';
import type { ExamId } from './logic';

const ANNUELS: ExamId[] = ['bilan_lipidique', 'rein', 'fond_oeil', 'pied_complet', 'dentiste'];
const RYTHMES_CONSULTATION = [3, 4, 6];

/** Le résultat « tel qu'affiché » d'un examen pour un rythme de consultation donné. */
function affichage(id: ExamId, interval: number) {
  // Le rythme des consultations est calculé pour prouver qu'il n'entre pas dans l'examen.
  expect(computeConsultMonths({ interval, startMonth: 0 }).length).toBe(12 / interval);
  const cfg = initExamConfig()[id];
  return {
    occurrences: examOccurrenceMonths(cfg),
    libelle: frequencyLabel(cfg.frequenceMois),
    cycleLong: isLongCycle(cfg),
  };
}

describe('fréquence propre à chaque examen (c-4-40, c-4-41)', () => {
  it.each(RYTHMES_CONSULTATION)('à %i mois de consultation, un examen annuel reste 1×/an', (interval) => {
    ANNUELS.forEach((id) => {
      const a = affichage(id, interval);
      expect(a.occurrences).toHaveLength(1);
      expect(a.libelle).toBe('1×/an');
      expect(a.cycleLong).toBe(false);
    });
  });

  it.each(RYTHMES_CONSULTATION)('à %i mois de consultation, l’HbA1c tombe 4×/an', (interval) => {
    const a = affichage('hba1c', interval);
    expect(a.occurrences).toEqual([0, 3, 6, 9]);
    expect(a.libelle).toBe('tous les 3 mois');
  });

  it.each(RYTHMES_CONSULTATION)('à %i mois de consultation, les vaccins restent tous les 2 ans (cycle long)', (interval) => {
    const a = affichage('vaccins', interval);
    expect(a.libelle).toBe('tous les 2 ans');
    expect(a.cycleLong).toBe(true);
    expect(longCycleYears(initExamConfig().vaccins)).toBe(2);
  });

  it('un examen tombe sur son propre mois, même hors d’un mois de consultation', () => {
    // Consultations à 4 mois : janvier, mai, septembre. Le bilan rénal (mois 3 = avril) n'en fait pas partie.
    const consultMonths = computeConsultMonths({ interval: 4, startMonth: 0 });
    expect(consultMonths).toEqual([0, 4, 8]);
    const rein = examOccurrenceMonths(initExamConfig().rein);
    expect(rein).toEqual([3]);
    expect(consultMonths).not.toContain(rein[0]);
    // Le dentiste (octobre) et le bilan lipidique (juillet) non plus.
    expect(examOccurrenceMonths(initExamConfig().dentiste)).toEqual([9]);
    expect(examOccurrenceMonths(initExamConfig().bilan_lipidique)).toEqual([6]);
  });

  it('l’occurrence suit la fréquence réglée (6 mois, 5 ans), pas le rythme des consultations', () => {
    expect(examOccurrenceMonths({ frequenceMois: 6, startMonth: 9 })).toEqual([3, 9]);
    expect(examOccurrenceMonths({ frequenceMois: 60, startMonth: 2 })).toEqual([2]);
    expect(isLongCycle({ frequenceMois: 60, startMonth: 2 })).toBe(true);
    expect(longCycleYears({ frequenceMois: 60, startMonth: 2 })).toBe(5);
  });

  it('la prochaine échéance d’un cycle long suit les années de la fréquence', () => {
    expect(longCycleNextYear({ frequenceMois: 24, startMonth: 0 }, 2026)).toBe(2027);
  });
});

describe('libellé = fréquence appliquée (c-4-41)', () => {
  it('suit la fréquence en mois', () => {
    expect(frequencyLabel(3)).toBe('tous les 3 mois');
    expect(frequencyLabel(6)).toBe('tous les 6 mois');
    expect(frequencyLabel(12)).toBe('1×/an');
    expect(frequencyLabel(24)).toBe('tous les 2 ans');
    expect(frequencyLabel(60)).toBe('tous les 5 ans');
  });

  it('chaque cran proposé a un libellé distinct', () => {
    const labels = EXAM_FREQUENCY_OPTIONS.map(frequencyLabel);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('chaque fréquence par défaut est un cran proposé', () => {
    const cfg = initExamConfig();
    EXAM_DEFS.forEach((d) => expect(EXAM_FREQUENCY_OPTIONS).toContain(cfg[d.id].frequenceMois));
  });
});

describe('statut par rendez-vous (c-4-42, c-4-43)', () => {
  // Mois courant : juin (5). Octobre (9) est à venir, janvier (0) à programmer.
  const MOIS_COURANT = 5;

  it('basculer (hba1c, octobre) ne change aucun autre mois', () => {
    const avant = {};
    const apres = toggleOccurrenceGroup(avant, ['hba1c'], 9, MOIS_COURANT);
    expect(occurrenceStatus(apres, 'hba1c', 9, MOIS_COURANT)).toBe('fait');
    [0, 3, 6].forEach((m) => {
      expect(occurrenceStatus(apres, 'hba1c', m, MOIS_COURANT)).toBe(occurrenceStatus(avant, 'hba1c', m, MOIS_COURANT));
    });
    expect(Object.keys(apres)).toEqual([examKey('hba1c', 9)]);
  });

  it('un second clic revient à « À programmer » sur ce seul rendez-vous', () => {
    const fait = toggleOccurrenceGroup({}, ['hba1c'], 9, MOIS_COURANT);
    const defait = toggleOccurrenceGroup(fait, ['hba1c'], 9, MOIS_COURANT);
    expect(occurrenceStatus(defait, 'hba1c', 9, MOIS_COURANT)).toBe('a_programmer');
    expect(occurrenceStatus(defait, 'hba1c', 0, MOIS_COURANT)).toBe('a_programmer');
  });

  it('basculer une station groupée change tous ses examens ensemble, et rien d’autre', () => {
    // Par défaut, HbA1c et Bilan rénal se retrouvent en avril (3) : une seule station « prise de sang ».
    const groupe: ExamId[] = ['hba1c', 'rein'];
    const apres = toggleOccurrenceGroup({}, groupe, 3, MOIS_COURANT);
    groupe.forEach((id) => expect(occurrenceStatus(apres, id, 3, MOIS_COURANT)).toBe('fait'));
    // Les autres mois des deux examens, et les autres examens, restent à leur défaut.
    expect(occurrenceStatus(apres, 'hba1c', 0, MOIS_COURANT)).toBe('a_programmer');
    expect(occurrenceStatus(apres, 'hba1c', 6, MOIS_COURANT)).toBe('a_venir');
    expect(occurrenceStatus(apres, 'hba1c', 9, MOIS_COURANT)).toBe('a_venir');
    expect(occurrenceStatus(apres, 'fond_oeil', 3, MOIS_COURANT)).toBe('a_programmer');
    expect(Object.keys(apres).sort()).toEqual([examKey('hba1c', 3), examKey('rein', 3)].sort());
  });

  it('un clic sur une station aux états mélangés les aligne (pas d’inversion d’un seul)', () => {
    // HbA1c déjà fait en avril, rein pas encore : la station affiche « À programmer » (un seul état).
    const melange = { [examKey('hba1c', 3)]: 'fait' as const };
    const groupe: ExamId[] = ['hba1c', 'rein'];
    const affiche = aggregateStatus(groupe.map((id) => occurrenceStatus(melange, id, 3, MOIS_COURANT)));
    expect(affiche).toBe('a_programmer');
    const apres = toggleOccurrenceGroup(melange, groupe, 3, MOIS_COURANT);
    groupe.forEach((id) => expect(occurrenceStatus(apres, id, 3, MOIS_COURANT)).toBe('fait'));
    // Un second clic repasse les deux ensemble.
    const retour = toggleOccurrenceGroup(apres, groupe, 3, MOIS_COURANT);
    groupe.forEach((id) => expect(occurrenceStatus(retour, id, 3, MOIS_COURANT)).toBe('a_programmer'));
  });

  it('ne modifie pas l’objet reçu', () => {
    const avant = {};
    toggleOccurrenceGroup(avant, ['hba1c'], 9, MOIS_COURANT);
    expect(avant).toEqual({});
  });

  it('le statut par défaut vient du mois courant : passé et courant à programmer, futur à venir', () => {
    expect(occurrenceStatus({}, 'hba1c', 5, MOIS_COURANT)).toBe('a_programmer');
    expect(occurrenceStatus({}, 'hba1c', 6, MOIS_COURANT)).toBe('a_venir');
  });
});

describe('aggregateStatus', () => {
  it('tout fait → fait', () => expect(aggregateStatus(['fait', 'fait'])).toBe('fait'));
  it('un à programmer → à programmer', () => expect(aggregateStatus(['fait', 'a_programmer'])).toBe('a_programmer'));
  it('à venir sinon', () => expect(aggregateStatus(['fait', 'a_venir'])).toBe('a_venir'));
  it('liste vide → à venir', () => expect(aggregateStatus([])).toBe('a_venir'));
});
