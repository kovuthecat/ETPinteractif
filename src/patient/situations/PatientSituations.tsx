import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  SITUATIONS,
  type PilierId,
  type SituationDef,
} from '../../content/tabac/situations';
import { OUTILS, PREUVE_LABELS, type Outil } from '../../content/tabac/outils';
import styles from './PatientSituations.module.css';

interface PatientSituationsProps {
  /** Retour à l'accueil de l'app patient (géré par PatientApp). */
  onBack: () => void;
}

const PILIER_ORDER: PilierId[] = ['physique', 'psychologique', 'comportementale'];

// à revalider (Thibault) : libellés de pilier auto-portants (réutilisent le sens des
// libellés soignant de BoiteAOutilsModule.tsx, redéfinis ici localement pour ne jamais
// importer `src/features/**` depuis le bundle patient, cf. plans/aide-patient/index.md
// §Architecture cible).
const PILIER_LABELS: Record<PilierId, string> = {
  physique: 'Signes physiques du manque',
  psychologique: 'Ce que la cigarette apporte',
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
 * (src/features/tabac/components/) pour ne pas faire dépendre le bundle patient de
 * l'arbre `src/features/**`. Cible `public/illustrations/tabac/<outil.id>.png`
 * (l'id d'un `Outil` porte déjà le préfixe `outil-`) ; fallback neutre si absente
 * (cf. S4 « Si bloqué »).
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
 * consultation — cf. `BoiteAOutilsModule.tsx`, non importé). v1 patient = lecture
 * seule : aucun bouton interactif, aucun renvoi inter-modules (cf. S4 « Hors périmètre »).
 */
export default function PatientSituations({ onBack }: PatientSituationsProps) {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);

  if (selectedSituation) {
    const situation = SITUATIONS.find((s) => s.id === selectedSituation) ?? null;
    const outilsAdaptes = OUTILS.filter(
      (o) => o.transverse || o.situations.includes(selectedSituation),
    );

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
            onClick={() => setSelectedSituation(null)}
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
            </article>
          ))}
        </div>
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
