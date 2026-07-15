import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Pencil, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { readJSON, writeJSON } from '../lib/storage';
import styles from './PatientCarnet.module.css';

interface PatientCarnetProps {
  /** Retour à l'accueil de l'app patient (géré par PatientApp). */
  onBack: () => void;
}

/** Clé localStorage dédiée (E7, revue-chrome-2026-07) — cf. `src/patient/lib/storage.ts`. */
const STORAGE_KEY = 'etp.patient.carnetConso';

/** Une entrée = une consommation (décision tranchée du plan, cf. S16.md). */
interface CarnetEntry {
  id: string;
  /** Format `datetime-local` (`YYYY-MM-DDTHH:mm`), toujours en heure locale du patient. */
  dateHeure: string;
  contexte: string;
  ressenti: string;
}

interface FormState {
  dateHeure: string;
  contexte: string;
  ressenti: string;
}

function genId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** `datetime-local` attend `YYYY-MM-DDTHH:mm` en heure locale (jamais UTC). */
function nowLocalDateTime(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function emptyForm(): FormState {
  return { dateHeure: nowLocalDateTime(), contexte: '', ressenti: '' };
}

/** Une chaîne `datetime-local` sans décalage est interprétée en heure locale par `Date` (spec ES2015). */
function formatDateHeure(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

/**
 * Écran patient « Mon carnet de suivi » (E7, revue-chrome-2026-07) : saisie rapide d'une
 * consommation (date/heure, contexte, ressenti), historique chronologique, édition/suppression
 * d'une entrée, effacement global. Persistance strictement locale (`storage.ts`, créé en S12) —
 * jamais de réseau. Si `localStorage` est indisponible (mode privé strict, quota), `readJSON`/
 * `writeJSON` retombent silencieusement : l'écran reste utilisable, l'état vit alors uniquement
 * en mémoire React le temps de la session (pas de crash, cf. S16 « Si bloqué »).
 */
export default function PatientCarnet({ onBack }: PatientCarnetProps) {
  const [entries, setEntries] = useState<CarnetEntry[]>(() => readJSON<CarnetEntry[]>(STORAGE_KEY, []));
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function persist(next: CarnetEntry[]) {
    setEntries(next);
    writeJSON(STORAGE_KEY, next);
  }

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.dateHeure) return;
    const contexte = form.contexte.trim();
    const ressenti = form.ressenti.trim();

    if (editingId) {
      persist(
        entries.map((entry) =>
          entry.id === editingId ? { ...entry, dateHeure: form.dateHeure, contexte, ressenti } : entry,
        ),
      );
    } else {
      const entry: CarnetEntry = { id: genId(), dateHeure: form.dateHeure, contexte, ressenti };
      persist([entry, ...entries]);
    }
    resetForm();
  }

  function startEdit(entry: CarnetEntry) {
    setConfirmClear(false);
    setEditingId(entry.id);
    setForm({ dateHeure: entry.dateHeure, contexte: entry.contexte, ressenti: entry.ressenti });
  }

  function removeEntry(id: string) {
    persist(entries.filter((entry) => entry.id !== id));
    if (editingId === id) resetForm();
  }

  function clearAll() {
    persist([]);
    setConfirmClear(false);
    resetForm();
  }

  // Liste chronologique, la plus récente en tête (v1 = liste ; courbe d'évolution = option ultérieure).
  const triees = [...entries].sort((a, b) => (a.dateHeure < b.dateHeure ? 1 : -1));

  return (
    <div className={styles.screen}>
      <button type="button" className={`btn btn--ghost ${styles.back}`} onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" />
        Accueil
      </button>
      <h1 className={styles.titre}>Mon carnet de suivi</h1>
      {/* à revalider (Thibault) : phrase de cadrage auto-portante */}
      <p className={styles.intro}>
        Notez chaque cigarette pour mieux repérer vos moments à risque, à votre rythme.
      </p>

      <div className={styles.confidentiel}>
        <ShieldCheck size={20} aria-hidden="true" />
        <p className={styles.confidentielText}>
          Ces données restent uniquement sur cet appareil : elles ne sont jamais envoyées ni partagées.
        </p>
      </div>

      <form className={`${styles.form} card`} onSubmit={handleSubmit}>
        <p className={styles.formTitle}>{editingId ? "Modifier l'entrée" : 'Ajouter une consommation'}</p>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Date et heure</span>
          <input
            type="datetime-local"
            className={styles.input}
            value={form.dateHeure}
            onChange={(e) => setForm({ ...form, dateHeure: e.target.value })}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Contexte</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Ex. pause café, stress au travail…"
            value={form.contexte}
            onChange={(e) => setForm({ ...form, contexte: e.target.value })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Ressenti</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Ex. envie forte, soulagement…"
            value={form.ressenti}
            onChange={(e) => setForm({ ...form, ressenti: e.target.value })}
          />
        </label>
        <div className={styles.formActions}>
          <button type="submit" className="btn btn--primary">
            <Plus size={16} aria-hidden="true" />
            {editingId ? 'Enregistrer' : 'Ajouter'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--ghost" onClick={resetForm}>
              <X size={16} aria-hidden="true" />
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className={styles.listHead}>
        <span className={styles.listTitle}>Historique</span>
        {entries.length > 0 &&
          (confirmClear ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Effacer tout le carnet ?</span>
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmClear(false)}>
                Annuler
              </button>
              <button type="button" className={`btn ${styles.btnDanger}`} onClick={clearAll}>
                Confirmer
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`btn btn--ghost ${styles.clearBtn}`}
              onClick={() => setConfirmClear(true)}
            >
              <Trash2 size={16} aria-hidden="true" />
              Effacer le carnet
            </button>
          ))}
      </div>

      {triees.length === 0 ? (
        <p className={styles.empty}>Aucune entrée pour l'instant. Ajoutez votre première consommation ci-dessus.</p>
      ) : (
        <ul className={styles.list}>
          {triees.map((entry) => (
            <li key={entry.id} className={`${styles.entry} card`}>
              <div className={styles.entryHead}>
                <span className={styles.entryDate}>{formatDateHeure(entry.dateHeure)}</span>
                <div className={styles.entryActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => startEdit(entry)}
                    aria-label="Modifier cette entrée"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => removeEntry(entry.id)}
                    aria-label="Supprimer cette entrée"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              {entry.contexte && (
                <p className={styles.entryLine}>
                  <span className={styles.entryLabel}>Contexte —</span> {entry.contexte}
                </p>
              )}
              {entry.ressenti && (
                <p className={styles.entryLine}>
                  <span className={styles.entryLabel}>Ressenti —</span> {entry.ressenti}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
