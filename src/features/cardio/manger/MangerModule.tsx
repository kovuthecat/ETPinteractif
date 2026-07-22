import { useState } from 'react';
import { ArrowRight, Flame, RotateCcw } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import IllustrationSlot from '../components/IllustrationSlot';
import { ALIMENTS_PLATEAU, CATEGORIES_PLATEAU, REPERES_ALIMENTS, type AlimentPlateau, type RepereAliment } from './data';
import styles from './MangerModule.module.css';

/**
 * Module 8 — « Manger pour ses artères » (C14, plans/theme-cardio-2026-07/S10.md ; moule onglets
 * = `LeviersModule`/S11 : slot `nav` du `ModuleShell`, `role="tablist"`).
 *
 * Textes = docs/cardio/CONTENU_cardio.md §M8 (validé G1, 2026-07-22). Rappels impératifs :
 * - **Sel** : jamais de seuil chiffré (ni g/j ni mg) — message qualitatif unique « limiter le sel ».
 * - **Diversité culturelle** : l'onglet Familles reste volontairement générique (huile, oméga-3,
 *   légumineuses, céréales complètes…) — ce n'est pas un catalogue par origine culinaire.
 * - Pas de moralisation, pas de régime restrictif punitif. Jamais de chiffre imposé à l'écran
 *   (les seuils internes de `analyseEquilibre` ne sont jamais imprimés littéralement).
 *
 * Décision clé (proto §MODULE 8, lignes 284-375, logique 815-888) :
 * - Onglet **Familles** : deux colonnes (amis des artères / à limiter), détail au clic d'un
 *   repère (pastille de feu + texte court).
 * - Onglet **Assiette** : garde-manger (`IllustrationSlot aliment-<id>`, un item par asset réel
 *   dans `public/illustrations/cardio/`) → assiette conique ½ légumes / ¼ féculents / ¼ protéines
 *   + analyse d'équilibre + repères sel/gras qualitatifs.
 * - Fiche « Mon assiette » (`FicheOverlay`) : photographie de l'assiette composée par le patient.
 * - Renvois inline 8→4 (sel → tension) et 8→5 (gras → cholestérol/LDL), toujours visibles (les
 *   deux onglets partagent le même pied de page — pas de logique conditionnelle superflue).
 */

type Onglet = 'familles' | 'assiette';

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: 'familles', label: "Familles d'aliments" },
  { id: 'assiette', label: 'Composer mon assiette' },
];

/** Plafond par catégorie-cœur (proto `Math.min(8, …)`) — évite un camembert qui ne bouge plus. */
const PLATE_MAX_PAR_CATEGORIE = 8;
/** Nombre d'« extras » (matières grasses/fruits/laitiers) conservés dans la liste, proto `.slice(-6)`. */
const EXTRAS_MAX = 6;
/** Tolérance (points de %) autour du modèle ½ · ¼ · ¼ pour considérer l'assiette équilibrée (proto ligne 883). */
const EQUILIBRE_TOLERANCE = 12;
/** Seuils de déséquilibre (proto lignes 884-886) — jamais imprimés tels quels, seulement des
 *  branches de texte qualitatif. */
const SEUIL_LEGUMES_BAS = 35;
const SEUIL_PROTEINES_HAUT = 40;
const SEUIL_FECULENTS_HAUT = 40;

type CategorieCoeur = 'legumes' | 'feculents' | 'proteines';
type PlateCounts = Record<CategorieCoeur, number>;

const PLATE_COUNTS_VIDE: PlateCounts = { legumes: 0, feculents: 0, proteines: 0 };

interface RepereCardProps {
  repere: RepereAliment;
  selected: boolean;
  onSelect: () => void;
}

function RepereCard({ repere, selected, onSelect }: RepereCardProps) {
  let cardClass = styles.repereCard;
  if (selected) {
    cardClass += ` ${repere.ami ? styles.repereCardSelectedAmi : styles.repereCardSelectedLimiter}`;
  }
  return (
    <button type="button" className={cardClass} onClick={onSelect} aria-pressed={selected}>
      <Flame size={18} aria-hidden="true" className={repere.ami ? styles.flameAmi : styles.flameLimiter} />
      {repere.label}
    </button>
  );
}

