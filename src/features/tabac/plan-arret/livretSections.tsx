import type { ReactNode } from 'react';
import type { SelectionState } from '../../../state/SelectionContext';
import type { PrintableSection } from '../../../components/PrintableLivret';
import IllustrationSlot from '../components/IllustrationSlot';
import QRBlock from '../../../components/QRBlock';
import { PatchQuarts } from '../../../components/TitrationPatch';
import { FORMES_DATA, type FormeId } from '../../../content/tabac/substituts';
import { OUTILS, type Outil } from '../../../content/tabac/outils';
import { SITUATIONS, type PilierId } from '../../../content/tabac/situations';
import { ZONES, beneficesDeZone } from '../benefices-arret/data';
import { iconForRaison } from '../motivation/data';
import styles from '../../../components/PrintableLivret.module.css';

// Assemble le livret d'accompagnement (S11) à partir de l'état de sélection partagé
// (SelectionContext) et du CONTENU des modules (textes / illustrations réutilisés,
// jamais leur logique d'état). Le livret n'affiche que ce qui a été sélectionné ;
// les sections vides retombent sur un défaut doux (« à compléter »), jamais masquées.

const SITUATION_BY_ID = new Map(SITUATIONS.map((s) => [s.id, s]));
const OUTIL_BY_ID = new Map<string, Outil>(OUTILS.map((o) => [o.id, o]));
const FORME_IDS = new Set<string>(Object.keys(FORMES_DATA));

// Libellés des 3 composantes de l'addiction — repris du module Addiction
// (`AddictionModule.tsx` PILLARS_DATA, lecture seule, non exporté : simple duplication
// de libellé, aucune nouvelle taxonomie).
const PILIER_ORDER: PilierId[] = ['physique', 'psychologique', 'comportementale'];
const PILIER_LABELS: Record<PilierId, string> = {
  physique: 'Physique',
  psychologique: 'Psychologique',
  comportementale: 'Comportementale',
};

function Empty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

/** 1 · Comprendre — situations à risque cochées, regroupées par composante de l'addiction
 * (physique / psychologique / comportementale), + situations libres et non mappables sous « Autres ». */
