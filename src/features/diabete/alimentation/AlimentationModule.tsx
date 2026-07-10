import { useEffect, useState } from 'react';
import type { DragEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Check, X } from 'lucide-react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import InfoHover from '../../../components/InfoHover';
import IllustrationSlot from '../components/IllustrationSlot';
import CourbeGlycemie, {
  COURBE_GRAPH_WIDTH,
  COURBE_GRAPH_HEIGHT,
  DUO_CSS_COLOR,
  type CourbeDef,
} from '../components/CourbeGlycemie';
import {
  paramsFromAssiette,
  sampleRepas,
  toSvgPath,
  mgFromLevel,
  LEVEL_MAX,
  type Assiette,
  type AlimentRepas,
} from '../lib/glycemieCurve';
import {
  FOODS,
  FAMILIES,
  foodById,
  cgTier,
  CG_TIER_COLOR_VAR,
  CG_TIER_LABEL,
  fibresPalier,
  proteinesPalier,
  PALIER_FIBRES_LABEL,
  PALIER_PROTEINES_LABEL,
  SEL_LABEL,
  GRAISSES_LABEL,
  type Food,
  type Palier3,
} from './data';
import styles from './AlimentationModule.module.css';

/**
 * Module 2 — Alimentation (S5). Terrain de jeu : le garde-manger (gauche) alimente,
 * par glisser-déposer natif (fallback clic, pattern A11/A12 du tabac) l'assiette de
 * chacun des 4 défis + la synthèse. Écrans/gestes/textes = maquette (verbatim) ;
 * SEULES les courbes sont remplacées par la lib physiologique `glycemieCurve` (S2),
 * rendues par le composant partagé `CourbeGlycemie` (S3) — cf. plan S5 « Décision clé ».
 */

type DefiId = 1 | 2 | 3 | 4 | 5;
type Niveau = 'bas' | 'moyen' | 'haut';
type D4Category = 'legumes' | 'proteines' | 'feculents';

const DEFI_LABELS: Record<DefiId, string> = {
  1: '① Composition',
  2: '② Qualité',
  3: '③ Ordre',
  4: '④ Proportion',
  5: '★ Repas complet',
};
const DEFI_ORDER: DefiId[] = [1, 2, 3, 4, 5];

const NIVEAU_LABEL: Record<Niveau, string> = { bas: 'Bas', moyen: 'Moyen', haut: 'Haut' };
const NIVEAUX: Niveau[] = ['bas', 'moyen', 'haut'];
/** Couleur du badge verdict (B3) — sémantique santé, double encodage (le libellé écrit le niveau). */
const NIVEAU_COLOR_VAR: Record<Niveau, string> = {
  bas: '--color-confort',
  moyen: '--color-vigilance',
  haut: '--color-toxique',
};

/** Duels suggérés du défi ② (A4) — chaque duel isole un principe de comparaison. */
const D2_DUELS: { id: string; label: string; a: string; b: string }[] = [
  { id: 'raffinage', label: 'Baguette vs Pain complet', a: 'baguette', b: 'pain-complet' },
  { id: 'variete', label: 'Riz blanc vs Riz basmati', a: 'riz-blanc', b: 'riz-basmati' },
  { id: 'legumineuses', label: 'Riz blanc vs Lentilles', a: 'riz-blanc', b: 'lentilles' },
  { id: 'piege-cg', label: 'Dattes vs Pastèque', a: 'dattes', b: 'pasteque' },
];

// Domaine temporel commun à toutes les courbes du module (repas à t=0 → +3h, cf. S3).
const T_START = 0;
const T_END = 180;
const AXE_LABELS = ['Repas', '+1h', '+2h', '+3h'];
const MARQUEUR_REPAS = [{ t: 0, type: 'repas' as const, label: 'Repas' }];

/**
 * Seuils de classification du pic (défi 2, décision S5 : « la prédiction bas/moyen/haut
 * se compare au pic de la courbe, seuils sur le max, pas sur un score »). Recalibrés S14
 * §0.c.5 en ré-échantillonnant `paramsFromAssiette`/`sampleRepas` sur l'ensemble du
 * garde-manger avec le modèle par composition réelle, pour différencier les comparaisons
 * intra-famille visées par le brief (baguette vs pain complet, riz blanc vs basmati/complet…).
 */
const PEAK_BAS_MAX = 47;
const PEAK_HAUT_MIN = 50;

function classifyPeak(peak: number): Niveau {
  if (peak < PEAK_BAS_MAX) return 'bas';
  if (peak < PEAK_HAUT_MIN) return 'moyen';
  return 'haut';
}

function toAliment(food: Food): AlimentRepas {
  return { cg: food.cg, fibres: food.fibres, proteines: food.proteines, lipides: food.lipides };
}

/** Coordonnées locales du graphe (B2) : reproduit exactement la convention de `toSvgPath`
 *  (x = fraction du domaine temporel × largeur ; y = hauteur − fraction du niveau × hauteur,
 *  domaine niveau [0, LEVEL_MAX] par défaut, comme `toSvgPath` sans `vMin`/`vMax` explicites). */
function picAtFromPeak(tPeak: number, peak: number): { x: number; y: number } {
  return {
    x: ((tPeak - T_START) / (T_END - T_START)) * COURBE_GRAPH_WIDTH,
    y: COURBE_GRAPH_HEIGHT - (peak / LEVEL_MAX) * COURBE_GRAPH_HEIGHT,
  };
}

