import { describe, it, expect } from 'vitest';
import { analyseEquilibreAssiette, analyseAssietteVide, type AssietteEquilibre } from './analyseAssiette';

// ---------------------------------------------------------------------------
// Cas source de la gate G-assiette (plans/recette-outils-2026-08/S4.md) : ajouter 6 légumes
// distincts sans toucher aux frontières du camembert laissait « Pas assez de légumes » à
// l'écran — l'analyse doit désormais lire la variété en plus des proportions.
// ---------------------------------------------------------------------------

const BASE: AssietteEquilibre = {
  pctLegumes: 33,
  pctFeculents: 33,
  pctProteines: 34,
  varieteLegumes: 1,
  varieteFeculents: 1,
  varieteProteines: 1,
};

describe('analyseAssietteVide', () => {
  it('invite à composer l’assiette', () => {
    expect(analyseAssietteVide()).toMatch(/composer votre assiette/);
  });
});

describe('analyseEquilibreAssiette — cas source de la recette (6 légumes, camembert inchangé)', () => {
  it('avec plusieurs légumes distincts, credite le geste au lieu de répéter « pas assez »', () => {
    const texte = analyseEquilibreAssiette({ ...BASE, pctLegumes: 20, varieteLegumes: 6 });
    expect(texte).not.toMatch(/Pas assez de légumes/);
    expect(texte).toMatch(/beaux légumes/i);
  });

  it('avec un seul légume et une part faible, garde le message de manque original', () => {
    const texte = analyseEquilibreAssiette({ ...BASE, pctLegumes: 20, varieteLegumes: 1 });
    expect(texte).toMatch(/Pas assez de légumes/);
  });
});

describe('analyseEquilibreAssiette — proportions dans la cible (½ · ¼ · ¼)', () => {
  it('proportions bonnes + bonne variété partout → renforcement positif', () => {
    const texte = analyseEquilibreAssiette({
      pctLegumes: 50,
      pctFeculents: 25,
      pctProteines: 25,
      varieteLegumes: 3,
      varieteFeculents: 2,
      varieteProteines: 2,
    });
    expect(texte).toMatch(/Bel équilibre/);
    expect(texte).toMatch(/variété/);
  });

  it('proportions bonnes + peu de légumes variés → invite à varier les légumes', () => {
    const texte = analyseEquilibreAssiette({
      pctLegumes: 50,
      pctFeculents: 25,
      pctProteines: 25,
      varieteLegumes: 1,
      varieteFeculents: 3,
      varieteProteines: 3,
    });
    expect(texte).toBe('De bonnes proportions ; variez les légumes.');
  });
});

describe('analyseEquilibreAssiette — branches inchangées (protéines/féculents hauts)', () => {
  it('trop de protéines → message allégement, quelle que soit la variété', () => {
    const texte = analyseEquilibreAssiette({ ...BASE, pctLegumes: 40, pctProteines: 45, varieteProteines: 5 });
    expect(texte).toMatch(/Beaucoup de protéines/);
  });

  it('trop de féculents → message laisser de la place aux légumes', () => {
    const texte = analyseEquilibreAssiette({ ...BASE, pctLegumes: 40, pctFeculents: 45, pctProteines: 15 });
    expect(texte).toMatch(/Beaucoup de féculents/);
  });

  it('ni cible ni déséquilibre marqué → message de rééquilibrage générique', () => {
    // 37/33/30 : légumes hors cible (bande 38-62) mais au-dessus du seuil bas (35) ;
    // féculents/protéines hors cible mais sous leurs seuils hauts (40) — aucune branche
    // ciblée ne se déclenche, repli générique attendu.
    const texte = analyseEquilibreAssiette({ ...BASE, pctLegumes: 37, pctFeculents: 33, pctProteines: 30 });
    expect(texte).toMatch(/Assiette correcte/);
  });
});

describe('analyseEquilibreAssiette — jamais de chiffre imprimé', () => {
  it('aucun message ne contient de chiffre (invariant module 8, jamais de seuil à l’écran)', () => {
    const cas: AssietteEquilibre[] = [
      { ...BASE, pctLegumes: 50, pctFeculents: 25, pctProteines: 25, varieteLegumes: 3, varieteFeculents: 3, varieteProteines: 3 },
      { ...BASE, pctLegumes: 50, pctFeculents: 25, pctProteines: 25, varieteLegumes: 1 },
      { ...BASE, pctLegumes: 20, varieteLegumes: 6 },
      { ...BASE, pctLegumes: 20, varieteLegumes: 1 },
      { ...BASE, pctLegumes: 40, pctProteines: 45 },
      { ...BASE, pctLegumes: 40, pctFeculents: 45, pctProteines: 15 },
      { ...BASE, pctLegumes: 37, pctFeculents: 33, pctProteines: 30 },
    ];
    for (const c of cas) {
      expect(analyseEquilibreAssiette(c)).not.toMatch(/\d/);
    }
  });
});
