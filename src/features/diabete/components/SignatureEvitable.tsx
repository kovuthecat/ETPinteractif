import { useState, type ReactNode } from 'react';
import styles from './SignatureEvitable.module.css';

/**
 * LA SIGNATURE « ÉVITABLE » (brief §1.5) — motif « bonne nouvelle » constant du module 5,
 * réutilisé verbatim à chaque complication (2ᵉ temps de chaque organe). Le libellé est
 * volontairement figé (pas de prop `label`) : c'est l'identité graphique récurrente qui
 * crée le réflexe d'œil, pas un composant générique de badge. `children` porte la donnée
 * de 2ᵉ niveau (stat DCCT/UKPDS), visible au survol/focus uniquement.
 */

export interface SignatureEvitableProps {
  children?: ReactNode;
}

export default function SignatureEvitable({ children }: SignatureEvitableProps) {
  const [showDetail, setShowDetail] = useState(false);
  const hasDetail = !!children;

  return (
    <div
      className={styles.badge}
      tabIndex={hasDetail ? 0 : undefined}
      role={hasDetail ? 'button' : undefined}
      aria-label={
        hasDetail ? 'Évitable et dépistable — détail au survol' : 'Évitable et dépistable'
      }
      onMouseEnter={hasDetail ? () => setShowDetail(true) : undefined}
      onMouseLeave={hasDetail ? () => setShowDetail(false) : undefined}
      onFocus={hasDetail ? () => setShowDetail(true) : undefined}
      onBlur={hasDetail ? () => setShowDetail(false) : undefined}
    >
      <svg
        className={styles.icon}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <circle cx={20} cy={20} r={17.5} className={styles.anneauExterieur} />
        <circle cx={20} cy={20} r={13} className={styles.anneauInterieur} />
        <path d="M12,21 L18,27 L28,14" className={styles.coche} />
      </svg>
      <span className={styles.label}>Évitable et dépistable</span>

      {hasDetail && showDetail && (
        <div className={styles.detail} role="status">
          {children}
        </div>
      )}
    </div>
  );
}
