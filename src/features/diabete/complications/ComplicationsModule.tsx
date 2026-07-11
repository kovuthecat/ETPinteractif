import { useState } from 'react';
import { PersonStanding } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import Silhouette, { type SilhouetteZoneState, type ZoneId } from '../components/Silhouette';
import SignatureEvitable from '../components/SignatureEvitable';
import IllustrationSlot from '../components/IllustrationSlot';
import { ORGANES, ORGANES_VERROUILLES, FICHE_ITEMS, FICHE_STAT, FICHE_CONDUITE_PLAIE, POINTS_CONTROLE } from './data';
import styles from './ComplicationsModule.module.css';

/**
 * Module 5 — Complications (plan theme-diabete/S8.md). Exploration calme du corps :
 * on n'ouvre que ce qu'on veut, chaque organe déroule ses 3 temps indissociables
 * (menace → évitable et dépistable → geste), le pied est la branche renforcée avec
 * sa fiche de référence. Registre contemplatif : la menace n'est jamais seule à
 * l'écran (BRIEF_DESIGN_diabete.md §Module 5).
 */

// Fil rouge du thème diabète (registry.ts, ThemeDef.exergue) — repris ici verbatim
// pour la légende de bas d'écran et le pied de la fiche pied.
const EXERGUE_DIABETE =
  'Le diabète est une maladie des vaisseaux, pas seulement du sucre — agir sur tout ensemble protège.';

type Selection = ZoneId | null;

export default function ComplicationsModule({ shell }: ModuleProps) {
  const [selected, setSelected] = useState<Selection>(null);
  const [ficheOuverte, setFicheOuverte] = useState(false);

  const selectionner = (id: ZoneId) => {
    setSelected((current) => (current === id ? null : id));
    setFicheOuverte(false);
  };

  const organeOuvert = ORGANES.find((o) => o.id === selected) ?? null;
  const verrouilleOuvert = ORGANES_VERROUILLES.find((z) => z.id === selected) ?? null;

  const zones: SilhouetteZoneState[] = [
    ...ORGANES_VERROUILLES.map((z) => ({ id: z.id, etat: 'verrouille' as const })),
    ...ORGANES.map((o) => ({
      id: o.id,
      etat: selected === o.id ? ('ouvert' as const) : ('actif' as const),
    })),
  ];

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
    <div className={styles.module}>
      <div className={styles.layout}>
        <div className={styles.silhouetteCol}>
          {/* Sélection directement sur la silhouette (S1) : les hotspots restent cliquables
              même « déjà vu » (cœur/cerveau → panneau récapitulatif module 4), plus de chips
              redondantes. */}
          <Silhouette zones={zones} onZoneClick={selectionner} />
        </div>

        <div className={styles.panneau}>
          {!selected && (
            <div className={`${styles.etatVide} ${styles.fade}`}>
              <div className={styles.videIcone}>
                <PersonStanding size={40} aria-hidden="true" />
              </div>
              <p className={styles.videTitre}>Choisissez un organe pour voir ce qu'on surveille.</p>
            </div>
          )}

          {verrouilleOuvert && (
            <div className={`${styles.etatVerrouille} ${styles.fade}`}>
              <span className="eyebrow">{verrouilleOuvert.nom}</span>
              <p className={styles.verrouilleTexte}>
                Déjà vu au module 4 : la même maladie des vaisseaux, à plus grande échelle.
              </p>
              <p className={styles.verrouilleSousTexte}>
                Ici, on regarde les petits vaisseaux — yeux, reins, nerfs, pieds.
              </p>
            </div>
          )}

          {organeOuvert && (
            <div className={`${styles.organe} ${styles.fade}`}>
              <div className={styles.organeHead}>
                <IllustrationSlot
                  id={organeOuvert.id === 'pied' ? 'pied-auto-examen' : `organe-${organeOuvert.id}`}
                  label={organeOuvert.nom}
                  shape="rounded"
                  size={104}
                />
                <span className="eyebrow">{organeOuvert.nom}</span>
              </div>

              <div className={`panel ${styles.temps} ${styles.tempsMenace}`}>
                <span className={styles.pointMenace} aria-hidden="true" />
                <p>{organeOuvert.menace}</p>
              </div>

              <div className={`panel ${styles.tempsEvitable}`}>
                <SignatureEvitable>{organeOuvert.stat}</SignatureEvitable>
                <p>{organeOuvert.evitable}</p>
              </div>

              <div className={`panel ${styles.temps} ${styles.tempsGeste}`}>
                <span className={styles.pointGeste} aria-hidden="true" />
                <p className={styles.gesteTexte}>{organeOuvert.geste}</p>
              </div>

              {organeOuvert.brancheRenforcee && (
                <div className={`panel ${styles.piedExtra}`}>
                  <IllustrationSlot
                    id="pied-auto-examen"
                    label="Points de contrôle du pied"
                    shape="rounded"
                    size={120}
                  />
                  <ul className={styles.pointsControle}>
                    {POINTS_CONTROLE.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`btn btn--primary ${styles.ficheBouton}`}
                    onClick={() => setFicheOuverte(true)}
                  >
                    Voir la fiche
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {ficheOuverte && (
        <FicheOverlay
          eyebrow="Fiche — référence"
          titre="Le pied : l'auto-examen quotidien"
          onClose={() => setFicheOuverte(false)}
          footer={<p className="fiche-filrouge">{EXERGUE_DIABETE}</p>}
        >
          <p className={styles.ficheIntro}>
            Un geste, chaque jour — c'est le plus grand levier contre l'amputation.
          </p>

          <ul className={styles.ficheChecklist}>
            {FICHE_ITEMS.map((item) => (
              <li key={item} className={styles.ficheChecklistItem}>
                <span className={styles.ficheChecklistMark} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className={styles.ficheStat}>{FICHE_STAT}</div>

          <div className={`callout ${styles.fichePlaie}`}>
            <span className="eyebrow">Si une plaie apparaît</span>
            <p>{FICHE_CONDUITE_PLAIE}</p>
          </div>
        </FicheOverlay>
      )}
    </div>
    </ModuleShell>
  );
}
