import { useState } from 'react';
import { Gauge, Droplets, Candy, CalendarClock, Filter, Check, Clock, Refrigerator } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import InfoHover from '../../../components/InfoHover';
import styles from './SuiviModule.module.css';

/**
 * Module 12 — Mon suivi (C18, plans/theme-cardio-2026-07/S14.md ; moule = S4/S5, socle
 * `ModuleShell`/`FicheOverlay`). **G-M12 tranché (2026-07-22, CONTENU_cardio.md §M12)** :
 * « mes 3 chiffres » (grille légère), **pas** le cadran annuel du thème diabète
 * (`diabete/suivi/SuiviModule.tsx`) — décision de conception close, à ne pas rouvrir ici.
 *
 * Grille de voyants cyclables (proto `ETP Cardio - Prototype.dc.html` §MODULE 12 lignes 544-558,
 * logique `cycleSuivi`/`SUIVI`/`SST` lignes 961-975) : 5 stations, 3 états `attente → fait →
 * espace → attente`. **Jamais de rouge** ici (CONTENU_cardio.md §0.2 grammaire des couleurs :
 * le rouge reste réservé à l'état de santé des modules 2/4/5) — seuls `--color-confort` (vert,
 * fait), `--color-vigilance` (ambre, à programmer) et `--color-line`/`--color-text-faint` (gris,
 * espacé) sont utilisés.
 *
 * Invariant contenu (CONTENU_cardio.md, préambule) : « aucune valeur chiffrée à l'écran » — les
 * cadences toujours visibles sur les cartes sont qualitatives ; les fréquences sourcées (chiffrées)
 * ne vivent que dans le 2ᵉ niveau (survol, `InfoHover`), et restent **à revalider par Thibault
 * auprès de l'HAS** (réserve G1 non bloquante, §M12/§13 du doc).
 *
 * **Cohérence bandeau ↔ grille (correction Thibault 2026-07-23)** — le bandeau « Mes 3 chiffres »
 * listait tension/LDL/**tour de taille** (CONTENU_cardio.md §M12, verbatim d'origine), un chiffre
 * devenu orphelin : le facteur M2 « poids/tour de taille » a été remplacé par « sédentarité »
 * plus tôt le même jour (RisqueModule, correction 2026-07-23), et rien d'autre dans le thème ne
 * mesure plus le tour de taille. Remplacé par **glycémie**, qui correspond exactement à l'une des
 * 5 stations de la grille ci-dessous (au lieu d'un 3ᵉ chiffre sans station associée) — les icônes
 * des 3 chiffres sont désormais dérivées directement des stations (`CHIFFRES`, source unique),
 * jamais choisies en double, pour que le lien bandeau→grille soit immédiat.
 */

// Fil rouge du thème (docs/cardio/CONTENU_cardio.md §0.1, verbatim) — refrain partagé M1/M2/M3/M12.
const FIL_ROUGE =
  "L'athérosclérose avance en silence — mais elle est réversible. Agir sur plusieurs leviers à la fois protège le cœur, le cerveau, les jambes et les reins.";

type EtatSuivi = 'attente' | 'fait' | 'espace';

// Ordre de cyclage au clic (proto `cycleSuivi`, ligne 698) : attente → fait → espace → attente.
const ETAT_CYCLE: EtatSuivi[] = ['attente', 'fait', 'espace'];

function cyclerEtat(etat: EtatSuivi): EtatSuivi {
  return ETAT_CYCLE[(ETAT_CYCLE.indexOf(etat) + 1) % ETAT_CYCLE.length];
}

const ETAT_LABEL: Record<EtatSuivi, string> = {
  attente: 'À programmer',
  fait: 'Fait',
  espace: 'Espacé',
};

type StationId = 'tension' | 'lipidique' | 'risque' | 'glycemie' | 'renale';

interface StationDef {
  id: StationId;
  label: string;
  /** Décoratif + repère visuel partagé avec le bandeau « Mes 3 chiffres » (correction 2026-07-23) :
   *  les 3 stations mesurables (tension/lipidique/glycémie) reprennent la même icône que leur
   *  facteur correspondant ailleurs dans le thème (ex. `Candy` = « Sucre » du cockpit M2). */
  Icon: LucideIcon;
  /** Cadence qualitative toujours visible (jamais de chiffre à l'écran). */
  cadence: string;
  /** 2ᵉ niveau (survol, `InfoHover`) — fréquence sourcée, CONTENU_cardio.md §M12. */
  detail: string;
}

// Stations = CONTENU_cardio.md §M12 (« automesure tension · bilan lipidique · réévaluation du
// risque · glycémie · fonction rénale »), S14 §Décision clé — pas de station SAOS (absente de
// la liste validée G1, à la différence du prototype qui en avait une 6ᵉ).
// à revalider (Thibault — HAS) : les fréquences `detail` ci-dessous ne sont pas encore confirmées
// côté HAS (réserve G1 non bloquante, CONTENU_cardio.md §M12/§13).
const STATIONS: StationDef[] = [
  {
    id: 'tension',
    label: 'Automesure tension',
    Icon: Gauge,
    cadence: 'Automesure régulière',
    detail: 'À chaque consultation ; automesure (AMT, « règle des 3 ») au long cours.',
  },
  {
    id: 'lipidique',
    label: 'Bilan lipidique',
    Icon: Droplets,
    cadence: 'Selon le traitement',
    detail:
      'Contrôle 4 à 12 semaines après une initiation ou une modification, puis tous les 3 à 12 mois ; stable à la cible → une fois par an.',
  },
  {
    id: 'risque',
    label: 'Réévaluation du risque',
    Icon: CalendarClock,
    cadence: 'Réévaluation périodique',
    detail: 'Tous les 3 à 5 ans ; plus souvent si le risque est modéré à élevé.',
  },
  {
    id: 'glycemie',
    label: 'Glycémie',
    Icon: Candy,
    cadence: 'Selon le risque',
    detail: 'Tous les 1 à 3 ans, selon le niveau de risque.',
  },
  {
    id: 'renale',
    label: 'Fonction rénale',
    Icon: Filter,
    cadence: 'Si à risque',
    detail: 'Une fois par an en cas de haut risque, de traitement IEC/ARA2, ou de diabète associé.',
  },
];

