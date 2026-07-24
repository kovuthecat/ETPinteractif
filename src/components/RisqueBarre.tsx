import styles from './RisqueBarre.module.css';

/**
 * Barre de risque de synthèse « Risque faible → Risque élevé » (S7,
 * plans/refonte-audit-2026-07/S7.md, A10) — extraite de
 * `features/cardio/components/CockpitFeux.tsx` (seule consommatrice jusqu'ici) pour être
 * partagée avec `features/diabete/risque-cardio/RisqueCardioModule.tsx`.
 *
 * Composant générique agnostique du thème (invariant 4, CLAUDE.md) : il ne calcule rien — il ne
 * fait qu'afficher un curseur sur un dégradé, à partir d'un `score` 0..1 déjà calculé par
 * l'appelant. Les modèles de cumul cardio (multiplicatif, `cumulMultiplicatif`) et diabète
 * (moyenne pondérée des feux) sont **incompatibles** et ne sont pas partagés ici (cf. S7 « Si
 * bloqué ») — seule l'UI de la barre est commune.
 *
 * Jamais de chiffre affiché à l'écran (invariant « aucun score de risque calculé affiché ») : le
 * pourcentage n'existe que dans `ariaLabel`, lu par un lecteur d'écran — jamais comme texte
 * visible, à l'identique du pattern déjà en place pour `ArtereCoupe`/`PlaqueArtere`.
 */

export interface RisqueBarreProps {
  /** Score de risque cumulé, 0 (faible) → 1 (élevé), déjà calculé par l'appelant. */
  score: number;
  /** Libellé accessible du curseur (rôle `img`) — porte le seul pourcentage, non visuel. */
  ariaLabel: string;
  className?: string;
}

export default function RisqueBarre({ score, ariaLabel, className }: RisqueBarreProps) {
  const pct = Math.round(Math.min(1, Math.max(0, score)) * 100);

  return (
    <div className={`${styles.barreWrap} ${className ?? ''}`} role="img" aria-label={ariaLabel}>
      <div className={styles.barreLabels}>
        <span>Risque faible</span>
        <span>Risque élevé</span>
      </div>
      <div className={styles.barre}>
        <div className={styles.barreCurseur} style={{ left: `${pct}%` }} />
      </div>
    </div>
  );
}
