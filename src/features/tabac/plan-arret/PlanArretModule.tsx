import { useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import PrintableLivret from '../../../components/PrintableLivret';
import { SITUATIONS } from '../situations';
import { MOTIVATION_SEED } from '../motivation/data';
import { useSelection } from '../../../state/SelectionContext';
import { buildLivretSections } from './livretSections';
import styles from './PlanArretModule.module.css';

// « Mon plan d'arrêt » lit et écrit l'état de sélection partagé (SelectionContext,
// en mémoire) : chaque section est pré-remplie depuis ce qui a été choisi dans les
// autres modules, et l'éditer ici met à jour le même état (cohérence bidirectionnelle).

// Formes de substitut (id ↔ libellé). Les ids sont alignés sur `FormeId` de
// SubstitutsModule ; les libellés sur `FORMES_DATA[forme].label`.
const FORME_OPTIONS: { id: string; label: string }[] = [
  { id: 'patch', label: 'Patch (24 h / 16 h)' },
  { id: 'gomme', label: 'Gomme' },
  { id: 'pastille', label: 'Pastille' },
  { id: 'sublingual', label: 'Comprimé sublingual' },
  { id: 'spray', label: 'Spray buccal' },
  { id: 'vapoteuse', label: 'Vapoteuse' },
];

// Situations à risque = automatismes comportementaux (source partagée `situations.ts`).
const COMPORTEMENTALE = SITUATIONS.filter((s) => s.pilier === 'comportementale');
const SITUATION_LABELS = COMPORTEMENTALE.map((s) => s.label);
const SITUATION_LABEL_TO_ID = new Map(COMPORTEMENTALE.map((s) => [s.label, s.id]));

// Les 4D — cf. features/tabac/boite-a-outils (outil « vague »).
const PARADES: string[] = ['Différer', "Détourner l'attention", 'Se détendre — respirez', "D'eau"];

// Seed Motivation — libellés partagés avec MotivationModule (motivation/data.ts).
const RAISONS: string[] = MOTIVATION_SEED;

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

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && onAddLibre) {
      onAddLibre(trimmed);
      setInputValue('');
    }
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
          placeholder={addPlaceholder ?? '+ autre'}
          aria-label={addPlaceholder ?? 'Ajouter un autre élément'}
        />
      )}
    </div>
  );
}

export default function PlanArretModule(_: ModuleProps) {
  const { state, toggle, add, remove, setDate, reset } = useSelection();
  const [livretOpen, setLivretOpen] = useState(false);

  const date = state.dateArret;

  const situationsFixesLabels = new Set(
    COMPORTEMENTALE.filter((s) => state.situations.includes(s.id)).map((s) => s.label),
  );

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
        Rassemblez ce qui vous servira — à votre rythme, rien n'est obligatoire. Ce qui a été choisi dans les
        autres modules est déjà repris ici.
      </p>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>1. Ma date</p>
        <input
          type="date"
          className={styles.dateInput}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          aria-label="Ma date d'arrêt"
        />
        {date ? (
          <p className={styles.dateRappel}>{dateFormatee}</p>
        ) : (
          <p className={styles.dateVide}>à choisir ensemble, quand vous serez prêt·e</p>
        )}
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>2. Mes substituts</p>
        <div className={styles.chipRow}>
          {FORME_OPTIONS.map(({ id, label }) => {
            const active = state.substituts.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`chip ${styles.chipBtn}${active ? ' activeDoubled' : ''}`}
                aria-pressed={active}
                onClick={() => toggle('substituts', id)}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className={styles.renvoi}>La dose se règle par quarts, selon le ressenti.</p>
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>3. Mes situations à risque</p>
        <ChipGroup
          fixedOptions={SITUATION_LABELS}
          selected={situationsFixesLabels}
          onToggleFixed={(label) => {
            const id = SITUATION_LABEL_TO_ID.get(label);
            if (id) toggle('situations', id);
          }}
          libres={state.situationsLibres}
          onAddLibre={(v) => add('situationsLibres', v)}
          onRemoveLibre={(v) => remove('situationsLibres', v)}
        />
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>4. Mes parades</p>
        <ChipGroup
          fixedOptions={PARADES}
          selected={new Set(state.parades)}
          onToggleFixed={(v) => toggle('parades', v)}
          libres={state.parades.filter((v) => !PARADES.includes(v))}
          onAddLibre={(v) => add('parades', v)}
          onRemoveLibre={(v) => remove('parades', v)}
        />
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>5. Mes raisons</p>
        <ChipGroup
          fixedOptions={RAISONS}
          selected={new Set(state.raisons)}
          onToggleFixed={(v) => toggle('raisons', v)}
          libres={state.raisons.filter((v) => !RAISONS.includes(v))}
          onAddLibre={(v) => add('raisons', v)}
          onRemoveLibre={(v) => remove('raisons', v)}
        />
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>6. Autour de moi</p>
        <ul className={styles.autourList}>
          <li>
            Tabac Info Service — <strong>39 89</strong>
          </li>
          <li>En parler à un proche</li>
          <li>Être accompagné·e par un professionnel</li>
        </ul>
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>7. Si j'ai un écart</p>
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
