import type { ReactNode } from 'react';
import type { SelectionState } from '../../../state/SelectionContext';
import type { PrintableSection } from '../../../components/PrintableLivret';
import IllustrationSlot from '../components/IllustrationSlot';
import { FORMES_DATA, type FormeId } from '../substituts/data';
import { OUTILS, type Outil } from '../boite-a-outils/data';
import { SITUATIONS } from '../situations';
import { ZONES, beneficesDeZone } from '../benefices-arret/data';
import { iconForRaison } from '../motivation/data';
import styles from '../../../components/PrintableLivret.module.css';

// Assemble le livret d'accompagnement (S11) à partir de l'état de sélection partagé
// (SelectionContext) et du CONTENU des modules (textes / illustrations réutilisés,
// jamais leur logique d'état). Le livret n'affiche que ce qui a été sélectionné ;
// les sections vides retombent sur un défaut doux (« à compléter »), jamais masquées.

const SITUATION_LABEL_BY_ID = new Map(SITUATIONS.map((s) => [s.id, s.label]));
const OUTIL_BY_ID = new Map<string, Outil>(OUTILS.map((o) => [o.id, o]));
const FORME_IDS = new Set<string>(Object.keys(FORMES_DATA));

function Empty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

/** 1 · Comprendre — situations à risque cochées (+ situations libres). */
function comprendreBody(state: SelectionState): ReactNode {
  const situations = state.situations
    .map((id) => SITUATION_LABEL_BY_ID.get(id))
    .filter((label): label is string => Boolean(label));
  const tags = [...situations, ...state.situationsLibres];
  if (tags.length === 0) {
    return (
      <Empty>À compléter avec votre soignant : les moments et les envies où le tabac s'invite.</Empty>
    );
  }
  return (
    <>
      <p className={styles.intro}>
        Les situations où l'envie se fait sentir — les repérer, c'est déjà pouvoir s'y préparer.
      </p>
      <div className={styles.tagRow}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

/** 2 · Mes substituts — formes retenues + bonnes pratiques + illustration technique. */
function substitutsBody(state: SelectionState): ReactNode {
  const formes = state.substituts.filter((id) => FORME_IDS.has(id)) as FormeId[];
  if (formes.length === 0) {
    return <Empty>À compléter avec votre soignant : la forme de substitut qui vous conviendra.</Empty>;
  }
  return (
    <>
      {formes.map((forme) => {
        const data = FORMES_DATA[forme];
        return (
          <div key={forme} className={styles.substitutBlock}>
            <div className={styles.substitutIllus}>
              <IllustrationSlot id={`substitut-${forme}`} label={`Technique — ${data.label}`} size={120} />
            </div>
            <div className={styles.substitutMain}>
              <p className={styles.substitutLabel}>{data.label}</p>
              <ul className={styles.pratiquesList}>
                {data.bonnesPratiques.map((pratique, index) => (
                  <li key={index}>{pratique}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </>
  );
}

/** 3 · Situations & parades — outils « Dans ma fiche » (illustrés) + parades 4D. */
function outilsParadesBody(state: SelectionState): ReactNode {
  const outils = state.outilsFiche
    .map((id) => OUTIL_BY_ID.get(id))
    .filter((outil): outil is Outil => Boolean(outil));
  const parades = state.parades;
  if (outils.length === 0 && parades.length === 0) {
    return <Empty>À compléter avec votre soignant : vos parades et les outils qui vous parlent.</Empty>;
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
      {parades.length > 0 && (
        <div>
          <p className={styles.subLabel}>Mes parades</p>
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
    <div className="fiche-contact">
      <span className="fiche-contact-numero">39 89</span>
      <div>
        <p>Tabac Info Service — appel non surtaxé, du lundi au samedi.</p>
        <p>En parler à un proche · être accompagné·e par un professionnel.</p>
      </div>
    </div>
  );
}

/** Construit les sections du livret dans l'ordre du parcours. */
export function buildLivretSections(state: SelectionState): PrintableSection[] {
  return [
    { id: 'comprendre', eyebrow: 'Comprendre', title: 'Mes situations à risque', body: comprendreBody(state) },
    { id: 'substituts', eyebrow: 'Traiter le manque', title: 'Mes substituts', body: substitutsBody(state) },
    {
      id: 'outils-parades',
      eyebrow: 'Agir',
      title: 'Mes parades & mes outils',
      body: outilsParadesBody(state),
    },
    { id: 'raisons', eyebrow: 'Ma motivation', title: "Mes raisons d'arrêter", body: raisonsBody(state) },
    { id: 'ecart', eyebrow: 'Rebondir', title: "Si j'ai un écart", body: ecartBody(state) },
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
