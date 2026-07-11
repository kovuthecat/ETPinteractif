import { useMemo, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import CourbeGlycemie, {
  COURBE_GRAPH_WIDTH,
  COURBE_GRAPH_HEIGHT,
  bandeToY,
  type CourbeDef,
  type MarqueurDef,
} from '../components/CourbeGlycemie';
import {
  sampleRepas,
  sampleRepasAvecBolus,
  toSvgPath,
  LEVEL_MAX,
  BASELINE,
  BANDE_CIBLE_DEFAUT,
  type RepasParams,
} from '../lib/glycemieCurve';
import styles from './InsulineRapideModule.module.css';

/**
 * Module 10 — Insuline rapide (pré-prandial). Contenu : `docs/diabete/10-insuline-rapide.md`
 * (autorité) ; modèle : `sampleRepasAvecBolus` (`lib/glycemieCurve.ts`). Distinct du module 9
 * (insuline basale) : ici on couvre le repas, pas la glycémie à jeun. 4 temps (S10-implementation
 * §0) : ① couvrir le repas, ② le bon moment, ③ corriger avant le repas, ④ le piège du cumul.
 * Aucun chiffre à l'écran (dose/minutes) — paliers qualitatifs uniquement, cf. garde-fou du plan.
 */

type Temps = 1 | 2 | 3 | 4;

const TEMPS_TABS: { n: Temps; label: string }[] = [
  { n: 1, label: '① Couvrir le repas' },
  { n: 2, label: '② Le bon moment' },
  { n: 3, label: '③ Corriger avant le repas' },
  { n: 4, label: '④ Le piège du cumul' },
];

function handleTabsKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, index: number, onSelect: (n: Temps) => void) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const nextIndex = (index + (e.key === 'ArrowRight' ? 1 : -1) + TEMPS_TABS.length) % TEMPS_TABS.length;
  onSelect(TEMPS_TABS[nextIndex].n);
}

// --- Repère temporel commun aux 4 temps : repas fixé à t=0, domaine -60→+180 min (span 240),
// ce qui aligne exactement l'étiquette « Repas » sur la 2ᵉ des 5 étiquettes d'axe. ---
const T_MIN = -60;
const T_MAX = 180;
const T_SPAN = T_MAX - T_MIN;
const AXE_LABELS = ['-1h', 'Repas', '+1h', '+2h', '+3h'];

function frac(t: number): number {
  return (t - T_MIN) / T_SPAN;
}

const DOMAIN_OPTS = {
  width: COURBE_GRAPH_WIDTH,
  height: COURBE_GRAPH_HEIGHT,
  tMin: T_MIN,
  tMax: T_MAX,
  vMin: 0,
  vMax: LEVEL_MAX,
};

const REPAS_MARQUEUR: MarqueurDef = { t: frac(0), type: 'repas', label: 'Repas' };

// --- Temps ① — trois crans qualitatifs de glucides (mêmes proportions frein/retard, seule la
// charge varie) ; la dose de rapide « couvre » proportionnellement à la charge (S10-implementation
// §2.2-①). ---
type RepasCranId = 'peu' | 'moyen' | 'beaucoup';
type RepasCran = { id: RepasCranId; label: string; params: RepasParams };

const REPAS_CRANS: RepasCran[] = [
  { id: 'peu', label: 'Peu de glucides', params: { charge: 0.3, frein: 0.35, retard: 0.3 } },
  { id: 'moyen', label: 'Repas moyen', params: { charge: 0.55, frein: 0.35, retard: 0.3 } },
  { id: 'beaucoup', label: 'Beaucoup de glucides', params: { charge: 0.8, frein: 0.35, retard: 0.3 } },
];

const REPAS_MOYEN = REPAS_CRANS[1].params;
/** Dose de référence pour un repas moyen, injectée juste avant — utilisée aux temps ②③④.
 *  `// à revalider (Thibault)`. */
const DOSE_ADEQUATE = 0.5;
/** Timing standard « juste avant le repas » — `// à revalider (Thibault)`. */
const T_INJECTION_DEFAUT = -15;

// --- Temps ② — délai d'injection, de « bien avant » à « après le repas » (jamais affiché en
// minutes, cf. garde-fou : le curseur pilote le modèle, seuls des mots qualitatifs sont visibles). ---
const DELAY_MIN = -60;
const DELAY_MAX = 90;
const DELAY_STEP = 5;

