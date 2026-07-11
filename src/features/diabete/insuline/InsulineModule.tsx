import { useMemo, useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import CourbeGlycemie from '../components/CourbeGlycemie';
import { tempsDansCible } from '../lib/glycemieCurve';
import {
  PROFILES,
  SUB_SITUATIONS,
  BAS,
  SITUATIONS,
  SEGMENTS,
  tracesForScenario,
  buildCourbes,
  bandeToY,
  computeTrendArrow,
} from './scenarios';
import type { ProfileId, SituationId, ActionTon } from './scenarios';
import styles from './InsulineModule.module.css';

/**
 * Module 9 — Insuline : lire sa courbe de capteur pour savoir quand ajuster une dose.
 * Écrans/textes/enchaînements = maquette `Module 9 - Insuline.dc.html` (3 temps, cartes
 * profils, chips situations, refrain de sécurité). Traces = lib `glycemieCurve` (S2), rendues
 * par `CourbeGlycemie` (S3) — cf. `plans/theme-diabete/S12.md` « Décision clé ».
 * Aucun nombre à l'écran : le pas d'ajustement est un geste, la cible une bande (SPEC §13.2).
 */

// S4-v2 : l'onglet ① Zone-cible disparaît (ce n'était qu'un choix de profil, pas un contenu
// propre) — le profil devient un toggle d'état près de la courbe, visible sur les 2 onglets
// restants, renumérotés ①/②.
type TempsId = 1 | 2;

const TEMPS_TABS: { id: TempsId; label: string }[] = [
  { id: 1, label: '① Lire la courbe' },
  { id: 2, label: '② Décider' },
];

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

export default function InsulineModule({ onNavigate }: ModuleProps) {
  const [temps, setTemps] = useState<TempsId>(1);
  const [profileId, setProfileId] = useState<ProfileId>('jeune');
  const [situationId, setSituationId] = useState<SituationId | null>(null);
  const [segmentId, setSegmentId] = useState<'nuit' | 'repas' | null>(null);

  const profile = PROFILES[profileId];
  const situation = situationId ? SITUATIONS[situationId] : null;
  const scenario = situation ? situation.scenario : 'stable';

  const traces = useMemo(() => tracesForScenario(scenario), [scenario]);
  const courbes = useMemo(() => buildCourbes(traces), [traces]);
  const bandesY = useMemo(() => bandeToY(profile.bande), [profile]);
  const tir = useMemo(() => tempsDansCible(traces, profile.bande), [traces, profile]);
  const trendArrow = useMemo(() => computeTrendArrow(traces), [traces]);

  function toggleSituation(id: SituationId) {
    setSituationId((prev) => (prev === id ? null : id));
  }

  function handleSegmentClick(id: string) {
    setSegmentId((prev) => (prev === id ? null : (id as 'nuit' | 'repas')));
  }

  const cardAActive = situationId !== null && situationId !== 'bas';
  const cardBActive = situationId === 'bas';

  return (
    <div className={styles.module}>
      <div className={styles.tabs}>
        {TEMPS_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab}${temps === t.id ? ` ${styles.tabActive}` : ''}`}
            aria-pressed={temps === t.id}
            onClick={() => setTemps(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* S4-v2 (T1) : profil = toggle d'état discret près de la courbe, plus un onglet plein
          écran — visible sur les 2 onglets, règle la zone-cible en continu. */}
      <div className={styles.profileToggleRow}>
        <span className={styles.profileToggleLabel}>Profil</span>
        <div className={styles.profileToggle} role="group" aria-label="Profil patient — règle la zone-cible">
          {Object.values(PROFILES).map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.profileToggleBtn}${profileId === p.id ? ` ${styles.profileToggleBtnActive}` : ''}`}
              aria-pressed={profileId === p.id}
              onClick={() => setProfileId(p.id)}
            >
              {p.nom}
            </button>
          ))}
        </div>
      </div>

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
        />

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

      {temps === 2 && (
        <div className={styles.tirRow}>
          <span className={styles.tirLabel}>Temps dans la cible</span>
          <div
            className={styles.tirBar}
            role="img"
            aria-label={`Temps dans la cible : ${Math.round(tir.bas)}% bas, ${Math.round(tir.cible)}% en cible, ${Math.round(tir.haut)}% haut`}
          >
            <span className={styles.tirBas} style={{ width: `${tir.bas}%` }} />
            <span className={styles.tirCible} style={{ width: `${tir.cible}%` }} />
            <span className={styles.tirHaut} style={{ width: `${tir.haut}%` }} />
          </div>
        </div>
      )}

      {temps === 2 && (
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
                <p className={styles.situationDesc}>{situation.desc}</p>
                <p className={styles.situationAction} style={{ color: TON_VAR[situation.ton] }}>
                  {situation.action}
                </p>
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
      )}

      <p className="filrouge">Dans le doute, on ne monte pas — on traite l'hypo d'abord.</p>

      <ModuleFooterNav
        items={[
          { id: 'hypoglycemie', label: 'Revoir la règle des 15 (resucrage)' },
          { id: 'alimentation', label: 'La même courbe, côté assiette' },
        ]}
        onNavigate={onNavigate}
      />
    </div>
  );
}
