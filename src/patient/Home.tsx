import { Pill, Compass } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';
import styles from './Home.module.css';

type PatientView = 'substituts' | 'situations';

interface HomeProps {
  onNavigate: (view: PatientView) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className="eyebrow">Mon accompagnement</span>
        <h1 className={styles.title}>Mon aide à l'arrêt</h1>
        {/* à revalider (Thibault) : phrase de cadrage auto-portante (patient seul, pas de soignant présent) */}
        <p className={styles.exergue}>
          Retrouvez ici, à votre rythme, de quoi vous accompagner entre deux consultations.
        </p>
      </div>
      <div className={styles.grid}>
        <ModuleCard
          titre="Mes substituts"
          // à revalider (Thibault) : reformulation voix patient du contenu substituts
          resume="Comment bien utiliser vos patchs, gommes ou pastilles au quotidien."
          Icon={Pill}
          hue="confort"
          onClick={() => onNavigate('substituts')}
        />
        <ModuleCard
          titre="Agir face à une situation"
          // à revalider (Thibault) : reformulation voix patient du contenu boîte à outils
          resume="Une envie, un coup dur : trouvez la stratégie adaptée au moment présent."
          Icon={Compass}
          hue="nav"
          onClick={() => onNavigate('situations')}
        />
      </div>
    </div>
  );
}
