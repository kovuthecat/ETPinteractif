import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import type { ModuleProps } from '../../types';
import IllustrationSlot from '../components/IllustrationSlot';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import { CARDS, RENVOI_LABELS, type Verdict } from './data';
import styles from './IdeesRecuesModule.module.css';

/**
 * Module « Vrai ou faux ? » : une carte à la fois, révélation nuancée et sourcée.
 * Support de discussion, pas un quiz noté — voir garde-fous : jamais de « Bonne
 * réponse ! » / « Perdu ! », pas de score.
 */
export default function IdeesRecuesModule({ onNavigate }: ModuleProps) {
  const cards = CARDS.filter((c) => c.actif);
  const total = cards.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Verdict>>({});

  const card = cards[index];
  const chosen = answers[card.id];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }

  function handleAnswer(choice: Verdict) {
    setAnswers((prev) => ({ ...prev, [card.id]: choice }));
  }

  function reset() {
    setIndex(0);
    setAnswers({});
  }

  return (
    <div className={styles.module}>
      <p className={styles.intro}>
        À votre avis, vrai ou faux ? Répondez, puis regardons ce qu'en disent les faits.
      </p>

      <div className={styles.points} role="group" aria-label="Aller à une carte">
        {cards.map((c, i) => {
          const done = Boolean(answers[c.id]);
          const current = i === index;
          return (
            <button
              key={c.id}
              type="button"
              className={`${styles.pointDot}${current ? ` ${styles.pointCurrent}` : ''}${done ? ` ${styles.pointDone}` : ''}`}
              aria-current={current ? 'true' : undefined}
              aria-label={`Carte ${i + 1} sur ${total}${done ? ', déjà vue' : ''}`}
              onClick={() => goTo(i)}
            />
          );
        })}
      </div>

      <div className={styles.navRow}>
        <button
          type="button"
          className={styles.arrowBtn}
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          aria-label="Carte précédente"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <span className={styles.counter}>
          Carte {index + 1} / {total}
        </span>
        <button
          type="button"
          className={styles.arrowBtn}
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          aria-label="Carte suivante"
        >
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" className="btn btn--tertiary" onClick={reset}>
          <RotateCcw aria-hidden="true" /> Recommencer
        </button>
      </div>

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
          </div>
        )}
      </div>

      <ModuleFooterNav
        items={[
          { id: 'nicotine-toxique', label: "La nicotine n'est pas le toxique" },
          { id: 'benefices-arret', label: "Ce que l'arrêt répare" },
        ]}
        onNavigate={onNavigate}
      />
    </div>
  );
}
