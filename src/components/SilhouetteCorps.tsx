import type { ReactNode } from 'react';
import { Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from './SilhouetteCorps.module.css';

/**
 * LA SILHOUETTE-CORPS (brief §1.3) — un seul dessin, réutilisable par n'importe quel thème
 * (moteur générique, ne connaît aucun thème par son nom). Le corps est un tracé SVG purement
 * décoratif (aria-hidden) ; chaque zone cliquable est une vraie balise <button> HTML positionnée
 * par-dessus (cible ≥ 44 px, focus clavier), jamais un élément SVG <g role="button">, pour un vrai
 * focus natif. Zones (id, libellé, ancre, état) fournies par le thème consommateur.
 */

export type SilhouetteEtat = 'actif' | 'ouvert' | 'verrouille' | 'allume' | 'masque';

export interface SilhouetteZone {
  id: string; // libre — le thème choisit ses ids
  label: string;
  x: number;
  y: number;
  r: number; // ancre dans le repère SILHOUETTE_VIEWBOX
  etat: SilhouetteEtat;
}

/** Repère fixe du dessin (partagé par tous les thèmes consommateurs). */
export const SILHOUETTE_VIEWBOX = { width: 340, height: 760 };

export interface SilhouetteCorpsProps {
  zones: SilhouetteZone[];
  onZoneClick?: (id: string) => void;
  /** Motif central discret (le trait « vaisseaux » actuel) — optionnel, activé par défaut
   *  pour ne rien changer côté diabète. */
  motifVaisseaux?: boolean;
  /** URL d'une illustration PNG carrée à afficher en fond à la place du corps SVG codé.
   *  Si fournie : le conteneur passe en carré (1:1), et les zones passent en mode hotspot
   *  (bouton transparent + halo au survol/actif, aucun cercle permanent) — dans ce mode,
   *  `x`/`y` de chaque zone sont interprétés comme des pourcentages (0–100) de l'image,
   *  et non plus comme des coordonnées du repère `SILHOUETTE_VIEWBOX`. Si absent, le rendu
   *  (corps SVG codé + pastilles pleines) reste strictement inchangé. */
  bodyImage?: string;
  /** Annotations posées par le thème consommateur, positionnées par lui-même à l'aide de
   *  `SILHOUETTE_VIEWBOX` exporté (mode corps codé) ou de pourcentages (mode `bodyImage`). */
  children?: ReactNode;
}

const { width: VB_W, height: VB_H } = SILHOUETTE_VIEWBOX;

export default function SilhouetteCorps({
  zones,
  onZoneClick,
  motifVaisseaux = true,
  bodyImage,
  children,
}: SilhouetteCorpsProps) {
  return (
    <div className={`${styles.wrap} ${bodyImage ? styles.wrapImage : ''}`}>
      {bodyImage ? (
        <img src={bodyImage} className={styles.bodyImg} alt="" aria-hidden="true" />
      ) : (
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          aria-hidden="true"
          focusable="false"
        >
          {/* Fil rouge discret : motif « vaisseaux protégés » central (brief §1.6), sobre. */}
          {motifVaisseaux && (
            <path
              d="M170,120 C150,190 190,260 165,330 C145,390 195,430 170,470 C150,520 190,560 170,610"
              className={styles.vaisseaux}
            />
          )}

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
      )}

      {zones
        .filter((z) => z.etat !== 'masque')
        .map((z) => {
          const size = Math.max(44, z.r * 2);
          const leftPct = bodyImage ? z.x : (z.x / VB_W) * 100;
          const topPct = bodyImage ? z.y : (z.y / VB_H) * 100;
          const isLocked = z.etat === 'verrouille';
          const ariaLabel = isLocked ? `${z.label} — déjà vu, verrouillé` : z.label;

          if (bodyImage) {
            return (
              <button
                key={z.id}
                type="button"
                className={`${styles.hotspot} ${styles[`hotspot--${z.etat}`]}`}
                style={{ left: `${leftPct}%`, top: `${topPct}%`, width: size, height: size }}
                disabled={isLocked}
                aria-label={ariaLabel}
                onClick={onZoneClick ? () => onZoneClick(z.id) : undefined}
              />
            );
          }

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
                aria-label={ariaLabel}
                onClick={onZoneClick ? () => onZoneClick(z.id) : undefined}
              >
                {z.etat === 'verrouille' && <Lock size={16} aria-hidden="true" />}
                {z.etat === 'ouvert' && <CheckCircle2 size={16} aria-hidden="true" />}
                {z.etat === 'allume' && <ShieldCheck size={16} aria-hidden="true" />}
              </button>
              <span className={styles.label}>{z.label}</span>
            </div>
          );
        })}

      {children}
    </div>
  );
}
