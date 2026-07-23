import { useState } from 'react';
import { Wine } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import styles from './LeviersModule.module.css';

/**
 * Module 9 — « Les autres leviers » (alcool · sommeil/apnées · stress), C15,
 * plans/theme-cardio-2026-07/S11.md (moule = S4 `ArtereModule` : onglets pilule dans le slot
 * `nav` du `ModuleShell`). 3 volets ouverts à la carte (choix libre du patient/soignant), sans
 * fiche (non requise par S11).
 *
 * Textes = docs/cardio/CONTENU_cardio.md §M9 (validé G1, 2026-07-22) :
 * - **Alcool** : le repère est repris **verbatim** (« moins de 2 verres/jour, pas tous les
 *   jours, ≤ 10 par semaine ») ; on ne l'affirme JAMAIS plus fort (pas de « non
 *   cardioprotecteur » à l'écran — courbe en J contestée, pas réfutée, Complément J).
 * - **Sommeil** : signes de SAOS → on **oriente vers un dépistage**, on ne diagnostique
 *   jamais à l'écran.
 * - **Stress** : ne jamais culpabiliser — le stress ne se choisit pas.
 *
 * Les chiffres de calibrage (RR, %, Complément J) restent dans CONTENU_cardio.md — jamais à
 * l'écran (rubrique « Calibrage (jamais à l'écran) »).
 *
 * **Corrections Thibault 2026-07-23** :
 * - **Alcool** : le slider nu remplacé par des icônes de verre cliquables (plus simple à régler
 *   qu'un curseur) + un sélecteur de **fréquence** (tous les jours / 5 j·semaine / 2-3 fois·
 *   semaine / occasionnellement) — l'ancien calcul supposait implicitement une consommation
 *   quotidienne ; l'estimation hebdomadaire et le message combinent désormais les deux réglages.
 * - **Stress** : curseur nu + chiffre brut remplacés par une échelle visuelle analogique (dégradé
 *   confort→vigilance→toxique continu, ancres textuelles « Aucun stress »/« Stress extrême »,
 *   jamais de note affichée).
 */

type Volet = 'alcool' | 'sommeil' | 'stress';
type Ton = 'confort' | 'vigilance' | 'toxique';

const VOLETS: { id: Volet; label: string }[] = [
  { id: 'alcool', label: 'Alcool' },
  { id: 'sommeil', label: 'Sommeil' },
  { id: 'stress', label: 'Stress' },
];

