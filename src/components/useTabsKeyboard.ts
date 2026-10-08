import { useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export type OrientationOnglets = 'horizontal' | 'vertical';

/**
 * Index de l'onglet à sélectionner selon la touche pressée, ou `null` si la touche est ignorée.
 * ←/→ (horizontal) ou ↑/↓ (vertical) bouclent ; Home/End vont aux extrémités.
 */
export function indexOngletSuivant(
  touche: string,
  courant: number,
  total: number,
  orientation: OrientationOnglets = 'horizontal',
): number | null {
  if (total <= 0) return null;
  const avant = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const arriere = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  if (touche === avant) return (courant + 1) % total;
  if (touche === arriere) return (courant - 1 + total) % total;
  if (touche === 'Home') return 0;
  if (touche === 'End') return total - 1;
  return null;
}

interface Options {
  count: number;
  selected: number;
  onSelect: (index: number) => void;
  orientation?: OrientationOnglets;
}

/**
 * Clavier d'une liste d'onglets (activation automatique) : la flèche sélectionne ET déplace le
 * focus ; `tabIndex` itinérant (seul l'onglet sélectionné est dans l'ordre de tabulation).
 */
export function useTabsKeyboard({ count, selected, onSelect, orientation = 'horizontal' }: Options) {
  const refs = useRef<Array<HTMLElement | null>>([]);

  function getTabProps(i: number) {
    return {
      role: 'tab' as const,
      'aria-selected': selected === i,
      tabIndex: selected === i ? 0 : -1,
      ref: (el: HTMLElement | null) => {
        refs.current[i] = el;
      },
      onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => {
        const next = indexOngletSuivant(e.key, i, count, orientation);
        if (next === null) return;
        e.preventDefault();
        onSelect(next);
        refs.current[next]?.focus();
      },
    };
  }

  return { getTabProps };
}
