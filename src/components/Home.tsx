import { MODULES } from '../features/registry';
import type { ModuleId, FamilleId } from '../features/types';
import ModuleCard, { type Hue } from './ModuleCard';
import styles from './Home.module.css';

interface HomeProps {
  onNavigate: (id: ModuleId) => void;
}

const FAMILLES: { id: FamilleId; label: string }[] = [
  { id: 'comprendre', label: 'Comprendre' },
  { id: 'agir', label: 'Agir' },
  { id: 'motivation', label: 'Se motiver' },
];

const HUES: Record<ModuleId, Hue> = {
  addiction: 'confort',
  nicotine: 'nav',
  'nicotine-toxique': 'vigilance',
  soulagement: 'toxique',
  substituts: 'confort',
  craving: 'vigilance',
  motivation: 'nav',
};

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`eyebrow ${styles.eyebrow}`}>Programme ETP · Sevrage tabagique</span>
        <h1 className={styles.title}>Votre accompagnement</h1>
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
                  hue={HUES[m.id]}
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
