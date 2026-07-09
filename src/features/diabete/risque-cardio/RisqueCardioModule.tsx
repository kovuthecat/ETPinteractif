import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { ModuleProps } from '../../types';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import FicheOverlay from '../../../components/FicheOverlay';
import IllustrationSlot from '../components/IllustrationSlot';
import PlaqueArtere from '../components/PlaqueArtere';
import Silhouette, { SILHOUETTE_ANCHORS, SILHOUETTE_VIEWBOX } from '../components/Silhouette';
import type { ZoneId, SilhouetteZoneState } from '../components/Silhouette';
import styles from './RisqueCardioModule.module.css';

/**
 * Module 4 — Risque cardiovasculaire (D7, plans/theme-diabete/S7.md). Chaîne causale en 4 vues
 * persistantes (mêmes 5 feux partagés entre elles) : ① les leviers → ② l'artère (mécanisme,
 * réversible) → ③ l'anatomie (conséquence, via Silhouette + PlaqueArtere) → ④ la fiche.
 * Portage fidèle de la maquette M4 ; `PlaqueArtere`/`Silhouette` (S3) sont consommés tels quels,
 * jamais redessinés (cf. brief §1.4). Outil « pour voir », non diagnostique : aucune donnée
 * réelle n'est saisie ni conservée.
 */

type FeuId = 'sucre' | 'tension' | 'cholesterol' | 'tabac' | 'sedentarite';
type FeuEtat = 'vert' | 'orange' | 'rouge';
type Vue = 1 | 2 | 3 | 4;
type ZoneM4 = 'cou' | 'coeur' | 'jambes';

interface FeuDef {
  id: FeuId;
  nom: string;
  illustration: string;
}

const FEUX: FeuDef[] = [
  { id: 'sucre', nom: 'Sucre', illustration: 'risque-cardio-feu-sucre' },
  { id: 'tension', nom: 'Tension', illustration: 'risque-cardio-feu-tension' },
  { id: 'cholesterol', nom: 'Cholestérol', illustration: 'risque-cardio-feu-cholesterol' },
  { id: 'tabac', nom: 'Tabac', illustration: 'risque-cardio-feu-tabac' },
  { id: 'sedentarite', nom: 'Sédentarité', illustration: 'risque-cardio-feu-sedentarite' },
];

// Seuils affichés au survol de chaque feu (2ᵉ niveau) — repris verbatim de la maquette M4.
// à revalider (Thibault) avant tout usage réel en consultation.
const SEUILS: Record<FeuId, string> = {
  sucre: 'HbA1c < 7 %',
  tension: 'TA < 130/80',
  cholesterol: 'LDL selon le risque',
  tabac: '0 cigarette / jour',
  sedentarite: '≥ 150 min / semaine',
};

const STATE_ORDER: FeuEtat[] = ['vert', 'orange', 'rouge'];
const STATE_WEIGHT: Record<FeuEtat, number> = { vert: 0, orange: 0.5, rouge: 1 };
const STATE_LABELS: Record<FeuEtat, string> = { vert: 'Vert', orange: 'Orange', rouge: 'Rouge' };

// Convention sémantique du projet (tokens.css) : vert = confort, ambre = vigilance, rouge = toxique.
// Fonds toujours en teinte « soft », texte/bord en teinte pleine — la couleur n'est jamais seule,
// le libellé Vert/Orange/Rouge double toujours l'information.
const FEU_TOKENS: Record<FeuEtat, { fg: string; soft: string }> = {
  vert: { fg: 'var(--color-confort-strong)', soft: 'var(--color-confort-soft)' },
  orange: { fg: 'var(--color-vigilance)', soft: 'var(--color-vigilance-soft)' },
  rouge: { fg: 'var(--color-toxique)', soft: 'var(--color-toxique-soft)' },
};

interface ZoneDef {
  id: ZoneM4;
  nom: string;
  desc: string;
}

