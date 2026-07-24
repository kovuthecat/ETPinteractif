import { useMemo, useState } from 'react';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import CourbeGlycemie from '../components/CourbeGlycemie';
import type { MarqueurDef } from '../components/CourbeGlycemie';
import { BANDE_CIBLE_DEFAUT } from '../lib/glycemieCurve';
import {
  SUB_SITUATIONS,
  BAS,
  SITUATIONS,
  SEGMENTS,
  tracesForScenario,
  buildCourbes,
  bandeToY,
  computeTrendArrow,
  deciderCell,
} from './scenarios';
import type { SituationId, ActionTon, Ajustement } from './scenarios';
import styles from './InsulineModule.module.css';

/**
 * Module 9 — Insuline : lire sa courbe de capteur pour savoir quand ajuster une dose.
 * Écrans/textes/enchaînements = maquette `Module 9 - Insuline.dc.html` (3 temps, cartes
 * profils, chips situations, refrain de sécurité). Traces = lib `glycemieCurve` (S2), rendues
 * par `CourbeGlycemie` (S3) — cf. `plans/theme-diabete/S12.md` « Décision clé ».
 * Aucun nombre à l'écran : le pas d'ajustement est un geste, la cible une bande (SPEC §13.2).
 */

// Écran unique continu (décision Thibault 2026-07-14) : plus d'onglets. Le découpage « Lire la
// courbe » / « Décider » était artificiel — la courbe reste toujours visible et « Décider » ne
// faisait que révéler le bloc situations. Tout est désormais rendu d'un seul tenant : courbe →
// situations (toujours visibles) → refrain. Le sélecteur de profil a été retiré (S3
// revue-chrome-2026-07, C5) : la bande-cible est désormais fixe, harmonisée sur la rapide.

const TON_VAR: Record<ActionTon, string> = {
  vigilance: 'var(--color-vigilance)',
  neutre: 'var(--color-text)',
  toxique: 'var(--color-toxique)',
};

const TREND_LABEL: Record<'↗' | '↘' | '→', string> = {
  '↗': 'à la hausse',
  '↘': 'à la baisse',
  '→': 'stable',
};

// Axe temporel + repères — harmonisation avec la rapide (S3, retrait du profil). La trace
// couvre 24h « coucher → coucher » (`glycemieCurve.ts`, NUIT_MINUTES=480/JOURNEE_MINUTES=1440) ;
// les 5 étiquettes sont réparties à intervalles réguliers sur ce domaine (mécanisme `axeLabels`
// de `CourbeGlycemie`, non calé sur les fractions exactes nuit/jour). // à revalider (Thibault)
const AXE_LABELS = ['Coucher', 'Nuit', 'Réveil', 'Matin', 'Midi']; // à revalider (Thibault)

/** Repères verticaux « Coucher » (t=0) / « Réveil » (fin du segment nuit, cf. `SEGMENTS`) —
 *  même mécanisme que les marqueurs de la rapide (repas/injection). */
const MARQUEURS: MarqueurDef[] = [
  { t: 0, type: 'attente', label: 'Coucher' },
  { t: SEGMENTS[0].t1, type: 'attente', label: 'Réveil' },
];

// --- Ajouts S4 (plan insuline-affinements-2026-07, IA5) : intro rôle (item 3) + régularité/
// horaire (item 1) + phrase-pont vers le module rapide (item 8a). Contenu dérivé du doc
// d'autorité `docs/diabete/09-insuline-basale.md` (validé Thibault, gate G1, 2026-07-21).
// Décision « Si bloqué » (S4.md) : pas de mini-visuel « sans lente, la nuit dérive » — le
// réutiliser via `CourbeGlycemie` imposerait une 2ᵉ courbe quasi pleine taille (`.wrap` du
// composant partagé impose min-width 440px dès 480px de viewport, cf. `CourbeGlycemie.module.css`),
// ce qui alourdit l'écran et repousse la courbe/titration réelle sous la ligne de flottaison —
// contraire à la décision « sobre ». Le texte seul porte l'idée (cf. 2ᵉ phrase ci-dessous).

/** Intro rôle de la lente (item 3, doc §1 pt1/pt2/pt3 + §2 message clé). Combine « frein du
 *  foie » + « sucre de fond ≠ repas » (message clé) et l'idée de dérive nocturne sans lente
 *  (§1 pt3), reliée aux repères Coucher/Réveil déjà affichés sur la courbe (`MARQUEURS`).
 *  // à revalider (Thibault) : libellé exact. */
