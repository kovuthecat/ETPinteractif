import { useEffect, useState } from 'react';
import type { ModuleProps } from '../../types';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import styles from './MecanismeModule.module.css';

/**
 * MODULE 1 — « C'EST QUOI LE DIABÈTE ? » (illustration-driven depuis S4,
 * plans/illustrations-diabete/S4.md ; remplace la séquence codée 4-temps/5-cellules de
 * plans/theme-diabete/S4.md, D4). Animation clé/serrure à **4 modes**, contrôle **par cellule**
 * (3 cellules, pas 5) : chaque mode rejoue en boucle une séquence de 3 phases (clés qui partent
 * → serrures qui réagissent → sucre qui se dépose/se vide), portée fidèlement du prototype de
 * référence `proto-m1-anim2.html` (index illustrations-diabete §6, fait foi). Le soignant
 * choisit le mode, ne pilote pas la boucle image par image (≠ ancien wizard next/prev).
 */

type Mode = 'sain' | 'penie' | 'diab' | 'mixte';
type CelluleEtat = 'closed' | 'open' | 'rusty';
type KeyPhase = 'hidden' | 'flown' | 'turned' | 'gone';
type BloodTone = 'confort' | 'vigilance' | 'toxique';

interface ModeDef {
  id: Mode;
  label: string;
  cell: CelluleEtat[];
  key: boolean[];
  sugar: number;
  txt: string;
  l1: string;
  l2: string;
  l3: string;
}

const MODES: ModeDef[] = [
  {
    id: 'sain',
    label: 'Sans diabète',
    cell: ['open', 'open', 'open'],
    key: [true, true, true],
    sugar: 3,
    txt: 'Sucre dans le sang : bas',
    l1: "Les clés (l'insuline) partent du pancréas vers chaque serrure.",
    l2: "Chaque serrure s'ouvre : le sucre entre dans les cellules.",
    l3: 'Le sang se vide — glycémie normale.',
  },
  {
    id: 'penie',
    label: 'Insulinopénie — manque de clés',
    cell: ['open', 'closed', 'closed'],
    key: [true, false, false],
    sugar: 6,
    txt: 'Sucre dans le sang : encore élevé',
    l1: 'Le pancréas fatigue : il fabrique trop peu de clés.',
    l2: "Une seule clé disponible : une seule cellule s'ouvre, les autres restent fermées.",
    l3: 'Le sucre reste en grande partie dans le sang.',
  },
  {
    id: 'diab',
    label: 'Insulinorésistance — serrures rouillées',
    cell: ['rusty', 'rusty', 'rusty'],
    key: [false, false, false],
    sugar: 8,
    txt: 'Sucre dans le sang : élevé',
    l1: 'Les clés sont là, mais les serrures sont rouillées.',
    l2: 'La clé bute : la serrure résiste et ne tourne pas.',
    l3: 'Le sucre reste dans le sang (insulinorésistance).',
  },
  {
    id: 'mixte',
    label: 'Mixte',
    cell: ['rusty', 'open', 'closed'],
    key: [false, true, false],
    sugar: 7,
    txt: 'Sucre dans le sang : élevé',
    l1: 'Souvent plusieurs mécanismes à la fois.',
    l2: "Une serrure rouillée, une qui s'ouvre avec sa clé, une sans clé.",
    l3: 'Au total, le sucre reste élevé dans le sang.',
  },
];

const CLOSED3: CelluleEtat[] = ['closed', 'closed', 'closed'];
const TOTAL_TOKENS = 8;

// Repère de la scène (% d'une boîte de référence 1060×340, cf. proto-m1-anim2.html) — même
// principe que SILHOUETTE_VIEWBOX : tout se positionne en % pour rester responsive.
const CELL_LEFT_PCT = [44.3, 63.0, 81.7];
const KEY_REST = { left: 14.2, top: 44.1 };
const KEY_TARGET_LEFT_PCT = [51.8, 70.5, 89.2];
const KEY_TARGET_TOP_PCT = 28;

const BASE = `${import.meta.env.BASE_URL}illustrations/diabete/`;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function bloodTone(sugarCount: number): BloodTone {
  if (sugarCount <= 3) return 'confort';
  if (sugarCount <= 6) return 'vigilance';
  return 'toxique';
}