// --- Temps ③ — glycémie de départ avant le repas, 3 paliers qualitatifs (`// à caler`). ---
type DepartId = 'basse' | 'cible' | 'haute';
const DEPART_OPTIONS: { id: DepartId; label: string; value: number }[] = [
  { id: 'basse', label: 'Basse', value: BASELINE - 10 },
  { id: 'cible', label: 'Dans la cible', value: BASELINE },
  { id: 'haute', label: 'Haute', value: BASELINE + 30 },
];

// --- Temps ④ — 2ᵉ dose ~30 min après la 1ʳᵉ (`// à revalider`, cf. docs §5 « cumul »). ---
const T_SECONDE_DOSE = T_INJECTION_DEFAUT + 30;

function timingHint(delay: number): string {
  if (delay <= -30) return "Injectée bien avant, la rapide a déjà commencé à agir quand le repas fait monter le sucre.";
  if (delay < 0) return 'Injectée juste avant le repas, la rapide est prête à temps pour couvrir le pic.';
  if (delay === 0) return 'Injectée au moment du repas, la rapide part avec un léger retard sur la montée du sucre.';
  return "Injectée après le repas, la rapide arrive en retard : le pic a une longueur d'avance sur elle.";
}

export default function InsulineRapideModule({ onNavigate, shell }: ModuleProps) {
  const [temps, setTemps] = useState<Temps>(1);
  const [repasId, setRepasId] = useState<RepasCranId>('moyen');
  const [delay, setDelay] = useState(T_INJECTION_DEFAUT);
  const [departId, setDepartId] = useState<DepartId>('cible');
  const [cumulActive, setCumulActive] = useState(false);

  const cran = REPAS_CRANS.find((c) => c.id === repasId) ?? REPAS_CRANS[1];
  const departValue = DEPART_OPTIONS.find((d) => d.id === departId)?.value ?? BASELINE;

  const bandes = useMemo(() => bandeToY(BANDE_CIBLE_DEFAUT), []);

  // ── Temps ① — couvrir le repas ──────────────────────────────────────────
  const t1Points = useMemo(
    () => ({
      sans: sampleRepas(cran.params, { tStart: T_MIN, tEnd: T_MAX }),
      avec: sampleRepasAvecBolus(cran.params, { dose: cran.params.charge, tInjection: T_INJECTION_DEFAUT }),
    }),
    [cran],
  );
  const t1Courbes: CourbeDef[] = useMemo(
    () => [
      { id: 'sans', d: toSvgPath(t1Points.sans, DOMAIN_OPTS), label: 'Sans rapide', variante: 'fantome' },
      { id: 'avec', d: toSvgPath(t1Points.avec, DOMAIN_OPTS), label: 'Avec rapide', variante: 'principale' },
    ],
    [t1Points],
  );

  // ── Temps ② — le bon moment ──────────────────────────────────────────────
  const t2Points = useMemo(
    () => ({
      sans: sampleRepas(REPAS_MOYEN, { tStart: T_MIN, tEnd: T_MAX }),
      avec: sampleRepasAvecBolus(REPAS_MOYEN, { dose: DOSE_ADEQUATE, tInjection: delay }),
    }),
    [delay],
  );
  const t2Courbes: CourbeDef[] = useMemo(
    () => [
      { id: 'sans', d: toSvgPath(t2Points.sans, DOMAIN_OPTS), label: 'Sans rapide', variante: 'estompee' },
      { id: 'avec', d: toSvgPath(t2Points.avec, DOMAIN_OPTS), label: 'Avec rapide', variante: 'principale' },
    ],
    [t2Points],
  );
  const t2Marqueurs: MarqueurDef[] = useMemo(
    () => [REPAS_MARQUEUR, { t: frac(delay), type: 'activite', label: 'Injection' }],
    [delay],
  );

  // ── Temps ③ — corriger avant le repas ────────────────────────────────────
  const t3Points = useMemo(
    () => ({
      reference: sampleRepasAvecBolus(REPAS_MOYEN, { dose: DOSE_ADEQUATE, tInjection: T_INJECTION_DEFAUT }),
      selection: sampleRepasAvecBolus(REPAS_MOYEN, {
        dose: DOSE_ADEQUATE,
        tInjection: T_INJECTION_DEFAUT,
        depart: departValue,
      }),
    }),
    [departValue],
  );
  const t3Courbes: CourbeDef[] = useMemo(
    () => [
      { id: 'reference', d: toSvgPath(t3Points.reference, DOMAIN_OPTS), label: 'Départ dans la cible', variante: 'estompee' },
      { id: 'selection', d: toSvgPath(t3Points.selection, DOMAIN_OPTS), label: 'Mon départ', variante: 'principale' },
    ],
    [t3Points],
  );

  // ── Temps ④ — le piège du cumul ──────────────────────────────────────────
  const t4Points = useMemo(
    () => ({
      unique: sampleRepasAvecBolus(REPAS_MOYEN, { dose: DOSE_ADEQUATE, tInjection: T_INJECTION_DEFAUT }),
      cumul: sampleRepasAvecBolus(REPAS_MOYEN, {
        dose: DOSE_ADEQUATE,
        tInjection: T_INJECTION_DEFAUT,
        tSecondeDose: T_SECONDE_DOSE,
      }),
    }),
    [],
  );
  const t4Courbes: CourbeDef[] = useMemo(() => {
    const list: CourbeDef[] = [
      { id: 'unique', d: toSvgPath(t4Points.unique, DOMAIN_OPTS), label: 'Une dose', variante: 'principale' },
    ];
    if (cumulActive) {
      list.push({ id: 'cumul', d: toSvgPath(t4Points.cumul, DOMAIN_OPTS), label: '2ᵉ dose trop tôt', variante: 'fantome' });
    }
    return list;
  }, [t4Points, cumulActive]);
  const t4Marqueurs: MarqueurDef[] = useMemo(() => {
    const list: MarqueurDef[] = [REPAS_MARQUEUR, { t: frac(T_INJECTION_DEFAUT), type: 'activite', label: '1ʳᵉ dose' }];
    if (cumulActive) list.push({ t: frac(T_SECONDE_DOSE), type: 'activite', label: '2ᵉ dose' });
    return list;
  }, [cumulActive]);

  if (!shell) return null;

  const navBar = (
    <div className={styles.tabs} role="tablist" aria-label="Les 4 temps du module Insuline rapide">
      {TEMPS_TABS.map((tab, index) => (
        <button
          key={tab.n}
          type="button"
          role="tab"
          id={`m10-tab-${tab.n}`}
          aria-selected={temps === tab.n}
          aria-controls={`m10-panel-${tab.n}`}
          tabIndex={temps === tab.n ? 0 : -1}
          className={temps === tab.n ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setTemps(tab.n)}
          onKeyDown={(e) => handleTabsKeyDown(e, index, setTemps)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide nav={navBar}>
    <div className={styles.module}>
      {/* ── Temps ① — Couvrir le repas ────────────────────────────────────── */}
      <section id="m10-panel-1" role="tabpanel" aria-labelledby="m10-tab-1" hidden={temps !== 1} className={styles.panel}>
        <div className={styles.chipRow} role="radiogroup" aria-label="Glucides du repas">
          {REPAS_CRANS.map((c) => {
            const active = repasId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
                onClick={() => setRepasId(c.id)}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className={`card ${styles.courbeCard}`}>
          <p className="eyebrow">Ce que fait le sucre après le repas</p>
          <CourbeGlycemie courbes={t1Courbes} bandes={bandes} marqueurs={[REPAS_MARQUEUR]} axeLabels={AXE_LABELS} />
          <div className={styles.legendeRow}>
            <span className={styles.legendeFantome}>- - Sans rapide : le pic monte librement</span>
            <span className={styles.legendePrincipale}>— Avec rapide : le pic est couvert</span>
          </div>
        </div>

        <p className={styles.message}>Plus le repas apporte de glucides, plus il faut de rapide pour couvrir la montée du sucre.</p>
      </section>

      {/* ── Temps ② — Le bon moment ───────────────────────────────────────── */}
      <section id="m10-panel-2" role="tabpanel" aria-labelledby="m10-tab-2" hidden={temps !== 2} className={styles.panel}>
        <div className={`card ${styles.courbeCard}`}>
          <p className="eyebrow">Glycémie après le repas, selon le moment de l'injection</p>
          <CourbeGlycemie courbes={t2Courbes} bandes={bandes} marqueurs={t2Marqueurs} axeLabels={AXE_LABELS} />

          <div className={styles.sliderBlock}>
            <input
              type="range"
              min={DELAY_MIN}
              max={DELAY_MAX}
              step={DELAY_STEP}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className={styles.slider}
              aria-label="Moment de l'injection de la rapide par rapport au repas"
            />
            <div className={styles.sliderTicks}>
              <span>bien avant</span>
              <span>juste avant</span>
              <span>au moment du repas</span>
              <span>après le repas</span>
            </div>
          </div>
        </div>

        <p className={styles.message}>{timingHint(delay)}</p>
      </section>

      {/* ── Temps ③ — Corriger avant le repas ─────────────────────────────── */}
      <section id="m10-panel-3" role="tabpanel" aria-labelledby="m10-tab-3" hidden={temps !== 3} className={styles.panel}>
        <div className={styles.chipRow} role="radiogroup" aria-label="Glycémie avant le repas">
          {DEPART_OPTIONS.map((d) => {
            const active = departId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`chip ${styles.cranChip}${active ? ' activeDoubled' : ''}`}
                onClick={() => setDepartId(d.id)}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        <div className={`card ${styles.courbeCard}`}>
          <p className="eyebrow">Ce que fait le sucre, selon la glycémie de départ</p>
          <CourbeGlycemie courbes={t3Courbes} bandes={bandes} marqueurs={[REPAS_MARQUEUR]} axeLabels={AXE_LABELS} />
        </div>

        {departId === 'basse' && (
          <div className={styles.bridgeRow}>
            <p className={styles.message}>Glycémie basse avant de manger : on ne corrige pas par plus de rapide, on traite l'hypo d'abord.</p>
            <button type="button" className="btn btn--ghost" onClick={() => onNavigate('hypoglycemie')}>
              Traiter l'hypo d'abord
            </button>
          </div>
        )}
        {departId === 'cible' && <p className={styles.message}>Glycémie dans la cible : la dose habituelle suffit, pas de correction à ajouter.</p>}
        {departId === 'haute' && (
          <p className={styles.message}>Glycémie haute avant de manger : un peu plus de rapide vient corriger, en plus de la couverture du repas.</p>
        )}
      </section>

      {/* ── Temps ④ — Le piège du cumul ───────────────────────────────────── */}
      <section id="m10-panel-4" role="tabpanel" aria-labelledby="m10-tab-4" hidden={temps !== 4} className={styles.panel}>
        <button
          type="button"
          className={`btn btn--ghost ${styles.cumulToggle}${cumulActive ? ' activeDoubled' : ''}`}
          aria-pressed={cumulActive}
          onClick={() => setCumulActive((v) => !v)}
        >
          Et si j'en remets trop tôt ?
        </button>

        <div className={`card ${styles.courbeCard}`}>
          <p className="eyebrow">Ce que fait le sucre si on se recorrige trop tôt</p>
          <CourbeGlycemie courbes={t4Courbes} bandes={bandes} marqueurs={t4Marqueurs} axeLabels={AXE_LABELS} />
          <div className={styles.legendeRow}>
            <span className={styles.legendePrincipale}>— Une dose : ça se pose dans la cible</span>
            {cumulActive && <span className={styles.legendeVigilance}>- - Deux doses rapprochées : ça plonge sous la cible</span>}
          </div>
        </div>

        <div className={styles.bridgeRow}>
          <p className={styles.message}>
            L'insuline rapide agit pendant plusieurs heures : se recorriger trop tôt alors qu'elle agit encore fait plonger sous
            la cible. On attend, on recontrôle.
          </p>
          {cumulActive && (
            <button type="button" className="btn btn--ghost" onClick={() => onNavigate('hypoglycemie')}>
              Ça ressemble à une hypo → le réflexe
            </button>
          )}
        </div>
      </section>

      <p className="filrouge">La bonne dose, c'est celle de votre protocole — ici on apprend le raisonnement, pas les chiffres.</p>
    </div>
    </ModuleShell>
  );
}
