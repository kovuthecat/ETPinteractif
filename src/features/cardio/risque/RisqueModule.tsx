import { useState } from 'react';
import { Cigarette, Gauge, Droplets, Candy, Armchair } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import CockpitFeux, { type FacteurCockpit } from '../components/CockpitFeux';
import ArtereCoupe from '../components/ArtereCoupe';
import { cumulMultiplicatif, NEXT_ETAT, type Feu } from '../lib/risqueCardio';
import styles from './RisqueModule.module.css';

/**
 * Module 2 — Mon risque global (C8, plans/theme-cardio-2026-07/S5.md ; moule = S4/ArtereModule).
 * Cœur pédagogique du thème : les 5 feux (tabac · tension · cholestérol · sucre · sédentarité/
 * inactivité) se **multiplient** — ils ne s'additionnent pas (`cumulMultiplicatif`, lib S2). Le
 * cockpit (`CockpitFeux`) porte le cyclage + la barre de risque cumulée ; `ArtereCoupe` traduit
 * le même score en objet visuel. Outil « pour voir », non diagnostique — aucune donnée réelle du
 * patient n'est saisie ni conservée. Le tabac est **binaire** (vert/rouge, pas de palier
 * intermédiaire) — correction Thibault 2026-07-23. Pas de fiche imprimable ni de renvoi textuel
 * vers le thème Diabète pour ce module (idem, correction Thibault 2026-07-23) : cockpit « pour
 * voir » seul, le soignant navigue lui-même entre thèmes.
 *
 * ⚠️ Gate G1 (docs/cardio/CONTENU_cardio.md §M2) : aucune cible LDL en g/L (seuils non
 * re-sourcés), aucun 2ᵉ niveau chiffré au survol (différé), jamais un score/une note à l'écran —
 * `cumulMultiplicatif().score` ne pilote que la position d'un curseur et l'objet `ArtereCoupe`,
 * jamais un texte numérique.
 */

const FACTEURS: FacteurCockpit[] = [
  { id: 'tabac', label: 'Tabac', Icon: Cigarette },
  { id: 'tension', label: 'Tension', Icon: Gauge },
  { id: 'cholesterol', label: 'Cholestérol', Icon: Droplets },
  { id: 'sucre', label: 'Sucre', Icon: Candy },
  { id: 'sedentarite', label: 'Sédentarité / inactivité', Icon: Armchair },
];

const FEUX_INITIAUX: Record<string, Feu> = {
  tabac: 'vert',
  tension: 'vert',
  cholesterol: 'vert',
  sucre: 'vert',
  sedentarite: 'vert',
};

// Le tabac n'a pas de palier intermédiaire clinique : on fume ou on ne fume pas (docs/cardio/
// CONTENU_cardio.md §M2). Seul ce facteur bascule vert↔rouge ; les 4 autres gardent le cycle
// générique vert→orange→rouge de `NEXT_ETAT`.
const FACTEUR_BINAIRE = new Set(['tabac']);

// Fil rouge du thème (docs/cardio/CONTENU_cardio.md §0.1, verbatim) — refrain partagé M1/M2/M3/M12.
const FIL_ROUGE =
  "L'athérosclérose avance en silence — mais elle est réversible. Agir sur plusieurs leviers à la fois protège le cœur, le cerveau, les jambes et les reins.";

export default function RisqueModule({ shell }: ModuleProps) {
  const [feux, setFeux] = useState<Record<string, Feu>>(FEUX_INITIAUX);

  // Le composant `CockpitFeux` ne fait qu'appeler `onCycle(id)` au clic (contrat S2) :
  // c'est ici, dans le module, qu'on applique la transition `NEXT_ETAT`.
  function cycleFeu(id: string) {
    setFeux((f) => ({
      ...f,
      [id]: FACTEUR_BINAIRE.has(id) ? (f[id] === 'vert' ? 'rouge' : 'vert') : NEXT_ETAT[f[id]],
    }));
  }

  // Cumul multiplicatif (proto lignes 724-726, lib S2) : `score` pilote à la fois la barre
  // interne de `CockpitFeux` (showBarre) et `ArtereCoupe` — jamais affiché comme un chiffre.
  const { score } = cumulMultiplicatif(Object.values(feux));

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <p className={styles.instruction}>Cliquez un facteur pour le régler — « pour voir »</p>

        <div className={styles.cockpitRow}>
          <div className={`card ${styles.arterePanel}`}>
            <ArtereCoupe encrassement={score} size={300} />
          </div>
          <div className={styles.cockpitCol}>
            <CockpitFeux facteurs={FACTEURS} feux={feux} onCycle={cycleFeu} showBarre />
          </div>
        </div>

        <p className={styles.multiplicationTexte}>
          Ce n'est jamais un seul facteur : ils se <strong>multiplient</strong>. Agir sur plusieurs
          à la fois protège beaucoup plus.
        </p>

        <div className={`card ${styles.encadre}`}>
          <p>
            L'âge, le sexe, l'hérédité comptent aussi — on ne les change pas, alors on agit sur le
            reste.
          </p>
          <p className={styles.ageVasculaire}>Vos artères peuvent prendre de l'avance sur votre âge.</p>
        </div>

        <p className="filrouge">{FIL_ROUGE}</p>
      </div>
    </ModuleShell>
  );
}
