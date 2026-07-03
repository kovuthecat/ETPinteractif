import { useId, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Bandage, CheckCircle2, Cigarette, Pill, RotateCcw, Wind, X } from 'lucide-react';
import type { ModuleProps } from '../types';
import {
  sampleCurve,
  classifyZone,
  THRESHOLD_LOW,
  THRESHOLD_HIGH,
  type CurveEvent,
  type Zone,
} from '../../lib/nicotineCurve';
import styles from './NicotineModule.module.css';

const WIDTH = 600;
const HEIGHT = 280;
const AXIS_GAP = 28;
const VIEW_HEIGHT = HEIGHT + AXIS_GAP;
const N = 120;

const FIRST_EVENT_T = 0.08;
const EVENT_STEP = 0.05;
const MAX_EVENT_T = 0.92;

const EVENTS_DEF: { kind: CurveEvent['kind']; label: string; Icon: LucideIcon }[] = [
  { kind: 'cigarette', label: 'Fumer une cigarette', Icon: Cigarette },
  { kind: 'ponctuel', label: 'Substitut ponctuel', Icon: Pill },
  { kind: 'vapoteuse', label: 'Vapoteuse', Icon: Wind },
  { kind: 'patch', label: 'Poser un patch', Icon: Bandage },
];

const ZONE_LABEL: Record<Zone, string> = {
  manque: 'Manque',
  confort: 'Confort',
  haut: 'Trop haut',
};

const ZONE_ICON: Record<Zone, LucideIcon> = {
  manque: AlertTriangle,
  confort: CheckCircle2,
  haut: AlertTriangle,
};

const ZONE_STROKE_CLASS: Record<Zone, string> = {
  manque: styles.courbeToxique,
  confort: styles.courbeConfort,
  haut: styles.courbeToxique,
};

const ZONE_CHIP_CLASS: Record<Zone, string> = {
  manque: styles.chipToxique,
  confort: styles.chipConfort,
  haut: styles.chipToxique,
};

const BAND_CLASS: Record<Zone, string> = {
  manque: styles.bandToxique,
  confort: styles.bandConfort,
  haut: styles.bandToxique,
};

function nextEventTime(events: CurveEvent[]): number {
  return Math.min(MAX_EVENT_T, FIRST_EVENT_T + events.length * EVENT_STEP);
}

function segmentPath(points: string[]): string {
  const [first, ...rest] = points;
  return rest.length > 0 ? `M${first} L${rest.join(' ')}` : `M${first}`;
}

function areaPath(points: string[]): string {
  if (points.length === 0) return '';
  const x0 = points[0].split(',')[0];
  const xLast = points[points.length - 1].split(',')[0];
  return `M${x0},${HEIGHT} L${points.join(' L')} L${xLast},${HEIGHT} Z`;
}

function buildZoneSegments(ys: number[]): { zone: Zone; points: string[] }[] {
  if (ys.length === 0) return [];
  const point = (i: number) => {
    const x = ys.length === 1 ? 0 : (i / (ys.length - 1)) * WIDTH;
    return `${x},${(1 - ys[i]) * HEIGHT}`;
  };
  const segments: { zone: Zone; points: string[] }[] = [];
  let zone = classifyZone(ys[0]);
  let points = [point(0)];
  for (let i = 1; i < ys.length; i++) {
    const z = classifyZone(ys[i]);
    if (z !== zone) {
      points.push(point(i));
      segments.push({ zone, points });
      zone = z;
      points = [point(i - 1), point(i)];
    } else {
      points.push(point(i));
    }
  }
  segments.push({ zone, points });
  return segments;
}

