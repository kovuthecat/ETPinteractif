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
   *  par le module lui-même à l'aide de `SILHOUETTE_ANCHORS`/`SILHOUETTE_VIEWBOX` exportés. */
  children?: ReactNode;
}

/** Repère fixe du dessin (partagé par tous les modules consommateurs). */
export { SILHOUETTE_VIEWBOX };

/** Position (centre) et rayon de chaque ancre nommée, dans le repère SILHOUETTE_VIEWBOX. */
export const SILHOUETTE_ANCHORS: Record<ZoneId, { x: number; y: number; r: number }> = {
  cerveau: { x: 170, y: 55, r: 24 },
  yeux: { x: 190, y: 70, r: 22 },
  cou: { x: 170, y: 108, r: 22 },
  coeur: { x: 150, y: 230, r: 30 },
  nerfs: { x: 258, y: 300, r: 24 },
  reins: { x: 170, y: 340, r: 26 },
  jambes: { x: 170, y: 520, r: 30 },
  pied: { x: 170, y: 700, r: 28 },
};

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
    >
      {children}
    </SilhouetteCorps>
  );
}
