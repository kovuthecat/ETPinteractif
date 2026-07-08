import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Sources from './Sources';
import styles from './ModuleShell.module.css';

interface ModuleShellProps {
  titre: string;
  sources?: string[];
  onBack: () => void;
  children: ReactNode;
}

export default function ModuleShell({ titre, sources, onBack, children }: ModuleShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          Accueil
        </button>
        <h1 className={styles.titre}>{titre}</h1>
        <Sources items={sources} />
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
