import { useState } from 'react';
import { THEMES } from './features/registry';
import type { ModuleId, ThemeId } from './features/types';
import ThemeSelector from './components/ThemeSelector';
import Home from './components/Home';
import ModuleShell from './components/ModuleShell';

type View =
  | { type: 'themes' }
  | { type: 'home'; themeId: ThemeId }
  | { type: 'module'; themeId: ThemeId; moduleId: ModuleId; context?: unknown };

const initialView: View =
  THEMES.length > 1 ? { type: 'themes' } : { type: 'home', themeId: THEMES[0].id };

function App() {
  const [history, setHistory] = useState<View[]>([initialView]);

  const currentView = history[history.length - 1];

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

  if (currentView.type === 'themes') {
    return <ThemeSelector themes={THEMES} onNavigate={navigateToTheme} />;
  }

  const theme = THEMES.find((t) => t.id === currentView.themeId);
  if (!theme) return null;

  if (currentView.type === 'home') {
    return <Home theme={theme} onNavigate={navigateToModule} />;
  }

  const module = theme.modules.find((m) => m.id === currentView.moduleId);
  if (!module) return null;

  const { Component, titre, sources } = module;
  return (
    <ModuleShell titre={titre} sources={sources} onBack={handleBack}>
      <Component onNavigate={navigateToModule} context={currentView.context} />
    </ModuleShell>
  );
}

export default App;
