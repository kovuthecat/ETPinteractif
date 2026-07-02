import { MODULES } from '../features/registry';
import type { ModuleId, FamilleId } from '../features/types';
import ModuleCard from './ModuleCard';
import styles from './Home.module.css';

interface HomeProps {
  onNavigate: (id: ModuleId) => void;
}

const FAMILLES: { id: FamilleId; label: string }[] = [
  { id: 'comprendre', label: 'Comprendre' },
  { id: 'agir', label: 'Agir' },
  { id: 'motivation', label: 'Se motiver' },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sevrage tabagique</h1>
        <p className={styles.accroche}>Que voulez-vous explorer ?</p>
      </div>
      {FAMILLES.map(({ id: familleId, label }) => {
        const modules = MODULES.filter((m) => m.famille === familleId);
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
