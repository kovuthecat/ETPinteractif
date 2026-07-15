import { useState } from 'react';
import { AlertTriangle, Flame, Moon, Sun } from 'lucide-react';
import { FORMES_DATA, FORMES_PONCTUELLES, type FormeId } from '../content/tabac/substituts';
import styles from './TitrationPatch.module.css';

/**
 * Outil de titration du patch nicotinique, extrait de `SubstitutsModule` (E3a, revue-chrome-2026-07)
 * pour être réutilisable par les deux bundles (`variant="consultation"` aujourd'hui ; `variant="patient"`
 * dès S12). Vit sous `src/components/` : le bundle patient n'importe jamais `src/features/**`, seul le
 * contenu sous `src/content/tabac/` (déjà utilisé par l'app patient) est importé ici.
 *
 * La dose (quarts jour/nuit + bascule jour/nuit) est l'unique état destiné à être persisté plus tard
 * (S11 : `SelectionContext` ; S12 : localStorage patient) — d'où le pattern contrôlé `value`/`onChange`
 * avec repli interne (`initialDose`) si le parent ne contrôle pas. Les toggles éphémères (envie,
 * surdosage) et le choix de forme ponctuelle pour la fiche restent un état interne autonome, comme
 * avant l'extraction.
 */

export const QUARTS_PAR_PATCH = 4;

const FRACTIONS_RESTE: Record<number, string> = { 1: '1/4', 2: '1/2', 3: '3/4' };

function formatPatchs(patchsPleins: number, reste: number): string {
  if (patchsPleins === 0 && reste === 0) return '0 patch';
  const partiePleins = patchsPleins > 0 ? `${patchsPleins} patch${patchsPleins > 1 ? 's' : ''}` : '';
  const partieReste = reste > 0 ? FRACTIONS_RESTE[reste] : '';
  return [partiePleins, partieReste].filter(Boolean).join(' + ');
}

/**
 * Rendu d'une dose en grille de quarts de patch pleins/vides + légende texte. Exportée : réutilisée
 * telle quelle par la fiche imprimable de `SubstitutsModule` (« Ma dose du moment »), qui reste hors
 * de ce composant (dépend de `TechniqueIllustration`, propre au bundle consultation).
 */
