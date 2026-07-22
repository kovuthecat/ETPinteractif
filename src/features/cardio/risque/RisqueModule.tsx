import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Cigarette, Gauge, Droplets, Candy, Scale, ArrowRight } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import CockpitFeux, { type FacteurCockpit } from '../components/CockpitFeux';
import ArtereCoupe from '../components/ArtereCoupe';
import { cumulMultiplicatif, FEU_TOKEN_STYLE, NEXT_ETAT, type Feu } from '../lib/risqueCardio';
import styles from './RisqueModule.module.css';

/**
 * Module 2 — Mon risque global (C8, plans/theme-cardio-2026-07/S5.md ; moule = S4/ArtereModule).
 * Cœur pédagogique du thème : les 5 feux (tabac · tension · cholestérol · sucre · poids/tour de
 * taille) se **multiplient** — ils ne s'additionnent pas (`cumulMultiplicatif`, lib S2). Le
 * cockpit (`CockpitFeux`) porte le cyclage + la barre de risque cumulée ; `ArtereCoupe` traduit
 * le même score en objet visuel. Outil « pour voir », non diagnostique — aucune donnée réelle du
 * patient n'est saisie ni conservée (fiche = état de session, zéro persistance).
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
  { id: 'poids', label: 'Poids / tour de taille', Icon: Scale },
];

const FEUX_INITIAUX: Record<string, Feu> = {
  tabac: 'vert',
  tension: 'vert',
  cholesterol: 'vert',
  sucre: 'vert',
  poids: 'vert',
};

const ETAT_LABELS: Record<Feu, string> = { vert: 'Vert', orange: 'Orange', rouge: 'Rouge' };

// Fil rouge du thème (docs/cardio/CONTENU_cardio.md §0.1, verbatim) — refrain partagé M1/M2/M3/M12.
const FIL_ROUGE =
  "L'athérosclérose avance en silence — mais elle est réversible. Agir sur plusieurs leviers à la fois protège le cœur, le cerveau, les jambes et les reins.";

function feuStyleVars(etat: Feu): CSSProperties {
  const t = FEU_TOKEN_STYLE[etat];
  return { '--feu-fg': t.fg, '--feu-soft': t.soft, '--feu-border-width': t.borderWidth } as CSSProperties;
}

export default function RisqueModule({ shell, onNavigate }: ModuleProps) {
  const [feux, setFeux] = useState<Record<string, Feu>>(FEUX_INITIAUX);
  const [leviers, setLeviers] = useState<Partial<Record<string, boolean>>>({});
  const [ficheOpen, setFicheOpen] = useState(false);

  // Le composant `CockpitFeux` ne fait qu'appeler `onCycle(id)` au clic (contrat S2) :
  // c'est ici, dans le module, qu'on applique la transition `NEXT_ETAT`.
  function cycleFeu(id: string) {
    setFeux((f) => ({ ...f, [id]: NEXT_ETAT[f[id]] }));
  }

  function toggleLevier(id: string) {
    setLeviers((l) => ({ ...l, [id]: !l[id] }));
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

            {/* porte inter-thèmes : repli visuel, nav réelle hors v1 */}
            <p className={styles.robinetSucre}>
              « Diabète ? Un parcours complet vous est dédié. »
              <br />
              <span className={styles.robinetLien}>
                → Un parcours dédié existe dans le thème Diabète
              </span>
            </p>
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

        <div className={styles.ficheButtonRow}>
          <button type="button" className="btn btn--primary" onClick={() => setFicheOpen(true)}>
            Ma fiche
          </button>
        </div>

        <p className="filrouge">{FIL_ROUGE}</p>

        <div className={styles.renvoisRow}>
          <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('artere')}>
            D'où vient ce bouchage ? <ArrowRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.renvoiBtn}
            onClick={() => onNavigate('territoires')}
          >
            Où l'accident peut-il frapper ? <ArrowRight aria-hidden="true" />
          </button>
        </div>

        {ficheOpen && (
          <FicheOverlay
            eyebrow="PROGRAMME ETP · CARDIO"
            titre="Mes feux — mon risque global"
            footer={<p className="fiche-filrouge">{FIL_ROUGE}</p>}
            onClose={() => setFicheOpen(false)}
          >
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Mes 5 feux aujourd'hui</span>
              <div className={styles.ficheFeuxList}>
                {FACTEURS.map((f) => {
                  const etat = feux[f.id];
                  return (
                    <div key={f.id} className={styles.ficheFeuxItem} style={feuStyleVars(etat)}>
                      <span className={styles.ficheFeuxPastille} aria-hidden="true" />
                      <span className={styles.ficheFeuxNom}>{f.label}</span>
                      <span className={styles.ficheFeuxEtat}>{ETAT_LABELS[etat]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Leviers retenus pour aujourd'hui</span>
              <div className={styles.ficheDList}>
                {FACTEURS.map((f) => {
                  const checked = !!leviers[f.id];
                  return (
                    <label
                      key={f.id}
                      className={`${styles.ficheDItem}${checked ? ` ${styles.ficheDItemActive}` : ''}`}
                    >
                      <input
                        type="checkbox"
                        data-no-print
                        checked={checked}
                        onChange={() => toggleLevier(f.id)}
                      />
                      <span>{f.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="fiche-bloc">
              <p className={styles.ficheEncadreTexte}>
                L'âge, le sexe, l'hérédité comptent aussi — on ne les change pas, alors on agit sur
                le reste.
              </p>
            </div>
          </FicheOverlay>
        )}
      </div>
    </ModuleShell>
  );
}
