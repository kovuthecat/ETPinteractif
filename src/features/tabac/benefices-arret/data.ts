/**
 * Données du module « Ce que l'arrêt répare » (plan approfondissement-tabac/S5.md).
 * Registre positif et factuel : on ne montre jamais l'organe malade, seulement ce qui
 * va mieux. Zones passées à SilhouetteCorps + chronologie des jalons de l'arrêt.
 */

export type ZoneId = 'cerveau' | 'bouche' | 'coeur' | 'poumons' | 'sang' | 'peau' | 'jambes';

export interface ZoneDef {
  id: ZoneId;
  label: string;
  x: number;
  y: number;
  r: number;
  /** Libellé utilisé par IllustrationSlot (id `benef-<zone>`) et le panneau de détail. */
  illustrationLabel: string;
}

// Ancres dans le repère SILHOUETTE_VIEWBOX (340×760, cf. SilhouetteCorps.tsx). Table de
// départ du plan S5 : cerveau/bouche et coeur/poumons se chevauchaient à l'écran — ancres
// ajustées ici (valeurs finales consignées dans plans/approfondissement-tabac/S5.md §Statut).
export const ZONES: ZoneDef[] = [
  { id: 'cerveau', label: 'Cerveau', x: 170, y: 48, r: 22, illustrationLabel: 'Cerveau apaisé' },
  { id: 'bouche', label: 'Goût & odorat', x: 170, y: 96, r: 16, illustrationLabel: 'Goût et odorat retrouvés' },
  { id: 'coeur', label: 'Cœur', x: 142, y: 232, r: 24, illustrationLabel: 'Cœur soulagé' },
  { id: 'poumons', label: 'Poumons', x: 202, y: 206, r: 24, illustrationLabel: 'Poumons qui respirent' },
  { id: 'sang', label: 'Sang & vaisseaux', x: 88, y: 300, r: 22, illustrationLabel: 'Sang mieux oxygéné' },
  { id: 'peau', label: 'Peau', x: 252, y: 300, r: 22, illustrationLabel: 'Peau qui s’éclaircit' },
  { id: 'jambes', label: 'Jambes & circulation', x: 170, y: 520, r: 30, illustrationLabel: 'Jambes qui repartent' },
];

export const ZONES_BY_ID: Record<ZoneId, ZoneDef> = Object.fromEntries(
  ZONES.map((z) => [z.id, z]),
) as Record<ZoneId, ZoneDef>;

export interface Jalon {
  echeance: string;
  zones: ZoneId[];
  texte: string;
}

// chiffres à revalider (Thibault) — source : Tabac Info Service / OMS. Contenu verbatim du
// plan S5 (§Les jalons) : ne pas reformuler le texte des bénéfices.
export const JALONS: Jalon[] = [
  {
    echeance: '20 minutes',
    zones: ['coeur'],
    texte: 'La pression artérielle et la fréquence cardiaque redeviennent normales.',
  },
  {
    echeance: '8 heures',
    zones: ['sang'],
    texte:
      "Le monoxyde de carbone dans le sang diminue de moitié. L'oxygénation des cellules redevient normale.",
  },
  {
    echeance: '24 heures',
    zones: ['poumons', 'coeur'],
    texte:
      "Le monoxyde de carbone est totalement éliminé. Les poumons commencent à évacuer le mucus et les résidus de fumée. Le risque d'infarctus commence déjà à baisser.",
  },
  {
    echeance: '48 heures',
    zones: ['bouche'],
    texte:
      "Le goût et l'odorat s'améliorent : les terminaisons nerveuses du goût commencent à repousser.",
  },
  {
    echeance: '72 heures',
    zones: ['poumons'],
    texte: "Respirer devient plus facile : les bronches se relâchent, l'énergie augmente.",
  },
  {
    echeance: '2 semaines à 3 mois',
    zones: ['jambes', 'peau'],
    texte:
      'La circulation sanguine s’améliore, la marche et l’effort deviennent plus faciles. Le teint s’éclaircit.',
  },
  {
    echeance: '1 à 9 mois',
    zones: ['poumons'],
    texte: 'La toux et la fatigue diminuent. Les cils bronchiques repoussent, le souffle revient.',
  },
  {
    echeance: '1 an',
    zones: ['coeur'],
    texte: "Le risque d'infarctus du myocarde diminue de moitié.",
  },
  {
    echeance: '5 ans',
    zones: ['cerveau', 'bouche'],
    texte:
      "Le risque d'accident vasculaire cérébral rejoint celui d'une personne n'ayant jamais fumé. Le risque de cancers de la bouche, de la gorge et de l'œsophage diminue de moitié.",
  },
  {
    echeance: '10 à 15 ans',
    zones: ['poumons', 'coeur'],
    texte:
      "Le risque de cancer du poumon diminue de moitié. Le risque de maladie cardiaque et l'espérance de vie rejoignent ceux des personnes n'ayant jamais fumé.",
  },
];

export const DERNIER_JALON_INDEX = JALONS.length - 1;

export interface BeneficeZone {
  jalonIndex: number;
  echeance: string;
  texte: string;
}

/** Dérive, pour une zone donnée, tous les bénéfices qui la concernent (ordre chronologique). */
export function beneficesDeZone(zoneId: ZoneId): BeneficeZone[] {
  return JALONS.reduce<BeneficeZone[]>((acc, jalon, index) => {
    if (jalon.zones.includes(zoneId)) {
      acc.push({ jalonIndex: index, echeance: jalon.echeance, texte: jalon.texte });
    }
    return acc;
  }, []);
}
