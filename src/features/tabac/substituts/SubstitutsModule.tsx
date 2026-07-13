import { useState } from 'react';
import { AlertTriangle, Check, Flame, Info, Moon, Sun } from 'lucide-react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import { useSelection } from '../../../state/SelectionContext';
import TechniqueIllustration from './TechniqueIllustration';
import { FORMES_DATA, FORMES_PONCTUELLES, type FormeId } from '../../../content/tabac/substituts';
import styles from './SubstitutsModule.module.css';

const QUARTS_PAR_PATCH = 4;
const INITIAL_QUARTS = QUARTS_PAR_PATCH;

const FRACTIONS_RESTE: Record<number, string> = { 1: '1/4', 2: '1/2', 3: '3/4' };

function formatPatchs(patchsPleins: number, reste: number): string {
  if (patchsPleins === 0 && reste === 0) return '0 patch';
  const partiePleins = patchsPleins > 0 ? `${patchsPleins} patch${patchsPleins > 1 ? 's' : ''}` : '';
  const partieReste = reste > 0 ? FRACTIONS_RESTE[reste] : '';
  return [partiePleins, partieReste].filter(Boolean).join(' + ');
}

function PatchQuarts({
  quarts,
  label,
  quartsVides = 0,
}: {
  quarts: number;
  label: string;
  quartsVides?: number;
}) {
  const patchsPleins = Math.floor(quarts / QUARTS_PAR_PATCH);
  const reste = quarts % QUARTS_PAR_PATCH;
  const total = quarts + quartsVides;
  const patchsAffiches = Math.max(Math.ceil(total / QUARTS_PAR_PATCH), 1);

  return (
    <div className={styles.patchBlock}>
      <div className={styles.patchesGrid}>
        {Array.from({ length: patchsAffiches }, (_, patchIndex) => (
          <div key={patchIndex} className={styles.patch}>
            {Array.from({ length: QUARTS_PAR_PATCH }, (_, i) => {
              const indexGlobal = patchIndex * QUARTS_PAR_PATCH + i;
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

export default function SubstitutsModule(_props: ModuleProps) {
  const { state, toggle } = useSelection();
  const [selectedForme, setSelectedForme] = useState<FormeId | null>(null);

  const [quartsJour, setQuartsJour] = useState(INITIAL_QUARTS);
  const [envie, setEnvie] = useState(false);
  const [surdosage, setSurdosage] = useState(false);
  const [jourNuit, setJourNuit] = useState(false);
  const [quartsNuit, setQuartsNuit] = useState(INITIAL_QUARTS);
  const [ficheOpen, setFicheOpen] = useState(false);
  const [ficheForme, setFicheForme] = useState<FormeId | null>(null);

  const quartsNuitAffiche = Math.min(quartsNuit, quartsJour);

  const resteJour = quartsJour % QUARTS_PAR_PATCH;
  const videsJour = (resteJour === 0 ? 0 : QUARTS_PAR_PATCH - resteJour) + QUARTS_PAR_PATCH;

  function ajouterQuart() {
    setQuartsJour((q) => q + 1);
  }

  function retirerQuart() {
    setQuartsJour((q) => Math.max(0, q - 1));
  }

  const formeData = selectedForme ? FORMES_DATA[selectedForme] : null;
  const showTechnique = !!formeData && selectedForme !== 'patch';

  return (
    <div className={styles.module}>
      <section className={styles.section}>
        <p className={styles.intro}>
          Choisissez une forme pour ses bonnes pratiques. Pour la titration du patch, aucun calcul de dose : on
          avance par quarts, selon le ressenti.
        </p>
        <div className={styles.formeGrid}>
          {(Object.keys(FORMES_DATA) as FormeId[]).map((forme) => (
            <button
              key={forme}
              type="button"
              className={`${styles.formeCard} ${selectedForme === forme ? styles.formeCardActive : ''}`}
              onClick={() => setSelectedForme(forme)}
              aria-pressed={selectedForme === forme}
            >
              <span className={styles.formeDot} aria-hidden="true" />
              <span className={styles.formeLabel}>{FORMES_DATA[forme].label}</span>
              {forme === 'vapoteuse' && (
                <span className={styles.formeBadge}>
                  <Info size={12} aria-hidden="true" />
                  Réduction des risques
                </span>
              )}
            </button>
          ))}
        </div>

        {selectedForme === 'vapoteuse' && (
          <div className={styles.vapoteuseNote}>
            <Info size={18} aria-hidden="true" />
            <p>
              La vapoteuse n'est pas un médicament : c'est un outil de réduction des risques, utile
              aux personnes qui n'ont pas réussi avec les traitements validés. Les substituts
              restent le premier choix. À discuter avec un professionnel.
              {/* à revalider (Thibault) */}
            </p>
          </div>
        )}

        {formeData && (
          <div className={styles.panels}>
            <div className={`${styles.panel} ${styles.panelBonnes}`}>
              <h3 className={styles.panelTitle}>Bonnes pratiques — {formeData.label}</h3>
              <ul className={styles.panelList}>
                {formeData.bonnesPratiques.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.panel} ${styles.panelErreurs}`}>
              <h3 className={styles.panelTitle}>Erreurs fréquentes</h3>
              <ul className={styles.panelList}>
                {formeData.erreurs.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {formeData && selectedForme && (
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className={`btn ${state.substituts.includes(selectedForme) ? 'btn--ghost' : 'btn--primary'}`}
              aria-pressed={state.substituts.includes(selectedForme)}
              onClick={() => toggle('substituts', selectedForme)}
            >
              {state.substituts.includes(selectedForme) ? (
                <>
                  <Check size={16} aria-hidden="true" /> Retenu dans mon plan
                </>
              ) : (
                'Retenir pour mon plan'
              )}
            </button>
          </div>
        )}
      </section>

      {showTechnique && formeData && selectedForme && (
        <section className={styles.section}>
          <p className={styles.sectionEyebrow}>Technique de prise — {formeData.label}</p>
          <TechniqueIllustration forme={selectedForme} label={formeData.label} />
        </section>
      )}

      {selectedForme === 'patch' && (
        <section className={styles.section}>
          <p className={styles.sectionEyebrow}>Méthode de titration du patch</p>

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

            <div className={styles.ficheFormeGroup}>
              <p className={styles.ficheFormeLabel}>Ajouter une prise ponctuelle à ma fiche</p>
              <div className={styles.ficheFormeOptions}>
                <button
                  type="button"
                  className={`${styles.ficheFormeOption} ${ficheForme === null ? styles.ficheFormeOptionActive : ''}`}
                  onClick={() => setFicheForme(null)}
                  aria-pressed={ficheForme === null}
                >
                  Aucune
                </button>
                {FORMES_PONCTUELLES.map((forme) => (
                  <button
                    key={forme}
                    type="button"
                    className={`${styles.ficheFormeOption} ${ficheForme === forme ? styles.ficheFormeOptionActive : ''}`}
                    onClick={() => setFicheForme(forme)}
                    aria-pressed={ficheForme === forme}
                  >
                    {FORMES_DATA[forme].label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`btn btn--ghost ${styles.ficheButton}`}
              onClick={() => setFicheOpen(true)}
            >
              Imprimer ma méthode
            </button>
          </div>
        </section>
      )}

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          titre="Ma méthode patch"
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">La méthode en 3 règles</span>
            <ol className={styles.ficheRegles}>
              <li>
                Tous les 2 à 3 jours : si l'envie de fumer persiste et sans signe de surdosage →{' '}
                <strong>ajouter ¼ de patch</strong>.
              </li>
              <li>
                Signes de surdosage (nausées, écœurement, maux de tête, palpitations, rêves intenses) →{' '}
                <strong>revenir à la dose précédente</strong>.
              </li>
              <li>
                Si une bonne dose de jour perturbe le sommeil → <strong>dose plus faible la nuit</strong>.
              </li>
            </ol>
          </div>

          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Ma dose du moment</span>
            <div className={styles.ficheDoses}>
              <PatchQuarts quarts={quartsJour} label="Jour" quartsVides={videsJour} />
              {jourNuit && <PatchQuarts quarts={quartsNuitAffiche} label="Nuit" />}
            </div>
            <p className={styles.ficheDosesLegende}>
              Colorie ¼ de plus tous les 3 jours si l'envie persiste, sans signe de surdosage.
            </p>
          </div>

          {ficheForme && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Ma prise ponctuelle — {FORMES_DATA[ficheForme].label}</span>
              <TechniqueIllustration forme={ficheForme} label={FORMES_DATA[ficheForme].label} />
              <ul className={styles.ficheFormeListe}>
                {FORMES_DATA[ficheForme].bonnesPratiques.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <p className={styles.ficheMessage}>Expérimentez, fiez-vous à votre ressenti.</p>

          <div className="fiche-contact">
            <span className="fiche-contact-numero">39 89</span>
            <span>En parler — Tabac Info Service.</span>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