function comprendreBody(state: SelectionState): ReactNode {
  const parPilier = new Map<PilierId, string[]>();
  const autres: string[] = [];
  for (const id of state.situations) {
    const def = SITUATION_BY_ID.get(id);
    if (!def) {
      // Situation sans pilier mappable (ex. donnée obsolète) : repli « Autres ».
      autres.push(id);
      continue;
    }
    const labels = parPilier.get(def.pilier) ?? [];
    labels.push(def.label);
    parPilier.set(def.pilier, labels);
  }
  autres.push(...state.situationsLibres);

  const groupes = PILIER_ORDER.map((pilier) => ({
    pilier,
    label: PILIER_LABELS[pilier],
    tags: parPilier.get(pilier) ?? [],
  })).filter((groupe) => groupe.tags.length > 0);

  if (groupes.length === 0 && autres.length === 0) {
    return (
      <Empty>À compléter avec votre soignant : les moments et les envies où le tabac s'invite.</Empty>
    );
  }
  return (
    <>
      <p className={styles.intro}>
        Les situations où l'envie se fait sentir — les repérer, c'est déjà pouvoir s'y préparer.
      </p>
      {groupes.map((groupe) => (
        <div key={groupe.pilier}>
          <p className={styles.subLabel}>{groupe.label}</p>
          <div className={styles.tagRow}>
            {groupe.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {autres.length > 0 && (
        <div>
          <p className={styles.subLabel}>Autres</p>
          <div className={styles.tagRow}>
            {autres.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/** 2 · Mes substituts — formes retenues + bonnes pratiques + illustration technique.
 * N'affiche que les formes réellement retenues dans `state.substituts` (aucun défaut :
 * un livret sans sélection tombe sur le repli « à compléter » ci-dessus). Le patch, s'il
 * est retenu, remplace les bonnes pratiques textuelles par la dose de titration choisie
 * (`state.titrationPatch`, cf. `SelectionContext` S11) et occupe sa propre page (D5b,
 * `.substitutBlockPatch`, cf. `PrintableLivret.module.css`). */
function substitutsBody(state: SelectionState): ReactNode {
  const formes = state.substituts.filter((id) => FORME_IDS.has(id)) as FormeId[];
  if (formes.length === 0) {
    return <Empty>À compléter avec votre soignant : la forme de substitut qui vous conviendra.</Empty>;
  }
  const dose = state.titrationPatch;
  const quartsNuitAffiche = Math.min(dose.quartsNuit, dose.quartsJour);
  return (
    <>
      {formes.map((forme) => {
        const data = FORMES_DATA[forme];
        const isPatch = forme === 'patch';
        return (
          <div
            key={forme}
            className={isPatch ? `${styles.substitutBlock} ${styles.substitutBlockPatch}` : styles.substitutBlock}
          >
            <div className={styles.substitutIllus}>
              <IllustrationSlot id={`substitut-${forme}`} label={`Technique — ${data.label}`} size={120} />
            </div>
            <div className={styles.substitutMain}>
              <p className={styles.substitutLabel}>{data.label}</p>
              {isPatch ? (
                <div className={styles.patchDose}>
                  <PatchQuarts quarts={dose.quartsJour} label="Jour" />
                  {dose.jourNuit && <PatchQuarts quarts={quartsNuitAffiche} label="Nuit" />}
                  <p className={styles.patchDoseLegende}>
                    Ma dose du moment — j'ajuste d'¼ tous les 3 jours selon mon ressenti, sans signe de
                    surdosage.
                  </p>
                </div>
              ) : (
                <ul className={styles.pratiquesList}>
                  {data.bonnesPratiques.map((pratique, index) => (
                    <li key={index}>{pratique}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

/** 3 · Mes outils & les 4D — outils « Dans ma fiche » (illustrés) + les 4D, présentés comme un
 * outil unique et identifiable. Si l'outil « Laisser passer la vague — les 4D » est déjà repris
 * dans « Mes outils », on ne duplique pas un second bloc « Les 4D ». */
function outilsParadesBody(state: SelectionState): ReactNode {
  const outils = state.outilsFiche
    .map((id) => OUTIL_BY_ID.get(id))
    .filter((outil): outil is Outil => Boolean(outil));
  const parades = state.parades;
  const vague4DDejaPresente = outils.some((outil) => outil.interactif === 'vague4d');
  const afficherLes4D = parades.length > 0 && !vague4DDejaPresente;
  if (outils.length === 0 && !afficherLes4D) {
    return <Empty>À compléter avec votre soignant : les 4D et les outils qui vous parlent.</Empty>;
  }
  return (
    <>
      {outils.length > 0 && (
        <div>
          <p className={styles.subLabel}>Mes outils</p>
          <div className={styles.outilGrid}>
            {outils.map((outil) => (
              <div key={outil.id} className={styles.outilCard}>
                <IllustrationSlot id={outil.id} label={outil.titre} size={64} />
                <div className={styles.outilBody}>
                  <p className={styles.outilTitre}>{outil.titre}</p>
                  <p className={styles.outilConsigne}>{outil.consigneFiche}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {afficherLes4D && (
        <div>
          <p className={styles.subLabel}>Les 4D</p>
          <div className={styles.tagRow}>
            {parades.map((parade) => (
              <span key={parade} className={styles.tag}>
                {parade}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/** 4 · Mes raisons — libellés retenus, avec icône (cf. Motivation). */
function raisonsBody(state: SelectionState): ReactNode {
  if (state.raisons.length === 0) {
    return <Empty>À compléter avec votre soignant : ce qui compte pour vous dans cet arrêt.</Empty>;
  }
  return (
    <ul className={styles.raisonList}>
      {state.raisons.map((raison) => {
        const Icon = iconForRaison(raison);
        return (
          <li key={raison} className={styles.raisonItem}>
            <Icon size={20} aria-hidden="true" className={styles.raisonIcon} />
            <span>{raison}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** 5 · Si j'ai un écart — gestes de reprise préparés. */
function ecartBody(state: SelectionState): ReactNode {
  if (state.gestesEcart.length === 0) {
    return (
      <Empty>À préparer avec votre soignant : les gestes pour repartir aussitôt après un écart.</Empty>
    );
  }
  return (
    <>
      <p className={styles.intro}>
        Un écart n'est pas une rechute : les 24 heures qui suivent comptent. Mes gestes pour repartir
        aussitôt :
      </p>
      <ul className={styles.list}>
        {state.gestesEcart.map((geste) => (
          <li key={geste}>{geste}</li>
        ))}
      </ul>
    </>
  );
}

/** 6 · Mes bénéfices — organe par organe (section fixe, encourageante). */
function beneficesBody(): ReactNode {
  return (
    <>
      <p className={styles.intro}>
        Ce que l'arrêt répare, organe par organe — quels que soient l'âge et les années de tabac.
      </p>
      <div className={styles.beneficeGrid}>
        {ZONES.map((zone) => {
          const premier = beneficesDeZone(zone.id)[0];
          return (
            <div key={zone.id} className={styles.beneficeCard}>
              <IllustrationSlot id={`benef-${zone.id}`} label={zone.illustrationLabel} size={56} />
              <div className={styles.beneficeBody}>
                <p className={styles.beneficeLabel}>{zone.label}</p>
                {premier && (
                  <p className={styles.beneficeText}>
                    <strong>{premier.echeance}</strong> — {premier.texte}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className={styles.beneficeNote}>Il n'est jamais trop tard — ni trop tôt.</p>
    </>
  );
}

/** 7 · Contacts — section fixe (Tabac Info Service 39 89). */
function contactsBody(): ReactNode {
  return (
    <>
      <div className="fiche-contact">
        <span className="fiche-contact-numero">39 89</span>
        <div>
          <p>Tabac Info Service — appel non surtaxé, du lundi au samedi.</p>
          <p>En parler à un proche · être accompagné·e par un professionnel.</p>
        </div>
      </div>
      <QRBlock />
    </>
  );
}

/** Construit les sections du livret — ordre aide-mémoire d'usage (D3) : situations à risque,
 * substituts, outils/4D, écart, motivations, ce que l'arrêt répare, contacts. */
export function buildLivretSections(state: SelectionState): PrintableSection[] {
  return [
    { id: 'comprendre', eyebrow: 'Comprendre', title: 'Mes situations à risque', body: comprendreBody(state) },
    { id: 'substituts', eyebrow: 'Traiter le manque', title: 'Mes substituts', body: substitutsBody(state) },
    {
      id: 'outils-parades',
      eyebrow: 'Agir',
      title: 'Mes outils & les 4D',
      body: outilsParadesBody(state),
    },
    { id: 'ecart', eyebrow: 'Rebondir', title: "Si j'ai un écart", body: ecartBody(state) },
    { id: 'raisons', eyebrow: 'Ma motivation', title: "Mes raisons d'arrêter", body: raisonsBody(state) },
    {
      id: 'benefices',
      eyebrow: 'Ce que ça change',
      title: "Ce que l'arrêt répare",
      body: beneficesBody(),
      breakBefore: true,
    },
    { id: 'contacts', eyebrow: 'Autour de moi', title: 'Contacts utiles', body: contactsBody() },
  ];
}
