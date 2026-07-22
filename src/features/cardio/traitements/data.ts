import type { ZoneId } from '../components/Silhouette';

/**
 * Module 11 — Traitements (C17, plans/theme-cardio-2026-07/S13.md). Table classe → zones →
 * message, sur le modèle de `diabete/traitements/data.ts` : la zone d'action (durable) est
 * attachée à la **classe/rôle** du traitement, jamais à la molécule (étiquette fine saisie par
 * le soignant) — anti-obsolescence, et verrou anti-auto-prescription (on transcrit et explique,
 * on ne compare ni ne choisit aucune molécule).
 *
 * Contenu = `docs/cardio/CONTENU_cardio.md` §M11 (✅ validé G1, 2026-07-22).
 * ⚠️ Rappel G1 impératif : **aucune aspirine / antiagrégant** dans cette table (décision G1,
 * cohérence avec §M10) — ne pas en réintroduire une classe, même à titre d'exemple.
 */

export type ClasseFamille = 'antihypertenseur' | 'statine';

export interface ClasseTraitement {
  id: string;
  label: string;
  famille: ClasseFamille;
  /** Zones protégées (silhouette, état `'allume'`) — cf. Silhouette.tsx `ZoneId`. */
  zones: ZoneId[];
  /** Phrase principale (verbatim §M11 « Message(s) à l'écran »), affichée quand la ligne est
   *  sélectionnée. Commune aux 3 classes antihypertensives (le bénéfice vient surtout de la
   *  baisse de PA, §M11 « Calibrage ») et commune aux 2 classes hypolipémiantes. */
  message: string;
  /** 2ᵉ niveau (survol) « Quoi surveiller » — ton rassurant/observance (§M11). */
  watch: string;
}

// Message commun aux 3 classes antihypertensives — verbatim §M11 : « Baisser la pression
// protège le cœur, le cerveau et les reins. »
const MESSAGE_ANTIHYPERTENSEUR = 'Baisser la pression protège le cœur, le cerveau et les reins.';

// Message commun statine/ézétimibe — verbatim §M11 : « Elles stabilisent la plaque partout —
// le médicament le plus étudié au monde. »
const MESSAGE_STATINE = 'Elles stabilisent la plaque partout — le médicament le plus étudié au monde.';

const ZONES_ANTIHYPERTENSEUR: ZoneId[] = ['coeur', 'cerveau', 'reins'];
const ZONES_STATINE: ZoneId[] = ['coeur', 'cerveau', 'reins', 'jambes'];

export const CLASSES: ClasseTraitement[] = [
  {
    id: 'ieca',
    label: 'IEC / ARA2 (antihypertenseur)',
    famille: 'antihypertenseur',
    zones: ZONES_ANTIHYPERTENSEUR,
    message: MESSAGE_ANTIHYPERTENSEUR,
    // à revalider (Thibault) : §M11 ne détaille pas de texte « quoi surveiller » par sous-classe
    // (seule la protection rénale est sourcée, comme rationnel hors écran) — reformulation
    // prudente, cohérente avec ce rationnel (surveillance rénale de routine).
    watch: 'Quoi surveiller : tension et fonction rénale contrôlées par prise de sang, en routine.',
  },
  {
    id: 'inhibiteur_calcique',
    label: 'Inhibiteur calcique (antihypertenseur)',
    famille: 'antihypertenseur',
    zones: ZONES_ANTIHYPERTENSEUR,
    message: MESSAGE_ANTIHYPERTENSEUR,
    // à revalider (Thibault) : idem — non détaillé par §M11.
    watch: 'Quoi surveiller : peut donner des œdèmes des chevilles — sans gravité, à signaler si gênant.',
  },
  {
    id: 'thiazidique',
    label: 'Diurétique thiazidique (antihypertenseur)',
    famille: 'antihypertenseur',
    zones: ZONES_ANTIHYPERTENSEUR,
    message: MESSAGE_ANTIHYPERTENSEUR,
    // à revalider (Thibault) : idem — non détaillé par §M11.
    watch: 'Quoi surveiller : ionogramme (sel, potassium) contrôlé par prise de sang, en routine.',
  },
  {
    id: 'statine',
    label: 'Statine',
    famille: 'statine',
    zones: ZONES_STATINE,
    message: MESSAGE_STATINE,
    // Sourcé §M11 « 2ᵉ niveau (survol) » : douleurs musculaires / foie → messages rassurants
    // d'observance.
    watch: "Quoi surveiller : douleurs musculaires (rares) ou bilan hépatique — rien d'alarmant, c'est surveillé simplement.",
  },
  {
    id: 'ezetimibe',
    label: 'Ézétimibe',
    famille: 'statine',
    zones: ZONES_STATINE,
    message: MESSAGE_STATINE,
    // à revalider (Thibault) : §M11 ne détaille pas l'ézétimibe spécifiquement (regroupé avec
    // les statines) — reformulation prudente, générique.
    watch: 'Quoi surveiller : généralement bien toléré, parfois des troubles digestifs légers.',
  },
];

export function classById(id: string): ClasseTraitement {
  return CLASSES.find((c) => c.id === id) ?? CLASSES[0];
}

export interface Ligne {
  uid: string;
  molecule: string;
  classId: string;
}

let ligneUid = 0;
export function newLigne(molecule: string, classId: string): Ligne {
  ligneUid += 1;
  return { uid: `l${ligneUid}`, molecule, classId };
}

/** Ordonnance vide à l'ouverture (cf. `diabete/traitements/data.ts`). */
export function lignesInitiales(): Ligne[] {
  return [];
}
