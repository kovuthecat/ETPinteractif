import type { LucideIcon } from 'lucide-react';
import styles from './ModuleCard.module.css';

interface ModuleCardProps {
  titre: string;
  resume: string;
  Icon: LucideIcon;
  onClick: () => void;
}

export default function ModuleCard({ titre, resume, Icon, onClick }: ModuleCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <Icon className={styles.icon} size={40} strokeWidth={1.5} />
      <span className={styles.titre}>{titre}</span>
      <span className={styles.resume}>{resume}</span>
    </button>
  );
}
