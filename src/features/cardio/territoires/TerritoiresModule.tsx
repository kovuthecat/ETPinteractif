import { useState } from 'react';
import { PersonStanding } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import Silhouette, {
  SILHOUETTE_ANCHORS,
  type SilhouetteZoneState,
  type ZoneId,
} from '../components/Silhouette';
import ArtereCoupe from '../components/ArtereCoupe';
import styles from './TerritoiresModule.module.css';

/**
 * Module 3 — « Où l'accident frappe » (C9, plans/theme-cardio-2026-07/S6.md ; refonte partielle
 * plaque-pivot, plans/refonte-audit-2026-07/S5.md). Un seul ennemi (la plaque), plusieurs
 * adresses : cœur, cerveau, jambes, reins. Le patient doit sortir en ayant compris que c'est la
 * MÊME maladie partout — donc que prévenir à un endroit protège partout.
 *
 * Pivot pédagogique (refonte S5) : au clic sur un organe, (a) la plaque partagée du thème
 * (`ArtereCoupe`, le héros visuel de M1/M2 — réutilisée telle quelle, aucun objet nouveau)
 * VOYAGE jusqu'à l'organe cliqué, et (b) un encart affiche l'accident + une phrase de conséquence
 * sobre (registre « comprendre pour agir », jamais « voilà ce qui vous attend »).
 *
 * Le nom de l'accident (cœur → infarctus, etc.) et le message d'unité sont repris quasi verbatim
 * de `docs/cardio/CONTENU_cardio.md` §M3. Les phrases de conséquence et le libellé « mêmes leviers »
 * sont des reformulations pédagogiques nouvelles, annotées `// à revalider (Thibault)`.
 *
 * Pas de renvoi inline cliquable inter-modules (correction Thibault 2026-07-23, patron en vigueur) :
 * le renvoi vers la famille « Agir » (tension, cholestérol, tabac, bouger, manger…) est un simple
 * libellé textuel, le soignant navigue lui-même.
 */

const ZONES_ORDRE: ZoneId[] = ['coeur', 'cerveau', 'jambes', 'reins'];

const ZONE_LABEL: Record<ZoneId, string> = {
  coeur: 'Cœur',
  cerveau: 'Cerveau',
  jambes: 'Jambes',
  reins: 'Reins',
};

// Nom de l'accident par territoire — CONTENU_cardio.md §M3 (verbatim) : « Cœur → infarctus ·
// Cerveau → AVC · Jambes → douleur à la marche (artériopathie) · Reins → ils s'abîment en silence. »
const ZONE_ACCIDENT: Record<ZoneId, string> = {
  coeur: 'Infarctus.',
  cerveau: 'AVC.',
  jambes: 'Douleur à la marche (artériopathie).',
  reins: "Ils s'abîment en silence.",
};

// Phrase de conséquence sobre, une par territoire — reformulation pédagogique (le doc §M3 ne
// fournit qu'un mot par territoire). Registre mécanistique « comprendre » : c'est la même plaque
// qui bouche une artère, seule l'adresse change. Pas de dramatisation, pas d'image clinique crue.
// à revalider (Thibault)
const ZONE_CONSEQUENCE: Record<ZoneId, string> = {
  coeur: "Une artère du cœur se bouche : le muscle manque d'oxygène.",
  cerveau: "Une artère du cerveau se bouche : une zone n'est plus irriguée.",
  jambes: 'Les artères des jambes se rétrécissent : marcher finit par tirer dans le mollet.',
  reins: "Les artères des reins s'abîment peu à peu, souvent sans qu'on le sente.",
};

// Invitation neutre par défaut (aucune zone ouverte) — pas de contenu clinique, choix libre.
const INVITATION_NEUTRE = "Choisissez une zone pour voir où la même plaque peut frapper.";

// Message d'unité, verbatim CONTENU_cardio.md §M3.
const MESSAGE_UNITE_TITRE = 'Un seul ennemi, la plaque. Plusieurs adresses.';
const MESSAGE_UNITE_LEVIERS = 'Mêmes leviers, ils protègent partout.';

// Renvoi textuel (non cliquable) vers la famille « Agir » — reformulation pédagogique : nomme
// l'idée que les mêmes leviers (les modules « Agir » : tension, cholestérol, tabac, bouger,
// manger…) protègent les quatre territoires d'un coup. Pas de navigation inline (patron en
// vigueur : le soignant navigue lui-même). // à revalider (Thibault)
const MESSAGE_AGIR =
  'Agir sur un levier — la tension, le cholestérol, le tabac, bouger, manger — protège les quatre territoires à la fois.';

export default function TerritoiresModule({ shell }: ModuleProps) {
  const [zoneOuverte, setZoneOuverte] = useState<ZoneId | null>(null);

  const toggleZone = (id: ZoneId) => {
    setZoneOuverte((current) => (current === id ? null : id));
  };

  if (!shell) return null;

  const zones: SilhouetteZoneState[] = ZONES_ORDRE.map((id) => ({
    id,
    etat: zoneOuverte === id ? 'ouvert' : 'actif',
  }));

  // La plaque partagée du thème, positionnée par le module lui-même sur l'ancre de l'organe
  // ouvert (les annotations `children` de la silhouette sont posées via `SILHOUETTE_ANCHORS`,
  // x/y en % de l'image). Élément unique et stable : quand on passe d'un organe à l'autre sans
  // refermer, React le réutilise → la plaque « voyage » (transition CSS left/top). Valeurs
  // encrassement/caillot reprises du temps « ③ Rupture » de M1 (même plaque, mêmes réglages).
  const anchorOuverte = zoneOuverte ? SILHOUETTE_ANCHORS[zoneOuverte] : null;

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} wide>
      <div className={styles.module}>
        <div className={styles.layout}>
          <div className={styles.silhouetteCol}>
            <Silhouette zones={zones} onZoneClick={toggleZone}>
              {anchorOuverte && (
                <div
                  className={styles.plaqueBadge}
                  style={{ left: `${anchorOuverte.x}%`, top: `${anchorOuverte.y}%` }}
                >
                  <ArtereCoupe encrassement={0.55} caillot size={92} />
                </div>
              )}
            </Silhouette>
          </div>

          <div className={styles.panneau} aria-live="polite">
            {zoneOuverte ? (
              <div key={zoneOuverte} className={`${styles.zoneOuverte} ${styles.fade}`}>
                <span className="eyebrow">{ZONE_LABEL[zoneOuverte]}</span>
                <p className={styles.zoneAccident}>{ZONE_ACCIDENT[zoneOuverte]}</p>
                <p className={styles.zoneConsequence}>{ZONE_CONSEQUENCE[zoneOuverte]}</p>
                <p className={styles.zoneMemePlaque}>La même plaque, à une autre adresse.</p>
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

        {/* Message transverse permanent (toujours visible) : l'idée d'unité + le renvoi textuel
            vers « Agir ». C'est le pivot du thème — il justifie tout le reste du parcours. */}
        <div className={`card ${styles.transverse}`}>
          <p className={styles.transverseTitre}>{MESSAGE_UNITE_TITRE}</p>
          <p className={styles.transverseLeviers}>{MESSAGE_UNITE_LEVIERS}</p>
          <p className={styles.transverseAgir}>{MESSAGE_AGIR}</p>
        </div>
      </div>
    </ModuleShell>
  );
}
