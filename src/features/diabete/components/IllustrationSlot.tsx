import { useState } from 'react';
import styles from './IllustrationSlot.module.css';

interface IllustrationSlotProps {
  /** Identifiant du fichier attendu dans public/illustrations/diabete/<id>.png */
  id: string;
  /** Libellé affiché dans le placeholder et utilisé comme alt de l'image. */
  label: string;
  shape?: 'circle' | 'rounded';
  /** Taille (côté du carré, en px). */
  size?: number;
}

/**
 * Emplacement d'illustration du thème diabète. Aucune image n'existe encore : le
 * placeholder (tuile crème, bord fin, libellé centré) est l'état normal, pas une
 * erreur — il sera automatiquement remplacé dès que public/illustrations/diabete/<id>.png
 * existera. Même rôle que les `image-slot` de la maquette.
 */
export default function IllustrationSlot({ id, label, shape = 'rounded', size = 96 }: IllustrationSlotProps) {
  const [errored, setErrored] = useState(false);
  const shapeClass = shape === 'circle' ? styles.shapeCircle : styles.shapeRounded;
  const dimensionStyle = { width: size, height: size };

  if (errored) {
    const labelClass = size < 56 ? `${styles.placeholderLabel} ${styles.placeholderLabelHidden}` : styles.placeholderLabel;
    return (
      <div
        className={`${styles.placeholder} ${shapeClass}`}
        style={dimensionStyle}
        role="img"
        aria-label={label}
      >
        <span className={labelClass}>{label}</span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}illustrations/diabete/${id}.png`}
      alt={label}
      className={`${styles.image} ${shapeClass}`}
      style={dimensionStyle}
      onError={() => setErrored(true)}
    />
  );
}
