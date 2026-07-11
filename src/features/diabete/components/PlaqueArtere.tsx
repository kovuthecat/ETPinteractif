import styles from './PlaqueArtere.module.css';

/**
 * LA PLAQUE D'ATHÉROME CODÉE (S3, plans/illustrations-diabete/S3.md) — depuis le virage
 * illustration-driven, le vaisseau lui-même est l'image `artere-saine.png` (S1) ; ce composant
 * ne dessine plus que le **dépôt qui grossit**, en overlay transparent posé par le module
 * consommateur sur cette illustration. Reprend la même courbe de croissance que l'ancienne
 * version codée du vaisseau (pot = encrassement^0.75, mêmes paliers de teinte).
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

export default function PlaqueArtere({ encrassement, className }: PlaqueArtereProps) {
  const e = clamp01(encrassement);
  const pot = Math.pow(e, 0.75);
  const rx = 10 + pot * 30;
  const ry = 15 + pot * 30;
  const fill =
    pot < 0.35 ? 'var(--color-vigilance-soft)' : pot < 0.7 ? 'var(--color-vigilance)' : 'var(--color-toxique)';

  return (
    <svg className={`${styles.overlaySvg} ${className ?? ''}`} viewBox="0 0 100 100" aria-hidden="true">
      {e > 0 && <ellipse cx={50} cy={50} rx={rx} ry={ry} className={styles.plaque} style={{ fill }} />}
    </svg>
  );
}
