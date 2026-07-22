import { useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import styles from './TabacModule.module.css';

/**
 * Module 6 — Le tabac (C12, plans/theme-cardio-2026-07/S8.md ; moule = S4/ArtereModule : toggle
 * rendu dans le slot `nav` du ModuleShell, comme les onglets « temps » de M1).
 *
 * Module **léger** (hors périmètre S8.md : « rester court », le « comment arrêter » vit dans le
 * thème Tabac) : bascule Fumeur/A arrêté → barre de risque CV qui redescend + frise de
 * réversibilité qualitative. Textes = `docs/cardio/CONTENU_cardio.md` §M6 « Message(s) à
 * l'écran », verbatim. Aucune fiche (décision clé C12).
 *
 * ⚠️ **Repli porte tabac (G-porte)** : le renvoi vers le thème Tabac est **informatif, non
 * navigant en v1** (aucune vraie porte inter-thèmes hors v1, cf. S8.md « Hors périmètre » et le
 * précédent identique `RisqueModule` pour le robinet sucre → thème Diabète).
 */
export default function TabacModule({ shell }: ModuleProps) {
  const [arrete, setArrete] = useState(false);

  if (!shell) return null;

  const nav = (
    <div className={styles.toggle} role="group" aria-label="Fumeur ou a arrêté">
      <button
        type="button"
        className={`${styles.toggleBtn}${!arrete ? ` ${styles.toggleActive}` : ''}`}
        aria-pressed={!arrete}
        onClick={() => setArrete(false)}
      >
        Fumeur
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn}${arrete ? ` ${styles.toggleActive}` : ''}`}
        aria-pressed={arrete}
        onClick={() => setArrete(true)}
      >
        A arrêté
      </button>
    </div>
  );

  // Largeur/couleur en tokens seulement (proto ligne 766) — jamais un chiffre affiché à l'écran.
  const riskWidth = arrete ? 30 : 90;
  const riskColor = arrete ? 'var(--color-confort)' : 'var(--color-toxique)';
  const caption = arrete
    ? "Dès l'arrêt, le cœur commence à se réparer."
    : 'Le tabac accélère le bouchage et favorise le caillot.';

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} nav={nav} wide>
      <div className={styles.module}>
        <div className={`card ${styles.carte}`}>
          <div
            className={styles.barreWrap}
            role="img"
            aria-label={
              arrete
                ? "Risque cardiovasculaire redescendu depuis l'arrêt du tabac"
                : 'Risque cardiovasculaire élevé chez le fumeur'
            }
          >
            <div className={styles.barreLabels}>
              <span>Risque faible</span>
              <span>Risque élevé</span>
            </div>
            <div className={styles.barre}>
              <div
                className={styles.barreRemplissage}
                style={{ width: `${riskWidth}%`, background: riskColor }}
              />
            </div>
          </div>

          <p className={styles.caption}>{caption}</p>

          <Frise arrete={arrete} />
        </div>

        {/* porte inter-thèmes : repli visuel, nav réelle hors v1 */}
        <p className={styles.porteTexte}>
          Pour arrêter, un accompagnement complet existe.
          <br />
          <span className={styles.porteLien}>→ Thème Tabac</span>
        </p>
      </div>
    </ModuleShell>
  );
}

/**
 * Frise de réversibilité (C12, décision clé) — pente qui redescend, strictement qualitative :
 * aucun pourcentage, aucune durée à l'écran. Le point se déplace le long de la pente selon la
 * bascule (haut/fumeur → bas/arrêté).
 * // à revalider (Thibault) : la forme de la pente (jalons intermédiaires) est un choix de design
 * — CONTENU_cardio.md §M6 Calibrage ne fournit que les extrémités sourcées (−½ dès la 1ʳᵉ année,
 * ~15 ans), jamais affichées ici (point déjà signalé par S1.md « M6 cinétique »).
 */
function Frise({ arrete }: { arrete: boolean }) {
  return (
    <div
      className={styles.frise}
      role="img"
      aria-label={
        arrete
          ? "Frise de réversibilité : le risque redescend avec le temps depuis l'arrêt du tabac"
          : "Frise de réversibilité : dès l'arrêt, le risque commence à redescendre avec le temps"
      }
    >
      <svg viewBox="0 0 100 36" aria-hidden="true" className={styles.friseSvg}>
        <path d="M4,6 L96,30" className={styles.friseLigne} />
        <circle
          className={styles.frisePoint}
          cx={arrete ? 92 : 8}
          cy={arrete ? 29 : 7}
          r="5"
          style={{ fill: arrete ? 'var(--color-confort-strong)' : 'var(--color-toxique)' }}
        />
      </svg>
      <div className={styles.friseLabels} aria-hidden="true">
        <span>Aujourd&apos;hui</span>
        <span>Avec le temps</span>
      </div>
    </div>
  );
}
