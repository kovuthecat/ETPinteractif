import { useMemo, useState } from 'react';
import type { ModuleProps } from '../types';
import {
  sampleCurve,
  toSvgPath,
  THRESHOLD_LOW,
  THRESHOLD_HIGH,
  type CurveEvent,
} from '../../lib/nicotineCurve';
import styles from './NicotineModule.module.css';

const WIDTH = 600;
const HEIGHT = 280;
const FIRST_EVENT_T = 0.08;
const EVENT_STEP = 0.12;
const MAX_EVENT_T = 0.92;

function nextEventTime(events: CurveEvent[]): number {
  return Math.min(MAX_EVENT_T, FIRST_EVENT_T + events.length * EVENT_STEP);
}

export default function NicotineModule(_: ModuleProps) {
  const [patch, setPatch] = useState(false);
  const [events, setEvents] = useState<CurveEvent[]>([]);

  const path = useMemo(
    () => toSvgPath(sampleCurve({ patch, events }), WIDTH, HEIGHT),
    [patch, events],
  );

  const lowY = (1 - THRESHOLD_LOW) * HEIGHT;
  const highY = (1 - THRESHOLD_HIGH) * HEIGHT;

  function addEvent(kind: CurveEvent['kind']) {
    setEvents((prev) => [...prev, { kind, t: nextEventTime(prev) }]);
  }

  function reset() {
    setPatch(false);
    setEvents([]);
  }

  return (
    <div className={styles.module}>
      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={() => addEvent('cigarette')}>
          Fumer une cigarette
        </button>
        <button type="button" className={styles.btn} onClick={() => addEvent('ponctuel')}>
          Substitut ponctuel
        </button>
        <button type="button" className={styles.btn} onClick={() => addEvent('vapoteuse')}>
          Vapoteuse
        </button>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={patch}
            onChange={(e) => setPatch(e.target.checked)}
          />
          Patch (continu)
        </label>
        <button type="button" className={styles.reset} onClick={reset}>
          Réinitialiser
        </button>
      </div>

      <svg
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Schéma illustratif de la nicotinémie dans le temps"
      >
        <rect
          x={0}
          y={highY}
          width={WIDTH}
          height={lowY - highY}
          className={styles.zoneConfortable}
        />
        <line x1={0} y1={lowY} x2={WIDTH} y2={lowY} className={styles.seuil} />
        <line x1={0} y1={highY} x2={WIDTH} y2={highY} className={styles.seuil} />
        <text x={8} y={lowY + 16} className={styles.label}>
          Seuil de manque
        </text>
        <text x={8} y={highY - 8} className={styles.label}>
          Seuil de tolérance
        </text>
        <path d={path} className={styles.courbe} />
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
