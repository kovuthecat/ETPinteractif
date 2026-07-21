import { useMemo } from 'react';
import { useSelection } from '../../../../state/SelectionContext';
import type { OutilStore } from './types';

/**
 * Adaptateur `OutilStore` côté consultation (S1/OI2) : lit/écrit `SelectionState.outilsData`
 * via `useSelection` (mémoire de session — invariant #1 maintenu, aucune écriture disque).
 * Doit être appelé sous un `<SelectionScope themeId="tabac">` (comme tout usage de
 * `useSelection`).
 */
export function useConsultationStore(): OutilStore {
  const { state, setOutilData } = useSelection();
  return useMemo(
    () => ({
      get: (key: string) => state.outilsData[key] ?? [],
      setList: (key: string, values: string[]) => setOutilData(key, values),
    }),
    [state.outilsData, setOutilData],
  );
}
