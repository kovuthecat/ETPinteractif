/**
 * Données des minuteurs guidés (S5, OI8 — plans/outils-interactifs-2026-07/S5.md).
 * Un seul composant (`MinuteurGuide.tsx`) sert deux outils de la boîte à outils —
 * `bouger` (« Bouger 10 minutes ») et `surfer` (« Surfer sur l'envie ») : les étapes/durées
 * propres à chacun vivent ici, PAS dans `content/tabac/outils.ts`. Textes dérivés de
 * `proposition`/`principe` (outils.ts, `outil-bouger` l.88-99, `outil-surfer` l.116-127) sans
 * en changer le sens.
 */

export type MinuteurOutilId = 'bouger' | 'surfer';

/** Invite affichée à partir de la seconde `aSec` écoulée depuis le départ du minuteur. */
export interface EtapeMinuteur {
  aSec: number;
  texte: string;
}

export interface MinuteurDef {
  /** Durée totale du minuteur, en secondes. */
  dureeSec: number;
  /** Invites qui défilent au fil du temps (ex. `surfer`) — triées par `aSec` croissant. */
  etapes?: EtapeMinuteur[];
  /** Rappel fixe affiché pendant tout le minuteur (ex. `bouger` : exercices + repli). */
  rappel?: string;
  /** Message de clôture sobre affiché en fin de minuteur. */
  clotureTexte?: string;
}

export const MINUTEURS: Record<MinuteurOutilId, MinuteurDef> = {
  bouger: {
    dureeSec: 600,
    rappel:
      "Marchez d'un bon pas pendant ces 10 minutes, ou montez et descendez un escalier 3 à 4 fois. Si vous ne pouvez pas bouger : serrez fort les poings et les bras 10 secondes, relâchez — recommencez 5 fois.",
    clotureTexte: "Bien joué. L'effet anti-envie persiste encore 20 à 30 minutes.",
  },
  surfer: {
    dureeSec: 180,
    etapes: [
      { aSec: 0, texte: '« Je ressens une envie. Elle est là. Je la laisse passer. »' },
      { aSec: 45, texte: 'Où la sentez-vous dans le corps ? Gorge serrée, mains agitées…' },
      { aSec: 90, texte: 'Observez ce qui se passe, sans lutter ni céder.' },
      { aSec: 135, texte: "Laissez-la monter, puis redescendre d'elle-même." },
    ],
    clotureTexte: 'Chaque envie surfée sans fumer affaiblit la suivante.',
  },
};
