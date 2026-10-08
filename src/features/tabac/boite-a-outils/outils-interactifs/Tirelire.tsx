import { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, Minus, Plus } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import { calculerEconomies, normaliserCigsParPaquet, parseEntree } from './tirelireCalcul';
import styles from './Tirelire.module.css';

/**
 * Outil interactif « Se récompenser — la tirelire » (`outil-recompense`, OI6,
 * plans/outils-interactifs-2026-07/S3.md). Remplace le stub posé en S1 : calculette
 * d'économies (jour/semaine/mois/an) + champ de récompense libre, persistée pour la
 * fiche via `store` (bundle-agnostique, comme `VagueCraving`/`RespirationGuidee`).
 *
 * Gate G3 tranché (2026-07-21) : prix du paquet par défaut 12 €, 20 cigarettes/paquet.
 * Arrondis calendaires : voir `tirelireCalcul.ts` (mois = 30 jours, année = 365 jours).
 */

const DEFAULT_CIGS_PAR_JOUR = 10;
const DEFAULT_PRIX_PAQUET = 12; // Gate G3 — à confirmer, donnée susceptible de dater
const DEFAULT_CIGS_PAR_PAQUET = 20; // Gate G3

// Sentence extraite verbatim du `principe` de `outil-recompense` (NE PAS reformuler) :
// « ... Ce n'est pas du luxe, c'est une stratégie. »
const RAPPEL_PRINCIPE = "Ce n'est pas du luxe, c'est une stratégie.";

function formatEuro(value: number, decimales: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(value);
}

interface ChampNumeriqueProps {
  label: string;
  valeur: number;
  suffixe?: string;
  step: number;
  min?: number;
  /** décimales conservées à la saisie (arrondi). */
  decimales?: number;
  /** affiche toujours `decimales` décimales (montants en euros) ; sinon, valeur brute. */
  fixe?: boolean;
  /** message lié au champ (aria-describedby), annoncé aux lecteurs d'écran. */
  annonce?: string;
  onChange: (v: number) => void;
}

function afficher(valeur: number, decimales: number, fixe: boolean): string {
  return (fixe && decimales > 0 ? valeur.toFixed(decimales) : String(valeur)).replace('.', ',');
}

/** Contrôle « gros » (S3 étape 1) : boutons ± (cible ≥ 44px) + saisie directe possible. */
function ChampNumerique({
  label,
  valeur,
  suffixe,
  step,
  min = 0,
  decimales = 0,
  fixe = false,
  annonce,
  onChange,
}: ChampNumeriqueProps) {
  // Brouillon de saisie : garde « 6, » ou « » tel que tapé tant que le champ est actif, pour
  // que la virgule décimale puisse être saisie ; il disparaît à la sortie du champ.
  const [brouillon, setBrouillon] = useState<string | null>(null);
  const descId = annonce ? `${label.replace(/\s+/g, '-')}-annonce` : undefined;
  return (
    <div className={styles.champ}>
      <span className={styles.champLabel}>{label}</span>
      <div className={styles.champControles}>
        <button
          type="button"
          className={styles.champBtn}
          onClick={() => {
            setBrouillon(null);
            onChange(Math.max(min, Number((valeur - step).toFixed(2))));
          }}
          aria-label={`Diminuer ${label}`}
        >
          <Minus aria-hidden="true" />
        </button>
        <input
          type="text"
          inputMode="decimal"
          className={styles.champInput}
          value={brouillon ?? afficher(valeur, decimales, fixe)}
          onChange={(e) => {
            setBrouillon(e.target.value);
            if (e.target.value.trim() === '') return;
            const parsed = parseEntree(e.target.value, valeur);
            const facteur = 10 ** decimales;
            onChange(Math.max(min, Math.round(parsed * facteur) / facteur));
          }}
          onBlur={() => setBrouillon(null)}
          aria-label={label}
          aria-describedby={descId}
        />
        {suffixe && <span className={styles.champSuffixe}>{suffixe}</span>}
        <button
          type="button"
          className={styles.champBtn}
          onClick={() => {
            setBrouillon(null);
            onChange(Number((valeur + step).toFixed(2)));
          }}
          aria-label={`Augmenter ${label}`}
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
      {annonce && (
        <p id={descId} role="status">
          {annonce}
        </p>
      )}
    </div>
  );
}

interface Etat {
  cigsParJour: number;
  prixPaquet: number;
  cigsParPaquet: number;
  recompense: string;
}

const ETAT_DEFAUT: Etat = {
  cigsParJour: DEFAULT_CIGS_PAR_JOUR,
  prixPaquet: DEFAULT_PRIX_PAQUET,
  cigsParPaquet: DEFAULT_CIGS_PAR_PAQUET,
  recompense: '',
};

function ligneSynthese(e: Etat): string {
  const eco = calculerEconomies(e.cigsParJour, e.prixPaquet, e.cigsParPaquet);
  const base = `~${formatEuro(eco.parMois, 0)}/mois économisés (~${formatEuro(eco.parAn, 0)}/an)`;
  return e.recompense.trim() ? `${base} → récompense prévue : ${e.recompense.trim()}` : base;
}

