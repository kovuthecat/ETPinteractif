import { MODULES } from '../features/registry';
import type { ModuleId } from '../features/types';
import ModuleCard from './ModuleCard';
import styles from './Home.module.css';

interface HomeProps {
  onNavigate: (id: ModuleId) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sevrage tabagique</h1>
        <p className={styles.accroche}>Que voulez-vous explorer ?</p>
      </div>
      <div className={styles.grid}>
        {MODULES.map((m) => (
          <ModuleCard
            key={m.id}
            titre={m.titre}
            resume={m.resume}
            Icon={m.Icon}
            onClick={() => onNavigate(m.id)}
          />
        ))}
      </div>
    </div>
  );
}
