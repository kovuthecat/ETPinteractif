import { useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Bandage, Cigarette, Pause, Pill, Play, RotateCcw, Wind } from 'lucide-react';
import type { ModuleProps } from '../types';
import {
  sampleCurve,
  toSvgPath,
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
const DURATION_MS = 14000;
const SPEEDS = [1, 2, 4];

const FIRST_EVENT_T = 0.08;
const EVENT_STEP = 0.12;
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

const ZONE_STROKE_CLASS: Record<Zone, string> = {
  manque: styles.courbeToxique,
  confort: styles.courbeConfort,
  haut: styles.courbeToxique,
};

const ZONE_GAUGE_CLASS: Record<Zone, string> = {
  manque: styles.gaugeToxique,
  confort: styles.gaugeConfort,
  haut: styles.gaugeToxique,
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

function buildZoneSegments(ys: number[]): { zone: Zone; d: string }[] {
  if (ys.length === 0) return [];
  const point = (i: number) => {
    const x = ys.length === 1 ? 0 : (i / (ys.length - 1)) * WIDTH;
    return `${x},${(1 - ys[i]) * HEIGHT}`;
  };
  const segments: { zone: Zone; d: string }[] = [];
  let zone = classifyZone(ys[0]);
  let points = [point(0)];
  for (let i = 1; i < ys.length; i++) {
    const z = classifyZone(ys[i]);
    if (z !== zone) {
      points.push(point(i));
      segments.push({ zone, d: segmentPath(points) });
      zone = z;
      points = [point(i - 1), point(i)];
    } else {
      points.push(point(i));
    }
  }
  segments.push({ zone, d: segmentPath(points) });
  return segments;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export default function NicotineModule(_: ModuleProps) {
  const reducedMotion = useReducedMotion();
  const [events, setEvents] = useState<CurveEvent[]>([]);
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const baseRef = useRef(0);
  const nowRef = useRef(0);

  useEffect(() => {
    nowRef.current = now;
  }, [now]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    startRef.current = null;
    baseRef.current = nowRef.current;
    const speed = SPEEDS[speedIndex];
    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsedMs = (timestamp - startRef.current) * speed;
      const p = Math.min(1, baseRef.current + elapsedMs / DURATION_MS);
      setNow(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setPlaying(false);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speedIndex]);

  const ys = useMemo(() => sampleCurve({ patch: false, events, n: N }), [events]);
  const fullPath = useMemo(() => toSvgPath(ys, WIDTH, HEIGHT), [ys]);

  const effectiveNow = reducedMotion ? 1 : now;
  const nowIndex = Math.min(N - 1, Math.round(effectiveNow * (N - 1)));
  const elapsedYs = ys.slice(0, nowIndex + 1);
  const zoneSegments = useMemo(() => buildZoneSegments(elapsedYs), [elapsedYs]);
  const currentZone = classifyZone(ys[nowIndex]);

  const lowY = (1 - THRESHOLD_LOW) * HEIGHT;
  const highY = (1 - THRESHOLD_HIGH) * HEIGHT;
  const cursorX = now * WIDTH;
  const showCursor = !reducedMotion && (now > 0 || playing);

  function addEvent(kind: CurveEvent['kind']) {
    setEvents((prev) => [
      ...prev,
      { kind, t: reducedMotion ? nextEventTime(prev) : nowRef.current },
    ]);
  }

  function togglePlay() {
    if (now >= 1) return;
    setPlaying((p) => !p);
  }

  function cycleSpeed() {
    setSpeedIndex((i) => (i + 1) % SPEEDS.length);
  }

  function reset() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setPlaying(false);
    setNow(0);
    setEvents([]);
  }

  return (
    <div className={styles.module}>
      <div className={styles.controls}>
        {EVENTS_DEF.map(({ kind, label, Icon }) => (
          <button key={kind} type="button" className={styles.btn} onClick={() => addEvent(kind)}>
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className={styles.playback}>
        {!reducedMotion && (
          <>
            <button
              type="button"
              className={styles.btn}
              onClick={togglePlay}
              disabled={now >= 1}
            >
              {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              {playing ? 'Pause' : 'Lecture'}
            </button>
            <button type="button" className={styles.btnSmall} onClick={cycleSpeed}>
              Vitesse ×{SPEEDS[speedIndex]}
            </button>
          </>
        )}
        <button type="button" className={styles.reset} onClick={reset}>
          <RotateCcw size={18} aria-hidden="true" />
          Réinitialiser
        </button>
      </div>

      <p className={`${styles.gauge} ${ZONE_GAUGE_CLASS[currentZone]}`} aria-live="polite">
        État actuel : {ZONE_LABEL[currentZone]}
      </p>

      <svg
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label="Schéma illustratif de la nicotinémie dans le temps, lecture animée"
      >
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

        <path d={fullPath} className={styles.courbeDiscrete} />
        {zoneSegments.map((seg, i) => (
          <path key={i} d={seg.d} className={`${styles.courbe} ${ZONE_STROKE_CLASS[seg.zone]}`} />
        ))}

        <line x1={0} y1={HEIGHT + 4} x2={WIDTH} y2={HEIGHT + 4} className={styles.axisLine} />
        {events.map((event, i) => {
          const Icon = EVENTS_DEF.find((d) => d.kind === event.kind)?.Icon ?? Cigarette;
          const x = Math.min(WIDTH - 18, Math.max(0, event.t * WIDTH - 9));
          return (
            <g key={i} transform={`translate(${x}, ${HEIGHT + 8})`} className={styles.pictogramme}>
              <Icon size={18} aria-hidden="true" />
            </g>
          );
        })}

        {showCursor && (
          <line x1={cursorX} y1={0} x2={cursorX} y2={VIEW_HEIGHT} className={styles.cursor} />
        )}
      </svg>
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
