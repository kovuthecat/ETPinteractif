import { useState } from 'react';
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

const FORMES_DATA: Record<FormeId, { label: string; bonnesPratiques: string[]; erreurs: string[] }> = {
  patch: {
    label: 'Patch (24 h / 16 h)',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
  },
  gomme: {
    label: 'Gomme',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
  },
  pastille: {
    label: 'Pastille',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
  },
  sublingual: {
    label: 'Comprimé sublingual',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
  },
  inhaleur: {
    label: 'Inhaleur',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
  },
  spray: {
    label: 'Spray buccal',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
  },
  vapoteuse: {
    label: 'Vapoteuse',
    bonnesPratiques: ['À compléter'],
    erreurs: ['À compléter'],
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
        {label} — {formatPatchs(patchsPleins, reste)} ({quarts} quart{quarts === 1 ? '' : 's'})
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
          <div className={styles.panels}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Bonnes pratiques</h3>
              <ul className={styles.panelList}>
                {formeData.bonnesPratiques.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Erreurs fréquentes</h3>
              <ul className={styles.panelList}>
                {formeData.erreurs.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Méthode de titration du patch</h2>

        <div className={styles.toggles}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={envie}
              onChange={(e) => setEnvie(e.target.checked)}
            />
            Envie de fumer persiste
          </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={surdosage}
              onChange={(e) => setSurdosage(e.target.checked)}
            />
            Signes de surdosage
          </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={jourNuit}
              onChange={(e) => setJourNuit(e.target.checked)}
            />
            Jour / Nuit
          </label>
        </div>

        <div className={styles.patches}>
          <PatchQuarts quarts={quartsJour} label="Dose de jour" />
          {jourNuit && (
            <div className={styles.patchBlock}>
              <PatchQuarts quarts={quartsNuitAffiche} label="Dose de nuit" />
              <div className={styles.nuitControls}>
                <button
                  type="button"
                  className={styles.btnSmall}
                  onClick={() => setQuartsNuit((q) => Math.max(0, q - 1))}
                  disabled={quartsNuitAffiche === 0}
                >
                  − ¼ nuit
                </button>
                <button
                  type="button"
                  className={styles.btnSmall}
                  onClick={() => setQuartsNuit((q) => Math.min(quartsJour, q + 1))}
                  disabled={quartsNuitAffiche >= quartsJour}
                >
                  + ¼ nuit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.btn}
            onClick={ajouterQuart}
            disabled={!envie || surdosage}
          >
            + ¼ (à J+2-3)
          </button>
          <button
            type="button"
            className={styles.btnNeutral}
            onClick={retirerQuart}
            disabled={quartsJour === 0}
          >
            − ¼
          </button>
          <button
            type="button"
            className={styles.btnWarn}
            onClick={retirerQuart}
            disabled={!surdosage || quartsJour === 0}
          >
            Signes de surdosage → revenir en arrière
          </button>
        </div>

        <p className={styles.message}>Expérimentez, fiez-vous à votre ressenti.</p>
      </section>
    </div>
  );
}
