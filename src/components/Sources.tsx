import { useState } from 'react';
import { Info } from 'lucide-react';
import styles from './Sources.module.css';

interface SourcesProps {
  items?: string[];
}

export default function Sources({ items }: SourcesProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Sources"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Info size={18} aria-hidden="true" />
        <span className={styles.label}>Sources</span>
      </button>
      {open && (
        <div className={styles.popover} role="dialog">
          {items && items.length > 0 ? (
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.placeholder}>Sources : à compléter</p>
          )}
        </div>
      )}
    </div>
  );
}
