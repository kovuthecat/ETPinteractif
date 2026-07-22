import type { ReactNode } from 'react';
import SilhouetteCorps, {
  SILHOUETTE_VIEWBOX,
  type SilhouetteEtat,
  type SilhouetteZone,
} from '../../../components/SilhouetteCorps';

/**
 * Wrapper fin cardio (C4, plans/theme-cardio-2026-07/S2.md) autour du composant générique
 * `SilhouetteCorps` (moteur, réutilisé tel quel — D1) — sur le modèle de
 * `diabete/components/Silhouette.tsx` : ancres et libellés cardio définis ici, le corps/les
 * hotspots restent le moteur générique.
 *
 * Zones (cœur/cerveau/jambes/reins) et ancres reprises du prototype (`ZA`, ligne 737) :
 * `{coeur:{x:49,y:26}, cerveau:{x:50,y:7}, jambes:{x:46,y:63}, reins:{x:50,y:39}}`.
 */

export type ZoneId = 'coeur' | 'cerveau' | 'jambes' | 'reins';

export type ZoneEtat = SilhouetteEtat;

export interface SilhouetteZoneState {
  id: ZoneId;
  etat: ZoneEtat;
}

export interface SilhouetteProps {
  zones: SilhouetteZoneState[];
  onZoneClick?: (id: ZoneId) => void;
  /** Annotations posées par le module consommateur (ex. pastille de plaque), positionnées par le
   *  module lui-même à l'aide de `SILHOUETTE_ANCHORS` (x/y en % de l'image). */
  children?: ReactNode;
}

/** Repère fixe du dessin (partagé par tous les modules consommateurs). */
export { SILHOUETTE_VIEWBOX };

/** Position (centre, en % de l'image carrée `bodyImage`) et rayon (px, taille d'emprise du
 *  hotspot) de chaque ancre nommée — coordonnées x/y reprises du prototype (`ZA`, ligne 737) ;
 *  rayons repris par analogie des ancres diabète équivalentes (même silhouette générique).
 *  `// à revalider (Thibault)` une fois `illustrations/cardio/silhouette.png` livré (S3). */
export const SILHOUETTE_ANCHORS: Record<ZoneId, { x: number; y: number; r: number }> = {
  cerveau: { x: 50, y: 7, r: 24 },
  coeur: { x: 49, y: 26, r: 30 },
  reins: { x: 50, y: 39, r: 26 },
  jambes: { x: 46, y: 63, r: 30 },
};

const BODY_IMAGE = `${import.meta.env.BASE_URL}illustrations/cardio/silhouette.png`;

const ZONE_LABELS: Record<ZoneId, string> = {
  cerveau: 'Cerveau',
  coeur: 'Cœur',
  reins: 'Reins',
  jambes: 'Jambes',
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
