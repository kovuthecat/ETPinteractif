import { useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import type { ModuleProps } from '../../types';
import {
  sampleCurve,
  classifyZone,
  toSvgPath,
  TIME_MAX,
  LEVEL_MAX,
  ZONE_THRESHOLD_LOW,
  ZONE_THRESHOLD_HIGH,
  type NicotineEventType,
  type NicotineZone,
} from '../lib/nicotineCurve';
import styles from './NicotineModule.module.css';

// Repère du graphe : viewBox 720×420, marges GX0/GX1/GY_TOP/GY_BOT. Tout ce qui
// dépend de ces bornes (bandes, courbe, marqueurs, axe) se recalcule à partir
// d'elles — seule la mise à l'échelle visuelle change, pas le modèle de
// `nicotineCurve.ts` (mapping valeur → pixel toujours linéaire, cf. levelToY).
const VB_WIDTH = 720;
const VB_HEIGHT = 420;
const GX0 = 28;
const GX1 = 692;
const GY_TOP = 28;
const GY_BOT = 344;
const GRAPH_W = GX1 - GX0;
const GRAPH_H = GY_BOT - GY_TOP;

// Repère de la zone « pied » du graphe (marqueurs, doses, axe temporel), sous GY_BOT.
const GUIDE_BOTTOM = GY_BOT + 4;
const DOSE_LABEL_Y = GY_BOT - 6;
const PATCH_BASE_Y = GY_BOT + 12;
const MARKER_CY = GY_BOT + 28;
const AXIS_Y = GY_BOT + 58;
const PATCH_HIT_Y = DOSE_LABEL_Y - 9;
const PATCH_HIT_H = 74;

type Marker = { id: number; type: NicotineEventType; time: number; dose?: number };

const TOOLS: { type: NicotineEventType; label: string; colorVar: string; colorSoftVar: string }[] = [
  { type: 'cigarette', label: 'Cigarette', colorVar: '--color-toxique', colorSoftVar: '--color-toxique-soft' },
  { type: 'patch', label: 'Patch', colorVar: '--color-confort', colorSoftVar: '--color-confort-soft' },
  { type: 'substitut', label: 'Substitut', colorVar: '--color-nav', colorSoftVar: '--color-nav-soft' },
];

const TOOL_META = Object.fromEntries(TOOLS.map((t) => [t.type, t])) as Record<
  NicotineEventType,
  (typeof TOOLS)[number]
>;

type HoverZone = 'manque' | 'surdosage';

const ZONE_TOOLTIP: Record<HoverZone, { title: string; signs: string[] }> = {
  manque: {
    title: 'Signes de manque',
    signs: ['Irritabilité', 'Nervosité', 'Troubles de la concentration', 'Troubles du sommeil', 'Fringales', 'Craving'],
  },
  surdosage: {
    title: 'Signes de surdosage',
    signs: ['Nausées', 'Écœurement', 'Céphalées', 'Palpitations', 'Rêves intenses'],
  },
};

const ZONE_META: Record<
  NicotineZone,
  { label: string; chipClass: string; fillClass: string; labelClass: string; accentVar: string; Icon: LucideIcon }
> = {
  manque: {
    label: 'Manque',
    chipClass: 'chip--vigilance',
    fillClass: 'zone-fill--vigilance',
    labelClass: 'zone-label--vigilance',
    accentVar: '--color-vigilance',
    Icon: AlertTriangle,
  },
  confort: {
    label: 'Confort',
    chipClass: 'chip--confort',
    fillClass: 'zone-fill--confort',
    labelClass: 'zone-label--confort',
    accentVar: '--color-confort-strong',
    Icon: CheckCircle2,
  },
  surdosage: {
    label: 'Surdosage',
    chipClass: 'chip--toxique',
    fillClass: 'zone-fill--toxique',
    labelClass: 'zone-label--toxique',
    accentVar: '--color-toxique',
    Icon: AlertTriangle,
  },
};

function timeToX(t: number): number {
  return GX0 + (t / TIME_MAX) * GRAPH_W;
}

function levelToY(level: number): number {
  const clamped = Math.min(LEVEL_MAX, Math.max(0, level));
  return GY_BOT - (clamped / LEVEL_MAX) * GRAPH_H;
}

function formatDose(dose: number): string {
  const n = Math.round(dose * 4);
  if (n % 4 === 0) return `×${n / 4}`;
  return `×${(n / 4).toFixed(2).replace(/0$/, '')}`;
}

/** Grille de carrés (quarts de dose) pour un marqueur patch, positionnée autour de x. */
function patchCells(x: number, dose: number, color: string) {
  const cellSize = 10;
  const cellGap = 1;
  const squareGap = 5;
  const squareSize = 2 * cellSize + cellGap;
  const quarterUnits = Math.round(dose * 4);
  const totalSquares = Math.max(1, Math.ceil(quarterUnits / 4));
  const totalW = totalSquares * squareSize + (totalSquares - 1) * squareGap;
  const startX = x - totalW / 2;
  const baseY = PATCH_BASE_Y;
  const cells: { key: string; x: number; y: number; filled: boolean }[] = [];
  for (let s = 0; s < totalSquares; s++) {
    for (let p = 0; p < 4; p++) {
      const idx = s * 4 + p;
      const filled = idx < quarterUnits;
      const row = Math.floor(p / 2);
      const col = p % 2;
      const cx = startX + s * (squareSize + squareGap) + col * (cellSize + cellGap);
      const cy = baseY + row * (cellSize + cellGap);
      cells.push({ key: `${s}-${p}`, x: cx, y: cy, filled });
    }
  }
  return { cells, cellSize, totalW, color };
}

export default function NicotineModule(_props: ModuleProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(0);
  const [tool, setTool] = useState<NicotineEventType>('cigarette');
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [hoverZone, setHoverZone] = useState<HoverZone | null>(null);

  const events = useMemo(
    () => markers.map(({ type, time, dose }) => ({ type, time, dose })),
    [markers],
  );
  const curveLevels = useMemo(() => sampleCurve({ events }), [events]);
  const curvePath = useMemo(
    () => toSvgPath(curveLevels, { width: GRAPH_W, height: GRAPH_H }),
    [curveLevels],
  );
  const areaPath = curvePath ? `${curvePath} L${GRAPH_W},${GRAPH_H} L0,${GRAPH_H} Z` : '';
  const peakLevel = curveLevels.reduce((max, v) => Math.max(max, v), 0);
  const peakZone = classifyZone(peakLevel);
  const peakMeta = ZONE_META[peakZone];
  const PeakIcon = peakMeta.Icon;

  const yHigh = levelToY(ZONE_THRESHOLD_HIGH);
  const yLow = levelToY(ZONE_THRESHOLD_LOW);

  // Pastilles de zone : centrées dans chaque bande réelle (dépend des seuils, pas
  // de valeurs à demeure), avec une largeur adaptée à la longueur du libellé.
  const surdosagePill = { x: 36, y: (GY_TOP + yHigh) / 2 - 12, w: 116, h: 24 };
  const confortPill = { x: 36, y: (yHigh + yLow) / 2 - 12, w: 168, h: 24 };
  const manquePill = { x: 36, y: (yLow + GY_BOT) / 2 - 12, w: 92, h: 24 };

  function timeFromClientX(clientX: number): number {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = VB_WIDTH / rect.width;
    const vx = (clientX - rect.left) * scaleX;
    let t = ((vx - GX0) / GRAPH_W) * TIME_MAX;
    t = Math.max(0, Math.min(TIME_MAX, t));
    return Math.round(t * 4) / 4;
  }

  function handleGraphClick(e: React.MouseEvent<SVGSVGElement>) {
    const time = timeFromClientX(e.clientX);
    const dose = tool === 'patch' ? 1 : undefined;
    setMarkers((prev) => [...prev, { id: nextId.current++, type: tool, time, dose }]);
  }

  function removeMarker(id: number, e: React.SyntheticEvent) {
    e.stopPropagation();
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  }

  function removeMarkerKey(id: number, e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setMarkers((prev) => prev.filter((m) => m.id !== id));
    }
  }

  function adjustDose(id: number, delta: number, e: React.SyntheticEvent) {
    e.stopPropagation();
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, dose: Math.max(0.25, Math.min(4, Math.round(((m.dose ?? 1) + delta) * 4) / 4)) } : m,
      ),
    );
  }

  function reset() {
    setMarkers([]);
  }

  return (
    <div className={styles.module}>
      <p className={styles.consigne}>
        Choisissez un outil, puis cliquez sur la frise pour placer un événement à cet instant. Observez comment
        le taux de nicotine traverse les trois zones.
      </p>

      <div className={styles.toolbar}>
        {TOOLS.map((t) => (
          <button
            key={t.type}
            type="button"
            className={`btn ${styles.toolBtn} ${tool === t.type ? styles.toolBtnActive : ''}`}
            style={{ '--tool-color': `var(${t.colorVar})`, '--tool-color-soft': `var(${t.colorSoftVar})` } as React.CSSProperties}
            aria-pressed={tool === t.type}
            onClick={() => setTool(t.type)}
          >
            <span className={styles.toolDot} aria-hidden="true" />
            {t.label}
          </button>
        ))}
        {markers.length > 0 && (
          <button type="button" className={`btn btn--tertiary ${styles.resetBtn}`} onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className={`card ${styles.graphCard}`}>
        <div className={styles.graphWrap}>
        <svg
          ref={svgRef}
          className={styles.graphSvg}
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          role="img"
          aria-label="Taux de nicotine sur 24 h selon les événements placés (échelle illustrative)"
          onClick={handleGraphClick}
        >
          <defs>
            <clipPath id="nicotinePlotClip">
              <rect x={GX0} y={GY_TOP} width={GRAPH_W} height={GRAPH_H} rx={20} />
            </clipPath>
            <linearGradient id="nicotineSheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.32} />
              <stop offset="45%" stopColor="#ffffff" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <filter id="nicotineMarkerShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="rgba(40,30,20,0.35)" />
            </filter>
          </defs>

          <g clipPath="url(#nicotinePlotClip)">
            <rect x={GX0} y={GY_TOP} width={GRAPH_W} height={yHigh - GY_TOP} className={ZONE_META.surdosage.fillClass} />
            <rect x={GX0} y={yHigh} width={GRAPH_W} height={yLow - yHigh} className={ZONE_META.confort.fillClass} />
            <rect x={GX0} y={yLow} width={GRAPH_W} height={GY_BOT - yLow} className={ZONE_META.manque.fillClass} />
            <rect x={GX0} y={GY_TOP} width={GRAPH_W} height={GRAPH_H} fill="url(#nicotineSheen)" className={styles.sheen} />
          </g>

          <line x1={GX0} y1={yHigh} x2={GX1} y2={yHigh} className={styles.seuil} />
          <line x1={GX0} y1={yLow} x2={GX1} y2={yLow} className={styles.seuil} />

          {markers.map((m) => (
            <line
              key={`guide-${m.id}`}
              x1={timeToX(m.time)}
              y1={GY_TOP}
              x2={timeToX(m.time)}
              y2={GUIDE_BOTTOM}
              stroke={`var(${TOOL_META[m.type].colorVar})`}
              className={styles.guideLine}
            />
          ))}

          <g transform={`translate(${GX0},${GY_TOP})`}>
            {areaPath && <path d={areaPath} className={styles.curveArea} />}
            <path d={curvePath} className={styles.curve} />
          </g>

          <g
            className={styles.zoneLabelHit}
            tabIndex={0}
            role="button"
            aria-label="Signes de surdosage"
            onMouseEnter={() => setHoverZone('surdosage')}
            onMouseLeave={() => setHoverZone(null)}
            onFocus={() => setHoverZone('surdosage')}
            onBlur={() => setHoverZone(null)}
          >
            <rect
              x={surdosagePill.x}
              y={surdosagePill.y}
              width={surdosagePill.w}
              height={surdosagePill.h}
              rx={surdosagePill.h / 2}
              className={styles.zonePill}
              style={{ stroke: `var(${ZONE_META.surdosage.accentVar})` }}
            />
            <text
              x={surdosagePill.x + 14}
              y={surdosagePill.y + 16}
              className={`${ZONE_META.surdosage.labelClass} ${styles.zonePillText}`}
            >
              Surdosage
            </text>
          </g>
          <g>
            <rect
              x={confortPill.x}
              y={confortPill.y}
              width={confortPill.w}
              height={confortPill.h}
              rx={confortPill.h / 2}
              className={styles.zonePill}
              style={{ stroke: `var(${ZONE_META.confort.accentVar})` }}
            />
            <text
              x={confortPill.x + 14}
              y={confortPill.y + 16}
              className={`${ZONE_META.confort.labelClass} ${styles.zonePillText}`}
            >
              Zone de confort
            </text>
          </g>
          <g
            className={styles.zoneLabelHit}
            tabIndex={0}
            role="button"
            aria-label="Signes de manque"
            onMouseEnter={() => setHoverZone('manque')}
            onMouseLeave={() => setHoverZone(null)}
            onFocus={() => setHoverZone('manque')}
            onBlur={() => setHoverZone(null)}
          >
            <rect
              x={manquePill.x}
              y={manquePill.y}
              width={manquePill.w}
              height={manquePill.h}
              rx={manquePill.h / 2}
              className={styles.zonePill}
              style={{ stroke: `var(${ZONE_META.manque.accentVar})` }}
            />
            <text
              x={manquePill.x + 14}
              y={manquePill.y + 16}
              className={`${ZONE_META.manque.labelClass} ${styles.zonePillText}`}
            >
              Manque
            </text>
          </g>

          {markers.map((m) => {
            const x = timeToX(m.time);
            const meta = TOOL_META[m.type];
            const color = `var(${meta.colorVar})`;
            const label = m.type === 'cigarette' ? 'Cigarette' : m.type === 'patch' ? 'Patch' : 'Substitut';

            if (m.type === 'patch') {
              const { cells, cellSize, totalW } = patchCells(x, m.dose ?? 1, color);
              const xMinus = x - totalW / 2 - 18;
              const xPlus = x + totalW / 2 + 18;
              const cellsHitWidth = Math.max(44, totalW + 8);
              return (
                <g key={m.id}>
                  <title>{`Patch ${formatDose(m.dose ?? 1)} — posé à ${m.time}h`}</title>
                  <text x={x} y={DOSE_LABEL_Y} textAnchor="middle" className={styles.doseLabel} style={{ fill: color }}>
                    {formatDose(m.dose ?? 1)}
                  </text>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Retirer : ${label} ${formatDose(m.dose ?? 1)} à ${m.time}h`}
                    className={styles.marker}
                    onClick={(e) => removeMarker(m.id, e)}
                    onKeyDown={(e) => removeMarkerKey(m.id, e)}
                  >
                    <rect x={x - cellsHitWidth / 2} y={PATCH_HIT_Y} width={cellsHitWidth} height={PATCH_HIT_H} fill="transparent" />
                    {cells.map((cell) => (
                      <rect
                        key={cell.key}
                        x={cell.x}
                        y={cell.y}
                        width={cellSize}
                        height={cellSize}
                        rx={2}
                        fill={cell.filled ? color : '#ffffff'}
                        stroke={color}
                        strokeWidth={cell.filled ? 0 : 1.3}
                        filter={cell.filled ? 'url(#nicotineMarkerShadow)' : undefined}
                      />
                    ))}
                  </g>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Réduire la dose de ¼ (${label} à ${m.time}h)`}
                    className={styles.doseBtn}
                    onClick={(e) => adjustDose(m.id, -0.25, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        adjustDose(m.id, -0.25, e);
                      }
                    }}
                  >
                    <rect x={xMinus - 22} y={MARKER_CY - 22} width={44} height={44} fill="transparent" />
                    <circle cx={xMinus} cy={MARKER_CY} r={11} fill="#fff" stroke={color} strokeWidth={1.5} filter="url(#nicotineMarkerShadow)" />
                    <text x={xMinus} y={MARKER_CY + 4} textAnchor="middle" className={styles.doseBtnGlyph} style={{ fill: color }}>
                      −
                    </text>
                  </g>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Augmenter la dose de ¼ (${label} à ${m.time}h)`}
                    className={styles.doseBtn}
                    onClick={(e) => adjustDose(m.id, 0.25, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        adjustDose(m.id, 0.25, e);
                      }
                    }}
                  >
                    <rect x={xPlus - 22} y={MARKER_CY - 22} width={44} height={44} fill="transparent" />
                    <circle cx={xPlus} cy={MARKER_CY} r={11} fill="#fff" stroke={color} strokeWidth={1.5} filter="url(#nicotineMarkerShadow)" />
                    <text x={xPlus} y={MARKER_CY + 4} textAnchor="middle" className={styles.doseBtnGlyph} style={{ fill: color }}>
                      +
                    </text>
                  </g>
                </g>
              );
            }

            return (
              <g
                key={m.id}
                role="button"
                tabIndex={0}
                aria-label={`Retirer : ${label} à ${m.time}h`}
                className={styles.marker}
                onClick={(e) => removeMarker(m.id, e)}
                onKeyDown={(e) => removeMarkerKey(m.id, e)}
              >
                <title>{`${label} — ${m.time}h`}</title>
                <rect x={x - 22} y={MARKER_CY - 22} width={44} height={44} fill="transparent" />
                <circle cx={x} cy={MARKER_CY} r={15} fill={color} filter="url(#nicotineMarkerShadow)" />
                <text x={x} y={m.type === 'cigarette' ? MARKER_CY + 4.5 : MARKER_CY + 4} textAnchor="middle" className={styles.markerGlyph}>
                  {m.type === 'cigarette' ? '🚬' : 'S'}
                </text>
              </g>
            );
          })}

          <text x={GX0} y={AXIS_Y} className={styles.axisTick}>
            0h
          </text>
          <text x={timeToX(6)} y={AXIS_Y} textAnchor="middle" className={styles.axisTick}>
            6h
          </text>
          <text x={timeToX(12)} y={AXIS_Y} textAnchor="middle" className={styles.axisTick}>
            12h
          </text>
          <text x={timeToX(18)} y={AXIS_Y} textAnchor="middle" className={styles.axisTick}>
            18h
          </text>
          <text x={GX1} y={AXIS_Y} textAnchor="end" className={styles.axisTick}>
            24h
          </text>
        </svg>
        {hoverZone && (
          <div
            className={styles.zoneTooltip}
            style={
              hoverZone === 'surdosage'
                ? {
                    left: `${((surdosagePill.x / VB_WIDTH) * 100).toFixed(1)}%`,
                    top: `${(((surdosagePill.y + surdosagePill.h) / VB_HEIGHT) * 100).toFixed(1)}%`,
                    transform: 'translateY(8px)',
                  }
                : {
                    left: `${((manquePill.x / VB_WIDTH) * 100).toFixed(1)}%`,
                    top: `${((manquePill.y / VB_HEIGHT) * 100).toFixed(1)}%`,
                    transform: 'translateY(calc(-100% - 8px))',
                  }
            }
          >
            <p className={styles.zoneTooltipTitle}>{ZONE_TOOLTIP[hoverZone].title}</p>
            <ul className={styles.zoneTooltipList}>
              {ZONE_TOOLTIP[hoverZone].signs.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
          </div>
        )}
        </div>
        <p className={styles.hint}>Cliquez sur un marqueur pour le retirer</p>
      </div>

      <p
        className={`chip ${peakMeta.chipClass}`}
        aria-live="polite"
        aria-label={`Pic atteint : ${peakMeta.label}`}
      >
        <PeakIcon size={16} aria-hidden="true" />
        Pic atteint : {peakMeta.label}
      </p>

      <p className={styles.mention}>Schéma illustratif — pas une courbe pharmacocinétique réelle.</p>

      <p className="filrouge">
        C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se traite.
      </p>
    </div>
  );
}
