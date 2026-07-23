import { useState } from 'react';
import { Info, Plus, X } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import Silhouette, { type SilhouetteZoneState, type ZoneId } from '../components/Silhouette';
import { CLASSES, classById, lignesInitiales, newLigne, type Ligne } from './data';
import styles from './TraitementsModule.module.css';

/**
 * Module 11 — Mes traitements qui protègent (C17, plans/theme-cardio-2026-07/S13.md).
 * Remplace « mes cachets font baisser un chiffre » par « mes traitements gardent mes artères » :
 * l'ordonnance est transcrite ligne par ligne (gauche) ; cliquer une ligne allume, sur la
 * silhouette partagée (droite, S3 — même dimensionnement 560px que `territoires`), les zones
 * que la **classe** de ce traitement protège (état `'allume'`, halo positif).
 *
 * Verrou anti-auto-prescription (§M11, impératif G1) : on **transcrit et explique**, on ne
 * **compare ni ne choisit** aucune molécule — une seule ligne (ou « toute l'ordonnance ») est
 * lue à la fois, jamais deux options mises en regard. La zone d'action est attachée à la
 * **classe/rôle** (durable, menu `<select>`), la molécule n'est qu'une étiquette libre posée
 * par le soignant (anti-obsolescence) — cf. `data.ts`.
 *
 * ⚠️ Corps pur (§M11) : la silhouette n'utilise ici que les états `'actif'` (non protégé) et
 * `'allume'` (protégé, halo positif) — jamais un état d'alerte. **Aucune aspirine/antiagrégant**
 * dans la table de classes (décision G1, cohérence M10) : voir `data.ts`.
 *
 * Pas de renvoi inline inter-modules (correction Thibault 2026-07-23) : le soignant navigue
 * lui-même. Pas de fiche (pas d'écran de clôture séparé) : la silhouette pleinement allumée, en
 * mode « toute l'ordonnance », est la sortie naturelle du module.
 */

type ViewMode = 'line' | 'all';

// Ordre d'affichage des zones sur la silhouette (repris de `territoires/TerritoiresModule.tsx`).
const ZONES_ORDRE: ZoneId[] = ['coeur', 'cerveau', 'reins', 'jambes'];

interface WatchBadgeProps {
  tooltip: string;
}

/** Pastille 2ᵉ niveau « quoi surveiller » sur la ligne (jamais sur le corps) — cf.
 *  `diabete/traitements/TraitementsModule.tsx` (`LigneBadge`), variante sans porte de
 *  navigation (aucun module dédié « quoi surveiller » côté cardio). */
function WatchBadge({ tooltip }: WatchBadgeProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.badgeWrap}>
      <button
        type="button"
        className={styles.badgeBtn}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={tooltip}
      >
        <Info size={16} aria-hidden="true" />
      </button>
      {open && (
        <span role="tooltip" className={styles.badgePanel}>
          {tooltip}
        </span>
      )}
    </span>
  );
}

