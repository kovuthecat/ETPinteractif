import { useRef, useState } from 'react';
import type { DragEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Beef, Carrot, Flame, RotateCcw, Wheat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ModuleProps } from '../../types';
import ModuleShell from '../../../components/ModuleShell';
import FicheOverlay from '../../../components/FicheOverlay';
import IllustrationSlot from '../components/IllustrationSlot';
import {
  ALIMENTS_PLATEAU,
  CATEGORIES_PLATEAU,
  REPERES_ALIMENTS,
  REPERE_PAR_ALIMENT,
  type AlimentPlateau,
  type CategoriePlateau,
  type RepereAliment,
} from './data';
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
 *   dans `public/illustrations/cardio/`) → camembert ½ légumes / ¼ féculents / ¼ protéines
 *   + analyse d'équilibre + repères sel/gras qualitatifs.
 * - Fiche « Mon assiette » (`FicheOverlay`) : photographie de l'assiette composée par le patient.
 * - Pas de renvoi inline inter-modules (correction Thibault 2026-07-23) : le soignant navigue
 *   lui-même.
 *
 * **Assiette repensée (correction Thibault 2026-07-23)** — combine les deux mécaniques du
 * camembert « Proportion » et du plateau « Repas complet » du module diabète (`AlimentationModule`,
 * défis ④ et ★) plutôt que de choisir l'une ou l'autre : chaque catégorie-cœur (légumes/féculents/
 * protéines) est représentée par **un aliment concret choisi** (glissé-déposé depuis le
 * garde-manger, ou clic en repli — son image s'affiche dans sa part, ce que l'ancien système de
 * simples compteurs ne montrait jamais), et les **proportions elles-mêmes se règlent en glissant
 * les 3 frontières du camembert** (correction Thibault 2026-07-23 : une poignée par paire de
 * catégories voisines — pl/lf/fp, `boundaryNeighbors` — généralise la géométrie à 2 frontières
 * du défi « Proportion » du diabète, qui fixait le point de fermeture du cercle à un angle de
 * départ constant). Les « extras » (matières grasses/fruits/laitiers) restent une simple liste
 * de chips, glissés ou cliqués, hors du modèle ½ · ¼ · ¼.
 * L'analyse d'équilibre pioche désormais ses messages positifs/de vigilance directement dans
 * `REPERES_ALIMENTS` (onglet Familles, via `REPERE_PAR_ALIMENT`) plutôt que d'écrire un second
 * texte qui dirait la même chose autrement.
 */

type Onglet = 'familles' | 'assiette';

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: 'familles', label: "Familles d'aliments" },
  { id: 'assiette', label: 'Composer mon assiette' },
];

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

/** Ordre du camembert = ordre de balayage des angles (légumes → féculents → protéines), même
 *  ordre que la légende/les couleurs sémantiques déjà en place. */
const CORE_CATEGORIES: { id: CategorieCoeur; label: string; colorVar: string; Icon: LucideIcon }[] = [
  { id: 'legumes', label: 'Légumes', colorVar: '--color-confort-strong', Icon: Carrot },
  { id: 'feculents', label: 'Féculents', colorVar: '--color-nav', Icon: Wheat },
  { id: 'proteines', label: 'Protéines', colorVar: '--color-toxique', Icon: Beef },
];

/** Les 3 frontières du camembert, une entre chaque paire de catégories voisines (cyclique) :
 *  `pl` (protéines → légumes, le point de « fermeture » du cercle), `lf` (légumes → féculents),
 *  `fp` (féculents → protéines). Les 3 sont draggables indépendamment (correction Thibault
 *  2026-07-23, « 3ᵉ poignée » — généralise le patron à 2 frontières du diabète, qui fixait le
 *  point de fermeture à `ANGLE_START`) : déplacer l'une ne redistribue qu'entre ses 2 catégories
 *  voisines, jamais la 3ᵉ. */
type Boundary = 'pl' | 'lf' | 'fp';
const BOUNDARY_ORDER: Boundary[] = ['pl', 'lf', 'fp'];
/** Départ « midi », parts égales (120° chacune) — même repère que l'ancien camembert 2-frontières. */
const ANGLES_DEFAUT: Record<Boundary, number> = { pl: -90, lf: -90 + 120, fp: -90 + 240 };

