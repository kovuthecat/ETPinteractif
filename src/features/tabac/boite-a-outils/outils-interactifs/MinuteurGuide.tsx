import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import { MINUTEURS, type EtapeMinuteur, type MinuteurOutilId } from './data/minuteurs';
import styles from './MinuteurGuide.module.css';

type Phase = 'idle' | 'active' | 'done';

function isMinuteurOutilId(id: unknown): id is MinuteurOutilId {
  return id === 'bouger' || id === 'surfer';
}

// Reprend le pattern de `VagueCraving.tsx` (non exporté là-bas, donc dupliqué ici plutôt
// que modifié) : formatage mm:ss du temps restant.
function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Dernière invite dont `aSec` est atteint par le temps écoulé (`etapes` triées croissant). */
function etapeCourante(etapes: EtapeMinuteur[] | undefined, elapsedSec: number): EtapeMinuteur | undefined {
  if (!etapes || etapes.length === 0) return undefined;
  let courante = etapes[0];
  for (const etape of etapes) {
    if (etape.aSec <= elapsedSec) courante = etape;
    else break;
  }
  return courante;
}

/**
 * Minuteur guidé générique (S5, OI8) : sert deux outils de la boîte à outils —
 * `bouger` (effort 10 min + rappel d'exercices de repli) et `surfer` (invites d'observation de
 * l'envie qui défilent, ~3 min). Durées/étapes propres à chaque outil dans
 * `data/minuteurs.ts`. Reprend le pattern minuteur de `VagueCraving` (interval + cleanup +
 * horloge mm:ss, phases idle/active/done) sans modifier ce fichier. Aucune persistance : le
 * `store` injecté n'est pas utilisé ici (rien à mémoriser d'une session à l'autre).
 */
export default function MinuteurGuide({ outil, onClose }: OutilInteractifProps) {
  const def = isMinuteurOutilId(outil.interactif) ? MINUTEURS[outil.interactif] : undefined;
  const dureeSec = def?.dureeSec ?? 0;

  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(dureeSec);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    setPhase('active');
    setTimeLeft(dureeSec);
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
    setTimeLeft(dureeSec);
  }

  // Défensif : le registre (`registry.ts`) ne monte ce composant que pour `bouger`/`surfer`.
  if (!def) {
    return (
      <div className={`${styles.centerCard} card`}>
        <p className={styles.centerTitle}>{outil.titre}</p>
        <p className={styles.centerHint}>Outil interactif en préparation.</p>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          <ChevronLeft aria-hidden="true" /> Retour
        </button>
      </div>
    );
  }

  const elapsed = dureeSec - timeLeft;
  const invite = etapeCourante(def.etapes, elapsed);
  const progressPct = dureeSec > 0 ? Math.round((elapsed / dureeSec) * 100) : 0;

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onClose}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <p className={styles.intro}>{outil.principe}</p>

      {phase === 'idle' && (
        <div className={`${styles.centerCard} card`}>
          <p className={styles.centerTitle}>{outil.titre}</p>
          <button type="button" className="btn btn--primary" onClick={start}>
            Démarrer
          </button>
          <p className={styles.centerHint}>Durée : {formatClock(dureeSec)}</p>
        </div>
      )}

      {phase === 'active' && (
        <div className={`${styles.activeCard} card`}>
          <div className={styles.activeHeader}>
            <p className={styles.activeTitle}>{outil.titre}</p>
            <p className={styles.clock}>{formatClock(timeLeft)}</p>
          </div>

          <p className={styles.invite} role="status">
            {invite ? invite.texte : def.rappel}
          </p>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className="btn btn--ghost" onClick={reset}>
              Arrêter
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className={`${styles.centerCard} card`}>
          <p className={styles.doneTitle}>C'est terminé.</p>
          <p className={styles.doneText}>{def.clotureTexte}</p>
          <button type="button" className="btn btn--primary" onClick={reset}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
