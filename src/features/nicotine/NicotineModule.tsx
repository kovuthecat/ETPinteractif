import { useId, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Bandage, CheckCircle2, Cigarette, Pill, RotateCcw, Wind } from 'lucide-react';
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

  const ys = useMemo(() => sampleCurve({ patch: false, events, n: N }), [events]);
  const zoneSegments = useMemo(() => buildZoneSegments(ys), [ys]);

  const peakIndex = ys.reduce((best, y, i) => (y > ys[best] ? i : best), 0);
  const currentZone = classifyZone(ys[peakIndex]);
  const ZoneIcon = ZONE_ICON[currentZone];

  const lowY = (1 - THRESHOLD_LOW) * HEIGHT;
  const highY = (1 - THRESHOLD_HIGH) * HEIGHT;

  function addEvent(kind: CurveEvent['kind']) {
    setEvents((prev) => [...prev, { kind, t: nextEventTime(prev) }]);
  }

  function reset() {
    setEvents([]);
  }

  return (
    <div className={styles.module}>
      <p className={styles.consigne}>
        Ajoutez des prises (cigarette, patch…) et observez l'évolution de la nicotinémie.
      </p>

      <div className={styles.gestes}>
        {EVENTS_DEF.map(({ kind, label, Icon }) => (
          <button
            key={kind}
            type="button"
            className={styles.gesteBtn}
            onClick={() => addEvent(kind)}
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
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label="Schéma illustratif du cumul de nicotinémie selon les prises ajoutées"
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
        {events.map((event, i) => {
          const Icon = EVENTS_DEF.find((d) => d.kind === event.kind)?.Icon ?? Cigarette;
          const x = Math.min(WIDTH - 22, Math.max(0, event.t * WIDTH - 11));
          return (
            <g key={i} transform={`translate(${x}, ${HEIGHT + 6})`} className={styles.pictogramme}>
              <Icon size={22} aria-hidden="true" />
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