/** Les 2 frontières voisines d'une frontière donnée, dans l'ordre cyclique (prev → b → next). */
function boundaryNeighbors(b: Boundary): { prev: Boundary; next: Boundary } {
  const i = BOUNDARY_ORDER.indexOf(b);
  return { prev: BOUNDARY_ORDER[(i + 2) % 3], next: BOUNDARY_ORDER[(i + 1) % 3] };
}

/** Catégorie NON touchée par le drag d'une frontière (les 2 autres sont ses voisines directes).
 *  Sert à borner le drag par soustraction (`1 - fracCatégorieIntacte`) plutôt que par différence
 *  d'angles : si la catégorie intacte est déjà à 0 % (ses 2 frontières coïncident), la différence
 *  d'angles brute est ambiguë (0° ou 360° ? indiscernable), alors que sa fraction déjà connue
 *  (calculée dans l'autre sens, non ambiguë) ne l'est pas. */
const UNTOUCHED_BY_BOUNDARY: Record<Boundary, CategorieCoeur> = {
  pl: 'feculents',
  lf: 'proteines',
  fp: 'legumes',
};

function pointOnCircle(a: number, r: number): [number, number] {
  const rad = (a * Math.PI) / 180;
  return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)];
}

function unwrapAngle(angle: number, from: number): number {
  const delta = (((angle - from) % 360) + 360) % 360;
  return from + delta;
}

/** Arc (fraction 0-1) balayé en sens horaire de `from` à `to` — toujours positif, c'est la
 *  convention utilisée pour dériver les 3 proportions à partir des 3 angles de frontière. */
function fracBetween(from: number, to: number): number {
  return (unwrapAngle(to, from) - from) / 360;
}

function angleFromPointer(svg: SVGSVGElement, e: { clientX: number; clientY: number }): number {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const ctm = svg.getScreenCTM();
  const loc = ctm ? pt.matrixTransform(ctm.inverse()) : pt;
  return Math.atan2(loc.y - 100, loc.x - 100) * (180 / Math.PI);
}

function allowDrop(e: DragEvent<HTMLElement>): void {
  e.preventDefault();
}

function dragStartAliment(id: string) {
  return (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };
}

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

