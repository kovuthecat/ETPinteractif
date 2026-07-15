import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Play, Square, X } from 'lucide-react';
import styles from './RespirationGuidee.module.css';

/**
 * Exercice de respiration guidée (E6, plans/revue-chrome-2026-07/S15.md), déclenché depuis
 * l'outil « Respirer pour redescendre » (`outil-respiration`). Composant autonome, sans
 * dépendance à `src/features/**` : peut être monté aussi bien côté app patient que côté
 * consultation. Zéro persistance — tout l'état vit en mémoire du composant.
 *
 * Décision TRANCHÉE (index.md « Gates / décisions ») : les DEUX rythmes sont proposés au
 * choix, sélecteur en tête — cohérence cardiaque 5 s / 5 s (2 phases) et 4-7-8 (3 phases,
 * déjà décrit dans `outils.ts`). Le sélecteur est verrouillé une fois l'exercice démarré
 * (changer de rythme en cours de cycle n'aurait pas de sens pédagogique).
 */

type RythmeId = 'coherence' | '478';
type PhaseKey = 'inspir' | 'retenue' | 'expir';
type Etat = 'idle' | 'running' | 'done';

interface Phase {
  key: PhaseKey;
  duree: number; // secondes
  label: string;
}

interface RythmeDef {
  label: string;
  description: string;
  phases: Phase[];
}

const RYTHMES: Record<RythmeId, RythmeDef> = {
  coherence: {
    label: 'Cohérence cardiaque — 5 s / 5 s',
    description: 'Un rythme égal : inspirez et expirez sur 5 secondes chacun.',
    phases: [
      { key: 'inspir', duree: 5, label: 'Inspirez…' },
      { key: 'expir', duree: 5, label: 'Expirez…' },
    ],
  },
  '478': {
    label: '4-7-8',
    description: 'Inspirez 4 s, retenez 7 s, soufflez lentement sur 8 s.',
    phases: [
      { key: 'inspir', duree: 4, label: 'Inspirez…' },
      { key: 'retenue', duree: 7, label: 'Retenez…' },
      { key: 'expir', duree: 8, label: 'Soufflez…' },
    ],
  },
};

const DUREE_DEFAUT = 120; // 2 minutes

function formatMinuteur(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export interface RespirationGuideeProps {
  onClose: () => void;
  /** Durée totale de la séance, en secondes (défaut 2 min). */
  dureeSeconde?: number;
}

/**
 * Cercle qui se dilate (inspir/retenue) et se contracte (expir), au rythme choisi. Le
 * minuteur décompte la durée totale de la séance ; à zéro, la séance se termine d'elle-même
 * (état `done`), comme `VagueCraving` (idle/active/done).
 */
export default function RespirationGuidee({ onClose, dureeSeconde = DUREE_DEFAUT }: RespirationGuideeProps) {
  const [rythmeId, setRythmeId] = useState<RythmeId>('coherence');
  const [etat, setEtat] = useState<Etat>('idle');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(dureeSeconde);
  const fermerRef = useRef<HTMLButtonElement>(null);

  const phases = RYTHMES[rythmeId].phases;
  const phase = phases[phaseIndex] ?? phases[0];

  useEffect(() => {
    fermerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Boucle des phases (inspir/retenue/expir) : reprogrammée à chaque phase pour rester
  // calée sur la durée exacte de chacune (évite la dérive d'un décompte accumulé au tick).
  useEffect(() => {
    if (etat !== 'running') return undefined;
    let cancelled = false;
    let idx = 0;
    let timeoutId: number | undefined;

    const runPhase = () => {
      if (cancelled) return;
      setPhaseIndex(idx);
      timeoutId = window.setTimeout(() => {
        idx = (idx + 1) % phases.length;
        runPhase();
      }, phases[idx].duree * 1000);
    };
    runPhase();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [etat, phases]);

  // Minuteur global de la séance, indépendant du cycle des phases.
  useEffect(() => {
    if (etat !== 'running') return undefined;
    const intervalId = window.setInterval(() => {
      setTotalTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [etat]);

  useEffect(() => {
    if (etat === 'running' && totalTimeLeft <= 0) {
      setEtat('done');
    }
  }, [etat, totalTimeLeft]);

  function start() {
    setPhaseIndex(0);
    setTotalTimeLeft(dureeSeconde);
    setEtat('running');
  }

  function stop() {
    setEtat('idle');
    setPhaseIndex(0);
    setTotalTimeLeft(dureeSeconde);
  }

  // Contracté au repos (idle/done) et pendant l'expir ; dilaté pendant l'inspir/la
  // retenue — l'oscillation est continue d'un cycle au suivant (cf. commentaire de tête).
  const cercleScale = etat === 'running' ? (phase.key === 'expir' ? 0.55 : 1) : 0.55;
  const cercleStyle = {
    transform: `scale(${cercleScale})`,
    transitionDuration: `${phase.duree}s`,
  } as CSSProperties;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Exercice de respiration guidée"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`${styles.sheet} card`}>
        <div className={styles.header}>
          <h2 className={styles.titre}>Respirer pour redescendre</h2>
          <button type="button" className={styles.closeBtn} ref={fermerRef} onClick={onClose} aria-label="Fermer">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.rythmeRow} role="group" aria-label="Choisir un rythme">
          {(Object.keys(RYTHMES) as RythmeId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`${styles.rythmeBtn}${rythmeId === id ? ` ${styles.rythmeBtnActive}` : ''}`}
              aria-pressed={rythmeId === id}
              disabled={etat === 'running'}
              onClick={() => setRythmeId(id)}
            >
              {RYTHMES[id].label}
            </button>
          ))}
        </div>
        <p className={styles.description}>{RYTHMES[rythmeId].description}</p>

        <div className={styles.stage}>
          <div className={styles.circleHalo} aria-hidden="true" />
          <div className={styles.circle} style={cercleStyle} aria-hidden="true" />
        </div>

        <div aria-live="polite">
          {etat === 'running' && <p className={styles.phaseLabel}>{phase.label}</p>}
          {etat === 'idle' && <p className={styles.phaseLabel}>Prêt·e ?</p>}
          {etat === 'done' && <p className={styles.phaseLabel}>Bien joué.</p>}
        </div>

        {etat === 'running' && <p className={styles.minuteur}>{formatMinuteur(totalTimeLeft)}</p>}

        {etat === 'idle' && (
          <button type="button" className="btn btn--primary" onClick={start}>
            <Play size={18} aria-hidden="true" />
            Démarrer l'exercice
          </button>
        )}

        {etat === 'running' && (
          <button type="button" className="btn btn--ghost" onClick={stop}>
            <Square size={18} aria-hidden="true" />
            Arrêter
          </button>
        )}

        {etat === 'done' && (
          <div className={styles.doneActions}>
            <p className={styles.doneText}>
              Vous pouvez recommencer autant de fois que nécessaire, tant que l'envie ou le stress
              sont là.
            </p>
            <button type="button" className="btn btn--primary" onClick={start}>
              <Play size={18} aria-hidden="true" />
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
