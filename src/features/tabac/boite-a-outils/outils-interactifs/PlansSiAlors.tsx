import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import styles from './PlansSiAlors.module.css';

/**
 * Outil interactif « Mes plans "SI… ALORS…" » (`outil-si-alors`, OI5,
 * plans/outils-interactifs-2026-07/S2.md). Restructure le `proposition` existant (verbatim,
 * cf. content/tabac/outils.ts) en atelier : le patient compose 3 à 5 plans à partir de ses
 * propres situations (`contexte.situationsActives`, injectées par le bundle) et de parades
 * reliées aux autres outils de la boîte, avec repli en saisie libre des deux côtés.
 *
 * Persistance : `store` (clé `outil.id` = `outil-si-alors`), une ligne par plan au format
 * `SI <déclencheur>, ALORS <parade>.` — consommée telle quelle par la fiche « Ma boîte à
 * outils » (socle OI4, BoiteAOutilsModule) qui l'affiche à la place de `consigneFiche`.
 */

// Parades suggérées (chaînes statiques, pas de navigation) — reliées aux autres outils de la
// boîte : Vague 4D (bouger, surfer), Respiration guidée, Phrase de refus. Décision G2 tranchée
// (2026-07-21), cf. plan.
const PARADES_SUGGEREES: string[] = [
  'je bouge 10 minutes',
  'je respire (4-7-8)',
  "je bois un verre d'eau",
  "j'utilise ma phrase de refus",
  "je surfe sur l'envie",
];

const MAX_PLANS = 5;

export default function PlansSiAlors({ outil, store, contexte, onClose }: OutilInteractifProps) {
  // Lu une seule fois au montage (cf. plan, étape 3) — la persistance est ensuite tenue à
  // jour localement en parallèle de chaque écriture dans `store`.
  const [plans, setPlans] = useState<string[]>(() => store.get(outil.id));
  const [si, setSi] = useState('');
  const [alors, setAlors] = useState('');

  const situations = contexte?.situationsActives ?? [];
  const plein = plans.length >= MAX_PLANS;

  function ajouterPlan() {
    const declencheur = si.trim();
    const parade = alors.trim();
    if (!declencheur || !parade || plein) return;
    const ligne = `SI ${declencheur}, ALORS ${parade}.`;
    const next = [...plans, ligne];
    setPlans(next);
    store.setList(outil.id, next);
    setSi('');
    setAlors('');
  }

  function supprimerPlan(index: number) {
    const next = plans.filter((_, i) => i !== index);
    setPlans(next);
    store.setList(outil.id, next);
  }

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onClose}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <div className={styles.intro}>
        <p className={styles.titre}>{outil.titre}</p>
        <p className={styles.principe}>{outil.principe}</p>
        <p className={styles.cadrage}>
          Composez ci-dessous 3 à 5 plans précis, prêts à l'emploi le moment venu.
        </p>
      </div>

      {plein ? (
        <p className={styles.hint}>
          Vous avez déjà {MAX_PLANS} plans — retirez-en un pour en ajouter un autre.
        </p>
      ) : (
        <div className={`${styles.composer} card`}>
          <div className={styles.champ}>
            <p className={styles.champLabel}>SI…</p>
            {situations.length > 0 ? (
              <div className={styles.chipRow} role="radiogroup" aria-label="Choisir un déclencheur">
                {situations.map((situation) => {
                  const active = si === situation.label;
                  return (
                    <button
                      key={situation.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`chip ${styles.chipBtn}${active ? ' activeDoubled' : ''}`}
                      onClick={() => setSi(situation.label)}
                    >
                      {situation.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className={styles.hint}>
                Choisissez d'abord vos situations dans Composantes, ou saisissez-en une.
              </p>
            )}
            <input
              type="text"
              className={styles.libreInput}
              value={si}
              onChange={(event) => setSi(event.target.value)}
              placeholder="Ou décrivez votre situation…"
              aria-label="Déclencheur SI (saisie libre)"
            />
          </div>

          <div className={styles.champ}>
            <p className={styles.champLabel}>ALORS…</p>
            <div className={styles.chipRow} role="radiogroup" aria-label="Choisir une parade">
              {PARADES_SUGGEREES.map((parade) => {
                const active = alors === parade;
                return (
                  <button
                    key={parade}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`chip ${styles.chipBtn}${active ? ' activeDoubled' : ''}`}
                    onClick={() => setAlors(parade)}
                  >
                    {parade}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              className={styles.libreInput}
              value={alors}
              onChange={(event) => setAlors(event.target.value)}
              placeholder="Ou décrivez votre parade…"
              aria-label="Parade ALORS (saisie libre)"
            />
          </div>

          <button
            type="button"
            className="btn btn--primary"
            disabled={!si.trim() || !alors.trim()}
            onClick={ajouterPlan}
          >
            Ajouter ce plan
          </button>
        </div>
      )}

      {plans.length > 0 && (
        <ul className={styles.liste}>
          {plans.map((ligne, index) => (
            <li key={`${ligne}-${index}`} className={styles.ligne}>
              <span>{ligne}</span>
              <button
                type="button"
                className={styles.supprimerBtn}
                onClick={() => supprimerPlan(index)}
                aria-label={`Retirer le plan : ${ligne}`}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.rappel}>{outil.consigneFiche}</p>
    </div>
  );
}
