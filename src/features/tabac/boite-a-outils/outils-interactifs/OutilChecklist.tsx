import { useState } from 'react';
import type { FormEvent } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import { CHECKLISTS, isChecklistInteractifId } from './data/checklists';
import type { ChecklistData, ChecklistPaire } from './data/checklists';
import styles from './OutilChecklist.module.css';

/**
 * `OutilChecklist` (OI7, plans/outils-interactifs-2026-07/S4.md, G4) : composant générique
 * « cocher + ajouter du perso → fiche », piloté par `data/checklists.ts`. Sert 4 outils :
 * - `place-nette` : items groupés (Maison / Voiture) ;
 * - `mains-bouche`, `anti-ennui` : liste plate (`anti-ennui` affiche en plus une progression
 *   indicative vers sa cible, sans jamais bloquer) ;
 * - `routine` : paires « rituel → substitution », la substitution étant éditable.
 *
 * Persistance : une seule liste de lignes de texte sous `store.get/setList(outil.id)` — la
 * fiche du module (« Ma boîte à outils », socle OI4 dans `BoiteAOutilsModule.tsx`) affiche
 * chaque ligne telle quelle. Les items cochés/édités et les ajouts libres sont donc rendus
 * sous forme de chaînes déjà lisibles (ex. « Café → Un thé, dans une autre pièce »).
 */
function formatPaireLigne(rituel: string, substitution: string): string {
  return `${rituel} → ${substitution}`;
}

function suggestedItemsOf(data: ChecklistData): string[] {
  if (data.groupes) return data.groupes.flatMap((g) => g.items);
  if (data.items) return data.items;
  return [];
}

interface PaireState {
  actif: boolean;
  substitution: string;
}

function initPaireStates(paires: ChecklistPaire[], saved: string[]): PaireState[] {
  return paires.map((p) => {
    const prefixe = `${p.rituel} → `;
    const ligne = saved.find((s) => s.startsWith(prefixe));
    return ligne
      ? { actif: true, substitution: ligne.slice(prefixe.length) }
      : { actif: false, substitution: p.suggestion };
  });
}

function initCustom(data: ChecklistData, saved: string[]): string[] {
  if (data.paires) {
    const paires = data.paires;
    return saved.filter((s) => !paires.some((p) => s.startsWith(`${p.rituel} → `)));
  }
  const suggested = suggestedItemsOf(data);
  return saved.filter((s) => !suggested.includes(s));
}

