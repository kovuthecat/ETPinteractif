import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './InfoHover.module.css';

interface InfoHoverProps {
  /** Déclencheur (texte/étiquette/icône) qui reçoit le survol et le focus clavier. */
  children: ReactNode;
  /** Contenu du panneau affiché au survol/focus. */
  content: ReactNode;
  /** Libellé accessible du déclencheur (si son contenu visuel ne suffit pas). */
  label?: string;
  /** Position du panneau par rapport au déclencheur — un positionnement simple suffit (brief X6 §T4). */
  position?: 'above' | 'below';
}

/**
 * Généralisation du pattern « tooltip de zone » du module Nicotine (survol +
 * focus clavier, cf. NicotineModule.tsx) en composant générique de 2ᵉ niveau
 * de lecture. Composant agnostique du thème : aucun contenu en dur, tout vient
 * des props. Ne remplace pas les tooltips de zones existants (hors périmètre X6).
 */
export default function InfoHover({ children, content, label, position = 'above' }: InfoHoverProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <span className={styles.wrap}>
      <span
        className={styles.trigger}
        tabIndex={0}
        role="button"
        aria-describedby={panelId}
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
      {open && (
        <span
          id={panelId}
          role="tooltip"
          className={`${styles.panel} ${position === 'below' ? styles.panelBelow : styles.panelAbove}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