const ZONES: ZoneDef[] = [
  {
    id: 'cou',
    nom: 'Cou',
    desc: "Une artère du cou bouchée peut priver une partie du cerveau de sang : c'est l'AVC.",
  },
  {
    id: 'coeur',
    nom: 'Cœur',
    desc: "Une artère du cœur bouchée l'empêche de recevoir assez de sang : c'est l'infarctus.",
  },
  {
    id: 'jambes',
    nom: 'Jambes',
    desc: 'Des artères des jambes bouchées font mal à la marche : c\'est l\'artériopathie.',
  },
];

const ALL_SILHOUETTE_ZONES: ZoneId[] = ['cerveau', 'yeux', 'coeur', 'cou', 'reins', 'nerfs', 'jambes', 'pied'];

const VUES: { n: Vue; label: string; caption: string }[] = [
  {
    n: 1,
    label: '① Les leviers',
    caption: 'Sucre, tension, cholestérol, tabac, sédentarité : cinq endroits où on peut agir ensemble.',
  },
  {
    n: 2,
    label: "② L'artère",
    caption:
      "Une maladie des vaisseaux : chaque feu au rouge encrasse un peu l'artère — et le mouvement se fait dans les deux sens.",
  },
  {
    n: 3,
    label: "③ L'anatomie",
    caption: 'La même plaque, vue selon l\'endroit où elle se pose : cou, cœur, jambes.',
  },
  {
    n: 4,
    label: '④ La fiche',
    caption: 'On coche, avec le patient, les leviers à retenir pour aujourd\'hui — pas forcément les cinq.',
  },
];

function nextEtat(etat: FeuEtat): FeuEtat {
  return STATE_ORDER[(STATE_ORDER.indexOf(etat) + 1) % STATE_ORDER.length];
}

function feuTokenStyle(etat: FeuEtat): CSSProperties {
  return { '--feu-fg': FEU_TOKENS[etat].fg, '--feu-soft': FEU_TOKENS[etat].soft } as CSSProperties;
}