function buildCourbe(assiette: Assiette): { d: string; peak: number; mg: number; picAt: { x: number; y: number } } {
  const params = paramsFromAssiette(assiette);
  const points = sampleRepas(params, { tStart: T_START, tEnd: T_END, stepMinutes: 1 });
  let peak = 0;
  let tPeak = T_START;
  for (const p of points) {
    if (p.v > peak) {
      peak = p.v;
      tPeak = p.t;
    }
  }
  const d = toSvgPath(points, {
    width: COURBE_GRAPH_WIDTH,
    height: COURBE_GRAPH_HEIGHT,
    tMin: T_START,
    tMax: T_END,
  });
  return { d, peak, mg: Math.round(mgFromLevel(peak)), picAt: picAtFromPeak(tPeak, peak) };
}

function allowDrop(e: DragEvent<HTMLElement>): void {
  e.preventDefault();
}

function dragStartFood(id: string) {
  return (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };
}

function readDropId(e: DragEvent<HTMLElement>): string {
  e.preventDefault();
  return e.dataTransfer.getData('text/plain');
}

const D1_CAPTIONS = [
  'Un féculent seul provoque un grand pic de glycémie.',
  "Un premier ajout (protéine, lipide ou légume) : le pic commence à s'aplatir.",
  "Deux ajouts : le pic s'aplatit encore.",
  'Trois ajouts : à féculent constant, le pic est nettement plus doux.',
];

const D1_PLATE_MAX = 10;

const D3_FIXED = ['riz-blanc', 'poulet', 'brocoli'];
const D3_ORDINALS = ['1ère bouchée', '2e bouchée', '3e bouchée'];

const D4_CATEGORIES: { id: D4Category; label: string; colorVar: string; repFoodId: string }[] = [
  { id: 'legumes', label: 'Légumes', colorVar: '--color-confort', repFoodId: 'brocoli' },
  { id: 'proteines', label: 'Protéines', colorVar: '--color-vigilance', repFoodId: 'poulet' },
  { id: 'feculents', label: 'Féculents', colorVar: '--color-toxique', repFoodId: 'riz-blanc' },
];
/** Écart maximal à l'assiette-modèle (½ · ¼ · ¼) pour la considérer atteinte (règle maquette). */
const D4_ACHIEVED_TOLERANCE = 0.14;

/** Points de palier (●●○, C3) — glyphe sans contenu textuel, décoratif (le libellé porte le sens). */
function PalierDots({ level }: { level: Palier3 }) {
  return (
    <span className={styles.palierDots} aria-hidden="true">
      {([1, 2, 3] as const).map((i) => (
        <span key={i} className={i <= level ? styles.palierDotFilled : styles.palierDot} />
      ))}
    </span>
  );
}

/**
 * Panneau détail d'un aliment (C3, 2ᵉ niveau de lecture) — rendu dans `content` d'`InfoHover`.
 * Paliers qualitatifs uniquement, jamais de grammes (garde-fou index.md). Pied « vaisseaux » :
 * pont fil rouge vers le module Risque cardio.
 */
