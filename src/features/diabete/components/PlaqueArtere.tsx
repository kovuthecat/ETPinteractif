import styles from './PlaqueArtere.module.css';

/**
 * LA PLAQUE D'ATHÉROME (brief §1.4) — motif-fil qui voyage du module 4 (artère générique,
 * mécanisme) au module 5 (conséquence, posée sur la silhouette). Un seul objet réversible :
 * la géométrie ci-dessous reprend telle quelle les formules de la maquette M4 (paroi
 * `8 + 34·score`, ellipse `pot = score^0.75`, teintes par palier), exprimées en fractions
 * de la boîte englobante pour rester *strictement la même forme* dans les deux variantes
 * (`artere` = grande section, `pastille` = même motif miniature posable sur une zone de
 * la silhouette). L'aller-retour rouge↔vert se voit par transition CSS sur les attributs
 * géométriques SVG (cx/rx/ry/width/fill) — `prefers-reduced-motion` est déjà neutralisé
 * globalement par la règle `* { transition-duration: 0.01ms !important }` de global.css.
 */

export type PlaqueVariante = 'artere' | 'pastille';

export interface PlaqueArtereProps {
  /** Encrassement 0 (dégagé) → 1 (très bouché). */
  encrassement: number;
  variante?: PlaqueVariante;
  className?: string;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Boîte englobante par variante (mêmes proportions que la maquette M4 : viewBox 900×200,
// vaisseau 820×120 avec marge 40). La variante pastille réutilise la même formule à une
// échelle réduite, posable sur une ancre de la silhouette.
const ARTERE_VIEWBOX = { width: 900, height: 200 };
const ARTERE_BOX: Box = { x: 40, y: 40, w: 820, h: 120 };

const PASTILLE_VIEWBOX = { width: 96, height: 56 };
const PASTILLE_BOX: Box = { x: 8, y: 12, w: 80, h: 32 };

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function computeGeometry(encrassementRaw: number, box: Box) {
  const encrassement = clamp01(encrassementRaw);
  // Fractions reprises de la maquette M4 (wall = 8 + score·34, sur une hauteur de référence 120).
  const wallFrac = 8 / 120 + encrassement * (34 / 120);
  const wall = wallFrac * box.h;
  const outerR = box.h / 2; // vaisseau en forme de pilule, comme la maquette (rx=60 sur h=120).

  const lumenX = box.x + wall;
  const lumenY = box.y + wall;
  const lumenW = Math.max(0, box.w - 2 * wall);
  const lumenH = Math.max(0, box.h - 2 * wall);
  const lumenR = Math.max(0, outerR - wall);
  const pct = box.h > 0 ? Math.round((lumenH / box.h) * 100) : 0;
  const lumenFill = encrassement > 0.55 ? 'var(--color-toxique-soft)' : 'var(--color-vigilance-soft)';

  // Une seule plaque : les facteurs se potentialisent (synergie visuelle), pas de cumul linéaire.
  const pot = Math.pow(encrassement, 0.75);
  const plaqueRx = (20 / 820 + pot * (200 / 820)) * box.w;
  const plaqueRy = (10 / 120 + pot * (26 / 120)) * box.h;
  const plaqueFill =
    pot < 0.35
      ? 'var(--color-vigilance-soft)'
      : pot < 0.7
        ? 'var(--color-vigilance)'
        : 'var(--color-toxique)';
  const plaqueCx = box.x + box.w / 2;
  const plaqueCy = box.y + box.h - wall * 0.5;

  return {
    outerR,
    lumenX,
    lumenY,
    lumenW,
    lumenH,
    lumenR,
    lumenFill,
    pct,
    plaque: {
      visible: encrassement > 0,
      cx: plaqueCx,
      cy: plaqueCy,
      rx: plaqueRx,
      ry: plaqueRy,
      fill: plaqueFill,
    },
  };
}

export default function PlaqueArtere({
  encrassement,
  variante = 'artere',
  className,
}: PlaqueArtereProps) {
  const viewBox = variante === 'artere' ? ARTERE_VIEWBOX : PASTILLE_VIEWBOX;
  const box = variante === 'artere' ? ARTERE_BOX : PASTILLE_BOX;
  const geo = computeGeometry(encrassement, box);

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        role="img"
        aria-label={`Section d'artère : passage du sang à ${geo.pct}% de la lumière initiale`}
      >
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          rx={geo.outerR}
          className={styles.paroi}
        />
        <rect
          x={geo.lumenX}
          y={geo.lumenY}
          width={geo.lumenW}
          height={geo.lumenH}
          rx={geo.lumenR}
          className={styles.lumen}
          style={{ fill: geo.lumenFill }}
        />
        {geo.plaque.visible && (
          <ellipse
            cx={geo.plaque.cx}
            cy={geo.plaque.cy}
            rx={geo.plaque.rx}
            ry={geo.plaque.ry}
            className={styles.plaque}
            style={{ fill: geo.plaque.fill }}
          />
        )}
      </svg>
      {variante === 'artere' && (
        <p className={styles.hoverPct} aria-hidden="true">
          passage du sang : {geo.pct}%
        </p>
      )}
    </div>
  );
}
