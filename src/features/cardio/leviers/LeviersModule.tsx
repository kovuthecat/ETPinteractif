import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
 */

type Volet = 'alcool' | 'sommeil' | 'stress';
type Ton = 'confort' | 'vigilance' | 'toxique';

const VOLETS: { id: Volet; label: string }[] = [
  { id: 'alcool', label: 'Alcool' },
  { id: 'sommeil', label: 'Sommeil' },
  { id: 'stress', label: 'Stress' },
];

export default function LeviersModule({ shell, onNavigate }: ModuleProps) {
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
        {volet === 'alcool' && <AlcoolPanel onNavigate={onNavigate} />}
        {volet === 'sommeil' && <SommeilPanel />}
        {volet === 'stress' && <StressPanel onNavigate={onNavigate} />}
      </div>
    </ModuleShell>
  );
}

function tonClass(ton: Ton): string {
  return `${styles.caption} ${styles[`caption--${ton}`]}`;
}

// --- Volet Alcool ---------------------------------------------------------

const ALCOOL_MAX = 6;

function alcoolTon(verres: number): Ton {
  if (verres <= 1) return 'confort';
  if (verres === 2) return 'vigilance';
  return 'toxique';
}

function alcoolCaption(verres: number): string {
  const semaine = verres * 7;
  if (verres === 0) return 'Aucun verre aujourd’hui — le choix le plus simple pour la tension.';
  if (verres === 1) return 'Occasionnel : dans les repères.';
  if (verres === 2) {
    return `2 verres chaque jour représenteraient ${semaine} par semaine — pensez à garder des jours sans alcool.`;
  }
  return `Au-delà de 2 à 3 verres par jour, la tension a tendance à augmenter — et ${semaine} verres par semaine dépasse largement le repère.`;
}

function AlcoolPanel({ onNavigate }: Pick<ModuleProps, 'onNavigate'>) {
  const [verres, setVerres] = useState(1);
  const ton = alcoolTon(verres);
  const semaine = verres * 7;

  return (
    <div className={`card ${styles.panel}`}>
      <input
        type="range"
        min={0}
        max={ALCOOL_MAX}
        step={1}
        value={verres}
        onChange={(e) => setVerres(Number(e.target.value))}
        className={styles.slider}
        aria-label="Nombre de verres d'alcool par jour"
      />
      <div className={styles.glasses} aria-hidden="true">
        {Array.from({ length: ALCOOL_MAX }, (_, i) => (
          <span
            key={i}
            className={`${styles.glass}${i < verres ? ` ${styles.glassFilled} ${styles[`glassFilled--${ton}`]}` : ''}`}
          />
        ))}
      </div>
      <p className={styles.valeur}>
        {verres} verre{verres > 1 ? 's' : ''}/jour · {semaine} verres/semaine (estimation)
      </p>
      <p className={tonClass(ton)} aria-live="polite">
        {alcoolCaption(verres)}
      </p>
      <p className={styles.repere}>
        Repère (Santé Publique France) : moins de 2 verres/jour, pas tous les jours, ≤ 10 par
        semaine.
      </p>
      <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('tension')}>
        Et la tension, comment ça se joue ? <ArrowRight size={16} aria-hidden="true" />
      </button>
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

function StressPanel({ onNavigate }: Pick<ModuleProps, 'onNavigate'>) {
  const [niveau, setNiveau] = useState(3);
  const [leviers, setLeviers] = useState<Record<string, boolean>>({});

  function toggleLevier(id: string) {
    setLeviers((l) => ({ ...l, [id]: !l[id] }));
  }

  const caption = stressCaption(niveau);

  return (
    <div className={`card ${styles.panel}`}>
      <p className={styles.panelIntro}>Le stress chronique n'est pas que dans la tête.</p>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={niveau}
        onChange={(e) => setNiveau(Number(e.target.value))}
        className={styles.slider}
        aria-label="Niveau de stress perçu, de 0 à 10"
      />
      <p className={styles.valeur}>Niveau perçu : {niveau}/10</p>
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

      <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('bouger')}>
        Voir comment l'activité physique protège aussi <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