export default function NicotineModule(_: ModuleProps) {
  const gradId = useId();
  const [events, setEvents] = useState<CurveEvent[]>([]);
  // dropX : position en fraction [0,1] du repère fantôme pendant le drag ; null = pas de drag actif
  const [dropX, setDropX] = useState<number | null>(null);
  // dragKind : kind en cours de drag (ref pour éviter re-render au dragstart)
  const dragKindRef = useRef<CurveEvent['kind'] | null>(null);
  // Ref sur le SVG pour calculer les coordonnées relatives au drop
  const svgRef = useRef<SVGSVGElement>(null);

  const ys = useMemo(() => sampleCurve({ patch: false, events, n: N }), [events]);
  const zoneSegments = useMemo(() => buildZoneSegments(ys), [ys]);

  const peakIndex = ys.reduce((best, y, i) => (y > ys[best] ? i : best), 0);
  const currentZone = classifyZone(ys[peakIndex]);
  const ZoneIcon = ZONE_ICON[currentZone];

  const lowY = (1 - THRESHOLD_LOW) * HEIGHT;
  const highY = (1 - THRESHOLD_HIGH) * HEIGHT;

  /** Fallback clavier/clic : ajoute au temps suivant automatique */
  function addEvent(kind: CurveEvent['kind']) {
    setEvents((prev) => [...prev, { kind, t: nextEventTime(prev) }]);
  }

  /** Calcule t ∈ [FIRST_EVENT_T, MAX_EVENT_T] depuis clientX sur le SVG */
  function tFromClientX(clientX: number): number {
    if (!svgRef.current) return FIRST_EVENT_T;
    const rect = svgRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    return Math.max(FIRST_EVENT_T, Math.min(MAX_EVENT_T, raw));
  }

  function reset() {
    setEvents([]);
  }

  function removeEvent(index: number) {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Handlers drag sur les vignettes ──────────────────────────────────────
  function handleDragStart(kind: CurveEvent['kind'], e: React.DragEvent) {
    dragKindRef.current = kind;
    // Données dans dataTransfer aussi pour robustesse cross-browser
    e.dataTransfer.setData('text/plain', kind);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleDragEnd() {
    dragKindRef.current = null;
    setDropX(null);
  }

  // ── Handlers drop sur le calque ───────────────────────────────────────────
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const t = tFromClientX(e.clientX);
    setDropX(t);
  }

  function handleDragLeave() {
    setDropX(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const kind =
      dragKindRef.current ??
      ((e.dataTransfer.getData('text/plain') as CurveEvent['kind'] | '') || null);
    if (!kind) return;
    const t = tFromClientX(e.clientX);
    setEvents((prev) => [...prev, { kind, t }]);
    dragKindRef.current = null;
    setDropX(null);
  }

  // Convertit t ∈ [0,1] en coordonnée X SVG pour la ligne fantôme
  const dropSvgX = dropX !== null ? dropX * WIDTH : null;

  return (
    <div className={styles.module}>
      <p className={styles.consigne}>
        Glissez une prise sur la frise pour la placer au moment voulu, ou cliquez pour l'ajouter à la suite.
      </p>

      <div className={styles.gestes}>
        {EVENTS_DEF.map(({ kind, label, Icon }) => (
          <button
            key={kind}
            type="button"
            className={styles.gesteBtn}
            draggable
            onDragStart={(e) => handleDragStart(kind, e)}
            onDragEnd={handleDragEnd}
            onClick={() => addEvent(kind)}
            aria-label={`Glisser ${label.toLowerCase()} sur la frise, ou activer pour l'ajouter à la suite`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className={styles.graphHeader}>
        <p
          className={`${styles.chip} ${ZONE_CHIP_CLASS[currentZone]}`}
          aria-live="polite"
          aria-label={`Pic atteint : ${ZONE_LABEL[currentZone]}`}
        >
          <ZoneIcon size={16} aria-hidden="true" />
          Pic atteint : {ZONE_LABEL[currentZone]}
        </p>

        <div className={styles.playback}>
          <button type="button" className={styles.reset} onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            Réinitialiser
          </button>
        </div>
      </div>

      <svg
          ref={svgRef}
          className={styles.graph}
          viewBox={`0 0 ${WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label="Schéma illustratif du cumul de nicotinémie selon les prises ajoutées"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <defs>
            <linearGradient id={`${gradId}-confort`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className={styles.stopConfortStart} />
              <stop offset="100%" className={styles.stopEnd} />
            </linearGradient>
            <linearGradient id={`${gradId}-toxique`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className={styles.stopToxiqueStart} />
              <stop offset="100%" className={styles.stopEnd} />
            </linearGradient>
          </defs>

          <rect x={0} y={0} width={WIDTH} height={highY} className={BAND_CLASS.haut} />
          <rect x={0} y={highY} width={WIDTH} height={lowY - highY} className={BAND_CLASS.confort} />
          <rect x={0} y={lowY} width={WIDTH} height={HEIGHT - lowY} className={BAND_CLASS.manque} />

          <line x1={0} y1={lowY} x2={WIDTH} y2={lowY} className={styles.seuil} />
          <line x1={0} y1={highY} x2={WIDTH} y2={highY} className={styles.seuil} />
          <text x={8} y={lowY + 16} className={styles.label}>
            Seuil de manque
          </text>
          <text x={8} y={highY - 8} className={styles.label}>
            Seuil de tolérance
          </text>

          {zoneSegments.map((seg, i) => (
            <path
              key={`aire-${i}`}
              d={areaPath(seg.points)}
              fill={`url(#${gradId}-${seg.zone === 'confort' ? 'confort' : 'toxique'})`}
              stroke="none"
            />
          ))}
          {zoneSegments.map((seg, i) => (
            <path
              key={`ligne-${i}`}
              d={segmentPath(seg.points)}
              className={`${styles.courbe} ${ZONE_STROKE_CLASS[seg.zone]}`}
            />
          ))}

          <line x1={0} y1={HEIGHT + 4} x2={WIDTH} y2={HEIGHT + 4} className={styles.axisLine} />

          {/* Ligne fantôme de dépôt pendant le drag */}
          {dropSvgX !== null && (
            <line
              x1={dropSvgX}
              y1={0}
              x2={dropSvgX}
              y2={VIEW_HEIGHT}
              className={styles.dropLine}
            />
          )}

          {events.map((event, i) => {
            const def = EVENTS_DEF.find((d) => d.kind === event.kind);
            const Icon = def?.Icon ?? Cigarette;
            const x = Math.min(WIDTH - 22, Math.max(0, event.t * WIDTH - 11));
            return (
              <g key={i} transform={`translate(${x}, ${HEIGHT + 6})`}>
                {/* Pictogramme de la prise */}
                <g className={styles.pictogramme}>
                  <Icon size={22} aria-hidden="true" />
                </g>
                {/* Bouton de retrait — cible ≥ 44 px via padding SVG */}
                <g
                  className={styles.pictoRetirer}
                  role="button"
                  tabIndex={0}
                  aria-label={`Retirer : ${def?.label ?? event.kind}`}
                  onClick={() => removeEvent(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      removeEvent(i);
                    }
                  }}
                >
                  {/* Zone cliquable invisible élargie */}
                  <rect x={-11} y={-4} width={44} height={44} fill="transparent" />
                  {/* Croix de retrait, petite, en haut à droite du picto */}
                  <circle cx={20} cy={-2} r={7} className={styles.retirerCircle} />
                  <X size={9} x={15.5} y={-6.5} className={styles.retirerX} aria-hidden="true" />
                </g>
              </g>
            );
          })}
      </svg>

      {events.length > 0 && (
        <ul className={styles.prisesList} aria-label="Prises ajoutées">
          {events.map((event, i) => {
            const def = EVENTS_DEF.find((d) => d.kind === event.kind);
            return (
              <li key={i} className={styles.prisesItem}>
                {def?.label ?? event.kind}
                <button
                  type="button"
                  className={styles.retirerBtn}
                  onClick={() => removeEvent(i)}
                  aria-label={`Retirer : ${def?.label ?? event.kind}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className={styles.mention}>Schéma illustratif — pas une courbe pharmacocinétique réelle.</p>

      <div className={styles.legende}>
        <p>
          <strong>Pic rapide</strong> = renforcement de la dépendance.
        </p>
        <p>
          <strong>Chute sous le seuil de manque</strong> = sensation de craving.
        </p>
        <p>
          <strong>Bon usage des substituts</strong> = rester dans la zone confortable, sans
          combustion.
        </p>
      </div>
    </div>
  );
}
