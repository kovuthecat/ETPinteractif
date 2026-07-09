import { useMemo, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import IllustrationSlot from '../components/IllustrationSlot';
import CourbeGlycemie, {
  COURBE_GRAPH_HEIGHT,
  type BandeCible,
  type CourbeDef,
  type MarqueurDef,
} from '../components/CourbeGlycemie';
import { sampleRecuperation, toSvgPath, LEVEL_MAX, BANDE_CIBLE_DEFAUT } from '../lib/glycemieCurve';
import styles from './HypoglycemieModule.module.css';

/**
 * Module 8 — Hypoglycémie (plan theme-diabete/S11.md). Panneau de sortie de secours,
 * exécutable sous stress : ça se voit, ça ne se lit pas. 3 temps : ① mon profil hypo
 * (signes + resucrage) → ② le réflexe 15/15 (boucle + courbe récupération/overshoot,
 * LA COURBE de `glycemieCurve.ts`/S2) → ③ ma carte-réflexe (écran + fiche imprimable).
 * Hors périmètre (BRIEF_DESIGN §Module 8 / SPEC §12) : hypo sévère, entourage, glucagon —
 * traités par la parole du soignant, jamais sur la carte.
 */

// Textes repris verbatim de la maquette (Module 8 - Hypoglycemie.dc.html).
const SIGNES: string[] = [
  'Tremblements',
  'Sueurs',
  'Palpitations',
  'Faim soudaine',
  'Irritabilité',
  'Vision trouble',
  'Difficulté à se concentrer',
];

type Resucrage = { id: string; label: string };

const RESUCRAGES: Resucrage[] = [
  { id: 'jus', label: 'Jus de fruit (150 ml)' },
  { id: 'sucre', label: '3 morceaux de sucre' },
  { id: 'comprimes', label: 'Comprimés de glucose (15 g)' },
  { id: 'soda', label: 'Soda classique (150 ml)' },
];

type LoopStep = { num: string; label: string };

const LOOP: LoopStep[] = [
  { num: '①', label: 'Signes qui apparaissent' },
  { num: '15 g', label: 'Sucre pur, tout de suite' },
  { num: '~15 min', label: 'On attend, sans remanger' },
  { num: '↻', label: 'Recontrôle : répéter ou récupérer' },
];

type Temps = 1 | 2 | 3;

const TEMPS_TABS: { n: Temps; label: string }[] = [
  { n: 1, label: '① Mon profil hypo' },
  { n: 2, label: '② Le réflexe 15/15' },
  { n: 3, label: '③ Ma carte' },
];

/** Fenêtre représentée par la courbe de récupération (minutes) — cf. `sampleRecuperation` :
 * tEnd = max(45, dernier resucrage + 35) ; nos deux scénarios (une prise à t=0, deux prises
 * à t=0 et t=5) donnent tous les deux 45 min, ce qui garde les deux tracés sur le même axe. */
const WAIT_TOTAL_MINUTES = 45;
const RESUCRAGE_2E_PRISE_MINUTE = 5;
const ATTENTE_MINUTES = 15;

/** Slug ASCII (sans accents) pour les ids d'`IllustrationSlot` — cf. S11.md « ids slugifiés ASCII ». */
function slugify(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

function handleTabsKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, index: number, onSelect: (n: Temps) => void) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const nextIndex = (index + (e.key === 'ArrowRight' ? 1 : -1) + TEMPS_TABS.length) % TEMPS_TABS.length;
  onSelect(TEMPS_TABS[nextIndex].n);
}

