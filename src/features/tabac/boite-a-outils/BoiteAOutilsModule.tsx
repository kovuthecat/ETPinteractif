import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import type { ModuleProps } from '../../types';
import IllustrationSlot from '../components/IllustrationSlot';
import FicheOverlay from '../../../components/FicheOverlay';
import VagueCraving from './VagueCraving';
import { OUTILS, PREUVE_LABELS, selectionnerOutilsPertinents } from '../../../content/tabac/outils';
import { SITUATIONS, parseSelectionSituations, type PilierId, type SituationDef } from '../../../content/tabac/situations';
import { useSelection } from '../../../state/SelectionContext';
import styles from './BoiteAOutilsModule.module.css';

const PILIER_ORDER: PilierId[] = ['physique', 'psychologique', 'comportementale'];

const PILIER_LABELS: Record<PilierId, string> = {
  physique: 'Signes physiques du manque',
  psychologique: 'Ce que la cigarette apporte',
  comportementale: 'Automatismes du quotidien',
};

const PILIER_CLASS: Record<PilierId, string> = {
  physique: styles.pilierPhysique,
  psychologique: styles.pilierPsychologique,
  comportementale: styles.pilierComportementale,
};

const SITUATIONS_PAR_ID = new Map<string, SituationDef>(SITUATIONS.map((s) => [s.id, s]));

/**
 * Module « Stratégies & outils » (plans/boite-a-outils/S2.md, BO2). Remplace
 * l'ancien module `craving` : la vague/4D devient un outil parmi 14, filtrables
 * par situation (pré-filtré depuis Composantes via `context`). Fiche imprimable
 * « Ma boîte à outils » composée des outils cochés. Zéro persistance : filtres
 * et sélection de fiche sont du state React éphémère.
 */
