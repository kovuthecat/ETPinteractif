import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './FicheOverlay.module.css';

interface FicheOverlayProps {
  eyebrow: string;
  titre: string;
  footer?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Overlay générique « fiche à emporter » : feuille A4 à l'écran, imprimable via
 * window.print() (CSS d'impression dans src/styles/global.css, section « Fiches »).
 * Composant agnostique du thème : aucun contenu en dur, tout vient des props.
 */
export default function FicheOverlay({ eyebrow, titre, footer, onClose, children }: FicheOverlayProps) {
  const fermerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fermerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const dateDuJour = new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' });

  return createPortal(
    <div
      className={`fiche-overlay ${styles.overlay}`}
      role="dialog"
      aria-modal="true"
      aria-label={titre}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`fiche-sheet ${styles.sheet}`}>
        <header className={styles.header}>
          <span className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</span>
          <h2 className={styles.titre}>{titre}</h2>
          <p className={styles.date}>{dateDuJour}</p>
        </header>
        <div className={styles.content}>{children}</div>
        <footer className={styles.footer}>
          {footer}
          <p className={styles.mention}>Fiche générée en consultation — rien n'est enregistré.</p>
        </footer>
      </div>
      <div className={`fiche-actions ${styles.actions}`} data-no-print>
        <button type="button" className="btn btn--primary" onClick={() => window.print()}>
          Imprimer
        </button>
        <button type="button" className="btn btn--ghost" ref={fermerRef} onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>,
    document.body,
  );
}
