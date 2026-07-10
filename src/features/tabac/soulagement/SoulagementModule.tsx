import { useMemo, useState, type CSSProperties, type MouseEvent } from 'react';
import { Cigarette } from 'lucide-react';
import type { ModuleProps } from '../../types';
import { sampleTension, toSvgPath, TENSION_NONSMOKER, TENSION_TAU, TIME_MAX } from '../lib/nicotineCurve';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import styles from './SoulagementModule.module.css';

const WIDTH = 600;
const HEIGHT = 200;
const AXIS_GAP = 36;
const VIEW_HEIGHT = HEIGHT + AXIS_GAP;
const N = 200;
const MARKER_RADIUS = 11;
const MARKER_Y = HEIGHT + 14;
const HOUR_MARKS = [0, 6, 12, 18, 24];

function timeToX(t: number): number {
  return (t / TIME_MAX) * WIDTH;
}

function levelToY(level: number): number {
  return HEIGHT - (level / 100) * HEIGHT;
}

export default function SoulagementModule({ onNavigate }: ModuleProps) {
  const [cigTimes, setCigTimes] = useState<number[]>([]);
  const [compare, setCompare] = useState(false);

  const tensionValues = useMemo(() => sampleTension({ cigTimes, n: N }), [cigTimes]);
  const tensionPath = useMemo(
    () => toSvgPath(tensionValues, { width: WIDTH, height: HEIGHT }),
    [tensionValues],
  );

  const troughIndex = useMemo(() => {
    if (cigTimes.length === 0) return null;
    let idx = 0;
    for (let i = 1; i < tensionValues.length; i++) {
      if (tensionValues[i] < tensionValues[idx]) idx = i;
    }
    return idx;
  }, [cigTimes.length, tensionValues]);

  /** Annotation du délai chute → remontée : fenêtre d'environ une constante de temps TENSION_TAU. */
  const delayAnnotation = useMemo(() => {
    if (troughIndex === null) return null;
    const deltaIndex = Math.round((TENSION_TAU / TIME_MAX) * N);
    const riseIndex = Math.min(troughIndex + deltaIndex, N);
    return {
      x1: (troughIndex / N) * WIDTH,
      x2: (riseIndex / N) * WIDTH,
      y: levelToY(tensionValues[troughIndex]) + 20,
    };
  }, [troughIndex, tensionValues]);

  const nonSmokerY = levelToY(TENSION_NONSMOKER);

  function addCigaretteAtClick(event: MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const t = (Math.round(Math.min(1, Math.max(0, ratio)) * TIME_MAX * 4) / 4) as number;
    setCigTimes((prev) => [...prev, t]);
  }

  function removeCigaretteAt(index: number, event: MouseEvent<SVGGElement>) {
    event.stopPropagation();
    setCigTimes((prev) => prev.filter((_, i) => i !== index));
  }

  function reset() {
    setCigTimes([]);
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Cliquez sur la frise pour « fumer une cigarette » : observez la tension liée au manque
        chuter au creux, puis remonter. Cliquez sur un repère pour le retirer.
      </p>

      <div className={`callout ${styles.calloutText}`}>
        <b>Lecture en 2 temps :</b> la chute au clic, c&apos;est le soulagement ressenti. La
        remontée qui suit, c&apos;est le retour du manque — plus vite qu&apos;on ne le croit. Ce
        n&apos;est pas un plaisir gagné : c&apos;est un retour à zéro, temporaire.
      </div>

      <div className={styles.graphCard}>
        <svg
          className={styles.graph}
          viewBox={`0 0 ${WIDTH} ${VIEW_HEIGHT}`}
          aria-label="Schéma illustratif : cliquer sur la frise dépose une cigarette et fait chuter puis remonter la tension liée au manque. Cliquer sur un repère le retire. Comparer au non-fumeur superpose le niveau stable d'un non-fumeur, toujours sous le point le plus bas atteint par le fumeur."
          onClick={addCigaretteAtClick}
        >
          <text x={4} y={14} className={styles.axisTitle}>
            tension liée au manque ↑
          </text>

          <path d={tensionPath} className={styles.courbeTension} />

          {compare && (
            <>
              <line
                x1={0}
                y1={nonSmokerY}
                x2={WIDTH}
                y2={nonSmokerY}
                className={styles.repereNonFumeur}
              />
              <text x={4} y={nonSmokerY - 8} className={styles.labelRepere}>
                Niveau d&apos;un non-fumeur
              </text>
            </>
          )}

          {delayAnnotation && (
            <g className={styles.delaiAnnotation}>
              <line
                x1={delayAnnotation.x1}
                y1={delayAnnotation.y}
                x2={delayAnnotation.x2}
                y2={delayAnnotation.y}
              />
              <line
                x1={delayAnnotation.x1}
                y1={delayAnnotation.y - 4}
                x2={delayAnnotation.x1}
                y2={delayAnnotation.y + 4}
              />
              <line
                x1={delayAnnotation.x2}
                y1={delayAnnotation.y - 4}
                x2={delayAnnotation.x2}
                y2={delayAnnotation.y + 4}
              />
              <text
                x={(delayAnnotation.x1 + delayAnnotation.x2) / 2}
                y={delayAnnotation.y + 14}
                textAnchor="middle"
              >
                puis ça remonte…
              </text>
            </g>
          )}

          <line x1={0} y1={HEIGHT} x2={WIDTH} y2={HEIGHT} className={styles.axisLine} />

          {cigTimes.map((t, i) => (
            <g
              key={i}
              transform={`translate(${timeToX(t)}, ${MARKER_Y})`}
              className={styles.marker}
              onClick={(event) => removeCigaretteAt(i, event)}
            >
              <circle r={MARKER_RADIUS} className={styles.markerCircle} />
              <Cigarette size={14} x={-7} y={-7} className={styles.markerIcon} aria-hidden="true" />
            </g>
          ))}

          {HOUR_MARKS.map((h) => (
            <text
              key={h}
              x={timeToX(h)}
              y={VIEW_HEIGHT - 6}
              textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}
              className={styles.hourLabel}
            >
              {h}h
            </text>
          ))}
        </svg>
        <p className={styles.hint}>
          Cliquez sur la frise pour ajouter une cigarette · cliquez un repère pour le retirer
        </p>
      </div>

      <p className={styles.mention}>
        Schéma illustratif — pas une mesure clinique de la tension du manque.
      </p>

      <div className={styles.controls}>
        <button
          type="button"
          className={`btn ${compare ? 'btn--primary activeDoubled' : 'btn--ghost'}`}
          style={compare ? ({ '--active-color': 'var(--color-confort)' } as CSSProperties) : undefined}
          aria-pressed={compare}
          onClick={() => setCompare((c) => !c)}
        >
          Comparer au non-fumeur
        </button>
        {cigTimes.length > 0 && (
          <button type="button" className="btn btn--tertiary" onClick={reset}>
            Réinitialiser
          </button>
        )}
      </div>

      <div className={styles.legende}>
        <p>
          Chaque cigarette fait <strong>chuter la tension liée au manque</strong> un court instant
          — c&apos;est le soulagement qu&apos;elle a elle-même créé. La tension remonte ensuite,
          jusqu&apos;à la cigarette suivante.
        </p>
        {compare && (
          <p>
            Même au plus bas, la tension du fumeur reste{' '}
            <strong>au-dessus du niveau stable d&apos;un non-fumeur</strong> : la cigarette ne
            fait que ramener vers un « normal » qu&apos;elle a elle-même déplacé.
          </p>
        )}
      </div>

      <p className="filrouge">
        C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se traite.
      </p>
      <ModuleFooterNav
        items={[
          { id: 'substituts', label: 'Sortir du yo-yo : les substituts' },
          { id: 'boite-a-outils', label: 'Stratégies et outils' },
        ]}
        onNavigate={onNavigate}
      />
    </div>
  );
}
