import type { OutilInteractifProps } from './types';
import styles from './OutilStub.module.css';

/**
 * Stub (S1/OI3) — sera remplacé par le constructeur de plans « SI… ALORS… » en S2 (OI5).
 * Respecte `OutilInteractifProps` : placeholder sobre (titre + message + retour).
 */
export default function PlansSiAlors({ outil, onClose }: OutilInteractifProps) {
  return (
    <div className={styles.stub}>
      <h2 className={styles.titre}>{outil.titre}</h2>
      <p className={styles.corps}>Outil interactif en préparation.</p>
      <button type="button" className="btn btn--ghost" onClick={onClose}>
        Retour
      </button>
    </div>
  );
}
