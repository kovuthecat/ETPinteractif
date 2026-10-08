/**
 * Calcul pur de la tirelire (P1/S7/T1) : isolé du composant pour être testé.
 * Arrondis calendaires : mois = 30 jours, année = 365 jours (S3 « Si bloqué »).
 */

export const JOURS_PAR_SEMAINE = 7;
export const JOURS_PAR_MOIS = 30;
export const JOURS_PAR_AN = 365;

export interface Economies {
  parJour: number;
  parSemaine: number;
  parMois: number;
  parAn: number;
}

/** Économies pour `cigsParJour` cigarettes non fumées, paquet de `cigsParPaquet` à `prixPaquet` €. */
export function calculerEconomies(cigsParJour: number, prixPaquet: number, cigsParPaquet: number): Economies {
  const parJour = cigsParPaquet > 0 ? (cigsParJour / cigsParPaquet) * prixPaquet : 0;
  return {
    parJour,
    parSemaine: parJour * JOURS_PAR_SEMAINE,
    parMois: parJour * JOURS_PAR_MOIS,
    parAn: parJour * JOURS_PAR_AN,
  };
}

/** Lecture tolérante d'une saisie (virgule ou point) ; `repli` si non numérique ou négative. */
export function parseEntree(raw: string, repli: number): number {
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : repli;
}

/** Nombre de cigarettes par paquet : ≤ 0 est ramené à 1. `corrige` signale l'ajustement (à annoncer). */
export function normaliserCigsParPaquet(valeur: number): { valeur: number; corrige: boolean } {
  return valeur > 0 ? { valeur, corrige: false } : { valeur: 1, corrige: true };
}