export default function MangerModule({ shell, onNavigate }: ModuleProps) {
  const [onglet, setOnglet] = useState<Onglet>('familles');
  const [repereSelectionne, setRepereSelectionne] = useState<string | null>(null);

  const [plateCounts, setPlateCounts] = useState<PlateCounts>(PLATE_COUNTS_VIDE);
  const [plateExtras, setPlateExtras] = useState<string[]>([]);
  const [selCount, setSelCount] = useState(0);
  const [grasSatCount, setGrasSatCount] = useState(0);
  const [ficheOuverte, setFicheOuverte] = useState(false);

  if (!shell) return null;

  function ajouterAuPlateau(aliment: AlimentPlateau) {
    const cat = aliment.categorie;
    if (cat === 'legumes' || cat === 'feculents' || cat === 'proteines') {
      setPlateCounts((prev) => ({ ...prev, [cat]: Math.min(PLATE_MAX_PAR_CATEGORIE, prev[cat] + 1) }));
    } else {
      setPlateExtras((prev) => [...prev, aliment.name].slice(-EXTRAS_MAX));
    }
    if (aliment.sel === 'eleve') setSelCount((n) => n + 1);
    if (aliment.graisses === 'saturees') setGrasSatCount((n) => n + 1);
  }

  function reinitialiserPlateau() {
    setPlateCounts(PLATE_COUNTS_VIDE);
    setPlateExtras([]);
    setSelCount(0);
    setGrasSatCount(0);
  }

  const totalCoeur = plateCounts.legumes + plateCounts.feculents + plateCounts.proteines;
  const pctLegumes = totalCoeur ? Math.round((plateCounts.legumes / totalCoeur) * 100) : 0;
  const pctFeculents = totalCoeur ? Math.round((plateCounts.feculents / totalCoeur) * 100) : 0;
  const pctProteines = totalCoeur ? 100 - pctLegumes - pctFeculents : 0;

  const legDeg = pctLegumes * 3.6;
  const cerDeg = pctFeculents * 3.6;
  const plateGradient = totalCoeur
    ? `conic-gradient(var(--color-confort-strong) 0deg ${legDeg}deg, var(--color-nav) ${legDeg}deg ${
        legDeg + cerDeg
      }deg, var(--color-toxique) ${legDeg + cerDeg}deg 360deg)`
    : 'repeating-linear-gradient(45deg, var(--color-bg), var(--color-bg) 10px, var(--color-line) 10px, var(--color-line) 20px)';

  let analyse: string;
  if (!totalCoeur) {
    analyse = 'Touchez un aliment du garde-manger pour composer votre assiette.';
  } else if (
    Math.abs(pctLegumes - 50) <= EQUILIBRE_TOLERANCE &&
    Math.abs(pctFeculents - 25) <= EQUILIBRE_TOLERANCE &&
    Math.abs(pctProteines - 25) <= EQUILIBRE_TOLERANCE
  ) {
    analyse = "Bel équilibre — proche de l'assiette santé (½ légumes, ¼ féculents, ¼ protéines).";
  } else if (pctLegumes < SEUIL_LEGUMES_BAS) {
    analyse = 'Pas assez de légumes : pensez à leur laisser la moitié de l’assiette, pour les fibres et le potassium.';
  } else if (pctProteines > SEUIL_PROTEINES_HAUT) {
    analyse = 'Beaucoup de protéines par rapport aux légumes : allégez un peu ce côté de l’assiette.';
  } else if (pctFeculents > SEUIL_FECULENTS_HAUT) {
    analyse = 'Beaucoup de féculents : laissez plus de place aux légumes.';
  } else {
    analyse = 'Assiette correcte — encore un peu de rééquilibrage possible vers le modèle ½ · ¼ · ¼.';
  }

  const avertissement =
    selCount > 0
      ? `${selCount} aliment${selCount > 1 ? 's' : ''} riche${selCount > 1 ? 's' : ''} en sel ajouté${
          selCount > 1 ? 's' : ''
        } — pensez à limiter le sel.`
      : grasSatCount > 0
        ? `${grasSatCount} source${grasSatCount > 1 ? 's' : ''} de graisses saturées — à limiter au profit des insaturées.`
        : null;

  const repereActif = repereSelectionne ? REPERES_ALIMENTS.find((r) => r.id === repereSelectionne) : undefined;
  const amis = REPERES_ALIMENTS.filter((r) => r.ami);
  const aLimiter = REPERES_ALIMENTS.filter((r) => !r.ami);
  const plateauVide = totalCoeur === 0 && plateExtras.length === 0;

  const nav = (
    <div className={styles.tabs} role="tablist" aria-label="Familles d'aliments et assiette">
      {ONGLETS.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={onglet === o.id}
          className={`${styles.tab}${onglet === o.id ? ` ${styles.tabActive}` : ''}`}
          onClick={() => setOnglet(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <ModuleShell titre={shell.titre} sources={shell.sources} onBack={shell.onBack} nav={nav} wide>
      <div className={styles.module}>
        {onglet === 'familles' && (
          <div className={styles.famillesPanel}>
            {/* // à revalider (Thibault) : message patient non fourni explicitement pour cette
                section (Socle G.5) — proposition de reformulation, cf. CONTENU_cardio.md §M8. */}
            <p className={styles.headline}>L'assiette méditerranéenne soigne les artères.</p>
            <p className={styles.instruction}>Touchez un repère pour voir pourquoi.</p>
            <div className={styles.colonnes}>
              <div className={styles.colonne}>
                <p className={`${styles.colonneTitre} ${styles.colonneTitreAmi}`}>
                  Amis des artères — à mettre souvent
                </p>
                <div className={styles.grille}>
                  {amis.map((r) => (
                    <RepereCard
                      key={r.id}
                      repere={r}
                      selected={repereSelectionne === r.id}
                      onSelect={() => setRepereSelectionne(r.id)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.colonne}>
                <p className={`${styles.colonneTitre} ${styles.colonneTitreLimiter}`}>À limiter</p>
                <div className={styles.grille}>
                  {aLimiter.map((r) => (
                    <RepereCard
                      key={r.id}
                      repere={r}
                      selected={repereSelectionne === r.id}
                      onSelect={() => setRepereSelectionne(r.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {repereActif && (
              <div className={`card ${styles.detailCard}`} aria-live="polite">
                <p className={styles.detailTitre}>{repereActif.label}</p>
                <p className={styles.detailTexte}>{repereActif.texte}</p>
              </div>
            )}
          </div>
        )}

        {onglet === 'assiette' && (
          <div className={styles.assietteLayout}>
            <aside className={`card ${styles.gardeManger}`} aria-label="Le garde-manger">
              <p className={styles.gardeMangerTitre}>Le garde-manger — touchez pour ajouter à l'assiette</p>
              {CATEGORIES_PLATEAU.map((cat) => {
                const foods = ALIMENTS_PLATEAU.filter((a) => a.categorie === cat.id);
                if (foods.length === 0) return null;
                return (
                  <div key={cat.id} className={styles.categorieBloc}>
                    <p className={styles.categorieLabel} style={{ color: `var(${cat.colorVar})` }}>
                      {cat.label}
                    </p>
                    <div className={styles.categorieGrille}>
                      {foods.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          className={styles.alimentBtn}
                          onClick={() => ajouterAuPlateau(food)}
                          aria-label={`Ajouter ${food.name} à l'assiette`}
                        >
                          <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="rounded" size={56} />
                          <span className={styles.alimentNom}>{food.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </aside>

            <div className={styles.plateauCol}>
              <div className={styles.plateau} style={{ background: plateGradient }} aria-hidden="true">
                <div className={styles.plateauCentre} />
              </div>
              <div className={styles.legende}>
                <span className={styles.legendeLegumes}>● Légumes {pctLegumes}%</span>
                <span className={styles.legendeFeculents}>● Féculents {pctFeculents}%</span>
                <span className={styles.legendeProteines}>● Protéines {pctProteines}%</span>
              </div>
              {plateExtras.length > 0 && (
                <div className={styles.extras}>
                  {plateExtras.map((nom, i) => (
                    <span key={`${nom}-${i}`} className={styles.extraChip}>
                      {nom}
                    </span>
                  ))}
                </div>
              )}
              <button type="button" className={styles.resetBtn} onClick={reinitialiserPlateau}>
                <RotateCcw size={16} aria-hidden="true" /> Recommencer l'assiette
              </button>
              <button
                type="button"
                className={`btn btn--primary ${styles.ficheBtn}`}
                disabled={plateauVide}
                onClick={() => setFicheOuverte(true)}
              >
                Imprimer mon assiette
              </button>
            </div>

            <div className={`card ${styles.analyseCard}`}>
              <p className={styles.analyseEyebrow}>Analyse de l'équilibre</p>
              <p className={styles.analyseTexte} aria-live="polite">
                {analyse}
              </p>
              {avertissement && (
                <p className={styles.avertissement} aria-live="polite">
                  {avertissement}
                </p>
              )}
              <p className={styles.repere}>
                Repère : « assiette santé » — la moitié de légumes, un quart de féculents (complets),
                un quart de protéines, et un filet d'huile d'olive.
              </p>
            </div>
          </div>
        )}

        <div className={styles.renvoisRow}>
          <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('tension')}>
            Le sel fait monter la tension <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button type="button" className={styles.renvoiBtn} onClick={() => onNavigate('cholesterol')}>
            Bons gras, gras à limiter : l'effet sur le LDL <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {ficheOuverte && (
        <FicheOverlay
          eyebrow="MODULE 8 · MANGER POUR SES ARTÈRES"
          titre="Mon assiette"
          footer={<p className="fiche-filrouge">Une assiette qui protège les artères, jour après jour.</p>}
          onClose={() => setFicheOuverte(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Ma répartition</span>
            <div className={styles.fichePlateauRow}>
              <div className={styles.fichePlateau} style={{ background: plateGradient }} aria-hidden="true" />
              <ul className={styles.ficheLegende}>
                <li>Légumes — {pctLegumes}%</li>
                <li>Féculents — {pctFeculents}%</li>
                <li>Protéines — {pctProteines}%</li>
              </ul>
            </div>
          </div>
          {plateExtras.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Autres aliments ajoutés</span>
              <p className={styles.ficheExtras}>{plateExtras.join(', ')}</p>
            </div>
          )}
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Repères</span>
            <p className={styles.ficheRepereTexte}>{analyse}</p>
            {avertissement && <p className={styles.ficheRepereTexte}>{avertissement}</p>}
            <p className={styles.ficheRepereTexte}>
              « Assiette santé » : la moitié de légumes, un quart de féculents (complets), un quart de
              protéines, un filet d'huile d'olive — et pensez à limiter le sel.
            </p>
          </div>
        </FicheOverlay>
      )}
    </ModuleShell>
  );
}
