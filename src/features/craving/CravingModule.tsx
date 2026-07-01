import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FastForward, GlassWater, Hourglass, Sparkles, Wind } from 'lucide-react';
import type { ModuleProps } from '../types';
import styles from './CravingModule.module.css';

const WIDTH = 600;
const HEIGHT = 200;
const N = 120;
const PEAK = 0.3;
const RISE_WIDTH = 0.12;
const FALL_WIDTH = 0.32;
const DURATION_MS = 30000;
const GORGEES_TOTAL = 3;

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

function buildAreaPath(width: number, height: number): string {
  return `${BELL_PATH} L${width},${height} L0,${height} Z`;
}

const BELL_PATH = buildBellPath(WIDTH, HEIGHT);
const AREA_PATH = buildAreaPath(WIDTH, HEIGHT);
const PEAK_X = PEAK * WIDTH;
const AXIS_Y = HEIGHT - 2;

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

const D_CARDS: { key: DKey; titre: string; conseil: string; Icon: LucideIcon }[] = [
  {
    key: 'differer',
    titre: 'Différer',
    conseil: "Attendez que la vague passe : ça ne dure que quelques minutes.",
    Icon: Hourglass,
  },
  {
    key: 'distraire',
    titre: 'Distraire',
    conseil: 'Faites autre chose, occupez vos mains et votre esprit.',
    Icon: Sparkles,
  },
  {
    key: 'decontracter',
    titre: 'Décontracter',
    conseil: 'Respiration lente : inspirez 4 secondes, expirez 6 secondes.',
    Icon: Wind,
  },
  {
    key: 'eau',
    titre: "De l'eau",
    conseil: "Buvez un grand verre d'eau, lentement.",
    Icon: GlassWater,
  },
];

const ACTIVE_STYLE = { '--active-color': 'var(--color-confort)' } as CSSProperties;

export default function CravingModule(_: ModuleProps) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeTools, setActiveTools] = useState<Set<DKey>>(new Set());
  const [respirationActive, setRespirationActive] = useState(false);
  const [gorgees, setGorgees] = useState(0);
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

  function passerVague() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    setRunning(false);
    setProgress(1);
  }

  function toggleTool(key: DKey) {
    setActiveTools((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        if (key === 'decontracter') setRespirationActive(false);
        if (key === 'eau') setGorgees(0);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const phase = getPhase(progress, running);
  const dejaLancee = running || progress > 0;
  const markerX = progress * WIDTH;
  const markerY = (1 - bellValue(progress)) * HEIGHT;
  const remainingS = Math.max(0, Math.ceil(((1 - progress) * DURATION_MS) / 1000));
  const courbeClass = activeTools.has('distraire')
    ? `${styles.courbe} ${styles.courbeAttenuee}`
    : styles.courbe;
  const cartesActives = D_CARDS.filter((card) => activeTools.has(card.key));
  const trop = cartesActives.length >= 2;

  const cartes = cartesActives.map((card) => (
    <div key={card.key} className={styles.overlayCard}>
      <p className={styles.overlayTitre}>
        <card.Icon size={18} aria-hidden="true" />
        {card.titre}
      </p>
      <p className={styles.overlayConseil}>{card.conseil}</p>

      {card.key === 'differer' && (
        <p className={styles.overlayDetail} aria-live="polite">
          {remainingS > 0 ? `Encore ${remainingS} s…` : "C'est passé."}
        </p>
      )}

      {card.key === 'distraire' && (
        <Sparkles size={26} className={styles.distraireIcon} aria-hidden="true" />
      )}

      {card.key === 'decontracter' && (
        <div className={styles.respiration}>
          <div
            className={respirationActive ? `${styles.cercle} ${styles.cercleActif}` : styles.cercle}
          />
          <button
            type="button"
            className={styles.btnSmall}
            onClick={() => setRespirationActive((a) => !a)}
          >
            {respirationActive ? 'Arrêter' : 'Démarrer'}
          </button>
        </div>
      )}

      {card.key === 'eau' && (
        <div className={styles.eauWidget}>
          <p className={styles.overlayDetail} aria-live="polite">
            {gorgees === 0
              ? 'Prenez le verre.'
              : gorgees >= GORGEES_TOTAL
                ? "C'est fait, bien joué."
                : `Gorgée ${gorgees}/${GORGEES_TOTAL}…`}
          </p>
          <button
            type="button"
            className={styles.btnSmall}
            onClick={() => setGorgees((g) => (g >= GORGEES_TOTAL ? 0 : g + 1))}
          >
            {gorgees >= GORGEES_TOTAL ? 'Recommencer' : 'Une gorgée'}
          </button>
        </div>
      )}
    </div>
  ));

  return (
    <div className={styles.module}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>La vague de l'envie</h2>

        <div className={styles.graphWrap}>
          <svg
            className={styles.graph}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Schéma illustratif de la vague d'envie dans le temps"
          >
            <defs>
              <linearGradient id="craving-aire" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1={0} y1={AXIS_Y} x2={WIDTH} y2={AXIS_Y} className={styles.axe} />
            <line x1={PEAK_X} y1={0} x2={PEAK_X} y2={AXIS_Y} className={styles.repereMax} />
            <text x={PEAK_X} y={14} textAnchor="middle" className={styles.repereMaxLabel}>
              pic
            </text>
            <path d={AREA_PATH} className={styles.aire} />
            <path d={BELL_PATH} className={courbeClass} />
            {dejaLancee && (
              <g>
                <circle cx={markerX} cy={markerY} r={13} className={styles.marqueurHalo} />
                <circle cx={markerX} cy={markerY} r={7} className={styles.marqueur} />
              </g>
            )}
          </svg>

          {!trop && cartesActives.length > 0 && (
            <div className={styles.overlayZone}>{cartes}</div>
          )}
        </div>

        {trop && <div className={styles.overlayZoneBelow}>{cartes}</div>}

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
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={passerVague}
            disabled={progress >= 1}
          >
            <FastForward size={18} aria-hidden="true" />
            Passer 30 s
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Les 4 D</h2>
        <p className={styles.sousTitre}>
          Activez un ou plusieurs outils : ils viennent occuper le pic de la vague, qui continue
          de redescendre derrière.
        </p>
        <div className={styles.toolsRow}>
          {D_CARDS.map((card) => {
            const isActive = activeTools.has(card.key);
            return (
              <button
                key={card.key}
                type="button"
                className={isActive ? `${styles.toolBtn} activeDoubled` : styles.toolBtn}
                style={isActive ? ACTIVE_STYLE : undefined}
                onClick={() => toggleTool(card.key)}
                aria-pressed={isActive}
              >
                <card.Icon size={20} aria-hidden="true" />
                {card.titre}
              </button>
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
