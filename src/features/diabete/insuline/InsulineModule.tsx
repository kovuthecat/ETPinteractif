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

      <div className={styles.piedRefrain}>
        <p className="filrouge">Dans le doute, on ne monte pas — on traite l'hypo d'abord.</p>
        <p className={styles.accompagnement}>
          Régler la lente, c'est un travail d'équipe avec votre soignant — pas une décision à
          prendre seul.
        </p>
      </div>
    </div>
    </ModuleShell>
  );
}
