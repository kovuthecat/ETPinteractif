import React, { useEffect, useId, useRef, useState } from 'react';
import type {
  DragEvent as ReactDragEvent,
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { GripVertical, Plus } from 'lucide-react';
import type { ModuleProps } from '../types';
import styles from './MotivationModule.module.css';

const MARGIN = 10;
const NUDGE_STEP = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface Carte {
  id: string;
  texte: string;
  detail: string;
  x: number;
  y: number;
  placed: boolean;
}

const SEED_CARTES: Omit<Carte, 'detail' | 'placed'>[] = [
  { id: 'sante', texte: 'Ma santé', x: 20, y: 22 },
  { id: 'argent', texte: "L'argent économisé", x: 50, y: 16 },
  { id: 'gout', texte: "Retrouver le goût et l'odorat", x: 80, y: 24 },
  { id: 'souffle', texte: 'Le souffle, la forme physique', x: 24, y: 62 },
  { id: 'proches', texte: 'Mes proches', x: 52, y: 70 },
  { id: 'liberte', texte: 'Ne plus dépendre de la cigarette', x: 80, y: 60 },
];

function relanceImportance(valeur: number): { bas?: string; haut?: string } {
  return {
    bas: valeur > 0 ? `Pourquoi pas ${valeur - 1} plutôt que ${valeur} ?` : undefined,
    haut:
      valeur < 10 ? `Qu'est-ce qui aiderait à passer à ${valeur + 1} ?` : undefined,
  };
}

function relanceConfiance(valeur: number): { bas?: string; haut?: string } {
  return {
    bas: valeur > 0 ? `Pourquoi pas ${valeur - 1} plutôt que ${valeur} ?` : undefined,
    haut:
      valeur < 10
        ? `Qu'est-ce qui vous ferait gagner un point de confiance ?`
        : undefined,
  };
}

type Onglet = 'echelles' | 'raisons';

export default function MotivationModule(_: ModuleProps) {
  const importanceId = useId();
  const confianceId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const [onglet, setOnglet] = useState<Onglet>('echelles');
  const [importance, setImportance] = useState(5);
  const [confiance, setConfiance] = useState(5);

  const [cartes, setCartes] = useState<Carte[]>(() =>
    SEED_CARTES.map((c) => ({ ...c, detail: '', placed: false })),
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  // Pour le drag HTML5 inter-zones, on stocke l'id en état React
  // (plus fiable que dataTransfer seul sur tous les navigateurs)
  const html5DragId = useRef<string | null>(null);

  // Surbrillance drop zones
  const [whiteboardOver, setWhiteboardOver] = useState(false);
  const [reserveOver, setReserveOver] = useState(false);

  // Pour le drag pointer intra-tableau (repositionnement)
  const dragOffset = useRef({ dx: 0, dy: 0 });

  useEffect(() => {
    if (!focusId) return;
    inputRefs.current.get(focusId)?.focus();
    setFocusId(null);
  }, [focusId]);

  const importanceRelance = relanceImportance(importance);
  const confianceRelance = relanceConfiance(confiance);

  function updateCarte(id: string, patch: Partial<Carte>) {
    setCartes((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function pointerPct(e: ReactPointerEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  // ── Drag intra-tableau (repositionnement des cartes placées) ────────────────
  function handlePointerDown(e: ReactPointerEvent<HTMLButtonElement>, id: string) {
    const carte = cartes.find((c) => c.id === id);
    if (!carte) return;
    const p = pointerPct(e);
    dragOffset.current = { dx: carte.x - p.x, dy: carte.y - p.y };
    setDragId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (dragId !== id) return;
    const p = pointerPct(e);
    updateCarte(id, {
      x: clamp(p.x + dragOffset.current.dx, MARGIN, 100 - MARGIN),
      y: clamp(p.y + dragOffset.current.dy, MARGIN, 100 - MARGIN),
    });
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (dragId !== id) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const dansLeTableau =
      !!rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!dansLeTableau) updateCarte(id, { placed: false });
    setDragId(null);
  }

  // ── Nudge clavier + Suppr pour retirer (cartes placées) ────────────────────
  function handleKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, id: string) {
    const deltas: Record<string, { dx: number; dy: number }> = {
      ArrowUp: { dx: 0, dy: -NUDGE_STEP },
      ArrowDown: { dx: 0, dy: NUDGE_STEP },
      ArrowLeft: { dx: -NUDGE_STEP, dy: 0 },
      ArrowRight: { dx: NUDGE_STEP, dy: 0 },
    };
    const delta = deltas[e.key];
    if (delta) {
      e.preventDefault();
      const carte = cartes.find((c) => c.id === id);
      if (!carte) return;
      updateCarte(id, {
        x: clamp(carte.x + delta.dx, MARGIN, 100 - MARGIN),
        y: clamp(carte.y + delta.dy, MARGIN, 100 - MARGIN),
      });
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      updateCarte(id, { placed: false });
    }
  }

  // ── Clavier pour cartes de réserve (Entrée/Espace = placer) ────────────────
  function handleReserveKeyDown(e: ReactKeyboardEvent<HTMLDivElement>, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const n = cartes.filter((c) => c.placed).length;
      const x = clamp(20 + ((n * 17) % 60), MARGIN, 100 - MARGIN);
      const y = clamp(20 + ((n * 29) % 60), MARGIN, 100 - MARGIN);
      updateCarte(id, { placed: true, x, y });
    }
  }

  // ── Drag HTML5 depuis la réserve ────────────────────────────────────────────
  function handleDragStart(e: ReactDragEvent<HTMLDivElement>, id: string) {
    html5DragId.current = id;
    try {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    } catch {
      // dataTransfer non disponible dans certains contextes (tests)
    }
  }

  function handleDragEnd() {
    html5DragId.current = null;
  }

  // ── Drop sur le tableau ─────────────────────────────────────────────────────
  function handleWhiteboardDragOver(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setWhiteboardOver(true);
  }

  function handleWhiteboardDragLeave(e: ReactDragEvent<HTMLDivElement>) {
    // Ne pas désactiver si la souris entre dans un enfant
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setWhiteboardOver(false);
    }
  }

  function handleWhiteboardDrop(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    setWhiteboardOver(false);
    const id = html5DragId.current ?? e.dataTransfer.getData('text/plain');
    if (!id) return;
    html5DragId.current = null;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      updateCarte(id, { placed: true });
      return;
    }
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, MARGIN, 100 - MARGIN);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, MARGIN, 100 - MARGIN);
    updateCarte(id, { placed: true, x, y });
  }

  // ── Drop sur la réserve (retour) ────────────────────────────────────────────
  function handleReserveDragOver(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setReserveOver(true);
  }

  function handleReserveDragLeave(e: ReactDragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setReserveOver(false);
    }
  }

  function handleReserveDrop(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    setReserveOver(false);
    const id = html5DragId.current ?? e.dataTransfer.getData('text/plain');
    if (!id) return;
    html5DragId.current = null;
    updateCarte(id, { placed: false });
  }

  // ── Ajout carte ─────────────────────────────────────────────────────────────
  function ajouterCarte() {
    const id = `carte-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const n = cartes.length;
    const x = clamp(20 + ((n * 17) % 60), MARGIN, 100 - MARGIN);
    const y = clamp(20 + ((n * 29) % 60), MARGIN, 100 - MARGIN);
    setCartes((prev) => [...prev, { id, texte: '', detail: '', x, y, placed: false }]);
    setFocusId(id);
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

  return (
    <div className={styles.module}>
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
        <h2 className={styles.sectionTitle}>Où en êtes-vous ?</h2>
        <p className={styles.sousTitre}>
          Deux échelles pour faire le point, à votre rythme — il n'y a pas de bonne réponse.
        </p>

        <div className={styles.echelle}>
          <label className={styles.echelleLabel} htmlFor={importanceId}>
            À quel point est-ce important pour vous d'arrêter ?
          </label>
          <input
            id={importanceId}
            type="range"
            min={0}
            max={10}
            step={1}
            value={importance}
            onChange={(e) => setImportance(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderBornes} aria-hidden="true">
            <span>0</span>
            <span>10</span>
          </div>
          <p className={styles.echelleValeur} aria-live="polite">
            {importance} / 10
          </p>
          <div className={styles.relance} aria-live="polite">
            {importanceRelance.bas && <p>{importanceRelance.bas}</p>}
            {importanceRelance.haut && <p>{importanceRelance.haut}</p>}
          </div>
        </div>

        <div className={styles.echelle}>
          <label className={styles.echelleLabel} htmlFor={confianceId}>
            À quel point vous sentez-vous capable / confiant(e) ?
          </label>
          <input
            id={confianceId}
            type="range"
            min={0}
            max={10}
            step={1}
            value={confiance}
            onChange={(e) => setConfiance(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderBornes} aria-hidden="true">
            <span>0</span>
            <span>10</span>
          </div>
          <p className={styles.echelleValeur} aria-live="polite">
            {confiance} / 10
          </p>
          <div className={styles.relance} aria-live="polite">
            {confianceRelance.bas && <p>{confianceRelance.bas}</p>}
            {confianceRelance.haut && <p>{confianceRelance.haut}</p>}
          </div>
        </div>
      </section>

      <section
        id="panel-raisons"
        role="tabpanel"
        aria-labelledby="tab-raisons"
        hidden={onglet !== 'raisons'}
        className={styles.section}
      >
        <h2 className={styles.sectionTitle}>Mes raisons</h2>
        <p className={styles.sousTitre}>
          Piochez dans la réserve les raisons qui comptent pour vous et glissez-les sur le tableau
          (ou appuyez sur Entrée/Espace pour placer la carte sélectionnée).
        </p>

        <div
          className={
            reserveOver
              ? `${styles.reserveBloc} ${styles.reserveBlocOver}`
              : styles.reserveBloc
          }
          onDragOver={handleReserveDragOver}
          onDragLeave={handleReserveDragLeave}
          onDrop={handleReserveDrop}
        >
          <h3 className={styles.reserveTitre}>Réserve</h3>
          <div className={styles.reserve}>
            {cartes
              .filter((carte) => !carte.placed)
              .map((carte) => (
                <div
                  key={carte.id}
                  className={styles.carteReserve}
                  draggable
                  tabIndex={0}
                  role="button"
                  aria-label={`Carte « ${carte.texte || 'sans titre'} » — glisser vers le tableau ou Entrée/Espace pour placer`}
                  onDragStart={(e) => handleDragStart(e, carte.id)}
                  onDragEnd={handleDragEnd}
                  onKeyDown={(e) => handleReserveKeyDown(e, carte.id)}
                >
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current.set(carte.id, el);
                      else inputRefs.current.delete(carte.id);
                    }}
                    className={styles.carteInputReserve}
                    value={carte.texte}
                    onChange={(e) => updateCarte(carte.id, { texte: e.target.value })}
                    placeholder="Une raison…"
                    aria-label="Texte de la raison"
                    // Empêcher le drag de l'input de capturer l'événement
                    onDragStart={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            {cartes.filter((carte) => !carte.placed).length === 0 && (
              <p className={styles.reserveVide}>Toutes les cartes sont sur le tableau.</p>
            )}
          </div>
        </div>

        <div
          className={
            whiteboardOver
              ? `${styles.whiteboard} ${styles.whiteboardOver}`
              : styles.whiteboard
          }
          ref={containerRef}
          onDragOver={handleWhiteboardDragOver}
          onDragLeave={handleWhiteboardDragLeave}
          onDrop={handleWhiteboardDrop}
        >
          {cartes
            .filter((carte) => carte.placed)
            .map((carte) => (
              <div
                key={carte.id}
                className={styles.carte}
                style={
                  {
                    '--carte-x': `${carte.x}%`,
                    '--carte-y': `${carte.y}%`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.carteHeader}>
                  <button
                    type="button"
                    className={styles.poignee}
                    onPointerDown={(e) => handlePointerDown(e, carte.id)}
                    onPointerMove={(e) => handlePointerMove(e, carte.id)}
                    onPointerUp={(e) => handlePointerUp(e, carte.id)}
                    onPointerCancel={() => setDragId((current) => (current === carte.id ? null : current))}
                    onKeyDown={(e) => handleKeyDown(e, carte.id)}
                    aria-label={`Déplacer « ${carte.texte || 'sans titre'} » (flèches ou glisser) · Suppr ou ← Retour arrière pour renvoyer à la réserve`}
                  >
                    <GripVertical size={18} aria-hidden="true" />
                  </button>
                </div>
                <input
                  ref={(el) => {
                    if (el) inputRefs.current.set(carte.id, el);
                    else inputRefs.current.delete(carte.id);
                  }}
                  className={styles.carteInput}
                  value={carte.texte}
                  onChange={(e) => updateCarte(carte.id, { texte: e.target.value })}
                  placeholder="Une raison…"
                  aria-label="Texte de la raison"
                />
                <textarea
                  className={styles.carteDetail}
                  value={carte.detail}
                  onChange={(e) => updateCarte(carte.id, { detail: e.target.value })}
                  placeholder="+ un détail (optionnel)"
                  aria-label="Détail personnel"
                  rows={2}
                />
              </div>
            ))}
        </div>

        <button type="button" className={styles.btnAjouter} onClick={ajouterCarte}>
          <Plus size={18} aria-hidden="true" />
          Une raison
        </button>
      </section>
    </div>
  );
}