export default function BoiteAOutilsModule({ onNavigate, context }: ModuleProps) {
  const { state, toggle } = useSelection();
  const ficheItems = state.outilsFiche;
  // Filtre local (éphémère) : pré-alimenté au montage depuis les situations
  // partagées (cochées dans « Composantes ») ∪ le contexte de navigation.
  const [activeSituations, setActiveSituations] = useState<Set<string>>(
    () => new Set([...parseSelectionSituations(context), ...state.situations]),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vagueOpen, setVagueOpen] = useState(false);
  const [ficheOpen, setFicheOpen] = useState(false);

  function toggleSituation(id: string) {
    setActiveSituations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFiche(id: string) {
    toggle('outilsFiche', id);
  }

  const activeSituationDefs = SITUATIONS.filter((s) => activeSituations.has(s.id));
  // Pertinence par pilier (E4) : même fonction de sélection/tri que l'app patient
  // (PatientSituations) — filtre inchangé (transverse ∪ situations actives), tri par
  // pilier ajouté par-dessus.
  const visibleOutils = selectionnerOutilsPertinents(OUTILS, activeSituationDefs);
  const ficheOutils = OUTILS.filter((o) => ficheItems.includes(o.id));

  // Si bloqué (plans/boite-a-outils/S2.md « Si bloqué ») : au-delà de 10 outils
  // cochés, on retire le titre des blocs à partir du 9e pour tenir sur l'A4.
  const ficheDebordement = ficheOutils.length > 10;

  if (vagueOpen) {
    return <VagueCraving onBack={() => setVagueOpen(false)} />;
  }

  const outilDetail = selectedId ? (OUTILS.find((o) => o.id === selectedId) ?? null) : null;

  if (outilDetail) {
    const situationsLiees = outilDetail.situations
      .map((id) => SITUATIONS_PAR_ID.get(id))
      .filter((s): s is SituationDef => Boolean(s));
    const dansLaFiche = ficheItems.includes(outilDetail.id);

    return (
      <div className={styles.module}>
        <button type="button" className={styles.backBtn} onClick={() => setSelectedId(null)}>
          <ChevronLeft aria-hidden="true" /> Tous les outils
        </button>

        <div className={`${styles.detailCard} card`}>
          <IllustrationSlot id={outilDetail.id} label={outilDetail.titre} size={160} />
          <p className={styles.detailTitre}>{outilDetail.titre}</p>

          {situationsLiees.length > 0 && (
            <div className={styles.badges}>
              {situationsLiees.map((s) => (
                <span key={s.id} className={`chip ${styles.filterChip} ${PILIER_CLASS[s.pilier]}`}>
                  <span className={styles.pastille} aria-hidden="true" />
                  {s.label}
                </span>
              ))}
            </div>
          )}

          <p className={styles.preuve}>{PREUVE_LABELS[outilDetail.preuve]}</p>

          <p className={styles.principe}>{outilDetail.principe}</p>

          <div className={styles.propositionBlock}>
            <span className="fiche-bloc-eyebrow">Comment le proposer</span>
            <p className={styles.proposition}>« {outilDetail.proposition} »</p>
          </div>

          {outilDetail.renvoi && (
            <button
              type="button"
              className={styles.renvoiBtn}
              onClick={() => onNavigate(outilDetail.renvoi!.id)}
            >
              {outilDetail.renvoi.label} <ArrowRight aria-hidden="true" />
            </button>
          )}

          <div className={styles.detailActions}>
            {outilDetail.interactif === 'vague4d' && (
              <button type="button" className="btn btn--primary" onClick={() => setVagueOpen(true)}>
                Lancer l'outil
              </button>
            )}
            <button
              type="button"
              className={`btn ${dansLaFiche ? 'btn--ghost' : 'btn--primary'}`}
              onClick={() => toggleFiche(outilDetail.id)}
            >
              {dansLaFiche ? (
                <>
                  <Check aria-hidden="true" /> Dans ma fiche
                </>
              ) : (
                'Ajouter à ma fiche'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Des techniques simples, à choisir selon vos situations. Touchez un outil pour voir comment
        l'utiliser.
      </p>

      <div className={styles.filterBar}>
        {activeSituationDefs.length > 0 && (
          <div className={styles.activeRow}>
            {activeSituationDefs.map((s) => (
              <span key={s.id} className={`chip ${styles.filterChip} ${PILIER_CLASS[s.pilier]}`}>
                <span className={styles.pastille} aria-hidden="true" />
                {s.label}
              </span>
            ))}
            <button
              type="button"
              className="btn btn--tertiary"
              onClick={() => setActiveSituations(new Set())}
            >
              Tout afficher
            </button>
          </div>
        )}

        <details className={styles.filterDetails}>
          <summary className={styles.filterSummary}>Filtrer selon mes situations</summary>
          {PILIER_ORDER.map((pilier) => (
            <div key={pilier} className={styles.pilierGroup}>
              <span className={styles.pilierLabel}>{PILIER_LABELS[pilier]}</span>
              <div className={styles.chipRow}>
                {SITUATIONS.filter((s) => s.pilier === pilier).map((s) => {
                  const active = activeSituations.has(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`chip ${styles.filterChip} ${PILIER_CLASS[pilier]}${active ? ' activeDoubled' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleSituation(s.id)}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </details>
      </div>

      <div className={styles.grid} role="list">
        {visibleOutils.map((outil) => (
          <div key={outil.id} className={`${styles.tile} card`} role="listitem">
            <button
              type="button"
              className={styles.tileBtn}
              onClick={() => setSelectedId(outil.id)}
            >
              <IllustrationSlot id={outil.id} label={outil.titre} size={96} />
              <span className={styles.tileBody}>
                <span className={styles.tileTitre}>{outil.titre}</span>
                <span className={styles.tileAccroche}>{outil.accroche}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      <p className={styles.aparte}>
        En parler — Tabac Info Service <strong>39 89</strong>.
      </p>

      <div className={styles.ficheButtonRow}>
        <button
          type="button"
          className="btn btn--primary"
          disabled={ficheOutils.length === 0}
          onClick={() => setFicheOpen(true)}
        >
          Imprimer ma boîte à outils ({ficheOutils.length})
        </button>
      </div>

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          titre="Ma boîte à outils"
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Mes outils</span>
            <div className={styles.ficheGrid}>
              {ficheOutils.map((outil, index) => (
                <div key={outil.id} className={styles.ficheItem}>
                  {(!ficheDebordement || index < 8) && (
                    <p className={styles.ficheItemTitre}>{outil.titre}</p>
                  )}
                  <p className={styles.ficheItemConsigne}>{outil.consigneFiche}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fiche-bloc">
            <div className="fiche-contact">
              <p>En parler — Tabac Info Service</p>
              <span className="fiche-contact-numero">39 89</span>
            </div>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
