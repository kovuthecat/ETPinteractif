import { useState } from 'react';
import { ChevronLeft, NotebookPen, Printer } from 'lucide-react';
import FicheOverlay from '../../../../components/FicheOverlay';
import type { OutilInteractifProps } from './types';
import styles from './GabaritJournal.module.css';

/** Nombre de lignes vides du gabarit imprimable (plan S7/OI11 : « ~15 lignes vides »). */
const LIGNES_GABARIT = 15;
/** Nombre de lignes de l'aperçu affiché à l'écran (juste illustratif, pas la fiche complète). */
const LIGNES_APERCU = 4;

const COLONNES = ['Heure', 'Lieu', 'Activité', 'Ressenti'] as const;

interface GabaritJournalProps extends OutilInteractifProps {
  /**
   * Renvoi vers le carnet patient existant (S7/OI11, Gate G5) : fourni uniquement par le
   * bundle patient (`PatientSituations`, câblé sur `go('carnet')`) pour ouvrir `PatientCarnet`
   * sans le dupliquer. En consultation cette prop est absente (zéro persistance, invariant
   * #1) : le composant rend alors le gabarit hebdomadaire imprimable ci-dessous.
   */
  onOuvrirCarnet?: () => void;
}

function GrilleJournal({ lignes, className }: { lignes: number; className: string }) {
  return (
    <table className={className}>
      <thead>
        <tr>
          {COLONNES.map((colonne) => (
            <th key={colonne}>{colonne}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: lignes }).map((_, index) => (
          <tr key={index}>
            {COLONNES.map((colonne) => (
              <td key={colonne} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Outil interactif « Une semaine d'observation » (`outil-journal`, S7/OI11). Ne réinvente pas
 * un journal : côté patient (persistance déjà en place dans `PatientCarnet`, E7 de
 * revue-chrome-2026-07), renvoie vers ce carnet existant ; côté consultation (zéro
 * persistance, invariant #1), propose un gabarit papier — grille heure / lieu / activité /
 * ressenti, imprimable via `FicheOverlay` (même pattern que `VagueCraving` → « Ma carte
 * anti-envie »). Le comportement est choisi uniquement par la présence de `onOuvrirCarnet`
 * (jamais par une détection de bundle) : la consultation n'importe ainsi aucun code patient.
 */
export default function GabaritJournal({ outil, onClose, onOuvrirCarnet }: GabaritJournalProps) {
  const [ficheOpen, setFicheOpen] = useState(false);

  if (onOuvrirCarnet) {
    return (
      <div className={`${styles.centerCard} card`}>
        <p className={styles.titre}>{outil.titre}</p>
        <p className={styles.intro}>
          Notez chaque cigarette dans votre carnet : l'heure, le contexte, ce que vous ressentez.
          Vos situations à risque se dessineront d'elles-mêmes.
        </p>
        <button type="button" className="btn btn--primary" onClick={onOuvrirCarnet}>
          <NotebookPen size={18} aria-hidden="true" />
          Ouvrir mon carnet
        </button>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.module}>
      <p className={styles.titre}>{outil.titre}</p>
      <p className={styles.intro}>
        À remettre pour la semaine qui précède l'arrêt : une ligne par cigarette, pour faire
        apparaître les situations à risque — ce sont elles qu'on équipera d'une parade.
      </p>

      <div className={styles.apercu}>
        <GrilleJournal lignes={LIGNES_APERCU} className={styles.table} />
      </div>

      <div className={styles.btnRow}>
        <button type="button" className="btn btn--primary" onClick={() => setFicheOpen(true)}>
          <Printer size={18} aria-hidden="true" />
          Imprimer le gabarit
        </button>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          <ChevronLeft size={16} aria-hidden="true" />
          Retour aux outils
        </button>
      </div>

      {ficheOpen && (
        <FicheOverlay
          eyebrow="PROGRAMME ETP · SEVRAGE TABAGIQUE"
          titre="Une semaine d'observation"
          footer={
            <p className="fiche-filrouge">
              C'est la fumée qui rend malade. C'est le manque qui fait fumer. Et le manque, ça se
              traite.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Avant l'arrêt : une ligne par cigarette</span>
            <GrilleJournal lignes={LIGNES_GABARIT} className={styles.ficheTable} />
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
