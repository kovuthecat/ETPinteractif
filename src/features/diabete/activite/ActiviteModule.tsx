import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import InfoHover from '../../../components/InfoHover';
import IllustrationSlot from '../components/IllustrationSlot';
import CourbeGlycemie, {
  COURBE_GRAPH_WIDTH,
  COURBE_GRAPH_HEIGHT,
  type MarqueurDef,
} from '../components/CourbeGlycemie';
import {
  sampleRepas,
  sampleActivite,
  toSvgPath,
  mgFromLevel,
  LEVEL_MAX,
  type Point,
  type RepasParams,
} from '../lib/glycemieCurve';
import { ACTIVITIES, RAYONS, ACT_MIN_STEP, ACT_MIN_FLOOR, ACT_MIN_CEIL, type RayonId } from './data';
import styles from './ActiviteModule.module.css';

/**
 * Module 3 — Activité physique (plan `theme-diabete/S6.md`, D6). Trois temps, portage
 * fidèle de la maquette pour ① et ② ; le temps ③ remplace le score abstrait de la
 * maquette par la lib partagée `glycemieCurve` (S2) : le moment du mouvement change
 * réellement la forme de la courbe, au lieu d'un chiffre qui gonfle une bosse.
 */

type Temps = 1 | 2 | 3;

const TEMPS_TABS: { n: Temps; label: string }[] = [
  { n: 1, label: '① Le rayonnement' },
  { n: 2, label: '② Le volume' },
  { n: 3, label: '③ Le timing' },
];

// --- Géométrie du rayonnement (repère abstrait 0–100, carré — cf. en-tête ci-dessus :
// la maquette utilise un canvas 800×600 non carré, adapté ici en carré responsive ;
// structure et interactions identiques, pas le pixel). ---
const CENTER_PCT = { x: 50, y: 50 };
const CENTER_R_PCT = 13;
const NODE_R_PCT = 10.5;
const NODE_OFFSET_PCT = 34;

const NODE_POS: Record<RayonId, { x: number; y: number }> = {
  sucre: { x: 50, y: 50 - NODE_OFFSET_PCT },
  coeur: { x: 50 + NODE_OFFSET_PCT, y: 50 },
  tete: { x: 50, y: 50 + NODE_OFFSET_PCT },
  autonomie: { x: 50 - NODE_OFFSET_PCT, y: 50 },
};

function rayLine(node: { x: number; y: number }) {
  const dx = node.x - CENTER_PCT.x;
  const dy = node.y - CENTER_PCT.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: CENTER_PCT.x + ux * CENTER_R_PCT,
    y1: CENTER_PCT.y + uy * CENTER_R_PCT,
    x2: node.x - ux * NODE_R_PCT,
    y2: node.y - uy * NODE_R_PCT,
  };
}

// --- Temps ③ : timing sur LA COURBE (glycemieCurve, S2) ---

/**
 * Repas de référence (repas mixte moyen). Même valeur que `REPAS_JOURNEE` interne à
 * `glycemieCurve.ts` (module 9), dont le commentaire précise « mêmes formes qu'au
 * module 2 » — reprise ici pour la continuité visuelle 2↔3 sans dépendre d'un export
 * interne du module Alimentation (S5), écrit en parallèle.
 */
const REPAS_REFERENCE: RepasParams = { charge: 0.55, frein: 0.35, retard: 0.3 };

const TIMING_T_MIN = 0;
const TIMING_T_MAX = 200;
const MARCHE_DUREE = 30;
const MICRO_DEBUT = 30;
const MICRO_PAS = 30;
const MICRO_MAX = 6;
const DELAY_DEFAUT = 15;

function filterDomain(points: Point[]): Point[] {
  return points.filter((p) => p.t >= TIMING_T_MIN && p.t <= TIMING_T_MAX);
}

function peakOf(points: Point[]): number {
  return points.reduce((max, p) => Math.max(max, p.v), 0);
}

function formatMg(level: number): string {
  return `${Math.round(mgFromLevel(level))} mg/dL`;
}

