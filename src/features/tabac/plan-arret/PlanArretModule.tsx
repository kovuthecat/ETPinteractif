import { useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import styles from './PlanArretModule.module.css';

// Listes reprises verbatim des modules sources (copie assumée, cf. plans/extensions-tabac/X5.md
// et docs/BRIEF_TABAC.md §3.2). Chaque module reste isolé — pas d'import croisé.

// Substituts (5 formes) — cf. features/tabac/substituts/SubstitutsModule.tsx (FORMES_DATA).
const SUBSTITUTS: string[] = ['Patch (24 h / 16 h)', 'Gomme', 'Pastille', 'Comprimé sublingual', 'Spray buccal', 'Vapoteuse'];

// Situations à risque — automatismes du pilier comportemental, cf.
// features/tabac/addiction/AddictionModule.tsx (PILLARS_DATA.comportementale.exemples).
const SITUATIONS: string[] = [
  'Café-clope',
  'Après les repas',
  'En pause',
  'En voiture',
  'Avec le téléphone',
  'En social',
  "Avec l'alcool",
];

// Les 4D — cf. features/tabac/craving/CravingModule.tsx (D_INFO, dans l'ordre D_ORDER).
const PARADES: string[] = ['Différer', "Détourner l'attention", 'Se détendre — respirez', "D'eau"];

// Seed Motivation — cf. features/tabac/motivation/MotivationModule.tsx (MOTIVATION_SEED).
const RAISONS: string[] = ['Ma santé', 'Mes proches', 'Le budget', "Le goût / l'odorat", 'Mon souffle / ma forme', 'Ma liberté'];

// Plan de secours en cas d'écart — cf. plans/boite-a-outils/S2.md, outil 13 `outil-faux-pas`
// (contenu cohérent, adapté ici au format « plan personnel »).
const GESTES_ECART: string[] = [
  'Je jette le paquet et le briquet',
  "J'appelle quelqu'un — un proche ou le 39 89",
  "Je relis mes raisons d'arrêter",
  'Je continue mes substituts comme avant',
];

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/** Options cochées, dans l'ordre de la liste source, suivies des entrées libres (ordre d'ajout). */
function selectedItems(fixedOptions: string[], selected: Set<string>, libres: string[]): string[] {
  return [...fixedOptions.filter((option) => selected.has(option)), ...libres];
}

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
  const [date, setDate] = useState('');

  const [substituts, setSubstituts] = useState<Set<string>>(new Set());

  const [situationsFixes, setSituationsFixes] = useState<Set<string>>(new Set());
  const [situationsLibres, setSituationsLibres] = useState<string[]>([]);

  const [paradesFixes, setParadesFixes] = useState<Set<string>>(new Set());
  const [paradesLibres, setParadesLibres] = useState<string[]>([]);

  const [raisonsFixes, setRaisonsFixes] = useState<Set<string>>(new Set());
  const [raisonsLibres, setRaisonsLibres] = useState<string[]>([]);

  const [gestesEcartFixes, setGestesEcartFixes] = useState<Set<string>>(new Set());
  const [gestesEcartLibres, setGestesEcartLibres] = useState<string[]>([]);

  const [ficheOpen, setFicheOpen] = useState(false);

  const substitutsChoisis = selectedItems(SUBSTITUTS, substituts, []);
  const situationsChoisies = selectedItems(SITUATIONS, situationsFixes, situationsLibres);
  const paradesChoisies = selectedItems(PARADES, paradesFixes, paradesLibres);
  const raisonsChoisies = selectedItems(RAISONS, raisonsFixes, raisonsLibres);
  const gestesEcartChoisis = selectedItems(GESTES_ECART, gestesEcartFixes, gestesEcartLibres);

  const auMoinsUneSection =
    date !== '' ||
    substitutsChoisis.length > 0 ||
    situationsChoisies.length > 0 ||
    paradesChoisies.length > 0 ||
    raisonsChoisies.length > 0 ||
    gestesEcartChoisis.length > 0;

  let dateFormatee = '';
  if (date) {
    const [y, m, d] = date.split('-').map(Number);
    dateFormatee = new Date(y, m - 1, d).toLocaleDateString('fr-FR', { dateStyle: 'full' });
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        Rassemblez ce qui vous servira — à votre rythme, rien n'est obligatoire.
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
        <ChipGroup fixedOptions={SUBSTITUTS} selected={substituts} onToggleFixed={(v) => setSubstituts((s) => toggleInSet(s, v))} libres={[]} />
        <p className={styles.renvoi}>La dose se règle par quarts, selon le ressenti.</p>
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>3. Mes situations à risque</p>
        <ChipGroup
          fixedOptions={SITUATIONS}
          selected={situationsFixes}
          onToggleFixed={(v) => setSituationsFixes((s) => toggleInSet(s, v))}
          libres={situationsLibres}
          onAddLibre={(v) => setSituationsLibres((prev) => [...prev, v])}
          onRemoveLibre={(v) => setSituationsLibres((prev) => prev.filter((item) => item !== v))}
        />
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>4. Mes parades</p>
        <ChipGroup
          fixedOptions={PARADES}
          selected={paradesFixes}
          onToggleFixed={(v) => setParadesFixes((s) => toggleInSet(s, v))}
          libres={paradesLibres}
          onAddLibre={(v) => setParadesLibres((prev) => [...prev, v])}
          onRemoveLibre={(v) => setParadesLibres((prev) => prev.filter((item) => item !== v))}
        />
      </section>

      <section className={`card ${styles.section}`}>
        <p className={styles.sectionLabel}>5. Mes raisons</p>
        <ChipGroup
          fixedOptions={RAISONS}
          selected={raisonsFixes}
          onToggleFixed={(v) => setRaisonsFixes((s) => toggleInSet(s, v))}
          libres={raisonsLibres}
          onAddLibre={(v) => setRaisonsLibres((prev) => [...prev, v])}
          onRemoveLibre={(v) => setRaisonsLibres((prev) => prev.filter((item) => item !== v))}
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
          selected={gestesEcartFixes}
          onToggleFixed={(v) => setGestesEcartFixes((s) => toggleInSet(s, v))}
          libres={gestesEcartLibres}
          onAddLibre={(v) => setGestesEcartLibres((prev) => [...prev, v])}
          onRemoveLibre={(v) => setGestesEcartLibres((prev) => prev.filter((item) => item !== v))}
        />
      </section>

      <div className={styles.ficheButtonRow}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setFicheOpen(true)}
          disabled={!auMoinsUneSection}
        >
          Imprimer mon plan
        </button>
      </div>

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          titre="Mon plan d'arrêt"
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          {date ? (
            <p className="fiche-titre-xl">{dateFormatee}</p>
          ) : (
            <p className={styles.ficheDateVide}>date : à choisir</p>
          )}

          {substitutsChoisis.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Mes substituts</span>
              <ul className={styles.ficheList}>
                {substitutsChoisis.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {situationsChoisies.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Mes situations à risque</span>
              <ul className={styles.ficheList}>
                {situationsChoisies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {paradesChoisies.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Mes parades</span>
              <ul className={styles.ficheList}>
                {paradesChoisies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {gestesEcartChoisis.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Si j'ai un écart — repartir aussitôt</span>
              <p className={styles.ficheEcartPhrase}>
                Un écart n'est pas une rechute : les 24 heures qui suivent comptent.
              </p>
              <ul className={styles.ficheList}>
                {gestesEcartChoisis.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {raisonsChoisies.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Mes raisons</span>
              <ul className={styles.ficheList}>
                {raisonsChoisies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="fiche-bloc">
            <div className="fiche-contact">
              <span className="fiche-contact-numero">39 89</span>
              <div>
                <p>Tabac Info Service</p>
                <p>En parler à un proche · être accompagné·e par un professionnel</p>
              </div>
            </div>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