export default function RisqueCardioModule({ onNavigate }: ModuleProps) {
  const [vue, setVue] = useState<Vue>(1);
  const [factors, setFactors] = useState<Record<FeuId, FeuEtat>>({
    sucre: 'vert',
    tension: 'vert',
    cholesterol: 'vert',
    tabac: 'vert',
    sedentarite: 'vert',
  });
  const [hoverFeu, setHoverFeu] = useState<FeuId | null>(null);
  const [zoneActive, setZoneActive] = useState<ZoneM4 | null>(null);
  const [ficheChecked, setFicheChecked] = useState<Partial<Record<FeuId, boolean>>>({});
  const [ficheOpen, setFicheOpen] = useState(false);

  function cycleFactor(id: FeuId) {
    setFactors((prev) => ({ ...prev, [id]: nextEtat(prev[id]) }));
  }

  function toggleFiche(id: FeuId) {
    setFicheChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleZoneClick(id: ZoneId) {
    if (id !== 'cou' && id !== 'coeur' && id !== 'jambes') return;
    setZoneActive((z) => (z === id ? null : id));
  }

  // ---- Score cumulé (0..1) : les feux se potentialisent, ce n'est jamais affiché comme note. ----
  const scoreSum = FEUX.reduce((acc, f) => acc + STATE_WEIGHT[factors[f.id]], 0);
  const score = scoreSum / FEUX.length;
  const rougeCount = FEUX.filter((f) => factors[f.id] === 'rouge').length;

  const arteryMessage =
    score === 0
      ? "Tous les feux au vert : l'artère reste dégagée."
      : rougeCount <= 1
        ? 'Un feu au rouge dépose un peu de plaque — encore réversible.'
        : rougeCount <= 3
          ? "Les feux rouges ne s'additionnent pas : ils se potentialisent — la même plaque grossit plus vite à plusieurs."
          : "Cumulés, les feux rouges bouchent nettement l'artère — l'effet est bien plus que la somme de chacun.";
  const reopenMessage =
    " Remettez un feu au vert : la plaque se résorbe — c'est le message d'espoir (Rawshani).";
  const arteryMessageFull = arteryMessage + (rougeCount > 0 ? reopenMessage : '');

  const zonesForSilhouette: SilhouetteZoneState[] = ALL_SILHOUETTE_ZONES.map((id) => {
    if (id === 'cou' || id === 'coeur' || id === 'jambes') {
      return { id, etat: zoneActive === id ? 'ouvert' : 'actif' };
    }
    return { id, etat: 'masque' };
  });

  const zoneActiveDef = zoneActive ? ZONES.find((z) => z.id === zoneActive) : undefined;
  const vueInfo = VUES[vue - 1];

  return (
    <div className={styles.module}>
      <nav className={styles.tabs} aria-label="Étapes du module">
        {VUES.map((v) => (
          <button
            key={v.n}
            type="button"
            className={`${styles.tab}${vue === v.n ? ` ${styles.tabActive}` : ''}`}
            aria-pressed={vue === v.n}
            onClick={() => setVue(v.n)}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {vue === 1 && (
        <div className={styles.vueBody}>
          <p className={styles.vueEyebrow}>Là où on peut agir ensemble — cliquez un feu pour le régler</p>
          <div className={styles.feuxRow}>
            {FEUX.map((f) => {
              const etat = factors[f.id];
              return (
                <div key={f.id} className={styles.feuCard} style={feuTokenStyle(etat)}>
                  <IllustrationSlot id={f.illustration} label={f.nom} shape="circle" size={74} />
                  <p className={styles.feuNom}>{f.nom}</p>
                  <button
                    type="button"
                    className={styles.feuState}
                    onClick={() => cycleFactor(f.id)}
                    onMouseEnter={() => setHoverFeu(f.id)}
                    onMouseLeave={() => setHoverFeu(null)}
                    onFocus={() => setHoverFeu(f.id)}
                    onBlur={() => setHoverFeu(null)}
                    aria-describedby={hoverFeu === f.id ? `feu-seuil-${f.id}` : undefined}
                  >
                    {STATE_LABELS[etat]}
                  </button>
                  {hoverFeu === f.id && (
                    <p id={`feu-seuil-${f.id}`} role="tooltip" className={styles.feuTooltip}>
                      {SEUILS[f.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className={styles.vueHint}>
            Pas un score : un tableau de leviers. On règle chaque feu pour voir ce qui se passe —
            aucune donnée réelle n'est saisie.
          </p>
        </div>
      )}

      {vue === 2 && (
        <div className={styles.vueBody}>
          <div className={styles.chipsRow}>
            {FEUX.map((f) => {
              const etat = factors[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  className={styles.chipFeu}
                  style={feuTokenStyle(etat)}
                  onClick={() => cycleFactor(f.id)}
                  aria-pressed={etat !== 'vert'}
                >
                  {f.nom}
                </button>
              );
            })}
          </div>

          <div className={`${styles.arterePanel} card`}>
            <p className={styles.artereEyebrow}>L'artère — un seul objet, réversible</p>
            <PlaqueArtere encrassement={score} variante="artere" />
          </div>

          <p className={styles.artereMessage}>{arteryMessageFull}</p>
        </div>
      )}

      {vue === 3 && (
        <div className={styles.vueBody}>
          <p className={styles.vueEyebrow}>Une fois bouchée, où ça se joue — cliquez une zone du corps</p>
          <div className={styles.anatomieRow}>
            <div className={styles.silhouetteWrap}>
              <Silhouette zones={zonesForSilhouette} onZoneClick={handleZoneClick}>
                {rougeCount > 0 &&
                  ZONES.map((z) => {
                    const anchor = SILHOUETTE_ANCHORS[z.id];
                    const leftPct = (anchor.x / SILHOUETTE_VIEWBOX.width) * 100;
                    const topPct = (anchor.y / SILHOUETTE_VIEWBOX.height) * 100;
                    return (
                      <div
                        key={z.id}
                        className={styles.plaquePin}
                        aria-hidden="true"
                        style={{ left: `${leftPct}%`, top: `calc(${topPct}% + ${anchor.r + 16}px)` }}
                      >
                        <PlaqueArtere encrassement={score} variante="pastille" />
                      </div>
                    );
                  })}
              </Silhouette>
            </div>
            <div className={styles.zonesCol}>
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`${styles.zoneBtn}${zoneActive === z.id ? ` ${styles.zoneBtnActive}` : ''}`}
                  onClick={() => handleZoneClick(z.id)}
                  aria-pressed={zoneActive === z.id}
                >
                  {z.nom}
                </button>
              ))}
              <div className={`${styles.zoneDescPanel} card`}>
                <p>
                  {zoneActiveDef
                    ? zoneActiveDef.desc
                    : 'Choisissez une zone pour voir ce que « l\'artère bouchée » veut dire, concrètement.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {vue === 4 && (
        <div className={styles.vueBody}>
          <p className={styles.vueEyebrow}>La fiche — les leviers à retenir pour ce patient</p>
          <div className={styles.ficheItemsRow}>
            {FEUX.map((f) => {
              const checked = !!ficheChecked[f.id];
              const etat = factors[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`${styles.ficheItemCard}${checked ? ` ${styles.ficheItemCardOn}` : ''}`}
                  style={feuTokenStyle(etat)}
                  onClick={() => toggleFiche(f.id)}
                  aria-pressed={checked}
                >
                  <IllustrationSlot id={f.illustration} label={f.nom} shape="circle" size={56} />
                  <span className={styles.ficheItemNom}>{f.nom}</span>
                  <span className={styles.ficheCheckDot} aria-hidden="true">
                    {checked ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
          <div className={`${styles.encadre} card`}>
            <p>
              Il y a une part qui ne dépend pas de vous — l'âge, l'ancienneté du diabète, l'hérédité.
              Raison de plus d'agir sur ces 5 leviers qui, eux, dépendent de vous.
            </p>
          </div>
          <div className={styles.ficheButtonRow}>
            <button type="button" className="btn btn--primary" onClick={() => setFicheOpen(true)}>
              Imprimer mes feux
            </button>
          </div>
        </div>
      )}

      <div className={styles.caption}>
        <span className="eyebrow">{vueInfo.label}</span>
        <p className={styles.captionText}>{vueInfo.caption}</p>
      </div>

      <ModuleFooterNav
        items={[
          { id: 'complications', label: 'Et il y a aussi les petits vaisseaux…' },
          { id: 'suivi', label: 'Ces feux, voici quand on les rallume' },
        ]}
        onNavigate={onNavigate}
      />

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · DIABÈTE"
          titre="Mes feux — risque cardiovasculaire"
          footer={
            <p className="fiche-filrouge">
              Le diabète est une maladie des vaisseaux, pas seulement du sucre — agir sur tout
              ensemble protège.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Mes 5 feux aujourd'hui</span>
            <div className={styles.ficheFeuxList}>
              {FEUX.map((f) => {
                const etat = factors[f.id];
                return (
                  <div key={f.id} className={styles.ficheFeuxItem} style={feuTokenStyle(etat)}>
                    <span className={styles.ficheFeuxPastille} aria-hidden="true" />
                    <span className={styles.ficheFeuxNom}>{f.nom}</span>
                    <span className={styles.ficheFeuxEtat}>{STATE_LABELS[etat]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Leviers retenus pour aujourd'hui</span>
            <div className={styles.ficheDList}>
              {FEUX.map((f) => {
                const checked = !!ficheChecked[f.id];
                return (
                  <label
                    key={f.id}
                    className={`${styles.ficheDItem}${checked ? ` ${styles.ficheDItemActive}` : ''}`}
                  >
                    <input type="checkbox" data-no-print checked={checked} onChange={() => toggleFiche(f.id)} />
                    <span>{f.nom}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="fiche-bloc">
            <p className={styles.ficheEncadreTexte}>
              Il y a une part qui ne dépend pas de vous — l'âge, l'ancienneté du diabète, l'hérédité.
              Raison de plus d'agir sur ces 5 leviers qui, eux, dépendent de vous.
            </p>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
