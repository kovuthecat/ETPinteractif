import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

export type ModuleId = string;

export interface ModuleProps {
  onNavigate: (id: ModuleId) => void;
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
  /** Refrain du thème, affiché en exergue de l'accueil (générique — aucun contenu de thème en dur ici). */
  exergue?: string;
  familles: FamilleDef[];
  modules: ModuleDef[];
  enConstruction?: boolean;
}
