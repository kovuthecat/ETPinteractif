import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ModuleProps } from '../types';
import styles from './AddictionModule.module.css';

type Pilier = 'physique' | 'psychologique' | 'comportementale';

interface PilierData {
  label: string;
  color: string;
  colorSoft: string;
  cx: number;
  cy: number;
  exemples: string[];
  outils: { text: string; navigation?: { id: 'nicotine' | 'substituts' | 'craving'; label: string } }[];
}

const VIEW_W = 600;
const VIEW_H = 460;
const R = 130;

const ORDER: Pilier[] = ['physique', 'psychologique', 'comportementale'];

const PILLARS_DATA: Record<Pilier, PilierData> = {
  physique: {
    label: 'Physique',
    color: 'var(--color-vigilance)',
    colorSoft: 'var(--color-vigilance-soft)',
    cx: 210,
    cy: 160,
    exemples: [
      'Manque',
      'Irritabilité',
      'Nervosité',
      'Troubles de la concentration',
      'Troubles du sommeil',
      'Fringales',
      'Craving',
    ],
    outils: [
      {
        text: 'Substituts adaptés pour combler le manque sans fumer.',
        navigation: { id: 'substituts', label: 'Voir les substituts' },
      },
      {
        text: 'Comprendre la cinétique de la nicotine et les seuils pour mieux anticiper.',
        navigation: { id: 'nicotine', label: 'Comprendre la nicotine' },
      },
    ],
  },
  psychologique: {
    label: 'Psychologique',
    color: 'var(--color-nav)',
    colorSoft: 'var(--color-nav-soft)',
    cx: 390,
    cy: 160,
    exemples: ['Stress', 'Anxiété', 'Ennui', 'Plaisir et récompense', 'Stimulation', '"Anti-déprime"'],
    outils: [
      {
        text: 'Gestion du stress et respiration pour apaiser sans fumer.',
      },
      {
        text: "Trouver des alternatives de plaisir et s'occuper l'esprit.",
        navigation: { id: 'craving', label: 'Techniques anti-craving' },
      },
    ],
  },
  comportementale: {
    label: 'Comportementale',
    color: 'var(--color-confort)',
    colorSoft: 'var(--color-confort-soft)',
    cx: 300,
    cy: 300,
    exemples: [
      'Café-clope',
      'Après les repas',
      'En pause',
      'En voiture',
      'Avec le téléphone',
      'En social',
      "Avec l'alcool",
    ],
    outils: [
      {
        text: 'Repérer les automatismes et les associations pour les rompre progressivement.',
      },
      {
        text: 'Modifier les routines et les contextes favorables à la cigarette.',
        navigation: { id: 'craving', label: 'Gérer le craving' },
      },
    ],
  },
};

function pillarVars(p: PilierData): CSSProperties {
  return { '--pillar-color': p.color, '--pillar-color-soft': p.colorSoft } as CSSProperties;
}

export default function AddictionModule({ onNavigate }: ModuleProps) {
  const [selected, setSelected] = useState<Pilier | null>(null);

  function toggle(pilier: Pilier) {
    setSelected((cur) => (cur === pilier ? null : pilier));
  }

  const renderOrder = selected ? [...ORDER.filter((p) => p !== selected), selected] : ORDER;
  const data = selected ? PILLARS_DATA[selected] : null;

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        L'addiction au tabac a trois dimensions imbriquées. Cliquez un cercle pour l'explorer.
      </p>

      <div className={`${styles.explorer} ${data ? styles.explorerActive : ''}`}>
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
                    <rect x={p.cx - 90} y={p.cy - 26} width={180} height={28} rx={6} className={styles.circleLabelBg} />
                    <text x={p.cx} y={p.cy - 6} textAnchor="middle" className={styles.circleLabel}>{p.label}</text>
                    {selected !== pilier && (
                      <text x={p.cx} y={p.cy + 16} textAnchor="middle" className={styles.circleKeywords}>
                        {p.exemples.slice(0, 2).join(' · ')}
                      </text>
                    )}
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
                  onClick={() => toggle(pilier)}
                />
              );
            })}
          </div>

          <div className={styles.legend}>
            {ORDER.map((pilier) => {
              const p = PILLARS_DATA[pilier];
              return (
                <span key={pilier} className={styles.legendItem} style={pillarVars(p)}>
                  <span className={styles.legendDot} aria-hidden="true" />
                  {p.label}
                </span>
              );
            })}
          </div>

          {!data && <p className={styles.emptyCaption}>Ces dimensions s'alimentent entre elles.</p>}
        </div>

        {data && (
          <aside className={`${styles.actionsPanel} card`} style={pillarVars(data)} aria-live="polite">
            <p className={styles.actionsTitle}>
              <span className={styles.actionsDot} aria-hidden="true" />
              Dimension {data.label}
            </p>
            <div>
              <p className={styles.sectionLabel}>Signes possibles</p>
              <ul className={styles.symptomList}>
                {data.exemples.map((exemple) => <li key={exemple}>{exemple}</li>)}
              </ul>
            </div>
            <p className={styles.sectionLabel}>Pistes à explorer</p>
            <div className={styles.actionsRow}>
              {data.outils.map((outil) => (
                <div key={outil.text} className={styles.actionCard}>
                  <p className={styles.actionText}>{outil.text}</p>
                  {outil.navigation && (
                    <button
                      type="button"
                      className={`btn btn--ghost ${styles.navBtn}`}
                      onClick={() => onNavigate(outil.navigation!.id)}
                    >
                      <span>{outil.navigation.label}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}