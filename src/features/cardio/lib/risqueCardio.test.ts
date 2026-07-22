import { describe, it, expect } from 'vitest';
import {
  FEU_MULT,
  NEXT_ETAT,
  FEU_TOKEN,
  FEU_TOKEN_STYLE,
  plaqueGeom,
  plaquePassagePct,
  cumulMultiplicatif,
  type Feu,
} from './risqueCardio';

// ---------------------------------------------------------------------------
// Invariant « multiplication ≠ addition » (message-clé du M2, D2).
// ---------------------------------------------------------------------------

describe('cumulMultiplicatif — multiplication ≠ addition', () => {
  it('tous verts -> rate = 1, score = 0 (aucun risque ajouté)', () => {
    const { rate, score } = cumulMultiplicatif(['vert', 'vert', 'vert', 'vert', 'vert']);
    expect(rate).toBe(1);
    expect(score).toBe(0);
  });

  it('1 rouge (reste vert) : rate = FEU_MULT.rouge = 2, score = 0.5', () => {
    const { rate, score } = cumulMultiplicatif(['rouge', 'vert', 'vert', 'vert', 'vert']);
    expect(rate).toBeCloseTo(2, 9);
    expect(score).toBeCloseTo(0.5, 9);
  });

  it("rate de 2 feux rouges (4) > somme des surcroîts individuels (1 + 1 = 2) : ce n'est pas additif", () => {
    const feux: Feu[] = ['rouge', 'rouge', 'vert', 'vert', 'vert'];
    const { rate } = cumulMultiplicatif(feux);
    const sommeSurcrouts = feux.reduce((acc, f) => acc + (FEU_MULT[f] - 1), 0);
    expect(rate).toBeGreaterThan(sommeSurcrouts);
  });

  it("modèle additif équivalent (1 + Σ(mult-1)) : à 1 rouge, additif == multiplicatif ; dès 2 rouges, le multiplicatif dépasse et l'écart s'élargit à chaque rouge de plus (le 2ᵉ/3ᵉ rouge « coûte » plus cher)", () => {
    const additiveRate = (feux: Feu[]) => feux.reduce((acc, f) => acc + (FEU_MULT[f] - 1), 1);

    const un: Feu[] = ['rouge', 'vert', 'vert', 'vert', 'vert'];
    const deux: Feu[] = ['rouge', 'rouge', 'vert', 'vert', 'vert'];
    const trois: Feu[] = ['rouge', 'rouge', 'rouge', 'vert', 'vert'];

    const gap = (feux: Feu[]) => cumulMultiplicatif(feux).rate - additiveRate(feux);

    const gapUn = gap(un);
    const gapDeux = gap(deux);
    const gapTrois = gap(trois);

    expect(gapUn).toBeCloseTo(0, 9); // à 1 seul facteur non-vert, les deux modèles coïncident
    expect(gapDeux).toBeGreaterThan(gapUn);
    expect(gapTrois).toBeGreaterThan(gapDeux); // l'écart s'élargit : le 3ᵉ rouge « coûte » plus que le 2ᵉ
  });

  it('rate croît plus vite que linéairement : le surcroît marginal du 2ᵉ puis du 3ᵉ rouge est plus grand que celui du 1ᵉʳ (effet multiplicatif, non plafonné comme `score`)', () => {
    const rateAvec = (n: number) => cumulMultiplicatif(Array.from({ length: n }, () => 'rouge' as Feu)).rate;
    const delta1 = rateAvec(1) - rateAvec(0); // 2 - 1 = 1
    const delta2 = rateAvec(2) - rateAvec(1); // 4 - 2 = 2
    const delta3 = rateAvec(3) - rateAvec(2); // 8 - 4 = 4
    expect(delta2).toBeGreaterThan(delta1);
    expect(delta3).toBeGreaterThan(delta2);
  });

  it('score plafonné à 0.9 (jamais affiché comme un chiffre, mais toujours borné pour une barre visuelle)', () => {
    const { score } = cumulMultiplicatif(['rouge', 'rouge', 'rouge', 'rouge', 'rouge']);
    expect(score).toBeLessThanOrEqual(0.9);
  });

  it('liste vide -> rate = 1 (élément neutre), score = 0', () => {
    const { rate, score } = cumulMultiplicatif([]);
    expect(rate).toBe(1);
    expect(score).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Invariant NEXT_ETAT — cycle vert -> orange -> rouge -> vert.
// ---------------------------------------------------------------------------

describe('NEXT_ETAT — cycle vert -> orange -> rouge -> vert', () => {
  it('un cycle complet (3 transitions) revient à l\'état de départ', () => {
    let etat: Feu = 'vert';
    etat = NEXT_ETAT[etat];
    expect(etat).toBe('orange');
    etat = NEXT_ETAT[etat];
    expect(etat).toBe('rouge');
    etat = NEXT_ETAT[etat];
    expect(etat).toBe('vert');
  });

  it('aucun état ne boucle sur lui-même', () => {
    (['vert', 'orange', 'rouge'] as Feu[]).forEach((etat) => {
      expect(NEXT_ETAT[etat]).not.toBe(etat);
    });
  });
});

// ---------------------------------------------------------------------------
// Invariant plaqueGeom — vide à 0, monotone en surface, fissure si fragile.
// ---------------------------------------------------------------------------

/** Extrait le point de contrôle (topCtrl = 2*wallDepth) du 1er path émis, proxy direct de la
 *  profondeur du dépôt (donc de sa surface) — sans dupliquer la formule interne de la lib. */
function extractTopCtrl(svg: string): number {
  const m = svg.match(/M0,0 Q50,([-\d.]+) 100,0/);
  if (!m) throw new Error(`aucun path de dépôt trouvé dans: ${svg}`);
  return Number(m[1]);
}

describe('plaqueGeom — vide à 0, monotone en surface avec e, fragile ajoute la fissure', () => {
  it('plaqueGeom(0) est vide (paroi saine, aucun dépôt)', () => {
    expect(plaqueGeom(0)).toBe('');
  });

  it('clamp : e négatif ou > 1 se comporte comme e = 0 / e = 1 (proto ligne 612)', () => {
    expect(plaqueGeom(-1)).toBe(plaqueGeom(0));
    expect(plaqueGeom(1.7)).toBe(plaqueGeom(1));
  });

  it('e > 0 produit toujours un dépôt non vide', () => {
    for (const e of [0.05, 0.2, 0.4, 0.6, 0.8, 1]) {
      expect(plaqueGeom(e).length).toBeGreaterThan(0);
    }
  });

  it('la profondeur du dépôt (proxy de sa surface) croît strictement avec e', () => {
    const echelle = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    const profondeurs = echelle.map((e) => extractTopCtrl(plaqueGeom(e)));
    for (let i = 1; i < profondeurs.length; i++) {
      expect(profondeurs[i]).toBeGreaterThan(profondeurs[i - 1]);
    }
  });

  it('un 2ᵉ dépôt (paroi opposée) apparaît seulement au-delà de e = 0.5 (sténose bilatérale, stades avancés)', () => {
    const nbPaths = (svg: string) => (svg.match(/<path/g) ?? []).length;
    expect(nbPaths(plaqueGeom(0.3))).toBe(1);
    expect(nbPaths(plaqueGeom(0.5))).toBe(1);
    expect(nbPaths(plaqueGeom(0.51))).toBe(2);
    expect(nbPaths(plaqueGeom(0.9))).toBe(2);
  });

  it('opts.fragile ajoute une fissure (tracé supplémentaire) quand e > 0', () => {
    const sans = plaqueGeom(0.4);
    const avec = plaqueGeom(0.4, { fragile: true });
    expect(avec.length).toBeGreaterThan(sans.length);
    expect(avec).toContain('M47,7');
  });

  it('opts.fragile ne fait rien à e = 0 (rien à fissurer sur une paroi saine)', () => {
    expect(plaqueGeom(0, { fragile: true })).toBe(plaqueGeom(0));
  });

  it('les couleurs de remplissage sont des tokens (jamais un oklch brut, D6)', () => {
    for (const e of [0.1, 0.5, 0.9]) {
      const svg = plaqueGeom(e);
      expect(svg).toMatch(/var\(--color-/);
      expect(svg).not.toMatch(/oklch\(/);
    }
  });
});

// ---------------------------------------------------------------------------
// plaquePassagePct — compat lecture « lumière restante ».
// ---------------------------------------------------------------------------

describe('plaquePassagePct', () => {
  it('paroi saine (e=0) : lumière ~ 100 % (formule paroi 8/120 des deux côtés)', () => {
    expect(plaquePassagePct(0)).toBeGreaterThan(85);
  });

  it('décroît strictement avec e (plus de dépôt = moins de lumière)', () => {
    const pct = [0, 0.25, 0.5, 0.75, 1].map(plaquePassagePct);
    for (let i = 1; i < pct.length; i++) expect(pct[i]).toBeLessThan(pct[i - 1]);
  });
});

// ---------------------------------------------------------------------------
// Tokens exposés aux composants (D6) — jamais d'oklch brut.
// ---------------------------------------------------------------------------

describe('FEU_TOKEN / FEU_TOKEN_STYLE — jamais d\'oklch brut', () => {
  it('mapping vert -> confort, orange -> vigilance, rouge -> toxique', () => {
    expect(FEU_TOKEN.vert).toBe('confort');
    expect(FEU_TOKEN.orange).toBe('vigilance');
    expect(FEU_TOKEN.rouge).toBe('toxique');
  });

  it('FEU_TOKEN_STYLE ne contient que des var(--color-…), et une largeur de bordure croissante (a11y CVD2-S2)', () => {
    (['vert', 'orange', 'rouge'] as Feu[]).forEach((etat) => {
      expect(FEU_TOKEN_STYLE[etat].fg).toMatch(/^var\(--color-/);
      expect(FEU_TOKEN_STYLE[etat].soft).toMatch(/^var\(--color-/);
    });
    const bw = (etat: Feu) => parseFloat(FEU_TOKEN_STYLE[etat].borderWidth);
    expect(bw('orange')).toBeGreaterThan(bw('vert'));
    expect(bw('rouge')).toBeGreaterThan(bw('orange'));
  });
});
