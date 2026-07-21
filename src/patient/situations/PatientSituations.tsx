import { useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import {
  SITUATIONS,
  type PilierId,
  type SituationDef,
} from '../../content/tabac/situations';
import { OUTILS, PREUVE_LABELS, selectionnerOutilsPertinents, type Outil } from '../../content/tabac/outils';
import { OUTILS_INTERACTIFS } from '../../features/tabac/boite-a-outils/outils-interactifs/registry';
import GabaritJournal from '../../features/tabac/boite-a-outils/outils-interactifs/GabaritJournal';
import { usePatientStore } from './usePatientStore';
import styles from './PatientSituations.module.css';

interface PatientSituationsProps {
  /** Retour à l'accueil de l'app patient (géré par PatientApp). */
  onBack: () => void;
  /**
   * Navigation vers une autre vue de l'app patient (S7/OI11) : seul usage actuel, renvoyer
   * vers le carnet existant (`PatientCarnet`) depuis l'outil « Une semaine d'observation »,
   * sans dupliquer sa logique de persistance. Injectée par `PatientApp` (réutilise `go`).
   */
  onNavigate: (vue: 'carnet') => void;
}

const PILIER_ORDER: PilierId[] = ['physique', 'psychologique', 'comportementale'];

// à revalider (Thibault) : libellés de pilier auto-portants (réutilisent le sens des
// libellés soignant de BoiteAOutilsModule.tsx), redéfinis ici localement plutôt
// qu'importés — l'ancienne contrainte dure « jamais `src/features/**` depuis le bundle
// patient » (plans/aide-patient/index.md §Architecture cible) est assouplie côté outils
// interactifs par le registre partagé (G1, plans/outils-interactifs-2026-07/index.md),
// mais ce petit mapping de libellés reste local par simplicité, sans dépendance nouvelle.
const PILIER_LABELS: Record<PilierId, string> = {
  physique: 'Signes physiques du manque',
  psychologique: 'Émotions propices au tabac', // à revalider (Thibault)
  comportementale: 'Automatismes du quotidien',
};

// Même mapping couleur que la consultation (BoiteAOutilsModule) : physique → vigilance,
// psychologique → nav (classe `chip` par défaut), comportementale → confort. Couleur
// jamais seule : chaque chip porte aussi le libellé de la situation (cf. tokens.css).
const PILIER_CHIP_CLASS: Record<PilierId, string> = {
  physique: 'chip chip--vigilance',
  psychologique: 'chip',
  comportementale: 'chip chip--confort',
};

/**
 * Illustration locale, propre à l'app patient (même pattern que `FormeIllustration` dans
 * `PatientSubstituts.tsx`) : ne dépend jamais de `IllustrationSlot`
 * (src/features/tabac/components/) — ce composant précis reste évité même si, depuis
 * S1/OI3, le fichier importe désormais `OUTILS_INTERACTIFS` (registre partagé sous
 * `src/features/tabac/boite-a-outils/`) pour le câblage générique des outils interactifs
 * (G1). Cible `public/illustrations/tabac/<outil.id>.png` (l'id d'un `Outil` porte déjà
 * le préfixe `outil-`) ; fallback neutre si absente (cf. S4 « Si bloqué »).
 */
function OutilIllustration({ id, label }: { id: string; label: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={styles.illustrationFallback} role="img" aria-label={label}>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}illustrations/tabac/${id}.png`}
      alt={label}
      className={styles.illustration}
      onError={() => setErrored(true)}
    />
  );
}

/**
 * Reformulation en voix patient du champ `Outil.proposition` (écrit en voix soignant,
 * cf. plans/aide-patient/index.md §Décisions n°5 : « comment le proposer » → « comment
 * faire »). Le texte source est déjà, pour la quasi-totalité des 14 outils, rédigé à
 * l'impératif « vous »/en « je » directement actionnable par le patient seul — le
 * cadrage à changer est donc surtout celui du *titre* de section (assuré par le rendu,
 * cf. plus bas « Comment faire »), pas le contenu lui-même.
 *
 * Seule exception retenue : `outil-journal`, dont la phrase de fin (« ce sont elles
 * qu'on équipera d'une parade ») porte un « on » de consultation partagée (soignant +
 * patient) qui n'a plus de sens quand le patient lit seul. Reformulée en adressage
 * direct, sans changer le sens clinique (même conseil : repérer ses situations à
 * risque pour leur préparer une parade).
 * // à revalider (Thibault) : reformulation voix patient ci-dessous.
 */
function commentFaire(outil: Outil): string {
  if (outil.id === 'outil-journal') {
    return outil.proposition.replace(
      "Vous verrez vos situations à risque se dessiner — ce sont elles qu'on équipera d'une parade.",
      'Vous verrez vos situations à risque se dessiner — ce sont elles que vous équiperez, une par une, d\'une parade.',
    );
  }
  return outil.proposition;
}

/**
 * Écran patient « Agir face à une situation » (plans/aide-patient/S4.md, T4) : choix
 * d'une situation à risque (parmi les 20 de `situations.ts`, groupées par pilier) puis
 * outils adaptés (mapping `Outil.situations` ∪ `Outil.transverse`, même règle que la
 * consultation — cf. `BoiteAOutilsModule.tsx`, non importé). v1 patient était « lecture
 * seule » sauf l'outil `outil-respiration` (E6, plans/revue-chrome-2026-07/S15.md).
 *
 * Cadrage étendu (G1, plans/outils-interactifs-2026-07/index.md « Gates » — TRANCHÉ
 * 2026-07-21) : **tous** les outils interactifs (registre `OUTILS_INTERACTIFS`) sont
 * désormais exposés côté patient, persistés en local (`usePatientStore`) — plus de cas
 * spécial pour la respiration, elle devient une entrée générique du registre comme les
 * autres.
 */
export default function PatientSituations({ onBack, onNavigate }: PatientSituationsProps) {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  // Outil interactif actuellement lancé (S1/OI3) — distinct de `selectedSituation`, réinitialisé
  // au changement de situation (cf. bouton « Autre situation » plus bas).
  const [activeOutilId, setActiveOutilId] = useState<string | null>(null);
  const patientStore = usePatientStore();

  if (selectedSituation) {
    const situation = SITUATIONS.find((s) => s.id === selectedSituation) ?? null;
    // Pertinence par pilier (E4) : même fonction de sélection/tri que la consultation
    // (BoiteAOutilsModule) — repli sur `OUTILS` en entier si la situation est introuvable.
    const outilsAdaptes = selectionnerOutilsPertinents(OUTILS, situation ? [situation] : []);
    const activeOutil = activeOutilId
      ? (outilsAdaptes.find((o) => o.id === activeOutilId) ?? null)
      : null;
    const ActiveOutilComponent = activeOutil?.interactif
      ? OUTILS_INTERACTIFS[activeOutil.interactif]
      : undefined;

    return (
      <div className={styles.screen}>
        <div className={styles.backRow}>
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            Accueil
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setSelectedSituation(null);
              setActiveOutilId(null);
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Autre situation
          </button>
        </div>
        <h1 className={styles.titre}>{situation?.label ?? 'Situation'}</h1>
        {/* à revalider (Thibault) : phrase de cadrage auto-portante */}
        <p className={styles.intro}>Voici ce qui peut vous aider dans cette situation.</p>

        <div className={styles.list}>
          {outilsAdaptes.map((outil) => (
            <article key={outil.id} className={`${styles.card} card`}>
              <div className={styles.cardHead}>
                <span className={styles.cardIllustration}>
                  <OutilIllustration id={outil.id} label={outil.titre} />
                </span>
                <div className={styles.cardHeadText}>
                  <h2 className={styles.cardTitre}>{outil.titre}</h2>
                  <p className={styles.preuve}>{PREUVE_LABELS[outil.preuve]}</p>
                </div>
              </div>
              <p className={styles.principe}>{outil.principe}</p>
              <div className={styles.commentFaireBlock}>
                <span className="eyebrow">Comment faire</span>
                <p className={styles.commentFaire}>{commentFaire(outil)}</p>
              </div>
              {outil.interactif && OUTILS_INTERACTIFS[outil.interactif] && (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setActiveOutilId(outil.id)}
                >
                  <Play size={16} aria-hidden="true" />
                  Démarrer
                </button>
              )}
            </article>
          ))}
        </div>

        {/* Journal (S7/OI11, Gate G5) : câblage direct plutôt que via `ActiveOutilComponent`
            (typé `OutilInteractifProps` par le registre, sans `onOuvrirCarnet`) — c'est le
            seul outil qui a besoin de naviguer vers une autre vue de l'app patient plutôt que
            de rester dans l'overlay/la carte inline. */}
        {activeOutil && activeOutil.interactif === 'journal' && (
          <GabaritJournal
            outil={activeOutil}
            store={patientStore}
            contexte={{ situationsActives: situation ? [situation] : [] }}
            onClose={() => setActiveOutilId(null)}
            onOuvrirCarnet={() => onNavigate('carnet')}
          />
        )}
        {activeOutil && activeOutil.interactif !== 'journal' && ActiveOutilComponent && (
          <ActiveOutilComponent
            outil={activeOutil}
            store={patientStore}
            contexte={{ situationsActives: situation ? [situation] : [] }}
            onClose={() => setActiveOutilId(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <button type="button" className={`btn btn--ghost ${styles.back}`} onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" />
        Accueil
      </button>
      <h1 className={styles.titre}>Agir face à une situation</h1>
      {/* à revalider (Thibault) : phrase de cadrage auto-portante */}
      <p className={styles.intro}>Quelle situation vous donne le plus envie de fumer ?</p>

      <div className={styles.groups}>
        {PILIER_ORDER.map((pilier) => (
          <div key={pilier} className={styles.pilierGroup}>
            <span className={styles.pilierLabel}>{PILIER_LABELS[pilier]}</span>
            <div className={styles.chipRow}>
              {SITUATIONS.filter((s: SituationDef) => s.pilier === pilier).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${PILIER_CHIP_CLASS[pilier]} ${styles.situationChip}`}
                  onClick={() => setSelectedSituation(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
