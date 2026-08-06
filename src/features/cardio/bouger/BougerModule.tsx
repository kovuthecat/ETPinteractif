import { useMemo, useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import InfoHover from '../../../components/InfoHover';
import IllustrationSlot from '../components/IllustrationSlot';
import { ACTIVITIES, ACT_MIN_STEP, ACT_MIN_FLOOR, ACT_MIN_CEIL } from '../../../content/activites';
import { protectionColor, protectionValues } from '../lib/protectionSemaine';
import styles from './BougerModule.module.css';

/**
 * Module 7 — « Bouger » (C13, plans/theme-cardio-2026-07/S9.md ; moule = S4 `ArtereModule` :
 * onglets rendus dans le slot `nav` du `ModuleShell`). Deux onglets : **Volume** (grille
 * d'activités du quotidien, jauge ouverte sans plafond) et **Régularité** (calendrier semaine +
 * barres de protection qui s'estompent en 48-72 h sans activité).
 *
 * Textes = docs/cardio/CONTENU_cardio.md §M7 (validé G1, 2026-07-22) — repris verbatim pour les
 * 4 messages à l'écran et le repère « 150 min ». Aucun marqueur `// à revalider` dans §M7 (rien
 * à reporter). Grille d'activités, compteurs +/- minutes et formule de jauge : « patron de code »
 * `diabete/activite/ActiviteModule.tsx` (S6), adaptée sans son interrupteur « toniques
 * uniquement » (hors périmètre S9). Les 13 activités (`ACTIVITIES`) sont partagées avec ce module
 * via `src/content/activites.ts` depuis le 2026-08-06 (`plans/recette-outils-2026-08/S7.md`) —
 * ne plus les dupliquer ici. Rayonnement des bénéfices, calendrier semaine et barres de
 * protection : proto §MODULE 7 (lignes 201-281, logique 771-813) — BEN verbatim. Décroissance de
 * la protection adoucie le 2026-08-06 (`plans/recette-outils-2026-08/S3.md`, cf. constante
 * `PROTECTION_DECAY` ci-dessous) : le proto d'origine (-45/jour, seuils 60/25) faisait passer au
 * rouge un patient conforme au repère « pas plus de 2 jours consécutifs sans activité ».
 *
 * Pièges (brief M7, rappelés par S9) : jauge **sans plafond** (pas de barre « objectif
 * atteint/échoué ») ; **aucun chiffre d'étude à l'écran** — seul le repère « 150 min » (OMS/ESC)
 * reste visible en petit, le détail chiffré (150-300 min, ≥2 j musculaire, ≥65 ans équilibre)
 * n'apparaît qu'au survol (`InfoHover`), comme `TensionModule` §M4.
 */

type Onglet = 'volume' | 'regularite';

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: 'volume', label: 'Combien je bouge' },
  { id: 'regularite', label: 'La régularité' },
];

// G-M7-taille tranchée (Thibault, 2026-07-24) : le tour de taille reste ici, acceptable dans
// le contexte d'un bénéfice de l'activité (≠ facteur de risque du cockpit M2, où il a été retiré).
/** Rayonnement des bénéfices (proto BEN, logique 805-813), verbatim. */
const BENEFICES: { label: string; detail: string }[] = [
  { label: 'Tension', detail: 'Baisse la pression artérielle au repos.' },
  { label: 'Cholestérol', detail: 'Fait monter le bon cholestérol (HDL).' },
  { label: 'Poids / tour de taille', detail: 'Aide à réguler le poids et la graisse abdominale.' },
  { label: 'Glycémie', detail: "Améliore la sensibilité à l'insuline." },
  { label: 'Stress', detail: 'Réduit le stress et améliore le sommeil.' },
  { label: 'Cœur et vaisseaux', detail: 'Renforce directement le muscle cardiaque et la paroi des artères.' },
];

const JOURS: { court: string; complet: string }[] = [
  { court: 'L', complet: 'Lundi' },
  { court: 'M', complet: 'Mardi' },
  { court: 'M', complet: 'Mercredi' },
  { court: 'J', complet: 'Jeudi' },
  { court: 'V', complet: 'Vendredi' },
  { court: 'S', complet: 'Samedi' },
  { court: 'D', complet: 'Dimanche' },
];

