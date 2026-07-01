import { useMemo, useState } from 'react';
import { ArrowLeftRight, Cigarette, RotateCcw } from 'lucide-react';
import type { ModuleProps } from '../types';
import {
  sampleCurve,
  sampleStress,
  toSvgPath,
  STRESS_BASAL_NON_FUMEUR,
  type CurveEvent,
} from '../../lib/nicotineCurve';
import styles from './SoulagementModule.module.css';

const WIDTH = 600;
const HEIGHT = 280;
const AXIS_GAP = 28;
const VIEW_HEIGHT = HEIGHT + AXIS_GAP;
const N = 120;

const FIRST_EVENT_T = 0.08;
const EVENT_STEP = 0.12;
const MAX_EVENT_T = 0.92;

function nextEventTime(events: CurveEvent[]): number {
  return Math.min(MAX_EVENT_T, FIRST_EVENT_T + events.length * EVENT_STEP);
}

export default function SoulagementModule(_: ModuleProps) {
  const [events, setEvents] = useState<CurveEvent[]>([]);
  const [compare, setCompare] = useState(false);

  const nicotineYs = useMemo(() => sampleCurve({ patch: false, events, n: N }), [events]);
  const stressYs = useMemo(() => sampleStress({ fumeur: true, events, n: N }), [events]);

  const nicotinePath = useMemo(() => toSvgPath(nicotineYs, WIDTH, HEIGHT), [nicotineYs]);
  const stressPath = useMemo(() => toSvgPath(stressYs, WIDTH, HEIGHT), [stressYs]);

  const troughIndex = useMemo(() => {
    if (events.length === 0 || stressYs.length === 0) return null;
    let idx = 0;
    for (let i = 1; i < stressYs.length; i++) {
      if (stressYs[i] < stressYs[idx]) idx = i;
    }
    return idx;
  }, [events.length, stressYs]);

  const annotation =
    troughIndex !== null
      ? { x: (troughIndex / (N - 1)) * WIDTH, y: (1 - stressYs[troughIndex]) * HEIGHT }
      : null;

  const compareY = (1 - STRESS_BASAL_NON_FUMEUR) * HEIGHT;
  const stressLabelY = Math.max(14, (1 - stressYs[0]) * HEIGHT - 10);
  const nicotineLabelY = Math.max(14, (1 - nicotineYs[0]) * HEIGHT - 6);

  function fumerCigarette() {
    setEvents((prev) => [...prev, { kind: 'cigarette', t: nextEventTime(prev) }]);
  }

  function reset() {
    setEvents([]);
  }

  return (
    <div className={styles.module}>
      <div className={styles.gestes}>
        <button type="button" className={styles.gesteBtn} onClick={fumerCigarette}>
          <Cigarette size={18} aria-hidden="true" />
          Fumer une cigarette
        </button>
      </div>

      <div className={styles.graphHeader}>
        <button
          type="button"
          className={compare ? styles.btnActive : styles.btn}
          aria-pressed={compare}
          onClick={() => setCompare((c) => !c)}
        >
          <ArrowLeftRight size={16} aria-hidden="true" />
          Comparer au non-fumeur
        </button>
        <button type="button" className={styles.reset} onClick={reset}>
          <RotateCcw size={16} aria-hidden="true" />
          Réinitialiser
        </button>
      </div>

      <svg
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label="Schéma illustratif : cliquer sur fumer une cigarette dépose une prise sur la frise et fait chuter puis remonter la tension du fumeur. Le bouton comparer superpose le niveau de tension stable du non-fumeur, toujours en dessous du plus bas niveau atteint par le fumeur."
      >
        {events.length > 0 && (
          <>
            <path d={nicotinePath} className={styles.courbeNicotine} />
            <text x={8} y={nicotineLabelY} className={styles.labelNicotine}>
              Nicotine (repère, pointillé)
            </text>
          </>
        )}

        {compare && (
          <>
            <line x1={0} y1={compareY} x2={WIDTH} y2={compareY} className={styles.repereNonFumeur} />
            <text x={8} y={compareY - 8} className={styles.labelRepere}>
              Repère : stress non-fumeur (stable)
            </text>
          </>
        )}

        <path d={stressPath} className={styles.courbeStress} />
        <text x={8} y={stressLabelY} className={styles.labelStress}>
          Stress du fumeur (trait plein)
        </text>

        {annotation && (
          <text
            x={annotation.x}
            y={Math.max(14, annotation.y - 12)}
            textAnchor="middle"
            className={styles.labelAnnotation}
          >
            soulagement du manque
          </text>
        )}

        <line x1={0} y1={HEIGHT + 4} x2={WIDTH} y2={HEIGHT + 4} className={styles.axisLine} />
        {events.map((event, i) => {
          const x = Math.min(WIDTH - 18, Math.max(0, event.t * WIDTH - 9));
          return (
            <g key={i} transform={`translate(${x}, ${HEIGHT + 8})`} className={styles.pictogramme}>
              <Cigarette size={18} aria-hidden="true" />
            </g>
          );
        })}
      </svg>
      <p className={styles.mention}>
        Schéma illustratif — pas une mesure clinique du stress ni de la nicotinémie.
      </p>

      <div className={styles.legende}>
        <p>
          Chaque cigarette fait <strong>chuter la tension</strong> un court instant — c&apos;est le{' '}
          <strong>soulagement du manque</strong> qu&apos;elle a elle-même créé. La tension remonte
          ensuite à mesure que la nicotine redescend, jusqu&apos;à la cigarette suivante.
        </p>
        {compare && (
          <p>
            Même au plus bas, la tension du fumeur reste{' '}
            <strong>au-dessus du niveau stable d&apos;un non-fumeur</strong> : la cigarette ne fait
            que ramener vers un « normal » qu&apos;elle a elle-même déplacé.
          </p>
        )}
      </div>
    </div>
  );
}
