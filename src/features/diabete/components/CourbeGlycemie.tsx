import { useState } from 'react';
import styles from './CourbeGlycemie.module.css';

/**
 * LA COURBE (brief §1.2) — identité graphique unique, réutilisée par les modules
 * 2 (aliment), 3 (activité), 8 (récupération), 9 (trace capteur). Ce composant ne
 * connaît AUCUN modèle physiologique : il reçoit des chemins SVG et des données déjà
 * calculées (par la lib `glycemieCurve` de S2, consommée par les modules — jamais par
 * ce fichier) et se contente de les dessiner, toujours avec le même repère et le même
 * style de trait. Ainsi le patient reconnaît « sa courbe » à chaque réapparition.
 *
 * Repère (fixé une fois pour toutes, sur le patron de `nicotineCurve`/`NicotineModule`) :
 * viewBox 640×262, marges GRAPH_X0/X1/Y_TOP/Y_BOTTOM. `courbes[].d` est un chemin SVG
 * exprimé dans le repère LOCAL du graphe (origine 0,0 = coin haut-gauche de la zone de
 * tracé, largeur = COURBE_GRAPH_WIDTH, hauteur = COURBE_GRAPH_HEIGHT) — cohérent avec
 * `toSvgPath(points, { width: COURBE_GRAPH_WIDTH, height: COURBE_GRAPH_HEIGHT })` côté
 * lib. `bandes.basseY`/`hauteY` partagent ce même repère local (0 = haut du tracé).
 * `marqueurs[].t` et `segments[].t0/t1` sont eux exprimés en fraction 0–1 du temps total
 * représenté (indépendant de l'échelle en minutes de chaque courbe : un module « 3 h »
 * et un module « 24 h » utilisent tous deux 0–1).
 */

export const COURBE_VIEWBOX_WIDTH = 640;
export const COURBE_VIEWBOX_HEIGHT = 262;
export const COURBE_GRAPH_X0 = 20;
export const COURBE_GRAPH_X1 = 620;
export const COURBE_GRAPH_Y_TOP = 20;
export const COURBE_GRAPH_Y_BOTTOM = 220;
export const COURBE_GRAPH_WIDTH = COURBE_GRAPH_X1 - COURBE_GRAPH_X0;
export const COURBE_GRAPH_HEIGHT = COURBE_GRAPH_Y_BOTTOM - COURBE_GRAPH_Y_TOP;

export type CourbeVariante = 'principale' | 'fantome' | 'estompee';

export interface CourbeDef {
  id: string;
  /** Chemin SVG dans le repère local du graphe (cf. en-tête du fichier). */
  d: string;
  label: string;
  /** Valeur mg/dL indicative, affichée uniquement au survol (2ᵉ niveau, jamais imposée). */
  mg?: string;
  variante: CourbeVariante;
}

export interface BandeCible {
  /** Bord bas de la bande-cible, en coordonnée locale du graphe (0 = haut du tracé). */
  basseY: number;
  /** Bord haut de la bande-cible, en coordonnée locale du graphe. */
  hauteY: number;
}

export type MarqueurType = 'repas' | 'activite' | 'resucrage' | 'attente';

export interface MarqueurDef {
  /** Instant de l'événement, en fraction 0–1 du temps total représenté. */
  t: number;
  type: MarqueurType;
  label: string;
  /** Durée de l'événement, en fraction 0–1 (rend une bande plutôt qu'un simple repère). */
  largeur?: number;
}

export interface SegmentDef {
  id: string;
  /** Début/fin de la plage cliquable, en fraction 0–1 du temps total. */
  t0: number;
  t1: number;
  label: string;
}

export interface CourbeGlycemieProps {
  courbes: CourbeDef[];
  bandes?: BandeCible;
  marqueurs?: MarqueurDef[];
  axeLabels?: string[];
  /** Affiche la légende mg/dL au survol/focus d'une courbe qui porte un `mg` (2ᵉ niveau). */
  hoverLegend?: boolean;
  segments?: SegmentDef[];
  onSegmentClick?: (id: string) => void;
}

const MARQUEUR_META: Record<MarqueurType, { glyph: string; colorVar: string }> = {
  repas: { glyph: 'R', colorVar: '--color-nav' },
  activite: { glyph: 'A', colorVar: '--color-confort' },
  resucrage: { glyph: 'S', colorVar: '--color-vigilance' },
  attente: { glyph: '…', colorVar: '--color-text-soft' },
};

const VARIANTE_CLASS: Record<CourbeVariante, string> = {
  principale: styles.courbePrincipale,
  fantome: styles.courbeFantome,
  estompee: styles.courbeEstompee,
};

function tToX(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return COURBE_GRAPH_X0 + clamped * COURBE_GRAPH_WIDTH;
}

