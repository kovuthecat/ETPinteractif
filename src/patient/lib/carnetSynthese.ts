/**
 * Synthèse du carnet de suivi patient (S5, `plans/recette-outils-2026-08/`, gate G-carnet) : le
 * carnet promettait « repérer vos moments à risque » sans aucune agrégation — juste une liste
 * chronologique brute (constat recette 2026-08-06). Trois agrégats, et rien de plus :
 * répartition par tranche horaire, contextes les plus fréquents, total sur 7 jours glissants.
 *
 * Jamais de courbe de progrès, d'objectif ni de comparaison entre semaines — le carnet observe,
 * il ne note pas (contrainte du plan). Les nombres affichés ici sont des faits sur les propres
 * saisies du patient (pas des seuils cliniques comme dans les modules cardio/diabète) : les
 * montrer n'est pas contraire à l'invariant « jamais de chiffre à l'écran » de ces modules, qui
 * vise à éviter une fausse précision pédagogique, pas à cacher au patient ses propres données.
 */

export interface CarnetEntry {
  id: string;
  /** Format `datetime-local` (`YYYY-MM-DDTHH:mm`), toujours en heure locale du patient. */
  dateHeure: string;
  contexte: string;
  ressenti: string;
}

export type TrancheHoraire = 'matin' | 'midi' | 'apres-midi' | 'soir';

export const TRANCHE_ORDER: TrancheHoraire[] = ['matin', 'midi', 'apres-midi', 'soir'];

export const TRANCHE_LABELS: Record<TrancheHoraire, string> = {
  matin: 'Matin',
  midi: 'Midi',
  'apres-midi': 'Après-midi',
  soir: 'Soir',
};

/** Sous ce nombre de saisies (sur 7 jours), pas de synthèse affichée : avec 1-2 entrées, un
 *  agrégat donnerait l'illusion d'un motif là où il n'y en a pas encore (contrainte du plan). */
export const VOLUME_MIN_SYNTHESE = 5;

export interface ContexteFrequent {
  /** Libellé tel que saisi la première fois (regroupement insensible à la casse/aux espaces). */
  libelle: string;
  count: number;
}

export interface SyntheseCarnet {
  total7Jours: number;
  parTranche: Record<TrancheHoraire, number>;
  /** Jusqu'à 3 contextes, du plus fréquent au moins fréquent. Vide si aucun contexte saisi. */
  topContextes: ContexteFrequent[];
}

/** Bandes horaires simples, la nuit tombant dans « soir » (18h-4h59, pas de 5ᵉ tranche « nuit »
 *  pour rester lisible — un fumeur nocturne se reconnaît déjà dans « soir »). */
function trancheDeHeure(heure: number): TrancheHoraire {
  if (heure >= 5 && heure <= 11) return 'matin';
  if (heure >= 12 && heure <= 13) return 'midi';
  if (heure >= 14 && heure <= 17) return 'apres-midi';
  return 'soir';
}

/** Regroupement tolérant (S4/S5 du plan) : espaces superflus et casse ignorés, sans quoi « Café »,
 *  « café » et « café  » compteraient comme 3 contextes distincts et le top 3 serait illisible. */
function normaliserContexte(contexte: string): string {
  return contexte.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Entrées dont `dateHeure` tombe dans les 7 jours glissants se terminant à `maintenant`
 *  (bornes incluses). `maintenant` est un paramètre (pas `new Date()` implicite) pour que les
 *  tests restent déterministes. */
export function entreesSur7Jours(entries: CarnetEntry[], maintenant: Date): CarnetEntry[] {
  const fin = maintenant.getTime();
  const debut = fin - 7 * 24 * 60 * 60 * 1000;
  return entries.filter((entry) => {
    const t = new Date(entry.dateHeure).getTime();
    return !Number.isNaN(t) && t >= debut && t <= fin;
  });
}

/** `null` tant que le volume de saisies (sur 7 jours) n'atteint pas `VOLUME_MIN_SYNTHESE`. */
export function syntheseCarnet(entries: CarnetEntry[], maintenant: Date = new Date()): SyntheseCarnet | null {
  const recentes = entreesSur7Jours(entries, maintenant);
  if (recentes.length < VOLUME_MIN_SYNTHESE) return null;

  const parTranche: Record<TrancheHoraire, number> = { matin: 0, midi: 0, 'apres-midi': 0, soir: 0 };
  const contextes = new Map<string, ContexteFrequent>();

  for (const entry of recentes) {
    const d = new Date(entry.dateHeure);
    if (!Number.isNaN(d.getTime())) {
      parTranche[trancheDeHeure(d.getHours())] += 1;
    }
    const brut = entry.contexte.trim();
    if (!brut) continue;
    const cle = normaliserContexte(brut);
    const existant = contextes.get(cle);
    if (existant) existant.count += 1;
    else contextes.set(cle, { libelle: brut, count: 1 });
  }

  const topContextes = Array.from(contextes.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return { total7Jours: recentes.length, parTranche, topContextes };
}