export default function ActiviteModule({ shell }: ModuleProps) {
  const [temps, setTemps] = useState<Temps>(1);

  // Temps ① — rayonnement
  const [t1Active, setT1Active] = useState<RayonId | 'all' | null>(null);

  // Temps ② — volume (jauge ouverte)
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [minutesOverride, setMinutesOverride] = useState<Record<string, number>>({});
  // Interrupteur soignant (BO8) : masque les activités légères de la réserve. Défaut
  // `false` = comportement actuel intact. Ne retire jamais un choix déjà fait par le
  // patient (cf. filtre appliqué plus bas, qui garde les activités cochées).
  const [toniquesUniquement, setToniquesUniquement] = useState(false);

  // Temps ③ — timing
  const [regime, setRegime] = useState<'marche' | 'microcoupures'>('marche');
  const [delay, setDelay] = useState(DELAY_DEFAUT);
  const [microChecked, setMicroChecked] = useState<Record<number, boolean>>({});

  function selectNode(id: RayonId) {
    if (id === 'sucre') {
      setT1Active('sucre');
      setTemps(2);
      return;
    }
    setT1Active((prev) => (prev === id ? null : id));
  }

  function toggleAllNodes() {
    setT1Active((prev) => (prev === 'all' ? null : 'all'));
  }

  function toggleActivity(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function adjustMinutes(id: string, base: number, delta: number) {
    setMinutesOverride((prev) => {
      const current = prev[id] ?? base;
      const next = Math.min(ACT_MIN_CEIL, Math.max(ACT_MIN_FLOOR, current + delta));
      return { ...prev, [id]: next };
    });
  }

  function toggleMicro(i: number) {
    setMicroChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  const activitiesView = useMemo(
    () =>
      ACTIVITIES.map((a) => ({
        ...a,
        isChecked: !!checked[a.id],
        curMinutes: minutesOverride[a.id] ?? a.minutes,
      })),
    [checked, minutesOverride],
  );

  // Réserve filtrée par l'interrupteur : une activité légère déjà cochée par le
  // patient reste visible (on ne retire jamais un choix fait), seules les légères
  // non cochées disparaissent de la réserve.
  const reserveView = useMemo(
    () =>
      toniquesUniquement
        ? activitiesView.filter((a) => a.intensite !== 'légère' || a.isChecked)
        : activitiesView,
    [activitiesView, toniquesUniquement],
  );

  const totalMinutes = useMemo(
    () => activitiesView.reduce((sum, a) => sum + (a.isChecked ? a.curMinutes : 0), 0),
    [activitiesView],
  );
  // Jauge ouverte, sans plafond (asymptotique) — cf. BRIEF §8.1-② : jamais de barre
  // « objectif atteint/échoué ».
  const jaugePct = totalMinutes > 0 ? (92 * totalMinutes) / (totalMinutes + 90) : 0;

  const microCount = useMemo(
    () => Array.from({ length: MICRO_MAX }, (_, i) => i).filter((i) => microChecked[i]).length,
    [microChecked],
  );

  const baselinePoints = useMemo(
    () => filterDomain(sampleRepas(REPAS_REFERENCE, { tStart: TIMING_T_MIN, tEnd: TIMING_T_MAX })),
    [],
  );

  const activePoints = useMemo(() => {
    const raw =
      regime === 'marche'
        ? sampleActivite(REPAS_REFERENCE, { debut: delay, duree: MARCHE_DUREE, type: 'marche' })
        : sampleActivite(REPAS_REFERENCE, {
            debut: MICRO_DEBUT,
            duree: 0,
            type: 'microcoupures',
            coupures: microCount,
          });
    return filterDomain(raw);
  }, [regime, delay, microCount]);

  const domainOpts = {
    width: COURBE_GRAPH_WIDTH,
    height: COURBE_GRAPH_HEIGHT,
    tMin: TIMING_T_MIN,
    tMax: TIMING_T_MAX,
    vMin: 0,
    vMax: LEVEL_MAX,
  };
  const baselinePath = useMemo(() => toSvgPath(baselinePoints, domainOpts), [baselinePoints]);
  const activePath = useMemo(() => toSvgPath(activePoints, domainOpts), [activePoints]);

  const marqueurs: MarqueurDef[] = useMemo(() => {
    if (regime === 'marche') {
      return [
        {
          t: delay / TIMING_T_MAX,
          type: 'activite',
          label: 'Marche',
          largeur: MARCHE_DUREE / TIMING_T_MAX,
        },
      ];
    }
    return Array.from({ length: microCount }, (_, i) => ({
      t: (MICRO_DEBUT + i * MICRO_PAS) / TIMING_T_MAX,
      type: 'activite' as const,
      label: `${i + 1}`,
    }));
  }, [regime, delay, microCount]);

  let timingHint: string;
  if (regime === 'marche') {
    timingHint =
      delay <= 20
        ? "Marcher juste après le repas : l'écrêtage du pic est le plus net."
        : delay <= 90
          ? 'Plus on attend après le repas, moins la marche écrête le pic.'
          : "Trop tardive, la marche n'a presque plus d'effet sur ce pic-ci.";
  } else {
    timingHint =
      microCount === 0
        ? "Cliquez les coupures faites aujourd'hui : 2 à 3 minutes de mouvement toutes les 30 minutes."
        : '2 à 3 minutes de mouvement toutes les 30 minutes, tout au long de la journée : un effet régulier sur la glycémie.';
  }

  // Bandeau de légende (bas d'écran), commun aux 3 temps (S8, passe « moins de texte ») :
  // eyebrow court partout, texte réservé à la sortie d'une interaction (temps ① : détail du
  // rayon/centre cliqué). Plus de paragraphe ambiant sur ②/③, le soignant narre.
  let caption: { eyebrow: string; text?: string };
  if (temps === 1) {
    const activeNode = t1Active && t1Active !== 'all' ? RAYONS.find((r) => r.id === t1Active) : undefined;
    caption =
      t1Active === 'all'
        ? {
            eyebrow: '① Le rayonnement',
            text: 'Un seul effort, quatre bénéfices en même temps : sucre, cœur & vaisseaux, tête, autonomie.',
          }
        : activeNode
          ? { eyebrow: '① Le rayonnement', text: activeNode.desc }
          : { eyebrow: '① Le rayonnement' };
  } else if (temps === 2) {
    caption = { eyebrow: '② Le volume' };
  } else {
    caption = { eyebrow: '③ Le timing' };
  }

  if (!shell) return null;

  const navBar = (
    <div className={styles.tempsTabs} role="tablist" aria-label="Étape du module">
      {TEMPS_TABS.map((t) => (
        <button
          key={t.n}
          type="button"
          role="tab"
          aria-selected={temps === t.n}
          className={`${styles.tab} ${temps === t.n ? styles.tabActive : ''}`}
          onClick={() => setTemps(t.n)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide nav={navBar}>
    <div className={styles.module}>
      {temps === 1 && (
        <div className={styles.rayonWrap}>
          <svg className={styles.raySvg} viewBox="0 0 100 100" aria-hidden="true">
            {RAYONS.map((r) => {
              const line = rayLine(NODE_POS[r.id]);
              const lit = t1Active === r.id || t1Active === 'all' || r.id === 'sucre';
              return (
                <line
                  key={r.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className={lit ? styles.rayLit : styles.ray}
                />
              );
            })}
          </svg>

          <div
            className={`${styles.node} ${styles.nodeCenter}`}
            style={{ left: `${CENTER_PCT.x}%`, top: `${CENTER_PCT.y}%`, width: `${CENTER_R_PCT * 2}%` }}
          >
            <button
              type="button"
              className={`${styles.nodeButton} ${styles.nodeButtonCenter} ${t1Active === 'all' ? styles.nodeLit : ''}`}
              onClick={toggleAllNodes}
              aria-pressed={t1Active === 'all'}
              aria-label="Activité — tous les bénéfices"
            >
              <IllustrationSlot id="activite-centre" label="Personne active" shape="circle" size={176} />
            </button>
            <span className={styles.nodeBelow}>
              <span className={`${styles.nodeLabel} ${styles.nodeCenterLabel}`}>Activité</span>
              <span className={styles.nodeHint}>cliquez : un effort, tous les bénéfices</span>
            </span>
          </div>

          {RAYONS.map((r) => {
            const pos = NODE_POS[r.id];
            const lit = t1Active === r.id || t1Active === 'all';
            return (
              <div
                key={r.id}
                className={styles.node}
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${NODE_R_PCT * 2}%` }}
              >
                <button
                  type="button"
                  className={`${styles.nodeButton} ${r.id === 'sucre' ? styles.nodeSucre : ''} ${lit ? styles.nodeLit : ''}`}
                  onClick={() => selectNode(r.id)}
                  aria-pressed={lit}
                  aria-label={r.label.join(' ')}
                >
                  <IllustrationSlot id={`activite-rayon-${r.id}`} label={r.label.join(' ')} shape="circle" size={140} />
                </button>
                <span className={styles.nodeBelow}>
                  <span className={styles.nodeLabel}>
                    {r.label.map((line, i) => (
                      <span key={i}>{line}</span>
                    ))}
                  </span>
                  {r.id === 'sucre' && (
                    <span className={styles.nodeSuite}>
                      voir la suite <ArrowRight size={12} aria-hidden="true" />
                    </span>
                  )}
                </span>
                {r.source && (
                  <span className={styles.nodeInfo}>
                    <InfoHover content={r.source} label={`En savoir plus : ${r.label.join(' ')}`}>
                      <span className={styles.nodeInfoGlyph} aria-hidden="true">
                        i
                      </span>
                    </InfoHover>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {temps === 2 && (
        <div className={styles.volumeLayout}>
          <div className={styles.volumeMain}>
            <p className="eyebrow">Ce que je fais déjà</p>
            <div className={styles.switchRow}>
              <span id="toniques-switch-label" className={styles.switchCaption}>
                Activités toniques uniquement
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={toniquesUniquement}
                aria-labelledby="toniques-switch-label"
                className={`${styles.switchBtn} ${toniquesUniquement ? styles.switchBtnOn : ''}`}
                onClick={() => setToniquesUniquement((v) => !v)}
              >
                <span className={styles.switchTrack} aria-hidden="true">
                  <span className={styles.switchKnob} />
                </span>
                <span className={styles.switchState}>{toniquesUniquement ? 'Modérées+' : 'Toutes'}</span>
              </button>
            </div>
            <div className={`card ${styles.activitiesGrid}`}>
              {reserveView.map((a) => (
                // A6f (S4, refonte-audit-2026-07) : la cible d'ajout n'était que le petit
                // cercle `.checkMark` en coin de carte (difficile à viser) ; le +/− ajustait
                // les minutes sans rien ajouter au total tant que ce cercle n'était pas
                // touché (piège). Toute la carte (hors stepper +/−) déclenche désormais
                // l'ajout/retrait — cible large, affordance évidente.
                <div
                  key={a.id}
                  className={`${styles.activityCard} ${a.isChecked ? styles.activityCardOn : ''}`}
                  data-intensite={a.intensite}
                  role="button"
                  tabIndex={0}
                  aria-pressed={a.isChecked}
                  aria-label={`${a.nom} — ${a.curMinutes} min — ${a.isChecked ? 'cochée, cliquer pour retirer' : 'cliquer pour ajouter au total'}`}
                  onClick={() => toggleActivity(a.id)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    toggleActivity(a.id);
                  }}
                >
                  <span className={styles.activityMain}>
                    <span className={styles.activityIllu}>
                      <IllustrationSlot
                        id={`activite-${a.id}`}
                        label={a.nom}
                        shape="rounded"
                        size={a.intensite === 'modérée' ? 48 : 44}
                      />
                      {a.muscle && (
                        <span className={styles.muscleDot} aria-hidden="true" title="bon pour les muscles" />
                      )}
                    </span>
                    <span className={styles.activityName}>{a.nom}</span>
                    <span className={styles.checkMark} aria-hidden="true">
                      {a.isChecked ? '✓' : ''}
                    </span>
                  </span>
                  {/* Le stepper reste une zone dédiée aux minutes : elle ne doit jamais
                      déclencher le toggle de la carte (stopPropagation). */}
                  <div className={styles.stepper} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      aria-label={`Réduire la durée de ${a.nom}`}
                      onClick={() => adjustMinutes(a.id, a.minutes, -ACT_MIN_STEP)}
                    >
                      −
                    </button>
                    <span className={styles.stepperValue}>{a.curMinutes} min</span>
                    <button
                      type="button"
                      aria-label={`Augmenter la durée de ${a.nom}`}
                      onClick={() => adjustMinutes(a.id, a.minutes, ACT_MIN_STEP)}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.activityTooltip} role="status">
                    intensité {a.intensite}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.volumeSide}>
            <p className="eyebrow">Le total du jour</p>
            <div className={`card ${styles.totalCard}`}>
              <p className={styles.totalNumber}>
                {totalMinutes} <span className={styles.totalUnit}>minutes</span>
              </p>
              <div className={styles.jaugeCol}>
                <div className={styles.jaugeTrack}>
                  <div className={styles.jaugeFill} style={{ width: `${jaugePct}%` }} />
                </div>
                <div className={styles.jaugeScale}>
                  <span>0</span>
                  <span>et ça continue ···→</span>
                </div>
              </div>
            </div>
            <div className={styles.muscleLegend}>
              <span className={styles.muscleDot} aria-hidden="true" />
              <span>bon aussi pour les muscles, l&rsquo;équilibre</span>
            </div>
          </div>
        </div>
      )}

      {temps === 3 && (
        <div className={styles.timingLayout}>
          <div className={styles.regimeTabs} role="tablist" aria-label="Régime de mouvement">
            <button
              type="button"
              role="tab"
              aria-selected={regime === 'marche'}
              className={`${styles.tab} ${regime === 'marche' ? styles.tabActive : ''}`}
              onClick={() => setRegime('marche')}
            >
              Marche post-repas
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={regime === 'microcoupures'}
              className={`${styles.tab} ${regime === 'microcoupures' ? styles.tabActive : ''}`}
              onClick={() => setRegime('microcoupures')}
            >
              Micro-coupures
            </button>
          </div>

          <div className={`card ${styles.timingCard}`}>
            <p className="eyebrow">Glycémie après le repas</p>
            <CourbeGlycemie
              courbes={[
                { id: 'baseline', d: baselinePath, label: 'Sans activité', variante: 'estompee', mg: formatMg(peakOf(baselinePoints)) },
                { id: 'active', d: activePath, label: 'Avec activité', variante: 'principale', mg: formatMg(peakOf(activePoints)) },
              ]}
              marqueurs={marqueurs}
              hoverLegend
            />

            {regime === 'marche' && (
              <div className={styles.sliderBlock}>
                <input
                  type="range"
                  min={0}
                  max={180}
                  step={5}
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className={styles.slider}
                  aria-label="Délai entre le repas et la marche, en minutes"
                />
                <div className={styles.sliderTicks}>
                  <span>repas</span>
                  <span>30 min</span>
                  <span>60 min</span>
                  <span>90 min</span>
                  <span>120 min</span>
                  <span>150 min</span>
                  <span>180 min</span>
                </div>
              </div>
            )}

            {regime === 'microcoupures' && (
              <div className={styles.microBlock}>
                <div className={styles.microRow}>
                  {Array.from({ length: MICRO_MAX }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.microDot} ${microChecked[i] ? styles.microDotOn : ''}`}
                      aria-pressed={!!microChecked[i]}
                      aria-label={`Coupure ${i + 1}`}
                      onClick={() => toggleMicro(i)}
                    />
                  ))}
                </div>
                <p className={styles.microCaption}>
                  cliquez les coupures faites aujourd&rsquo;hui · {microCount}/{MICRO_MAX}
                </p>
              </div>
            )}
          </div>

          <p className={styles.timingHint}>{timingHint}</p>
        </div>
      )}

      <div className={styles.captionBand}>
        <p className="eyebrow">{caption.eyebrow}</p>
        {caption.text && <p className={styles.captionText}>{caption.text}</p>}
      </div>

    </div>
    </ModuleShell>
  );
}
