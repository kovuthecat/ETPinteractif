import { Brain, Activity, Pill, Scale, Repeat, Wrench, Compass, Flag, HeartPulse, MessageCircleQuestion } from 'lucide-react';
import type { ModuleDef } from '../types';
import AddictionModule from './addiction/AddictionModule';
import NicotineModule from './nicotine/NicotineModule';
import SubstitutsModule from './substituts/SubstitutsModule';
import NicotineToxiqueModule from './nicotine-toxique/NicotineToxiqueModule';
import SoulagementModule from './soulagement/SoulagementModule';
import BoiteAOutilsModule from './boite-a-outils/BoiteAOutilsModule';
import MotivationModule from './motivation/MotivationModule';
import PlanArretModule from './plan-arret/PlanArretModule';
import BeneficesArretModule from './benefices-arret/BeneficesArretModule';
import IdeesRecuesModule from './idees-recues/IdeesRecuesModule';

export const MODULES: ModuleDef[] = [
  {
    id: 'addiction',
    famille: 'comprendre',
    titre: "Les composantes de l'addiction",
    resume: "Comprendre que l'addiction au tabac a 3 dimensions imbriquées, chacune avec ses leviers.",
    Icon: Brain,
    Component: AddictionModule,
    hue: 'confort',
  },
  {
    id: 'nicotine',
    famille: 'comprendre',
    titre: 'La nicotine : cinétique & seuils',
    resume: "Visualiser pourquoi on fume « pour ne pas être en manque » et comment les substituts maintiennent la nicotinémie dans la zone confortable.",
    Icon: Activity,
    Component: NicotineModule,
    hue: 'nav',
  },
  {
    id: 'nicotine-toxique',
    famille: 'comprendre',
    titre: "La nicotine n'est pas le toxique",
    resume: "Lever le frein n°1 à l'usage des substituts/vapoteuse (« je remplace une drogue par une autre »).",
    Icon: Scale,
    Component: NicotineToxiqueModule,
    hue: 'vigilance',
  },
  {
    id: 'soulagement',
    famille: 'comprendre',
    titre: 'Le piège du soulagement',
    resume: "Déconstruire le « plaisir » : la cigarette soulage surtout le manque qu'elle a elle-même créé.",
    Icon: Repeat,
    Component: SoulagementModule,
    hue: 'toxique',
  },
  {
    id: 'idees-recues',
    famille: 'comprendre',
    titre: 'Vrai ou faux ?',
    resume: 'Passer en revue les idées reçues sur le tabac et le sevrage — sans jugement, avec les faits.',
    Icon: MessageCircleQuestion,
    Component: IdeesRecuesModule,
    hue: 'nav',
    sources: ['Tabac Info Service', 'HAS — Arrêt de la consommation de tabac (2014)'],
  },
  {
    id: 'substituts',
    famille: 'agir',
    titre: 'Utilisation des substituts & titration du patch',
    resume: "Bonnes pratiques par forme et démystifier le dosage, en autonomisant la personne.",
    Icon: Pill,
    Component: SubstitutsModule,
    hue: 'confort',
  },
  {
    id: 'boite-a-outils',
    famille: 'agir',
    titre: 'Stratégies & outils',
    resume: 'Choisir, situation par situation, des techniques simples pour faire face sans fumer — et emporter sa boîte à outils.',
    Icon: Wrench,
    Component: BoiteAOutilsModule,
    hue: 'vigilance',
    sources: [
      'HAS — Arrêt de la consommation de tabac (2014)',
      'Tabac Info Service',
      'ACC — Tobacco Cessation Treatment Pathway (2018)', // à revalider (Thibault)
      'Cochrane — revues sevrage tabagique', // à revalider (Thibault)
    ],
  },
  {
    id: 'plan-arret',
    famille: 'agir',
    titre: "Mon plan d'arrêt",
    resume: 'Rassembler date, substituts, parades et raisons en un plan concret à emporter.',
    Icon: Flag,
    Component: PlanArretModule,
    hue: 'confort',
  },
  {
    id: 'motivation',
    famille: 'motivation',
    titre: 'Explorer ma motivation',
    resume: "Faire le point sur ses raisons d'arrêter, à son rythme, sans balance ni jugement.",
    Icon: Compass,
    Component: MotivationModule,
    hue: 'nav',
  },
  {
    id: 'benefices-arret',
    famille: 'motivation',
    titre: "Ce que l'arrêt répare",
    resume: "Visualiser, organe par organe, les bénéfices de l'arrêt — dès 20 minutes, et à tout âge.",
    Icon: HeartPulse,
    Component: BeneficesArretModule,
    hue: 'confort',
    sources: ['Tabac Info Service — Les bénéfices de l\'arrêt du tabac', 'OMS — Sevrage tabagique'],
  },
];
