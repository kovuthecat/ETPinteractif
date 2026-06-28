import { useState } from 'react';
import { MODULES } from './features/registry';
import type { ModuleId } from './features/types';
import Home from './components/Home';

type View = 'home' | ModuleId;

function App() {
  const [view, setView] = useState<View>('home');

  const navigateTo = (id: ModuleId) => setView(id);

  if (view === 'home') {
    return <Home onNavigate={navigateTo} />;
  }

  const module = MODULES.find((m) => m.id === view);
  if (!module) return null;

  const { Component, titre } = module;
  return (
    <div>
      <button type="button" onClick={() => setView('home')}>Retour</button>
      <h1>{titre}</h1>
      <Component onNavigate={navigateTo} />
    </div>
  );
}

export default App;
