import { useState } from 'react';
import { MODULES } from './features/registry';
import type { ModuleId } from './features/types';
import Home from './components/Home';
import ModuleShell from './components/ModuleShell';

type View = 'home' | ModuleId;

function App() {
  const [history, setHistory] = useState<View[]>(['home']);

  const currentView = history[history.length - 1];

  const navigateTo = (id: ModuleId) => {
    setHistory([...history, id]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  if (currentView === 'home') {
    return <Home onNavigate={navigateTo} />;
  }

  const module = MODULES.find((m) => m.id === currentView);
  if (!module) return null;

  const { Component, titre, sources } = module;
  return (
    <ModuleShell titre={titre} sources={sources} onBack={handleBack}>
      <Component onNavigate={navigateTo} />
    </ModuleShell>
  );
}

export default App;
