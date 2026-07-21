import { useCallback, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../lib/storage';
import type { OutilStore } from '../../features/tabac/boite-a-outils/outils-interactifs/types';

const PREFIX = 'etp.tabac.';

/**
 * Adaptateur `OutilStore` côté patient (S1/OI2, plans/outils-interactifs-2026-07/S1.md) :
 * lit/écrit `localStorage` sous les clés `etp.tabac.<clé>` via `storage.ts` (persistance
 * locale autorisée côté patient — CLAUDE.md invariant #1 amendé — jamais de réseau).
 *
 * `localStorage` n'étant pas réactif, un `useState` miroir force le re-render des
 * composants outils après une écriture (`setList`) : sans lui, l'UI ne refléterait pas
 * immédiatement la donnée qu'elle vient d'enregistrer.
 */
export function usePatientStore(): OutilStore {
  const [mirror, setMirror] = useState<Record<string, string[]>>({});

  const get = useCallback(
    (key: string): string[] => (key in mirror ? mirror[key] : readJSON<string[]>(PREFIX + key, [])),
    [mirror],
  );

  const setList = useCallback((key: string, values: string[]) => {
    writeJSON(PREFIX + key, values);
    setMirror((prev) => ({ ...prev, [key]: values }));
  }, []);

  return useMemo(() => ({ get, setList }), [get, setList]);
}
