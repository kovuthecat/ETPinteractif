import { useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import ArtereCoupe from '../components/ArtereCoupe';
import styles from './ArtereModule.module.css';

/**
 * MODULE 1 — « L'artère qui s'encrasse » (fondateur, C7 — plans/theme-cardio-2026-07/S4.md,
 * MOULE de référence pour S5-S14). Séquence linéaire en 4 temps, narrée par le soignant (le
 * patient ne manipule pas) : saine → encrassement (silence) → rupture (accident) → espoir
 * (réversibilité, aussi forte que la menace). 1ᵉʳ usage réel de `ArtereCoupe`/`risqueCardio`
 * (C3/C4, S2) — valide le héros visuel du thème.
 *
 * Textes des 4 temps = `docs/cardio/CONTENU_cardio.md` §M1 « Message(s) à l'écran » **verbatim**
 * (pas ceux du prototype `.dc.html`, qui ont été affinés par le doc de contenu, cf. S4.md
 * « Décision clé »). Valeurs d'encrassement/flags reprises du prototype
 * (`ETP Cardio - Prototype.dc.html` lignes 711-721) : e:0 / e:0.4 / e:0.55+caillot / e:0.45+renforce.
 *
 * Aucun pourcentage de sténose à l'écran (brief §1.2) : `ArtereCoupe` calcule un % de lumière
 * restante, mais seulement pour son `aria-label` (lecture d'écran) — jamais en texte visible ici.
 */

interface Temps {
  label: string;
  encrassement: number;
  caillot?: boolean;
  renforce?: boolean;
  texte: string;
}

// Textes verbatim CONTENU_cardio.md §M1 (4 messages numérotés de la rubrique « Message(s) à
// l'écran »). Ne pas reformuler : en cas de texte manquant, STOP (cf. S4.md « Si bloqué »).
const TEMPS: Temps[] = [
  {
    label: '① Saine',
    encrassement: 0,
    texte: 'Une artère saine : le sang passe librement.',
  },
  {
    label: '② Encrassement',
    encrassement: 0.4,
    texte: "Un dépôt s'installe en silence, sans douleur.",
  },
  {
    label: '③ Rupture',
    encrassement: 0.55,
    caillot: true,
    texte: 'La plaque se fissure : un caillot bouche le passage.',
  },
  {
    label: '④ Espoir',
    encrassement: 0.45,
    renforce: true,
    texte: 'En agissant, la plaque se stabilise — et peut reculer.',
  },
];

const DERNIER = TEMPS.length - 1;

export default function ArtereModule({ shell }: ModuleProps) {
  const [step, setStep] = useState(0);

  if (!shell) return null;

  const temps = TEMPS[step];

  function suivant() {
    // Boucle « Recommencer » au 4ᵉ temps (S4.md — proto : cycle modulo, jamais bloqué en fin
    // de séquence).
    setStep((s) => (s + 1) % TEMPS.length);
  }

  const nav = (
    <div className={styles.tabs} role="group" aria-label="Les 4 temps de l'artère">
      {TEMPS.map((t, i) => (
        <button
          key={t.label}
          type="button"
          className={`${styles.tab}${i === step ? ` ${styles.tabActive}` : ''}`}
          aria-current={i === step ? 'step' : undefined}
          onClick={() => setStep(i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} nav={nav} wide>
      <div className={styles.module}>
        <p className="eyebrow">Séquence narrée par le soignant</p>

        {/* `key={step}` : force le remontage → rejoue le fondu (neutralisé par
            `prefers-reduced-motion`, cf. règle globale `src/styles/global.css`). */}
        <div key={step} className={`${styles.card} card`}>
          <ArtereCoupe
            encrassement={temps.encrassement}
            caillot={temps.caillot}
            renforce={temps.renforce}
            size={340}
          />
          <div className={styles.captionCol} aria-live="polite">
            <p className={styles.caption}>{temps.texte}</p>
            {step === 1 && <Frise />}
          </div>
        </div>

        <button type="button" className={styles.suivantBtn} onClick={suivant}>
          {step < DERNIER ? 'Suivant →' : 'Recommencer'}
        </button>
      </div>
    </ModuleShell>
  );
}

/**
 * Frise du temps — temps ② uniquement (S4.md « Décision clé » / `Module 1 - Artere.dc.html`
 * lignes 97-103) : repères temporels qualitatifs seuls, aucun chiffre médical (0 an → ~15 ans).
 * // à revalider (Thibault) : la borne « ~15 ans » est un choix de design, non chiffré par le
 * rapport (CONTENU_cardio.md §M1 « Calibrage » — vitesse visuelle exacte de l'animation).
 */
function Frise() {
  return (
    <div
      className={styles.frise}
      role="img"
      aria-label="Repère temporel : le dépôt progresse en silence, de 0 an à environ 15 ans"
    >
      <div className={styles.friseLigne} aria-hidden="true" />
      <span className={`${styles.friseRepere} ${styles.friseRepereDebut}`} aria-hidden="true" />
      <span className={`${styles.friseRepere} ${styles.friseRepereMilieu}`} aria-hidden="true" />
      <span className={`${styles.friseRepere} ${styles.friseRepereFin}`} aria-hidden="true" />
      <span className={styles.frisePoint} aria-hidden="true" />
      <span className={`${styles.friseLabel} ${styles.friseLabelDebut}`} aria-hidden="true">
        0 an
      </span>
      <span className={`${styles.friseLabel} ${styles.friseLabelFin}`} aria-hidden="true">
        ~15 ans
      </span>
    </div>
  );
}
