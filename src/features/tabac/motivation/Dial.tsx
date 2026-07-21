import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { useRef } from 'react';
import styles from './Dial.module.css';

const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** RP4b : rayon (px réels, le cadran fait 180px de diamètre) en-deçà et au-delà duquel un
 *  point de contact est ignoré — centre (angle extrêmement sensible au moindre pixel) et coins
 *  du carré englobant hors du disque visible (« zone neutre »). Sans ça, un tap n'importe où
 *  dans le carré (y compris en plein centre) fixait déjà la note. */
const MIN_HIT_RADIUS = 18;
const MAX_HIT_RADIUS = 92;
/** RP4b : distance (px) à parcourir avant qu'un contact ne soit traité comme un glissé — un
 *  simple clic/tap ne doit plus modifier la note (seul un geste de glissé le fait, cf. l'aide
 *  « Faites glisser autour du cercle »). Évite aussi qu'un tap imprécis près du haut du cadran
 *  (zone 0/10 adjacente) fasse « sauter » la valeur. */
const DRAG_START_THRESHOLD = 6;

function clampValue(value: number): number {
  return Math.min(10, Math.max(0, value));
}

interface DialProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color: string;
  trackColor: string;
}

export default function Dial({ value, onChange, label, color, trackColor }: DialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; dragging: boolean } | null>(null);

  /** Retourne `null` (aucun changement) si le point est hors de l'anneau de tolérance — c'est
   *  la « zone neutre » (centre ou coins) qui ne doit pas modifier la note (RP4b). */
  function valueFromPointer(clientX: number, clientY: number): number | null {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < MIN_HIT_RADIUS || dist > MAX_HIT_RADIUS) return null;
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return clampValue(Math.round((angle / 360) * 10));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    // RP4b : on arme juste l'interaction ici — un simple clic/tap ne doit pas, à lui seul,
    // changer la note (voir DRAG_START_THRESHOLD).
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: false };
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const drag = dragRef.current;
    if (!drag) return;
    if (!drag.dragging) {
      const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (moved < DRAG_START_THRESHOLD) return;
      drag.dragging = true;
    }
    const next = valueFromPointer(e.clientX, e.clientY);
    if (next !== null) onChange(next);
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function handlePointerCancel() {
    dragRef.current = null;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        onChange(clampValue(value + 1));
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        onChange(clampValue(value - 1));
        break;
      case 'Home':
        e.preventDefault();
        onChange(0);
        break;
      case 'End':
        e.preventDefault();
        onChange(10);
        break;
      default:
        break;
    }
  }

  const dashOffset = (CIRCUMFERENCE * (1 - value / 10)).toFixed(1);

  return (
    <div
      ref={ref}
      className={styles.dial}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-valuenow={value}
      aria-valuetext={`${value} sur 10`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      style={{ '--dial-color': color } as CSSProperties}
    >
      <svg viewBox="0 0 120 120" width="180" height="180" aria-hidden="true" focusable="false">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke={trackColor} strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE.toFixed(1)}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontFamily="'Work Sans', sans-serif"
          fontWeight={800}
          fontSize="34"
          fill={color}
        >
          {value}
        </text>
      </svg>
    </div>
  );
}
