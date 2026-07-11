import styles from './PlaqueArtere.module.css';

/**
 * LA PLAQUE D'ATHÉROME CODÉE (S3, plans/illustrations-diabete/S3.md ; remodelée S7,
 * plans/corrections-visuelles-diabete/S7.md, capture #13) — depuis le virage
 * illustration-driven, le vaisseau lui-même est l'image `artere-saine.png` (S1) ; ce composant
 * ne dessine plus que le **dépôt qui grossit**, en overlay transparent posé par le module
 * consommateur sur cette illustration. Le repère local (viewBox 0–100) suit l'axe du vaisseau
 * tel que posé par `.artereOverlay` (module Risque cardio) : x = le long du vaisseau, y = en
 * travers (paroi haute en y=0, paroi basse en y=100, lumière au centre) — c'est le module
 * consommateur qui oriente cette boîte sur l'image (rotation/position), pas ce composant.
 * Reprend la même courbe de croissance que l'ancienne version (pot = encrassement^0.75, mêmes
 * paliers de teinte) ; `plaquePassagePct` (même formule qu'avant) reste la source de vérité du
 * pourcentage affiché, indépendante du tracé.
 */

export interface PlaqueArtereProps {
  /** Encrassement 0 (dégagé) → 1 (très bouché). */
  encrassement: number;
  className?: string;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** % de la lumière qui reste ouverte au passage du sang — même formule que le vaisseau codé
 *  d'origine (paroi 8→42 sur une hauteur de référence 120), indépendante de tout tracé. */
export function plaquePassagePct(encrassementRaw: number): number {
  const encrassement = clamp01(encrassementRaw);
  const wallFrac = 8 / 120 + encrassement * (34 / 120);
  return Math.round((1 - 2 * wallFrac) * 100);
}

/** Dépôt en croissant collé à une paroi (`edgeY` = 0 ou 100) : plat contre la paroi sur toute
 *  la longueur du vaisseau, bulle vers le centre jusqu'à `peakY` au milieu (x=50), et se
 *  résorbe à rien aux deux extrémités — au lieu d'un disque flottant au milieu du vaisseau. */
function crescentPath(edgeY: number, peakY: number): string {
  return `M0,${edgeY} Q50,${peakY} 100,${edgeY} Z`;
}

/** Seuil d'encrassement au-delà duquel un 2ᵉ dépôt (paroi opposée) apparaît — rétrécissement
 *  bilatéral aux stades avancés seulement (la plupart des sténoses réelles sont excentrées). */
const BILATERAL_THRESHOLD = 0.5;

// S2-v2 (index v2 §3 point 6) : au score max, le dépôt opposé rejoint la même profondeur que le
// dépôt principal (symétrie complète) au lieu de rester à 75 % — sinon la lumière résiduelle au
// centre du croissant (~39 %) restait visuellement plus ouverte que les ~30 % annoncés par
// `plaquePassagePct`. Continuité douce avec l'ancien palier (0.75 pile au seuil `e = 0.5`).
// `// à revalider (Thibault)`.
function oppositeDepthFactor(e: number): number {
  return 0.5 + 0.5 * e;
}

export default function PlaqueArtere({ encrassement, className }: PlaqueArtereProps) {
  const e = clamp01(encrassement);
  const pot = Math.pow(e, 0.75);
  // Même formule que `plaquePassagePct` (paroi 8→42 sur référence 120, mise à l'échelle du
  // viewBox 0–100) : la profondeur du dépôt au centre du croissant reste cohérente avec le
  // texte « Passage du sang : X % » affiché par le module consommateur.
  const wallDepth = (8 / 120 + e * (34 / 120)) * 100;
  const fill =
    pot < 0.35 ? 'var(--color-vigilance-soft)' : pot < 0.7 ? 'var(--color-vigilance)' : 'var(--color-toxique)';
  const showOpposite = e > BILATERAL_THRESHOLD;

  return (
    <svg className={`${styles.overlaySvg} ${className ?? ''}`} viewBox="0 0 100 100" aria-hidden="true">
      {e > 0 && <path d={crescentPath(0, wallDepth)} className={styles.plaque} style={{ fill }} />}
      {showOpposite && (
        <path
          d={crescentPath(100, 100 - wallDepth * oppositeDepthFactor(e))}
          className={styles.plaque}
          style={{ fill }}
        />
      )}
    </svg>
  );
}
