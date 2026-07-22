import { useState } from 'react';
import { PersonStanding } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import Silhouette, { type SilhouetteZoneState, type ZoneId } from '../components/Silhouette';
import styles from './TerritoiresModule.module.css';

/**
 * Module 3 — « Où l'accident frappe » (C9, plans/theme-cardio-2026-07/S6.md). Un seul ennemi
 * (la plaque), plusieurs adresses : cœur, cerveau, jambes, reins. Exploration contemplative et
 * libre — on n'ouvre que ce qu'on veut, aucun défilé imposé, aucune fiche.
 *
 * Textes repris (quasi verbatim, aucune invention) de `docs/cardio/CONTENU_cardio.md` §M3 :
 * la reformulation « territoire → conséquence » de la doc devient le texte du panneau, le
 * message d'unité (« un seul ennemi, plusieurs adresses ») reste en pied d'écran. Renvoi
 * inline vers le module 10 (« Reconnaître l'alerte ») réservé au cœur et au cerveau (prototype
 * `ETP Cardio - Prototype.dc.html`, `zone3Alerte`, ligne 981).
 */

const ZONES_ORDRE: ZoneId[] = ['coeur', 'cerveau', 'jambes', 'reins'];

const ZONE_LABEL: Record<ZoneId, string> = {
  coeur: 'Cœur',
  cerveau: 'Cerveau',
  jambes: 'Jambes',
  reins: 'Reins',
};

// Texte sobre par territoire — CONTENU_cardio.md §M3 : « Cœur → infarctus · Cerveau → AVC ·
// Jambes → douleur à la marche (artériopathie) · Reins → ils s'abîment en silence. »
const ZONE_TEXTE: Record<ZoneId, string> = {
  coeur: 'Infarctus.',
  cerveau: 'AVC.',
  jambes: "Douleur à la marche (artériopathie).",
  reins: "Ils s'abîment en silence.",
};

// Renvoi vers le module 10 réservé au cœur et au cerveau (prototype, `zone3Alerte`).
const ZONES_ALERTE = new Set<ZoneId>(['coeur', 'cerveau']);

// Invitation neutre par défaut (aucune zone ouverte) — pas de contenu clinique, choix libre.
const INVITATION_NEUTRE = "Choisissez une zone pour voir ce qu'on y protège.";

// Message d'unité, en pied d'écran — verbatim CONTENU_cardio.md §M3.
const MESSAGE_UNITE =
  "Un seul ennemi, la plaque. Plusieurs adresses. Mêmes leviers, ils protègent partout.";

export default function TerritoiresModule({ shell, onNavigate }: ModuleProps) {
  const [zoneOuverte, setZoneOuverte] = useState<ZoneId | null>(null);

  const toggleZone = (id: ZoneId) => {
    setZoneOuverte((current) => (current === id ? null : id));
  };

  if (!shell) return null;

  const zones: SilhouetteZoneState[] = ZONES_ORDRE.map((id) => ({
    id,
    etat: zoneOuverte === id ? 'ouvert' : 'actif',
  }));

  const alerte = zoneOuverte !== null && ZONES_ALERTE.has(zoneOuverte);

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <div className={styles.layout}>
          <div className={styles.silhouetteCol}>
            <Silhouette zones={zones} onZoneClick={toggleZone} />
          </div>

          <div className={styles.panneau}>
            {zoneOuverte ? (
              <div key={zoneOuverte} className={`${styles.zoneOuverte} ${styles.fade}`}>
                <span className="eyebrow">{ZONE_LABEL[zoneOuverte]}</span>
                <p className={styles.zoneTexte}>{ZONE_TEXTE[zoneOuverte]}</p>
                {alerte && (
                  <button
                    type="button"
                    className={styles.lienAlerte}
                    onClick={() => onNavigate('alerte')}
                  >
                    → Reconnaître l'alerte
                  </button>
                )}
              </div>
            ) : (
              <div className={`${styles.videEtat} ${styles.fade}`}>
                <div className={styles.videIcone}>
                  <PersonStanding size={40} aria-hidden="true" />
                </div>
                <p className={styles.videTexte}>{INVITATION_NEUTRE}</p>
              </div>
            )}
          </div>
        </div>

        <p className="filrouge">{MESSAGE_UNITE}</p>
      </div>
    </ModuleShell>
  );
}
