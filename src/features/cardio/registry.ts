import {
  Activity,
  HeartPulse,
  PersonStanding,
  Gauge,
  Droplets,
  Cigarette,
  Footprints,
  Salad,
  Scale,
  AlertTriangle,
  Pill,
  ClipboardCheck,
} from 'lucide-react';
import type { ModuleDef } from '../types';
import ArtereModule from './artere/ArtereModule';
import RisqueModule from './risque/RisqueModule';
import TerritoiresModule from './territoires/TerritoiresModule';
import TensionModule from './tension/TensionModule';
import CholesterolModule from './cholesterol/CholesterolModule';
import TabacModule from './tabac/TabacModule';
import BougerModule from './bouger/BougerModule';
import MangerModule from './manger/MangerModule';
import LeviersModule from './leviers/LeviersModule';
import AlerteModule from './alerte/AlerteModule';
import TraitementsModule from './traitements/TraitementsModule';
import SuiviModule from './suivi/SuiviModule';

/**
 * Registre du thème cardio (C2, plans/theme-cardio-2026-07/S2.md). 12 modules, socle uniquement
 * (S2) : chaque `Component` est un **stub** (« Module en cours de câblage »), câblé pour de vrai
 * en S4-S14 une fois le pilote validé (G-moule) et le contenu clinique validé (G1).
 *
 * `sources` volontairement **omis** ici : le contenu sourcé (`docs/cardio/CONTENU_cardio.md`,
 * S1) n'est pas encore rédigé/validé (gate G1) au moment du socle (S2, Vague 1, indépendante du
 * contenu). `Sources` (composant générique) affiche « Sources : à compléter » tant qu'aucun
 * item n'est fourni — aucune régression visuelle. À renseigner par les sessions S4-S14.
 *
 * `hue` choisi par analogie avec les hues homologues du thème diabète (mécanisme→nav,
 * risque-cardio→toxique, complications→vigilance, traitements→confort, suivi→nav) et la
 * consigne du plan (M1 nav, modules « Agir » confort, M10 toxique/vigilance).
 */
export const MODULES: ModuleDef[] = [
  // --- Comprendre ---
  {
    id: 'artere',
    famille: 'comprendre',
    titre: "L'artère qui s'encrasse",
    resume:
      "Suivre une artère en 4 temps — saine, encrassement, rupture, et l'espoir d'agir avant : le mécanisme fondateur, réversible.",
    Icon: Activity,
    Component: ArtereModule,
    hue: 'nav',
    rendersOwnShell: true,
  },
  {
    id: 'risque',
    famille: 'comprendre',
    titre: 'Mon risque global',
    resume:
      "Régler cinq feux de risque pour voir le risque grimper — et comprendre pourquoi 2 feux rouges ne s'additionnent pas.",
    Icon: HeartPulse,
    Component: RisqueModule,
    hue: 'toxique',
    rendersOwnShell: true,
  },
  {
    id: 'territoires',
    famille: 'comprendre',
    titre: "Où l'accident frappe",
    resume:
      'Une même maladie, plusieurs territoires : cœur, cerveau, jambes, reins — comprendre où l\'accident peut frapper.',
    Icon: PersonStanding,
    Component: TerritoiresModule,
    hue: 'vigilance',
    rendersOwnShell: true,
  },
  // --- Agir au quotidien ---
  {
    id: 'tension',
    famille: 'agir',
    titre: 'La tension',
    resume: 'Voir comment la tension fait grimper la pression sur l\'artère, et ce que changent trois leviers simples.',
    Icon: Gauge,
    Component: TensionModule,
    hue: 'confort',
    rendersOwnShell: true,
  },
  {
    id: 'cholesterol',
    famille: 'agir',
    titre: 'Le cholestérol (LDL)',
    resume:
      'Un curseur de LDL pour voir, dans la durée, ce qui nourrit la plaque — et ce qui la fait régresser.',
    Icon: Droplets,
    Component: CholesterolModule,
    hue: 'confort',
    rendersOwnShell: true,
  },
  {
    id: 'tabac',
    famille: 'agir',
    titre: 'Le tabac',
    resume: "Voir le risque cardiovasculaire redescendre après l'arrêt du tabac.",
    Icon: Cigarette,
    Component: TabacModule,
    hue: 'toxique',
    rendersOwnShell: true,
  },
  {
    id: 'bouger',
    famille: 'agir',
    titre: 'Bouger',
    resume: 'Choisir une activité et découvrir tous les bénéfices qu\'elle apporte, sans plafond.',
    Icon: Footprints,
    Component: BougerModule,
    hue: 'confort',
    rendersOwnShell: true,
  },
  {
    id: 'manger',
    famille: 'agir',
    titre: 'Manger pour ses artères',
    resume: 'Composer une assiette et repérer, famille par famille, ce qui protège les artères.',
    Icon: Salad,
    Component: MangerModule,
    hue: 'confort',
    rendersOwnShell: true,
  },
  {
    id: 'leviers',
    famille: 'agir',
    titre: 'Les autres leviers',
    resume: 'Alcool, sommeil, stress : trois leviers souvent oubliés, à régler à son rythme.',
    Icon: Scale,
    Component: LeviersModule,
    hue: 'confort',
    rendersOwnShell: true,
  },
  // --- Se soigner ---
  {
    id: 'alerte',
    famille: 'soigner',
    titre: "Reconnaître l'alerte",
    resume: "La carte-réflexe VITE et les signes de l'infarctus, pour agir vite en cas d'alerte.",
    Icon: AlertTriangle,
    Component: AlerteModule,
    hue: 'toxique',
    rendersOwnShell: true,
  },
  {
    id: 'traitements',
    famille: 'soigner',
    titre: 'Mes traitements qui protègent',
    resume: "Transcrire une ordonnance ligne par ligne et voir, sur le corps, ce que chaque traitement protège.",
    Icon: Pill,
    Component: TraitementsModule,
    hue: 'confort',
    rendersOwnShell: true,
  },
  {
    id: 'suivi',
    famille: 'soigner',
    titre: 'Mon suivi',
    resume: 'Mes 3 chiffres à suivre, sur une grille légère de voyants — jamais de rouge.',
    Icon: ClipboardCheck,
    Component: SuiviModule,
    hue: 'nav',
    rendersOwnShell: true,
  },
];
