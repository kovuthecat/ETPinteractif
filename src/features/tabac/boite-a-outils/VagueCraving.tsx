import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ChevronLeft } from 'lucide-react';
import FicheOverlay from '../../../components/FicheOverlay';
import styles from './VagueCraving.module.css';

const CRAVING_DURATION = 180;

type Phase = 'idle' | 'active' | 'done';
type DKey = 'differer' | 'detourner' | 'detendre' | 'eau';

const D_ORDER: DKey[] = ['differer', 'detourner', 'detendre', 'eau'];

const D_INFO: Record<DKey, { titre: string; corps: string; couleur: string; couleurSoft: string }> = {
  differer: {
    titre: 'Différer',
    corps: "Attendez encore un peu — l'envie ne fait que monter avant de redescendre.",
    couleur: 'var(--color-vigilance)',
    couleurSoft: 'var(--color-vigilance-soft)',
  },
  detourner: {
    titre: "Détourner l'attention",
    corps: "Occupez vos mains ou votre tête quelques minutes : marchez un peu, appelez quelqu'un.",
    couleur: 'var(--color-nav)',
    couleurSoft: 'var(--color-nav-soft)',
  },
  detendre: {
    titre: 'Se détendre — respirez',
    corps: 'Suivez le cercle : inspirez en le regardant grandir, expirez quand il se resserre.',
    couleur: 'var(--color-confort)',
    couleurSoft: 'var(--color-confort-soft)',
  },
  eau: {
    titre: "D'eau",
    corps: "Buvez un verre d'eau, lentement, en petites gorgées.",
    couleur: 'oklch(55% 0.10 200)',
    couleurSoft: 'oklch(55% 0.10 200 / .16)',
  },
};

// Consignes raccourcies pour la carte imprimée (une ligne) — distinctes du corps
// affiché à l'écran dans D_INFO, qui ne doit pas être modifié (cf. plans/extensions-tabac/X2.md).
const FICHE_D_CONSIGNES: Record<DKey, string> = {
  differer: 'Attendez encore un peu, l’envie va redescendre.',
  detourner: 'Occupez vos mains ou votre tête quelques minutes.',
  detendre: 'Respirez calmement, en suivant le cercle.',
  eau: 'Buvez un verre d’eau, lentement.',
};

interface Point {
  x: number;
  y: number;
}

interface CubicSegment {
  p0: Point;
  c1: Point;
  c2: Point;
  p1: Point;
}

const WAVE_SEGMENTS: CubicSegment[] = [
  { p0: { x: 10, y: 110 }, c1: { x: 90, y: 110 }, c2: { x: 120, y: 20 }, p1: { x: 190, y: 20 } },
  { p0: { x: 190, y: 20 }, c1: { x: 280, y: 20 }, c2: { x: 300, y: 95 }, p1: { x: 400, y: 100 } },
  { p0: { x: 400, y: 100 }, c1: { x: 470, y: 103 }, c2: { x: 500, y: 108 }, p1: { x: 570, y: 110 } },
];

const WAVE_BG_PATH =
  'M10,110 C90,110 120,20 190,20 C280,20 300,95 400,100 C470,103 500,108 570,110';

function cubicPoint(seg: CubicSegment, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * seg.p0.x + 3 * mt * mt * t * seg.c1.x + 3 * mt * t * t * seg.c2.x + t * t * t * seg.p1.x,
    y: mt * mt * mt * seg.p0.y + 3 * mt * mt * t * seg.c1.y + 3 * mt * t * t * seg.c2.y + t * t * t * seg.p1.y,
  };
}

function wavePoint(progress: number): Point {
  const p = Math.max(0, Math.min(1, progress));
  const scaled = p * WAVE_SEGMENTS.length;
  let idx = Math.floor(scaled);
  if (idx >= WAVE_SEGMENTS.length) idx = WAVE_SEGMENTS.length - 1;
  const localT = Math.min(1, scaled - idx);
  return cubicPoint(WAVE_SEGMENTS[idx], localT);
}

