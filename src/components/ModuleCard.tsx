import type { LucideIcon } from 'lucide-react';
import styles from './ModuleCard.module.css';

export type Hue = 'nav' | 'confort' | 'vigilance' | 'toxique';

interface ModuleCardProps {
  titre: string;
  resume: string;
  Icon: LucideIcon;
  hue?: Hue;
  onClick: () => void;
}

export default function ModuleCard({ titre, resume, Icon, hue = 'nav', onClick }: ModuleCardProps) {
  return (
    <button type="button" className={`card ${styles.card}`} onClick={onClick}>
      <span className={`${styles.pastille} ${styles[`pastille--${hue}`]}`} aria-hidden="true">
        <Icon size={19} strokeWidth={2} />
      </span>
      <span className={styles.body}>
        <span className={styles.titre}>{titre}</span>
        <span className={styles.resume}>{resume}</span>
      </span>
    </button>
  );
}
