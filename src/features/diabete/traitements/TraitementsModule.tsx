import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Clock, Info, LifeBuoy, Plus, Syringe, X } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import Silhouette from '../components/Silhouette';
import type { SilhouetteZoneState, ZoneId as SilhouetteZoneId } from '../components/Silhouette';
import { CLASSES, ZONE_MSG, classById, lignesInitiales, newLigne, type Ligne, type ZoneTraitementId } from './data';
import styles from './TraitementsModule.module.css';

/**
 * Module 7 — Traitements : l'ordonnance transcrite allume les organes défendus (D10).
 * Portage fidèle de `Module 7 - Traitements.dc.html` (maquette, autorité) : liste de lignes
 * CRUD à gauche, silhouette partagée (S3) à droite. Verrou anti-auto-prescription : on
 * transcrit et explique, on ne compare ni ne choisit aucune option entre classes.
 * Corps pur : la silhouette ne montre jamais que le bien (halo positif) — aucune alerte,
 * aucun clignotement dessus. Le « quoi surveiller » vit uniquement sur la ligne.
 */

type ViewMode = 'line' | 'all';

const ZONES_SUR_SILHOUETTE: ('coeur' | 'reins')[] = ['coeur', 'reins'];
const AUTRES_ZONES_SILHOUETTE: SilhouetteZoneId[] = ['cerveau', 'yeux', 'cou', 'nerfs', 'jambes', 'pied'];

interface LigneBadgeProps {
  icon: LucideIcon;
  tooltip: string;
  ariaLabel: string;
  onActivate?: () => void;
  variant?: 'watch' | 'porte';
}

/** Pastille 2ᵉ niveau « quoi surveiller » sur la ligne (jamais sur le corps). Composant local
 *  autonome (pas InfoHover partagé) : un vrai <button> unique porte à la fois le survol/focus
 *  (info) et, quand `onActivate` est fourni, le clic (porte de navigation) — cf. D10. */
function LigneBadge({ icon: Icon, tooltip, ariaLabel, onActivate, variant = 'watch' }: LigneBadgeProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.badgeWrap}>
      <button
        type="button"
        className={`${styles.badgeBtn} ${variant === 'porte' ? styles.badgeBtnPorte : ''}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={onActivate}
        aria-label={ariaLabel}
      >
        <Icon size={16} aria-hidden="true" />
      </button>
      {open && (
        <span role="tooltip" className={styles.badgePanel}>
          {tooltip}
        </span>
      )}
    </span>
  );
}

export default function TraitementsModule({ onNavigate }: ModuleProps) {
  const [lignes, setLignes] = useState<Ligne[]>(lignesInitiales);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('line');

  const addLigne = () => setLignes((prev) => [...prev, newLigne('', 'metformine')]);
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
  const selectedPresente = !!selectedLigne && selectedLigne.molecule.trim() !== '';

  const litZones: Record<ZoneTraitementId, boolean> = { sucre: false, coeur: false, reins: false };
  if (viewMode === 'all') {
    presentes.forEach((l) => classById(l.classId).zones.forEach((z) => (litZones[z] = true)));
  } else if (selectedPresente && selectedLigne) {
    classById(selectedLigne.classId).zones.forEach((z) => (litZones[z] = true));
  }

  const silhouetteZones: SilhouetteZoneState[] = [
    ...ZONES_SUR_SILHOUETTE.map((id) => ({ id, etat: litZones[id] ? ('allume' as const) : ('actif' as const) })),
    ...AUTRES_ZONES_SILHOUETTE.map((id) => ({ id, etat: 'masque' as const })),
  ];

  const haloActif = litZones.sucre;

  // S1-v2 : plus de texte de guidage ambiant (« Cliquez "Voir l'effet"… ») — le panneau
  // ne s'affiche que comme sortie d'une interaction (ligne sélectionnée ou vue d'ensemble).
  let sideText: string | null;
  let badgeMultiFronts = false;
  if (viewMode === 'all') {
    if (presentes.length === 0) {
      sideText = 'Écrivez au moins une molécule pour voir la carte de protection.';
    } else {
      sideText = "Toutes les zones que défend l'ordonnance complète, allumées ensemble.";
      badgeMultiFronts = presentes.some((l) => classById(l.classId).zones.length >= 2);
    }
  } else if (selectedPresente && selectedLigne) {
    const cls = classById(selectedLigne.classId);
    const phrases = cls.zones.map((z) => ZONE_MSG[z]);
    sideText = `${selectedLigne.molecule.trim()} ${phrases.join(' Elle ')}`;
    badgeMultiFronts = cls.zones.length >= 2;
  } else {
    sideText = null;
  }

  // S8 (passe « moins de texte ») : eyebrow seul en pied de module, plus de paragraphe
  // ambiant (le soignant narre) — la sortie de l'interaction reste `sideText` (panneau).
  const toutesPresentes = lignes.length > 0 && presentes.length === lignes.length;
  let captionEyebrow: string;
  if (viewMode === 'all' && toutesPresentes) {
    captionEyebrow = 'Carte de protection';
  } else if (viewMode === 'all') {
    captionEyebrow = "Vue d'ensemble de l'ordonnance";
  } else {
    captionEyebrow = 'On transcrit, ligne par ligne';
  }

  return (
    <div className={styles.module}>
      <div className={styles.grid}>
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
          <p className={styles.ordonnanceMeta}>
            Dr ________________________ &nbsp;·&nbsp; Patient : ________________________
          </p>

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
                      <span className={styles.freq}>
                        <Clock size={14} aria-hidden="true" />
                        {cls.freq}
                      </span>
                    </div>
                  </div>

                  <div className={styles.ligneBadges}>
                    <LigneBadge
                      icon={cls.peutHypo ? LifeBuoy : Info}
                      tooltip={cls.watch}
                      ariaLabel={
                        cls.peutHypo
                          ? `${cls.watch} — aller au module Hypoglycémie`
                          : cls.watch
                      }
                      variant={cls.peutHypo ? 'porte' : 'watch'}
                      onActivate={cls.peutHypo ? () => onNavigate('hypoglycemie') : undefined}
                    />
                    {cls.estInsuline && (
                      <LigneBadge
                        icon={Syringe}
                        tooltip="Comment on adapte cette dose — module Insuline."
                        ariaLabel="Aller au module Insuline"
                        variant="porte"
                        onActivate={() => onNavigate('insuline')}
                      />
                    )}
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

        <section className={styles.silhouetteSide}>
          <div className={styles.silhouetteHost}>
            <div className={styles.halo} style={{ opacity: haloActif ? 1 : 0 }} aria-hidden="true" />
            <Silhouette zones={silhouetteZones} />
          </div>

          {sideText && (
            <div className={styles.panel}>
              <span className="eyebrow">Ce que ce traitement protège</span>
              <div className={`card ${styles.panelCard}`}>
                <p className={styles.panelText}>{sideText}</p>
              </div>
              {badgeMultiFronts && (
                <div className={styles.multiFrontBadge}>Un seul traitement, plusieurs fronts défendus à la fois.</div>
              )}
            </div>
          )}
        </section>
      </div>

      <div className={styles.caption}>
        <span className="eyebrow">{captionEyebrow}</span>
      </div>

      <ModuleFooterNav
        items={[
          { id: 'hypoglycemie', label: 'Hypoglycémie' },
          { id: 'insuline', label: 'Insuline' },
        ]}
        onNavigate={onNavigate}
      />
    </div>
  );
}