const INTRO_ROLE_TEXTE =
  "La lente freine la fabrique de sucre du foie : elle tient le sucre de fond, jour et nuit — pas celui des repas, qui est le rôle de la rapide. Sans elle, ou à dose trop faible, le sucre grimpe pendant la nuit, jusqu'au réveil.";

/** Régularité / horaire (item 1, doc §3③) — message générique unique, sans molécule ni
 *  chiffre (gate G2 tranchée). Repris verbatim du doc validé. // à revalider (Thibault). */
const REGULARITE_TEXTE =
  'Fais ton injection à la même heure chaque jour. Selon ton insuline, une certaine souplesse est possible — cale les détails avec ton soignant.';

/** Pont (item 8a) — relie les deux zooms : la basale couvre la journée entière (coucher →
 *  coucher, cf. `MARQUEURS`/`AXE_LABELS`), la rapide zoome sur un repas (module 10). Paire
 *  conceptuelle à recouper avec la phrase-pont symétrique de S5 côté module rapide (item 8b).
 *  // à revalider (Thibault) : libellé exact. */
const PONT_TEXTE =
  'La lente couvre toute la journée, du coucher au coucher ; la rapide zoome sur un seul repas.';

/** Refrain de sécurité titration (constat audit A4, S2 refonte-audit-2026-07) : « la cadence
 *  est le temps fort » (`docs/diabete/BRIEF_DESIGN_diabete.md` L248, `SPEC_outil_ETP_diabete.md`
 *  L584/L686) + prudence déjà existante du module. Reste affiché quel que soit le choix de
 *  décision (chip situation + baisser/laisser/monter) : ce n'est pas une récompense de bonne
 *  réponse, c'est le message porteur (posture ETP non évaluative). // à revalider (Thibault) :
 *  « une chose à la fois » n'est pas repris verbatim d'un doc, cf. cadence/attente ~3 jours.
 */
const REFRAIN_CADENCE_TEXTE =
  "On change une chose à la fois et on attend ~3 jours avant de rejuger. Dans le doute, on ne monte pas — on traite l'hypo d'abord.";

