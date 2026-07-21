import { useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { ModuleProps } from '../../types';
import { SITUATIONS } from '../../../content/tabac/situations';
import type { SelectionSituations } from '../../../content/tabac/situations';
import { useSelection } from '../../../state/SelectionContext';
import styles from './AddictionModule.module.css';

type Pilier = 'physique' | 'psychologique' | 'comportementale';

interface PilierData {
  label: string;
  color: string;
  colorSoft: string;
  cx: number;
  cy: number;
  /** Décalage du libellé par rapport au centre du cercle, pour rester hors des zones de chevauchement. */
  labelDx: number;
  labelDy: number;
  /** Secteur d'arc (degrés, 0 = droite, sens horaire) où déployer les situations, à l'écart des deux autres cercles. */
  arcStart: number;
  arcEnd: number;
}

const VIEW_W = 600;
const VIEW_H = 560;
const R = 130;
/** Rayon du menu radial des situations, légèrement au-delà du cercle. */
const ITEM_RADIUS = R + 100;

const ORDER: Pilier[] = ['physique', 'psychologique', 'comportementale'];

const PILLARS_DATA: Record<Pilier, PilierData> = {
  physique: {
    label: 'Physique',
    color: 'var(--color-vigilance)',
    colorSoft: 'var(--color-vigilance-soft)',
    cx: 210,
    cy: 160,
    labelDx: -34,
    labelDy: -17,
    arcStart: 120,
    arcEnd: 240,
  },
  psychologique: {
    label: 'Psychologique',
    color: 'var(--color-nav)',
    colorSoft: 'var(--color-nav-soft)',
    cx: 390,
    cy: 160,
    labelDx: 34,
    labelDy: -17,
    arcStart: -60,
    arcEnd: 60,
  },
  comportementale: {
    label: 'Comportementale',
    color: 'var(--color-confort)',
    colorSoft: 'var(--color-confort-soft)',
    cx: 300,
    cy: 300,
    labelDx: 0,
    labelDy: 25,
    arcStart: 30,
    arcEnd: 150,
  },
};

function pillarVars(p: PilierData): CSSProperties {
  return { '--pillar-color': p.color, '--pillar-color-soft': p.colorSoft } as CSSProperties;
}

/** RP4a : marge (en % de la dimension du conteneur) gardée libre sur les bords, pour que le
 *  centre d'une bulle ne pousse jamais son propre encombrement hors de `.vennWrap` — sans quoi
 *  les piliers dont le cercle est proche d'un bord (« physique » à gauche, « psychologique » à
 *  droite) débordent horizontalement (le pilier « comportementale », centré, n'y est pas exposé). */
const ITEM_MARGIN_X_PCT = 9;
const ITEM_MARGIN_Y_PCT = 6;

function clampPercent(value: number, total: number, marginPct: number): number {
  const pct = (value / total) * 100;
  return Math.min(100 - marginPct, Math.max(marginPct, pct));
}

/** Position (en % de `.vennWrap`) du n-ième item (sur `count`) réparti sur l'arc du pilier. */
function itemPosition(p: PilierData, index: number, count: number): CSSProperties {
  const t = count > 1 ? index / (count - 1) : 0.5;
  const angleDeg = p.arcStart + t * (p.arcEnd - p.arcStart);
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = p.cx + ITEM_RADIUS * Math.cos(angleRad);
  const y = p.cy + ITEM_RADIUS * Math.sin(angleRad);
  return {
    left: `${clampPercent(x, VIEW_W, ITEM_MARGIN_X_PCT)}%`,
    top: `${clampPercent(y, VIEW_H, ITEM_MARGIN_Y_PCT)}%`,
  };
}

export default function AddictionModule({ onNavigate }: ModuleProps) {
  const { state, toggle, add, remove } = useSelection();
  const selection = state.situations;
  const [selected, setSelected] = useState<Pilier | null>(null);
  // « + autre » (RP2b, revue-prod-2026-07/S2) : seule saisie de situation personnalisée
  // après retrait de la section 3 du plan d'arrêt — même canal `situationsLibres` que
  // l'ancien champ libre du plan, déjà lu par le livret (`livretSections.tsx`, bucket
  // « Autres »), donc aucune modification du reducer ni de `situations.ts`.
  const [libreInput, setLibreInput] = useState('');

  function togglePilier(pilier: Pilier) {
    setSelected((cur) => (cur === pilier ? null : pilier));
  }

  function toggleSituation(id: string) {
    toggle('situations', id);
  }

  // Commit partagé Entrée / blur (revue-prod-2026-07/S3, RP3b) : évite qu'une saisie
  // tapée mais non validée se perde si l'utilisateur navigue ailleurs sans Entrée. Un
  // Entrée vide déjà `libreInput` avant tout blur suivant ⇒ pas de doublon possible.
  function commitLibre() {
    const trimmed = libreInput.trim();
    if (trimmed) {
      add('situationsLibres', trimmed);
      setLibreInput('');
    }
  }

  function handleLibreKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    commitLibre();
  }

  function handleGoToOutils() {
    const context: SelectionSituations = { situations: [...selection] };
    onNavigate('boite-a-outils', context);
  }

  const renderOrder = selected ? [...ORDER.filter((p) => p !== selected), selected] : ORDER;
  const data = selected ? PILLARS_DATA[selected] : null;
  const items = selected ? SITUATIONS.filter((s) => s.pilier === selected) : [];

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Trois dimensions s'entremêlent. Touchez un cercle, puis les situations qui vous parlent.
      </p>

      <div className={`${styles.vennCard} card`}>
        <div className={styles.vennWrap}>
          <svg
            className={styles.venn}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            role="img"
            aria-label="Trois cercles qui se chevauchent : physique, psychologique et comportementale"
          >
            {renderOrder.map((pilier) => {
              const p = PILLARS_DATA[pilier];
              const isSelected = selected === pilier;
              return (
                <g
                  key={pilier}
                  className={isSelected ? styles.circleGroupActive : styles.circleGroup}
                  style={pillarVars(p)}
                >
                  <circle cx={p.cx} cy={p.cy} r={R} className={styles.circleShape} />
                  <text x={p.cx + p.labelDx} y={p.cy + p.labelDy} textAnchor="middle" className={styles.circleLabel}>
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {ORDER.map((pilier) => {
            const p = PILLARS_DATA[pilier];
            const isSelected = selected === pilier;
            return (
              <button
                key={pilier}
                type="button"
                className={styles.hitArea}
                style={{
                  left: `${(p.cx / VIEW_W) * 100}%`,
                  top: `${(p.cy / VIEW_H) * 100}%`,
                  width: `${((R * 2) / VIEW_W) * 100}%`,
                  height: `${((R * 2) / VIEW_H) * 100}%`,
                }}
                aria-pressed={isSelected}
                aria-label={`Dimension ${p.label}${isSelected ? ' (sélectionnée)' : ''}`}
                onClick={() => togglePilier(pilier)}
              />
            );
          })}

          {data &&
            items.map((s, i) => {
              const isChecked = selection.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.situationChip} ${isChecked ? styles.situationChipActive : ''}`}
                  style={{ ...itemPosition(data, i, items.length), ...pillarVars(data) }}
                  aria-pressed={isChecked}
                  onClick={() => toggleSituation(s.id)}
                >
                  {isChecked && <Check size={14} aria-hidden="true" className={styles.situationCheck} />}
                  <span>{s.label}</span>
                </button>
              );
            })}
        </div>

        {!data && <p className={styles.emptyCaption}>Ces dimensions s'alimentent entre elles.</p>}
      </div>

      <section className={`card ${styles.libreCard}`}>
        <p className={styles.libreLabel}>Une situation qui n'est pas ici ?</p>
        <div className={styles.chipRow}>
          {state.situationsLibres.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${styles.libreChip} activeDoubled`}
              aria-label={`${item} — touchez pour retirer`}
              onClick={() => remove('situationsLibres', item)}
            >
              {item}
            </button>
          ))}
          <input
            type="text"
            className={styles.libreInput}
            value={libreInput}
            onChange={(event) => setLibreInput(event.target.value)}
            onKeyDown={handleLibreKeyDown}
            onBlur={commitLibre}
            placeholder="+ autre"
            aria-label="Ajouter une situation personnalisée"
          />
        </div>
      </section>

      <div className={styles.ctaBar}>
        {selection.length > 0 ? (
          <button type="button" className="btn btn--primary" onClick={handleGoToOutils}>
            <span>Stratégies et outils ({selection.length})</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <p className={styles.ctaHint}>
            Sélectionnez les situations qui vous parlent — on y associera des outils.
          </p>
        )}
      </div>

      <p className="filrouge">
        C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se traite.
      </p>
    </div>
  );
}