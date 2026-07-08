import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { useRef } from 'react';
import styles from './Dial.module.css';

const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

  function valueFromPointer(clientX: number, clientY: number): number {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return value;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return clampValue(Math.round((angle / 360) * 10));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(valueFromPointer(e.clientX, e.clientY));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    onChange(valueFromPointer(e.clientX, e.clientY));
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
