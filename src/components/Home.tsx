import { ArrowLeft } from 'lucide-react';
import type { ModuleId, ThemeDef } from '../features/types';
import ModuleCard from './ModuleCard';
import styles from './Home.module.css';

interface HomeProps {
  theme: ThemeDef;
  onNavigate: (id: ModuleId) => void;
  /** Absent s'il n'y a pas de sélecteur de thème à rejoindre. */
  onChangeTheme?: () => void;
}

export default function Home({ theme, onNavigate, onChangeTheme }: HomeProps) {
  return (
    <div className={styles.container}>
      {onChangeTheme && (
        <button type="button" className={styles.changeTheme} onClick={onChangeTheme}>
          <ArrowLeft size={16} aria-hidden="true" />
          Changer de thème
        </button>
      )}
      <div className={styles.header}>
        <span className={`eyebrow ${styles.eyebrow}`}>{theme.eyebrow}</span>
        <h1 className={styles.title}>Votre accompagnement</h1>
        {theme.exergue && <p className={styles.exergue}>{theme.exergue}</p>}
      </div>
      {theme.familles.map(({ id: familleId, label }) => {
        const modules = theme.modules.filter((m) => m.famille === familleId);
        if (modules.length === 0) return null;
        return (
          <section key={familleId} className={styles.famille}>
            <h2 className={styles.familleLabel}>{label}</h2>
            <div className={styles.grid}>
              {modules.map((m) => (
                <ModuleCard
                  key={m.id}
                  titre={m.titre}
                  resume={m.resume}
                  Icon={m.Icon}
                  hue={m.hue}
                  onClick={() => onNavigate(m.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
