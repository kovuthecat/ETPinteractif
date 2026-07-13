import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Plus } from 'lucide-react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import { useSelection } from '../../../state/SelectionContext';
import Dial from './Dial';
import { MOTIVATION_SEED, iconForRaison } from './data';
import styles from './MotivationModule.module.css';

const MOVE_THRESHOLD = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface CarteReserve {
  id: number;
  label: string;
}

interface CarteBoard {
  id: number;
  label: string;
  detail: string;
  color: string;
  x: number;
  y: number;
}

const MOTIVATION_COLORS = [
  'oklch(55% 0.15 30)',
  'oklch(58% 0.09 145)',
  'oklch(62% 0.13 80)',
  'oklch(48% 0.08 230)',
];

function boardGridPosition(index: number): { x: number; y: number } {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return { x: 18 + col * 32, y: 20 + row * 30 };
}

/** Amorce le tableau/la réserve depuis les raisons déjà retenues (état partagé).
 *  Chaque raison retenue devient une carte ; les graines non retenues restent en
 *  réserve. Les ids sont uniques sur les deux listes. */
function seedFromRaisons(chosen: string[]): {
  board: CarteBoard[];
  reserve: CarteReserve[];
  nextId: number;
} {
  let counter = 1;
  const board: CarteBoard[] = chosen.map((label, i) => {
    const id = counter++;
    const { x, y } = boardGridPosition(i);
    return { id, label, detail: '', color: MOTIVATION_COLORS[id % MOTIVATION_COLORS.length], x, y };
  });
  const reserve: CarteReserve[] = MOTIVATION_SEED.filter((s) => !chosen.includes(s)).map((label) => ({
    id: counter++,
    label,
  }));
  return { board, reserve, nextId: counter };
}

function relance(valeur: number): { bas?: string; haut?: string } {
  return {
    bas: valeur > 0 ? `Pourquoi pas ${valeur - 1} plutôt que ${valeur} ?` : undefined,
    haut: valeur < 10 ? `Qu'est-ce qui aiderait à passer à ${valeur + 1} ?` : undefined,
  };
}

type Onglet = 'echelles' | 'raisons';
type Etape = 0 | 1 | 2;

