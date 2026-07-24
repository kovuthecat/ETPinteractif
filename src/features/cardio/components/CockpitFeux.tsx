import type { ComponentType, CSSProperties } from 'react';
import { FEU_TOKEN_STYLE, cumulMultiplicatif, type Feu } from '../lib/risqueCardio';
import RisqueBarre from '../../../components/RisqueBarre';
import styles from './CockpitFeux.module.css';

/**
 * Tableau de feux + cumul multiplicatif (C4, D1/D2) — reprend le pattern
 * `diabete/risque-cardio/RisqueCardioModule.tsx` (chips-boutons `.chipFeu`, couleur d'état
 * portée par bordure/fond + largeur de bordure croissante, jamais par l'icône seule — invariant
 * a11y CVD2-S2), enrichi de la barre de risque **multiplicative** (`cumulMultiplicatif`, C3).
 * Aucun contenu de module en dur : facteurs, libellés et icônes sont fournis par l'appelant.
 *
 * Cible ≥ 44 px (`var(--target-min)`), nom accessible = libellé texte toujours visible à côté de
 * l'icône (jamais seulement porté par `aria-label`).
 *
 * Cyclage : ce composant ne fait qu'appeler `onCycle(id)` au clic (comme
 * `RisqueCardioModule#cycleFactor`) — c'est l'appelant qui décide de la transition (typiquement
 * via `NEXT_ETAT` de la lib), afin que ce composant reste un pur composant de présentation.
 *
 * S7 (plans/refonte-audit-2026-07/S7.md, A10) : la barre elle-même est extraite dans
 * `src/components/RisqueBarre.tsx` (générique, agnostique du thème) pour être rétro-portée vers
 * `diabete/risque-cardio/RisqueCardioModule.tsx` — le calcul du score (`cumulMultiplicatif`,
 * spécifique au modèle multiplicatif cardio) reste ici, inchangé.
 */

export interface FacteurCockpit {
  id: string;
  label: string;
  Icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
}

export interface CockpitFeuxProps {
  /** Facteurs affichés, dans l'ordre d'affichage. */
  facteurs: FacteurCockpit[];
  /** État courant de chaque facteur (clé = `FacteurCockpit.id`). */
  feux: Record<string, Feu>;
  /** Appelé au clic sur un chip ; l'appelant applique la transition (ex. `NEXT_ETAT[etat]`). */
  onCycle: (id: string) => void;
  /** Masque la barre de risque cumulée (affichée par défaut, D2). */
  showBarre?: boolean;
  className?: string;
}

function feuStyleVars(etat: Feu): CSSProperties {
  const t = FEU_TOKEN_STYLE[etat];
  return { '--feu-fg': t.fg, '--feu-soft': t.soft, '--feu-border-width': t.borderWidth } as CSSProperties;
}

export default function CockpitFeux({ facteurs, feux, onCycle, showBarre = true, className }: CockpitFeuxProps) {
  const etats = facteurs.map((f) => feux[f.id] ?? 'vert');
  const { score } = cumulMultiplicatif(etats);
  // Position du curseur seulement : jamais de chiffre imprimé à l'écran (index.md « aucun score
  // de risque calculé affiché ») — seul un aria-label (non visuel) porte le pourcentage, comme le
  // fait déjà `artereImgWrap` côté diabète.
  const scorePct = Math.round(score * 100);

  return (
    <div className={`${styles.cockpit} ${className ?? ''}`}>
      <div className={styles.chipsRow}>
        {facteurs.map((f) => {
          const etat = feux[f.id] ?? 'vert';
          return (
            <button
              key={f.id}
              type="button"
              className={styles.chipFeu}
              style={feuStyleVars(etat)}
              onClick={() => onCycle(f.id)}
              aria-pressed={etat !== 'vert'}
            >
              <f.Icon size={22} aria-hidden />
              {f.label}
            </button>
          );
        })}
      </div>

      {showBarre && (
        <RisqueBarre
          score={score}
          ariaLabel={`Risque cumulé : ${scorePct} % — les facteurs se multiplient, ils ne s'additionnent pas`}
        />
      )}
    </div>
  );
}
