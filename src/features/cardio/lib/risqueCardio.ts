/**
 * Cœur pédagogique du thème cardio (C3, plans/theme-cardio-2026-07/S2.md) : géométrie de la
 * plaque d'athérome **réversible** + cumul **multiplicatif** des feux de risque + transitions
 * d'état. Porté quasi verbatim du prototype `ETP Cardio - Prototype.dc.html` (lignes 603-628 =
 * `FEU_COLORS`/`FEU_MULT`/`NEXT_ETAT`/`plaqueGeom` ; lignes 711-734 = M1 steps + cumul `rate`/
 * `score`). Lib pure, sans état, sans dépendance React/DOM — sur le patron de
 * `diabete/lib/glycemieCurve.ts` et `tabac/lib/nicotineCurve.ts`.
 *
 * Consommée par `ArtereCoupe`, `CockpitFeux` (C4) et par les modules M1/M2/M4/M5 (S4, S5, S7, S8).
 *
 * ⚠️ Couleurs (D6) : cette lib ne renvoie **jamais** d'oklch brut — uniquement des noms de
 * token (`Token`) ou des chaînes `var(--color-…)` (`src/styles/tokens.css`). Mapping repris du
 * prototype : vert → `confort`, ambre/orange → `vigilance`, rouge → `toxique`.
 *
 * ⚠️ `ArtereCoupe` (C4) porte en plus, en **surcouche** (hors de cette lib, cf. proto lignes
 * 719-720) : le caillot occlusif (`caillot`) et le renforcement de la paroi (`renforce`).
 * `plaqueGeom` ne gère que le dépôt réversible, la 2ᵉ paroi (bilatéral) et la fissure
 * (`opts.fragile`) — ce sont les seuls états portés par la géométrie de base (D2).
 */

/** Les 3 états d'un feu de risque (facteur modifiable). */
export type Feu = 'vert' | 'orange' | 'rouge';

/** Nom de token sémantique (jamais d'oklch brut hors de `src/styles/tokens.css`, D6). */
export type Token = 'confort' | 'vigilance' | 'toxique';

/** Facteur multiplicatif par feu (proto ligne 608) — c'est ce facteur, **multiplié** entre
 *  facteurs (jamais additionné), qui porte le message pédagogique du M2 : un 2ᵉ ou 3ᵉ facteur au
 *  rouge ne s'ajoute pas au risque, il le multiplie. */
export const FEU_MULT: Record<Feu, number> = { vert: 1, orange: 1.4, rouge: 2 };

/** Cycle de transition d'un feu (proto ligne 609) : vert → orange → rouge → vert. */
export const NEXT_ETAT: Record<Feu, Feu> = { vert: 'orange', orange: 'rouge', rouge: 'vert' };

/** Mapping couleur → token (D6) : vert = confort, orange/ambre = vigilance, rouge = toxique. */
export const FEU_TOKEN: Record<Feu, Token> = { vert: 'confort', orange: 'vigilance', rouge: 'toxique' };

/** Style prêt à consommer (chaînes `var(--color-…)`, jamais d'oklch brut) pour un chip/pastille
 *  de feu : couleur d'état portée par bordure/fond **et** largeur de bordure croissante — repère
 *  non chromatique complémentaire à la couleur (invariant a11y CVD2-S2 : jamais la couleur/l'icône
 *  seule). Repris du pattern `FEU_TOKENS`/`feuTokenStyle` de
 *  `diabete/risque-cardio/RisqueCardioModule.tsx`, généralisé ici pour `CockpitFeux` (C4). */
export interface FeuTokenStyle {
  fg: string;
  soft: string;
  borderWidth: string;
}