export default function HypoglycemieModule({ onNavigate }: ModuleProps) {
  const [temps, setTemps] = useState<Temps>(1);
  const [signes, setSignes] = useState<Record<string, boolean>>({});
  const [lastSigneClicked, setLastSigneClicked] = useState<string | null>(null);
  const [resucrage, setResucrage] = useState<string>('comprimes');
  const [showOvershoot, setShowOvershoot] = useState(false);
  const [ficheOpen, setFicheOpen] = useState(false);

  function toggleSigne(signe: string) {
    setSignes((prev) => ({ ...prev, [signe]: !prev[signe] }));
    setLastSigneClicked(signe);
  }

  const mySignes = useMemo(() => SIGNES.filter((s) => signes[s]), [signes]);
  const resucrageChoisi = RESUCRAGES.find((r) => r.id === resucrage) ?? null;

  // LA COURBE (S2 `glycemieCurve.ts` / S3 `CourbeGlycemie`) — jamais recalculée localement.
  // Principale : une prise à t=0, se pose dans la bande sans la dépasser. Overshoot (fantôme,
  // variante frozen de S3) : 2ᵉ prise à t=+5 min avant que le sucre ait agi → dépasse la bande.
  const pointsPrincipale = useMemo(() => sampleRecuperation({ resucrages: [0] }), []);
  const pointsOvershoot = useMemo(
    () => sampleRecuperation({ resucrages: [0, RESUCRAGE_2E_PRISE_MINUTE], second: true }),
    [],
  );

  const dPrincipale = useMemo(
    () =>
      toSvgPath(pointsPrincipale, {
        width: 600,
        height: COURBE_GRAPH_HEIGHT,
        tMin: 0,
        tMax: WAIT_TOTAL_MINUTES,
        vMin: 0,
        vMax: LEVEL_MAX,
      }),
    [pointsPrincipale],
  );
  const dOvershoot = useMemo(
    () =>
      toSvgPath(pointsOvershoot, {
        width: 600,
        height: COURBE_GRAPH_HEIGHT,
        tMin: 0,
        tMax: WAIT_TOTAL_MINUTES,
        vMin: 0,
        vMax: LEVEL_MAX,
      }),
    [pointsOvershoot],
  );

  const courbes: CourbeDef[] = useMemo(() => {
    const list: CourbeDef[] = [{ id: 'principale', d: dPrincipale, label: 'Avec attente', variante: 'principale' }];
    if (showOvershoot) {
      list.push({ id: 'overshoot', d: dOvershoot, label: 'Sans attente (2ᵉ prise trop tôt)', variante: 'fantome' });
    }
    return list;
  }, [dPrincipale, dOvershoot, showOvershoot]);

  const bandes: BandeCible = useMemo(
    () => ({
      hauteY: COURBE_GRAPH_HEIGHT * (1 - BANDE_CIBLE_DEFAUT.haute / LEVEL_MAX),
      basseY: COURBE_GRAPH_HEIGHT * (1 - BANDE_CIBLE_DEFAUT.basse / LEVEL_MAX),
    }),
    [],
  );

  const marqueurs: MarqueurDef[] = useMemo(() => {
    const list: MarqueurDef[] = [
      { t: 0, type: 'resucrage', label: '15 g' },
      { t: 0, type: 'attente', label: '~15 min', largeur: ATTENTE_MINUTES / WAIT_TOTAL_MINUTES },
    ];
    if (showOvershoot) {
      list.push({ t: RESUCRAGE_2E_PRISE_MINUTE / WAIT_TOTAL_MINUTES, type: 'resucrage', label: '2ᵉ prise' });
    }
    return list;
  }, [showOvershoot]);

  const axeLabels = ['0 min', '15 min', '30 min', '45 min'];

  const patienceMessage = showOvershoot
    ? "Remanger tout de suite fait dépasser la cible — on repart en hyper. Le sucre n'a pas encore eu le temps d'agir : on attend."
    : 'Le temps fort, c’est l’attente : le sucre agit en ~15 minutes. Recontrôler avant de continuer.';

  return (
    <div className={styles.module}>
      <div className={styles.tabs} role="tablist" aria-label="Les 3 temps du module Hypoglycémie">
        {TEMPS_TABS.map((tab, index) => (
          <button
            key={tab.n}
            type="button"
            role="tab"
            id={`m8-tab-${tab.n}`}
            aria-selected={temps === tab.n}
            aria-controls={`m8-panel-${tab.n}`}
            tabIndex={temps === tab.n ? 0 : -1}
            className={temps === tab.n ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setTemps(tab.n)}
            onKeyDown={(e) => handleTabsKeyDown(e, index, setTemps)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Temps ① — Mon profil hypo ─────────────────────────────────────── */}
      <section
        id="m8-panel-1"
        role="tabpanel"
        aria-labelledby="m8-tab-1"
        hidden={temps !== 1}
        className={styles.panel}
      >
        <div className={styles.profilGrid}>
          <div className={styles.profilCol}>
            <p className={styles.sectionLabel}>Mes signes précoces — cochez ce que vous ressentez</p>

            {lastSigneClicked && (
              <div className={styles.preview}>
                <IllustrationSlot id={`signe-${slugify(lastSigneClicked)}`} label={lastSigneClicked} size={100} />
                <span className={styles.previewLabel}>{lastSigneClicked}</span>
              </div>
            )}

            <div className={styles.chipRow}>
              {SIGNES.map((signe) => {
                const active = !!signes[signe];
                return (
                  <button
                    key={signe}
                    type="button"
                    className={`chip ${styles.signeChip}${active ? ' activeDoubled' : ''}`}
                    style={{ '--active-color': 'var(--color-vigilance)' } as React.CSSProperties}
                    aria-pressed={active}
                    onClick={() => toggleSigne(signe)}
                  >
                    {signe}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.profilCol}>
            <p className={styles.sectionLabel}>Mon resucrage — ce que j’ai sur moi</p>
            <div className={styles.resucrageList} role="radiogroup" aria-label="Mon resucrage habituel">
              {RESUCRAGES.map((r) => {
                const active = resucrage === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`${styles.resucrageRow}${active ? ' activeDoubled' : ''}`}
                    style={{ '--active-color': 'var(--color-confort)' } as React.CSSProperties}
                    onClick={() => setResucrage(r.id)}
                  >
                    <IllustrationSlot id={`resucrage-${r.id}`} label={r.label} shape="circle" size={44} />
                    <span className={styles.resucrageLabel}>{r.label}</span>
                    {active && <span className={styles.resucrageCheck}>✓ choisi</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Temps ② — Le réflexe 15/15 ────────────────────────────────────── */}
      <section
        id="m8-panel-2"
        role="tabpanel"
        aria-labelledby="m8-tab-2"
        hidden={temps !== 2}
        className={styles.panel}
      >
        <div className={styles.loopRow}>
          {LOOP.map((step, i) => (
            <div key={step.label} className={styles.loopStepWrap}>
              <div className={styles.loopStep}>
                <span className={styles.loopNum}>{step.num}</span>
                <span className={styles.loopLabel}>{step.label}</span>
              </div>
              {i < LOOP.length - 1 && (
                <span className={styles.loopArrow} aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`btn btn--ghost ${styles.overshootToggle}${showOvershoot ? ' activeDoubled' : ''}`}
          style={{ '--active-color': 'var(--color-vigilance)' } as React.CSSProperties}
          aria-pressed={showOvershoot}
          onClick={() => setShowOvershoot((v) => !v)}
        >
          Et si on ne patiente pas ?
        </button>

        <div className={`card ${styles.courbeCard}`}>
          <p className={styles.sectionLabel}>Ce que fait le sucre après le resucrage</p>
          <CourbeGlycemie courbes={courbes} bandes={bandes} marqueurs={marqueurs} axeLabels={axeLabels} />
          <div className={styles.legendeRow}>
            <span className={styles.legendeConfort}>— On attend : ça remonte, sans excès</span>
            {showOvershoot && (
              <span className={styles.legendeVigilance}>- - On remange trop tôt : ça remonte trop haut</span>
            )}
          </div>
        </div>

        <p className={styles.patienceMessage}>{patienceMessage}</p>
      </section>

      {/* ── Temps ③ — Ma carte-réflexe ────────────────────────────────────── */}
      <section
        id="m8-panel-3"
        role="tabpanel"
        aria-labelledby="m8-tab-3"
        hidden={temps !== 3}
        className={styles.panel}
      >
        <div className={`card ${styles.carte}`}>
          <div className={styles.carteHeader}>
            <h2 className={styles.carteTitre}>Ma carte-réflexe 15 / 15</h2>
            <span className={styles.carteNote}>À garder sur soi</span>
          </div>

          <div className={styles.carteResume}>
            <div className={styles.carteBloc}>
              <p className={styles.carteBlocLabel}>Mes signes</p>
              {mySignes.length > 0 ? (
                <div className={styles.chipRow}>
                  {mySignes.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={styles.carteBlocVide}>À définir avec le soignant</p>
              )}
            </div>
            <div className={styles.carteBloc}>
              <p className={styles.carteBlocLabel}>Mon resucrage</p>
              <p className={styles.carteResucrageValeur}>{resucrageChoisi ? resucrageChoisi.label : 'À définir'}</p>
            </div>
          </div>

          <div className={styles.loopRow}>
            {LOOP.map((step, i) => (
              <div key={step.label} className={styles.loopStepWrap}>
                <div className={`${styles.loopStep} ${styles.loopStepFiche}`}>
                  <span className={styles.loopNum}>{step.num}</span>
                  <span className={styles.loopLabel}>{step.label}</span>
                </div>
                {i < LOOP.length - 1 && (
                  <span className={styles.loopArrow} aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className={`callout ${styles.rappelSucre}`}>
            Toujours du sucre pur (jus, sucre, comprimés) — jamais du chocolat ou des aliments gras : ça remonte trop
            lentement.
          </p>

          <button type="button" className={`btn btn--primary ${styles.imprimerBtn}`} onClick={() => setFicheOpen(true)}>
            Imprimer ma carte
          </button>
        </div>
      </section>

      <ModuleFooterNav
        items={[{ id: 'insuline', label: 'Le capteur alarme quand les signes manquent' }]}
        onNavigate={onNavigate}
      />

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · DIABÈTE"
          titre="Ma carte-réflexe 15 / 15"
          footer={<p className="fiche-filrouge">Reconnaître tôt · Doser · Attendre.</p>}
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Mes signes</span>
            {mySignes.length > 0 ? (
              <div className={styles.chipRow}>
                {mySignes.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.carteBlocVide}>À définir avec le soignant</p>
            )}
          </div>

          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Mon resucrage</span>
            <p className={styles.carteResucrageValeur}>{resucrageChoisi ? resucrageChoisi.label : 'À définir'}</p>
          </div>

          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">La boucle des 15</span>
            <div className={styles.ficheSignaletique}>
              {LOOP.map((step, i) => (
                <div key={step.label} className="fiche-signaletique-etape">
                  <span className="fiche-signaletique-num">{i + 1}</span>
                  <p className="fiche-signaletique">
                    <strong>{step.num}</strong> — {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className={`callout ${styles.rappelSucre}`}>
            Toujours du sucre pur (jus, sucre, comprimés) — jamais du chocolat ou des aliments gras : ça remonte trop
            lentement.
          </p>
        </FicheOverlay>
      )}
    </div>
  );
}
