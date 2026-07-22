import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import ArtereCoupe from '../components/ArtereCoupe';
import styles from './CholesterolModule.module.css';

/**
 * Module 5 — Le cholestérol (LDL) (C11, plans/theme-cardio-2026-07/S8.md ; moule = S4/ArtereModule
 * + S5/RisqueModule : chrome « carte-illustration | colonne d'interaction »).
 *
 * ⚠️ Gate G1 (docs/cardio/CONTENU_cardio.md §M5, §M2 « idem M2 ») : **jamais de LDL en g/L, ni
 * cible chiffrée à l'écran** — le curseur « niveau de LDL » est **qualitatif** (0-100, aucune
 * unité affichée), il ne pilote que `ArtereCoupe encrassement={ldl/100}` (même lib `plaqueGeom`
 * que M1/M2/M4). Aucun texte n'affiche de chiffre.
 *
 * Textes = `docs/cardio/CONTENU_cardio.md` §M5 « Message(s) à l'écran », verbatim (pas reformulés,
 * cf. précédent ArtereModule/S4) : mécanisme (LDL nourrit / réversibilité) sous l'artère,
 * déculpabilisation (assiette) + distinction LDL/HDL dans l'encadré séparé — même parti pris que
 * l'encadré « non-modifiables » de RisqueModule/S5 (contenu sensible isolé, non cliquable).
 *
 * Hors périmètre (S8.md) : ne pas moraliser l'assiette (hépatique/génétique) ; aucune fiche
 * (« Fiche : aucune », décision clé C11) — seulement deux renvois inline vers M8 (manger) et M11
 * (traitements/statines).
 */
export default function CholesterolModule({ shell, onNavigate }: ModuleProps) {
  // Qualitatif seul (0 = LDL bas, 100 = LDL élevé) : jamais converti/affiché en g/L (G1).
  const [ldl, setLdl] = useState(50);

  if (!shell) return null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <p className={styles.instruction}>Un curseur pour voir — jamais votre taux réel</p>

        <div className={`card ${styles.carte}`}>
          <div className={styles.arterePanel}>
            <ArtereCoupe encrassement={ldl / 100} size={280} />
          </div>

          <div className={styles.curseurCol}>
            <div className={styles.curseurLabels}>
              <span>LDL bas</span>
              <span>LDL élevé</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={ldl}
              onChange={(e) => setLdl(Number(e.target.value))}
              className={styles.curseur}
              aria-label="Niveau de LDL, de bas à élevé — pas votre chiffre réel"
            />
            <p className={styles.caption}>Le LDL nourrit la plaque.</p>
            <p className={styles.caption}>Plus bas, plus longtemps : la plaque recule.</p>
          </div>
        </div>

        {/* Encadré séparé, non cliquable : déculpabilisation + distinction LDL/HDL (§M5),
            même parti pris que l'encadré « non-modifiables » de RisqueModule/S5. */}
        <div className={`card ${styles.encadre}`}>
          <p className={styles.deculpabilisant}>Ce n&apos;est pas que votre assiette.</p>
          <p>Le LDL dépose, le HDL nettoie.</p>
        </div>

        <div className={styles.renvoisRow}>
          <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('manger')}>
            Qu&apos;est-ce qui protège aussi l&apos;assiette ? <ArrowRight aria-hidden="true" />
          </button>
          <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('traitements')}>
            Comment les statines aident-elles ? <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </ModuleShell>
  );
}
