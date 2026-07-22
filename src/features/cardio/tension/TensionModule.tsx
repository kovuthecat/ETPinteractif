import { useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import InfoHover from '../../../components/InfoHover';
import ArtereCoupe from '../components/ArtereCoupe';
import styles from './TensionModule.module.css';

/**
 * Module 4 « La tension » (C10, plans/theme-cardio-2026-07/S7.md). Textes = docs/cardio/CONTENU_cardio.md
 * §M4 (validé G1) : AMT < 135/85 réservée au 2ᵉ niveau (survol, via `InfoHover`) ; message « une seule
 * mesure ne suffit pas » toujours visible ; jamais « < 140/90 » ; aucune cible chiffrée (ni la pression
 * en %, ni un seuil) imposée à l'écran — seulement des paliers qualitatifs (badge, couleur du curseur).
 *
 * Décision clé (proto §MODULE 4 lignes 125-162, logique 748-760, reprise à l'identique) : la pression
 * sur la paroi de l'artère (`ArtereCoupe`) dérive des leviers activés (sel, activité, poids, alcool,
 * antihypertenseur) — chaque levier actif fait baisser la pression de 18 points (plancher 12/100) ;
 * au-delà de 55 la paroi est « fragilisée », au-delà de 66 le curseur passe au palier « haute ».
 */

type LevierId = 'sel' | 'activite' | 'poids' | 'alcool' | 'antihta';

const LEVIER_IDS: LevierId[] = ['sel', 'activite', 'poids', 'alcool', 'antihta'];

const LEVIER_LABELS: Record<LevierId, string> = {
  sel: 'Moins de sel',
  activite: 'Activité',
  poids: 'Poids',
  alcool: "Moins d'alcool",
  antihta: 'Antihypertenseur',
};

/** Trois lignes vierges (relevé d'automesure à remplir à la main) — aucune valeur pré-remplie. */
function MesureBlanks() {
  return (
    <div className={styles.mesureLignes}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={styles.mesureLigne}>
          {n}. <span className={styles.blank} aria-hidden="true" /> /{' '}
          <span className={styles.blank} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export default function TensionModule({ shell, onNavigate }: ModuleProps) {
  const [leviers, setLeviers] = useState<Record<LevierId, boolean>>({
    sel: false,
    activite: false,
    poids: false,
    alcool: false,
    antihta: false,
  });
  const [ficheOuverte, setFicheOuverte] = useState(false);

  if (!shell) return null;

  function toggleLevier(id: LevierId) {
    setLeviers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const actifs = LEVIER_IDS.filter((id) => leviers[id]).length;
  const pression = Math.max(12, 100 - actifs * 18);
  const encrassement = (pression / 100) * 0.7;
  const fragile = pression > 55;
  const pressureClass =
    pression > 66 ? styles.pressureHaute : pression > 40 ? styles.pressureMoyenne : styles.pressureBasse;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.scene}>
        <div className={`card ${styles.artereCard}`}>
          <ArtereCoupe encrassement={encrassement} fragile={fragile} />
          <span className={`${styles.badge} ${fragile ? styles.badgeFragile : styles.badgeApaisee}`}>
            {fragile ? 'Paroi fragilisée' : 'Paroi apaisée'}
          </span>
        </div>
        <div className={styles.leviersCol}>
          <p className={styles.pressureLabel}>Pression sur la paroi</p>
          <div className={styles.pressureTrack}>
            <div
              className={`${styles.pressureFill} ${pressureClass}`}
              style={{ width: `${pression}%` }}
            />
          </div>
          <p className={styles.leviersLabel}>Leviers qui font baisser la pression</p>
          <div className={styles.chips}>
            {LEVIER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`${styles.chip} ${leviers[id] ? styles.chipActive : ''}`}
                aria-pressed={leviers[id]}
                onClick={() => toggleLevier(id)}
              >
                {LEVIER_LABELS[id]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.intro}>
        La tension ne se sent pas — et pourtant elle use les artères. Moins de sel, bouger, poids,
        alcool modéré : la pression baisse.
      </p>

      <div className={`card ${styles.regleCard}`}>
        <p className={styles.regleEyebrow}>La « règle des 3 » — mesurer chez soi</p>
        <p className={styles.regleIntro}>
          La mesurer chez soi, c'est prendre la main.{' '}
          <InfoHover
            label="Pourquoi la règle des 3 ?"
            content={
              <>
                En automesure (AMT), le seuil retenu est <strong>135/85 mmHg</strong>. Une mesure isolée
                varie beaucoup dans la journée — c'est la série de mesures qui donne une valeur fiable.
              </>
            }
          >
            <strong>Une seule mesure ne suffit pas.</strong>
          </InfoHover>
        </p>
        <div className={styles.regleGrid}>
          <div className={styles.regleTuile}>
            <span className={styles.regleBig}>3×</span>
            <span className={styles.regleLabel}>le matin</span>
          </div>
          <div className={styles.regleTuile}>
            <span className={styles.regleBig}>3×</span>
            <span className={styles.regleLabel}>le soir</span>
          </div>
          <div className={styles.regleTuile}>
            <span className={styles.regleBig}>3 j</span>
            <span className={styles.regleLabel}>de suite</span>
          </div>
        </div>
        <button
          type="button"
          className={`btn btn--primary ${styles.regleBtn}`}
          onClick={() => setFicheOuverte(true)}
        >
          Ma fiche « règle des 3 »
        </button>
      </div>

      <div className={styles.renvois}>
        <button type="button" className={styles.renvoi} onClick={() => onNavigate('manger')}>
          → Le sel fait monter la tension
        </button>
        <button type="button" className={styles.renvoi} onClick={() => onNavigate('traitements')}>
          → Baisser la pression protège le cœur, le cerveau et les reins
        </button>
      </div>

      {ficheOuverte && (
        <FicheOverlay
          eyebrow="Outil à emporter"
          titre="Ma règle des 3"
          onClose={() => setFicheOuverte(false)}
          footer={
            <p className={styles.ficheRappel}>
              Une seule mesure ne suffit pas : c'est l'ensemble de la série qui compte.
            </p>
          }
        >
          <p className={styles.ficheIntro}>
            3 mesures le matin, 3 mesures le soir, 3 jours de suite — au calme, assis, avant le
            petit-déjeuner et avant le dîner.
          </p>
          <table className={styles.releveTable}>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Matin (mmHg)</th>
                <th scope="col">Soir (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((jour) => (
                <tr key={jour}>
                  <th scope="row">Jour {jour}</th>
                  <td>
                    <MesureBlanks />
                  </td>
                  <td>
                    <MesureBlanks />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FicheOverlay>
      )}
    </ModuleShell>
  );
}
