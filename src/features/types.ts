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

export interface ModuleDef {
  id: ModuleId;
  titre: string;
  resume: string;
  sources?: string[];
  Icon: LucideIcon;
  Component: ComponentType<ModuleProps>;
}
