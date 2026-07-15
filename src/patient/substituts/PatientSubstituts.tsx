import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FORMES_DATA, type FormeId } from '../../content/tabac/substituts';
import styles from './PatientSubstituts.module.css';

interface PatientSubstitutsProps {
  /** Retour à l'accueil de l'app patient (géré par PatientApp). */
  onBack: () => void;
}

const FORME_IDS = Object.keys(FORMES_DATA) as FormeId[];

/**
 * Illustration locale, propre à l'app patient : `IllustrationSlot` (src/features/tabac/components/)
 * n'est pas importée ici pour ne jamais faire dépendre le bundle patient de l'arbre
 * `src/features/**` (contrainte dure du plan aide-patient, cf. index.md §Architecture cible).
 * Deux usages, deux images distinctes (E1) :
 * - `variant="produit"` → `public/illustrations/tabac/produit-<forme>.png` (visuel produit carré,
 *   lisible à 72 px, grille « Mes substituts »).
 * - `variant="schema"` → `public/illustrations/tabac/substitut-<forme>.png` (schéma multi-étapes,
 *   même convention que TechniqueIllustration côté consultation, écran de détail).
 * Fallback discret si l'image n'existe pas encore pour une forme.
 */
function FormeIllustration({
  forme,
  label,
  variant,
}: {
  forme: FormeId;
  label: string;
  variant: 'produit' | 'schema';
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={styles.illustrationFallback} role="img" aria-label={label}>
        <span>{label}</span>
      </div>
    );
  }

  const fichier = variant === 'produit' ? `produit-${forme}` : `substitut-${forme}`;

  return (
    <img
      src={`${import.meta.env.BASE_URL}illustrations/tabac/${fichier}.png`}
      alt={label}
      className={styles.illustration}
      onError={() => setErrored(true)}
    />
  );
}

/**
 * Écran patient « Mes substituts » : liste des 6 formes → détail (bonnes pratiques / erreurs),
 * auto-portant (lisible sans soignant à côté). Contenu clinique repris tel quel de
 * `src/content/tabac/substituts.ts` ; seul l'habillage (intro, libellés de section) est ajouté ici.
 */
export default function PatientSubstituts({ onBack }: PatientSubstitutsProps) {
  const [selectedForme, setSelectedForme] = useState<FormeId | null>(null);

  if (selectedForme) {
    const forme = FORMES_DATA[selectedForme];
    return (
      <div className={styles.screen}>
        <button
          type="button"
          className={`btn btn--ghost ${styles.back}`}
          onClick={() => setSelectedForme(null)}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Retour
        </button>
        <h1 className={styles.titre}>{forme.label}</h1>
        <div className={styles.illustrationWrap}>
          <FormeIllustration forme={selectedForme} label={forme.label} variant="schema" />
        </div>
        <section className={`${styles.panel} ${styles.panelBonnes}`}>
          <h2 className={styles.panelTitle}>À faire</h2>
          <ul className={styles.panelList}>
            {forme.bonnesPratiques.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
        <section className={`${styles.panel} ${styles.panelErreurs}`}>
          <h2 className={styles.panelTitle}>À éviter</h2>
          <ul className={styles.panelList}>
            {forme.erreurs.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <button type="button" className={`btn btn--ghost ${styles.back}`} onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" />
        Accueil
      </button>
      <h1 className={styles.titre}>Mes substituts</h1>
      {/* à revalider (Thibault) : phrase de cadrage auto-portante (patient seul, pas de soignant présent) */}
      <p className={styles.intro}>
        Choisissez le substitut qu'on a vu ensemble pour revoir comment l'utiliser.
      </p>
      <div className={styles.grid}>
        {FORME_IDS.map((forme) => (
          <button
            key={forme}
            type="button"
            className={styles.card}
            onClick={() => setSelectedForme(forme)}
          >
            <span className={styles.cardIllustration}>
              <FormeIllustration forme={forme} label={FORMES_DATA[forme].label} variant="produit" />
            </span>
            <span className={styles.cardLabel}>{FORMES_DATA[forme].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
