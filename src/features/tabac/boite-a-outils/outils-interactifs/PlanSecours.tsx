import { useState } from 'react';
import { Check, ChevronLeft, Phone } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import styles from './PlanSecours.module.css';

/**
 * Outil interactif « Si j'ai un écart — le plan de secours » (`outil-faux-pas`, OI9,
 * plans/outils-interactifs-2026-07/S6.md). Une carte d'action immédiate (pas une fiche à
 * lire) : les 3 gestes du `proposition` de l'outil, cochables sans persistance (geste
 * d'urgence, éphémère — l'écart et sa gestion ne sont pas des données à conserver), le
 * contact 39 89 mis en avant, et le rappel des raisons d'arrêter déjà saisies ailleurs.
 */

type GesteKey = 'jeter' | 'appeler' | 'relire';

// Verbatim, extrait (sans reformulation) de `outil.proposition` (outils.ts, l.233) :
// « Préparez, avant le jour J, un plan de secours en 3 gestes : 1. Je jette immédiatement
// le paquet et le briquet. 2. J'appelle quelqu'un — un proche, mon soignant, le 39 89.
// 3. Je relis mes raisons d'arrêter. » — isolés en 3 items cochables (même texte, mise en
// forme différente).
const GESTES: { id: GesteKey; texte: string }[] = [
  { id: 'jeter', texte: 'Je jette immédiatement le paquet et le briquet.' },
  { id: 'appeler', texte: "J'appelle quelqu'un — un proche, mon soignant, le 39 89." },
  { id: 'relire', texte: "Je relis mes raisons d'arrêter." },
];

export default function PlanSecours({ outil, contexte, onClose }: OutilInteractifProps) {
  // Non persistant à dessein (cf. décision S6/OI9) : cocher « fait » est un geste
  // d'urgence du moment, pas une donnée à conserver entre deux ouvertures de l'outil.
  const [faits, setFaits] = useState<Set<GesteKey>>(new Set());

  function toggleFait(id: GesteKey) {
    setFaits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const raisons = contexte?.raisons ?? [];

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onClose}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <div className={`${styles.bandeau} callout`}>
        <p className={styles.bandeauTitre}>{outil.accroche}</p>
        <p className={styles.bandeauCorps}>{outil.principe}</p>
      </div>

      <div className={styles.gestes}>
        {GESTES.map((g, i) => {
          const fait = faits.has(g.id);
          return (
            <label
              key={g.id}
              className={`${styles.geste}${fait ? ` ${styles.gesteFait}` : ''}`}
            >
              <input
                type="checkbox"
                className={styles.gesteInput}
                checked={fait}
                onChange={() => toggleFait(g.id)}
              />
              <span className={styles.gesteBadge} aria-hidden="true">
                {fait ? <Check size={22} /> : i + 1}
              </span>
              <span className={styles.gesteTexte}>{g.texte}</span>
            </label>
          );
        })}
      </div>

      <div className={`${styles.contact} fiche-contact`}>
        <Phone aria-hidden="true" />
        <p>Tabac Info Service</p>
        <span className="fiche-contact-numero">39 89</span>
      </div>

      <div className={styles.raisonsBlock}>
        <span className="eyebrow">Mes raisons d'arrêter</span>
        {raisons.length > 0 ? (
          <ul className={styles.raisonsList}>
            {raisons.map((raison) => (
              <li key={raison}>{raison}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.raisonsVide}>
            Notez vos raisons dans « Mon plan d'arrêt ».
          </p>
        )}
      </div>
    </div>
  );
}
