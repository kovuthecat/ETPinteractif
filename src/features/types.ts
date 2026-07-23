import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

export type ModuleId = string;

export interface ModuleProps {
  onNavigate: (id: ModuleId, context?: unknown) => void;
  /** Contexte opaque transmis par le module appelant (le moteur n'en connaît pas la forme). */
  context?: unknown;
  /** Fourni par App.tsx uniquement quand `ModuleDef.rendersOwnShell` est vrai : le module
   *  rend lui-même `ModuleShell` (nécessaire pour remonter sa barre d'onglets dans le slot `nav`). */
  shell?: { titre: string; sources?: string[]; onBack: () => void };
}

export type FamilleId = string;

export type Hue = 'nav' | 'confort' | 'vigilance' | 'toxique';

export interface ModuleDef {
  id: ModuleId;
  famille: FamilleId;
  titre: string;
  resume: string;
  sources?: string[];
  Icon: LucideIcon;
  Component: ComponentType<ModuleProps>;
  hue?: Hue;
  /** Générique (aucun thème par son nom) : quand vrai, le module rend lui-même `ModuleShell`
   *  (reçoit ses infos via `ModuleProps.shell`) au lieu qu'App.tsx l'enveloppe. */
  rendersOwnShell?: boolean;
}

export interface FamilleDef {
  id: FamilleId;
  label: string;
}

export type ThemeId = string;

export interface ThemeDef {
  id: ThemeId;
  titre: string;
  eyebrow: string;
  description: string;
  /** Icône du thème, affichée sur l'écran « Choisir un thème » (même convention que `ModuleDef.Icon`). */
  Icon: LucideIcon;
  /** Refrain du thème, affiché en exergue de l'accueil (générique — aucun contenu de thème en dur ici). */
  exergue?: string;
  familles: FamilleDef[];
  modules: ModuleDef[];
  enConstruction?: boolean;
}
