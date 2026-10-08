import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { Cigarette } from 'lucide-react';
import type { ModuleProps } from '../../types';
import { sampleTension, toSvgPath, TENSION_NONSMOKER, TENSION_TAU, TIME_MAX } from '../lib/nicotineCurve';
import styles from './SoulagementModule.module.css';

const WIDTH = 600;
const HEIGHT = 200;
const AXIS_GAP = 36;
const VIEW_HEIGHT = HEIGHT + AXIS_GAP;
const N = 200;
const MARKER_RADIUS = 11;
const MARKER_Y = HEIGHT + 14;
const HOUR_MARKS = [0, 6, 12, 18, 24];

// Curseur clavier de la frise : pas de 15 min (Maj : 1 h), borné à [0, TIME_MAX].
const KBD_STEP = 0.25;
const KBD_STEP_BIG = 1;

function stepCursor(t: number, direction: 1 | -1, big: boolean): number {
  const next = t + direction * (big ? KBD_STEP_BIG : KBD_STEP);
  return Math.max(0, Math.min(TIME_MAX, Math.round(next * 4) / 4));
}

/** 10.5 → « 10 h 30 » (forme annoncée et affichée pour le curseur clavier). */
function formatClock(t: number): string {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return `${h} h ${String(m).padStart(2, '0')}`;
}

function timeToX(t: number): number {
  return (t / TIME_MAX) * WIDTH;
}

function levelToY(level: number): number {
  return HEIGHT - (level / 100) * HEIGHT;
}

export default function SoulagementModule(_props: ModuleProps) {
  const [cigTimes, setCigTimes] = useState<number[]>([]);
  const [compare, setCompare] = useState(false);
  const [cursorTime, setCursorTime] = useState(0);
  const [cursorShown, setCursorShown] = useState(false);
  const [announce, setAnnounce] = useState({ text: '', n: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const hintId = useId();

  function say(text: string) {
    setAnnounce((prev) => ({ text, n: prev.n + 1 }));
  }

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
    addCigarette(t);
  }

  function addCigarette(t: number) {
    setCigTimes((prev) => [...prev, t]);
    say(`Cigarette posée à ${formatClock(t)}`);
  }

  /** Clavier sur la frise elle-même (pas sur un repère qu'elle contient). */
  function handleGraphKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (event.target !== event.currentTarget) return;
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = stepCursor(cursorTime, 1, event.shiftKey);
    else if (event.key === 'ArrowLeft') next = stepCursor(cursorTime, -1, event.shiftKey);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TIME_MAX;
    if (next !== null) {
      event.preventDefault();
      setCursorTime(next);
      say(`Curseur à ${formatClock(next)}`);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      addCigarette(cursorTime);
    }
  }

  /** Retire un repère ; au clavier, le focus revient à la frise (le repère disparaît). */
  function deleteCigarette(index: number, viaKeyboard: boolean) {
    const t = cigTimes[index];
    setCigTimes((prev) => prev.filter((_, i) => i !== index));
    if (t !== undefined) say(`Cigarette retirée (${formatClock(t)})`);
    if (viaKeyboard) svgRef.current?.focus();
  }

  function removeCigaretteAt(index: number, event: MouseEvent<SVGGElement>) {
    event.stopPropagation();
    deleteCigarette(index, false);
  }

  function removeCigaretteKey(index: number, event: KeyboardEvent<SVGGElement>) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      event.stopPropagation();
      deleteCigarette(index, true);
    }
  }

  function reset() {
    setCigTimes([]);
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Cliquez sur la frise pour « fumer une cigarette » : observez la tension liée au manque
        chuter au creux, puis remonter. Cliquez sur un repère pour le retirer. Au clavier : Tab jusqu'à
        la frise, ← → pour régler l'heure, Entrée pour poser, Suppr sur un repère pour le retirer.
      </p>

      <div className={`callout ${styles.calloutText}`}>
        <b>Lecture en 2 temps :</b> la chute au clic, c&apos;est le soulagement ressenti. La
        remontée qui suit, c&apos;est le retour du manque — plus vite qu&apos;on ne le croit. Ce
        n&apos;est pas un plaisir gagné : c&apos;est un retour à zéro, temporaire.
      </div>

      <div className={styles.graphCard}>
        <svg
          ref={svgRef}
          className={styles.graph}
          viewBox={`0 0 ${WIDTH} ${VIEW_HEIGHT}`}
          role="group"
          tabIndex={0}
          aria-label="Frise de 24 h, schéma illustratif : poser une cigarette fait chuter puis remonter la tension liée au manque. Comparer au non-fumeur superpose le niveau stable d'un non-fumeur, toujours sous le point le plus bas atteint par le fumeur."
          aria-describedby={hintId}
          onClick={addCigaretteAtClick}
          onKeyDown={handleGraphKeyDown}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setCursorShown(true);
          }}
          onBlur={(event) => {
            if (event.target === event.currentTarget) setCursorShown(false);
          }}
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

          {cursorShown && (
            <g className={styles.kbdCursor} aria-hidden="true">
              <line x1={timeToX(cursorTime)} y1={0} x2={timeToX(cursorTime)} y2={MARKER_Y} />
              <circle cx={timeToX(cursorTime)} cy={MARKER_Y} r={5} />
              <text
                x={timeToX(cursorTime) + (cursorTime > 20 ? -8 : 8)}
                y={HEIGHT - 8}
                textAnchor={cursorTime > 20 ? 'end' : 'start'}
              >
                {formatClock(cursorTime)}
              </text>
            </g>
          )}

          {cigTimes.map((t, i) => (
            <g
              key={i}
              transform={`translate(${timeToX(t)}, ${MARKER_Y})`}
              className={styles.marker}
              role="button"
              tabIndex={0}
              aria-label={`Retirer : cigarette à ${formatClock(t)}`}
              onClick={(event) => removeCigaretteAt(i, event)}
              onKeyDown={(event) => removeCigaretteKey(i, event)}
            >
              <rect x={-22} y={-22} width={44} height={44} fill="transparent" />
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
        <p id={hintId} className={styles.hint}>
          Cliquez sur la frise pour ajouter une cigarette · cliquez un repère pour le retirer. Au clavier : ← →
          déplacent le curseur (Maj : 1 h), Entrée pose, Suppr retire le repère sélectionné.
        </p>
        <p className={styles.srOnly} role="status" aria-live="polite">
          <span key={announce.n}>{announce.text}</span>
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
    </div>
  );
}
