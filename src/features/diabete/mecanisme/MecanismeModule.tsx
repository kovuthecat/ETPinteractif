import { useMemo, useState } from 'react';
import type { ModuleProps } from '../../types';
import styles from './MecanismeModule.module.css';

/**
 * MODULE 1 — « C'EST QUOI LE DIABÈTE ? » (plans/theme-diabete/S4.md, D4).
 *
 * Modèle mental fondateur clé/serrure, en 4 temps pilotés par le soignant (le patient ne
 * manipule pas) : sujet sain → pas assez de clés → serrures rouillées → conclusion
 * déculpabilisante. Machine d'état linéaire (next/prev bornés 1..4 + Recommencer), portée
 * verbatim de la maquette `Module 1 - Cest quoi le diabete.dc.html` (`getRawCells`,
 * `styleCell`, `getCaption`).
 *
 * Point pédagogique n°1 (S4.md « Décision clé ») : les temps 2 (pas assez de clés) et 3
 * (serrures rouillées) sont deux mécanismes distincts mais doivent produire EXACTEMENT le
 * même état visuel du vaisseau (le sucre stagne, quelle que soit la cause). Le calcul brut de
 * la maquette donnait un nombre de jetons légèrement différent entre ces deux temps (9 vs 11,
 * cellule 0 restant « ouverte » au temps 2) ; `getVesselTokens` ci-dessous force donc la même
 * référence (5 cellules « fermées ») pour les temps 2 et 3 — seule cette valeur diverge de la
 * maquette, tout le reste (configurations de cellules, captions) est repris verbatim.
 */

type Temps = 1 | 2 | 3 | 4;
type CelluleEtat = 'ouverte' | 'rouillee' | 'fermee';

interface RawCell {
  id: number;
  open: boolean;
  hasKey: boolean;
  rusted: boolean;
}

interface StyledCell extends RawCell {
  etat: CelluleEtat;
  shackleD: string;
  keyShown: boolean;
  keyOpacity: number;
  keyOffsetY: number;
}

interface Caption {
  eyebrow: string;
  text: string;
}

interface VesselToken {
  id: number;
  opacity: number;
}

// Formes du cadenas (verbatim maquette) : arceau relevé (déverrouillé) / à ras (verrouillé).
const SHACKLE_FLUSH = 'M7 12 V8 A5 5 0 0 1 17 8 V12';
const SHACKLE_RAISED = 'M7 9 V6 A5 5 0 0 1 17 6 V9';

const TEMPS_LIST: Temps[] = [1, 2, 3, 4];

// Les 4 configurations de cellules — verbatim `getRawCells` de la maquette.
function getRawCells(temps: Temps): RawCell[] {
  const ids = [0, 1, 2, 3, 4];
  if (temps === 1) {
    return ids.map((i) => ({ id: i, open: true, hasKey: true, rusted: false }));
  }
  if (temps === 2) {
    return ids.map((i) => ({ id: i, open: i === 0, hasKey: i === 0, rusted: false }));
  }
  if (temps === 3) {
    return ids.map((i) => ({ id: i, open: false, hasKey: true, rusted: true }));
  }
  // temps === 4
  return ids.map((i) => {
    if (i < 2) return { id: i, open: false, hasKey: false, rusted: false };
    if (i < 4) return { id: i, open: false, hasKey: true, rusted: true };
    return { id: i, open: true, hasKey: true, rusted: false };
  });
}

// Habillage visuel d'une cellule — verbatim `styleCell` de la maquette (3 états).
function styleCell(cell: RawCell): StyledCell {
  if (cell.open) {
    return {
      ...cell,
      etat: 'ouverte',
      shackleD: SHACKLE_RAISED,
      keyShown: true,
      keyOpacity: 1,
      keyOffsetY: 4,
    };
  }
  if (cell.rusted) {
    return {
      ...cell,
      etat: 'rouillee',
      shackleD: SHACKLE_FLUSH,
      keyShown: true,
      keyOpacity: 0.9,
      keyOffsetY: -32,
    };
  }
  return {
    ...cell,
    etat: 'fermee',
    shackleD: SHACKLE_FLUSH,
    keyShown: cell.hasKey,
    keyOpacity: 0.9,
    keyOffsetY: -32,
  };
}

// Les 4 captions — verbatim `getCaption` de la maquette.
const CAPTIONS: Record<Temps, Caption> = {
  1: {
    eyebrow: '1 · Chez une personne sans diabète',
    text: 'L’insuline (les clés) ouvre les cellules : le sucre entre, le sang se vide.',
  },
  2: {
    eyebrow: '2 · Pas assez de clés',
    text: 'Le pancréas fatigué fabrique moins de clés : le sucre reste dans le sang.',
  },
  3: {
    eyebrow: '3 · Les serrures résistent',
    text: 'Les clés sont là, mais les serrures résistent : le sucre reste aussi dans le sang.',
  },
  4: {
    eyebrow: '4 · Souvent, un peu des deux',
    text: 'Bien manger et bouger aident la clé et soulagent le pancréas.',
  },
};