function FoodDetail({ food }: { food: Food }) {
  const tier = cgTier(food.cg);
  const fibresP = fibresPalier(food.fibres);
  const proteinesP = proteinesPalier(food.proteines);

  const vaisseauxLines: string[] = [];
  if (food.sel === 'eleve' || food.graisses === 'saturees') {
    vaisseauxLines.push('Ne change pas la courbe — mais compte pour vos vaisseaux.');
  }
  if (food.omega3) {
    vaisseauxLines.push('Bon pour vos vaisseaux (oméga-3).');
  }

  return (
    <div className={styles.foodDetail}>
      <p className={styles.foodDetailTitle}>
        {food.name} <span className={styles.foodDetailPortion}>· {food.portion}</span>
      </p>
      <p className={styles.foodDetailCg}>
        <span
          className={styles.cgDot}
          style={{ background: `var(${CG_TIER_COLOR_VAR[tier]})` }}
          aria-hidden="true"
        />
        CG {food.cg} — {CG_TIER_LABEL[tier]}
      </p>
      <ul className={styles.foodDetailPaliers}>
        <li>
          <PalierDots level={fibresP} /> Fibres — {PALIER_FIBRES_LABEL[fibresP]}
        </li>
        <li>
          <PalierDots level={proteinesP} /> Protéines — {PALIER_PROTEINES_LABEL[proteinesP]}
        </li>
        <li>
          Graisses — {food.graisses ? GRAISSES_LABEL[food.graisses] : '—'}
          {food.omega3 && <span className={styles.omega3Badge}>oméga-3</span>}
        </li>
        <li>Sel — {food.sel ? SEL_LABEL[food.sel] : '—'}</li>
      </ul>
      {food.atout && <p className={styles.foodDetailAtout}>{food.atout}</p>}
      {vaisseauxLines.length > 0 && (
        <div className={styles.foodDetailVaisseaux}>
          {vaisseauxLines.map((line) => (
            <p key={line} className={styles.foodDetailVaisseauxLine}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

interface FoodVignetteProps {
  food: Food;
  onActivate: () => void;
}

/**
 * Vignette du garde-manger : conteneur `draggable` (glisser-déposer natif inchangé).
 * L'image (`foodImageWrap`) est le déclencheur « ajouter » (clic/clavier, C2) ; le nom
 * (`foodName`) est le déclencheur `InfoHover` du 2ᵉ niveau de lecture — il n'ajoute rien.
 */
function FoodVignette({ food, onActivate }: FoodVignetteProps) {
  const tier = cgTier(food.cg);

  function handleImageKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  }

  return (
    <div className={styles.foodVignette} draggable onDragStart={dragStartFood(food.id)}>
      <div
        className={styles.foodImageWrap}
        role="button"
        tabIndex={0}
        onClick={onActivate}
        onKeyDown={handleImageKeyDown}
        aria-label={`${food.name} — ${CG_TIER_LABEL[tier]} (CG ${food.cg}). Glisser vers l'assiette, ou activer pour l'ajouter directement.`}
      >
        <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="rounded" size={72} />
        <span
          className={styles.cgDot}
          style={{ background: `var(${CG_TIER_COLOR_VAR[tier]})` }}
          aria-hidden="true"
        />
      </div>
      <InfoHover label={`En savoir plus sur ${food.name}`} content={<FoodDetail food={food} />}>
        <span className={styles.foodName}>{food.name}</span>
      </InfoHover>
    </div>
  );
}

interface CourbeSectionProps {
  courbes: CourbeDef[];
  onNavigateActivite: () => void;
  /** Tracé animé au montage (B4) — passé `true` uniquement au révèle du défi ②. */
  animerTrace?: boolean;
}

/** Porte 2↔3 (S5) : présente sous chaque courbe, défis comme synthèse. */
function CourbeSection({ courbes, onNavigateActivite, animerTrace }: CourbeSectionProps) {
  return (
    <div className={`card ${styles.courbeCard}`}>
      <p className={styles.courbeEyebrow}>Glycémie après le repas</p>
      <CourbeGlycemie
        courbes={courbes}
        marqueurs={MARQUEUR_REPAS}
        axeLabels={AXE_LABELS}
        hoverLegend
        animerTrace={animerTrace}
      />
      <button type="button" className={`btn btn--ghost ${styles.bougerBtn}`} onClick={onNavigateActivite}>
        Et si on bougeait après ce repas ?
      </button>
    </div>
  );
}

export default function AlimentationModule({ onNavigate }: ModuleProps) {
  const [defi, setDefi] = useState<DefiId>(1);
  const [gmFamily, setGmFamily] = useState(FAMILIES[0].id);

  // ── Progression douce (A2) — état éphémère, jamais persisté (perdu à la sortie du module). ──
  const [playedDefis, setPlayedDefis] = useState<Set<DefiId>>(new Set());

  function markPlayed(n: DefiId) {
    setPlayedDefis((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));
  }

  // ── Défi 1 — Composition ──────────────────────────────────────────────
  // Assiette libre (même patron que la synthèse ★, B1) : vide au montage, toutes les
  // familles acceptées (fruits/laitiers compris), doublons autorisés, plafond ~10.
  const [d1Plate, setD1Plate] = useState<{ uid: string; id: string }[]>([]);

  function addD1Food(id: string) {
    if (!foodById(id)) return;
    setD1Plate((prev) =>
      prev.length >= D1_PLATE_MAX ? prev : [...prev, { uid: `${id}-${prev.length}-${Math.random()}`, id }],
    );
  }
  function handleD1Drop(e: DragEvent<HTMLElement>) {
    addD1Food(readDropId(e));
  }
  function handleD1Remove(uid: string) {
    setD1Plate((prev) => prev.filter((c) => c.uid !== uid));
  }
  function handleD1Reset() {
    setD1Plate([]);
  }

  const d1Foods = d1Plate.map((c) => foodById(c.id)).filter((f): f is Food => !!f);
  const d1Feculents = d1Foods.filter((f) => f.famille === 'feculents');
  const d1FreinCount = d1Foods.filter(
    (f) => f.famille === 'proteines' || f.famille === 'lipides' || f.famille === 'legumes',
  ).length;
  const d1Courbe = buildCourbe({ aliments: d1Foods.map(toAliment) });
  // A3 : courbe fantôme « féculents seuls » — visible dès qu'il y a au moins un féculent
  // ET au moins un frein (sinon la courbe assiette = la courbe féculents, redondant).
  const d1ShowFantome = d1Feculents.length >= 1 && d1FreinCount >= 1;
  const d1CourbeFeculents = d1ShowFantome ? buildCourbe({ aliments: d1Feculents.map(toAliment) }) : null;

  // A2 · critère défi ① : ≥ 1 féculent ET ≥ 2 freins.
  useEffect(() => {
    if (d1Feculents.length >= 1 && d1FreinCount >= 2) markPlayed(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d1Feculents.length, d1FreinCount]);

  // ── Défi 2 — Qualité (devine → révèle) ────────────────────────────────
  const [d2Slots, setD2Slots] = useState<{ A: string; B: string }>({ A: 'baguette', B: 'pain-complet' });
  const [d2Guess, setD2Guess] = useState<{ A: Niveau | null; B: Niveau | null }>({ A: null, B: null });
  const [d2Revealed, setD2Revealed] = useState(false);
  const [d2NextSlot, setD2NextSlot] = useState<'A' | 'B'>('A');

  function d2AssignFood(id: string, slot?: 'A' | 'B') {
    if (!foodById(id)) return;
    const targetSlot = slot ?? d2NextSlot;
    setD2Slots((prev) => (prev[targetSlot] === id ? prev : { ...prev, [targetSlot]: id }));
    setD2Guess((prev) => ({ ...prev, [targetSlot]: null }));
    setD2Revealed(false);
    setD2NextSlot(targetSlot === 'A' ? 'B' : 'A');
  }
  function handleD2Drop(slot: 'A' | 'B') {
    return (e: DragEvent<HTMLElement>) => d2AssignFood(readDropId(e), slot);
  }
  function handleD2Guess(slot: 'A' | 'B', level: Niveau) {
    if (d2Revealed) return;
    setD2Guess((prev) => ({ ...prev, [slot]: level }));
  }
  function handleD2Reveal() {
    setD2Revealed(true);
    markPlayed(2);
  }
  function handleD2Reset() {
    setD2Guess({ A: null, B: null });
    setD2Revealed(false);
  }
  /** A4 : chip duel suggéré — même chemin que `d2AssignFood` (reset prédictions + révèle). */
  function handleD2Duel(duel: { a: string; b: string }) {
    setD2Slots({ A: duel.a, B: duel.b });
    setD2Guess({ A: null, B: null });
    setD2Revealed(false);
    setD2NextSlot('A');
  }

  function computeD2Card(slot: 'A' | 'B') {
    const food = foodById(d2Slots[slot]) ?? FOODS[0];
    const courbe = buildCourbe({ aliments: [toAliment(food)] });
    const correct = classifyPeak(courbe.peak);
    return { slot, food, courbe, correct };
  }
  const d2CardA = computeD2Card('A');
  const d2CardB = computeD2Card('B');
  const d2CanReveal = !d2Revealed && d2Guess.A !== null && d2Guess.B !== null;

  // ── Défi 3 — Ordre ─────────────────────────────────────────────────────
  const [d3Order, setD3Order] = useState<string[]>(D3_FIXED);
  const [d3Hint, setD3Hint] = useState<string | null>(null);

  // Conflit de payload (B2) : le réordonnancement interne pose un index préfixé,
  // le garde-manger pose un id d'aliment brut — on route dans handleD3Drop.
  function handleD3DragStart(index: number) {
    return (e: DragEvent<HTMLElement>) => {
      e.dataTransfer.setData('text/plain', `d3-index:${index}`);
    };
  }

  function d3ReplaceSlot(index: number, foodId: string) {
    const food = foodById(foodId);
    if (!food) return;
    setD3Order((prev) => {
      if (prev.includes(foodId)) {
        setD3Hint('Cet aliment est déjà dans le trio.');
        return prev;
      }
      const resteFeculent = prev.some((id, i) =>
        i === index ? food.famille === 'feculents' : foodById(id)?.famille === 'feculents',
      );
      if (!resteFeculent) {
        setD3Hint('Gardez au moins un féculent pour cet exercice.');
        return prev;
      }
      setD3Hint(null);
      const arr = [...prev];
      arr[index] = foodId;
      return arr;
    });
  }

  function handleD3Drop(index: number) {
    return (e: DragEvent<HTMLElement>) => {
      const payload = readDropId(e);
      const reorderMatch = /^d3-index:(\d+)$/.exec(payload);
      if (!reorderMatch) {
        d3ReplaceSlot(index, payload);
        return;
      }
      const from = Number.parseInt(reorderMatch[1], 10);
      if (Number.isNaN(from) || from === index) return;
      setD3Hint(null);
      markPlayed(3);
      setD3Order((prev) => {
        const arr = [...prev];
        const [item] = arr.splice(from, 1);
        arr.splice(index, 0, item);
        return arr;
      });
    };
  }
  function handleD3Move(index: number, dir: -1 | 1) {
    setD3Hint(null);
    setD3Order((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      markPlayed(3);
      const arr = [...prev];
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  }
  /** Fallback clic garde-manger (B2) : remplace le slot de même famille, sinon le dernier
   *  slot non-féculent. */
  function d3ActivateFromShelf(foodId: string) {
    const food = foodById(foodId);
    if (!food) return;
    const sameFamilyIdx = d3Order.findIndex((id) => foodById(id)?.famille === food.famille);
    if (sameFamilyIdx !== -1) {
      d3ReplaceSlot(sameFamilyIdx, foodId);
      return;
    }
    for (let i = d3Order.length - 1; i >= 0; i--) {
      if (foodById(d3Order[i])?.famille !== 'feculents') {
        d3ReplaceSlot(i, foodId);
        return;
      }
    }
  }

  const d3Foods = d3Order.map((id) => foodById(id)).filter((f): f is Food => !!f);
  const d3FeculentIdx = d3Foods.findIndex((f) => f.famille === 'feculents');
  const d3OrdreFrac = d3FeculentIdx >= 0 && d3Foods.length > 1 ? d3FeculentIdx / (d3Foods.length - 1) : 0;
  const d3OrdreFracFantome = d3OrdreFrac >= 0.5 ? 0 : 1;
  const d3AlimentsBase = d3Foods.map(toAliment);
  const d3CourbeActuel = buildCourbe({ aliments: d3AlimentsBase, ordreFeculent: d3OrdreFrac });
  const d3CourbeRef = buildCourbe({ aliments: d3AlimentsBase, ordreFeculent: d3OrdreFracFantome });
  const d3ActuelLabel = `Féculent en ${D3_ORDINALS[d3FeculentIdx] ?? D3_ORDINALS[0]}`;
  const d3RefLabel = d3OrdreFrac >= 0.5 ? 'Si féculent en premier' : 'Si féculent en dernier';

  // ── Défi 4 — Proportion ───────────────────────────────────────────────
  const [d4Counts, setD4Counts] = useState<Record<D4Category, number>>({
    legumes: 1,
    proteines: 0,
    feculents: 3,
  });
  const [d4Touched, setD4Touched] = useState(false);

  function handleD4Inc(cat: D4Category) {
    setD4Touched(true);
    setD4Counts((prev) => (prev[cat] >= 8 ? prev : { ...prev, [cat]: prev[cat] + 1 }));
  }
  function handleD4Dec(cat: D4Category) {
    setD4Touched(true);
    setD4Counts((prev) => (prev[cat] <= 0 ? prev : { ...prev, [cat]: prev[cat] - 1 }));
  }

  const d4CountsTotal = d4Counts.legumes + d4Counts.proteines + d4Counts.feculents;
  const d4Total = d4CountsTotal || 1;
  const d4Pct: Record<D4Category, number> = {
    legumes: d4Counts.legumes / d4Total,
    proteines: d4Counts.proteines / d4Total,
    feculents: d4Counts.feculents / d4Total,
  };
  const d4Diff = Math.abs(d4Pct.legumes - 0.5) + Math.abs(d4Pct.proteines - 0.25) + Math.abs(d4Pct.feculents - 0.25);
  const d4Achieved = d4Touched && d4Diff < D4_ACHIEVED_TOLERANCE && d4CountsTotal >= 3;

  // A2 · critère défi ④ : l'assiette-modèle est atteinte.
  useEffect(() => {
    if (d4Achieved) markPlayed(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d4Achieved]);

  // B3 : portions réelles — chaque catégorie apporte son aliment représentatif répété
  // `d4Counts[cat]` fois (plus de paramètre `proportions` : l'effet émerge de la composition).
  const d4Aliments = D4_CATEGORIES.flatMap((cat) => {
    const food = foodById(cat.repFoodId);
    return food ? Array.from({ length: d4Counts[cat.id] }, () => toAliment(food)) : [];
  });
  const d4Courbe = buildCourbe({ aliments: d4Aliments });

  let d4Angle = -90;
  const d4PieSlices = D4_CATEGORIES.map((cat) => {
    const frac = d4Pct[cat.id];
    const start = d4Angle;
    const sweep = frac * 360;
    d4Angle += sweep;
    const end = start + sweep;
    const toXY = (a: number): [number, number] => {
      const rad = (a * Math.PI) / 180;
      return [100 + 92 * Math.cos(rad), 100 + 92 * Math.sin(rad)];
    };
    const [x1, y1] = toXY(start);
    const [x2, y2] = toXY(end);
    const largeArc = sweep > 180 ? 1 : 0;
    const d =
      frac > 0.001
        ? `M 100 100 L ${x1.toFixed(1)} ${y1.toFixed(1)} A 92 92 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`
        : '';
    return { id: cat.id, d, colorVar: cat.colorVar };
  });

  // ── Synthèse ★ (= fiche) ───────────────────────────────────────────────
  const [synthPlate, setSynthPlate] = useState<{ uid: string; id: string }[]>([]);
  const [ficheOpen, setFicheOpen] = useState(false);

  function addToPlate(id: string) {
    const food = foodById(id);
    if (!food) return;
    setSynthPlate((prev) =>
      prev.length >= 10 ? prev : [...prev, { uid: `${id}-${Date.now()}-${Math.random()}`, id }],
    );
  }
  function handleSynthDrop(e: DragEvent<HTMLElement>) {
    addToPlate(readDropId(e));
  }
  function handleSynthRemove(uid: string) {
    setSynthPlate((prev) => prev.filter((c) => c.uid !== uid));
  }
  function handleSynthReset() {
    setSynthPlate([]);
  }

  const synthFoods = synthPlate.map((c) => foodById(c.id)).filter((f): f is Food => !!f);
  const synthFamilies = new Set(synthFoods.map((f) => f.famille));
  const synthFeculents = synthFoods.filter((f) => f.famille === 'feculents');
  const synthHasRedFeculent = synthFeculents.some((f) => cgTier(f.cg) === 'rouge');
  const synthTotal = synthFoods.length || 1;
  const synthFeculentFrac = synthFeculents.length / synthTotal;
  const synthBalance = synthFoods.length ? Math.max(0, 1 - Math.abs(synthFeculentFrac - 0.25) * 2) : 0;

  const principleTicks = [
    { id: 'composition', label: 'Composition', ok: synthFamilies.size >= 2 },
    { id: 'qualite', label: 'Qualité', ok: synthFeculents.length > 0 && !synthHasRedFeculent },
    { id: 'ordre', label: 'Ordre', ok: synthFeculents.length > 0 && synthFamilies.size >= 2 },
    { id: 'proportion', label: 'Proportion', ok: synthBalance > 0.5 },
  ];

  const synthCourbePrincipale = buildCourbe({
    aliments: synthFoods.map(toAliment),
    ordreFeculent: 1,
  });
  const synthCourbeNaive = buildCourbe({
    aliments: synthFoods.filter((f) => f.famille !== 'legumes').map(toAliment),
    ordreFeculent: 0,
  });

  // ── Caption (verbatim maquette, cf. « Écrans, gestes, textes = maquette ») ────
  function getCaption(): { eyebrow: string; text: string } {
    if (defi === 1) {
      const text =
        d1Foods.length === 0 ? 'Glissez un premier aliment depuis le garde-manger.' : D1_CAPTIONS[Math.min(d1FreinCount, 3)];
      return { eyebrow: '① Composition — construisez votre assiette', text };
    }
    if (defi === 2) {
      return {
        eyebrow: '② Qualité — devine puis révèle',
        text: 'Glissez deux aliments à comparer, prédisez leur pic, puis révélez les courbes réelles.',
      };
    }
    if (defi === 3) {
      return {
        eyebrow: '③ Ordre — même assiette, ordre différent',
        text: d3Hint ?? 'Manger le féculent en dernier réduit le pic — mêmes aliments, ordre différent.',
      };
    }
    if (defi === 4) {
      return {
        eyebrow: "④ Proportion — construisez l'assiette-modèle",
        text: '½ légumes, ¼ protéines, ¼ féculents : la proportion qui aplatit durablement la courbe.',
      };
    }
    return {
      eyebrow: '★ Repas complet — validez et expérimentez',
      text: 'Composez librement votre repas : la courbe et les principes valident ce que vous avez appris.',
    };
  }
  const caption = getCaption();

  function handleShelfActivate(id: string) {
    if (defi === 1) addD1Food(id);
    else if (defi === 2) d2AssignFood(id);
    else if (defi === 3) d3ActivateFromShelf(id);
    else if (defi === 5) addToPlate(id);
  }

  function handleTabKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const nextIndex = (index + (e.key === 'ArrowRight' ? 1 : -1) + DEFI_ORDER.length) % DEFI_ORDER.length;
    setDefi(DEFI_ORDER[nextIndex]);
  }

  // A2 · CTA « Défi suivant → » : jamais bloquant, les onglets restent tous cliquables
  // (invariant : aucun enchaînement forcé). N'apparaît jamais sur ★ (pas de « suivant »).
  const showNextCta = defi !== 5 && playedDefis.has(defi);
  function handleNextDefi() {
    const index = DEFI_ORDER.indexOf(defi);
    const next = DEFI_ORDER[index + 1];
    if (next) setDefi(next);
  }

  const showShelf = defi === 1 || defi === 2 || defi === 3 || defi === 5;

  return (
    <div className={styles.module}>
      <div className={styles.tabs} role="tablist" aria-label="Les 4 défis et la synthèse">
        {DEFI_ORDER.map((n, index) => {
          const played = playedDefis.has(n);
          return (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={defi === n}
              tabIndex={defi === n ? 0 : -1}
              className={defi === n ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setDefi(n)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              aria-label={played ? `${DEFI_LABELS[n]} — défi joué` : undefined}
            >
              {DEFI_LABELS[n]}
              {played && (
                <span className={styles.tabCheck} aria-hidden="true">
                  {' '}
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.layout}>
        {showShelf && (
          <aside className={styles.shelf} aria-label="Le garde-manger">
            <p className={styles.shelfTitle}>Le garde-manger</p>
            <div className={styles.familyTabs}>
              {FAMILIES.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  className={gmFamily === fam.id ? `${styles.familyTab} ${styles.familyTabActive}` : styles.familyTab}
                  aria-pressed={gmFamily === fam.id}
                  onClick={() => setGmFamily(fam.id)}
                >
                  {fam.label}
                </button>
              ))}
            </div>
            <div className={styles.shelfGrid}>
              {FOODS.filter((f) => f.famille === gmFamily).map((food) => (
                <FoodVignette key={food.id} food={food} onActivate={() => handleShelfActivate(food.id)} />
              ))}
            </div>
          </aside>
        )}

        <div className={styles.stage}>
          <div className={styles.captionRow}>
            <div className={styles.captionBlock}>
              <p className={styles.captionEyebrow}>{caption.eyebrow}</p>
              <p className={styles.captionText}>{caption.text}</p>
            </div>
            {showNextCta && (
              <button type="button" className={`btn btn--ghost ${styles.nextDefiBtn}`} onClick={handleNextDefi}>
                Défi suivant →
              </button>
            )}
          </div>

          {defi === 1 && (
            <>
              <div className={styles.d1Layout}>
                <div className={styles.d1Plate} onDragOver={allowDrop} onDrop={handleD1Drop}>
                  {d1Foods.length === 0 && (
                    <p className={styles.d1Empty}>Glissez un premier aliment depuis le garde-manger.</p>
                  )}
                  {d1Plate.map((chip) => {
                    const food = foodById(chip.id);
                    if (!food) return null;
                    return (
                      <button
                        key={chip.uid}
                        type="button"
                        className={styles.d1Chip}
                        onClick={() => handleD1Remove(chip.uid)}
                        aria-label={`Retirer ${food.name} de l'assiette`}
                      >
                        <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="circle" size={56} />
                      </button>
                    );
                  })}
                </div>
                <div className={styles.side}>
                  <p className={styles.sideLabel}>
                    Dans l'assiette : {d1Foods.length} aliment{d1Foods.length > 1 ? 's' : ''}, dont {d1Feculents.length}{' '}
                    féculent{d1Feculents.length > 1 ? 's' : ''}
                  </p>
                  <p className={styles.sideHint}>
                    Glissez des aliments du garde-manger sur l'assiette (ou activez-les) — toutes les familles sont
                    acceptées, plusieurs fois si besoin.
                  </p>
                  <button type="button" className={styles.linkReset} onClick={handleD1Reset}>
                    Recommencer
                  </button>
                </div>
              </div>
              <CourbeSection
                courbes={
                  d1ShowFantome && d1CourbeFeculents
                    ? [
                        {
                          id: 'd1',
                          d: d1Courbe.d,
                          label: 'Votre assiette',
                          mg: `${d1Courbe.mg} mg/dL`,
                          variante: 'principale',
                        },
                        {
                          id: 'feculents-seuls',
                          d: d1CourbeFeculents.d,
                          label: 'Vos féculents seuls',
                          mg: `${d1CourbeFeculents.mg} mg/dL`,
                          variante: 'fantome',
                        },
                      ]
                    : [
                        {
                          id: 'd1',
                          d: d1Courbe.d,
                          label: 'Votre assiette',
                          mg: `${d1Courbe.mg} mg/dL`,
                          variante: 'principale',
                        },
                      ]
                }
                onNavigateActivite={() => onNavigate('activite')}
              />
            </>
          )}

          {defi === 2 && (
            <>
              <div className={styles.d2Duels} role="group" aria-label="Duels suggérés">
                {D2_DUELS.map((duel) => {
                  const active = d2Slots.A === duel.a && d2Slots.B === duel.b;
                  return (
                    <button
                      key={duel.id}
                      type="button"
                      className={active ? `${styles.familyTab} ${styles.familyTabActive}` : styles.familyTab}
                      aria-pressed={active}
                      onClick={() => handleD2Duel(duel)}
                    >
                      {duel.label}
                    </button>
                  );
                })}
              </div>
              <div className={styles.d2Layout}>
                {(['A', 'B'] as const).map((slot) => {
                  const card = slot === 'A' ? d2CardA : d2CardB;
                  const duoKey = slot === 'A' ? 'duoA' : 'duoB';
                  return (
                    <div
                      key={slot}
                      className={styles.d2Card}
                      style={{ borderTopColor: DUO_CSS_COLOR[duoKey] }}
                      onDragOver={allowDrop}
                      onDrop={handleD2Drop(slot)}
                    >
                      <div className={styles.d2ImageWrap}>
                        <IllustrationSlot id={`aliment-${card.food.id}`} label={card.food.name} shape="rounded" size={112} />
                      </div>
                      <InfoHover label={`En savoir plus sur ${card.food.name}`} content={<FoodDetail food={card.food} />}>
                        <span className={styles.d2Name}>{card.food.name}</span>
                      </InfoHover>
                      <div className={styles.d2Levels}>
                        {NIVEAUX.map((level) => {
                          const isGuess = d2Guess[slot] === level;
                          const isCorrect = level === card.correct;
                          let state = styles.levelDefault;
                          if (d2Revealed) {
                            if (isCorrect) state = styles.levelCorrect;
                            else if (isGuess) state = styles.levelWrongGuess;
                          } else if (isGuess) {
                            state = styles.levelGuessed;
                          }
                          return (
                            <button
                              key={level}
                              type="button"
                              className={`${styles.levelBtn} ${state}`}
                              onClick={() => handleD2Guess(slot, level)}
                              disabled={d2Revealed}
                              aria-pressed={isGuess}
                            >
                              {NIVEAU_LABEL[level]}
                            </button>
                          );
                        })}
                      </div>
                      {d2Revealed && (
                        <div className={styles.d2Verdict}>
                          <span
                            className={styles.verdictBadge}
                            style={{ background: `var(${NIVEAU_COLOR_VAR[card.correct]})` }}
                          >
                            Pic {NIVEAU_LABEL[card.correct].toLowerCase()}
                          </span>
                          {d2Guess[slot] === card.correct ? (
                            <p className={styles.verdictOk}>
                              <Check size={18} aria-hidden="true" /> Bonne prédiction
                            </p>
                          ) : (
                            <p className={styles.verdictOff}>
                              <X size={18} aria-hidden="true" /> Vous aviez dit :{' '}
                              {d2Guess[slot] ? NIVEAU_LABEL[d2Guess[slot] as Niveau] : '—'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className={styles.sideHint}>
                Glissez un aliment du garde-manger sur une carte pour le comparer (ou activez-le : il se place dans
                la carte libre).
              </p>
              <div className={styles.d2Actions}>
                {d2CanReveal && (
                  <button type="button" className="btn btn--primary" onClick={handleD2Reveal}>
                    Révéler les courbes
                  </button>
                )}
                {d2Revealed && (
                  <button type="button" className="btn btn--ghost" onClick={handleD2Reset}>
                    Recommencer
                  </button>
                )}
              </div>
              {d2Revealed && (
                <CourbeSection
                  courbes={[
                    {
                      id: 'A',
                      d: d2CardA.courbe.d,
                      label: d2CardA.food.name,
                      mg: `${d2CardA.courbe.mg} mg/dL`,
                      variante: 'duoA',
                      picAt: d2CardA.courbe.picAt,
                      etiquette: d2CardA.food.name,
                    },
                    {
                      id: 'B',
                      d: d2CardB.courbe.d,
                      label: d2CardB.food.name,
                      mg: `${d2CardB.courbe.mg} mg/dL`,
                      variante: 'duoB',
                      picAt: d2CardB.courbe.picAt,
                      etiquette: d2CardB.food.name,
                    },
                  ]}
                  onNavigateActivite={() => onNavigate('activite')}
                  animerTrace
                />
              )}
            </>
          )}

          {defi === 3 && (
            <>
              <p className={styles.sideHint}>
                Glissez pour changer l'ordre des bouchées (ou utilisez les flèches) — ou glissez un aliment du
                garde-manger sur une bouchée pour la remplacer.
              </p>
              <div className={styles.d3Row}>
                {d3Foods.map((food, index) => (
                  <div
                    key={food.id}
                    className={styles.d3Slot}
                    draggable
                    onDragStart={handleD3DragStart(index)}
                    onDragOver={allowDrop}
                    onDrop={handleD3Drop(index)}
                  >
                    <p className={styles.d3Ordinal}>{D3_ORDINALS[index]}</p>
                    <div className={styles.d3ImageWrap}>
                      <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="rounded" size={96} />
                    </div>
                    <p className={styles.d3Name}>{food.name}</p>
                    <div className={styles.d3Nudge}>
                      <button
                        type="button"
                        className={styles.nudgeBtn}
                        onClick={() => handleD3Move(index, -1)}
                        disabled={index === 0}
                        aria-label={`Avancer ${food.name} dans l'ordre`}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className={styles.nudgeBtn}
                        onClick={() => handleD3Move(index, 1)}
                        disabled={index === d3Foods.length - 1}
                        aria-label={`Reculer ${food.name} dans l'ordre`}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <CourbeSection
                courbes={[
                  {
                    id: 'actuel',
                    d: d3CourbeActuel.d,
                    label: d3ActuelLabel,
                    mg: `${d3CourbeActuel.mg} mg/dL`,
                    variante: 'principale',
                  },
                  {
                    id: 'reference',
                    d: d3CourbeRef.d,
                    label: d3RefLabel,
                    mg: `${d3CourbeRef.mg} mg/dL`,
                    variante: 'fantome',
                  },
                ]}
                onNavigateActivite={() => onNavigate('activite')}
              />
            </>
          )}

          {defi === 4 && (
            <>
              <div className={styles.d4Layout}>
                <svg className={styles.d4Pie} viewBox="0 0 200 200" role="img" aria-label="Répartition de l'assiette en parts">
                  <circle cx="100" cy="100" r="92" fill="none" stroke="var(--color-line)" strokeWidth={2} strokeDasharray="3 5" />
                  {d4PieSlices.map(
                    (slice) =>
                      slice.d && <path key={slice.id} d={slice.d} fill={`var(${slice.colorVar})`} opacity={0.92} />,
                  )}
                  <circle cx="100" cy="100" r="34" fill="var(--color-bg)" />
                </svg>
                <div className={styles.d4Zones}>
                  <p className={styles.sideHint}>Ajustez les portions avec + / −.</p>
                  {D4_CATEGORIES.map((cat) => (
                    <div key={cat.id} className={styles.d4Zone}>
                      <span className={styles.d4Dot} style={{ background: `var(${cat.colorVar})` }} aria-hidden="true" />
                      <span className={styles.d4Label}>{cat.label}</span>
                      <span className={styles.d4Pct}>{Math.round(d4Pct[cat.id] * 100)}%</span>
                      <button
                        type="button"
                        className={styles.roundBtn}
                        onClick={() => handleD4Dec(cat.id)}
                        aria-label={`Diminuer la part de ${cat.label}`}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        className={styles.roundBtn}
                        onClick={() => handleD4Inc(cat.id)}
                        aria-label={`Augmenter la part de ${cat.label}`}
                      >
                        +
                      </button>
                    </div>
                  ))}
                  {d4Achieved && (
                    <p className={styles.achieved}>
                      ✓ Proche de l'assiette-modèle ½ légumes · ¼ protéines · ¼ féculents
                    </p>
                  )}
                </div>
              </div>
              <CourbeSection
                courbes={[
                  { id: 'd4', d: d4Courbe.d, label: 'Votre assiette', mg: `${d4Courbe.mg} mg/dL`, variante: 'principale' },
                ]}
                onNavigateActivite={() => onNavigate('activite')}
              />
            </>
          )}

          {defi === 5 && (
            <>
              <div className={styles.synthPlate} onDragOver={allowDrop} onDrop={handleSynthDrop}>
                {synthPlate.length === 0 && (
                  <p className={styles.synthEmpty}>
                    Composez et testez librement : glissez des aliments depuis le garde-manger (ou activez-les).
                  </p>
                )}
                {synthPlate.map((chip) => {
                  const food = foodById(chip.id);
                  if (!food) return null;
                  return (
                    <button
                      key={chip.uid}
                      type="button"
                      className={styles.synthChip}
                      onClick={() => handleSynthRemove(chip.uid)}
                      aria-label={`Retirer ${food.name} de l'assiette`}
                    >
                      <IllustrationSlot id={`aliment-${food.id}`} label={food.name} shape="rounded" size={78} />
                    </button>
                  );
                })}
              </div>
              <div className={styles.synthFooterRow}>
                <div className={styles.principleRow}>
                  {principleTicks.map((p) => (
                    <span key={p.id} className={styles.principleItem}>
                      <span className={p.ok ? styles.principleMarkOk : styles.principleMark} aria-hidden="true">
                        {p.ok ? <Check size={14} /> : '·'}
                      </span>
                      <span className={p.ok ? styles.principleLabelOk : styles.principleLabel}>{p.label}</span>
                    </span>
                  ))}
                </div>
                <button type="button" className={styles.linkReset} onClick={handleSynthReset}>
                  Recommencer
                </button>
              </div>
              {synthPlate.length > 0 && (
                <CourbeSection
                  courbes={[
                    {
                      id: 'principale',
                      d: synthCourbePrincipale.d,
                      label: 'Votre repas',
                      mg: `${synthCourbePrincipale.mg} mg/dL`,
                      variante: 'principale',
                    },
                    {
                      id: 'naive',
                      d: synthCourbeNaive.d,
                      label: "Version naïve (féculents d'abord, sans légumes)",
                      mg: `${synthCourbeNaive.mg} mg/dL`,
                      variante: 'fantome',
                    },
                  ]}
                  onNavigateActivite={() => onNavigate('activite')}
                />
              )}
              <button
                type="button"
                className={`btn btn--primary ${styles.ficheButton}`}
                disabled={synthPlate.length === 0}
                onClick={() => setFicheOpen(true)}
              >
                Imprimer mon assiette
              </button>
            </>
          )}
        </div>
      </div>

      <ModuleFooterNav
        items={[{ id: 'activite', label: 'Et si on bougeait après ce repas ?' }]}
        onNavigate={onNavigate}
      />

      {ficheOpen && (
        <FicheOverlay
          eyebrow="MODULE 2 · ALIMENTATION"
          titre="Mon assiette"
          footer={
            <p className="fiche-filrouge">
              Le diabète est une maladie des vaisseaux, pas seulement du sucre — agir sur tout ensemble protège.
            </p>
          }
          onClose={() => setFicheOpen(false)}
        >
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Aliments retenus</span>
            <ul className={styles.ficheList}>
              {synthFoods.map((food) => (
                <li key={food.id} className={styles.ficheListItem}>
                  <span
                    className={styles.cgDot}
                    style={{ background: `var(${CG_TIER_COLOR_VAR[cgTier(food.cg)]})` }}
                    aria-hidden="true"
                  />
                  {food.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Ma courbe</span>
            <CourbeGlycemie
              courbes={[{ id: 'fiche', d: synthCourbePrincipale.d, label: 'Votre repas', variante: 'principale' }]}
              marqueurs={MARQUEUR_REPAS}
              axeLabels={AXE_LABELS}
            />
          </div>
          <div className="fiche-bloc">
            <span className="fiche-bloc-eyebrow">Les 4 principes</span>
            <ul className={styles.fichePrinciples}>
              {principleTicks.map((p) => (
                <li key={p.id} className={styles.fichePrincipleItem}>
                  <span aria-hidden="true">{p.ok ? '✓' : '·'}</span> {p.label}
                </li>
              ))}
            </ul>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
