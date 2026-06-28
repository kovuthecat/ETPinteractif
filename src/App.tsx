import { useState } from 'react';
import { MODULES } from './features/registry';
import type { ModuleId } from './features/types';

type View = 'home' | ModuleId;

function App() {
  const [view, setView] = useState<View>('home');

  const navigateTo = (id: ModuleId) => setView(id);

  if (view === 'home') {
    return (
      <div>
        <h1>Sevrage tabagique</h1>
        <ul>
          {MODULES.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => navigateTo(m.id)}>{m.titre}</button>
            </li>
          ))}
        </ul>
      </div>
    );
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