// Jetons de sucre du vaisseau — cf. commentaire d'en-tête (point pédagogique n°1).
function getVesselTokens(temps: Temps, cells: StyledCell[]): VesselToken[] {
  if (temps === 1) {
    return [0.85, 0.5, 0.22].map((opacity, id) => ({ id, opacity }));
  }
  const closedCount =
    temps === 2 || temps === 3 ? 5 : cells.filter((cell) => !cell.open).length;
  const tokenCount = Math.max(2, closedCount * 2 + 1);
  return Array.from({ length: tokenCount }, (_, id) => ({ id, opacity: 0.92 }));
}

interface SugarTokenProps {
  opacity: number;
  tone: 'confort' | 'vigilance';
}

/** Jeton de sucre (cube isométrique), réutilisé à l'identique dans les cellules et le vaisseau. */
function SugarToken({ opacity, tone }: SugarTokenProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 26 26"
      className={`${styles.token} ${styles[`token--${tone}`]}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <polygon points="13,2 24,8 13,14 2,8" className={styles.tokenFaceTop} />
      <polygon points="2,8 13,14 13,24 2,18" className={styles.tokenFaceLeft} />
      <polygon points="24,8 13,14 13,24 24,18" className={styles.tokenFaceRight} />
    </svg>
  );
}

interface CelluleProps {
  cell: StyledCell;
}

function Cellule({ cell }: CelluleProps) {
  return (
    <div className={styles.celluleWrap}>
      <div className={`${styles.cellule} ${styles[`cellule--${cell.etat}`]}`}>
        <div className={styles.lockSlot}>
          {cell.keyShown && (
            <div
              className={styles.key}
              style={{ transform: `translate(-50%, ${cell.keyOffsetY}px)`, opacity: cell.keyOpacity }}
            >
              <span className={styles.keyBow} />
              <span className={styles.keyShaft} />
            </div>
          )}
          <svg className={styles.lock} width="28" height="32" viewBox="0 0 24 28" aria-hidden="true">
            <path
              d={cell.shackleD}
              className={`${styles.shackle} ${styles[`shackle--${cell.etat}`]}`}
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x="4"
              y="12"
              width="16"
              height="13"
              rx="3"
              className={`${styles.lockBody} ${styles[`lockBody--${cell.etat}`]}`}
            />
            {cell.etat === 'rouillee' && (
              <>
                <line x1="7" y1="15" x2="10" y2="22" className={styles.rustMark} />
                <line x1="14" y1="15" x2="17" y2="22" className={styles.rustMark} />
              </>
            )}
            {cell.etat === 'fermee' && <circle cx="12" cy="18.5" r="1.8" className={styles.keyhole} />}
          </svg>
        </div>
        {cell.etat === 'ouverte' && (
          <div className={styles.cellTokens}>
            <SugarToken opacity={1} tone="confort" />
            <SugarToken opacity={1} tone="confort" />
          </div>
        )}
      </div>
      <div className={styles.stem} aria-hidden="true" />
    </div>
  );
}

export default function MecanismeModule({ onNavigate }: ModuleProps) {
  const [temps, setTemps] = useState<Temps>(1);

  const cells = useMemo(() => getRawCells(temps).map(styleCell), [temps]);
  const vesselTokens = useMemo(() => getVesselTokens(temps, cells), [temps, cells]);
  const caption = CAPTIONS[temps];
  const pancreasDim = temps === 2 || temps === 4;

  function next() {
    setTemps((t) => (t >= 4 ? 4 : ((t + 1) as Temps)));
  }
  function prev() {
    setTemps((t) => (t <= 1 ? 1 : ((t - 1) as Temps)));
  }
  function restart() {
    setTemps(1);
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Le soignant fait avancer la séquence en 4 temps : la clé (l’insuline) ouvre — ou non — la
        serrure de chaque cellule.
      </p>

      <div className={styles.dots} role="img" aria-label={`Étape ${temps} sur 4`}>
        {TEMPS_LIST.map((n) => (
          <span key={n} className={`${styles.dot} ${n <= temps ? styles.dotFilled : ''}`} />
        ))}
      </div>

      <div className={styles.scene}>
        <div className={styles.pancreasBlock}>
          <div className={`${styles.pancreas} ${pancreasDim ? styles.pancreasDim : ''}`} />
          <span className={styles.pancreasLabel}>Pancréas</span>
        </div>

        <span className={styles.arrow} aria-hidden="true">
          ›
        </span>

        <div className={styles.cellsAndVessel}>
          <div className={styles.cellsRow}>
            {cells.map((cell) => (
              <Cellule key={cell.id} cell={cell} />
            ))}
          </div>

          <div className={styles.vesselOuter}>
            <div className={styles.vesselInner}>
              {vesselTokens.map((token) => (
                <SugarToken key={token.id} opacity={token.opacity} tone="vigilance" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.caption} aria-live="polite">
        <span className={styles.captionEyebrow}>{caption.eyebrow}</span>
        <p className={styles.captionText}>{caption.text}</p>
      </div>

      <div className={styles.navRow}>
        {temps > 1 ? (
          <button type="button" className={styles.navBtnGhost} onClick={prev}>
            ‹ Précédent
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        {temps < 4 ? (
          <button type="button" className={styles.navBtnPrimary} onClick={next}>
            Suivant ›
          </button>
        ) : (
          <div className={styles.finalActions}>
            <button type="button" className={styles.navBtnTertiary} onClick={restart}>
              Recommencer
            </button>
            <button
              type="button"
              className={styles.transitionBtn}
              onClick={() => onNavigate('alimentation')}
            >
              Continuer vers Alimentation ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
