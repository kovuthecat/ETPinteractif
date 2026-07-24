import { useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import IllustrationSlot from '../components/IllustrationSlot';
import styles from './AlerteModule.module.css';

/**
 * Module 10 — Reconnaître l'alerte (C16, plans/theme-cardio-2026-07/S12.md). Module de
 * **survie** : objet neuf, la carte-réflexe VITE — pensée comme un panneau de sortie de secours
 * (peu de mots, gros pictos, se lit sous stress), pas une infographie. Deux onglets (`nav`
 * remonté dans `ModuleShell`) : AVC — VITE / Infarctus — signes. Le bandeau « Appelez le 15 »
 * est **permanent**, hors des deux panneaux d'onglet (visible quel que soit l'onglet actif).
 * Fiche imprimable (`FicheOverlay`) = carte VITE + signes infarctus + 15 (aimant frigo).
 *
 * Textes verbatim `docs/cardio/CONTENU_cardio.md` §M10 (✅ validé G1, 2026-07-22 ; signes classiques
 * et atypiques restaurés/détaillés le 2026-07-23 depuis `BRIEF_DESIGN_cardio.md`, cf. CONTENU). Rappels
 * G1 impératifs, non négociables :
 * ⚠️ **AUCUNE MENTION D'ASPIRINE** (ni écran, ni survol, ni fiche) — contre-indiquée si l'accident
 *   est un AVC hémorragique, indiscernable sans imagerie. Le seul geste enseigné = appeler le 15.
 * ⚠️ **Formes atypiques** (femmes, diabétiques, personnes âgées) capitales — chacune sa propre
 *   carte + illustration, jamais un bloc générique qu'on pourrait manquer.
 * ⚠️ **15 / 112** = seuls chiffres autorisés à l'écran (exception à l'invariant « pas de chiffre »).
 *
 * Assets `vite-*` / `infarctus-*` non générés (S12) : `IllustrationSlot` affiche son placeholder
 * natif (tuile crème + libellé) — état normal, pas une erreur.
 *
 * // à revalider (Thibault, points déjà signalés par §M10 lui-même) :
 * - formulation exacte des **signes classiques et atypiques** (équilibre sensibilité / fausses
 *   alertes) = jugement clinique ; contenu élargi le 2026-07-23 depuis le brief d'origine, jamais
 *   sourcé par un rapport clinique dédié (Complément K non obtenu, cf. CONTENU_cardio.md) ;
 * - le repère de durée « **> 5 min** » est ici affiché en sous-texte secondaire sous le signe
 *   principal (pas caché derrière un survol — une carte de survie ne se « survole » pas bien
 *   sous stress) ; §M10 le classe en 2ᵉ niveau et pose la question de le remonter au 1ᵉʳ niveau.
 */

type Onglet = 'vite' | 'infarctus';

const TABS: { id: Onglet; label: string }[] = [
  { id: 'vite', label: 'AVC — VITE' },
  { id: 'infarctus', label: 'Infarctus — signes' },
];

interface Lettre {
  id: string;
  lettre: string;
  titre: string;
  texte: string;
}

// Verbatim CONTENU_cardio.md §M10 « Message(s) à l'écran » — carte VITE (AVC). Ids imposés par
// plans/theme-cardio-2026-07/S12.md.
const LETTRES: Lettre[] = [
  { id: 'vite-visage', lettre: 'V', titre: 'Visage', texte: 'Visage qui tombe' },
  { id: 'vite-bras', lettre: 'I', titre: 'Bras', texte: 'Incapacité à lever un bras' },
  { id: 'vite-parole', lettre: 'T', titre: 'Parole', texte: 'Trouble de la parole' },
  { id: 'vite-urgence', lettre: 'E', titre: 'Urgence', texte: 'En urgence → 15' },
];

interface Signe {
  id: string;
  titre: string;
  texte: string;
}

// Signes classiques de l'infarctus — verbatim CONTENU_cardio.md §M10, restauré/détaillé 2026-07-23
// depuis BRIEF_DESIGN_cardio.md §Module 10 (irradiation + signes associés, absents depuis S12).
const SIGNES_CLASSIQUES: Signe[] = [
  {
    id: 'infarctus-douleur',
    titre: 'La douleur',
    texte: 'Une douleur qui serre ou pèse sur la poitrine, et qui ne passe pas.',
  },
  {
    id: 'infarctus-irradiation',
    titre: "Ça s'étend",
    texte: "La douleur peut s'étendre : au bras (surtout gauche), à la mâchoire, au dos.",
  },
  {
    id: 'infarctus-sueurs',
    titre: 'Autour de la douleur',
    texte: 'Sueurs froides, essoufflement, parfois des nausées.',
  },
];

// Formes atypiques — une carte + une illustration par signe (avant 2026-07-23, un seul bloc
// générique portait les 4 signes en un seul texte). Encadré chapeauté par la mention
// femmes/diabétiques/âgés, cf. rendu JSX. Carte « nausées isolées, sans autre signe » retirée le
// 2026-07-24 (décision Thibault, gate G-M10-nausées) : signe jugé trop peu spécifique (nausée
// isolée fréquente et peu discriminante, risque de fausses alertes). Ne pas confondre avec la
// mention « nausées » dans SIGNES_CLASSIQUES ci-dessus (associée aux sueurs/essoufflement, non
// isolée — hors périmètre de cette décision).
const SIGNES_ATYPIQUES: Signe[] = [
  { id: 'infarctus-atypique-dos', titre: 'Dos', texte: 'Douleur dans le dos, sans douleur de poitrine.' },
  { id: 'infarctus-atypique-ventre', titre: 'Ventre', texte: 'Douleur dans le ventre, sans douleur de poitrine.' },
  { id: 'infarctus-atypique-fatigue', titre: 'Fatigue', texte: 'Une fatigue intense, inhabituelle.' },
];

function handleTabsKeyDown(
  e: ReactKeyboardEvent<HTMLButtonElement>,
  index: number,
  onSelect: (o: Onglet) => void,
) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const nextIndex = (index + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
  onSelect(TABS[nextIndex].id);
}

export default function AlerteModule({ shell }: ModuleProps) {
  const [onglet, setOnglet] = useState<Onglet>('vite');
  const [ficheOpen, setFicheOpen] = useState(false);

  if (!shell) return null;

  const navBar = (
    <div className={styles.tabs} role="tablist" aria-label="Les 2 cartes du module Reconnaître l'alerte">
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`m10-tab-${tab.id}`}
          aria-selected={onglet === tab.id}
          aria-controls={`m10-panel-${tab.id}`}
          tabIndex={onglet === tab.id ? 0 : -1}
          className={onglet === tab.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setOnglet(tab.id)}
          onKeyDown={(e) => handleTabsKeyDown(e, index, setOnglet)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide nav={navBar}>
      <div className={styles.module}>
        {/* ── Onglet AVC — VITE ──────────────────────────────────────────── */}
        <section
          id="m10-panel-vite"
          role="tabpanel"
          aria-labelledby="m10-tab-vite"
          hidden={onglet !== 'vite'}
          className={styles.panel}
        >
          <p className={styles.sectionLabel}>AVC — le test VITE</p>
          <div className={styles.viteGrid}>
            {LETTRES.map((l) => (
              <div key={l.id} className={styles.viteCard}>
                <div className={styles.viteHeader}>
                  <span className={styles.viteLettre} aria-hidden="true">
                    {l.lettre}
                  </span>
                  <span className={styles.viteTitre}>{l.titre}</span>
                </div>
                <IllustrationSlot id={l.id} label={l.titre} size={120} />
                <p className={styles.viteTexte}>{l.texte}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Onglet Infarctus — signes ──────────────────────────────────── */}
        <section
          id="m10-panel-infarctus"
          role="tabpanel"
          aria-labelledby="m10-tab-infarctus"
          hidden={onglet !== 'infarctus'}
          className={styles.panel}
        >
          <p className={styles.sectionLabel}>Infarctus — les signes</p>
          <div className={styles.infarctusPanel}>
            <div className={styles.signeGrid}>
              {SIGNES_CLASSIQUES.map((s) => (
                <div key={s.id} className={styles.signeCard}>
                  <IllustrationSlot id={s.id} label={s.titre} size={96} />
                  <span className={styles.signeTitre}>{s.titre}</span>
                  <p className={styles.signeTexte}>{s.texte}</p>
                  {s.id === 'infarctus-douleur' && (
                    /* // à revalider (Thibault) : §M10 classe « > 5 min » en 2e niveau (survol) —
                       ici en sous-texte secondaire visible, jamais caché. */
                    <p className={styles.signeDuree}>Ça dure — plus de 5 minutes, sans s'arrêter.</p>
                  )}
                </div>
              ))}
            </div>

            <div className={`callout ${styles.atypiqueEncadre}`}>
              <div className={styles.atypiqueHeader}>
                <span className={styles.atypiqueLabel}>Parfois autrement</span>
              </div>
              <p className={styles.atypiqueIntro}>
                <strong>Surtout femmes, diabétiques, personnes âgées.</strong>
              </p>
              <div className={styles.atypiqueGrid}>
                {SIGNES_ATYPIQUES.map((s) => (
                  <div key={s.id} className={styles.atypiqueCard}>
                    <IllustrationSlot id={s.id} label={s.titre} shape="circle" size={64} />
                    <span className={styles.atypiqueCardTitre}>{s.titre}</span>
                    <p className={styles.atypiqueCardTexte}>{s.texte}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Bandeau 15 — permanent, quel que soit l'onglet ─────────────── */}
        <div className={styles.bandeau15}>
          <span className={styles.bandeau15Chiffre} aria-hidden="true">
            15
          </span>
          <div className={styles.bandeau15Texte}>
            <p className={styles.bandeau15Ligne}>Appelez le 15 (ou 112).</p>
            <p className={styles.bandeau15Ligne}>Ne conduisez pas. N'attendez pas que ça passe.</p>
          </div>
        </div>

        <p className="filrouge">Chaque minute compte.</p>

        <div className={styles.ficheButtonRow}>
          <button type="button" className="btn btn--primary" onClick={() => setFicheOpen(true)}>
            Ma fiche
          </button>
        </div>

        {ficheOpen && (
          <FicheOverlay
            eyebrow="PROGRAMME ETP · CARDIO"
            titre="Carte-réflexe — VITE et Infarctus"
            footer={<p className="fiche-filrouge">Chaque minute compte.</p>}
            onClose={() => setFicheOpen(false)}
          >
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">AVC — le test VITE</span>
              <div className={styles.ficheSignaletique}>
                {LETTRES.map((l) => (
                  <div key={l.id} className="fiche-signaletique-etape">
                    <span className="fiche-signaletique-num">{l.lettre}</span>
                    <p className="fiche-signaletique">{l.texte}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Infarctus — les signes</span>
              {SIGNES_CLASSIQUES.map((s) => (
                <p key={s.id} className={styles.ficheInfarctusTexte}>
                  {s.texte}
                </p>
              ))}
              <p className={styles.ficheAtypiqueTexte}>
                Parfois autrement : dos, ventre, fatigue intense —{' '}
                <strong>surtout femmes, diabétiques, personnes âgées</strong>.
              </p>
            </div>

            <div className="fiche-bloc">
              <div className="fiche-contact">
                <span className="fiche-contact-numero">15</span>
                <p>Appelez le 15 (ou 112). Ne conduisez pas. N'attendez pas que ça passe.</p>
              </div>
            </div>
          </FicheOverlay>
        )}
      </div>
    </ModuleShell>
  );
}
