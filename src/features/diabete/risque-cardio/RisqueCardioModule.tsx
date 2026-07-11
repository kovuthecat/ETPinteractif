import { useState } from 'react';
import type { CSSProperties, ComponentType } from 'react';
import { Droplet, Gauge, Droplets, Cigarette, Armchair } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import FicheOverlay from '../../../components/FicheOverlay';
import PlaqueArtere, { plaquePassagePct } from '../components/PlaqueArtere';
import Silhouette from '../components/Silhouette';
import type { ZoneId, SilhouetteZoneState } from '../components/Silhouette';
import styles from './RisqueCardioModule.module.css';

/**
 * Module 4 — Risque cardiovasculaire (D7, plans/theme-diabete/S7.md ; illustration-driven depuis
 * S3, plans/illustrations-diabete/S3.md). Chaîne causale en 4 vues persistantes (mêmes 5 feux
 * partagés entre elles) : ① les leviers (icônes lucide) → ② l'artère (illustration `artere-saine.png`
 * + plaque codée qui grossit dessus) → ③ l'anatomie (silhouette `bodyImage` + plaque en image posée
 * sur le territoire) → ④ la fiche. Outil « pour voir », non diagnostique : aucune donnée réelle
 * n'est saisie ni conservée.
 */

type FeuId = 'sucre' | 'tension' | 'cholesterol' | 'tabac' | 'sedentarite';
type FeuEtat = 'vert' | 'orange' | 'rouge';
type Vue = 1 | 2 | 3 | 4;
type ZoneM4 = 'cou' | 'coeur' | 'jambes';

interface FeuDef {
  id: FeuId;
  nom: string;
  Icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
}

// Feux → lucide (index illustrations-diabete §4) : la sémantique vert/ambre/rouge de l'état reste
// portée par la carte (bordure + bouton d'état), jamais par la couleur de l'icône elle-même.
const FEUX: FeuDef[] = [
  { id: 'sucre', nom: 'Sucre', Icon: Droplet },
  { id: 'tension', nom: 'Tension', Icon: Gauge },
  { id: 'cholesterol', nom: 'Cholestérol', Icon: Droplets },
  { id: 'tabac', nom: 'Tabac', Icon: Cigarette },
  { id: 'sedentarite', nom: 'Sédentarité', Icon: Armchair },
];

