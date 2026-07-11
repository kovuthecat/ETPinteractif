import type { ReactNode } from 'react';
import SilhouetteCorps, {
  SILHOUETTE_VIEWBOX,
  type SilhouetteEtat,
  type SilhouetteZone,
} from '../../../components/SilhouetteCorps';

/**
 * Wrapper fin diabète autour du composant générique `SilhouetteCorps` (S2, promotion moteur —
 * voir plans/approfondissement-tabac/index.md §Décision silhouette). API strictement inchangée
 * pour les 9 modules diabète consommateurs : ancres et libellés diabète restent définis ici.
 */

export type ZoneId = 'cerveau' | 'yeux' | 'coeur' | 'cou' | 'reins' | 'nerfs' | 'jambes' | 'pied';

export type ZoneEtat = SilhouetteEtat;

export interface SilhouetteZoneState {
  id: ZoneId;
  etat: ZoneEtat;
}

export interface SilhouetteProps {
  zones: SilhouetteZoneState[];
  onZoneClick?: (id: ZoneId) => void;
  /** Annotations posées par le module consommateur (ex. pastille PlaqueArtere), positionnées
   *  par le module lui-même à l'aide de `SILHOUETTE_ANCHORS` (x/y en % de l'image). */
  children?: ReactNode;
}

/** Repère fixe du dessin (partagé par tous les modules consommateurs). */
export { SILHOUETTE_VIEWBOX };

/** Position (centre, en % de l'image carrée `bodyImage`) et rayon (px, taille d'emprise du
 *  hotspot) de chaque ancre nommée — valeurs calées au diagnostic, cf.
 *  plans/illustrations-diabete/index.md §7. Le nerf est positionné sur la main (validé). */
export const SILHOUETTE_ANCHORS: Record<ZoneId, { x: number; y: number; r: number }> = {
  cerveau: { x: 50, y: 7, r: 24 },
  yeux: { x: 50, y: 10, r: 22 },
  cou: { x: 50, y: 16, r: 22 },
  coeur: { x: 49, y: 26, r: 30 },
  reins: { x: 50, y: 39, r: 26 },
  nerfs: { x: 31, y: 54, r: 24 },
  jambes: { x: 46, y: 63, r: 30 },
  pied: { x: 50, y: 94, r: 28 },
};

const BODY_IMAGE = `${import.meta.env.BASE_URL}illustrations/diabete/silhouette.png`;

const ZONE_LABELS: Record<ZoneId, string> = {
  cerveau: 'Cerveau',
  yeux: 'Yeux',
  cou: 'Cou',
  coeur: 'Cœur',
  nerfs: 'Nerfs',
  reins: 'Reins',
  jambes: 'Jambes',
  pied: 'Pied',
};

export default function Silhouette({ zones, onZoneClick, children }: SilhouetteProps) {
  const zonesGeneriques: SilhouetteZone[] = zones.map((z) => {
    const anchor = SILHOUETTE_ANCHORS[z.id];
    return {
      id: z.id,
      label: ZONE_LABELS[z.id],
      x: anchor.x,
      y: anchor.y,
      r: anchor.r,
      etat: z.etat,
    };
  });

  return (
    <SilhouetteCorps
      zones={zonesGeneriques}
      onZoneClick={onZoneClick ? (id) => onZoneClick(id as ZoneId) : undefined}
      bodyImage={BODY_IMAGE}
    >
      {children}
    </SilhouetteCorps>
  );
}