export default function MotivationModule(_props: ModuleProps) {
  const { state, setList } = useSelection();
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; startX: number; startY: number; moved: boolean } | null>(null);

  const [onglet, setOnglet] = useState<Onglet>('echelles');
  const [etape, setEtape] = useState<Etape>(0);
  const [importance, setImportance] = useState(5);
  const [confiance, setConfiance] = useState(5);
  const [importanceTouched, setImportanceTouched] = useState(false);
  const [confianceTouched, setConfianceTouched] = useState(false);
  const [ficheOpen, setFicheOpen] = useState(false);

  // Amorçage au montage uniquement (l'état partagé est la source des raisons).
  const initialSeed = useMemo(() => seedFromRaisons(state.raisons), []);
  const [raisonsReserve, setRaisonsReserve] = useState<CarteReserve[]>(initialSeed.reserve);
  const [raisonsBoard, setRaisonsBoard] = useState<CarteBoard[]>(initialSeed.board);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const nextCardId = useRef(initialSeed.nextId);

  // Reflète les libellés des cartes du tableau dans l'état partagé. Ne se
  // déclenche que lorsque les LIBELLÉS changent (pas au simple déplacement).
  const raisonsLabelsKey = JSON.stringify(raisonsBoard.map((c) => c.label));
  useEffect(() => {
    const labels = raisonsBoard
      .map((c) => c.label)
      .filter((label, i, arr) => arr.indexOf(label) === i);
    setList('raisons', labels);
  }, [raisonsLabelsKey, setList]);

  const importanceRelance = relance(importance);
  const confianceRelance = relance(confiance);

  function handleImportanceChange(v: number) {
    setImportance(v);
    setImportanceTouched(true);
  }

  function handleConfianceChange(v: number) {
    setConfiance(v);
    setConfianceTouched(true);
  }

  function restartSteps() {
    setEtape(0);
    setImportanceTouched(false);
    setConfianceTouched(false);
  }

  const onglets: { id: Onglet; label: string }[] = [
    { id: 'echelles', label: 'Où en êtes-vous ?' },
    { id: 'raisons', label: 'Mes raisons' },
  ];

  function handleTabKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const nextIndex = (index + (e.key === 'ArrowRight' ? 1 : -1) + onglets.length) % onglets.length;
    setOnglet(onglets[nextIndex].id);
  }

  // ── Réserve → tableau ────────────────────────────────────────────────────
  function addToBoard(reserveId: number) {
    const item = raisonsReserve.find((r) => r.id === reserveId);
    if (!item) return;
    const { x, y } = boardGridPosition(raisonsBoard.length);
    const id = nextCardId.current;
    nextCardId.current += 1;
    setRaisonsBoard((prev) => [
      ...prev,
      { id, label: item.label, detail: '', color: MOTIVATION_COLORS[id % MOTIVATION_COLORS.length], x, y },
    ]);
    setRaisonsReserve((prev) => prev.filter((r) => r.id !== reserveId));
  }

  function addFreeCard() {
    const { x, y } = boardGridPosition(raisonsBoard.length);
    const id = nextCardId.current;
    nextCardId.current += 1;
    setRaisonsBoard((prev) => [
      ...prev,
      { id, label: 'Nouvelle raison', detail: '', color: MOTIVATION_COLORS[id % MOTIVATION_COLORS.length], x, y },
    ]);
    setEditingCardId(id);
  }

  function updateCardField(id: number, field: 'label' | 'detail', value: string) {
    setRaisonsBoard((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function deleteCard(id: number) {
    setRaisonsBoard((prev) => prev.filter((c) => c.id !== id));
    setEditingCardId((current) => (current === id ? null : current));
  }

  function toggleEditing(id: number) {
    setEditingCardId((current) => (current === id ? null : id));
  }

  // ── Repositionnement au pointeur + clic sans déplacement = édition ──────
  function handleCardPointerDown(e: ReactPointerEvent<HTMLButtonElement>, id: number) {
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleCardPointerMove(e: ReactPointerEvent<HTMLButtonElement>, id: number) {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;
    if (Math.abs(e.clientX - drag.startX) > MOVE_THRESHOLD || Math.abs(e.clientY - drag.startY) > MOVE_THRESHOLD) {
      drag.moved = true;
    }
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 4, 92);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 6, 86);
    setRaisonsBoard((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
  }

  function handleCardPointerUp(id: number) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag && drag.id === id && !drag.moved) {
      toggleEditing(id);
    }
  }

  function handleCardPointerCancel() {
    dragRef.current = null;
  }

  function handleCardKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, id: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleEditing(id);
    }
  }

  return (
    <div className={styles.module}>
      <p className={styles.subtitle}>À votre rythme, sans jugement. Pas de liste avantages/inconvénients ici.</p>

      <div className={styles.tabs} role="tablist" aria-label="Étapes du module Motivation">
        {onglets.map((o, index) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            id={`tab-${o.id}`}
            aria-selected={onglet === o.id}
            aria-controls={`panel-${o.id}`}
            tabIndex={onglet === o.id ? 0 : -1}
            className={onglet === o.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setOnglet(o.id)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <section
        id="panel-echelles"
        role="tabpanel"
        aria-labelledby="tab-echelles"
        hidden={onglet !== 'echelles'}
        className={styles.section}
      >
        {etape === 0 && (
          <div className={`${styles.stepPanel} ${styles.stepPanelImportance}`}>
            <p className={styles.stepLabel}>Question 1 sur 2</p>
            <p className={styles.stepQuestion}>À quel point est-ce important pour vous d'arrêter ?</p>
            <Dial
              value={importance}
              onChange={handleImportanceChange}
              label="Importance d'arrêter, de 0 à 10"
              color="var(--color-confort)"
              trackColor="var(--color-confort-soft)"
            />
            <p className={styles.stepHint}>Faites glisser autour du cercle</p>
            {importanceTouched && (
              <>
                <div className={styles.relanceStack} aria-live="polite">
                  {importanceRelance.bas && <p className={styles.relanceBubble}>{importanceRelance.bas}</p>}
                  {importanceRelance.haut && <p className={styles.relanceBubble}>{importanceRelance.haut}</p>}
                </div>
                <button
                  type="button"
                  className={`${styles.stepButton} ${styles.stepButtonImportance}`}
                  onClick={() => setEtape(1)}
                >
                  Suivant →
                </button>
              </>
            )}
          </div>
        )}

        {etape === 1 && (
          <div className={`${styles.stepPanel} ${styles.stepPanelConfiance}`}>
            <p className={styles.stepLabel}>Question 2 sur 2</p>
            <p className={styles.stepQuestion}>À quel point vous sentez-vous capable / confiant(e) ?</p>
            <Dial
              value={confiance}
              onChange={handleConfianceChange}
              label="Confiance en sa capacité d'arrêter, de 0 à 10"
              color="var(--color-nav)"
              trackColor="var(--color-nav-soft)"
            />
            <p className={styles.stepHint}>Faites glisser autour du cercle</p>
            {confianceTouched && (
              <>
                <div className={styles.relanceStack} aria-live="polite">
                  {confianceRelance.bas && <p className={styles.relanceBubble}>{confianceRelance.bas}</p>}
                  {confianceRelance.haut && <p className={styles.relanceBubble}>{confianceRelance.haut}</p>}
                </div>
                <button
                  type="button"
                  className={`${styles.stepButton} ${styles.stepButtonConfiance}`}
                  onClick={() => setEtape(2)}
                >
                  Terminer →
                </button>
              </>
            )}
          </div>
        )}

        {etape === 2 && (
          <div className={`${styles.stepPanel} ${styles.stepPanelDone}`}>
            <p className={styles.doneTitle}>Merci d'avoir pris ce temps.</p>
            <div className={styles.recapRow}>
              <div className={`${styles.recapCard} ${styles.recapCardImportance}`}>
                <p className={styles.recapLabel}>Importance</p>
                <p className={`${styles.recapValue} ${styles.recapValueImportance}`}>
                  {importance}
                  <span className={styles.recapUnit}>/10</span>
                </p>
              </div>
              <div className={`${styles.recapCard} ${styles.recapCardConfiance}`}>
                <p className={styles.recapLabel}>Confiance</p>
                <p className={`${styles.recapValue} ${styles.recapValueConfiance}`}>
                  {confiance}
                  <span className={styles.recapUnit}>/10</span>
                </p>
              </div>
            </div>
            <button type="button" className={styles.restartBtn} onClick={restartSteps}>
              ↺ Revoir mes réponses
            </button>
            {raisonsBoard.length > 0 && (
              <button
                type="button"
                className={`btn btn--ghost ${styles.ficheButton}`}
                onClick={() => setFicheOpen(true)}
              >
                Imprimer mes raisons
              </button>
            )}
          </div>
        )}
      </section>

      <section
        id="panel-raisons"
        role="tabpanel"
        aria-labelledby="tab-raisons"
        hidden={onglet !== 'raisons'}
        className={styles.section}
      >
        <div ref={boardRef} className={styles.board}>
          {raisonsBoard.length === 0 && (
            <p className={styles.boardEmpty}>
              Cliquez sur une raison dans la réserve pour l'ajouter au tableau, ou créez-en une nouvelle.
            </p>
          )}
          {raisonsBoard.map((carte) => (
            <div
              key={carte.id}
              className={styles.boardCardWrap}
              style={{ '--carte-x': `${carte.x}%`, '--carte-y': `${carte.y}%` } as React.CSSProperties}
            >
              {editingCardId === carte.id ? (
                <div className={styles.boardCardEditing} style={{ borderColor: carte.color }}>
                  <input
                    className={styles.cardLabelInput}
                    value={carte.label}
                    onChange={(e) => updateCardField(carte.id, 'label', e.target.value)}
                    aria-label="Texte de la raison"
                  />
                  <textarea
                    className={styles.cardDetailInput}
                    value={carte.detail}
                    onChange={(e) => updateCardField(carte.id, 'detail', e.target.value)}
                    placeholder="Précisez si besoin…"
                    aria-label="Détail personnel"
                    rows={2}
                  />
                  <div className={styles.cardEditFooter}>
                    <button type="button" className={styles.cardDeleteBtn} onClick={() => deleteCard(carte.id)}>
                      Supprimer
                    </button>
                    <button type="button" className={styles.cardOkBtn} onClick={() => setEditingCardId(null)}>
                      OK
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.boardCard}
                  style={{ background: carte.color }}
                  onPointerDown={(e) => handleCardPointerDown(e, carte.id)}
                  onPointerMove={(e) => handleCardPointerMove(e, carte.id)}
                  onPointerUp={() => handleCardPointerUp(carte.id)}
                  onPointerCancel={handleCardPointerCancel}
                  onKeyDown={(e) => handleCardKeyDown(e, carte.id)}
                  aria-label={`${carte.label}${carte.detail ? ` — ${carte.detail}` : ''} — glisser pour repositionner, Entrée pour modifier`}
                >
                  {(() => {
                    const Icon = iconForRaison(carte.label);
                    return <Icon size={17} aria-hidden="true" />;
                  })()}
                  <span>{carte.label}</span>
                  {carte.detail && <span className={styles.boardCardDetail}>{carte.detail}</span>}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className={styles.reserveLabel}>Réserve · cliquez pour ajouter au tableau</p>
        <div className={styles.reserveRow}>
          {raisonsReserve.map((r) => {
            const Icon = iconForRaison(r.label);
            return (
              <button key={r.id} type="button" className={styles.reserveCard} onClick={() => addToBoard(r.id)}>
                <Icon size={16} aria-hidden="true" className={styles.reserveCardIcon} />
                <span>{r.label}</span>
              </button>
            );
          })}
          <button type="button" className={`btn btn--primary ${styles.addCardBtn}`} onClick={addFreeCard}>
            <Plus size={16} aria-hidden="true" />
            une raison
          </button>
        </div>

        {raisonsBoard.length > 0 && (
          <button
            type="button"
            className={`btn btn--ghost ${styles.ficheButton}`}
            onClick={() => setFicheOpen(true)}
          >
            Imprimer mes raisons
          </button>
        )}
      </section>

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          titre="Mes raisons d'arrêter"
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <ul className={styles.ficheRaisonsList}>
            {raisonsBoard.map((carte) => (
              <li key={carte.id} className={styles.ficheRaisonItem}>
                <span className={styles.ficheRaisonDot} style={{ background: carte.color }} aria-hidden="true" />
                <div>
                  <p className={styles.ficheRaisonLabel}>{carte.label}</p>
                  {carte.detail && <p className={styles.ficheRaisonDetail}>{carte.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
          {(importanceTouched || confianceTouched) && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Où j'en suis</span>
              <p className={styles.ficheEchelles}>
                {importanceTouched && (
                  <span className={styles.ficheEchelleItem}>
                    Importance <strong>{importance}</strong>/10
                  </span>
                )}
                {confianceTouched && (
                  <span className={styles.ficheEchelleItem}>
                    Confiance <strong>{confiance}</strong>/10
                  </span>
                )}
              </p>
            </div>
          )}
        </FicheOverlay>
      )}
    </div>
  );
}
