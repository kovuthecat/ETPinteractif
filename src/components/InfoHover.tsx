import { useEffect, useId, useRef, useState } from 'react';
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
 *
 * Survol + clic verrouillant (décision Thibault 2026-07-09) : le survol/focus ouvre
 * le panneau comme avant (le quitter le ferme), et un clic (ou Enter/Espace) sur le
 * déclencheur verrouille le panneau ouvert — il reste alors affiché même quand la
 * souris sort ; re-clic, Escape, ou un clic à l'extérieur du composant referme et
 * déverrouille. Aucun contenu en dur : ce comportement est LE comportement du
 * composant, il n'a pas de consommateur historique à préserver au pixel près.
 */
export default function InfoHover({ children, content, label, position = 'above' }: InfoHoverProps) {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);

  // Clic hors du composant pendant le verrouillage : ferme et déverrouille.
  // Listener ajouté seulement quand `locked` (jamais au repos) et nettoyé au
  // démontage / dès que `locked` redevient false, pour ne jamais fuir.
  useEffect(() => {
    if (!locked) return;
    function handlePointerDown(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setLocked(false);
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [locked]);

  function handleTriggerClick(e: React.MouseEvent) {
    // Ne remonte jamais : les déclencheurs vivront dans des vignettes elles-mêmes
    // cliquables (S3) — le clic info ne doit jamais déclencher l'action parente.
    e.stopPropagation();
    setLocked((prevLocked) => {
      const next = !prevLocked;
      setOpen(next);
      return next;
    });
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setLocked((prevLocked) => {
        const next = !prevLocked;
        setOpen(next);
        return next;
      });
    } else if (e.key === 'Escape' && (locked || open)) {
      setLocked(false);
      setOpen(false);
    }
  }

  return (
    <span className={styles.wrap} ref={wrapRef}>
      <span
        className={styles.trigger}
        tabIndex={0}
        role="button"
        aria-describedby={panelId}
        aria-label={label}
        aria-expanded={open}
        onMouseEnter={() => !locked && setOpen(true)}
        onMouseLeave={() => !locked && setOpen(false)}
        onFocus={() => !locked && setOpen(true)}
        onBlur={() => !locked && setOpen(false)}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
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