// Ancre + rotation de la plaque image (transparente, ~26 px) posée sur chaque territoire de la
// silhouette (index illustrations-diabete §7 — distinctes des ancres d'organe SILHOUETTE_ANCHORS).
const PLAQUE_OVERLAYS: Record<ZoneM4, { x: number; y: number; rotDeg: number }> = {
  cou: { x: 50, y: 17, rotDeg: 90 },
  coeur: { x: 49, y: 26, rotDeg: 0 },
  jambes: { x: 46, y: 63, rotDeg: 90 },
};

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
// S2-v2 : bordure plus épaisse à mesure que l'état s'aggrave — repère non chromatique
// complémentaire à la couleur (garde-fou accessibilité : jamais la couleur seule).
const FEU_TOKENS: Record<FeuEtat, { fg: string; soft: string; borderWidth: string }> = {
  vert: { fg: 'var(--color-confort-strong)', soft: 'var(--color-confort-soft)', borderWidth: '2px' },
  orange: { fg: 'var(--color-vigilance)', soft: 'var(--color-vigilance-soft)', borderWidth: '3px' },
  rouge: { fg: 'var(--color-toxique)', soft: 'var(--color-toxique-soft)', borderWidth: '4px' },
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

const VUES: { n: Vue; label: string }[] = [
  { n: 1, label: '① Les leviers' },
  { n: 2, label: "② L'artère" },
  { n: 3, label: "③ L'anatomie" },
  { n: 4, label: '④ La fiche' },
];

function nextEtat(etat: FeuEtat): FeuEtat {
  return STATE_ORDER[(STATE_ORDER.indexOf(etat) + 1) % STATE_ORDER.length];
}

function feuTokenStyle(etat: FeuEtat): CSSProperties {
  return {
    '--feu-fg': FEU_TOKENS[etat].fg,
    '--feu-soft': FEU_TOKENS[etat].soft,
    '--feu-border-width': FEU_TOKENS[etat].borderWidth,
  } as CSSProperties;
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

  // S8 (passe « moins de texte ») : messages ramenés à une phrase courte — l'idée
  // « réversible » reste portée, le détail (potentialisation, source Rawshani) est retiré,
  // le soignant le développe à l'oral.
  const arteryMessage =
    score === 0
      ? "Tous les feux au vert : l'artère reste dégagée."
      : rougeCount <= 1
        ? 'Un feu au rouge dépose un peu de plaque — encore réversible.'
        : "Plusieurs feux au rouge : la plaque grossit plus vite — toujours réversible.";
  const arteryMessageFull = arteryMessage;

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
          <p className={styles.vueEyebrow}>Cliquez un feu pour le régler</p>
          <div className={styles.feuxRow}>
            {FEUX.map((f) => {
              const etat = factors[f.id];
              return (
                <div key={f.id} className={styles.feuCard} style={feuTokenStyle(etat)}>
                  {/* S2-v2 : l'icône EST le bouton (couleur = état), plus de bouton texte
                      « Vert/Orange/Rouge » séparé — nom accessible discriminant conservé. */}
                  <button
                    type="button"
                    className={styles.feuIconFrame}
                    onClick={() => cycleFactor(f.id)}
                    onMouseEnter={() => setHoverFeu(f.id)}
                    onMouseLeave={() => setHoverFeu(null)}
                    onFocus={() => setHoverFeu(f.id)}
                    onBlur={() => setHoverFeu(null)}
                    aria-label={`${f.nom} : ${STATE_LABELS[etat]}`}
                    aria-describedby={hoverFeu === f.id ? `feu-seuil-${f.id}` : undefined}
                  >
                    <f.Icon size={38} aria-hidden />
                  </button>
                  <p className={styles.feuNom} aria-hidden="true">
                    {f.nom}
                  </p>
                  {hoverFeu === f.id && (
                    <p id={`feu-seuil-${f.id}`} role="tooltip" className={styles.feuTooltip}>
                      {SEUILS[f.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
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
            <div
              className={styles.artereImgWrap}
              role="img"
              aria-label={`Section d'artère : passage du sang à ${plaquePassagePct(score)} % de la lumière initiale`}
            >
              <img
                src={`${import.meta.env.BASE_URL}illustrations/diabete/artere-saine.png`}
                alt=""
                aria-hidden="true"
                className={styles.artereImg}
              />
              <PlaqueArtere encrassement={score} className={styles.artereOverlay} />
            </div>
            <p className={styles.artereStat} aria-hidden="true">
              Passage du sang : {plaquePassagePct(score)} %
            </p>
          </div>

          <p className={styles.artereMessage}>{arteryMessageFull}</p>
        </div>
      )}

      {vue === 3 && (
        <div className={styles.vueBody}>
          <p className={styles.vueEyebrow}>Cliquez une zone du corps</p>
          <div className={styles.anatomieRow}>
            <div className={styles.silhouetteWrap}>
              <Silhouette zones={zonesForSilhouette} onZoneClick={handleZoneClick}>
                {/* S1-v2 (#3) : la plaque ne se dépose que sur le territoire sélectionné —
                    avant, elle apparaissait sur les 3 territoires dès qu'un feu était rouge. */}
                {rougeCount > 0 &&
                  zoneActive &&
                  (() => {
                    const p = PLAQUE_OVERLAYS[zoneActive];
                    return (
                      <img
                        src={`${import.meta.env.BASE_URL}illustrations/diabete/plaque.png`}
                        alt=""
                        aria-hidden="true"
                        className={styles.plaquePin}
                        style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -50%) rotate(${p.rotDeg}deg)` }}
                      />
                    );
                  })()}
              </Silhouette>
            </div>
            <div className={styles.zonesCol}>
              {/* Sélection directement sur la silhouette (S1) — plus de colonne de boutons
                  redondante, seul le panneau descriptif reste ici. */}
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
          <p className={styles.vueEyebrow}>Les leviers à retenir pour ce patient</p>
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
                  <div className={`${styles.feuIconFrame} ${styles.feuIconFrameSmall}`}>
                    <f.Icon size={26} aria-hidden />
                  </div>
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