function wavePathUpTo(progress: number): string {
  const steps = 40;
  const count = Math.max(1, Math.round(steps * Math.max(0.02, progress)));
  let d = '';
  for (let i = 0; i <= count; i++) {
    const p = (i / count) * progress;
    const pt = wavePoint(p);
    d += (i === 0 ? 'M' : ' L') + pt.x.toFixed(1) + ',' + pt.y.toFixed(1);
  }
  return d;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface VagueCravingProps {
  /** Retour à la grille des outils. */
  onBack: () => void;
}

/**
 * Outil interactif « Laisser passer la vague — les 4D » (`outil-vague-4d`).
 * Déplacé quasi tel quel depuis l'ancien module `craving` (plans/boite-a-outils/S2.md) :
 * mêmes phases idle/active/done, même minuteur 3 min, mêmes 4D, même animation de
 * respiration, même fiche « Ma carte anti-envie » (X2, ne pas modifier les textes).
 * Seule adaptation : bouton de retour vers la grille (pas de porte de navigation interne).
 */
export default function VagueCraving({ onBack }: VagueCravingProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(CRAVING_DURATION);
  const [activeDs, setActiveDs] = useState<Set<DKey>>(new Set());
  const [selectedDs, setSelectedDs] = useState<Set<DKey>>(new Set());
  const [ficheOpen, setFicheOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    setPhase('active');
    setTimeLeft(CRAVING_DURATION);
    setActiveDs(new Set());
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        if (next <= 0) {
          if (intervalRef.current !== null) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setPhase('done');
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function reset() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase('idle');
    setTimeLeft(CRAVING_DURATION);
    setActiveDs(new Set());
  }

  function toggleD(id: DKey) {
    setActiveDs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectedD(id: DKey) {
    setSelectedDs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const progress = 1 - timeLeft / CRAVING_DURATION;
  const dot = wavePoint(progress);
  const wavePath = wavePathUpTo(progress);

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <p className={styles.intro}>
        L'envie de fumer est une vague : elle monte, puis redescend d'elle-même — même sans
        cigarette. Les 4D aident à tenir pendant ce temps.
      </p>

      {phase === 'idle' && (
        <div className={`${styles.centerCard} card`}>
          <p className={styles.centerTitle}>Une envie arrive ?</p>
          <button type="button" className="btn btn--primary" onClick={start}>
            Je ressens un craving
          </button>
          <p className={styles.centerHint}>Ça dure en général 3 à 5 minutes</p>
        </div>
      )}

      {phase === 'active' && (
        <div className={`${styles.activeCard} card`}>
          <div className={styles.activeHeader}>
            <p className={styles.activeTitle}>La vague est en train de redescendre</p>
            <p className={styles.clock}>{formatClock(timeLeft)}</p>
          </div>

          <div className={styles.overlayZone}>
            <div className={styles.stage}>
              <svg viewBox="0 0 580 130" preserveAspectRatio="xMidYMid meet" className={styles.svg}>
                <path d={WAVE_BG_PATH} className={styles.waveBg} />
                <path d={wavePath} className={styles.waveProgress} />
                <circle cx={dot.x} cy={dot.y} r={13} className={styles.markerHalo} />
                <circle cx={dot.x} cy={dot.y} r={7} className={styles.marker} />
              </svg>
            </div>

            <div className={styles.dRow}>
              {D_ORDER.map((id) => {
                const info = D_INFO[id];
                const active = activeDs.has(id);
                const isDetendre = id === 'detendre';
                const cardStyle = {
                  '--d-color': info.couleur,
                  '--d-soft': info.couleurSoft,
                  '--active-color': info.couleur,
                } as CSSProperties;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.dCard} card${isDetendre ? ` ${styles.dCardDetendre}` : ''}${active ? ' activeDoubled' : ''}`}
                    style={cardStyle}
                    onClick={() => toggleD(id)}
                    aria-pressed={active}
                  >
                    <p className={styles.dTitre}>{info.titre}</p>
                    <p className={styles.dCorps}>{info.corps}</p>
                    {isDetendre && active && (
                      <div className={styles.respiration}>
                        <svg viewBox="0 0 120 120" className={styles.respirationSvg} aria-hidden="true">
                          <circle cx="60" cy="60" r="42" className={styles.respirationOutline} />
                          <circle cx="60" cy="60" r="22" className={styles.respirationCercle} />
                        </svg>
                        <p className={styles.respirationHint}>
                          Inspirez 5s en le regardant grandir, expirez 5s
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <p className={styles.dHint}>Touchez un D pour agir — il aide à tenir pendant le pic de l'envie</p>
        </div>
      )}

      {phase === 'done' && (
        <div className={`${styles.centerCard} card`}>
          <p className={styles.doneTitle}>La vague est passée.</p>
          <p className={styles.doneText}>
            Elle reviendra peut-être, un peu plus tard ou plus faible. À chaque fois, elle
            redescend.
          </p>
          <button type="button" className="btn btn--primary" onClick={reset}>
            Recommencer
          </button>
        </div>
      )}

      {phase !== 'active' && (
        <div className={styles.ficheButtonRow}>
          <button type="button" className="btn btn--ghost" onClick={() => setFicheOpen(true)}>
            Préparer ma carte
          </button>
        </div>
      )}

      <p className={styles.aparte}>
        En parler — Tabac Info Service <strong>39 89</strong>.
      </p>

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          titre="Ma carte anti-envie"
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">La boucle de l'envie</span>
            <div className="fiche-signaletique">
              <div className="fiche-signaletique-etape">
                <span className="fiche-signaletique-num">1</span>
                <p>L'envie monte</p>
              </div>
              <div className="fiche-signaletique-etape">
                <span className="fiche-signaletique-num">2</span>
                <p>Elle retombe seule — 3 à 5 minutes</p>
              </div>
              <div className="fiche-signaletique-etape">
                <span className="fiche-signaletique-num">3</span>
                <p>Pendant ce temps :</p>
              </div>
            </div>
          </div>

          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Mes parades — cochez vos préférées</span>
            <div className={styles.ficheDList}>
              {D_ORDER.map((id) => {
                const info = D_INFO[id];
                const checked = selectedDs.has(id);
                const itemStyle = {
                  '--d-color': info.couleur,
                  '--d-soft': info.couleurSoft,
                } as CSSProperties;
                return (
                  <label
                    key={id}
                    className={`${styles.ficheDItem}${checked ? ` ${styles.ficheDItemActive}` : ''}`}
                    style={itemStyle}
                  >
                    <input
                      type="checkbox"
                      data-no-print
                      checked={checked}
                      onChange={() => toggleSelectedD(id)}
                    />
                    <span className={styles.ficheDTexte}>
                      <strong className={styles.ficheDTitre}>{info.titre}</strong>
                      <span className={styles.ficheDConsigne}>{FICHE_D_CONSIGNES[id]}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="fiche-bloc">
            <div className="fiche-contact">
              <p>En parler — Tabac Info Service</p>
              <span className="fiche-contact-numero">39 89</span>
            </div>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