export default function LeviersModule({ shell }: ModuleProps) {
  const [volet, setVolet] = useState<Volet>('alcool');

  if (!shell) return null;

  const nav = (
    <div className={styles.tabs} role="tablist" aria-label="Les trois leviers">
      {VOLETS.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={volet === v.id}
          className={`${styles.tab}${volet === v.id ? ` ${styles.tabActive}` : ''}`}
          onClick={() => setVolet(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} nav={nav} wide>
      <div className={styles.module}>
        {volet === 'alcool' && <AlcoolPanel />}
        {volet === 'sommeil' && <SommeilPanel />}
        {volet === 'stress' && <StressPanel />}
      </div>
    </ModuleShell>
  );
}

function tonClass(ton: Ton): string {
  return `${styles.caption} ${styles[`caption--${ton}`]}`;
}

// --- Volet Alcool ---------------------------------------------------------

const ALCOOL_MAX = 6;

type Frequence = 'quotidien' | 'presque-quotidien' | 'hebdomadaire' | 'occasionnel';

/** Jours/semaine représentatifs par fréquence (correction Thibault 2026-07-23 — remplace
 *  l'hypothèse implicite « tous les jours » de l'ancien slider) : sert uniquement à l'estimation
 *  affichée « X verres/semaine », jamais un chiffre de calibrage clinique. */
const FREQUENCES: { id: Frequence; label: string; joursSemaine: number }[] = [
  { id: 'quotidien', label: 'Tous les jours', joursSemaine: 7 },
  { id: 'presque-quotidien', label: '5 jours par semaine', joursSemaine: 5 },
  { id: 'hebdomadaire', label: '2 à 3 fois par semaine', joursSemaine: 2.5 },
  { id: 'occasionnel', label: 'Occasionnellement', joursSemaine: 1 },
];

function alcoolSemaine(verres: number, frequence: Frequence): number {
  return Math.round(verres * FREQUENCES.find((f) => f.id === frequence)!.joursSemaine);
}

function alcoolTon(verres: number, frequence: Frequence): Ton {
  if (verres === 0) return 'confort';
  if (frequence === 'quotidien' && verres >= 2) return 'toxique';
  if (verres >= 3) return 'toxique';
  if (alcoolSemaine(verres, frequence) > 10) return 'toxique';
  if (frequence === 'quotidien' || verres === 2) return 'vigilance';
  return 'confort';
}

/**
 * Le repère SPF a 3 volets indépendants (« moins de 2 verres/jour », « pas tous les jours »,
 * « ≤ 10/semaine ») : correction Thibault 2026-07-23 — l'ancienne version se contentait de
 * multiplier verres×jours et de comparer le total à 10, ce qui traitait la fréquence comme un
 * simple facteur arithmétique. Ici chaque branche nomme explicitement **lequel** des 3 volets
 * est en jeu (dose par prise, jours sans alcool, cumul hebdomadaire) plutôt que de tout ramener
 * à un seul chiffre.
 */
function alcoolCaption(verres: number, frequence: Frequence): string {
  if (verres === 0) return 'Aucun verre — le choix le plus simple pour la tension.';
  const freq = FREQUENCES.find((f) => f.id === frequence)!;
  const semaine = alcoolSemaine(verres, frequence);
  const quotidien = frequence === 'quotidien';

  if (quotidien && verres >= 2) {
    return `${verres} verres tous les jours : la dose dépasse le repère par occasion et il n'y a aucun jour sans alcool — deux repères non tenus en même temps (environ ${semaine} verres/semaine).`;
  }
  if (verres >= 3) {
    return `${verres} verres en une même occasion : au-delà de la dose recommandée, même si ce n'est pas quotidien (${freq.label.toLowerCase()}).`;
  }
  if (quotidien) {
    return `Un verre tous les jours reste une faible dose, mais le repère recommande aussi de garder des jours sans alcool — ce n'est pas le cas ici.`;
  }
  if (semaine > 10) {
    return `${freq.label} : la dose par prise est correcte, mais le cumul sur la semaine (environ ${semaine} verres) dépasse le repère.`;
  }
  if (verres === 2) {
    return `2 verres, ${freq.label.toLowerCase()} : la dose est à la limite haute, mais l'espacement laisse bien des jours sans alcool.`;
  }
  return `${freq.label} : dose, fréquence et cumul hebdomadaire (environ ${semaine} verre${semaine > 1 ? 's' : ''}) sont dans les repères.`;
}

function AlcoolPanel() {
  const [verres, setVerres] = useState(1);
  const [frequence, setFrequence] = useState<Frequence>('quotidien');
  const ton = alcoolTon(verres, frequence);

  // Clic sur un verre déjà au sommet de la sélection = un cran de moins (comme une notation par
  // étoiles) — seul moyen de redescendre à 0, pas de slider à ramener à zéro (correction 2026-07-23).
  function handleGlassClick(i: number) {
    const cible = i + 1;
    setVerres((v) => (v === cible ? i : cible));
  }

  return (
    <div className={`card ${styles.panel}`}>
      <div className={styles.glasses} role="group" aria-label="Nombre de verres par jour — cliquez pour régler">
        {Array.from({ length: ALCOOL_MAX }, (_, i) => {
          const rempli = i < verres;
          return (
            <button
              key={i}
              type="button"
              className={`${styles.glassBtn}${rempli ? ` ${styles.glassBtnFilled} ${styles[`glassBtnFilled--${ton}`]}` : ''}`}
              onClick={() => handleGlassClick(i)}
              aria-pressed={rempli}
              aria-label={`${i + 1} verre${i > 0 ? 's' : ''} par jour`}
            >
              <Wine size={22} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <p className={styles.valeur}>
        {verres} verre{verres > 1 ? 's' : ''}/jour
      </p>

      <p className={styles.freqLabel}>À quelle fréquence ?</p>
      <div className={styles.freqList} role="radiogroup" aria-label="Fréquence de consommation">
        {FREQUENCES.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={frequence === f.id}
            className={`${styles.freqChip}${frequence === f.id ? ` ${styles.freqChipOn}` : ''}`}
            onClick={() => setFrequence(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className={tonClass(ton)} aria-live="polite">
        {alcoolCaption(verres, frequence)}
      </p>
      <p className={styles.repere}>
        Repère (Santé Publique France) : moins de 2 verres/jour, pas tous les jours, ≤ 10 par
        semaine.
      </p>
    </div>
  );
}

// --- Volet Sommeil ----------------------------------------------------------

const SOMMEIL_HEURES = Array.from({ length: 8 }, (_, i) => 4 + i); // 4h..11h

const SAOS_SIGNES: { id: string; label: string }[] = [
  { id: 'ronfle', label: 'Ronflements forts' },
  { id: 'pauses', label: 'Pauses respiratoires observées' },
  { id: 'somnolence', label: 'Somnolence dans la journée' },
];

function sommeilCaption(h: number): { texte: string; ton: Ton } {
  if (h >= 7 && h <= 9) return { texte: 'Bonne fenêtre — le sommeil répare le cœur.', ton: 'confort' };
  if (h < 7) return { texte: 'Trop court : associé à un risque cardiovasculaire plus élevé.', ton: 'vigilance' };
  return { texte: 'Trop long : associé lui aussi à un risque plus élevé.', ton: 'vigilance' };
}

function SommeilPanel() {
  const [heures, setHeures] = useState(7);
  const [saos, setSaos] = useState<Record<string, boolean>>({});

  function toggleSaos(id: string) {
    setSaos((s) => ({ ...s, [id]: !s[id] }));
  }

  const caption = sommeilCaption(heures);
  const saosCount = Object.values(saos).filter(Boolean).length;

  return (
    <div className={`card ${styles.panel}`}>
      <p className={styles.panelIntro}>Le sommeil répare le cœur.</p>

      <div className={styles.bars} role="group" aria-label="Choisir le nombre d'heures de sommeil">
        {SOMMEIL_HEURES.map((h) => {
          const dist = Math.abs(h - 8);
          const pct = Math.max(30, 100 - dist * 22);
          const selected = h === heures;
          const risky = h < 6 || h > 9;
          return (
            <button
              key={h}
              type="button"
              className={styles.barBtn}
              aria-pressed={selected}
              aria-label={`${h} heures de sommeil`}
              onClick={() => setHeures(h)}
            >
              <span
                className={`${styles.bar}${selected ? ` ${styles.barSelected}` : risky ? ` ${styles.barRisky}` : ''}`}
                style={{ height: `${pct}%` }}
              />
            </button>
          );
        })}
      </div>
      <div className={styles.barsScale}>
        <span>4 h</span>
        <span>11 h</span>
      </div>

      <p className={styles.valeur}>{heures} h par nuit</p>
      <p className={tonClass(caption.ton)} aria-live="polite">
        {caption.texte}
      </p>

      <p className={styles.saosHeading}>
        Ronflements, pauses respiratoires la nuit ? À signaler (dépistage possible).
      </p>
      <p className={styles.saosInstruction}>Signes de SAOS — cochez ce qui s'applique</p>
      <div className={styles.saosList}>
        {SAOS_SIGNES.map((s) => {
          const checked = !!saos[s.id];
          return (
            <button
              key={s.id}
              type="button"
              role="checkbox"
              aria-checked={checked}
              className={`${styles.saosChip}${checked ? ` ${styles.saosChipOn}` : ''}`}
              onClick={() => toggleSaos(s.id)}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {saosCount >= 2 && (
        <p className={tonClass('vigilance')} aria-live="polite">
          Plusieurs signes présents : parlez-en, un dépistage du SAOS peut être utile.
        </p>
      )}
    </div>
  );
}

// --- Volet Stress -----------------------------------------------------------

const STRESS_LEVIERS: { id: string; label: string }[] = [
  { id: 'activite', label: 'Activité' },
  { id: 'relaxation', label: 'Relaxation' },
  { id: 'lien', label: 'Lien social' },
];

function stressCaption(n: number): { texte: string; ton: Ton } {
  if (n <= 3) return { texte: 'Niveau bas — plutôt favorable.', ton: 'confort' };
  if (n <= 6) return { texte: 'Niveau modéré — la récupération (sommeil, pauses) compte.', ton: 'vigilance' };
  return { texte: 'Niveau élevé et durable : un effet mesurable sur le corps, pas seulement sur le moral.', ton: 'toxique' };
}

function StressPanel() {
  const [niveau, setNiveau] = useState(3);
  const [leviers, setLeviers] = useState<Record<string, boolean>>({});

  function toggleLevier(id: string) {
    setLeviers((l) => ({ ...l, [id]: !l[id] }));
  }

  const caption = stressCaption(niveau);

  return (
    <div className={`card ${styles.panel}`}>
      <p className={styles.panelIntro}>Le stress chronique n'est pas que dans la tête.</p>

      {/* Message fixe (indépendant du niveau réglé) sur l'impact cardiovasculaire du stress
          chronique (correction Thibault 2026-07-23 — jusqu'ici seul le palier « élevé » de la
          légende en disait un mot). Nomme les 3 formes reconnues (CONTENU_cardio.md §M9
          Calibrage : stress pro, stress perçu, isolement social) sans jamais afficher leurs RR
          (G1, « jamais à l'écran »). */}
      <p className={styles.stressImpact}>
        Stress professionnel, stress ressenti au quotidien, isolement social : ce sont des
        facteurs de risque cardiovasculaire reconnus, au même titre que la tension ou le
        cholestérol — ils élèvent tension et rythme cardiaque de façon répétée, ce qui use les
        artères avec le temps.
      </p>

      {/* Échelle visuelle analogique (correction Thibault 2026-07-23) : remplace le curseur nu +
          chiffre brut par un dégradé continu confort→vigilance→toxique, ancré par 2 mots seulement
          (jamais de note affichée). */}
      <div className={styles.evaWrap}>
        <div className={styles.evaLabels} aria-hidden="true">
          <span>Aucun stress</span>
          <span>Stress extrême</span>
        </div>
        <div className={styles.evaTrack}>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={niveau}
            onChange={(e) => setNiveau(Number(e.target.value))}
            className={styles.evaInput}
            aria-label="Niveau de stress perçu, de aucun à extrême"
          />
        </div>
      </div>
      <p className={tonClass(caption.ton)} aria-live="polite">
        {caption.texte}
      </p>

      <p className={styles.deculpabilisation}>
        Le stress ne se choisit pas — mais on peut agir sur ce qui l'atténue.
      </p>

      <p className={styles.saosInstruction}>
        Le gérer — activité, relaxation, lien social — protège aussi le cœur.
      </p>
      <div className={styles.leviersList}>
        {STRESS_LEVIERS.map((l) => {
          const checked = !!leviers[l.id];
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={checked}
              className={`${styles.leverChip}${checked ? ` ${styles.leverChipOn}` : ''}`}
              onClick={() => toggleLevier(l.id)}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
