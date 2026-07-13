import { useState } from 'react';
import { Utensils, Syringe, type LucideIcon } from 'lucide-react';
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

export type CourbeVariante = 'principale' | 'fantome' | 'estompee' | 'duoA' | 'duoB';

/**
 * Couleurs d'identité du duo (défi ② alimentation, S2 2026-07-09) — même valeur que les
 * classes CSS `.courbeDuoA`/`.courbeDuoB` de `CourbeGlycemie.module.css` (à garder en
 * synchronisation manuelle, `duoB` n'est PAS un token global). Exporté pour que les
 * modules consommateurs (ex. S3) puissent teinter des éléments assortis (cartes, badges)
 * sans dupliquer la valeur prune.
 */
export const DUO_CSS_COLOR: Record<'duoA' | 'duoB', string> = {
  duoA: 'var(--color-nav)',
  duoB: 'oklch(50% 0.11 330)',
};

export interface CourbeDef {
  id: string;
  /** Chemin SVG dans le repère local du graphe (cf. en-tête du fichier). */
  d: string;
  label: string;
  /** Valeur mg/dL indicative, affichée uniquement au survol (2ᵉ niveau, jamais imposée). */
  mg?: string;
  variante: CourbeVariante;
  /**
   * Sommet de la courbe, coordonnées LOCALES du graphe (même repère que `d`). Optionnel :
   * si présent, un marqueur de pic est dessiné. Le composant reste bête — c'est le module
   * consommateur qui calcule le pic (il a les points échantillonnés).
   */
  picAt?: { x: number; y: number };
  /** Étiquette nominative posée près du pic (nécessite `picAt` pour être rendue). */
  etiquette?: string;
}

export interface BandeCible {
  /** Bord bas de la bande-cible, en coordonnée locale du graphe (0 = haut du tracé). */
  basseY: number;
  /** Bord haut de la bande-cible, en coordonnée locale du graphe. */
  hauteY: number;
}

/** Convertit une bande-cible exprimée dans l'échelle 0–100 de `glycemieCurve` (`levelMax`,
 *  défaut `LEVEL_MAX`) en coordonnées locales du graphe (`BandeCible`) — même repère que
 *  `toSvgPath`. Utilitaire partagé (ex-`insuline/scenarios.ts`, S2 corrections-visuelles). */
export function bandeToY(bande: { basse: number; haute: number }, levelMax = 100): BandeCible {
  return {
    hauteY: COURBE_GRAPH_HEIGHT - (bande.haute / levelMax) * COURBE_GRAPH_HEIGHT,
    basseY: COURBE_GRAPH_HEIGHT - (bande.basse / levelMax) * COURBE_GRAPH_HEIGHT,
  };
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
  /**
   * Anime le tracé de chaque courbe au montage (~900 ms, ease-out) via `pathLength`/
   * `stroke-dashoffset`. Les marqueurs de pic et étiquettes apparaissent en fondu après
   * le tracé. Respecte `prefers-reduced-motion: reduce` (pas d'animation). Les
   * consommateurs déclenchent l'effet en montant le composant au moment voulu.
   */
  animerTrace?: boolean;
}

const MARQUEUR_META: Record<MarqueurType, { glyph: string; colorVar: string; icone?: LucideIcon }> = {
  repas: { glyph: 'R', colorVar: '--color-nav', icone: Utensils },
  activite: { glyph: 'A', colorVar: '--color-confort', icone: Syringe },
  resucrage: { glyph: 'S', colorVar: '--color-vigilance' },
  attente: { glyph: '…', colorVar: '--color-text-soft' },
};

const VARIANTE_CLASS: Record<CourbeVariante, string> = {
  principale: styles.courbePrincipale,
  fantome: styles.courbeFantome,
  estompee: styles.courbeEstompee,
  duoA: styles.courbeDuoA,
  duoB: styles.courbeDuoB,
};

/** Couleur (valeur CSS) de chaque variante — pour les éléments qui ne peuvent pas hériter
 * du `stroke` de la classe (marqueur de pic en `fill`, étiquette en `fill`). */
const VARIANTE_COLOR: Record<CourbeVariante, string> = {
  principale: 'var(--color-text)',
  fantome: 'var(--color-text-soft)',
  estompee: 'var(--color-text-faint)',
  duoA: DUO_CSS_COLOR.duoA,
  duoB: DUO_CSS_COLOR.duoB,
};