export const FEU_TOKEN_STYLE: Record<Feu, FeuTokenStyle> = {
  vert: { fg: 'var(--color-confort-strong)', soft: 'var(--color-confort-soft)', borderWidth: '1.5px' },
  orange: { fg: 'var(--color-vigilance)', soft: 'var(--color-vigilance-soft)', borderWidth: '3px' },
  rouge: { fg: 'var(--color-toxique)', soft: 'var(--color-toxique-soft)', borderWidth: '4px' },
};

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/**
 * Géométrie SVG de la plaque d'athérome, **réversible** (contrairement à
 * `diabete/components/PlaqueArtere.tsx`, qui ne dessine que le dépôt) : dépôt principal (toujours),
 * 2ᵉ paroi/bilatéral au-delà de `e = 0.5` (la plupart des sténoses réelles sont excentrées en
 * dessous de ce seuil), fissure si `opts.fragile`. Porté quasi verbatim du prototype (lignes
 * 611-628) — mêmes noms de variables (`wallDepth`, `pot`, `fill`), clampé 0-1 (ligne 612).
 * Le caillot et le renforcement (surcouche) sont hors-lib, portés par `ArtereCoupe` (D2/D6).
 *
 * @param encrassementRaw 0 (paroi saine) → 1 (très bouchée), clampé.
 * @param opts.fragile ajoute la fissure (dépôt instable, prêt à se rompre).
 * @returns une chaîne de `<path>` SVG (repère `viewBox="0 0 100 100"`), vide si `e = 0`.
 */
export function plaqueGeom(encrassementRaw: number, opts?: { fragile?: boolean }): string {
  const e = clamp01(encrassementRaw);
  // Paroi 8→42 sur une hauteur de référence 120 (même formule que `plaquePassagePct` ci-dessous
  // et que l'ancien `PlaqueArtere` diabète), mise à l'échelle du viewBox 0-100.
  const wallDepth = (8 / 120 + e * (34 / 120)) * 100;
  const pot = Math.pow(e, 0.75);
  const fill =
    pot < 0.35 ? 'var(--color-vigilance-soft)' : pot < 0.7 ? 'var(--color-vigilance)' : 'var(--color-toxique)';
  const topCtrl = 2 * wallDepth;

  let svg = e > 0 ? `<path d="M0,0 Q50,${topCtrl} 100,0 Z" fill="${fill}" stroke="var(--color-text)" stroke-width="1"/>` : '';

  if (e > 0.5) {
    // Dépôt bilatéral (2ᵉ paroi) : au score max, il rejoint la même profondeur que le dépôt
    // principal (symétrie complète), continuité douce avec le seuil e = 0.5 (facteur 0.5+0.5e).
    const oppApex = 100 - wallDepth * (0.5 + 0.5 * e);
    const oppCtrl = 2 * oppApex - 100;
    svg += `<path d="M0,100 Q50,${oppCtrl} 100,100 Z" fill="${fill}" stroke="var(--color-text)" stroke-width="1"/>`;
  }

  if (opts?.fragile && e > 0) {
    // Fissure : tracé décoratif fixe (identique au prototype), jamais de couleur sémantique de
    // token ici — c'est un détail d'illustration (fissure/sang), pas un niveau de risque.
    svg += '<path d="M47,7 L53,12 L46,16 L51,20" stroke="#5c1a0d" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
  }

  return svg;
}

/** % de la lumière qui reste ouverte au passage du sang — même formule que `plaqueGeom`
 *  (paroi 8→42 sur référence 120), indépendante de tout tracé. Équivalent cardio de
 *  `diabete/components/PlaqueArtere.tsx#plaquePassagePct` (compat lecture « lumière restante »,
 *  ex. `aria-label` d'`ArtereCoupe`). */
export function plaquePassagePct(encrassementRaw: number): number {
  const e = clamp01(encrassementRaw);
  const wallFrac = 8 / 120 + e * (34 / 120);
  return Math.round((1 - 2 * wallFrac) * 100);
}

/**
 * Cumul **multiplicatif** des feux (proto lignes 724-726) — le cœur du message du M2 : un 2ᵉ ou
 * 3ᵉ facteur au rouge ne s'ajoute pas au risque, il le **multiplie**. `rate` = produit des
 * `FEU_MULT` de chaque feu (≥ 1, non borné) ; `score` = version bornée [0, 0.9] pour une barre de
 * risque visuelle (jamais affiché comme un chiffre à l'écran, cf. index.md « aucun score de risque
 * calculé affiché » — usage : position d'un curseur, jamais un texte).
 */
export function cumulMultiplicatif(feux: Feu[]): { rate: number; score: number } {
  const rate = feux.reduce((acc, f) => acc * FEU_MULT[f], 1);
  const score = Math.min(0.9, 1 - 1 / rate);
  return { rate, score };
}