export function PatchQuarts({
  quarts,
  label,
  quartsVides = 0,
  quartsParPatch = QUARTS_PAR_PATCH,
}: {
  quarts: number;
  label: string;
  quartsVides?: number;
  quartsParPatch?: number;
}) {
  const patchsPleins = Math.floor(quarts / quartsParPatch);
  const reste = quarts % quartsParPatch;
  const total = quarts + quartsVides;
  const patchsAffiches = Math.max(Math.ceil(total / quartsParPatch), 1);

  return (
    <div className={styles.patchBlock}>
      <div className={styles.patchesGrid}>
        {Array.from({ length: patchsAffiches }, (_, patchIndex) => (
          <div key={patchIndex} className={styles.patch}>
            {Array.from({ length: quartsParPatch }, (_, i) => {
              const indexGlobal = patchIndex * quartsParPatch + i;
              return (
                <div
                  key={i}
                  className={indexGlobal < quarts ? styles.quartFilled : styles.quartEmpty}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className={styles.patchLabel}>
        <span className={styles.patchLabelMain}>{label}</span>
        <span className={styles.patchLabelDetail}>
          {formatPatchs(patchsPleins, reste)} ({quarts} quart{quarts === 1 ? '' : 's'})
        </span>
      </p>
    </div>
  );
}

/** Dose de titration : quarts de jour, quarts de nuit, bascule jour/nuit. */
export interface TitrationDose {
  quartsJour: number;
  quartsNuit: number;
  jourNuit: boolean;
}

export const DEFAULT_TITRATION_DOSE: TitrationDose = {
  quartsJour: QUARTS_PAR_PATCH,
  quartsNuit: QUARTS_PAR_PATCH,
  jourNuit: false,
};

export interface TitrationPatchLabels {
  doseJourTitre: string;
  doseNuitTitre: string;
  aide: string;
  message: string;
}

const DEFAULT_LABELS: TitrationPatchLabels = {
  doseJourTitre: 'Dose de jour',
  doseNuitTitre: 'Dose de nuit',
  aide: "Augmentez d'¼ tous les 3 jours tant que l'envie persiste (>3 cig/j), sans signe de surdosage.",
  message: 'Expérimentez, fiez-vous à votre ressenti.',
};

export interface TitrationPatchProps {
  /** `consultation` : carte complète (picker forme ponctuelle + bouton impression). `patient` : sans. */
  variant: 'consultation' | 'patient';
  /** Dose contrôlée par le parent. Si omise, la dose vit en interne (défaut `initialDose`). */
  value?: TitrationDose;
  onChange?: (dose: TitrationDose) => void;
  /** Dose de départ si non contrôlé. */
  initialDose?: TitrationDose;
  quartsParPatch?: number;
  labels?: Partial<TitrationPatchLabels>;
  /** Forme choisie pour la prise ponctuelle ajoutée à la fiche (consultation uniquement). */
  onFicheFormeChange?: (forme: FormeId | null) => void;
  /** Clic sur « Imprimer ma méthode » (consultation uniquement : ouverture de la fiche par le parent). */
  onImprimer?: () => void;
}

export default function TitrationPatch({
  variant,
  value,
  onChange,
  initialDose = DEFAULT_TITRATION_DOSE,
  quartsParPatch = QUARTS_PAR_PATCH,
  labels,
  onFicheFormeChange,
  onImprimer,
}: TitrationPatchProps) {
  const [internalDose, setInternalDose] = useState<TitrationDose>(initialDose);
  const dose = value ?? internalDose;
  const texts = { ...DEFAULT_LABELS, ...labels };

  const [envie, setEnvie] = useState(false);
  const [surdosage, setSurdosage] = useState(false);
  const [ficheForme, setFicheForme] = useState<FormeId | null>(null);

  const quartsNuitAffiche = Math.min(dose.quartsNuit, dose.quartsJour);

  function updateDose(next: TitrationDose) {
    if (value === undefined) setInternalDose(next);
    onChange?.(next);
  }

  function ajouterQuart() {
    updateDose({ ...dose, quartsJour: dose.quartsJour + 1 });
  }

  function retirerQuart() {
    updateDose({ ...dose, quartsJour: Math.max(0, dose.quartsJour - 1) });
  }

  function setJourNuit(actif: boolean) {
    updateDose({ ...dose, jourNuit: actif });
  }

  function retirerQuartNuit() {
    updateDose({ ...dose, quartsNuit: Math.max(0, quartsNuitAffiche - 1) });
  }

  function ajouterQuartNuit() {
    updateDose({ ...dose, quartsNuit: Math.min(dose.quartsJour, quartsNuitAffiche + 1) });
  }

  function choisirFicheForme(forme: FormeId | null) {
    setFicheForme(forme);
    onFicheFormeChange?.(forme);
  }

  return (
    <div className={styles.titrationCard}>
      <div className={styles.stateCards}>
        <label className={`${styles.stateCard} ${envie ? styles.stateCardActive : ''}`}>
          <input
            type="checkbox"
            className={styles.stateInput}
            checked={envie}
            onChange={(e) => setEnvie(e.target.checked)}
          />
          <Flame size={20} aria-hidden="true" />
          <span>Envie de fumer persiste</span>
        </label>
        <label
          className={`${styles.stateCard} ${styles.stateCardWarn} ${surdosage ? styles.stateCardActive : ''}`}
        >
          <input
            type="checkbox"
            className={styles.stateInput}
            checked={surdosage}
            onChange={(e) => setSurdosage(e.target.checked)}
          />
          <AlertTriangle size={20} aria-hidden="true" />
          <span>Signes de surdosage</span>
        </label>
        <label className={`${styles.stateCard} ${dose.jourNuit ? styles.stateCardActive : ''}`}>
          <input
            type="checkbox"
            className={styles.stateInput}
            checked={dose.jourNuit}
            onChange={(e) => setJourNuit(e.target.checked)}
          />
          <Moon size={20} aria-hidden="true" />
          <span>Distinguer jour / nuit</span>
        </label>
      </div>

      {surdosage && (
        <div className={`${styles.alertBanner} alert`} role="alert">
          <AlertTriangle size={22} aria-hidden="true" />
          <p className={styles.alertText}>
            Signes de surdosage (impression d'avoir trop fumé, nausées, vertiges, palpitations) — revenez à la
            dose précédente : c'est la dose dont vous avez besoin.
          </p>
          <button
            type="button"
            className={styles.btnWarn}
            onClick={retirerQuart}
            disabled={dose.quartsJour === 0}
          >
            Revenir en arrière (− ¼)
          </button>
        </div>
      )}

      <div className={styles.doseGroups}>
        <div className={styles.doseGroup}>
          <p className={styles.doseGroupTitle}>
            <Sun size={18} aria-hidden="true" />
            {texts.doseJourTitre}
          </p>
          <PatchQuarts quarts={dose.quartsJour} label="Jour" quartsParPatch={quartsParPatch} />
          <div className={styles.doseControls}>
            <button
              type="button"
              className={styles.btn}
              onClick={ajouterQuart}
              disabled={!envie || surdosage}
            >
              + ¼ (tous les 3 jours)
            </button>
            <button
              type="button"
              className={styles.btnNeutral}
              onClick={retirerQuart}
              disabled={dose.quartsJour === 0}
            >
              − ¼
            </button>
          </div>
          <p className={styles.titrationAide}>{texts.aide}</p>
        </div>

        {dose.jourNuit && (
          <div className={styles.doseGroup}>
            <p className={styles.doseGroupTitle}>
              <Moon size={18} aria-hidden="true" />
              {texts.doseNuitTitre}
            </p>
            <PatchQuarts quarts={quartsNuitAffiche} label="Nuit" quartsParPatch={quartsParPatch} />
            <div className={styles.doseControls}>
              <button
                type="button"
                className={styles.btnNeutral}
                onClick={retirerQuartNuit}
                disabled={quartsNuitAffiche === 0}
              >
                − ¼
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={ajouterQuartNuit}
                disabled={quartsNuitAffiche >= dose.quartsJour}
              >
                + ¼
              </button>
            </div>
          </div>
        )}
      </div>

      <p className={styles.message}>{texts.message}</p>

      {variant === 'consultation' && (
        <>
          <div className={styles.ficheFormeGroup}>
            <p className={styles.ficheFormeLabel}>Ajouter une prise ponctuelle à ma fiche</p>
            <div className={styles.ficheFormeOptions}>
              <button
                type="button"
                className={`${styles.ficheFormeOption} ${ficheForme === null ? styles.ficheFormeOptionActive : ''}`}
                onClick={() => choisirFicheForme(null)}
                aria-pressed={ficheForme === null}
              >
                Aucune
              </button>
              {FORMES_PONCTUELLES.map((forme) => (
                <button
                  key={forme}
                  type="button"
                  className={`${styles.ficheFormeOption} ${ficheForme === forme ? styles.ficheFormeOptionActive : ''}`}
                  onClick={() => choisirFicheForme(forme)}
                  aria-pressed={ficheForme === forme}
                >
                  {FORMES_DATA[forme].label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className={`btn btn--ghost ${styles.ficheButton}`} onClick={onImprimer}>
            Imprimer ma méthode
          </button>
        </>
      )}
    </div>
  );
}
