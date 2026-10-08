import { useCallback, useEffect, useState } from 'react';
import Home from './Home';
import PatientSubstituts from './substituts/PatientSubstituts';
import PatientSituations from './situations/PatientSituations';
import PatientCarnet from './carnet/PatientCarnet';
import styles from './PatientApp.module.css';

type View = 'home' | 'substituts' | 'situations' | 'carnet';

/**
 * État de navigation : uniquement des identifiants d'écran (jamais de donnée saisie),
 * stocké dans `history.state` pour que le geste « précédent » revienne à l'écran d'avant.
 * `idx` = profondeur de l'entrée dans la pile (0 = accueil).
 */
interface Nav {
  view: View;
  forme?: string;
  situation?: string;
  outil?: string;
  idx: number;
}

const HOME: Nav = { view: 'home', idx: 0 };
const VIEWS: View[] = ['home', 'substituts', 'situations', 'carnet'];

function lireEtat(state: unknown): Nav | null {
  if (!state || typeof state !== 'object') return null;
  const s = state as Partial<Nav>;
  if (!s.view || !VIEWS.includes(s.view) || typeof s.idx !== 'number') return null;
  return {
    view: s.view,
    idx: s.idx,
    forme: typeof s.forme === 'string' ? s.forme : undefined,
    situation: typeof s.situation === 'string' ? s.situation : undefined,
    outil: typeof s.outil === 'string' ? s.outil : undefined,
  };
}

const TITRES: Record<View, string> = {
  home: "Mon aide à l'arrêt",
  substituts: "Mes substituts — Mon aide à l'arrêt",
  situations: "Agir face à une situation — Mon aide à l'arrêt",
  carnet: "Mon carnet de suivi — Mon aide à l'arrêt",
};

function PatientApp() {
  const [nav, setNav] = useState<Nav>(() => lireEtat(window.history.state) ?? HOME);

  useEffect(() => {
    // Premier chargement : l'accueil est l'entrée de base (le premier « précédent » quitte l'app).
    if (!lireEtat(window.history.state)) window.history.replaceState(HOME, '');
    const onPop = (e: PopStateEvent) => setNav(lireEtat(e.state) ?? HOME);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.title = TITRES[nav.view];
    window.scrollTo(0, 0);
  }, [nav]);

  /** Ouvre un écran : une entrée d'historique par sous-état. */
  const push = useCallback(
    (next: Omit<Nav, 'idx'>) => {
      const entry: Nav = { ...next, idx: nav.idx + 1 };
      window.history.pushState(entry, '');
      setNav(entry);
    },
    [nav.idx],
  );

  /** Remonte de `n` entrées. */
  const back = useCallback((n = 1) => window.history.go(-n), []);

  const goHome = useCallback(() => {
    if (nav.idx > 0) back(nav.idx);
  }, [nav.idx, back]);

  return (
    <div className={styles.app}>
      {nav.view === 'home' && <Home onNavigate={(v) => push({ view: v })} />}
      {nav.view === 'substituts' && (
        <PatientSubstituts
          onBack={goHome}
          forme={nav.forme ?? null}
          onOpenForme={(forme) => push({ view: 'substituts', forme })}
          onCloseForme={() => back(1)}
        />
      )}
      {nav.view === 'situations' && (
        <PatientSituations
          onBack={goHome}
          onNavigate={(v) => push({ view: v })}
          situation={nav.situation ?? null}
          outil={nav.outil ?? null}
          onOpenSituation={(situation) => push({ view: 'situations', situation })}
          onOpenOutil={(outil) => push({ view: 'situations', situation: nav.situation, outil })}
          onCloseOutil={() => back(1)}
          onOtherSituation={() => back(nav.outil ? 2 : 1)}
        />
      )}
      {nav.view === 'carnet' && <PatientCarnet onBack={goHome} />}
    </div>
  );
}

export default PatientApp;