export default function Tirelire({ outil, store, onClose }: OutilInteractifProps) {
  const paramsKey = `${outil.id}.params`;

  // Lecture dans l'initialiseur (P1/S7) : l'état de départ vient du store injecté, sans effet
  // de montage — donc aucune écriture des valeurs par défaut (StrictMode rejoue les effets).
  const [etat, setEtat] = useState<Etat>(() => {
    const saved = store.get(paramsKey);
    if (saved.length !== 4) return ETAT_DEFAUT;
    return {
      cigsParJour: parseEntree(saved[0], DEFAULT_CIGS_PAR_JOUR),
      prixPaquet: parseEntree(saved[1], DEFAULT_PRIX_PAQUET),
      cigsParPaquet: normaliserCigsParPaquet(parseEntree(saved[2], DEFAULT_CIGS_PAR_PAQUET)).valeur,
      recompense: saved[3] ?? '',
    };
  });
  const [avanceOuvert, setAvanceOuvert] = useState(false);
  const [paquetCorrige, setPaquetCorrige] = useState(false);

  // Persistance (S3 étape 4) : une ligne de synthèse pour la fiche (clé = `outil.id`, même
  // mécanisme que `BoiteAOutilsModule` → `consultationStore.get(outil.id)`) + les paramètres
  // bruts (clé dérivée). Écrite uniquement sur une modification venue de l'utilisateur.
  const modifier = (patch: Partial<Etat>) => {
    const suivant = { ...etat, ...patch };
    setEtat(suivant);
    store.setList(outil.id, [ligneSynthese(suivant)]);
    store.setList(paramsKey, [
      String(suivant.cigsParJour),
      String(suivant.prixPaquet),
      String(suivant.cigsParPaquet),
      suivant.recompense,
    ]);
  };

  const { cigsParJour, prixPaquet, cigsParPaquet, recompense } = etat;
  const eco = useMemo(
    () => calculerEconomies(cigsParJour, prixPaquet, cigsParPaquet),
    [cigsParJour, prixPaquet, cigsParPaquet],
  );

  return (
    <div className={styles.module}>
      <button type="button" className={styles.backBtn} onClick={onClose}>
        <ChevronLeft aria-hidden="true" /> Retour aux outils
      </button>

      <p className={styles.intro}>{outil.accroche}</p>

      <div className={`${styles.entreesCard} card`}>
        <ChampNumerique
          label="Cigarettes par jour"
          valeur={cigsParJour}
          step={0.5}
          decimales={1}
          onChange={(v) => modifier({ cigsParJour: v })}
        />
        <ChampNumerique
          label="Prix du paquet"
          valeur={prixPaquet}
          suffixe="€"
          step={0.5}
          decimales={2}
          fixe
          onChange={(v) => modifier({ prixPaquet: v })}
        />

        <button
          type="button"
          className={styles.avanceToggle}
          onClick={() => setAvanceOuvert((v) => !v)}
          aria-expanded={avanceOuvert}
        >
          <ChevronDown aria-hidden="true" className={avanceOuvert ? styles.chevronOuvert : undefined} />
          Cigarettes par paquet ({cigsParPaquet})
        </button>
        {avanceOuvert && (
          <ChampNumerique
            label="Cigarettes par paquet"
            valeur={cigsParPaquet}
            step={1}
            annonce={paquetCorrige ? 'Un paquet compte au moins 1 cigarette : la valeur a été ramenée à 1.' : undefined}
            onChange={(v) => {
              const n = normaliserCigsParPaquet(v);
              setPaquetCorrige(n.corrige);
              modifier({ cigsParPaquet: n.valeur });
            }}
          />
        )}
      </div>

      <div className={styles.paliers}>
        <div className={`${styles.palier} card`}>
          <span className={styles.palierLabel}>Par jour</span>
          <span className={styles.palierValeur}>{formatEuro(eco.parJour, 2)}</span>
        </div>
        <div className={`${styles.palier} card`}>
          <span className={styles.palierLabel}>Par semaine</span>
          <span className={styles.palierValeur}>{formatEuro(eco.parSemaine, 2)}</span>
        </div>
        <div className={`${styles.palier} card`}>
          <span className={styles.palierLabel}>Par mois</span>
          <span className={styles.palierValeur}>{formatEuro(eco.parMois, 0)}</span>
        </div>
        <div className={`${styles.palier} ${styles.palierAn} card`}>
          <span className={styles.palierLabel}>Par an</span>
          <span className={styles.palierValeur}>{formatEuro(eco.parAn, 0)}</span>
        </div>
      </div>

      <label className={styles.recompenseBloc}>
        <span className={styles.recompenseLabel}>Ma récompense</span>
        <input
          type="text"
          className={styles.recompenseInput}
          value={recompense}
          onChange={(e) => modifier({ recompense: e.target.value })}
          placeholder="Ce que je m'offre avec cette somme…"
        />
      </label>

      <p className={styles.aparte}>{RAPPEL_PRINCIPE}</p>
    </div>
  );
}
