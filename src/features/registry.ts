import type { ThemeDef } from './types';
import { MODULES as TABAC_MODULES } from './tabac/registry';
import { MODULES as DIABETE_MODULES } from './diabete/registry';

export const THEMES: ThemeDef[] = [
  {
    id: 'tabac',
    titre: 'Sevrage tabagique',
    eyebrow: 'Programme ETP · Sevrage tabagique',
    description: "Comprendre l'addiction, utiliser les substituts, gérer le craving et la motivation.",
    exergue:
      "C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se traite.",
    familles: [
      { id: 'comprendre', label: 'Comprendre' },
      { id: 'agir', label: 'Agir' },
      { id: 'motivation', label: 'Se motiver' },
    ],
    modules: TABAC_MODULES,
  },
  {
    id: 'diabete',
    titre: 'Diabète',
    eyebrow: 'Programme ETP · Diabète',
    description: 'Contenu en cours de cadrage.',
    familles: [],
    modules: DIABETE_MODULES,
    enConstruction: true,
  },
];