export default function CourbeGlycemie({
  courbes,
  bandes,
  marqueurs,
  axeLabels,
  hoverLegend,
  segments,
  onSegmentClick,
}: CourbeGlycemieProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = hoveredId ? courbes.find((c) => c.id === hoveredId) : undefined;

  function handleSegmentKeyDown(e: React.KeyboardEvent, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSegmentClick?.(id);
    }
  }

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${COURBE_VIEWBOX_WIDTH} ${COURBE_VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Courbe de glycémie"
      >
        {bandes && (
          <g transform={`translate(${COURBE_GRAPH_X0},${COURBE_GRAPH_Y_TOP})`}>
            <rect
              x={0}
              y={0}
              width={COURBE_GRAPH_WIDTH}
              height={bandes.hauteY}
              className="zone-fill--toxique"
            />
            <rect
              x={0}
              y={bandes.hauteY}
              width={COURBE_GRAPH_WIDTH}
              height={Math.max(0, bandes.basseY - bandes.hauteY)}
              className="zone-fill--confort"
            />
            <rect
              x={0}
              y={bandes.basseY}
              width={COURBE_GRAPH_WIDTH}
              height={Math.max(0, COURBE_GRAPH_HEIGHT - bandes.basseY)}
              className="zone-fill--vigilance"
            />
          </g>
        )}

        <line
          x1={COURBE_GRAPH_X0}
          y1={COURBE_GRAPH_Y_BOTTOM}
          x2={COURBE_GRAPH_X1}
          y2={COURBE_GRAPH_Y_BOTTOM}
          className={styles.baseline}
        />

        {segments?.map((seg) => (
          <rect
            key={seg.id}
            x={tToX(seg.t0)}
            y={COURBE_GRAPH_Y_TOP}
            width={Math.max(0, tToX(seg.t1) - tToX(seg.t0))}
            height={COURBE_GRAPH_HEIGHT}
            className={styles.segment}
            tabIndex={onSegmentClick ? 0 : undefined}
            role={onSegmentClick ? 'button' : undefined}
            aria-label={seg.label}
            onClick={() => onSegmentClick?.(seg.id)}
            onKeyDown={(e) => handleSegmentKeyDown(e, seg.id)}
          />
        ))}

        <g transform={`translate(${COURBE_GRAPH_X0},${COURBE_GRAPH_Y_TOP})`}>
          {courbes.map((c) => {
            const interactive = !!(hoverLegend && c.mg);
            return (
              <g
                key={c.id}
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? 'button' : undefined}
                aria-label={interactive ? `${c.label} : valeurs au survol` : undefined}
                onMouseEnter={interactive ? () => setHoveredId(c.id) : undefined}
                onMouseLeave={interactive ? () => setHoveredId(null) : undefined}
                onFocus={interactive ? () => setHoveredId(c.id) : undefined}
                onBlur={interactive ? () => setHoveredId(null) : undefined}
                className={interactive ? styles.courbeHit : undefined}
              >
                {interactive && (
                  <path d={c.d} className={styles.courbeHitStroke} fill="none" />
                )}
                <path d={c.d} className={VARIANTE_CLASS[c.variante]} fill="none" />
              </g>
            );
          })}
        </g>

        {marqueurs?.map((m, i) => {
          const meta = MARQUEUR_META[m.type];
          const x0 = tToX(m.t);
          const x1 = m.largeur !== undefined ? tToX(m.t + m.largeur) : x0;
          const badgeY = COURBE_GRAPH_Y_BOTTOM + 22;
          return (
            <g key={`${m.type}-${m.t}-${i}`}>
              {m.largeur !== undefined && x1 > x0 && (
                <rect
                  x={x0}
                  y={COURBE_GRAPH_Y_TOP}
                  width={x1 - x0}
                  height={COURBE_GRAPH_HEIGHT}
                  className={styles.marqueurBande}
                  style={{ '--marqueur-color': `var(${meta.colorVar})` } as React.CSSProperties}
                />
              )}
              <line
                x1={x0}
                y1={COURBE_GRAPH_Y_TOP}
                x2={x0}
                y2={COURBE_GRAPH_Y_BOTTOM + 8}
                className={styles.marqueurGuide}
                style={{ stroke: `var(${meta.colorVar})` } as React.CSSProperties}
              />
              <circle
                cx={x0}
                cy={badgeY}
                r={12}
                fill={`var(${meta.colorVar})`}
                className={styles.marqueurBadge}
              />
              <text x={x0} y={badgeY + 4} textAnchor="middle" className={styles.marqueurGlyph}>
                {meta.glyph}
              </text>
              <text x={x0} y={badgeY + 26} textAnchor="middle" className={styles.marqueurLabel}>
                {m.label}
              </text>
            </g>
          );
        })}

        {axeLabels?.map((label, i) => {
          const n = axeLabels.length;
          const x = n <= 1 ? COURBE_GRAPH_X0 : COURBE_GRAPH_X0 + (i / (n - 1)) * COURBE_GRAPH_WIDTH;
          const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
          return (
            <text
              key={`${label}-${i}`}
              x={x}
              y={COURBE_VIEWBOX_HEIGHT - 8}
              textAnchor={anchor}
              className={styles.axisTick}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {hovered?.mg && (
        <div className={styles.legend} role="status">
          <p className={styles.legendTitle}>{hovered.label}</p>
          <p className={styles.legendValue}>{hovered.mg}</p>
        </div>
      )}
    </div>
  );
}
