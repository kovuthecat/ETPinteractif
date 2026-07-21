import { useState } from 'react';
import Home from './Home';
import PatientSubstituts from './substituts/PatientSubstituts';
import PatientSituations from './situations/PatientSituations';
import PatientCarnet from './carnet/PatientCarnet';
import styles from './PatientApp.module.css';

type View = 'home' | 'substituts' | 'situations' | 'carnet';

function PatientApp() {
  const [view, setView] = useState<View>('home');

  const go = (next: View) => setView(next);

  return (
    <div className={styles.app}>
      {view === 'home' && <Home onNavigate={go} />}
      {view === 'substituts' && <PatientSubstituts onBack={() => go('home')} />}
      {view === 'situations' && <PatientSituations onBack={() => go('home')} onNavigate={go} />}
      {view === 'carnet' && <PatientCarnet onBack={() => go('home')} />}
    </div>
  );
}

export default PatientApp;
