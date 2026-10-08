import { useEffect, useRef, useState } from 'react';
import { THEMES } from './features/registry';
import type { ModuleId, ThemeId } from './features/types';
import ThemeSelector from './components/ThemeSelector';
import Home from './components/Home';
import ModuleShell from './components/ModuleShell';
import { SelectionProvider, SelectionScope } from './state/SelectionContext';

type View =
  | { type: 'themes' }
  | { type: 'home'; themeId: ThemeId }
  | { type: 'module'; themeId: ThemeId; moduleId: ModuleId; context?: unknown };

const initialView: View =
  THEMES.length > 1 ? { type: 'themes' } : { type: 'home', themeId: THEMES[0].id };

function App() {
  const [history, setHistory] = useState<View[]>([initialView]);

  const currentView = history[history.length - 1];

  // Point unique : titre de page, retour en haut et focus sur le h1 à chaque changement de vue.
  const firstRender = useRef(true);
  useEffect(() => {
    const marque = 'ETP interactif';
    let titre = `Choisir un thème — ${marque}`;
    if (currentView.type !== 'themes') {
      const theme = THEMES.find((t) => t.id === currentView.themeId);
      if (theme) {
        titre =
          currentView.type === 'home'
            ? `${theme.titre} — ${marque}`
            : `${theme.modules.find((m) => m.id === currentView.moduleId)?.titre ?? 'Module'} — ${theme.titre} — ${marque}`;
      }
    }
    document.title = titre;
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [currentView]);

  const navigateToTheme = (themeId: ThemeId) => {
    setHistory([...history, { type: 'home', themeId }]);
  };

  const navigateToModule = (moduleId: ModuleId, context?: unknown) => {
    if (currentView.type === 'themes') return;
    setHistory([...history, { type: 'module', themeId: currentView.themeId, moduleId, context }]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const renderModule = (
    theme: (typeof THEMES)[number],
    view: Extract<View, { type: 'module' }>,
  ) => {
    const module = theme.modules.find((m) => m.id === view.moduleId);
    if (!module) return null;
    const { Component, titre, sources, rendersOwnShell } = module;
    if (rendersOwnShell) {
      return (
        <Component
          onNavigate={navigateToModule}
          context={view.context}
          shell={{ titre, sources, onBack: handleBack }}
        />
      );
    }
    return (
      <ModuleShell titre={titre} sources={sources} onBack={handleBack}>
        <Component onNavigate={navigateToModule} context={view.context} />
      </ModuleShell>
    );
  };

  const renderView = () => {
    if (currentView.type === 'themes') {
      return <ThemeSelector themes={THEMES} onNavigate={navigateToTheme} />;
    }
    const theme = THEMES.find((t) => t.id === currentView.themeId);
    if (!theme) return null;
    const inner =
      currentView.type === 'home' ? (
        <Home
          theme={theme}
          onNavigate={navigateToModule}
          onChangeTheme={history.length > 1 ? handleBack : undefined}
        />
      ) : (
        renderModule(theme, currentView)
      );
    return <SelectionScope themeId={currentView.themeId}>{inner}</SelectionScope>;
  };

  // Le SelectionProvider est la racine stable de l'app : il ne se démonte jamais,
  // donc l'état de sélection (en mémoire) survit au changement de vue/module.
  return <SelectionProvider>{renderView()}</SelectionProvider>;
}

export default App;
