import { useState } from 'react';
import styles from './SubstitutsModule.module.css';

type FormeId = 'patch' | 'gomme' | 'pastille' | 'sublingual' | 'spray' | 'vapoteuse';

/** Cible `public/illustrations/tabac/substitut-<forme>.png` (chantier illustrations-tabac, S1). */
export default function TechniqueIllustration({
  forme,
  label,
}: {
  forme: FormeId;
  label: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
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

  return (
    <div className={styles.techniqueCard}>
      <img
        src={`${import.meta.env.BASE_URL}illustrations/tabac/substitut-${forme}.png`}
        alt={`Technique de prise : ${label}`}
        className={styles.techniqueImage}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
