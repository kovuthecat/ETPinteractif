import { useEffect, useRef, useState } from 'react';
import type { ModuleProps } from '../types';
import styles from './CravingModule.module.css';

const WIDTH = 600;
const HEIGHT = 200;
const N = 120;
const PEAK = 0.3;
const RISE_WIDTH = 0.12;
const FALL_WIDTH = 0.32;
const DURATION_MS = 30000;

type Phase = 'idle' | 'monte' | 'pic' | 'redescend' | 'passe';

function bellValue(x: number): number {
  const width = x <= PEAK ? RISE_WIDTH : FALL_WIDTH;
  return Math.exp(-((x - PEAK) ** 2) / (2 * width ** 2));
}

function buildBellPath(width: number, height: number): string {
  const points = Array.from({ length: N }, (_, i) => {
    const x = i / (N - 1);
    const y = bellValue(x);
    return `${x * width},${(1 - y) * height}`;
  });
  const [first, ...rest] = points;
  return `M${first} L${rest.join(' ')}`;
}

const BELL_PATH = buildBellPath(WIDTH, HEIGHT);

function getPhase(progress: number, running: boolean): Phase {
  if (!running && progress === 0) return 'idle';
  if (!running && progress >= 1) return 'passe';
  if (progress < PEAK - 0.03) return 'monte';
  if (progress <= PEAK + 0.05) return 'pic';
  return 'redescend';
}

const PHASE_LABEL: Record<Phase, string> = {
  idle: 'En attente — déclenchez la vague.',
  monte: 'Ça monte…',
  pic: "Pic de l'envie",
  redescend: 'Ça redescend…',
  passe: "C'est passé.",
};

type DKey = 'differer' | 'distraire' | 'decontracter' | 'eau';

const D_CARDS: { key: DKey; titre: string; conseil: string }[] = [
  {
    key: 'differer',
    titre: 'Différer',
    conseil: "Attendez que la vague passe : ça ne dure que quelques minutes.",
  },
  {
    key: 'distraire',
    titre: 'Distraire',
    conseil: 'Faites autre chose, occupez vos mains et votre esprit.',
  },
  {
    key: 'decontracter',
    titre: 'Décontracter',
    conseil: 'Respiration lente : inspirez 4 secondes, expirez 6 secondes.',
  },
  {
    key: 'eau',
    titre: "De l'eau",
    conseil: "Buvez un grand verre d'eau, lentement.",
  },
];

export default function CravingModule(_: ModuleProps) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [openCards, setOpenCards] = useState<Set<DKey>>(new Set());
  const [respirationActive, setRespirationActive] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function lancerVague() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setProgress(0);
    setRunning(true);

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const p = Math.min(1, elapsed / DURATION_MS);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setRunning(false);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function toggleCard(key: DKey) {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const phase = getPhase(progress, running);
  const dejaLancee = running || progress > 0;
  const markerX = progress * WIDTH;
  const markerY = (1 - bellValue(progress)) * HEIGHT;

  return (
    <div className={styles.module}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>La vague de l'envie</h2>

        <svg
          className={styles.graph}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Schéma illustratif de la vague d'envie dans le temps"
        >
          <path d={BELL_PATH} className={styles.courbe} />
          {dejaLancee && <circle cx={markerX} cy={markerY} r={8} className={styles.marqueur} />}
        </svg>
        <p className={styles.mention}>
          Schéma illustratif — les ~30 secondes ici représentent quelques minutes réelles.
        </p>

        <p className={styles.phase} aria-live="polite">
          {PHASE_LABEL[phase]}
        </p>

        <div className={styles.controls}>
          <button type="button" className={styles.btn} onClick={lancerVague} disabled={running}>
            {dejaLancee ? 'Rejouer' : 'Une envie arrive'}
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Les 4 D</h2>
        <div className={styles.cards}>
          {D_CARDS.map((card) => {
            const isOpen = openCards.has(card.key);
            return (
              <div key={card.key} className={styles.card}>
                <button
                  type="button"
                  className={styles.cardHeader}
                  onClick={() => toggleCard(card.key)}
                  aria-expanded={isOpen}
                >
                  {card.titre}
                </button>
                {isOpen && (
                  <div className={styles.cardBody}>
                    <p>{card.conseil}</p>
                    {card.key === 'decontracter' && (
                      <div className={styles.respiration}>
                        <div
                          className={
                            respirationActive
                              ? `${styles.cercle} ${styles.cercleActif}`
                              : styles.cercle
                          }
                        />
                        <button
                          type="button"
                          className={styles.btnSmall}
                          onClick={() => setRespirationActive((a) => !a)}
                        >
                          {respirationActive ? 'Arrêter' : 'Démarrer'} la respiration
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <p className={styles.aparte}>
        En parler — Tabac Info Service <strong>39 89</strong>.
      </p>
    </div>
  );
}
