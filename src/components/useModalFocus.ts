import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Index du prochain élément focalisable dans une boucle de `total` éléments. */
export function indexSuivant(courant: number, total: number, arriere: boolean): number {
  if (total <= 0) return -1;
  if (courant < 0 || courant >= total) return arriere ? total - 1 : 0;
  return arriere ? (courant - 1 + total) % total : (courant + 1) % total;
}

function focalisables(conteneur: HTMLElement): HTMLElement[] {
  return Array.from(conteneur.querySelectorAll<HTMLElement>(FOCUSABLES)).filter(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden',
  );
}

interface Options {
  open: boolean;
  onClose: () => void;
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Comportement attendu d'un dialog modal : focus initial dedans, Tab / Maj+Tab
 * confinés, Échap ferme, focus rendu au déclencheur à la fermeture.
 * Aucun inert/aria-hidden : le confinement passe par la gestion de Tab.
 */
export function useModalFocus(
  ref: RefObject<HTMLElement | null>,
  { open, onClose, initialFocus }: Options,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const conteneur = ref.current;
    if (!conteneur) return;
    const declencheur = document.activeElement as HTMLElement | null;

    const cible = initialFocus?.current ?? focalisables(conteneur)[0] ?? conteneur;
    cible.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !conteneur) return;
      const liste = focalisables(conteneur);
      if (liste.length === 0) {
        event.preventDefault();
        return;
      }
      const courant = liste.indexOf(document.activeElement as HTMLElement);
      const premier = liste[0];
      const dernier = liste[liste.length - 1];
      const sorti = !conteneur.contains(document.activeElement);
      if (sorti || (event.shiftKey && document.activeElement === premier) || (!event.shiftKey && document.activeElement === dernier)) {
        event.preventDefault();
        liste[indexSuivant(sorti ? -1 : courant, liste.length, event.shiftKey)].focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (declencheur && document.contains(declencheur)) {
        declencheur.focus({ preventScroll: true });
      }
    };
  }, [open, ref, initialFocus]);
}
