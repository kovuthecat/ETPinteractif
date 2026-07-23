import { useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import styles from './TabacModule.module.css';

/**
 * Module 6 — Le tabac (C12, plans/theme-cardio-2026-07/S8.md ; moule = S4/ArtereModule : toggle
 * rendu dans le slot `nav` du ModuleShell, comme les onglets « temps » de M1).
 *
 * Module **léger** (hors périmètre S8.md : « rester court », le « comment arrêter » vit dans le
 * thème Tabac) : bascule Fumeur/A arrêté → barre de risque CV qui redescend. Textes =
 * `docs/cardio/CONTENU_cardio.md` §M6 « Message(s) à l'écran », verbatim. Aucune fiche
 * (décision clé C12).
 *
 * ⚠️ **Repli porte tabac (G-porte)** : le renvoi vers le thème Tabac est **informatif, non
 * navigant en v1** (aucune vraie porte inter-thèmes hors v1, cf. S8.md « Hors périmètre » et le
 * précédent identique `RisqueModule` pour le robinet sucre → thème Diabète).
 *
 * Pas de frise de réversibilité (retirée, correction Thibault 2026-07-23) : elle ne faisait que
 * dupliquer la barre de risque (mêmes deux états Fumeur/Arrêté, aucun jalon temporel réel affiché
 * — le fait clinique intéressant, la vitesse de récupération les premières années, n'était de
 * toute façon jamais montré).
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
