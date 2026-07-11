import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, RotateCcw, X } from 'lucide-react';
import type { ModuleProps } from '../../types';
import IllustrationSlot from '../components/IllustrationSlot';
import { CARDS, RENVOI_LABELS, type Verdict } from './data';
import styles from './IdeesRecuesModule.module.css';

/**
 * Module « Vrai ou faux ? » : les affirmations sont réparties sur un écran de
 * sélection (grille), le patient choisit celle qui lui parle, répond, voit la
 * révélation nuancée et sourcée, puis revient choisir une autre affirmation.
 * Support de discussion, pas un quiz noté — voir garde-fous : jamais de « Bonne
 * réponse ! » / « Perdu ! », pas de score, pas d'ordre imposé.
 */
export default function IdeesRecuesModule({ onNavigate }: ModuleProps) {
  const cards = CARDS.filter((c) => c.actif);
  const total = cards.length;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Verdict>>({});

  const card = selectedId ? (cards.find((c) => c.id === selectedId) ?? null) : null;
  const chosen = card ? answers[card.id] : undefined;
  const answeredCount = Object.keys(answers).length;

  function handleAnswer(choice: Verdict) {
    if (!card) return;
    setAnswers((prev) => ({ ...prev, [card.id]: choice }));
  }

  function reset() {
    setSelectedId(null);
    setAnswers({});
  }

  if (!card) {
    return (
      <div className={styles.module}>
        <p className={styles.intro}>
          À votre avis, vrai ou faux ? Cliquez sur une affirmation pour donner votre avis, puis
          regardons ce qu'en disent les faits.
        </p>

        <div className={styles.progressRow}>
          <span className={styles.progressText}>
            {answeredCount} / {total} vues
          </span>
          {answeredCount > 0 && (
            <button type="button" className="btn btn--tertiary" onClick={reset}>
              <RotateCcw aria-hidden="true" /> Recommencer
            </button>
          )}
        </div>

        <div className={styles.grid} role="list">
          {cards.map((c) => {
            const done = Boolean(answers[c.id]);
            return (
              <button
                key={c.id}
                type="button"
                role="listitem"
                className={`${styles.tile}${done ? ` ${c.verdict === 'vrai' ? styles.tileVrai : styles.tileFaux}` : ''}`}
                onClick={() => setSelectedId(c.id)}
              >
                {done && (
                  <span className={`chip ${c.verdict === 'vrai' ? 'chip--confort' : 'chip--vigilance'} ${styles.tileBadge}`}>
                    {c.verdict === 'vrai' ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                    {c.verdict === 'vrai' ? 'VRAI' : 'FAUX'}
                  </span>
                )}
                <span className={styles.tileText}>{c.affirmation}</span>
              </button>
            );
          })}
        </div>

      </div>
    );
  }

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={() => setSelectedId(null)}>
        <ChevronLeft aria-hidden="true" /> Toutes les affirmations
      </button>

      <div className={`${styles.card} card`}>
        <IllustrationSlot id={card.id} label={card.affirmation} size={96} />
        <p className={styles.affirmation}>{card.affirmation}</p>

        {!chosen ? (
          <div className={styles.choiceRow}>
            <button type="button" className={`btn ${styles.choiceBtn}`} onClick={() => handleAnswer('vrai')}>
              <Check aria-hidden="true" /> Vrai
            </button>
            <button type="button" className={`btn ${styles.choiceBtn}`} onClick={() => handleAnswer('faux')}>
              <X aria-hidden="true" /> Faux
            </button>
          </div>
        ) : (
          <div className={styles.reveal} aria-live="polite">
            <div className={styles.badges}>
              <span className={`chip ${card.verdict === 'vrai' ? 'chip--confort' : 'chip--vigilance'}`}>
                {card.verdict === 'vrai' ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                {card.verdict === 'vrai' ? 'VRAI' : 'FAUX'}
              </span>
              {card.nuance && <span className={`chip ${styles.chipNuance}`}>…et c'est plus nuancé</span>}
            </div>
            <p className={styles.explication}>{card.explication}</p>
            <p className={styles.source}>Source : {card.source}</p>
            {card.renvoi && (
              <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate(card.renvoi!)}>
                Approfondir → {RENVOI_LABELS[card.renvoi] ?? card.renvoi} <ArrowRight aria-hidden="true" />
              </button>
            )}
            <button type="button" className="btn btn--tertiary" onClick={() => setSelectedId(null)}>
              Choisir une autre affirmation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