export default function TraitementsModule({ shell }: ModuleProps) {
  const [lignes, setLignes] = useState<Ligne[]>(lignesInitiales);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('line');

  const addLigne = () => setLignes((prev) => [...prev, newLigne('', CLASSES[0].id)]);
  const removeLigne = (uid: string) => setLignes((prev) => prev.filter((l) => l.uid !== uid));
  const changeMolecule = (uid: string, molecule: string) =>
    setLignes((prev) => prev.map((l) => (l.uid === uid ? { ...l, molecule } : l)));
  const changeClasse = (uid: string, classId: string) =>
    setLignes((prev) => prev.map((l) => (l.uid === uid ? { ...l, classId } : l)));
  const selectLigne = (uid: string) => {
    setViewMode('line');
    setSelectedUid((current) => (current === uid ? null : uid));
  };
  const showAll = () => {
    setViewMode('all');
    setSelectedUid(null);
  };

  const presentes = lignes.filter((l) => l.molecule.trim() !== '');
  const selectedLigne = selectedUid ? (lignes.find((l) => l.uid === selectedUid) ?? null) : null;

  // Zones allumées selon le mode de vue. Verrou anti-auto-prescription : jamais plus d'une ligne
  // « lue » à la fois hors du mode « toute l'ordonnance » — pas de mise en regard de deux classes.
  const litZones: Record<ZoneId, boolean> = { coeur: false, cerveau: false, reins: false, jambes: false };
  if (viewMode === 'all') {
    presentes.forEach((l) => {
      const cls = classById(l.classId);
      cls.zones.forEach((z) => (litZones[z] = true));
    });
  } else if (selectedLigne) {
    const cls = classById(selectedLigne.classId);
    cls.zones.forEach((z) => (litZones[z] = true));
  }

  const silhouetteZones: SilhouetteZoneState[] = ZONES_ORDRE.map((id) => ({
    id,
    etat: litZones[id] ? 'allume' : 'actif',
  }));

  // Panneau : caché tant que rien n'est sélectionné (pas de texte de guidage ambiant, cf.
  // `diabete/traitements/TraitementsModule.tsx` S1-v2) — la sortie de l'interaction seule
  // affiche le panneau.
  let panelEyebrow: string | null = null;
  let panelText: string | null = null;
  if (viewMode === 'all') {
    if (presentes.length === 0) {
      panelEyebrow = null;
      panelText = null;
    } else {
      panelEyebrow = "Vue d'ensemble de l'ordonnance";
      panelText = "Toutes les zones que défend l'ordonnance complète, allumées ensemble.";
    }
  } else if (selectedLigne) {
    const cls = classById(selectedLigne.classId);
    panelEyebrow = selectedLigne.molecule.trim() || cls.label;
    panelText = cls.message;
  }

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <div className={styles.layout}>
          <section className={`card ${styles.ordonnance}`}>
            <div className={styles.ordonnanceHeader}>
              <button
                type="button"
                className={styles.ordonnanceTitle}
                onClick={showAll}
                aria-pressed={viewMode === 'all'}
                title="Tout allumer sur la silhouette"
              >
                Ordonnance
              </button>
              <span className={styles.ordonnanceDate}>Le ____ /____ /______</span>
            </div>

            {lignes.length === 0 && (
              <p className={styles.emptyState}>Aucune ligne — cliquez sur « + Ajouter une ligne ».</p>
            )}

            <ul className={styles.lignesList}>
              {lignes.map((l, i) => {
                const cls = classById(l.classId);
                const isSelected = selectedUid === l.uid;
                return (
                  <li key={l.uid} className={`${styles.ligne} ${isSelected ? styles.ligneSelected : ''}`}>
                    <span className={styles.ligneIndex}>{i + 1}.</span>

                    <div className={styles.ligneMain}>
                      <input
                        type="text"
                        className={styles.moleculeInput}
                        value={l.molecule}
                        onChange={(e) => changeMolecule(l.uid, e.target.value)}
                        placeholder="Nom de la molécule…"
                        aria-label={`Molécule de la ligne ${i + 1}`}
                      />
                      <div className={styles.ligneMeta}>
                        <select
                          className={styles.classeSelect}
                          value={l.classId}
                          onChange={(e) => changeClasse(l.uid, e.target.value)}
                          aria-label={`Classe de la ligne ${i + 1}`}
                        >
                          {CLASSES.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.ligneBadges}>
                      <WatchBadge tooltip={cls.watch} />
                    </div>

                    <button
                      type="button"
                      className={styles.selectBtn}
                      onClick={() => selectLigne(l.uid)}
                      aria-pressed={isSelected}
                    >
                      {isSelected ? 'Effet affiché' : "Voir l'effet"}
                    </button>

                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeLigne(l.uid)}
                      aria-label={`Retirer la ligne ${i + 1}`}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <button type="button" className={styles.addBtn} onClick={addLigne}>
              <Plus size={16} aria-hidden="true" />
              Ajouter une ligne
            </button>
          </section>

          <div className={styles.silhouetteCol}>
            <Silhouette zones={silhouetteZones} />

            {panelText && (
              <div key={panelEyebrow} className={`${styles.panel} ${styles.fade}`}>
                <span className="eyebrow">{panelEyebrow}</span>
                <div className={`card ${styles.panelCard}`}>
                  <p className={styles.panelText}>{panelText}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="filrouge">Vos traitements ne baissent pas un chiffre : ils gardent vos artères.</p>
      </div>
    </ModuleShell>
  );
}
