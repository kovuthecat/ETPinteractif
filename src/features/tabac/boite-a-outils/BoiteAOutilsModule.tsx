import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import type { ModuleProps } from '../../types';
import IllustrationSlot from '../components/IllustrationSlot';
import FicheOverlay from '../../../components/FicheOverlay';
import { OUTILS_INTERACTIFS } from './outils-interactifs/registry';
import { useConsultationStore } from './outils-interactifs/useConsultationStore';
import { OUTILS, PREUVE_LABELS, selectionnerOutilsPertinents } from '../../../content/tabac/outils';
import { SITUATIONS, parseSelectionSituations, type PilierId, type SituationDef } from '../../../content/tabac/situations';
import { useSelection } from '../../../state/SelectionContext';
import styles from './BoiteAOutilsModule.module.css';

const PILIER_ORDER: PilierId[] = ['physique', 'psychologique', 'comportementale'];

const PILIER_LABELS: Record<PilierId, string> = {
  physique: 'Signes physiques du manque',
  psychologique: 'Émotions propices au tabac', // à revalider (Thibault)
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
  const { state, toggle, add } = useSelection();
  const consultationStore = useConsultationStore();
  const ficheItems = state.outilsFiche;
  // Filtre local (éphémère) : pré-alimenté au montage depuis les situations
  // partagées (cochées dans « Composantes ») ∪ le contexte de navigation.
  const [activeSituations, setActiveSituations] = useState<Set<string>>(
    () => new Set([...parseSelectionSituations(context), ...state.situations]),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Vue « outil actif » (S1/OI3) : distincte de `selectedId` (vue détail) pour que
  // fermer l'outil (`onClose`) revienne au détail plutôt qu'à la grille.
  const [activeOutilId, setActiveOutilId] = useState<string | null>(null);
  const [ficheOpen, setFicheOpen] = useState(false);
  // Rattachement auto à la fiche (S2, G-fiche, plans/recette-outils-2026-08) : mémoire locale
  // (éphémère, pas de persistance) des outils explicitement RETIRÉS par le soignant, pour que
  // l'automatisme ci-dessous ne les recoche pas tant qu'ils ne sont pas re-remplis à la main.
  const [retiresManuellement, setRetiresManuellement] = useState<Set<string>>(new Set());

  function toggleSituation(id: string) {
    setActiveSituations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFiche(id: string) {
    const present = ficheItems.includes(id);
    setRetiresManuellement((prev) => {
      if (present === prev.has(id)) return prev;
      const next = new Set(prev);
      if (present) next.add(id);
      else next.delete(id);
      return next;
    });
    toggle('outilsFiche', id);
  }

  // Un outil rejoint la fiche dès qu'il porte du contenu personnalisé (store.setList non vide :
  // SI…ALORS, tirelire, les 4 checklists, phrase de refus) — le patient ne peut plus perdre son
  // travail en oubliant de cocher « Ajouter à ma fiche » (constat recette 2026-08-06 : le
  // compteur restait à 0 après composition de 5 plans « SI… ALORS… »). Les outils sans rien à
  // conserver (minuteurs, exercices) ne sont pas concernés — `state.outilsData` reste vide pour
  // eux, la condition `perso.length > 0` ne se déclenche jamais.
  useEffect(() => {
    for (const outil of OUTILS) {
      const perso = state.outilsData[outil.id];
      if (perso && perso.length > 0 && !ficheItems.includes(outil.id) && !retiresManuellement.has(outil.id)) {
        add('outilsFiche', outil.id);
      }
    }
  }, [state.outilsData, ficheItems, retiresManuellement, add]);

  const activeSituationDefs = SITUATIONS.filter((s) => activeSituations.has(s.id));
  // Pertinence par pilier (E4) : même fonction de sélection/tri que l'app patient
  // (PatientSituations) — filtre inchangé (transverse ∪ situations actives), tri par
  // pilier ajouté par-dessus.
  const visibleOutils = selectionnerOutilsPertinents(OUTILS, activeSituationDefs);
  const ficheOutils = OUTILS.filter((o) => ficheItems.includes(o.id));

  // Débordement (S2, plans/recette-outils-2026-08 — remplace l'ancien repli « titres retirés
  // au-delà du 9e », qui laissait des consignes orphelines sans qu'on sache à quel outil elles
  // se rapportaient). Au-delà de 10 outils cochés, chaque titre reste affiché mais la fiche
  // passe en typographie compacte (`.ficheGridCompact`) pour tenir sur l'A4.
  const ficheDebordement = ficheOutils.length > 10;

  const activeOutil = activeOutilId ? (OUTILS.find((o) => o.id === activeOutilId) ?? null) : null;
  const ActiveOutilComponent = activeOutil?.interactif ? OUTILS_INTERACTIFS[activeOutil.interactif] : undefined;

  if (activeOutil && ActiveOutilComponent) {
    return (
      <ActiveOutilComponent
        outil={activeOutil}
        store={consultationStore}
        contexte={{
          situationsActives: SITUATIONS.filter((s) => state.situations.includes(s.id)),
          raisons: state.raisons,
        }}
        onClose={() => setActiveOutilId(null)}
      />
    );
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

          {outilDetail.interactif === 'bouger' && (
            // Cadrage (S6, plans/recette-outils-2026-08) : le minuteur de 10 min n'a pas sa
            // place au temps de consultation ; il reste lancable ici (le patient peut vouloir
            // le découvrir), mais on ne le présente plus comme les 13 autres outils courts.
            <p className={styles.aparte}>À faire chez vous, ou pour découvrir l&rsquo;outil.</p>
          )}

          <div className={styles.detailActions}>
            {outilDetail.interactif && OUTILS_INTERACTIFS[outilDetail.interactif] && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setActiveOutilId(outilDetail.id)}
              >
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
        {visibleOutils.map((outil) => {
          const dansLaFiche = ficheItems.includes(outil.id);
          return (
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
              <label className={styles.tileFicheToggle}>
                <input
                  type="checkbox"
                  checked={dansLaFiche}
                  onChange={() => toggleFiche(outil.id)}
                />
                Dans ma fiche
              </label>
            </div>
          );
        })}
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
            <div className={`${styles.ficheGrid}${ficheDebordement ? ` ${styles.ficheGridCompact}` : ''}`}>
              {ficheOutils.map((outil) => {
                // Contenu personnalisé (S1/OI4) : si l'outil a des lignes enregistrées
                // (`outilsData[outil.id]`, via `store.get`), on les affiche à la place de
                // la consigne générique — le patient repart avec SES plans, pas un texte
                // générique. Repli sur `outil.consigneFiche` sinon (comportement d'origine).
                const perso = consultationStore.get(outil.id);
                return (
                  <div key={outil.id} className={styles.ficheItem}>
                    <p className={styles.ficheItemTitre}>{outil.titre}</p>
                    {perso.length > 0 ? (
                      perso.map((ligne, ligneIndex) => (
                        <p key={ligneIndex} className={styles.ficheItemConsigne}>
                          {ligne}
                        </p>
                      ))
                    ) : (
                      <p className={styles.ficheItemConsigne}>{outil.consigneFiche}</p>
                    )}
                  </div>
                );
              })}
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
