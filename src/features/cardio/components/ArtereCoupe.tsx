import { plaqueGeom, plaquePassagePct } from '../lib/risqueCardio';
import styles from './ArtereCoupe.module.css';

/**
 * L'artère réversible (C4, D1) — ⚠️ ne PAS confondre avec `diabete/components/PlaqueArtere.tsx`,
 * qui ne dessine que le dépôt (`encrassement` 0→1), sans réversibilité ni rupture. `ArtereCoupe`
 * affiche la géométrie complète portée dans la lib (`plaqueGeom`, C3) : dépôt, 2ᵉ paroi, fissure
 * (`fragile`) — et ajoute, en **surcouche** hors-lib (proto lignes 719-720, D2) : le caillot
 * occlusif (`caillot`) et le renforcement de la paroi (`renforce`, agir avant la rupture).
 *
 * `img artere-saine.png` (réutilisée depuis diabète, D3) + `<svg>` overlay positionné comme le
 * prototype (`.overlay`, cf. CSS — cadrage identique M1/M2). Aucun contenu de module en dur ici :
 * ce composant ne connaît que `encrassement`/`fragile`/`caillot`/`renforce`.
 */

export interface ArtereCoupeProps {
  /** Encrassement 0 (saine) → 1 (très bouchée), clampé (cf. `plaqueGeom`). */
  encrassement: number;
  /** Ajoute la fissure de plaque (dépôt instable — `plaqueGeom` `opts.fragile`, C3). */
  fragile?: boolean;
  /** Ajoute le caillot occlusif (surcouche, proto ligne 719 — rupture/accident). */
  caillot?: boolean;
  /** Recolore/épaissit la paroi du dépôt en « renforcée/stabilisée » (surcouche, proto ligne 720
   *  — agir avant la rupture : la plaque reste mais se solidifie). Ne restyle que le 1er dépôt
   *  émis par `plaqueGeom` (fidèle au prototype, qui ne remplace que la 1ʳᵉ occurrence). */
  renforce?: boolean;
  /** Taille du carré (px). Défaut 320 (entre les 400 de M1 et les 300 de M2 dans le prototype). */
  size?: number;
  className?: string;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export default function ArtereCoupe({
  encrassement,
  fragile,
  caillot,
  renforce,
  size = 320,
  className,
}: ArtereCoupeProps) {
  const e = clamp01(encrassement);
  let svgInner = plaqueGeom(e, { fragile });

  if (caillot) {
    // Surcouche « rupture » (proto ligne 719) : fissure de rupture + caillot occlusif au centre
    // de la lumière. Détail d'illustration (pas un niveau de risque sémantique) : couleurs fixes,
    // comme la fissure de `plaqueGeom`.
    svgInner +=
      '<path d="M47,7 L53,13 L46,17 L51,21" stroke="#3a0e07" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="52" rx="13.5" ry="29.5" fill="#5c1a0d"/>';
  }

  if (renforce) {
    // Surcouche « renforcée » (proto ligne 720) : bordure épaissie, couleur confort (jamais
    // oklch brut, D6) — la plaque reste mais se solidifie, beaucoup moins de risque de rupture.
    svgInner = svgInner.replace(
      'stroke="var(--color-text)" stroke-width="1"',
      'stroke="var(--color-confort-strong)" stroke-width="4.5"',
    );
  }

  return (
    <div
      className={`${styles.wrap} ${className ?? ''}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Section d'artère : passage du sang à ${plaquePassagePct(e)} % de la lumière initiale`}
    >
      <img
        src={`${import.meta.env.BASE_URL}illustrations/cardio/artere-saine.png`}
        alt=""
        aria-hidden="true"
        className={styles.img}
      />
      {/* `svgInner` est généré uniquement depuis des nombres calculés par la lib (jamais
          d'entrée utilisateur) : pas de risque XSS à l'utiliser via dangerouslySetInnerHTML. */}
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={styles.overlay}
        dangerouslySetInnerHTML={{ __html: svgInner }}
      />
    </div>
  );
}
