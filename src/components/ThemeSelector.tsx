import type { ThemeDef, ThemeId } from '../features/types';
import styles from './ThemeSelector.module.css';

interface ThemeSelectorProps {
  themes: ThemeDef[];
  onNavigate: (id: ThemeId) => void;
}

export default function ThemeSelector({ themes, onNavigate }: ThemeSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`eyebrow ${styles.eyebrow}`}>Programme ETP</span>
        <h1 className={styles.title}>Choisir un thème</h1>
      </div>
      <div className={styles.grid}>
        {themes.map((theme) => {
          const indisponible = theme.enConstruction || theme.modules.length === 0;
          return (
            <button
              key={theme.id}
              type="button"
              className={`card ${styles.card}`}
              disabled={indisponible}
              onClick={() => onNavigate(theme.id)}
            >
              <span className={styles.body}>
                <span className={styles.titre}>
                  {theme.titre}
                  {indisponible && <span className={`chip ${styles.badge}`}>Bientôt disponible</span>}
                </span>
                <span className={styles.description}>{theme.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
