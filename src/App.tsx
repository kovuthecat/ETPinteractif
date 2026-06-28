import { useState } from 'react';
import { MODULES } from './features/registry';
import type { ModuleId } from './features/types';
import Home from './components/Home';
import ModuleShell from './components/ModuleShell';

type View = 'home' | ModuleId;

function App() {
  const [view, setView] = useState<View>('home');

  const navigateTo = (id: ModuleId) => setView(id);

  if (view === 'home') {
    return <Home onNavigate={navigateTo} />;
  }

  const module = MODULES.find((m) => m.id === view);
  if (!module) return null;

  const { Component, titre, sources } = module;
  return (
    <ModuleShell titre={titre} sources={sources} onBack={() => setView('home')}>
      <Component onNavigate={navigateTo} />
    </ModuleShell>
  );
}

export default App;