export default function MangerModule({ shell }: ModuleProps) {
  const [onglet, setOnglet] = useState<Onglet>('familles');
  const [repereSelectionne, setRepereSelectionne] = useState<string | null>(null);
  // Garde-manger à chips de catégorie (même patron que le module diabète, `AlimentationModule`
  // `familyTabs`) — 49 aliments ne tiennent plus en une colonne empilée lisible (correction
  // Thibault 2026-07-23, après l'enrichissement légumes/situations/diversité de `data.ts`).
  // Défaut « légumes » : c'est le rayon qui vient d'être enrichi (2 → 12 items) et que la
  // pédagogie de l'onglet Familles met en avant (« moitié de l'assiette en légumes »).
  const [categorieGardeManger, setCategorieGardeManger] = useState<CategoriePlateau>('legumes');

  // ── Assiette : un aliment concret par catégorie-cœur (repFood) + proportions continues (pct,
  // réglées au drag des frontières) — les deux mécaniques restent indépendantes, comme demandé. ──
  const [repFood, setRepFood] = useState<Partial<Record<CategorieCoeur, AlimentPlateau>>>({});
  const [angles, setAngles] = useState<Record<Boundary, number>>(ANGLES_DEFAUT);
  const [dragging, setDragging] = useState<Boundary | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [extras, setExtras] = useState<{ uid: string; id: string }[]>([]);
  const [ficheOuverte, setFicheOuverte] = useState(false);

  if (!shell) return null;

  function assignerAliment(aliment: AlimentPlateau) {
    const cat = aliment.categorie;
    if (cat === 'legumes' || cat === 'feculents' || cat === 'proteines') {
      setRepFood((prev) => ({ ...prev, [cat]: aliment }));
    } else {
      setExtras((prev) => [...prev, { uid: `${aliment.id}-${Date.now()}-${Math.random()}`, id: aliment.id }].slice(-EXTRAS_MAX));
    }
  }

  function handlePlateDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    const aliment = ALIMENTS_PLATEAU.find((a) => a.id === e.dataTransfer.getData('text/plain'));
    if (aliment) assignerAliment(aliment);
  }

  function reinitialiserPlateau() {
    setRepFood({});
    setAngles(ANGLES_DEFAUT);
    setExtras([]);
  }

  // ── Camembert : géométrie des 3 parts + poignées des 3 frontières (généralise le patron à
  // 2 frontières du défi « Proportion » du module diabète, `AlimentationModule` défi ④ — voir
  // `boundaryNeighbors`). ──
  function handleBoundaryPointerDown(boundary: Boundary) {
    return (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(boundary);
    };
  }

  function handleBoundaryPointerMove(boundary: Boundary) {
    return (e: ReactPointerEvent<SVGCircleElement>) => {
      if (dragging !== boundary) return;
      const svg = svgRef.current;
      if (!svg) return;
      const { prev } = boundaryNeighbors(boundary);
      // Fraction de la catégorie intacte (calculée dans son propre sens, non ambiguë même si
      // elle vaut déjà 0) — donne le vrai empan disponible pour cette frontière, y compris
      // quand `prev`/`next` coïncident (voir `UNTOUCHED_BY_BOUNDARY`).
      const untouchedFrac = pct[UNTOUCHED_BY_BOUNDARY[boundary]];
      setAngles((a) => {
        const prevAngle = a[prev];
        const nextAngleUnwrapped = prevAngle + (1 - untouchedFrac) * 360;
        const pointerAngle = unwrapAngle(angleFromPointer(svg, e), prevAngle);
        const clamped = Math.min(Math.max(pointerAngle, prevAngle), nextAngleUnwrapped);
        return { ...a, [boundary]: clamped };
      });
    };
  }

  function handleBoundaryPointerUp(e: ReactPointerEvent<SVGCircleElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(null);
  }

  const pct: Record<CategorieCoeur, number> = {
    legumes: fracBetween(angles.pl, angles.lf),
    feculents: fracBetween(angles.lf, angles.fp),
    proteines: fracBetween(angles.fp, angles.pl),
  };

  let angleCursor = angles.pl;
  const slices = CORE_CATEGORIES.map((cat) => {
    const frac = pct[cat.id];
    const start = angleCursor;
    const sweep = frac * 360;
    angleCursor += sweep;
    const end = start + sweep;
    const [x1, y1] = pointOnCircle(start, 92);
    const [x2, y2] = pointOnCircle(end, 92);
    const largeArc = sweep > 180 ? 1 : 0;
    const mid = (start + end) / 2;
    const [imgX, imgY] = pointOnCircle(mid, 54);
    const [labelX, labelY] = pointOnCircle(mid, 78);
    const d =
      frac > 0.001
        ? `M 100 100 L ${x1.toFixed(1)} ${y1.toFixed(1)} A 92 92 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`
        : '';
    return { ...cat, d, frac, imgX, imgY, labelX, labelY, food: repFood[cat.id] };
  });
  const HANDLES: { id: Boundary; label: string }[] = [
    { id: 'pl', label: 'protéines ↔ légumes' },
    { id: 'lf', label: 'légumes ↔ féculents' },
    { id: 'fp', label: 'féculents ↔ protéines' },
  ];
  const handles = HANDLES.map((h) => {
    const [x, y] = pointOnCircle(angles[h.id], 92);
    return { ...h, x, y };
  });

  const pctLegumes = Math.round(pct.legumes * 100);
  const pctFeculents = Math.round(pct.feculents * 100);
  const pctProteines = 100 - pctLegumes - pctFeculents;

  const hasAnyRepFood = Object.keys(repFood).length > 0;

  let analyse: string;
  if (!hasAnyRepFood) {
    analyse = 'Glissez ou touchez un aliment du garde-manger pour composer votre assiette.';
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

  // Aliments réellement présents (les 3 représentants du camembert + les extras) — sert à la fois
  // aux avertissements sel/gras et à l'enrichissement positif depuis l'onglet Familles.
  const extrasFoods = extras.map((e) => ALIMENTS_PLATEAU.find((a) => a.id === e.id)).filter((f): f is AlimentPlateau => !!f);
  const foodsSurAssiette = [...Object.values(repFood).filter((f): f is AlimentPlateau => !!f), ...extrasFoods];

  const repereSel = REPERES_ALIMENTS.find((r) => r.id === 'sel');
  const repereGras = REPERES_ALIMENTS.find((r) => r.id === 'graisses-saturees');
  const avertissements = [
    foodsSurAssiette.some((f) => f.sel === 'eleve') && repereSel ? repereSel.texte : null,
    foodsSurAssiette.some((f) => f.graisses === 'saturees') && repereGras ? repereGras.texte : null,
  ].filter((t): t is string => !!t);

  // Enrichissement positif (correction Thibault 2026-07-23) : réutilise les messages de l'onglet
  // Familles plutôt que d'en inventer un second qui dirait la même chose autrement.
  const reperesPositifs = Array.from(
    new Set(foodsSurAssiette.map((f) => REPERE_PAR_ALIMENT[f.id]).filter((id): id is string => !!id)),
  )
    .map((id) => REPERES_ALIMENTS.find((r) => r.id === id))
    .filter((r): r is RepereAliment => !!r);

  const repereActif = repereSelectionne ? REPERES_ALIMENTS.find((r) => r.id === repereSelectionne) : undefined;
  const amis = REPERES_ALIMENTS.filter((r) => r.ami);
  const aLimiter = REPERES_ALIMENTS.filter((r) => !r.ami);
  const plateauVide = !hasAnyRepFood && extras.length === 0;

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
              <p className={styles.gardeMangerTitre}>Le garde-manger — glissez ou touchez pour ajouter à l'assiette</p>
              <div className={styles.categorieChips} aria-label="Catégories du garde-manger">
                {CATEGORIES_PLATEAU.map((cat) => {
                  const active = categorieGardeManger === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={active ? `${styles.categorieChip} ${styles.categorieChipActive}` : styles.categorieChip}
                      style={active ? undefined : { borderColor: `var(${cat.colorVar})`, color: `var(${cat.colorVar})` }}
                      aria-pressed={active}
                      onClick={() => setCategorieGardeManger(cat.id)}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              <div className={styles.categorieGrille}>
                {ALIMENTS_PLATEAU.filter((a) => a.categorie === categorieGardeManger).map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className={styles.alimentBtn}
                    draggable
                    onDragStart={dragStartAliment(food.id)}
                    onClick={() => assignerAliment(food)}
                    aria-label={`Ajouter ${food.name} à l'assiette`}
                  >
                    <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="rounded" size={56} />
                    <span className={styles.alimentNom}>{food.name}</span>
                  </button>
                ))}
              </div>
            </aside>

            <div className={styles.plateauCol}>
              <div
                className={styles.plateauStage}
                onDragOver={allowDrop}
                onDrop={handlePlateDrop}
              >
                <svg
                  ref={svgRef}
                  className={styles.plateauSvg}
                  viewBox="0 0 200 200"
                  role="img"
                  aria-label={`Répartition de l'assiette : ${CORE_CATEGORIES.map(
                    (cat) => `${cat.label} ${Math.round(pct[cat.id] * 100)}%${repFood[cat.id] ? ` (${repFood[cat.id]!.name})` : ''}`,
                  ).join(', ')}. Glissez les frontières entre les parts pour régler les proportions, ou glissez/touchez un aliment du garde-manger pour le placer.`}
                >
                  <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-line)" strokeWidth={2} strokeDasharray="3 5" />
                  {slices.map((slice) => slice.d && (
                    <path key={slice.id} d={slice.d} fill={`var(${slice.colorVar})`} opacity={0.9} />
                  ))}
                  {slices.map((slice) => (
                    <text
                      key={`label-${slice.id}`}
                      x={slice.labelX}
                      y={slice.labelY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={styles.sliceLabel}
                      aria-hidden="true"
                    >
                      {Math.round(slice.frac * 100)}%
                    </text>
                  ))}
                  {/* 3 frontières draggables (une par paire de catégories voisines, correction
                      2026-07-23) : chacune redistribue le % entre ses 2 parts voisines uniquement,
                      jamais la 3ᵉ — généralise le patron à 2 frontières du diabète. */}
                  {handles.map((h) => (
                    <circle
                      key={h.id}
                      className={dragging === h.id ? `${styles.handle} ${styles.handleDragging}` : styles.handle}
                      cx={h.x}
                      cy={h.y}
                      r={9}
                      aria-hidden="true"
                      onPointerDown={handleBoundaryPointerDown(h.id)}
                      onPointerMove={handleBoundaryPointerMove(h.id)}
                      onPointerUp={handleBoundaryPointerUp}
                    />
                  ))}
                </svg>
                <div className={styles.plateauOverlay} aria-hidden="true">
                  {slices.map((slice) => (
                    <div
                      key={slice.id}
                      className={styles.plateauSlotImg}
                      style={{ left: `${(slice.imgX / 200) * 100}%`, top: `${(slice.imgY / 200) * 100}%` }}
                    >
                      {slice.food ? (
                        <IllustrationSlot id={`aliment-${slice.food.id}`} label={slice.food.name} shape="circle" size={44} />
                      ) : (
                        <slice.Icon size={22} color="var(--color-surface)" aria-hidden="true" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.legende}>
                <span className={styles.legendeLegumes}>
                  ● Légumes {pctLegumes}%{repFood.legumes ? ` — ${repFood.legumes.name}` : ''}
                </span>
                <span className={styles.legendeFeculents}>
                  ● Féculents {pctFeculents}%{repFood.feculents ? ` — ${repFood.feculents.name}` : ''}
                </span>
                <span className={styles.legendeProteines}>
                  ● Protéines {pctProteines}%{repFood.proteines ? ` — ${repFood.proteines.name}` : ''}
                </span>
              </div>
              {extras.length > 0 && (
                <div className={styles.extras}>
                  {extrasFoods.map((food, i) => (
                    <span key={`${extras[i].uid}`} className={styles.extraChip}>
                      <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="circle" size={28} />
                      {food.name}
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
              {avertissements.map((texte) => (
                <p key={texte} className={styles.avertissement} aria-live="polite">
                  {texte}
                </p>
              ))}
              {reperesPositifs.length > 0 && (
                <ul className={styles.analysePositifList} aria-live="polite">
                  {reperesPositifs.map((r) => (
                    <li key={r.id} className={styles.analysePositifItem}>
                      <strong>{r.label}.</strong> {r.texte}
                    </li>
                  ))}
                </ul>
              )}
              <p className={styles.repere}>
                Repère : « assiette santé » — la moitié de légumes, un quart de féculents (complets),
                un quart de protéines, et un filet d'huile d'olive.
              </p>
            </div>
          </div>
        )}
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
            <div className={styles.ficheImgRow}>
              {CORE_CATEGORIES.map((cat) => {
                const food = repFood[cat.id];
                return (
                  <div key={cat.id} className={styles.ficheImgItem}>
                    {food ? (
                      <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="rounded" size={64} />
                    ) : (
                      <span className={styles.ficheImgPlaceholder} aria-hidden="true" />
                    )}
                    <span className={styles.ficheImgLabel}>
                      {cat.label} {Math.round(pct[cat.id] * 100)}%{food ? ` — ${food.name}` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {extrasFoods.length > 0 && (
            <div className="fiche-bloc">
              <span className="fiche-bloc-eyebrow">Autres aliments ajoutés</span>
              <p className={styles.ficheExtras}>{extrasFoods.map((f) => f.name).join(', ')}</p>
            </div>
          )}
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Repères</span>
            <p className={styles.ficheRepereTexte}>{analyse}</p>
            {avertissements.map((texte) => (
              <p key={texte} className={styles.ficheRepereTexte}>
                {texte}
              </p>
            ))}
            {reperesPositifs.map((r) => (
              <p key={r.id} className={styles.ficheRepereTexte}>
                <strong>{r.label}.</strong> {r.texte}
              </p>
            ))}
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
