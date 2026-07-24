import { useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import ArtereCoupe from '../components/ArtereCoupe';
import styles from './TabacModule.module.css';

/**
 * MODULE 6 — « Le tabac » : objet démonstratif du **mécanisme CV** (ré-enrichissement S6,
 * plans/refonte-audit-2026-07/S6.md — tâche A8). Remplace l'ancienne bascule 2 états (barre de
 * risque Fumeur/Arrêté), jugée « cliquable mais pas interactive » par l'audit.
 *
 * Objet central : un **curseur Fumeur → Arrêté** qui fait apparaître **successivement** les 5
 * étapes du mécanisme, montrées sur l'**artère héros partagée** (`ArtereCoupe`, réutilisée telle
 * quelle depuis M1/M2 — aucune duplication). Les 4 premières étapes (zone « Fumeur ») font monter
 * l'agression de l'artère ; la 5ᵉ (zone « Arrêté ») porte la réversibilité et le message positif.
 *
 * Textes des 5 étapes = `docs/cardio/CONTENU_cardio.md` §M6 bloc « RÉ-ENRICHISSEMENT — mécanisme
 * CV » **verbatim** (5 formulations validées Thibault 2026-07-24, gate G-A8 levée). Ne pas
 * reformuler : toute formulation vient du doc de contenu (autorité).
 *
 * Invariants du thème respectés : aucun chiffre à l'écran (encrassement/flags en tokens
 * uniquement, jamais un % de sténose affiché — cf. `ArtereCoupe`, qui ne calcule un % que pour son
 * `aria-label`) ; aucune aspirine ; tabac **binaire** (Fumeur / Arrêté — la 5ᵉ étape bascule dans
 * la zone Arrêté, pas de palier chiffré intermédiaire) ; registre non anxiogène ; pont « → Thème
 * Tabac » conservé (informatif, non navigant en v1 — cf. précédent `RisqueModule`).
 *
 * Pas de restauration de la frise de réversibilité retirée le 2026-07-23 : c'est un **nouvel
 * objet mécanisme**, pas un retour en arrière (décision Thibault 2026-07-23).
 */

interface Etape {
  /** Numéro affiché sur le repère du curseur (glyphe, pas un chiffre médical). */
  puce: string;
  /** Libellé court du repère (sous la puce). */
  repere: string;
  /** Zone du curseur : le tabac est binaire — 4 étapes « fumeur », 1 « arrêté ». */
  phase: 'fumeur' | 'arrete';
  /** Encrassement passé à l'artère héros (token/géométrie, jamais affiché en chiffre). */
  encrassement: number;
  caillot?: boolean;
  renforce?: boolean;
  /** Légende = `docs/cardio/CONTENU_cardio.md` §M6 verbatim (validé Thibault 2026-07-24). */
  texte: string;
}

// 5 étapes verbatim CONTENU_cardio.md §M6 (bloc « RÉ-ENRICHISSEMENT — mécanisme CV »). L'artère
// héros escalade visuellement : paroi qui commence à s'abîmer → passage qui se resserre → plaque
// installée → rupture + caillot → paroi stabilisée et plaque qui recule (réversibilité, comme le
// 4ᵉ temps « Espoir » de M1). Les valeurs d'encrassement/flags pilotent la seule géométrie de
// l'illustration ; le sens précis de chaque étape est porté par la légende validée.
const ETAPES: Etape[] = [
  {
    puce: '①',
    repere: 'Paroi agressée',
    phase: 'fumeur',
    encrassement: 0.12,
    texte: "À chaque cigarette, la paroi intérieure de l'artère s'irrite et s'abîme.",
  },
  {
    puce: '②',
    repere: 'Artère qui se serre',
    phase: 'fumeur',
    encrassement: 0.3,
    texte: "L'artère se serre : elle se contracte et laisse moins bien passer le sang.",
  },
  {
    puce: '③',
    repere: 'Plaque accélérée',
    phase: 'fumeur',
    encrassement: 0.5,
    texte: 'Sur cette paroi fragilisée, la plaque se dépose et grossit plus vite.',
  },
  {
    puce: '④',
    repere: 'Risque de caillot',
    phase: 'fumeur',
    encrassement: 0.6,
    caillot: true,
    texte: 'Le sang devient plus épais, plus collant : un caillot peut boucher le passage d’un coup.',
  },
  {
    puce: '⑤',
    repere: "Dès l'arrêt",
    phase: 'arrete',
    encrassement: 0.4,
    renforce: true,
    texte: "Dès l'arrêt, l'artère se détend et le cœur commence à se réparer — le sur-risque reflue vite.",
  },
];

const DERNIER = ETAPES.length - 1;

export default function TabacModule({ shell }: ModuleProps) {
  const [step, setStep] = useState(0);

  if (!shell) return null;

  const etape = ETAPES[step];

  function suivant() {
    // Boucle « Recommencer » après la 5ᵉ étape (même parti pris que M1 — jamais bloqué en fin).
    setStep((s) => (s + 1) % ETAPES.length);
  }

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <p className="eyebrow">Comment le tabac abîme l'artère, étape par étape</p>

        {/* `key={step}` : remonte la carte → rejoue le fondu (neutralisé par
            `prefers-reduced-motion`, cf. `src/styles/global.css`). */}
        <div key={step} className={`${styles.card} card`}>
          <ArtereCoupe
            encrassement={etape.encrassement}
            caillot={etape.caillot}
            renforce={etape.renforce}
            size={340}
          />
          <div className={styles.captionCol} aria-live="polite">
            <p className={styles.caption}>{etape.texte}</p>
          </div>
        </div>

        {/* Objet central : le curseur Fumeur → Arrêté. Les 4 premiers repères = zone « Fumeur »
            (agression qui monte), le 5ᵉ = zone « Arrêté » (réversibilité). Tabac binaire : pas de
            palier chiffré, juste les 2 zones. */}
        <div
          className={styles.curseur}
          role="group"
          aria-label="Curseur du mécanisme, de fumeur vers l'arrêt"
        >
          <div className={styles.zones} aria-hidden="true">
            <span className={`${styles.zone} ${styles.zoneFumeur}`}>Fumeur</span>
            <span className={`${styles.zone} ${styles.zoneArrete}`}>Arrêté</span>
          </div>
          <div className={styles.repereRail}>
            {ETAPES.map((e, i) => (
              <button
                key={e.puce}
                type="button"
                className={
                  `${styles.repereBtn}` +
                  (i === step ? ` ${styles.repereActif}` : '') +
                  (e.phase === 'arrete' ? ` ${styles.repereArrete}` : '')
                }
                aria-current={i === step ? 'step' : undefined}
                aria-label={`Étape ${i + 1} sur ${ETAPES.length} : ${e.repere}`}
                onClick={() => setStep(i)}
              >
                <span className={styles.reperePuce} aria-hidden="true">
                  {e.puce}
                </span>
                <span className={styles.repereLabel}>{e.repere}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className={styles.suivantBtn} onClick={suivant}>
          {step < DERNIER ? 'Suivant →' : 'Recommencer'}
        </button>

        {/* Porte inter-thèmes : repli visuel, navigation réelle hors v1 (cf. `RisqueModule`). */}
        <p className={styles.porteTexte}>
          Pour arrêter, un accompagnement complet existe.
          <br />
          <span className={styles.porteLien}>→ Thème Tabac</span>
        </p>
      </div>
    </ModuleShell>
  );
}
