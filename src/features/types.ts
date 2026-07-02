import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

export type ModuleId =
  | 'addiction'
  | 'nicotine'
  | 'substituts'
  | 'nicotine-toxique'
  | 'soulagement'
  | 'craving'
  | 'motivation';

export interface ModuleProps {
  onNavigate: (id: ModuleId) => void;
}

export type FamilleId = 'comprendre' | 'agir' | 'motivation';

export interface ModuleDef {
  id: ModuleId;
  famille: FamilleId;
  titre: string;
  resume: string;
  sources?: string[];
  Icon: LucideIcon;
  Component: ComponentType<ModuleProps>;
}