export default function OutilChecklist({ outil, store, onClose }: OutilInteractifProps) {
  const data = isChecklistInteractifId(outil.interactif) ? CHECKLISTS[outil.interactif] : undefined;
  const [saved] = useState(() => store.get(outil.id));

  const suggestedItems = data ? suggestedItemsOf(data) : [];
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(saved.filter((s) => suggestedItems.includes(s))),
  );
  const [paireStates, setPaireStates] = useState<PaireState[]>(() =>
    data?.paires ? initPaireStates(data.paires, saved) : [],
  );
  const [custom, setCustom] = useState<string[]>(() => (data ? initCustom(data, saved) : []));
  const [nouvel, setNouvel] = useState('');

  if (!data) {
    return (
      <div className={`${styles.module} card`}>
        <p className={styles.titre}>{outil.titre}</p>
        <p className={styles.principe}>Outil interactif en préparation.</p>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          <ChevronLeft aria-hidden="true" /> Retour
        </button>
      </div>
    );
  }

  function persist(nextChecked: Set<string>, nextPaireStates: PaireState[], nextCustom: string[]) {
    const lignesSuggerees = data!.paires
      ? nextPaireStates
          .map((state, index) =>
            state.actif ? formatPaireLigne(data!.paires![index].rituel, state.substitution) : null,
          )
          .filter((ligne): ligne is string => ligne !== null)
      : suggestedItems.filter((item) => nextChecked.has(item));
    store.setList(outil.id, [...lignesSuggerees, ...nextCustom]);
  }

  function toggleItem(item: string) {
    const next = new Set(checked);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setChecked(next);
    persist(next, paireStates, custom);
  }

  function togglePaire(index: number) {
    const next = paireStates.map((s, i) => (i === index ? { ...s, actif: !s.actif } : s));
    setPaireStates(next);
    persist(checked, next, custom);
  }

  function editSubstitution(index: number, value: string) {
    const next = paireStates.map((s, i) => (i === index ? { ...s, substitution: value } : s));
    setPaireStates(next);
    persist(checked, next, custom);
  }

  function ajouterLibre(event: FormEvent) {
    event.preventDefault();
    const valeur = nouvel.trim();
    if (!valeur) return;
    const next = [...custom, valeur];
    setCustom(next);
    persist(checked, paireStates, next);
    setNouvel('');
  }

  function retirerCustom(index: number) {
    const next = custom.filter((_, i) => i !== index);
    setCustom(next);
    persist(checked, paireStates, next);
  }

  const totalChoisis = (data.paires ? paireStates.filter((s) => s.actif).length : checked.size) + custom.length;

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onClose}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <div className={styles.entete}>
        <p className={styles.titre}>{outil.titre}</p>
        <p className={styles.principe}>{outil.principe}</p>
      </div>

      {data.cible && (
        <p className={styles.progression}>
          {totalChoisis} / {data.cible} choisis
        </p>
      )}

      {data.groupes && (
        <div className={styles.groupes}>
          {data.groupes.map((groupe) => (
            <div key={groupe.label} className={`${styles.groupe} card`}>
              <span className={styles.groupeLabel}>{groupe.label}</span>
              <div className={styles.itemsList}>
                {groupe.items.map((item) => (
                  <label key={item} className={styles.item}>
                    <input type="checkbox" checked={checked.has(item)} onChange={() => toggleItem(item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.items && (
        <div className={`${styles.itemsCard} card`}>
          <div className={styles.itemsList}>
            {data.items.map((item) => (
              <label key={item} className={styles.item}>
                <input type="checkbox" checked={checked.has(item)} onChange={() => toggleItem(item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {data.paires && (
        <div className={styles.paires}>
          {data.paires.map((paire, index) => {
            const state = paireStates[index] as PaireState | undefined;
            return (
              <div key={paire.rituel} className={`${styles.paire} card`}>
                <label className={styles.paireHead}>
                  <input type="checkbox" checked={state?.actif ?? false} onChange={() => togglePaire(index)} />
                  <span className={styles.paireRituel}>{paire.rituel}</span>
                </label>
                <label className={styles.paireSub}>
                  <span className={styles.paireFleche} aria-hidden="true">
                    →
                  </span>
                  <input
                    type="text"
                    className={styles.paireInput}
                    value={state?.substitution ?? paire.suggestion}
                    onChange={(e) => editSubstitution(index, e.target.value)}
                    aria-label={`Ma substitution pour : ${paire.rituel}`}
                  />
                </label>
              </div>
            );
          })}
        </div>
      )}

      {custom.length > 0 && (
        <div className={styles.customList}>
          {custom.map((item, index) => (
            <div key={`${item}-${index}`} className={styles.customItem}>
              <span>{item}</span>
              <button
                type="button"
                className={styles.customRemove}
                onClick={() => retirerCustom(index)}
                aria-label={`Retirer « ${item} »`}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {data.ajoutLibre && (
        <form className={styles.ajoutForm} onSubmit={ajouterLibre}>
          <input
            type="text"
            className={styles.ajoutInput}
            placeholder="Ajouter mon idée…"
            value={nouvel}
            onChange={(e) => setNouvel(e.target.value)}
            aria-label="Ajouter mon idée"
          />
          <button type="submit" className="btn btn--ghost" disabled={!nouvel.trim()}>
            <Plus size={16} aria-hidden="true" /> Ajouter
          </button>
        </form>
      )}
    </div>
  );
}
