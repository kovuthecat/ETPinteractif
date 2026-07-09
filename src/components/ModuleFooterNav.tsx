import { ArrowRight } from 'lucide-react';
import styles from './ModuleFooterNav.module.css';

interface ModuleFooterNavItem {
  id: string;
  label: string;
}

interface ModuleFooterNavProps {
  titre?: string;
  items: ModuleFooterNavItem[];
  onNavigate: (id: string) => void;
}

/**
 * Bloc générique « Continuer l'exploration » en pied de module : titre court +
 * boutons de porte vers d'autres modules. Extrait de nicotine-toxique (X6),
 * toujours optionnel, jamais un enchaînement forcé. Composant agnostique du
 * thème : les libellés/ids viennent de l'appelant.
 */
export default function ModuleFooterNav({
  titre = "Continuer l'exploration",
  items,
  onNavigate,
}: ModuleFooterNavProps) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.navigation} aria-label="Aller plus loin">
      <span>{titre}</span>
      {items.map((item) => (
        <button key={item.id} type="button" onClick={() => onNavigate(item.id)}>
          {item.label} <ArrowRight aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
