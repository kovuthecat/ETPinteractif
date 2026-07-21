import { useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import PrintableLivret from '../../../components/PrintableLivret';
import { useSelection, type StrategieArret } from '../../../state/SelectionContext';
import { buildLivretSections } from './livretSections';
import styles from './PlanArretModule.module.css';

// « Mon plan d'arrêt » lit et écrit l'état de sélection partagé (SelectionContext,
// en mémoire) : chaque section est pré-remplie depuis ce qui a été choisi dans les
// autres modules, et l'éditer ici met à jour le même état (cohérence bidirectionnelle).
//
// Réduit à l'écran (revue-prod-2026-07/S2, RP2a) aux seules sections « ma date » et
// « si j'ai un écart » : les autres choix (substituts, situations, parades, raisons,
// contacts) restent alimentés par les modules amont dans le même `SelectionState` et
// ne sont plus redemandés ici — mais le livret imprimé (`livretSections.tsx`, inchangé)
// les lit tous et reste complet.

// Stratégie d'arrêt (section 1) — deux options également valables. Portée v1 :
// libellés seuls, aucun protocole/palier calculé. Textes cliniques à revalider.
const STRATEGIE_OPTIONS: { id: StrategieArret; label: string }[] = [
  { id: 'complet', label: 'Arrêt complet' }, // à revalider (Thibault)
  { id: 'progressive', label: 'Réduction progressive' }, // à revalider (Thibault)
];

// Plan de secours en cas d'écart — cf. plans/boite-a-outils/S2.md, outil `outil-faux-pas`.
const GESTES_ECART: string[] = [
  'Je jette le paquet et le briquet',
  "J'appelle quelqu'un — un proche ou le 39 89",
  "Je relis mes raisons d'arrêter",
  'Je continue mes substituts comme avant',
];

interface ChipGroupProps {
  fixedOptions: string[];
  selected: Set<string>;
  onToggleFixed: (value: string) => void;
  libres: string[];
  onAddLibre?: (value: string) => void;
  onRemoveLibre?: (value: string) => void;
  addPlaceholder?: string;
}

/** Rangée de chips multi-sélection, avec « + autre » optionnel (champ inline → Entrée = ajoute). */
function ChipGroup({
  fixedOptions,
  selected,
  onToggleFixed,
  libres,
  onAddLibre,
  onRemoveLibre,
  addPlaceholder,
}: ChipGroupProps) {
  const [inputValue, setInputValue] = useState('');

  // Commit partagé Entrée / blur (revue-prod-2026-07/S3, RP3b) : un texte tapé mais non
  // validé ne doit pas se perdre si l'utilisateur clique ailleurs (ex. « Imprimer ») sans
  // appuyer sur Entrée — le blur d'un champ se déclenche avant le clic d'un autre élément,
  // donc valider aussi au blur couvre ce cas. `trimmed` vide après un Entrée qui a déjà vidé
  // le champ ⇒ le blur suivant ne fait rien : pas de doublon possible.
  function commit() {
    const trimmed = inputValue.trim();
    if (trimmed && onAddLibre) {
      onAddLibre(trimmed);
      setInputValue('');
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    commit();
  }

  return (
    <div className={styles.chipRow}>
      {fixedOptions.map((option) => {
        const active = selected.has(option);
        return (
          <button
            key={option}
            type="button"
            className={`chip ${styles.chipBtn}${active ? ' activeDoubled' : ''}`}
            aria-pressed={active}
            onClick={() => onToggleFixed(option)}
          >
            {option}
          </button>
        );
      })}
      {libres.map((item) => (
        <button
          key={item}
          type="button"
          className={`chip ${styles.chipBtn} activeDoubled`}
          aria-pressed="true"
          aria-label={`${item} — touchez pour retirer`}
          onClick={() => onRemoveLibre?.(item)}
        >
          {item}
        </button>
      ))}
      {onAddLibre && (
        <input
          type="text"
          className={styles.chipInput}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={addPlaceholder ?? '+ autre'}
          aria-label={addPlaceholder ?? 'Ajouter un autre élément'}
        />
      )}
    </div>
  );
}

export default function PlanArretModule(_: ModuleProps) {
  const { state, toggle, add, remove, setDate, setStrategie, reset } = useSelection();
  const [livretOpen, setLivretOpen] = useState(false);

  const date = state.dateArret;
  const strategie = state.strategie;

  // Libellés adaptés à la stratégie — LIBELLÉS SEULS (aucun calcul de palier/date).
  // Sans choix (`null`), on garde le rendu d'aujourd'hui (rétrocompatibilité).
  // Tout texte clinique nouveau est à revalider (Thibault).
  const sectionDateLabel = strategie === null ? '1. Ma date' : '1. Ma stratégie et ma date'; // à revalider (Thibault)
  const dateFieldLabel =
    strategie === 'progressive' ? 'Ma date de début de réduction' : "Ma date d'arrêt"; // à revalider (Thibault)
  const dateVideAide =
    strategie === 'progressive'
      ? 'votre date de début de réduction — à choisir ensemble, à votre rythme' // à revalider (Thibault)
      : 'à choisir ensemble, quand vous serez prêt·e';

  const auMoinsUneSection =
    date !== '' ||
    state.substituts.length > 0 ||
    state.situations.length > 0 ||
    state.situationsLibres.length > 0 ||
    state.outilsFiche.length > 0 ||
    state.parades.length > 0 ||
    state.raisons.length > 0 ||
    state.gestesEcart.length > 0;

  let dateFormatee = '';
  if (date) {
    const [y, m, d] = date.split('-').map(Number);
    dateFormatee = new Date(y, m - 1, d).toLocaleDateString('fr-FR', { dateStyle: 'full' });
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Fixez votre date et préparez votre rebond. Tout ce que vous avez choisi dans les autres étapes
        (substituts, situations, raisons…) est repris dans votre livret.
      </p>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>{sectionDateLabel}</p>
        {/* Sélecteur de stratégie : 2 options également valables, même grammaire
            visuelle que les chips du module (radiogroup, cible ≥ 44 px). */}
        <p className={styles.renvoi}>Comment souhaitez-vous procéder ?</p>{/* à revalider (Thibault) */}
        <div className={styles.chipRow} role="radiogroup" aria-label="Ma stratégie d'arrêt">
          {STRATEGIE_OPTIONS.map(({ id, label }) => {
            const active = strategie === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`chip ${styles.chipBtn}${active ? ' activeDoubled' : ''}`}
                onClick={() => setStrategie(id)}
              >
                {label}
              </button>
            );
          })}
        </div>
        <input
          type="date"
          className={styles.dateInput}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          aria-label={dateFieldLabel}
        />
        {date ? (
          <p className={styles.dateRappel}>{dateFormatee}</p>
        ) : (
          <p className={styles.dateVide}>{dateVideAide}</p>
        )}
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>2. Si j'ai un écart</p>
        <p className={styles.renvoi}>
          Un écart n'est pas une rechute. Je prépare maintenant mes 3 gestes pour repartir aussitôt.
        </p>
        <ChipGroup
          fixedOptions={GESTES_ECART}
          selected={new Set(state.gestesEcart)}
          onToggleFixed={(v) => toggle('gestesEcart', v)}
          libres={state.gestesEcart.filter((v) => !GESTES_ECART.includes(v))}
          onAddLibre={(v) => add('gestesEcart', v)}
          onRemoveLibre={(v) => remove('gestesEcart', v)}
        />
      </section>

      <div className={styles.ficheButtonRow}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setLivretOpen(true)}
          disabled={!auMoinsUneSection}
        >
          Imprimer mon livret complet
        </button>
        <button
          type="button"
          className="btn btn--tertiary"
          onClick={reset}
          disabled={!auMoinsUneSection}
        >
          Réinitialiser mon plan
        </button>
      </div>

      {livretOpen && (
        <PrintableLivret
          coverEyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          coverTitle="Mon livret d'accompagnement"
          coverDate={dateFormatee}
          sections={buildLivretSections(state)}
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setLivretOpen(false)}
        />
      )}
    </div>
  );
}
