import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Sources from './Sources';
import styles from './ModuleShell.module.css';

interface ModuleShellProps {
  titre: string;
  sources?: string[];
  onBack: () => void;
  children: ReactNode;
  /** Slot générique (aucun thème par son nom) : rendu à droite du titre, sur la même ligne
   *  quand la place le permet, sinon replié dessous. Absent par défaut (comportement inchangé). */
  nav?: ReactNode;
  /** Élargit `.header` et `.content` (générique). Absent par défaut : largeur inchangée. */
  wide?: boolean;
}

export default function ModuleShell({ titre, sources, onBack, children, nav, wide }: ModuleShellProps) {
  return (
    <div className={styles.shell}>
      <header className={`${styles.header}${wide ? ` ${styles.headerWide}` : ''}`}>
        <button type="button" className={styles.back} onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          Accueil
        </button>
        <div className={styles.titleRow}>
          <h1 className={styles.titre}>{titre}</h1>
          {nav && <div className={styles.nav}>{nav}</div>}
        </div>
        <Sources items={sources} />
      </header>
      <div className={`${styles.content}${wide ? ` ${styles.contentWide}` : ''}`}>{children}</div>
    </div>
  );
}