export default function InsulineModule({ onNavigate, shell }: ModuleProps) {
  const [situationId, setSituationId] = useState<SituationId | null>(null);
  const [segmentId, setSegmentId] = useState<'nuit' | 'repas' | null>(null);
  const [ajustement, setAjustement] = useState<Ajustement | null>(null);

  const situation = situationId ? SITUATIONS[situationId] : null;
  const baseScenario = situation ? situation.scenario : 'stable';
  // T8 : courbe ET message viennent du couple (situation, ajustement) via `deciderCell` — chaque
  // case porte son propre sens (audit itération 2, points 1/3/4), là où l'ancien code dérivait le
  // message du seul scénario résultant.
  const cell =
    situationId && situationId !== 'bas' && ajustement
      ? deciderCell(situationId, ajustement)
      : null;
  const scenario = cell ? cell.scenario : baseScenario;
  const outcome = cell ? { texte: cell.texte, ton: cell.ton } : null;

  const traces = useMemo(() => tracesForScenario(scenario), [scenario]);
  const courbes = useMemo(() => buildCourbes(traces), [traces]);
  // Bande fixe (S3, retrait du profil) : harmonisée sur la rapide → bandes 80/70/50 (`BANDE_CIBLE_DEFAUT`
  // = { basse: 25, haute: 60 }), au lieu de la bande dérivée du profil (110/46/44).
  const bandesY = useMemo(() => bandeToY(BANDE_CIBLE_DEFAUT), []);
  const trendArrow = useMemo(() => computeTrendArrow(traces), [traces]);

  function toggleSituation(id: SituationId) {
    setSituationId((prev) => (prev === id ? null : id));
    setAjustement(null);
  }

  function handleSegmentClick(id: string) {
    setSegmentId((prev) => (prev === id ? null : (id as 'nuit' | 'repas')));
  }

  const cardAActive = situationId !== null && situationId !== 'bas';
  const cardBActive = situationId === 'bas';

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
    <div className={styles.module}>
      <p className={styles.introTexte}>{INTRO_ROLE_TEXTE}</p>

      <div className={styles.layout}>
      <div className={styles.graphCol}>
      <div className={`card ${styles.graphCard}`}>
        <div className={styles.graphHeader}>
          <span className={styles.graphLabel}>Courbe du capteur</span>
          <span className={styles.trendArrow} aria-hidden="true">
            {trendArrow}
          </span>
          <span className={styles.srOnly}>Tendance nocturne : {TREND_LABEL[trendArrow]}</span>
        </div>

        <CourbeGlycemie
          courbes={courbes}
          bandes={bandesY}
          segments={SEGMENTS}
          onSegmentClick={handleSegmentClick}
          axeLabels={AXE_LABELS}
          marqueurs={MARQUEURS}
        />

        <div className={styles.legendeRow}>
          <span className={styles.legendePrincipale}>— Glycémie nuit/à jeun (nuit la plus récente)</span>
          <span className={styles.legendeFantome}>- - Nuits précédentes</span>
        </div>

        <div className={styles.axisCaptions}>
          <span className={segmentId === 'nuit' ? styles.axisCaptionActive : undefined}>
            ← nuit / à jeun, loin du repas
          </span>
          <span className={segmentId === 'repas' ? styles.axisCaptionActive : undefined}>
            bosses post-repas →
          </span>
        </div>

        {segmentId && (
          <p className={`chip ${styles.segmentBadge}`} aria-live="polite">
            {segmentId === 'nuit' ? 'Segment nuit / à jeun ↔ la lente' : 'Bosses post-repas ↔ le bolus'}
          </p>
        )}
      </div>
      </div>

      <div className={styles.controlsCol}>
      {/* Bloc décision, toujours visible (plus d'onglet « Décider ») : chips situations +
          réglage de la lente + message, et la carte « La trace plonge dans le bas ». */}
      <div className={styles.situations}>
        <div className={`card ${styles.situationCard}${cardAActive ? ` ${styles.situationCardActive}` : ''}`}>
          <div className={styles.chips}>
            {SUB_SITUATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`${styles.situationChip}${situationId === s.id ? ` ${styles.situationChipActive}` : ''}`}
                aria-pressed={situationId === s.id}
                onClick={() => toggleSituation(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          {cardAActive && situation && (
            <>
              {/* Point 2 (audit itération 2) : plus de phrase narrative qui donne la réponse
                  avant l'interaction — on garde le chip + les 3 boutons + le message de résultat. */}
              <div className={styles.ajustementRow} role="group" aria-label="Réglage de la lente">
                <button
                  type="button"
                  className={`chip ${styles.ajustementBtn}${ajustement === 'baisse' ? ' activeDoubled' : ''}`}
                  aria-pressed={ajustement === 'baisse'}
                  onClick={() => setAjustement('baisse')}
                >
                  <TrendingDown size={18} aria-hidden="true" />
                  Baisser la lente
                </button>
                <button
                  type="button"
                  className={`chip ${styles.ajustementBtn}${ajustement === 'pareil' ? ' activeDoubled' : ''}`}
                  aria-pressed={ajustement === 'pareil'}
                  onClick={() => setAjustement('pareil')}
                >
                  <Minus size={18} aria-hidden="true" />
                  Laisser pareil
                </button>
                <button
                  type="button"
                  className={`chip ${styles.ajustementBtn}${ajustement === 'hausse' ? ' activeDoubled' : ''}`}
                  aria-pressed={ajustement === 'hausse'}
                  onClick={() => setAjustement('hausse')}
                >
                  <TrendingUp size={18} aria-hidden="true" />
                  Monter la lente
                </button>
              </div>
              {outcome && (
                <p className={styles.ajustementMessage} style={{ color: TON_VAR[outcome.ton] }} aria-live="polite">
                  {outcome.texte}
                </p>
              )}
            </>
          )}
        </div>

        <div className={`card ${styles.situationCard}${cardBActive ? ` ${styles.situationCardActive}` : ''}`}>
          <button
            type="button"
            className={styles.situationToggle}
            aria-pressed={cardBActive}
            onClick={() => toggleSituation('bas')}
          >
            <h3 className={styles.situationTitre}>La trace plonge dans le bas</h3>
          </button>
          {cardBActive && (
            <>
              <p className={styles.situationDesc}>{BAS.desc}</p>
              <button
                type="button"
                className={styles.situationActionPorte}
                style={{ color: TON_VAR[BAS.ton] }}
                onClick={() => onNavigate('hypoglycemie')}
              >
                {BAS.action}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`card ${styles.regulariteCard}`}>
        <p className={styles.regulariteTexte}>{REGULARITE_TEXTE}</p>
      </div>

      <div className={styles.piedRefrain}>
        <p className="filrouge">{REFRAIN_CADENCE_TEXTE}</p>
        <p className={styles.accompagnement}>
          Régler la lente, c'est un travail d'équipe avec votre soignant — pas une décision à
          prendre seul.
        </p>
      </div>

      <p className={styles.pontTexte}>{PONT_TEXTE}</p>
      </div>
      </div>
    </div>
    </ModuleShell>
  );
}
