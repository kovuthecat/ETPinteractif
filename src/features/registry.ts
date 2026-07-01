import { Brain, Activity, Pill, Scale, Repeat, Waves, Compass } from 'lucide-react';
import type { ModuleDef } from './types';
import AddictionModule from './addiction/AddictionModule';
import NicotineModule from './nicotine/NicotineModule';
import SubstitutsModule from './substituts/SubstitutsModule';
import NicotineToxiqueModule from './nicotine-toxique/NicotineToxiqueModule';
import SoulagementModule from './soulagement/SoulagementModule';
import CravingModule from './craving/CravingModule';
import MotivationModule from './motivation/MotivationModule';

export const MODULES: ModuleDef[] = [
  {
    id: 'addiction',
    titre: "Les composantes de l'addiction",
    resume: "Comprendre que l'addiction au tabac a 3 dimensions imbriquées, chacune avec ses leviers.",
    Icon: Brain,
    Component: AddictionModule,
  },
  {
    id: 'nicotine',
    titre: 'La nicotine : cinétique & seuils',
    resume: "Visualiser pourquoi on fume « pour ne pas être en manque » et comment les substituts maintiennent la nicotinémie dans la zone confortable.",
    Icon: Activity,
    Component: NicotineModule,
  },
  {
    id: 'substituts',
    titre: 'Utilisation des substituts & titration du patch',
    resume: "Bonnes pratiques par forme et démystifier le dosage, en autonomisant la personne.",
    Icon: Pill,
    Component: SubstitutsModule,
  },
  {
    id: 'nicotine-toxique',
    titre: "La nicotine n'est pas le toxique",
    resume: "Lever le frein n°1 à l'usage des substituts/vapoteuse (« je remplace une drogue par une autre »).",
    Icon: Scale,
    Component: NicotineToxiqueModule,
  },
  {
    id: 'soulagement',
    titre: 'Le piège du soulagement',
    resume: "Déconstruire le « plaisir » : la cigarette soulage surtout le manque qu'elle a elle-même créé.",
    Icon: Repeat,
    Component: SoulagementModule,
  },
  {
    id: 'craving',
    titre: 'Gérer le craving (4D)',
    resume: "Montrer que l'envie est une vague de quelques minutes qui retombe, et donner des techniques immédiates.",
    Icon: Waves,
    Component: CravingModule,
  },
  {
    id: 'motivation',
    titre: 'Explorer ma motivation',
    resume: "Faire le point sur ses raisons d'arrêter, à son rythme, sans balance ni jugement.",
    Icon: Compass,
    Component: MotivationModule,
  },
];
