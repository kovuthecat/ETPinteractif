import { useEffect, useRef, useState } from 'react';
import { Check, Info } from 'lucide-react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import TitrationPatch, { PatchQuarts, QUARTS_PAR_PATCH } from '../../../components/TitrationPatch';
import { useSelection } from '../../../state/SelectionContext';
import TechniqueIllustration from './TechniqueIllustration';
import { FORMES_DATA, type FormeId } from '../../../content/tabac/substituts';
import styles from './SubstitutsModule.module.css';

export default function SubstitutsModule(_props: ModuleProps) {
  const { state, toggle, setTitrationPatch } = useSelection();
  const [selectedForme, setSelectedForme] = useState<FormeId | null>(null);

  const dose = state.titrationPatch;
  const [ficheOpen, setFicheOpen] = useState(false);
  const [ficheForme, setFicheForme] = useState<FormeId | null>(null);
  const techniqueRef = useRef<HTMLElement>(null);

  const quartsNuitAffiche = Math.min(dose.quartsNuit, dose.quartsJour);

  const resteJour = dose.quartsJour % QUARTS_PAR_PATCH;
  const videsJour = (resteJour === 0 ? 0 : QUARTS_PAR_PATCH - resteJour) + QUARTS_PAR_PATCH;

  const formeData = selectedForme ? FORMES_DATA[selectedForme] : null;
  const showTechnique = !!formeData && selectedForme !== 'patch';

  // Filet : à la sélection d'une forme, garantir que la carte technique de prise est visible
  // sans défiler (point 6, cf. plan corrections-revue-guidee/S2). `block: 'nearest'` ne fait
  // rien si l'élément est déjà dans le viewport (cas des 5 autres formes une fois le bloc
  // supérieur compacté) : aucun effet sur les formes déjà correctes.
  useEffect(() => {
    if (!showTechnique) return;
    const node = techniqueRef.current;
    if (!node) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }, [selectedForme, showTechnique]);

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
          <div style={{ marginTop: '0.5rem' }}>
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
        <section className={styles.section} ref={techniqueRef}>
          <p className={styles.sectionEyebrow}>Technique de prise — {formeData.label}</p>
          <TechniqueIllustration forme={selectedForme} label={formeData.label} />
        </section>
      )}

      {selectedForme === 'patch' && (
        <section className={styles.section}>
          <p className={styles.sectionEyebrow}>Méthode de titration du patch</p>

          <TitrationPatch
            variant="consultation"
            value={dose}
            onChange={setTitrationPatch}
            onFicheFormeChange={setFicheForme}
            onImprimer={() => setFicheOpen(true)}
          />
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
              <PatchQuarts quarts={dose.quartsJour} label="Jour" quartsVides={videsJour} />
              {dose.jourNuit && <PatchQuarts quarts={quartsNuitAffiche} label="Nuit" />}
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
