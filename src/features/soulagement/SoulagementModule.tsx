import { useMemo, useState } from 'react';
import type { ModuleProps } from '../types';
import {
  sampleCurve,
  toSvgPath,
  THRESHOLD_LOW,
  THRESHOLD_HIGH,
  type CurveEvent,
} from '../../lib/nicotineCurve';
import styles from './SoulagementModule.module.css';

const WIDTH = 600;
const HEIGHT = 280;
const N = 120;
const NON_FUMEUR_LEVEL = (THRESHOLD_LOW + THRESHOLD_HIGH) / 2;
const FUMEUR_EVENTS: CurveEvent[] = [0.1, 0.3, 0.5, 0.7, 0.9].map((t) => ({
  kind: 'cigarette',
  t,
}));

export default function SoulagementModule(_: ModuleProps) {
  const [fumeur, setFumeur] = useState(false);

  const path = useMemo(() => {
    const ys = fumeur
      ? sampleCurve({ patch: false, events: FUMEUR_EVENTS, n: N })
      : Array.from({ length: N }, () => NON_FUMEUR_LEVEL);
    return toSvgPath(ys, WIDTH, HEIGHT);
  }, [fumeur]);

  const lowY = (1 - THRESHOLD_LOW) * HEIGHT;
  const highY = (1 - THRESHOLD_HIGH) * HEIGHT;

  return (
    <div className={styles.module}>
      <div className={styles.controls}>
        <button
          type="button"
          className={!fumeur ? styles.btnActive : styles.btn}
          aria-pressed={!fumeur}
          onClick={() => setFumeur(false)}
        >
          Non-fumeur
        </button>
        <button
          type="button"
          className={fumeur ? styles.btnActive : styles.btn}
          aria-pressed={fumeur}
          onClick={() => setFumeur(true)}
        >
          Fumeur
        </button>
      </div>

      <svg
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Schéma illustratif de la nicotinémie : non-fumeur stable contre fumeur en yo-yo"
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
        {fumeur ? (
          <p>
            Chaque cigarette ne fait que ramener le niveau au-dessus du seuil de manque créé par
            la précédente. Le <strong>« plaisir »</strong> ressenti est surtout le{' '}
            <strong>soulagement de ce manque</strong> — pas un gain réel.
          </p>
        ) : (
          <p>
            Sans cigarette, le niveau reste <strong>stable dans la zone confortable</strong> :
            jamais de manque créé, donc rien à soulager.
          </p>
        )}
      </div>
    </div>
  );
}
