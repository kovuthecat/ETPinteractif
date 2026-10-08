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

/** Préfixe commun de toutes les clés de l'app patient (`etp.patient.*`, `etp.tabac.*`). */
export const PREFIXE_DONNEES_PATIENT = 'etp.';

const ecouteursEffacement = new Set<() => void>();

/** Abonne un miroir en mémoire à l'effacement complet ; renvoie le désabonnement. */
export function surEffacementDonnees(rappel: () => void): () => void {
  ecouteursEffacement.add(rappel);
  return () => {
    ecouteursEffacement.delete(rappel);
  };
}

/**
 * Efface TOUTES les données locales de l'app patient (clés `etp.*`), les autres clés du
 * domaine restent. Tolère un stockage indisponible (repli silencieux), puis prévient les
 * miroirs en mémoire (sinon leur prochain `setList` réécrirait les anciennes valeurs).
 */
export function effacerDonneesPatient(): void {
  if (hasStorage()) {
    try {
      const cles: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (cle !== null && cle.startsWith(PREFIXE_DONNEES_PATIENT)) cles.push(cle);
      }
      cles.forEach((cle) => localStorage.removeItem(cle));
    } catch {
      // Stockage indisponible : rien à effacer côté disque, on continue.
    }
  }
  ecouteursEffacement.forEach((rappel) => rappel());
}
