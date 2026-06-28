import { useState } from 'react';
import type { ModuleProps } from '../types';
import styles from './AddictionModule.module.css';

type Pilier = 'physique' | 'psychologique' | 'comportementale';
type TabType = 'exemples' | 'outils';

const PILLARS_DATA: Record<
  Pilier,
  {
    label: string;
    exemples: string[];
    outils: { text: string; navigation?: { id: 'nicotine' | 'substituts' | 'craving'; label: string } }[];
  }
> = {
  physique: {
    label: 'Physique (nicotinique)',
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
    exemples: [
      'Stress',
      'Anxiété',
      'Ennui',
      'Plaisir et récompense',
      'Stimulation',
      '"Anti-déprime"',
    ],
    outils: [
      {
        text: 'Gestion du stress et respiration pour apaiser sans fumer.',
      },
      {
        text: 'Trouver des alternatives de plaisir et s\'occuper l\'esprit.',
        navigation: { id: 'craving', label: 'Techniques anti-craving' },
      },
    ],
  },
  comportementale: {
    label: 'Comportementale',
    exemples: [
      'Café-clope',
      'Après les repas',
      'En pause',
      'En voiture',
      'Avec le téléphone',
      'En social',
      'Avec l\'alcool',
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

export default function AddictionModule({ onNavigate }: ModuleProps) {
  const [selectedPillar, setSelectedPillar] = useState<Pilier | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('exemples');

  const pillarData = selectedPillar ? PILLARS_DATA[selectedPillar] : null;

  return (
    <div className={styles.module}>
      <div className={styles.pillars}>
        {(Object.keys(PILLARS_DATA) as Pilier[]).map((pilier) => (
          <button
            key={pilier}
            type="button"
            className={`${styles.pillarBtn} ${selectedPillar === pilier ? styles.pillarBtnActive : ''}`}
            onClick={() => {
              setSelectedPillar(pilier);
              setSelectedTab('exemples');
            }}
            aria-pressed={selectedPillar === pilier}
          >
            {PILLARS_DATA[pilier].label}
          </button>
        ))}
      </div>

      {pillarData && (
        <div className={styles.content}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${selectedTab === 'exemples' ? styles.tabActive : ''}`}
              onClick={() => setSelectedTab('exemples')}
              aria-selected={selectedTab === 'exemples'}
            >
              De quoi parle-t-on ?
            </button>
            <button
              type="button"
              className={`${styles.tab} ${selectedTab === 'outils' ? styles.tabActive : ''}`}
              onClick={() => setSelectedTab('outils')}
              aria-selected={selectedTab === 'outils'}
            >
              Outils & stratégies
            </button>
          </div>

          <div className={styles.tabContent}>
            {selectedTab === 'exemples' && (
              <div className={styles.exemples}>
                <ul className={styles.exemplesList}>
                  {pillarData.exemples.map((exemple, idx) => (
                    <li key={idx}>{exemple}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'outils' && (
              <div className={styles.outils}>
                {pillarData.outils.map((outil, idx) => (
                  <div key={idx} className={styles.outilItem}>
                    <p className={styles.outilText}>{outil.text}</p>
                    {outil.navigation && (
                      <button
                        type="button"
                        className={styles.navBtn}
                        onClick={() => onNavigate(outil.navigation!.id)}
                      >
                        {outil.navigation.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
