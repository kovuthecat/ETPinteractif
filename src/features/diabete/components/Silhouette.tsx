import type { ReactNode } from 'react';
import { Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from './Silhouette.module.css';

/**
 * LA SILHOUETTE-CORPS (brief §1.3) — un seul dessin, réutilisé aux modules 5 (menace),
 * 6 (porte optionnelle « surveillé ») et 7 (défendu), plus l'anatomie du module 4.
 * Le corps est un tracé SVG purement décoratif (aria-hidden) ; chaque zone cliquable est
 * une vraie balise <button> HTML positionnée par-dessus (cible ≥ 44 px, focus clavier),
 * jamais un élément SVG <g role="button">, pour un vrai focus natif.
 */

export type ZoneId = 'cerveau' | 'yeux' | 'coeur' | 'cou' | 'reins' | 'nerfs' | 'jambes' | 'pied';

export type ZoneEtat = 'actif' | 'ouvert' | 'verrouille' | 'allume' | 'masque';

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
export const SILHOUETTE_VIEWBOX = { width: 340, height: 760 };

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

const { width: VB_W, height: VB_H } = SILHOUETTE_VIEWBOX;

export default function Silhouette({ zones, onZoneClick, children }: SilhouetteProps) {
  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        aria-hidden="true"
        focusable="false"
      >
        {/* Fil rouge discret : motif « vaisseaux protégés » central (brief §1.6), sobre. */}
        <path
          d="M170,120 C150,190 190,260 165,330 C145,390 195,430 170,470 C150,520 190,560 170,610"
          className={styles.vaisseaux}
        />

        {/* Tête */}
        <circle cx={170} cy={60} r={44} className={styles.corps} />
        {/* Cou */}
        <rect x={152} y={95} width={36} height={35} rx={10} className={styles.corps} />
        {/* Torse (épaules → taille) */}
        <path
          d="M130,150 C90,150 70,180 72,230 C74,290 100,330 130,345 L210,345 C240,330 266,290 268,230 C270,180 250,150 210,150 Z"
          className={styles.corps}
        />
        {/* Bassin */}
        <rect x={118} y={335} width={104} height={70} rx={30} className={styles.corps} />

        {/* Bras (contour + remplissage, technique double-trait) */}
        <line x1={110} y1={165} x2={68} y2={420} className={styles.membreContour} />
        <line x1={110} y1={165} x2={68} y2={420} className={styles.membreRemplissage} />
        <line x1={230} y1={165} x2={272} y2={420} className={styles.membreContour} />
        <line x1={230} y1={165} x2={272} y2={420} className={styles.membreRemplissage} />

        {/* Jambes */}
        <line x1={148} y1={380} x2={140} y2={690} className={styles.jambeContour} />
        <line x1={148} y1={380} x2={140} y2={690} className={styles.jambeRemplissage} />
        <line x1={192} y1={380} x2={200} y2={690} className={styles.jambeContour} />
        <line x1={192} y1={380} x2={200} y2={690} className={styles.jambeRemplissage} />

        {/* Pieds */}
        <ellipse cx={140} cy={703} rx={30} ry={16} className={styles.corps} />
        <ellipse cx={200} cy={703} rx={30} ry={16} className={styles.corps} />
      </svg>

      {zones
        .filter((z) => z.etat !== 'masque')
        .map((z) => {
          const anchor = SILHOUETTE_ANCHORS[z.id];
          const label = ZONE_LABELS[z.id];
          const size = Math.max(44, anchor.r * 2);
          const leftPct = (anchor.x / VB_W) * 100;
          const topPct = (anchor.y / VB_H) * 100;
          const isLocked = z.etat === 'verrouille';

          return (
            <div
              key={z.id}
              className={styles.pin}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <button
                type="button"
                className={`${styles.pastille} ${styles[`pastille--${z.etat}`]}`}
                style={{ width: size, height: size }}
                disabled={isLocked}
                aria-label={isLocked ? `${label} — déjà vu, verrouillé` : label}
                onClick={onZoneClick ? () => onZoneClick(z.id) : undefined}
              >
                {z.etat === 'verrouille' && <Lock size={16} aria-hidden="true" />}
                {z.etat === 'ouvert' && <CheckCircle2 size={16} aria-hidden="true" />}
                {z.etat === 'allume' && <ShieldCheck size={16} aria-hidden="true" />}
              </button>
              <span className={styles.label}>{label}</span>
            </div>
          );
        })}

      {children}
    </div>
  );
}
