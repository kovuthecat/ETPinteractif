import {
  KeyRound,
  Salad,
  Footprints,
  HeartPulse,
  PersonStanding,
  Gauge,
  ClipboardList,
  LifeBuoy,
  Syringe,
} from 'lucide-react';
import type { ModuleDef } from '../types';
import MecanismeModule from './mecanisme/MecanismeModule';
import AlimentationModule from './alimentation/AlimentationModule';
import ActiviteModule from './activite/ActiviteModule';
import RisqueCardioModule from './risque-cardio/RisqueCardioModule';
import ComplicationsModule from './complications/ComplicationsModule';
import SuiviModule from './suivi/SuiviModule';
import TraitementsModule from './traitements/TraitementsModule';
import HypoglycemieModule from './hypoglycemie/HypoglycemieModule';
import InsulineModule from './insuline/InsulineModule';

export const MODULES: ModuleDef[] = [
  {
    id: 'mecanisme',
    famille: 'comprendre',
    titre: "C'est quoi le diabète ?",
    resume:
      "Avec la métaphore de la clé et de la serrure, comprendre pourquoi le sucre reste dans le sang.",
    sources: ['Socle du fil rouge'],
    Icon: KeyRound,
    Component: MecanismeModule,
    hue: 'nav',
  },
  {
    id: 'alimentation',
    famille: 'agir',
    titre: 'Alimentation',
    resume: 'Composer une assiette et voir en direct comment elle fait varier la glycémie.',
    sources: ['Glucides en dernier (−42 mg/dL)', 'Charge glycémique (CG)', 'Régime méditerranéen', 'Fibres'],
    Icon: Salad,
    Component: AlimentationModule,
    hue: 'confort',
  },
  {
    id: 'activite',
    famille: 'agir',
    titre: 'Activité physique',
    resume: 'Découvrir tout ce que bouger apporte, et quand une activité aide le plus la glycémie.',
    sources: ['150 min ≈ un médicament', 'Marche post-prandiale', 'Santé mentale'],
    Icon: Footprints,
    Component: ActiviteModule,
    hue: 'confort',
  },
  {
    id: 'risque-cardio',
    famille: 'comprendre',
    titre: 'Risque cardiovasculaire',
    resume: 'Régler cinq feux de risque pour voir comment ils bouchent — et débouchent — les artères.',
    sources: ['Steno-2', 'Rawshani'],
    Icon: HeartPulse,
    Component: RisqueCardioModule,
    hue: 'toxique',
  },
  {
    id: 'complications',
    famille: 'comprendre',
    titre: 'Complications',
    resume: "Explorer, organe par organe, ce qui peut être touché — et surtout comment l'éviter.",
    sources: ['DCCT/UKPDS', 'Pied : risque à vie ~1/3, programmes éducatifs −2/3 amputations', 'Effet mémoire'],
    Icon: PersonStanding,
    Component: ComplicationsModule,
    hue: 'vigilance',
  },
  {
    id: 'suivi',
    famille: 'soigner',
    titre: 'Suivi',
    resume: "Faire le tour de l'année de soins sur un cadran, pour savoir où on en est.",
    sources: ['Fréquences ADA/HAS-SFD', 'Suivi structuré multifactoriel (Steno-2/Rawshani)'],
    Icon: Gauge,
    Component: SuiviModule,
    hue: 'nav',
  },
  {
    id: 'traitements',
    famille: 'soigner',
    titre: 'Traitements',
    resume: 'Voir sur le corps ce que chaque ligne de l’ordonnance protège vraiment.',
    sources: ['Classes de traitements', 'Double protection cœur-rein'],
    Icon: ClipboardList,
    Component: TraitementsModule,
    hue: 'confort',
  },
  {
    id: 'hypoglycemie',
    famille: 'soigner',
    titre: 'Hypoglycémie',
    resume: 'Le réflexe en cas d’hypoglycémie : reconnaître, resucrer, attendre — et voir la courbe remonter.',
    sources: ['Reconnaître tôt', 'Doser', 'Attendre'],
    Icon: LifeBuoy,
    Component: HypoglycemieModule,
    hue: 'vigilance',
  },
  {
    id: 'insuline',
    famille: 'soigner',
    titre: 'Insuline : adapter les doses',
    resume: 'Lire la courbe du capteur pour savoir quand ajuster une dose d’insuline.',
    sources: ['Titration basale', 'Cadence d’attente', 'Hypoglycémie nocturne', 'Asymétrie du risque'],
    Icon: Syringe,
    Component: InsulineModule,
    hue: 'nav',
  },
];