const INITIAL_SUIVI: Record<StationId, EtatSuivi> = {
  tension: 'attente',
  lipidique: 'attente',
  risque: 'attente',
  glycemie: 'attente',
  renale: 'attente',
};

// « Mes 3 chiffres à suivre » (CONTENU_cardio.md §M12, message d'ouverture, G-M12) : bandeau
// statique, non cyclable — mais désormais un sous-ensemble explicite des 5 stations de la grille
// (tension/lipidique/glycémie), pas une 2ᵉ liste inventée à côté (correction 2026-07-23). Le
// libellé court reste bandeau-only (« LDL » vs « Bilan lipidique »), l'icône vient de la station.
const CHIFFRES_IDS = ['tension', 'lipidique', 'glycemie'] as const satisfies readonly StationId[];
const CHIFFRES_LABELS: Record<(typeof CHIFFRES_IDS)[number], string> = {
  tension: 'Tension',
  lipidique: 'LDL',
  glycemie: 'Glycémie',
};

export default function SuiviModule({ shell }: ModuleProps) {
  const [suivi, setSuivi] = useState<Record<StationId, EtatSuivi>>(INITIAL_SUIVI);
  const [ficheOpen, setFicheOpen] = useState(false);

  function cycle(id: StationId) {
    setSuivi((s) => ({ ...s, [id]: cyclerEtat(s[id]) }));
  }

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <p className={styles.headline}>Le suivi, comme un tableau de bord : vous restez aux commandes.</p>

        <div className={`card ${styles.chiffresBandeau}`}>
          <span className="eyebrow">Mes 3 chiffres à suivre</span>
          <div className={styles.chiffresRow}>
            {CHIFFRES_IDS.map((id) => {
              const station = STATIONS.find((s) => s.id === id)!;
              const Icon = station.Icon;
              return (
                <div key={id} className={styles.chiffreItem}>
                  <Icon size={22} aria-hidden="true" />
                  <span>{CHIFFRES_LABELS[id]}</span>
                </div>
              );
            })}
          </div>
          <p className={styles.chiffresLien}>Ces 3 chiffres se mesurent lors des examens ci-dessous.</p>
        </div>

        <p className={styles.instruction}>Cliquez une station pour changer son état</p>

        <div className={styles.grille}>
          {STATIONS.map((station) => {
            const etat = suivi[station.id];
            return (
              <div key={station.id} className={styles.station} data-etat={etat}>
                <div className={styles.stationHead}>
                  <span className={styles.stationLabelRow}>
                    <station.Icon size={18} aria-hidden="true" className={styles.stationIcon} />
                    <span className={styles.stationLabel}>{station.label}</span>
                  </span>
                  <InfoHover
                    label={`Fréquence usuelle — ${station.label}, à revalider`}
                    content={
                      <>
                        {station.detail} <strong>À revalider (Thibault — HAS).</strong>
                      </>
                    }
                  >
                    <span className={styles.infoGlyph} aria-hidden="true">
                      i
                    </span>
                  </InfoHover>
                </div>
                <span className={styles.stationCadence}>{station.cadence}</span>
                <button
                  type="button"
                  className={styles.statusBtn}
                  onClick={() => cycle(station.id)}
                  aria-pressed={etat !== 'attente'}
                  aria-label={`${station.label} — ${ETAT_LABEL[etat]} — cliquer pour changer l'état`}
                >
                  {etat === 'fait' && (
                    <>
                      <Check size={16} aria-hidden="true" /> Fait
                    </>
                  )}
                  {etat === 'attente' && (
                    <>
                      <Clock size={16} aria-hidden="true" /> À programmer
                    </>
                  )}
                  {etat === 'espace' && 'Espacé — prochain prévu'}
                </button>
              </div>
            );
          })}
        </div>

        <p className={styles.couverture}>Pas un bilan accablant : une couverture.</p>

        <div className={styles.ficheButtonRow}>
          <button type="button" className="btn btn--primary" onClick={() => setFicheOpen(true)}>
            <Refrigerator size={18} aria-hidden="true" />
            Ma check-list frigo
          </button>
        </div>

        <p className="filrouge">{FIL_ROUGE}</p>

        {ficheOpen && (
          <FicheOverlay
            eyebrow="PROGRAMME ETP · CARDIO"
            titre="Ma check-list frigo — mon suivi"
            footer={<p className="fiche-filrouge">{FIL_ROUGE}</p>}
            onClose={() => setFicheOpen(false)}
          >
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Mes examens de suivi — une case, une vraie date</span>
              <div className={styles.ficheList}>
                {STATIONS.map((station) => (
                  <label key={station.id} className={styles.ficheItem}>
                    <input type="checkbox" />
                    <span className={styles.ficheItemLabel}>{station.label}</span>
                    <span className={styles.ficheItemDate}>Date : ____ /____ /______</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="fiche-bloc">
              <p className={styles.ficheMention}>Pas un bilan accablant : une couverture, à votre rythme.</p>
            </div>
          </FicheOverlay>
        )}
      </div>
    </ModuleShell>
  );
}
