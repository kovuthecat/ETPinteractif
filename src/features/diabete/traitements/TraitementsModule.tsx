import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Clock, Info, KeyRound, LifeBuoy, Lock, Plus, Syringe, X } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import Silhouette from '../components/Silhouette';
import type { SilhouetteZoneState, ZoneId as SilhouetteZoneId } from '../components/Silhouette';
import { CLASSES, classById, lignesInitiales, newLigne, phraseEffet, type Ligne, type ZoneTraitementId } from './data';
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

export default function TraitementsModule({ onNavigate, shell }: ModuleProps) {
  const [lignes, setLignes] = useState<Ligne[]>(lignesInitiales);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('line');

  // Panneau d'effet : après « Voir l'effet » (ou la vue d'ensemble), on le ramène dans la vue et on y pose le focus.
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPing, setPanelPing] = useState(0);
  useEffect(() => {
    if (panelPing === 0) return;
    const el = panelRef.current;
    if (!el) return;
    if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
    el.focus({ preventScroll: true });
  }, [panelPing]);

  // Aucune classe présélectionnée : le patient (ou le soignant) la choisit, rien n'est présumé.
  const addLigne = () => setLignes((prev) => [...prev, newLigne('')]);
  const removeLigne = (uid: string) => setLignes((prev) => prev.filter((l) => l.uid !== uid));
  const changeMolecule = (uid: string, molecule: string) =>
    setLignes((prev) => prev.map((l) => (l.uid === uid ? { ...l, molecule } : l)));
  const changeClasse = (uid: string, classId: string) =>
    setLignes((prev) => prev.map((l) => (l.uid === uid ? { ...l, classId } : l)));
  const selectLigne = (uid: string) => {
    setViewMode('line');
    setSelectedUid((current) => (current === uid ? null : uid));
    if (selectedUid !== uid) setPanelPing((n) => n + 1);
  };
  const showAll = () => {
    setViewMode('all');
    setSelectedUid(null);
    setPanelPing((n) => n + 1);
  };

  // L'effet dépend de la classe choisie, jamais du nom libre : le nom n'est qu'un libellé d'ordonnance.
  const presentes = lignes.filter((l) => classById(l.classId));
  const selectedLigne = selectedUid ? (lignes.find((l) => l.uid === selectedUid) ?? null) : null;

  // RP4d : la classe (menu déroulant, toujours renseignée — cf. `newLigne`/`data.ts` : « la zone
  // d'action est attachée à la CLASSE, jamais à la molécule ») suffit à déclencher l'effet d'une
  // ligne sélectionnée. Avant ce correctif, un garde `selectedPresente` exigeait en plus un nom de
  // molécule non vide, alors que rien ne l'impose côté données — l'utilisateur qui choisissait
  // uniquement la classe voyait « Voir l'effet » devenir « Effet affiché » sans que rien ne
  // s'affiche réellement.
  const litZones: Record<ZoneTraitementId, boolean> = { sucre: false, coeur: false, reins: false };
  if (viewMode === 'all') {
    presentes.forEach((l) => classById(l.classId)?.zones.forEach((z) => (litZones[z] = true)));
  } else if (selectedLigne) {
    classById(selectedLigne.classId)?.zones.forEach((z) => (litZones[z] = true));
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
      sideText = 'Choisissez au moins une classe pour voir la carte de protection.';
    } else {
      sideText = "Toutes les zones que défend l'ordonnance complète, allumées ensemble.";
      badgeMultiFronts = presentes.some((l) => (classById(l.classId)?.zones.length ?? 0) >= 2);
    }
  } else if (selectedLigne) {
    // Sans classe choisie : aucun effet. Avec : la phrase parle de la classe, jamais du texte libre.
    sideText = phraseEffet(selectedLigne.classId);
    badgeMultiFronts = (classById(selectedLigne.classId)?.zones.length ?? 0) >= 2;
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

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
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

          {lignes.length === 0 && (
            <p className={styles.emptyState}>
              Aucune ligne — cliquez sur « + Ajouter une ligne ».
            </p>
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
                        <option value="">Choisir une classe…</option>
                        {CLASSES.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {cls && (
                        <span className={styles.freq}>
                          <Clock size={14} aria-hidden="true" />
                          {cls.freq}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.ligneBadges}>
                    {cls && (
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
                    )}
                    {cls?.estInsuline && (
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
                    disabled={!cls}
                    title={cls ? undefined : "Choisissez d'abord une classe"}
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
            <div
              className={styles.panel}
              ref={panelRef}
              tabIndex={-1}
              role="region"
              aria-label="Ce que ce traitement protège"
            >
              <span className="eyebrow">Ce que ce traitement protège</span>
              <div className={`card ${styles.panelCard}`}>
                {/* S7-v3 : picto clé/serrure — mode ligne uniquement (métaphore attachée à une
                    molécule précise, pas à la vue d'ensemble), seulement si la classe en a un. */}
                {viewMode === 'line' && selectedLigne && classById(selectedLigne.classId)?.picto && (
                  <span className={styles.pictoMecanisme} aria-hidden="true">
                    {classById(selectedLigne.classId)?.picto === 'serrure' ? (
                      <Lock size={22} />
                    ) : (
                      <KeyRound size={22} />
                    )}
                  </span>
                )}
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
    </div>
    </ModuleShell>
  );
}
