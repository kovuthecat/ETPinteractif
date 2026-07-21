import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, Minus, Plus } from 'lucide-react';
import type { OutilInteractifProps } from './types';
import styles from './Tirelire.module.css';

/**
 * Outil interactif « Se récompenser — la tirelire » (`outil-recompense`, OI6,
 * plans/outils-interactifs-2026-07/S3.md). Remplace le stub posé en S1 : calculette
 * d'économies (jour/semaine/mois/an) + champ de récompense libre, persistée pour la
 * fiche via `store` (bundle-agnostique, comme `VagueCraving`/`RespirationGuidee`).
 *
 * Gate G3 tranché (2026-07-21) : prix du paquet par défaut 12 €, 20 cigarettes/paquet.
 * Arrondis calendaires fixés (« Si bloqué ») : mois = 30 jours, année = 365 jours.
 */

const DEFAULT_CIGS_PAR_JOUR = 10;
const DEFAULT_PRIX_PAQUET = 12; // Gate G3 — à confirmer, donnée susceptible de dater
const DEFAULT_CIGS_PAR_PAQUET = 20; // Gate G3

const JOURS_PAR_SEMAINE = 7;
const JOURS_PAR_MOIS = 30; // arrondi fixé (S3 « Si bloqué »)
const JOURS_PAR_AN = 365; // arrondi fixé (S3 « Si bloqué »)

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

function parseEntree(raw: string, repli: number): number {
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : repli;
}

interface ChampNumeriqueProps {
  label: string;
  valeur: number;
  suffixe?: string;
  step: number;
  min?: number;
  decimales?: number;
  onChange: (v: number) => void;
}

/** Contrôle « gros » (S3 étape 1) : boutons ± (cible ≥ 44px) + saisie directe possible. */
function ChampNumerique({ label, valeur, suffixe, step, min = 0, decimales = 0, onChange }: ChampNumeriqueProps) {
  return (
    <div className={styles.champ}>
      <span className={styles.champLabel}>{label}</span>
      <div className={styles.champControles}>
        <button
          type="button"
          className={styles.champBtn}
          onClick={() => onChange(Math.max(min, Number((valeur - step).toFixed(2))))}
          aria-label={`Diminuer ${label}`}
        >
          <Minus aria-hidden="true" />
        </button>
        <input
          type="text"
          inputMode="decimal"
          className={styles.champInput}
          value={decimales > 0 ? valeur.toFixed(decimales) : String(valeur)}
          onChange={(e) => {
            const parsed = parseEntree(e.target.value, valeur);
            const facteur = 10 ** decimales;
            onChange(Math.max(min, Math.round(parsed * facteur) / facteur));
          }}
          aria-label={label}
        />
        {suffixe && <span className={styles.champSuffixe}>{suffixe}</span>}
        <button
          type="button"
          className={styles.champBtn}
          onClick={() => onChange(Number((valeur + step).toFixed(2)))}
          aria-label={`Augmenter ${label}`}
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Tirelire({ outil, store, onClose }: OutilInteractifProps) {
  const paramsKey = `${outil.id}.params`;

  const [cigsParJour, setCigsParJour] = useState(DEFAULT_CIGS_PAR_JOUR);
  const [prixPaquet, setPrixPaquet] = useState(DEFAULT_PRIX_PAQUET);
  const [cigsParPaquet, setCigsParPaquet] = useState(DEFAULT_CIGS_PAR_PAQUET);
  const [recompense, setRecompense] = useState('');
  const [avanceOuvert, setAvanceOuvert] = useState(false);

  // Recharge au montage (S3 étape 4) : restaure les entrées précédentes si stockées.
  // Côté patient (localStorage), ça ré-affiche les paramètres d'une visite à l'autre ;
  // côté consultation (mémoire de session), sans effet notable tant que le module reste
  // monté — inoffensif dans les deux cas.
  useEffect(() => {
    const saved = store.get(paramsKey);
    if (saved.length === 4) {
      setCigsParJour(parseEntree(saved[0], DEFAULT_CIGS_PAR_JOUR));
      setPrixPaquet(parseEntree(saved[1], DEFAULT_PRIX_PAQUET));
      const cpp = parseEntree(saved[2], DEFAULT_CIGS_PAR_PAQUET);
      setCigsParPaquet(cpp > 0 ? cpp : DEFAULT_CIGS_PAR_PAQUET);
      setRecompense(saved[3] ?? '');
    }
    // Chargement unique au montage — volontairement pas de dépendance sur `store`/`paramsKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const coutParJour = cigsParPaquet > 0 ? (cigsParJour / cigsParPaquet) * prixPaquet : 0;
  const coutParSemaine = coutParJour * JOURS_PAR_SEMAINE;
  const coutParMois = coutParJour * JOURS_PAR_MOIS;
  const coutParAn = coutParJour * JOURS_PAR_AN;

  const ligneSynthese = useMemo(() => {
    const base = `~${formatEuro(coutParMois, 0)}/mois économisés (~${formatEuro(coutParAn, 0)}/an)`;
    return recompense.trim() ? `${base} → récompense prévue : ${recompense.trim()}` : base;
  }, [coutParMois, coutParAn, recompense]);

  // Persistance (S3 étape 4) : une ligne de synthèse pour la fiche (clé = `outil.id`,
  // même mécanisme que `BoiteAOutilsModule` → `consultationStore.get(outil.id)`) + les
  // paramètres bruts (clé dérivée) pour pouvoir rouvrir l'outil avec les mêmes entrées.
  useEffect(() => {
    store.setList(outil.id, [ligneSynthese]);
    store.setList(paramsKey, [String(cigsParJour), String(prixPaquet), String(cigsParPaquet), recompense]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outil.id, paramsKey, ligneSynthese, cigsParJour, prixPaquet, cigsParPaquet, recompense]);

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
          step={1}
          onChange={setCigsParJour}
        />
        <ChampNumerique
          label="Prix du paquet"
          valeur={prixPaquet}
          suffixe="€"
          step={0.5}
          decimales={2}
          onChange={setPrixPaquet}
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
            min={1}
            onChange={setCigsParPaquet}
          />
        )}
      </div>

      <div className={styles.paliers}>
        <div className={`${styles.palier} card`}>
          <span className={styles.palierLabel}>Par jour</span>
          <span className={styles.palierValeur}>{formatEuro(coutParJour, 2)}</span>
        </div>
        <div className={`${styles.palier} card`}>
          <span className={styles.palierLabel}>Par semaine</span>
          <span className={styles.palierValeur}>{formatEuro(coutParSemaine, 2)}</span>
        </div>
        <div className={`${styles.palier} card`}>
          <span className={styles.palierLabel}>Par mois</span>
          <span className={styles.palierValeur}>{formatEuro(coutParMois, 0)}</span>
        </div>
        <div className={`${styles.palier} ${styles.palierAn} card`}>
          <span className={styles.palierLabel}>Par an</span>
          <span className={styles.palierValeur}>{formatEuro(coutParAn, 0)}</span>
        </div>
      </div>

      <label className={styles.recompenseBloc}>
        <span className={styles.recompenseLabel}>Ma récompense</span>
        <input
          type="text"
          className={styles.recompenseInput}
          value={recompense}
          onChange={(e) => setRecompense(e.target.value)}
          placeholder="Ce que je m'offre avec cette somme…"
        />
      </label>

      <p className={styles.aparte}>{RAPPEL_PRINCIPE}</p>
    </div>
  );
}
