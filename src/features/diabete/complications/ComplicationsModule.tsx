import { useState, type CSSProperties } from 'react';
import { Lock, PersonStanding } from 'lucide-react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
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

export default function ComplicationsModule({ onNavigate }: ModuleProps) {
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

  let legende: { eyebrow: string; texte: string };
  if (organeOuvert) {
    legende = {
      eyebrow: organeOuvert.nom,
      texte: "Ce qu'on surveille pour que ça n'arrive pas — jamais ce qui vous attend.",
    };
  } else if (verrouilleOuvert) {
    legende = {
      eyebrow: verrouilleOuvert.nom,
      texte: 'Cœur et cerveau : déjà vus au module 4, la même maladie, à plus grande échelle.',
    };
  } else {
    legende = { eyebrow: 'Complications', texte: EXERGUE_DIABETE };
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>Touchez un organe — refermez quand c'est assez.</p>

      <div className={styles.layout}>
        <div className={styles.silhouetteCol}>
          <Silhouette zones={zones} onZoneClick={selectionner} />

          {/* Rangée de chips : double accès (accessibilité) aux mêmes zones que la
              silhouette. Les pastilles verrouillées de Silhouette sont désactivées
              (natif <button disabled>) : ces chips portent donc aussi le seul accès
              cliquable au panneau « déjà vu — module 4 », comme dans la maquette. */}
          <div className={styles.chips} role="group" aria-label="Choisir un organe à explorer">
            {ORGANES_VERROUILLES.map((z) => {
              const active = verrouilleOuvert?.id === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  className={`chip ${styles.chipVerrouille}${active ? ' activeDoubled' : ''}`}
                  style={{ '--active-color': 'var(--color-text-faint)' } as CSSProperties}
                  aria-pressed={active}
                  onClick={() => selectionner(z.id)}
                >
                  <Lock size={13} aria-hidden="true" /> {z.nom}
                </button>
              );
            })}
            {ORGANES.map((o) => {
              const active = selected === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  className={`chip chip--confort${active ? ' activeDoubled' : ''}`}
                  style={active ? ({ '--active-color': 'var(--color-confort)' } as CSSProperties) : undefined}
                  aria-pressed={active}
                  onClick={() => selectionner(o.id)}
                >
                  {o.nom}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.panneau}>
          {!selected && (
            <div className={`${styles.etatVide} ${styles.fade}`}>
              <div className={styles.videIcone}>
                <PersonStanding size={40} aria-hidden="true" />
              </div>
              <p className={styles.videTitre}>
                Le diabète est une maladie des vaisseaux, pas seulement du sucre — la même plaque,
                ailleurs, abîme d'autres organes.
              </p>
              <p className={styles.videSousTitre}>Choisissez un organe pour voir ce qu'on surveille.</p>
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
              <span className="eyebrow">{organeOuvert.nom}</span>

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

      <p className={styles.caption}>
        <span className="eyebrow">{legende.eyebrow}</span>
        {legende.texte}
      </p>

      <ModuleFooterNav
        items={[{ id: 'suivi', label: 'Cet examen, on le programme quand ?' }]}
        onNavigate={onNavigate}
      />

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
  );
}
