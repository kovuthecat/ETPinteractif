/**
 * Petit util localStorage typé pour l'app patient (E3c, revue-chrome-2026-07).
 *
 * Persistance locale autorisée UNIQUEMENT côté bundle patient (cf. CLAUDE.md, invariant #1
 * amendé) : les données du patient (ex. dose de titration, carnet) restent sur son appareil,
 * jamais de réseau. Garde SSR / mode privé : si `localStorage` est indisponible ou lève
 * (quota dépassé, navigation privée qui bloque l'accès…), on retombe silencieusement sur le
 * fallback / on ignore l'écriture — l'outil doit rester utilisable en mémoire, jamais planter.
 */

function hasStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/** Lit une valeur JSON depuis localStorage ; renvoie `fallback` si absente, invalide ou stockage indisponible. */
export function readJSON<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Écrit une valeur JSON dans localStorage ; no-op silencieux si le stockage est indisponible/plein. */
export function writeJSON<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Stockage indisponible (mode privé, quota) : on continue en mémoire, jamais de crash.
  }
}
