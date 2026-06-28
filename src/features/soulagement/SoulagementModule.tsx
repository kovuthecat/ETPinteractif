import { useMemo, useState } from 'react';
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
const N = 120;
const ANNOTATION_T = 0.5;
const FUMEUR_EVENTS: CurveEvent[] = [0.1, 0.3, 0.5, 0.7, 0.9].map((t) => ({
  kind: 'cigarette',
  t,
}));

export default function SoulagementModule(_: ModuleProps) {
  const [fumeur, setFumeur] = useState(false);
  const [compare, setCompare] = useState(false);

  const stressYs = useMemo(
    () => sampleStress({ fumeur, events: fumeur ? FUMEUR_EVENTS : undefined, n: N }),
    [fumeur],
  );
  const stressPath = useMemo(() => toSvgPath(stressYs, WIDTH, HEIGHT), [stressYs]);

  const nicotineYs = useMemo(
    () => (fumeur ? sampleCurve({ patch: false, events: FUMEUR_EVENTS, n: N }) : null),
    [fumeur],
  );
  const nicotinePath = useMemo(
    () => (nicotineYs ? toSvgPath(nicotineYs, WIDTH, HEIGHT) : ''),
    [nicotineYs],
  );

  const annotation = useMemo(() => {
    if (!fumeur) return null;
    const idx = Math.min(N - 1, Math.round(ANNOTATION_T * (N - 1)));
    return { x: (idx / (N - 1)) * WIDTH, y: (1 - stressYs[idx]) * HEIGHT };
  }, [fumeur, stressYs]);

  const compareY = (1 - STRESS_BASAL_NON_FUMEUR) * HEIGHT;
  const stressLabelY = Math.max(14, (1 - stressYs[0]) * HEIGHT - 10);
  const nicotineLabelY = nicotineYs ? Math.max(14, (1 - nicotineYs[0]) * HEIGHT - 6) : 0;

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
        {fumeur && (
          <button
            type="button"
            className={compare ? styles.btnActive : styles.btn}
            aria-pressed={compare}
            onClick={() => setCompare((c) => !c)}
          >
            Comparer au non-fumeur
          </button>
        )}
      </div>

      <svg
        className={styles.graph}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={
          fumeur
            ? 'Schéma illustratif : chez le fumeur, le stress (trait plein) monte quand la nicotine (pointillé) redescend, et chute brièvement après chaque cigarette.'
            : 'Schéma illustratif : chez le non-fumeur, le stress reste bas et stable, sans aucune courbe de nicotine.'
        }
      >
        {fumeur && nicotineYs && (
          <>
            <path d={nicotinePath} className={styles.courbeNicotine} />
            <text x={8} y={nicotineLabelY} className={styles.labelNicotine}>
              Nicotine (repère, pointillé)
            </text>
          </>
        )}

        {compare && fumeur && (
          <>
            <line x1={0} y1={compareY} x2={WIDTH} y2={compareY} className={styles.repereNonFumeur} />
            <text x={8} y={compareY - 8} className={styles.labelRepere}>
              Repère : stress non-fumeur (stable)
            </text>
          </>
        )}

        <path
          d={stressPath}
          className={fumeur ? styles.courbeStressFumeur : styles.courbeStressCalme}
        />
        <text x={8} y={stressLabelY} className={styles.labelStress}>
          Stress {fumeur ? '(trait plein)' : 'basal (stable)'}
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
      </svg>
      <p className={styles.mention}>
        Schéma illustratif — pas une mesure clinique du stress ni de la nicotinémie.
      </p>

      <div className={styles.legende}>
        {fumeur ? (
          <p>
            Chaque cigarette fait <strong>chuter la tension</strong> un court instant — c&apos;est
            le <strong>soulagement du manque</strong> qu&apos;elle a elle-même créé. La tension
            remonte ensuite à mesure que la nicotine redescend, jusqu&apos;à la cigarette
            suivante. Au final, le <strong>niveau moyen de tension reste plus haut</strong>{' '}
            qu&apos;en l&apos;absence de tabac.
          </p>
        ) : (
          <p>
            Sans cigarette, <strong>aucun manque de nicotine</strong> ne se crée : le stress reste{' '}
            <strong>bas et stable</strong>, donc rien à soulager.
          </p>
        )}
      </div>
    </div>
  );
}