/** ~24 px verticaux et ~120 px horizontaux : seuil de collision entre deux ancres d'étiquette. */
const ETIQUETTE_COLLISION_DY = 24;
const ETIQUETTE_COLLISION_DX = 120;
const ETIQUETTE_MARGIN_X = 6;

function tToX(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return COURBE_GRAPH_X0 + clamped * COURBE_GRAPH_WIDTH;
}

/**
 * Anti-collision minimal (pas de moteur de layout) : place chaque étiquette au-dessus de
 * son point de pic, sauf si une étiquette déjà placée a une ancre trop proche (< 24 px
 * verticaux ET < 120 px horizontaux), auquel cas elle passe au-dessous.
 */
function computeEtiquettePlacements(courbes: CourbeDef[]): Map<string, 'above' | 'below'> {
  const placements = new Map<string, 'above' | 'below'>();
  const withEtiquette = courbes.filter((c): c is CourbeDef & { picAt: { x: number; y: number } } =>
    !!c.picAt && !!c.etiquette
  );
  withEtiquette.forEach((c, i) => {
    let place: 'above' | 'below' = 'above';
    for (let j = 0; j < i; j++) {
      const other = withEtiquette[j];
      const dx = Math.abs(c.picAt.x - other.picAt.x);
      const dy = Math.abs(c.picAt.y - other.picAt.y);
      if (dx < ETIQUETTE_COLLISION_DX && dy < ETIQUETTE_COLLISION_DY) {
        place = 'below';
        break;
      }
    }
    placements.set(c.id, place);
  });
  return placements;
}

export default function CourbeGlycemie({
  courbes,
  bandes,
  marqueurs,
  axeLabels,
  hoverLegend,
  segments,
  onSegmentClick,
  animerTrace,
}: CourbeGlycemieProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = hoveredId ? courbes.find((c) => c.id === hoveredId) : undefined;
  const etiquettePlacements = computeEtiquettePlacements(courbes);

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
                <path
                  d={c.d}
                  className={`${VARIANTE_CLASS[c.variante]} ${animerTrace ? styles.traceAnimee : ''}`}
                  fill="none"
                  pathLength={animerTrace ? 1 : undefined}
                />
              </g>
            );
          })}

          {courbes.map((c) => {
            if (!c.picAt) return null;
            const color = VARIANTE_COLOR[c.variante];
            const place = c.etiquette ? etiquettePlacements.get(c.id) ?? 'above' : undefined;
            const etiquetteX = Math.min(
              COURBE_GRAPH_WIDTH - ETIQUETTE_MARGIN_X,
              Math.max(ETIQUETTE_MARGIN_X, c.picAt.x)
            );
            const etiquetteY = place === 'below' ? c.picAt.y + 22 : c.picAt.y - 14;
            const etiquetteAnchor =
              etiquetteX < ETIQUETTE_COLLISION_DX / 2
                ? 'start'
                : etiquetteX > COURBE_GRAPH_WIDTH - ETIQUETTE_COLLISION_DX / 2
                  ? 'end'
                  : 'middle';
            return (
              <g
                key={`pic-${c.id}`}
                className={animerTrace ? styles.picFade : undefined}
              >
                <circle cx={c.picAt.x} cy={c.picAt.y} r={11} style={{ fill: color }} className={styles.picHalo} />
                <circle cx={c.picAt.x} cy={c.picAt.y} r={5} style={{ fill: color }} className={styles.picDot} />
                {c.etiquette && (
                  <text
                    x={etiquetteX}
                    y={etiquetteY}
                    textAnchor={etiquetteAnchor}
                    style={{ fill: color }}
                    className={styles.etiquette}
                  >
                    {c.etiquette}
                  </text>
                )}
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
            <g key={`${m.type}-${m.t}-${i}`} aria-label={m.label}>
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
                r={13}
                fill={`var(${meta.colorVar})`}
                className={styles.marqueurBadge}
              />
              {meta.icone ? (
                <meta.icone
                  x={x0 - 8}
                  y={badgeY - 8}
                  width={16}
                  height={16}
                  color="var(--color-surface)"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <text x={x0} y={badgeY + 4} textAnchor="middle" className={styles.marqueurGlyph} aria-hidden="true">
                  {meta.glyph}
                </text>
              )}
              <text x={x0} y={badgeY + 27} textAnchor="middle" className={styles.marqueurLabel}>
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
