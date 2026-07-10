import styles from './SubstitutsModule.module.css';

type FormeId = 'patch' | 'gomme' | 'pastille' | 'sublingual' | 'spray' | 'vapoteuse';

/**
 * Une entrée non-null désigne l'import d'un asset local (`src`) déposé sous ce dossier.
 * Toutes les formes sont à `null` tant que les illustrations n'ont pas été fournies :
 * seul point à modifier quand elles arrivent, aucun appelant à retoucher.
 * `vapoteuse` cible `public/illustrations/tabac/substitut-vapoteuse.png` (prompt fourni en S7).
 */
const ILLUSTRATIONS: Record<FormeId, string | null> = {
  patch: null,
  gomme: null,
  pastille: null,
  sublingual: null,
  spray: null,
  vapoteuse: null,
};

export default function TechniqueIllustration({
  forme,
  label,
}: {
  forme: FormeId;
  label: string;
}) {
  const src = ILLUSTRATIONS[forme];

  if (src) {
    return (
      <div className={styles.techniqueCard}>
        <img src={src} alt={`Technique de prise : ${label}`} className={styles.techniqueImage} />
      </div>
    );
  }

  return (
    <div className={styles.techniqueCard}>
      <div className={styles.techniquePlaceholder}>
        <span className={styles.techniqueLabel}>
          illustration · technique de prise « {label} »
        </span>
      </div>
    </div>
  );
}