export default function BougerModule({ shell }: ModuleProps) {
  const [onglet, setOnglet] = useState<Onglet>('volume');

  // --- Onglet Volume ---
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [minutesOverride, setMinutesOverride] = useState<Record<string, number>>({});

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

  const activitiesView = useMemo(
    () =>
      ACTIVITIES.map((a) => ({
        ...a,
        isChecked: !!checked[a.id],
        curMinutes: minutesOverride[a.id] ?? a.minutes,
      })),
    [checked, minutesOverride],
  );

  const totalMinutes = useMemo(
    () => activitiesView.reduce((sum, a) => sum + (a.isChecked ? a.curMinutes : 0), 0),
    [activitiesView],
  );

  // Jauge ouverte, sans plafond (asymptotique — proto ligne 237) : jamais de barre
  // « objectif atteint/échoué » (rappel S9 / brief M7).
  const jaugePct = totalMinutes > 0 ? (92 * totalMinutes) / (totalMinutes + 90) : 0;

  // --- Onglet Régularité ---
  const [weekActive, setWeekActive] = useState<boolean[]>(() => Array(7).fill(false));

  function toggleWeekDay(i: number) {
    setWeekActive((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  const protectionParJour = useMemo(() => protectionValues(weekActive), [weekActive]);

  if (!shell) return null;

  const nav = (
    <div className={styles.tabs}>
      {ONGLETS.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-current={onglet === o.id ? 'page' : undefined}
          className={`${styles.tab}${onglet === o.id ? ` ${styles.tabActive}` : ''}`}
          onClick={() => setOnglet(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} nav={nav} wide>
      <div className={styles.module}>
        {onglet === 'volume' && (
          <>
            <div className={styles.intro}>
              <p className="eyebrow">Bouger, ce n&rsquo;est pas faire du sport</p>
              <p className={styles.lead}>
                Ce que vous faites déjà compte : marcher, faire le ménage, jardiner, prendre les
                escaliers, porter les courses…
              </p>
            </div>

            <div className={styles.volumeLayout}>
              <div className={styles.volumeMain}>
                <p className="eyebrow">Ce que je fais déjà</p>
                <div className={`card ${styles.activitiesGrid}`}>
                  {activitiesView.map((a) => (
                    <div
                      key={a.id}
                      className={`${styles.activityCard}${a.isChecked ? ` ${styles.activityCardOn}` : ''}`}
                    >
                      <button
                        type="button"
                        className={styles.activityMain}
                        onClick={() => toggleActivity(a.id)}
                        aria-pressed={a.isChecked}
                      >
                        <span className={styles.activityIllu}>
                          <IllustrationSlot id={`activite-${a.id}`} label={a.nom} shape="rounded" size={48} />
                          {a.muscle && (
                            <span className={styles.muscleDot} aria-hidden="true" title="bon pour les muscles" />
                          )}
                        </span>
                        <span className={styles.activityName}>{a.nom}</span>
                        <span className={styles.checkMark} aria-hidden="true">
                          {a.isChecked ? '✓' : ''}
                        </span>
                      </button>
                      <div className={styles.stepper}>
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
                    </div>
                  ))}
                </div>
                <div className={styles.muscleLegend}>
                  <span className={styles.muscleDot} aria-hidden="true" />
                  <span>bon aussi pour les muscles, l&rsquo;équilibre</span>
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
                <p className="filrouge">Le plus grand pas : passer de rien à un peu.</p>
              </div>
            </div>

            <div className={styles.benefices}>
              <p className="eyebrow">Ce que l&rsquo;activité régulière change, concrètement</p>
              <p className={styles.lead}>
                {/* A6g (S4, refonte-audit-2026-07) : la phrase ne listait que 5 bénéfices,
                    le panneau ci-dessous en montre 6 (poids/tour de taille en plus) — alignée
                    sur les cartes réellement affichées, cf. // à revalider ci-dessus. */}
                Un seul effort, plusieurs bénéfices : tension, cholestérol, poids, sucre, stress, cœur.
              </p>
              <div className={styles.beneficesGrid}>
                {BENEFICES.map((b) => (
                  <div key={b.label} className={`card ${styles.beneficeCard}`}>
                    <p className={styles.beneficeLabel}>{b.label}</p>
                    <p className={styles.beneficeDetail}>{b.detail}</p>
                  </div>
                ))}
              </div>

              <p className={styles.repere}>
                Repère (OMS 2020 / ESC 2021) : 150 min par semaine d&rsquo;activité modérée{' '}
                <InfoHover
                  label="En savoir plus sur les repères d'activité physique"
                  content={
                    <>
                      150 à 300 min/semaine d&rsquo;activité modérée, ou 75 à 150 min/semaine
                      d&rsquo;activité vigoureuse. Renforcement musculaire ≥ 2 jours/semaine. À
                      partir de 65 ans : ajouter des exercices d&rsquo;équilibre ≥ 3
                      jours/semaine.
                    </>
                  }
                >
                  <span className={styles.infoGlyph} aria-hidden="true">
                    i
                  </span>
                </InfoHover>{' '}
                — un repère, jamais un objectif à atteindre ou à rater.
              </p>
            </div>
          </>
        )}

        {onglet === 'regularite' && (
          <div className={styles.regulariteLayout}>
            <p className={styles.lead}>
              L&rsquo;effet protecteur d&rsquo;une séance sur la tension et les vaisseaux{' '}
              <strong>s&rsquo;estompe en 48 à 72 h</strong>. Répartir l&rsquo;activité sur la
              semaine — plutôt que la concentrer sur un seul jour — maintient la protection en
              continu.
            </p>

            <div className={`card ${styles.calendrierCard}`}>
              <p className={styles.calendrierIntro}>Cliquez les jours où vous bougez ≥ 20-30 min</p>
              <div className={styles.weekGrid} role="group" aria-label="Jours actifs de la semaine">
                {JOURS.map((j, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.dayBtn}${weekActive[i] ? ` ${styles.dayBtnOn}` : ''}`}
                    aria-pressed={weekActive[i]}
                    aria-label={`${j.complet}${weekActive[i] ? ', jour actif' : ', jour inactif'}`}
                    onClick={() => toggleWeekDay(i)}
                  >
                    <span className={styles.dayLabel} aria-hidden="true">
                      {j.court}
                    </span>
                    <span className={styles.dayBox} aria-hidden="true">
                      {weekActive[i] ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>

              <p className={styles.protectionLabel}>Protection sur la semaine</p>
              <div className={styles.barsRow} role="img" aria-label="Niveau de protection estimé, jour par jour">
                {protectionParJour.map((v, i) => (
                  <div key={i} className={styles.barCol}>
                    <div
                      className={styles.bar}
                      style={{ height: `${Math.max(4, v)}%`, background: protectionColor(v) }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <p className={styles.repere}>
              Repère OMS/HAS : ne pas laisser passer plus de 2 jours consécutifs sans activité.
            </p>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
