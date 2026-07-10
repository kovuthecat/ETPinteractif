import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { ModuleProps } from '../../types';
import { SITUATIONS } from '../situations';
import type { SelectionSituations } from '../situations';
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
const VIEW_H = 460;
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

/** Position (en % de `.vennWrap`) du n-ième item (sur `count`) réparti sur l'arc du pilier. */
function itemPosition(p: PilierData, index: number, count: number): CSSProperties {
  const t = count > 1 ? index / (count - 1) : 0.5;
  const angleDeg = p.arcStart + t * (p.arcEnd - p.arcStart);
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = p.cx + ITEM_RADIUS * Math.cos(angleRad);
  const y = p.cy + ITEM_RADIUS * Math.sin(angleRad);
  return { left: `${(x / VIEW_W) * 100}%`, top: `${(y / VIEW_H) * 100}%` };
}

export default function AddictionModule({ onNavigate }: ModuleProps) {
  const [selected, setSelected] = useState<Pilier | null>(null);
  const [selection, setSelection] = useState<Set<string>>(new Set());

  function togglePilier(pilier: Pilier) {
    setSelected((cur) => (cur === pilier ? null : pilier));
  }

  function toggleSituation(id: string) {
    setSelection((cur) => {
      const next = new Set(cur);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function countSelected(pilier: Pilier): number {
    let n = 0;
    for (const s of SITUATIONS) {
      if (s.pilier === pilier && selection.has(s.id)) n += 1;
    }
    return n;
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
              const isChecked = selection.has(s.id);
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

        <div className={styles.legend}>
          {ORDER.map((pilier) => {
            const p = PILLARS_DATA[pilier];
            const n = countSelected(pilier);
            return (
              <span key={pilier} className={styles.legendItem} style={pillarVars(p)}>
                <span className={styles.legendDot} aria-hidden="true" />
                {p.label}
                {n > 0 && <span className={styles.legendBadge}>· {n}</span>}
              </span>
            );
          })}
        </div>

        {!data && <p className={styles.emptyCaption}>Ces dimensions s'alimentent entre elles.</p>}
      </div>

      <div className={styles.ctaBar}>
        {selection.size > 0 ? (
          <button type="button" className="btn btn--primary" onClick={handleGoToOutils}>
            <span>Stratégies et outils ({selection.size})</span>
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