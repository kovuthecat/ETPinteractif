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

// Secteur d'arc (degrés, 0°=droite, 90°=bas) choisi pour s'éloigner des deux autres cercles.
const SECTORS: Record<Pilier, [number, number]> = {
  physique: [120, 240],
  psychologique: [-60, 60],
  comportementale: [30, 150],
};

const BUBBLE_R = R + 60;

function bubblePosition(p: PilierData, sector: [number, number], index: number, total: number) {
  const t = total <= 1 ? 0.5 : index / (total - 1);
  const angleDeg = sector[0] + t * (sector[1] - sector[0]);
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = p.cx + BUBBLE_R * Math.cos(angleRad);
  const y = p.cy + BUBBLE_R * Math.sin(angleRad);
  return { left: (x / VIEW_W) * 100, top: (y / VIEW_H) * 100 };
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

      {data && (
        <p className={styles.exploreTitle} style={pillarVars(data)}>
          De quoi parle-t-on ? — {data.label}
        </p>
      )}

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
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={isSelected ? R * 1.06 : R}
                  className={styles.circleShape}
                />
                {/* Halo de fond derrière le libellé pour éviter le chevauchement illisible */}
                <rect
                  x={p.cx - 90}
                  y={p.cy - 26}
                  width={180}
                  height={28}
                  rx={6}
                  className={styles.circleLabelBg}
                />
                <text x={p.cx} y={p.cy - 6} textAnchor="middle" className={styles.circleLabel}>
                  {p.label}
                </text>
                {selected !== pilier && (
                  <text x={p.cx} y={p.cy + 16} textAnchor="middle" className={styles.circleKeywords}>
                    {p.exemples.slice(0, 2).join(' · ')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <p className={styles.centerCaption}>Ces dimensions s'alimentent entre elles</p>

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

        {selected &&
          data &&
          data.exemples.map((exemple, index) => {
            const { left, top } = bubblePosition(data, SECTORS[selected], index, data.exemples.length);
            return (
              <span
                key={exemple}
                className={styles.radialBubble}
                style={{ left: `${left}%`, top: `${top}%`, ...pillarVars(data) }}
              >
                {exemple}
              </span>
            );
          })}
      </div>

      {data && (
        <div className={styles.legendePanel} style={pillarVars(data)}>
          <div className={styles.legendeRow}>
            <span className={styles.legendeDot} aria-hidden="true" />
            <span className={styles.legendeNom}>{data.label}</span>
            <span className={styles.legendeSep} aria-hidden="true">→</span>
            <span className={styles.legendeLabel}>Symptômes :</span>
            <span className={styles.legendeItems}>{data.exemples.join(' · ')}</span>
          </div>
          <div className={styles.legendeRow}>
            <span className={styles.legendeLabel}>Stratégies :</span>
            <span className={styles.legendeItems}>{data.outils.map((o) => o.text).join(' · ')}</span>
          </div>
        </div>
      )}

      {data && (
        <div className={styles.actionsPanel} style={pillarVars(data)}>
          <p className={styles.actionsTitle}>
            <span className={styles.actionsDot} aria-hidden="true" />
            Outils &amp; stratégies — {data.label}
          </p>
          <div className={styles.actionsRow}>
            {data.outils.map((outil, idx) => (
              <div key={idx} className={styles.actionCard}>
                <p className={styles.actionText}>{outil.text}</p>
                {outil.navigation && (
                  <button
                    type="button"
                    className={styles.navBtn}
                    onClick={() => onNavigate(outil.navigation!.id)}
                  >
                    <span>{outil.navigation.label}</span>
                    <span className={styles.navHint}>
                      <ArrowRight size={14} aria-hidden="true" />
                      autre module
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
