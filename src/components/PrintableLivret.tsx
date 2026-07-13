import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './PrintableLivret.module.css';

/**
 * Contrat « section imprimable » (S11) : titre + contenu déjà rendu (illustrations,
 * items sélectionnés inclus). La même abstraction sert le livret complet (plusieurs
 * sections concaténées, ici) et pourrait servir une fiche isolée (une seule section).
 * Volontairement minimal — pas de sur-ingénierie : le `body` est un ReactNode monté
 * par l'appelant, qui reste seul juge de sa présentation.
 */
export interface PrintableSection {
  id: string;
  /** Petit intitulé en capitales au-dessus du titre. */
  eyebrow?: string;
  title: string;
  body: ReactNode;
  /** Force un saut de page avant cette section à l'impression. */
  breakBefore?: boolean;
}

interface PrintableLivretProps {
  coverEyebrow: string;
  coverTitle: string;
  /** Date d'arrêt déjà formatée (chaîne vide si non renseignée). */
  coverDate?: string;
  sections: PrintableSection[];
  /** Contenu additionnel du pied (fil rouge…), au-dessus de la mention « rien n'est enregistré ». */
  footer?: ReactNode;
  onClose: () => void;
}

/**
 * Livret A4 imprimable via `window.print()`. Même socle d'impression que
 * `FicheOverlay` : porté dans `document.body` (hors `#root`), il reste seul visible
 * quand global.css masque `#root` à l'impression. Agnostique du thème : tout le
 * contenu vient des props.
 */
export default function PrintableLivret({
  coverEyebrow,
  coverTitle,
  coverDate,
  sections,
  footer,
  onClose,
}: PrintableLivretProps) {
  const fermerRef = useRef<HTMLButtonElement>(null);

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

  const dateDuJour = new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' });

  return createPortal(
    <div
      className={`livret-overlay ${styles.overlay}`}
      role="dialog"
      aria-modal="true"
      aria-label={coverTitle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`livret-doc ${styles.doc}`}>
        <section className={styles.cover}>
          <span className={`eyebrow ${styles.coverEyebrow}`}>{coverEyebrow}</span>
          <h1 className={styles.coverTitle}>{coverTitle}</h1>
          {coverDate ? (
            <p className={styles.coverDate}>
              Jour J : <strong>{coverDate}</strong>
            </p>
          ) : (
            <p className={styles.coverDateVide}>
              Date d'arrêt : à choisir ensemble, quand vous serez prêt·e.
            </p>
          )}
          <p className={styles.coverNote}>
            Ce livret rassemble ce que vous avez choisi au fil des étapes — à garder près de vous.
          </p>
        </section>

        {sections.map((section) => (
          <section
            key={section.id}
            className={`${styles.section}${section.breakBefore ? ` ${styles.sectionBreak}` : ''}`}
          >
            <header className={styles.sectionHead}>
              {section.eyebrow && <span className={styles.sectionEyebrow}>{section.eyebrow}</span>}
              <h2 className={styles.sectionTitle}>{section.title}</h2>
            </header>
            <div className={styles.sectionBody}>{section.body}</div>
          </section>
        ))}

        <footer className={styles.docFooter}>
          {footer}
          <p className={styles.mention}>
            Livret généré en consultation le {dateDuJour} — rien n'est enregistré.
          </p>
        </footer>
      </div>

      <div className={`livret-actions ${styles.actions}`} data-no-print>
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
