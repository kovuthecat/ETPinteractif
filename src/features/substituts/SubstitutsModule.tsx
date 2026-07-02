import { useState } from 'react';
import { AlertTriangle, Flame, Moon, Sun } from 'lucide-react';
import type { ModuleProps } from '../types';
import styles from './SubstitutsModule.module.css';

type FormeId =
  | 'patch'
  | 'gomme'
  | 'pastille'
  | 'sublingual'
  | 'inhaleur'
  | 'spray'
  | 'vapoteuse';

type FormeContent =
  | { label: string; bonnesPratiques: string[]; erreurs: string[]; enRedaction?: false }
  | { label: string; enRedaction: true };

const FORMES_DATA: Record<FormeId, FormeContent> = {
  patch: {
    label: 'Patch (24 h / 16 h)',
    bonnesPratiques: [
      'Appliquer 1 patch le matin au réveil.',
      'Changer de site d'application chaque jour.',
      'L'effet commence à se faire sentir ~30 min après l'application.',
      'Autant que possible, garder le patch la nuit pour ne pas manquer de nicotine le matin.',
    ],
    erreurs: [
      'Attendre un effet immédiat (il faut ~30 min).',
      'Retirer le patch la nuit alors qu'on a besoin de nicotine au réveil (sauf sommeil perturbé → dose de nuit plus faible, cf. titration).',
      'Reposer le patch toujours au même endroit.',
    ],
  },
  gomme: {
    label: 'Gomme',
    bonnesPratiques: [
      'Prendre une gomme dès que l'envie de fumer se fait sentir.',
      'Mâcher lentement 5–6 fois, puis garder la gomme contre la joue ~2 min (la nicotine se libère et est absorbée par la muqueuse buccale).',
      'Remâcher lentement puis reposer contre la joue, et recommencer ainsi pendant ~30 min.',
      'Gérer « au coup par coup » : une gomme dès que l'envie réapparaît dans la journée.',
    ],
    erreurs: [
      'Mâcher vite et en continu comme un chewing-gum (la nicotine est avalée, moins efficace).',
      'Avaler la salive au lieu de laisser absorber par la joue.',
    ],
  },
  pastille: {
    label: 'Pastille',
    bonnesPratiques: [
      'Prendre une pastille dès que l'envie de fumer se fait sentir.',
      'Laisser se dissoudre sous la langue, ou contre la joue en la déplaçant régulièrement d'un côté à l'autre de la bouche.',
      'En 2–3 min, l'effet se fait sentir et l'envie s'estompe.',
    ],
    erreurs: [
      'Croquer ou avaler la pastille (elle doit fondre lentement).',
    ],
  },
  sublingual: {
    label: 'Comprimé sublingual',
    bonnesPratiques: [
      'Prendre un ou deux comprimés dès que l'envie se fait sentir.',
      'Placer le comprimé sous la langue ou contre la joue et le laisser fondre.',
      'L'effet se fait sentir en quelques minutes.',
    ],
    erreurs: [
      'Croquer ou avaler le comprimé.',
    ],
  },
  inhaleur: {
    label: 'Inhaleur',
    enRedaction: true,
  },
  spray: {
    label: 'Spray buccal',
    bonnesPratiques: [
      'Une ou deux pulvérisations à chaque fois que l'envie de fumer se fait sentir.',
      'Pulvériser dans la bouche, sur l'intérieur des joues (placer le spray un peu de côté pour atteindre l'intérieur de la joue).',
      'On peut vaporiser sous la langue puis répartir sur l'intérieur des joues en bougeant la langue ; l'essentiel est de bien couvrir la muqueuse des joues.',
      'Efficace en ~1 min.',
    ],
    erreurs: [
      'Viser le fond de la gorge / inhaler la pulvérisation.',
    ],
  },
  vapoteuse: {
    label: 'Vapoteuse',
    enRedaction: true,
  },
};

const QUARTS_PAR_PATCH = 4;
const INITIAL_QUARTS = QUARTS_PAR_PATCH;

const FRACTIONS_RESTE: Record<number, string> = { 1: '1/4', 2: '1/2', 3: '3/4' };

function formatPatchs(patchsPleins: number, reste: number): string {
  if (patchsPleins === 0 && reste === 0) return '0 patch';
  const partiePleins = patchsPleins > 0 ? `${patchsPleins} patch${patchsPleins > 1 ? 's' : ''}` : '';
  const partieReste = reste > 0 ? FRACTIONS_RESTE[reste] : '';
  return [partiePleins, partieReste].filter(Boolean).join(' + ');
}

function PatchQuarts({ quarts, label }: { quarts: number; label: string }) {
  const patchsPleins = Math.floor(quarts / QUARTS_PAR_PATCH);
  const reste = quarts % QUARTS_PAR_PATCH;
  const patchsAffiches = Math.max(patchsPleins + (reste > 0 ? 1 : 0), 1);

  return (
    <div className={styles.patchBlock}>
      <div className={styles.patchesGrid}>
        {Array.from({ length: patchsAffiches }, (_, patchIndex) => {
          const quartsDansCePatch = patchIndex < patchsPleins ? QUARTS_PAR_PATCH : reste;
          return (
            <div key={patchIndex} className={styles.patch}>
              {Array.from({ length: QUARTS_PAR_PATCH }, (_, i) => (
                <div
                  key={i}
                  className={i < quartsDansCePatch ? styles.quartFilled : styles.quartEmpty}
                />
              ))}
            </div>
          );
        })}
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

export default function SubstitutsModule(_: ModuleProps) {
  const [selectedForme, setSelectedForme] = useState<FormeId | null>(null);

  const [quartsJour, setQuartsJour] = useState(INITIAL_QUARTS);
  const [envie, setEnvie] = useState(false);
  const [surdosage, setSurdosage] = useState(false);
  const [jourNuit, setJourNuit] = useState(false);
  const [quartsNuit, setQuartsNuit] = useState(INITIAL_QUARTS);

  const quartsNuitAffiche = Math.min(quartsNuit, quartsJour);

  function ajouterQuart() {
    setQuartsJour((q) => q + 1);
  }

  function retirerQuart() {
    setQuartsJour((q) => Math.max(0, q - 1));
  }

  const formeData = selectedForme ? FORMES_DATA[selectedForme] : null;

  return (
    <div className={styles.module}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bonnes pratiques par forme</h2>
        <p className={styles.formeConsigne}>Sélectionnez une forme pour afficher les conseils d'utilisation.</p>
        <div className={styles.chips}>
          {(Object.keys(FORMES_DATA) as FormeId[]).map((forme) => (
            <button
              key={forme}
              type="button"
              className={`${styles.chip} ${selectedForme === forme ? styles.chipActive : ''}`}
              onClick={() => setSelectedForme(forme)}
              aria-pressed={selectedForme === forme}
            >
              {FORMES_DATA[forme].label}
            </button>
          ))}
        </div>

        {formeData && (
          formeData.enRedaction ? (
            <div className={styles.panelRedaction}>
              <p>Fiche en cours de rédaction — à voir avec votre soignant.</p>
            </div>
          ) : (
            <div className={styles.panels}>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>{formeData.label} — bonnes pratiques</h3>
                <ul className={styles.panelList}>
                  {formeData.bonnesPratiques.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>{formeData.label} — erreurs fréquentes</h3>
                <ul className={styles.panelList}>
                  {formeData.erreurs.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Méthode de titration du patch</h2>

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
          <label className={`${styles.stateCard} ${jourNuit ? styles.stateCardActive : ''}`}>
            <input
              type="checkbox"
              className={styles.stateInput}
              checked={jourNuit}
              onChange={(e) => setJourNuit(e.target.checked)}
            />
            <Moon size={20} aria-hidden="true" />
            <span>Distinguer jour / nuit</span>
          </label>
        </div>

        {surdosage && (
          <div className={styles.alertBanner} role="alert">
            <AlertTriangle size={22} aria-hidden="true" />
            <p className={styles.alertText}>
              Signes de surdosage (impression d'avoir trop fumé, nausées, vertiges, palpitations) — revenez à la dose précédente : c'est la dose dont vous avez besoin.
            </p>
            <button
              type="button"
              className={styles.btnWarn}
              onClick={retirerQuart}
              disabled={quartsJour === 0}
            >
              Revenir en arrière (− ¼)
            </button>
          </div>
        )}

        <div className={styles.doseGroups}>
          <div className={styles.doseGroup}>
            <p className={styles.doseGroupTitle}>
              <Sun size={18} aria-hidden="true" />
              Dose de jour
            </p>
            <PatchQuarts quarts={quartsJour} label="Jour" />
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
                disabled={quartsJour === 0}
              >
                − ¼
              </button>
            </div>
            <p className={styles.titrationAide}>
              Augmentez d'¼ tous les 3 jours tant que l'envie persiste (&gt;3 cig/j), sans signe de surdosage.
            </p>
          </div>

          {jourNuit && (
            <div className={styles.doseGroup}>
              <p className={styles.doseGroupTitle}>
                <Moon size={18} aria-hidden="true" />
                Dose de nuit
              </p>
              <PatchQuarts quarts={quartsNuitAffiche} label="Nuit" />
              <div className={styles.doseControls}>
                <button
                  type="button"
                  className={styles.btnNeutral}
                  onClick={() => setQuartsNuit((q) => Math.max(0, q - 1))}
                  disabled={quartsNuitAffiche === 0}
                >
                  − ¼
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => setQuartsNuit((q) => Math.min(quartsJour, q + 1))}
                  disabled={quartsNuitAffiche >= quartsJour}
                >
                  + ¼
                </button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.message}>Expérimentez, fiez-vous à votre ressenti.</p>
      </section>
    </div>
  );
}
