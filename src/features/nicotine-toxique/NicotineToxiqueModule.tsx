import { useState } from 'react';
import type { ModuleProps } from '../types';
import styles from './NicotineToxiqueModule.module.css';

type ToggleMode = 'dependence' | 'health';

const ITEMS = {
  smoke: [
    { substance: 'Goudrons', role: 'Adhèrent aux poumons et causent des cancers' },
    { substance: 'Monoxyde de carbone (CO)', role: 'Asphyxiant, endommage le cœur et les artères' },
    { substance: 'Particules fines', role: 'Pénètrent les voies respiratoires, causent inflammations chroniques' },
    { substance: '~7000 substances chimiques', role: 'Présentes dans la fumée' },
    { substance: '~70 cancérogènes connus', role: 'Augmentent le risque de cancers multiples' },
  ],
  nicotine: [
    { substance: 'Nicotine', role: 'Responsable de la dépendance physique et psychologique' },
  ],
};

interface ItemDetail {
  substance: string;
  role: string;
}

export default function NicotineToxiqueModule({ onNavigate }: ModuleProps) {
  const [toggleMode, setToggleMode] = useState<ToggleMode>('health');
  const [selectedItem, setSelectedItem] = useState<ItemDetail | null>(null);

  const isHighlighting = toggleMode === 'health' ? 'smoke' : 'nicotine';

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        La fumée contient de nombreuses substances dangereuses. Mais ce qui crée la dépendance, c'est la nicotine.
      </p>

      <div className={styles.toggleContainer}>
        <span className={styles.toggleLabel}>Mettre en évidence :</span>
        <div className={styles.toggleButtons}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${toggleMode === 'health' ? styles.toggleBtnActive : ''}`}
            onClick={() => {
              setToggleMode('health');
              setSelectedItem(null);
            }}
          >
            Ce qui rend malade
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${toggleMode === 'dependence' ? styles.toggleBtnActive : ''}`}
            onClick={() => {
              setToggleMode('dependence');
              setSelectedItem(null);
            }}
          >
            Ce qui crée la dépendance
          </button>
        </div>
      </div>

      <div className={styles.columns}>
        <div className={`${styles.column} ${isHighlighting === 'smoke' ? styles.columnHighlighted : ''}`}>
          <h3 className={styles.columnTitle}>La fumée (combustion)</h3>
          <div className={styles.itemsList}>
            {ITEMS.smoke.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.item}
                onClick={() => setSelectedItem(item)}
              >
                {item.substance}
              </button>
            ))}
          </div>
        </div>

        <div className={`${styles.column} ${isHighlighting === 'nicotine' ? styles.columnHighlighted : ''}`}>
          <h3 className={styles.columnTitle}>La dépendance</h3>
          <div className={styles.itemsList}>
            {ITEMS.nicotine.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.item}
                onClick={() => setSelectedItem(item)}
              >
                {item.substance}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className={styles.detail}>
          <div className={styles.detailContent}>
            <p className={styles.detailTitle}>{selectedItem.substance}</p>
            <p className={styles.detailRole}>{selectedItem.role}</p>
          </div>
          <button
            type="button"
            className={styles.detailClose}
            onClick={() => setSelectedItem(null)}
            aria-label="Fermer le détail"
          >
            ✕
          </button>
        </div>
      )}

      <div className={styles.navigation}>
        <p className={styles.navigationLabel}>Aller plus loin :</p>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onNavigate('substituts')}
        >
          Les substituts & vapoteuse
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onNavigate('nicotine')}
        >
          Comprendre la nicotine
        </button>
      </div>
    </div>
  );
}
