import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import styles from './PhraseRefus.module.css';

/**
 * Outil interactif « Ma phrase de refus » (`outil-refus`, OI10,
 * plans/outils-interactifs-2026-07/S6.md). Le patient choisit une variante courte de refus
 * (dont la phrase verbatim du `proposition`, cf. content/tabac/outils.ts l.192 : « Non merci,
 * j'ai arrêté. ») ou compose la sienne, et la garde dans sa fiche via `store` (clé `outil.id`
 * = `outil-refus`) — même convention que `PlansSiAlors` (S2) : lu une fois au montage, tenu à
 * jour localement en parallèle de chaque écriture dans `store`.
 */

// La 1ʳᵉ variante est verbatim (`proposition`) ; les suivantes sont d'autres formulations
// tout aussi courtes/fermes/sans justification (même grammaire que le `proposition` :
// « courte, ferme, sans justification ») pour laisser un choix — pas de source clinique
// dédiée à respecter mot pour mot au-delà de la phrase-modèle.
const VARIANTES: string[] = [
  "Non merci, j'ai arrêté.",
  'Non merci, je ne fume plus.',
  'Non merci, plus pour moi.',
  'Non, ça va, merci.',
];

// Astuces comportementales, extraites verbatim (sans reformulation) de `outil.proposition` :
// « Gardez un verre non alcoolisé en main — ça occupe le geste. Si l'envie monte,
// éloignez-vous quelques minutes. »
const ASTUCE =
  "Gardez un verre non alcoolisé en main — ça occupe le geste. Si l'envie monte, éloignez-vous quelques minutes.";

export default function PhraseRefus({ outil, store, onClose }: OutilInteractifProps) {
  const [phrase, setPhrase] = useState<string>(() => store.get(outil.id)[0] ?? '');

  function retenir(texte: string) {
    setPhrase(texte);
    const valeur = texte.trim();
    store.setList(outil.id, valeur ? [valeur] : []);
  }

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onClose}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <div className={styles.intro}>
        <p className={styles.titre}>{outil.titre}</p>
        <p className={styles.principe}>{outil.principe}</p>
      </div>

      <div className={`${styles.composer} card`}>
        <p className={styles.champLabel}>Choisissez une phrase…</p>
        <div className={styles.chipRow} role="radiogroup" aria-label="Choisir une phrase de refus">
          {VARIANTES.map((variante) => {
            const active = phrase === variante;
            return (
              <button
                key={variante}
                type="button"
                role="radio"
                aria-checked={active}
                className={`chip ${styles.chipBtn}${active ? ' activeDoubled' : ''}`}
                onClick={() => retenir(variante)}
              >
                {variante}
              </button>
            );
          })}
        </div>

        <label className={styles.libreLabel} htmlFor="phrase-refus-libre">
          … ou écrivez la vôtre — Ma phrase
        </label>
        <input
          id="phrase-refus-libre"
          type="text"
          className={styles.libreInput}
          value={phrase}
          onChange={(event) => retenir(event.target.value)}
          placeholder="Ma phrase"
        />
      </div>

      {phrase.trim() && (
        <p className={styles.retenue}>
          Phrase retenue : <strong>« {phrase.trim()} »</strong>
        </p>
      )}

      <p className={styles.astuce}>{ASTUCE}</p>

      <div className={`${styles.vigilance} callout`}>
        <p className={styles.vigilanceTexte}>
          Vigilance particulière avec l'alcool, qui baisse la garde : les premières semaines,
          mieux vaut le limiter.
        </p>
      </div>
    </div>
  );
}
