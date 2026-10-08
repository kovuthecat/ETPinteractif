import { useState } from 'react';
import { Pill, Compass, NotebookPen, Trash2 } from 'lucide-react';
import { effacerDonneesPatient } from './lib/storage';
import ModuleCard from '../components/ModuleCard';
import styles from './Home.module.css';

type PatientView = 'substituts' | 'situations' | 'carnet';

interface HomeProps {
  onNavigate: (view: PatientView) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [confirmation, setConfirmation] = useState(false);
  const [efface, setEfface] = useState(false);

  function toutEffacer() {
    effacerDonneesPatient();
    setConfirmation(false);
    setEfface(true);
  }

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
        <ModuleCard
          titre="Mon carnet de suivi"
          // à revalider (Thibault) : reformulation voix patient
          resume="Notez chaque consommation pour repérer vos moments à risque."
          Icon={NotebookPen}
          hue="vigilance"
          onClick={() => onNavigate('carnet')}
        />
      </div>

      <div className={styles.effacement}>
        {confirmation ? (
          <div className={styles.confirmRow} role="group" aria-label="Confirmer l'effacement">
            <span className={styles.confirmText}>
              Effacer tout le contenu enregistré sur cet appareil (carnet, outils, récompense) ? Cela ne peut pas être annulé.
            </span>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmation(false)}>
              Annuler
            </button>
            <button type="button" className={`btn ${styles.btnDanger}`} onClick={toutEffacer}>
              Oui, tout effacer
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`btn btn--ghost ${styles.effacerBtn}`}
            onClick={() => {
              setEfface(false);
              setConfirmation(true);
            }}
          >
            <Trash2 size={16} aria-hidden="true" />
            Effacer toutes mes données
          </button>
        )}
        <p role="status" className={styles.effaceMsg}>
          {efface ? 'Vos données ont été effacées.' : ''}
        </p>
      </div>
    </div>
  );
}