export default function MecanismeModule({ onNavigate }: ModuleProps) {
  const [modeId, setModeId] = useState<Mode>('sain');
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  // S6 (option B) : compteur incrémenté à chaque sélection de mode ou clic « Rejouer » —
  // force l'effet à rejouer même en cliquant deux fois le même mode (modeId ne change pas).
  const [replayKey, setReplayKey] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  // Séquence jouée UNE SEULE FOIS (500 → 2000 → 3400 ms), puis on RESTE sur l'état final —
  // plus de relance automatique (S6, capture #11 : « animations trop rapides, état final trop
  // court »). Le soignant contrôle le rythme (choisit le mode, ou « Rejouer »). Coupée si
  // l'utilisateur a réduit les animations : état final affiché directement.
  useEffect(() => {
    if (reducedMotion) {
      setPhase(3);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    setPhase(0);
    timers.push(window.setTimeout(() => !cancelled && setPhase(1), 500));
    timers.push(window.setTimeout(() => !cancelled && setPhase(2), 2000));
    timers.push(window.setTimeout(() => !cancelled && setPhase(3), 3400));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [modeId, reducedMotion, replayKey]);

  function selectMode(id: Mode) {
    setModeId(id);
    setReplayKey((k) => k + 1);
  }

  function replay() {
    setReplayKey((k) => k + 1);
  }

  const cellEtats = reducedMotion || phase >= 2 ? mode.cell : CLOSED3;
  const sugarCount = reducedMotion || phase >= 3 ? mode.sugar : TOTAL_TOKENS;
  const tone = bloodTone(sugarCount);
  // S8 (passe « moins de texte ») : la légende narrait chaque phase (l1/l2/l3) — réduite à la
  // ligne finale courte, le soignant commente le déroulé de l'animation à l'oral.
  const legendText = mode.l3;

  function keyPhase(i: number): KeyPhase {
    if (!mode.key[i]) return 'hidden';
    if (reducedMotion) return 'turned';
    if (phase === 0) return 'hidden';
    if (phase === 1) return 'flown';
    return phase === 2 ? 'turned' : 'gone';
  }

  return (
    <div className={styles.module}>
      <nav className={styles.modes} aria-label="Mécanisme à observer">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`${styles.modeBtn}${modeId === m.id ? ` ${styles.modeBtnActive}` : ''}`}
            aria-pressed={modeId === m.id}
            onClick={() => selectMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div className={`${styles.scene} card`}>
        <div className={styles.pancreasBlock}>
          <img src={`${BASE}pancreas.png`} alt="" aria-hidden="true" className={styles.pancreasImg} />
          <span className={styles.pancreasLabel}>Pancréas</span>
        </div>

        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.cell} style={{ left: `${CELL_LEFT_PCT[i]}%` }}>
            <img
              src={`${BASE}cell-closed.png`}
              alt=""
              aria-hidden="true"
              className={`${styles.cellImg}${cellEtats[i] === 'closed' ? ` ${styles.cellImgVisible}` : ''}`}
            />
            <img
              src={`${BASE}cell-open.png`}
              alt=""
              aria-hidden="true"
              className={`${styles.cellImg}${cellEtats[i] === 'open' ? ` ${styles.cellImgVisible}` : ''}`}
            />
            <img
              src={`${BASE}cell-rusty.png`}
              alt=""
              aria-hidden="true"
              className={`${styles.cellImg}${cellEtats[i] === 'rusty' ? ` ${styles.cellImgVisible}` : ''}`}
            />
          </div>
        ))}

        {[0, 1, 2].map((i) => {
          const kp = keyPhase(i);
          const atRest = kp === 'hidden';
          const left = atRest ? KEY_REST.left : KEY_TARGET_LEFT_PCT[i];
          const top = atRest ? KEY_REST.top : KEY_TARGET_TOP_PCT;
          const rotDeg = kp === 'flown' ? -8 : kp === 'hidden' ? 0 : 84;
          const opacity = kp === 'hidden' || kp === 'gone' ? 0 : 1;
          return (
            <img
              key={i}
              src={`${BASE}key.png`}
              alt=""
              aria-hidden="true"
              className={styles.key}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%, -50%) rotate(${rotDeg}deg)`,
                opacity,
              }}
            />
          );
        })}

        <div className={styles.canalWrap}>
          <div className={`${styles.canal} ${styles[`canal--${tone}`]}`}>
            {Array.from({ length: TOTAL_TOKENS }, (_, i) => (
              <img
                key={i}
                src={`${BASE}sugar.png`}
                alt=""
                aria-hidden="true"
                className={`${styles.sugarToken}${i >= sugarCount ? ` ${styles.sugarTokenHidden}` : ''}`}
              />
            ))}
          </div>
          <p className={`${styles.bloodLabel} ${styles[`bloodLabel--${tone}`]}`}>{mode.txt}</p>
        </div>
      </div>

      <div className={styles.caption} aria-live="polite">
        <span className={styles.captionEyebrow}>{mode.label}</span>
        <p className={styles.captionText}>{legendText}</p>
        {!reducedMotion && (
          <button type="button" className={`btn btn--ghost ${styles.replayBtn}`} onClick={replay}>
            Rejouer
          </button>
        )}
      </div>

      <ModuleFooterNav
        items={[{ id: 'alimentation', label: "Voir comment l'alimentation joue" }]}
        onNavigate={onNavigate}
      />
    </div>
  );
}
