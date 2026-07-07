
const PILLARS = {
  physique: {
    label: 'Physique',
    color: 'oklch(65% 0.13 80)',
    colorSoft: 'oklch(65% 0.13 80 / .18)',
    exemples: ['Manque', 'Irritabilité', 'Nervosité', 'Troubles de la concentration', 'Troubles du sommeil'],
    outils: [
      'Des substituts adaptés permettent de combler le manque sans fumer.',
      'Comprendre la cinétique de la nicotine et les seuils aide à mieux anticiper.'
    ]
  },
  psychologique: {
    label: 'Psychologique',
    color: 'oklch(48% 0.08 230)',
    colorSoft: 'oklch(48% 0.08 230 / .16)',
    exemples: ['Stress', 'Anxiété', 'Ennui', 'Plaisir et récompense', 'Stimulation'],
    outils: [
      'La gestion du stress et la respiration aident à apaiser sans fumer.',
      "Trouver d'autres sources de plaisir et s'occuper l'esprit."
    ]
  },
  comportementale: {
    label: 'Comportementale',
    color: 'oklch(58% 0.09 145)',
    colorSoft: 'oklch(58% 0.09 145 / .18)',
    exemples: ['Café-clope', 'Après les repas', 'En pause', 'En voiture', 'En social'],
    outils: [
      'Repérer les automatismes et les associations pour les rompre progressivement.',
      'Modifier les routines et les contextes favorables à la cigarette.'
    ]
  }
};

const TIME_MAX = 24;
const GX0 = 20, GX1 = 620, GY_TOP = 20, GY_BOT = 220, LEVEL_MAX = 100;

const TYPE_INFO = {
  cigarette: { label: 'C', color: 'oklch(55% 0.15 30)', colorSoft: 'oklch(55% 0.15 30 / .16)' },
  patch: { label: 'P', color: 'oklch(58% 0.09 145)', colorSoft: 'oklch(58% 0.09 145 / .16)' },
  substitut: { label: 'S', color: 'oklch(48% 0.08 230)', colorSoft: 'oklch(48% 0.08 230 / .16)' }
};

function timeToX(t) { return GX0 + (t / TIME_MAX) * (GX1 - GX0); }
function levelToY(l) {
  const clamped = Math.max(0, Math.min(LEVEL_MAX, l));
  return GY_BOT - (clamped / LEVEL_MAX) * (GY_BOT - GY_TOP);
}

function cigaretteContribution(t, t0) {
  const dt = t - t0;
  if (dt < 0) return 0;
  const rise = 1 - Math.exp(-dt / 0.04);
  const decay = Math.exp(-dt * Math.LN2 / 1.2);
  return 40 * rise * decay;
}
function patchContribution(t, t0, dose) {
  const dt = t - t0;
  if (dt < 0) return 0;
  const amp = 30 * dose;
  if (dt < 0.5) return amp * (dt / 0.5);
  return amp;
}
function substitutContribution(t, t0) {
  const dt = t - t0;
  if (dt < 0) return 0;
  const rise = 1 - Math.exp(-dt / 0.35);
  const decay = Math.exp(-dt * Math.LN2 / 2.2);
  return 26 * rise * decay;
}
function contributionFor(type, t, t0, dose) {
  if (type === 'cigarette') return cigaretteContribution(t, t0);
  if (type === 'patch') return patchContribution(t, t0, dose);
  if (type === 'substitut') return substitutContribution(t, t0);
  return 0;
}
function buildCurvePath(events) {
  const steps = 200;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TIME_MAX;
    let level = 4;
    for (const ev of events) level += contributionFor(ev.type, t, ev.time, ev.dose);
    const x = timeToX(t);
    const y = levelToY(level);
    d += (i === 0 ? 'M' : ' L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d;
}
function formatDose(dose) {
  const n = Math.round(dose * 4);
  if (n % 4 === 0) return '×' + (n / 4);
  return '×' + (n / 4).toFixed(2).replace(/0$/, '');
}
function formatTime(t) {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return h + 'h' + (m ? String(m).padStart(2, '0') : '');
}
function toolBtnStyle(active, color, colorSoft) {
  return active
    ? `display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;border:2px solid ${color};background:${colorSoft};font-weight:700;font-size:14px;cursor:pointer;min-height:44px;box-sizing:border-box`
    : `display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;border:2px solid transparent;background:#fff;color:rgba(40,30,20,.6);font-weight:700;font-size:14px;cursor:pointer;min-height:44px;box-sizing:border-box;box-shadow:0 1px 3px rgba(60,40,20,.08)`;
}

const SUBSTANCES_TOXIQUE = [
  { key: 'goudrons', label: 'Goudrons', icon: '⚠️', type: 'malade', x: 100, side: 'above', detail: "Se déposent dans les poumons — la principale cause des cancers liés au tabac. Absents des substituts et de la vapoteuse." },
  { key: 'co', label: 'Monoxyde de carbone', icon: '⚠️', type: 'malade', x: 185, side: 'below', detail: "Réduit l’oxygénation du sang et fatigue le cœur. Disparait sans combustion." },
  { key: 'particules', label: 'Particules fines', icon: '⚠️', type: 'malade', x: 270, side: 'above', detail: "Irritent les voies respiratoires et pénètrent profondément dans les poumons." },
  { key: 'nicotine', label: 'Nicotine', icon: '🧠', type: 'dependance', x: 355, side: 'below', detail: "Agit en quelques secondes sur le cerveau, entretient l’envie. Pas anodine — mais absente des maladies liées au tabac. Les substituts la délivrent sans combustion." }
];
function viewBtnStyle(active, color, colorSoft) {
  return active
    ? `background:${color};color:#fff;font-weight:800;font-size:13px;border-radius:999px;padding:9px 18px;cursor:pointer;min-height:44px;box-sizing:border-box;display:flex;align-items:center`
    : `background:#fff;color:rgba(40,30,20,.55);font-weight:800;font-size:13px;border-radius:999px;padding:9px 18px;cursor:pointer;min-height:44px;box-sizing:border-box;box-shadow:0 1px 3px rgba(60,40,20,.08);display:flex;align-items:center`;
}

const FORMES = [
  { key: 'patch', label: 'Patch', hasContent: true,
    bonnes: ['Coller sur peau propre, sèche, sans poils.', "Changer de zone chaque jour, poser le matin à heure régulière."],
    erreurs: ['Recoller sur la même zone.', 'Le garder sur une peau irritée ou l\u2019oublier plusieurs jours.'] },
  { key: 'gomme', label: 'Gomme', hasContent: true,
    bonnes: ['Mâcher lentement jusqu\u2019à sentir un picotement, puis laisser au repos contre la joue.', 'Répéter ce cycle pendant 20 à 30 minutes.'],
    erreurs: ['Mâcher en continu comme un chewing-gum classique.', 'Boire un café ou un soda juste avant : réduit l\u2019absorption.'] },
  { key: 'pastille', label: 'Pastille', hasContent: true,
    bonnes: ['Laisser fondre lentement en bouche, sans croquer.', 'Déplacer d\u2019un côté à l\u2019autre de la bouche.'],
    erreurs: ['La croquer ou l\u2019avaler rapidement.', 'Enchaîner les pastilles sans respecter le délai conseillé.'] },
  { key: 'comprime', label: 'Comprimé sublingual', hasContent: true,
    bonnes: ['Placer sous la langue, laisser se dissoudre sans avaler.', 'Éviter de manger ou boire pendant l\u2019absorption.'],
    erreurs: ['Le croquer ou l\u2019avaler comme un comprimé classique.'] },
  { key: 'spray', label: 'Spray buccal', hasContent: true,
    bonnes: ['Pulvériser directement dans la bouche, éviter d\u2019inhaler.', 'Utiliser dès les premiers signes d\u2019envie.'],
    erreurs: ['Pulvériser vers la gorge ou inhaler la vapeur.'] },
  { key: 'inhaleur', label: 'Inhaleur', hasContent: false, bonnes: [], erreurs: [] },
  { key: 'vapoteuse', label: 'Vapoteuse', hasContent: false, bonnes: [], erreurs: [] }
];

const QUARTER_CELL_ORDER = [[0,0],[1,0],[0,1],[1,1]];

function buildPatchSquares(quarters) {
  const totalSquares = Math.max(1, Math.ceil(quarters / 4));
  const squares = [];
  for (let s = 0; s < totalSquares; s++) {
    const cells = [];
    for (let i = 0; i < 4; i++) {
      const idx = s * 4 + i;
      const filled = idx < quarters;
      cells.push({ key: s + '-' + i, fill: filled ? 'oklch(58% 0.09 145)' : '#ffffff' });
    }
    squares.push({ key: 's' + s, cells });
  }
  return squares;
}

const TENSION_LEVEL_HIGH = 90, TENSION_LEVEL_TROUGH = 15, TENSION_NONSMOKER_LEVEL = 4;
const TENSION_Y_HIGH = 40, TENSION_Y_LOW_REF = 170;
const TENSION_TAU = 2.2;
const TENSION_VIRTUAL_START = -2.5;

function tensionToY(level) {
  return TENSION_Y_LOW_REF + (level - TENSION_LEVEL_TROUGH) / (TENSION_LEVEL_HIGH - TENSION_LEVEL_TROUGH) * (TENSION_Y_HIGH - TENSION_Y_LOW_REF);
}
function tensionLevelAt(t, times) {
  let lastT = TENSION_VIRTUAL_START;
  for (const et of times) { if (et <= t && et > lastT) lastT = et; }
  const dt = t - lastT;
  return TENSION_LEVEL_HIGH - (TENSION_LEVEL_HIGH - TENSION_LEVEL_TROUGH) * Math.exp(-dt / TENSION_TAU);
}
function buildTensionCurvePath(times) {
  const sorted = [...times].sort((a, b) => a - b);
  const steps = 200;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TIME_MAX;
    const level = tensionLevelAt(t, sorted);
    const x = timeToX(t);
    const y = tensionToY(level);
    d += (i === 0 ? 'M' : ' L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return d;
}

const CRAVING_DURATION = 180;
const CRAVING_D_INFO = {
  differer: { title: 'Différer', body: "Attendez encore un peu — l'envie ne fait que monter avant de redescendre.", color: 'oklch(65% 0.13 80)', colorSoft: 'oklch(65% 0.13 80 / .14)' },
  detourner: { title: "Détourner l'attention", body: 'Occupez vos mains ou votre tête quelques minutes : marchez un peu, appelez quelqu\u2019un.', color: 'oklch(48% 0.08 230)', colorSoft: 'oklch(48% 0.08 230 / .14)' },
  detendre: { title: 'Se détendre — respirez', body: 'Suivez le cercle : inspirez en le regardant grandir, expirez quand il se resserre.', color: 'oklch(58% 0.09 145)', colorSoft: 'oklch(58% 0.09 145 / .14)' },
  eau: { title: "D'eau", body: 'Buvez un verre d\u2019eau, lentement, en petites gorgées.', color: 'oklch(55% 0.10 200)', colorSoft: 'oklch(55% 0.10 200 / .14)' }
};
const CRAVING_WAVE_SEGMENTS = [
  { p0: { x: 10, y: 110 }, c1: { x: 90, y: 110 }, c2: { x: 120, y: 20 }, p1: { x: 190, y: 20 } },
  { p0: { x: 190, y: 20 }, c1: { x: 280, y: 20 }, c2: { x: 300, y: 95 }, p1: { x: 400, y: 100 } },
  { p0: { x: 400, y: 100 }, c1: { x: 470, y: 103 }, c2: { x: 500, y: 108 }, p1: { x: 570, y: 110 } }
];
function cravingCubicPoint(seg, t) {
  const mt = 1 - t;
  const x = mt * mt * mt * seg.p0.x + 3 * mt * mt * t * seg.c1.x + 3 * mt * t * t * seg.c2.x + t * t * t * seg.p1.x;
  const y = mt * mt * mt * seg.p0.y + 3 * mt * mt * t * seg.c1.y + 3 * mt * t * t * seg.c2.y + t * t * t * seg.p1.y;
  return { x, y };
}
function cravingWavePoint(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const scaled = p * CRAVING_WAVE_SEGMENTS.length;
  let idx = Math.floor(scaled);
  if (idx >= CRAVING_WAVE_SEGMENTS.length) idx = CRAVING_WAVE_SEGMENTS.length - 1;
  const localT = Math.min(1, scaled - idx);
  return cravingCubicPoint(CRAVING_WAVE_SEGMENTS[idx], localT);
}
function cravingWavePathUpTo(progress) {
  const steps = 40;
  let d = '';
  const count = Math.max(1, Math.round(steps * Math.max(0.02, progress)));
  for (let i = 0; i <= count; i++) {
    const p = (i / count) * progress;
    const pt = cravingWavePoint(p);
    d += (i === 0 ? 'M' : ' L') + pt.x.toFixed(1) + ',' + pt.y.toFixed(1);
  }
  return d;
}
function formatClock(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ':' + String(s).padStart(2, '0');
}

const MOTIVATION_COLORS = ['oklch(55% 0.15 30)', 'oklch(58% 0.09 145)', 'oklch(62% 0.13 80)', 'oklch(48% 0.08 230)'];
const MOTIVATION_SEED = [
  { label: 'Ma santé' },
  { label: 'Mes proches' },
  { label: 'Le budget' },
  { label: 'Le goût / l\u2019odorat' },
  { label: 'Mon souffle / ma forme' },
  { label: 'Ma liberté' }
];

class Component extends DCLogic {
  state = {
    screen: 'home',
    selected: null,
    tab: 'quoi',
    sourcesOpen: false,
    tool: 'cigarette',
    events: [],
    nextId: 1,
    motivationTab: 'etat',
    motivationStep: 0,
    importance: 5,
    confidence: 5,
    importanceTouched: false,
    confidenceTouched: false,
    raisonsBoard: [],
    raisonsReserve: MOTIVATION_SEED.map((s, i) => ({ id: i + 1, label: s.label })),
    nextRaisonId: 7,
    editingCardId: null,
    selectedForme: 'patch',
    doseQuarters: 3,
    previousDoseQuarters: 3,
    symptom: null,
    cravingPhase: 'idle',
    cravingTime: CRAVING_DURATION,
    cravingDs: [],
    toxiqueView: null,
    openHotspot: null,
    soulagementEvents: [],
    soulagementNextId: 1,
    showNonSmoker: false
  };
  svgRef = React.createRef();
  soulagementSvgRef = React.createRef();
  importanceRef = React.createRef();
  confidenceRef = React.createRef();
  boardRef = React.createRef();

  goToNicotine = () => this.setState({ screen: 'nicotine', sourcesOpen: false });
  goToNicotineKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToNicotine(); } };

  goToToxique = () => this.setState({ screen: 'toxique', sourcesOpen: false, toxiqueView: null, openHotspot: null });
  goToToxiqueKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToToxique(); } };
  setViewMalade = () => this.setState(s => ({ toxiqueView: s.toxiqueView === 'malade' ? null : 'malade', openHotspot: null }));
  setViewDependance = () => this.setState(s => ({ toxiqueView: s.toxiqueView === 'dependance' ? null : 'dependance', openHotspot: null }));
  toggleHotspot = (key) => this.setState(s => ({ openHotspot: s.openHotspot === key ? null : key }));

  goToSoulagement = () => this.setState({ screen: 'soulagement', sourcesOpen: false });
  goToSoulagementKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToSoulagement(); } };
  toggleNonSmoker = () => this.setState(s => ({ showNonSmoker: !s.showNonSmoker }));
  addSoulagementEventAtClick = (e) => {
    const svgEl = this.soulagementSvgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = 640 / rect.width;
    const vx = (e.clientX - rect.left) * scaleX;
    let t = ((vx - GX0) / (GX1 - GX0)) * TIME_MAX;
    t = Math.max(0, Math.min(TIME_MAX, t));
    t = Math.round(t * 4) / 4;
    const id = this.state.soulagementNextId;
    this.setState(s => ({ soulagementEvents: [...s.soulagementEvents, { id, time: t }], soulagementNextId: id + 1 }));
  };
  removeSoulagementEvent = (id) => this.setState(s => ({ soulagementEvents: s.soulagementEvents.filter(ev => ev.id !== id) }));
  clearSoulagementEvents = () => this.setState({ soulagementEvents: [], showNonSmoker: false });

  goToMotivation = () => this.setState({ screen: 'motivation', sourcesOpen: false });
  goToMotivationKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToMotivation(); } };

  goToSubstituts = () => this.setState({ screen: 'substituts', sourcesOpen: false });
  goToSubstitutsKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToSubstituts(); } };
  selectForme = (key) => this.setState({ selectedForme: key });

  toggleEnvie = () => this.setState(s => ({ symptom: s.symptom === 'envie' ? null : 'envie' }));
  toggleSurdosage = () => this.setState(s => ({ symptom: s.symptom === 'surdosage' ? null : 'surdosage' }));
  applyPlusQuarter = () => this.setState(s => ({ previousDoseQuarters: s.doseQuarters, doseQuarters: Math.min(8, s.doseQuarters + 1), symptom: null }));
  applyMinusQuarter = () => this.setState(s => ({ previousDoseQuarters: s.doseQuarters, doseQuarters: Math.max(1, s.doseQuarters - 1), symptom: null }));
  revertToPrevious = () => this.setState(s => ({ doseQuarters: s.previousDoseQuarters, symptom: null }));

  setTabEtat = () => this.setState({ motivationTab: 'etat' });
  setTabRaisons = () => this.setState({ motivationTab: 'raisons' });

  goToStepConfidence = () => this.setState({ motivationStep: 1 });
  goToStepDone = () => this.setState({ motivationStep: 2 });
  restartMotivationSteps = () => this.setState({ motivationStep: 0, importanceTouched: false, confidenceTouched: false });

  updateGaugeFromEvent = (key, touchedKey, ref, e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    let angle = Math.atan2(dx, -dy) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    let value = Math.round((angle / 360) * 10);
    value = Math.max(0, Math.min(10, value));
    this.setState({ [key]: value, [touchedKey]: true });
  };

  startGaugeDrag = (key, touchedKey, ref) => (e) => {
    this.updateGaugeFromEvent(key, touchedKey, ref, e);
    const move = (ev) => this.updateGaugeFromEvent(key, touchedKey, ref, ev);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  importanceDrag = this.startGaugeDrag('importance', 'importanceTouched', this.importanceRef);
  confidenceDrag = this.startGaugeDrag('confidence', 'confidenceTouched', this.confidenceRef);

  addToBoard = (reserveId) => {
    const item = this.state.raisonsReserve.find(r => r.id === reserveId);
    if (!item) return;
    const idx = this.state.raisonsBoard.length;
    const col = idx % 3, row = Math.floor(idx / 3);
    const x = 18 + col * 32, y = 20 + row * 30;
    const id = this.state.nextRaisonId;
    this.setState(s => ({
      raisonsBoard: [...s.raisonsBoard, { id, label: item.label, detail: '', color: MOTIVATION_COLORS[id % MOTIVATION_COLORS.length], x, y }],
      raisonsReserve: s.raisonsReserve.filter(r => r.id !== reserveId),
      nextRaisonId: id + 1
    }));
  };

  addFreeCard = () => {
    const idx = this.state.raisonsBoard.length;
    const col = idx % 3, row = Math.floor(idx / 3);
    const x = 18 + col * 32, y = 20 + row * 30;
    const id = this.state.nextRaisonId;
    this.setState(s => ({
      raisonsBoard: [...s.raisonsBoard, { id, label: 'Nouvelle raison', detail: '', color: MOTIVATION_COLORS[id % MOTIVATION_COLORS.length], x, y }],
      nextRaisonId: id + 1,
      editingCardId: id
    }));
  };

  cardPointerDown = (id) => (e) => {
    const board = this.boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    let moved = false;
    const move = (ev) => {
      if (Math.abs(ev.clientX - startX) > 4 || Math.abs(ev.clientY - startY) > 4) moved = true;
      let x = ((ev.clientX - rect.left) / rect.width) * 100;
      let y = ((ev.clientY - rect.top) / rect.height) * 100;
      x = Math.max(4, Math.min(92, x));
      y = Math.max(6, Math.min(86, y));
      this.setState(s => ({ raisonsBoard: s.raisonsBoard.map(c => c.id === id ? { ...c, x, y } : c) }));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (!moved) this.setState(s => ({ editingCardId: s.editingCardId === id ? null : id }));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  updateCardField = (id, field, value) => this.setState(s => ({ raisonsBoard: s.raisonsBoard.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  deleteCard = (id) => this.setState(s => ({ raisonsBoard: s.raisonsBoard.filter(c => c.id !== id), editingCardId: s.editingCardId === id ? null : s.editingCardId }));
  closeCardEdit = () => this.setState({ editingCardId: null });

  setToolCigarette = () => this.setState({ tool: 'cigarette' });
  setToolPatch = () => this.setState({ tool: 'patch' });
  setToolSubstitut = () => this.setState({ tool: 'substitut' });

  addEventAtClick = (e) => {
    const svgEl = this.svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = 640 / rect.width;
    const vx = (e.clientX - rect.left) * scaleX;
    let t = ((vx - GX0) / (GX1 - GX0)) * TIME_MAX;
    t = Math.max(0, Math.min(TIME_MAX, t));
    t = Math.round(t * 4) / 4;
    const id = this.state.nextId;
    this.setState(s => ({ events: [...s.events, { id, time: t, type: s.tool, dose: 1 }], nextId: id + 1 }));
  };

  removeEvent = (id) => this.setState(s => ({ events: s.events.filter(ev => ev.id !== id) }));
  clearEvents = () => this.setState({ events: [] });
  adjustDose = (id, delta) => this.setState(s => ({
    events: s.events.map(ev => ev.id === id ? { ...ev, dose: Math.max(0.25, Math.min(4, Math.round((ev.dose + delta) * 4) / 4)) } : ev)
  }));

  goToCraving = () => this.setState({ screen: 'craving', sourcesOpen: false, cravingPhase: 'idle', cravingTime: CRAVING_DURATION, cravingDs: [] });
  goToCravingKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToCraving(); } };

  startCravingTimer = () => {
    if (this.cravingInterval) clearInterval(this.cravingInterval);
    this.setState({ cravingPhase: 'active', cravingTime: CRAVING_DURATION, cravingDs: [] });
    this.cravingInterval = setInterval(() => {
      this.setState(s => {
        const t = s.cravingTime - 1;
        if (t <= 0) {
          clearInterval(this.cravingInterval);
          this.cravingInterval = null;
          return { cravingTime: 0, cravingPhase: 'done' };
        }
        return { cravingTime: t };
      });
    }, 1000);
  };

  resetCraving = () => {
    if (this.cravingInterval) { clearInterval(this.cravingInterval); this.cravingInterval = null; }
    this.setState({ cravingPhase: 'idle', cravingTime: CRAVING_DURATION, cravingDs: [] });
  };

  toggleCravingD = (id) => this.setState(s => ({
    cravingDs: s.cravingDs.includes(id) ? s.cravingDs.filter(x => x !== id) : [...s.cravingDs, id]
  }));
  toggleDifferer = () => this.toggleCravingD('differer');
  toggleDetourner = () => this.toggleCravingD('detourner');
  toggleDetendre = () => this.toggleCravingD('detendre');
  toggleEau = () => this.toggleCravingD('eau');

  componentWillUnmount() {
    if (this.cravingInterval) clearInterval(this.cravingInterval);
  }

  goToAddiction = () => this.setState({ screen: 'addiction', selected: null, tab: 'quoi', sourcesOpen: false });
  goToAddictionKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToAddiction(); } };
  goHome = () => this.setState({ screen: 'home' });
  goHomeKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goHome(); } };
  toggleSources = () => this.setState(s => ({ sourcesOpen: !s.sourcesOpen }));
  toggleSourcesKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggleSources(); } };

  select = (key) => this.setState(s => ({ selected: s.selected === key ? null : key }));
  selectPhysique = () => this.select('physique');
  selectPsychologique = () => this.select('psychologique');
  selectComportementale = () => this.select('comportementale');

  renderVals() {
    const { screen, selected, sourcesOpen, tool, events, motivationTab, motivationStep, importance, confidence, importanceTouched, confidenceTouched, raisonsBoard, raisonsReserve, editingCardId, selectedForme, doseQuarters, symptom, cravingPhase, cravingTime, cravingDs, toxiqueView, openHotspot, soulagementEvents, showNonSmoker } = this.state;
    const circumference = 301.6;

    function formeCardStyle(active, hasContent) {
      const base = 'border-radius:12px;padding:12px 6px;text-align:center;cursor:pointer;min-height:44px;box-sizing:border-box;';
      if (active) return base + 'background:oklch(58% 0.09 145 / .16);border:2px solid oklch(58% 0.09 145);';
      return base + 'background:#fff;border:2px solid transparent;box-shadow:0 1px 3px rgba(60,40,20,.08);' + (hasContent ? '' : 'opacity:.55;');
    }
    const selectedFormeObj = FORMES.find(f => f.key === selectedForme) || FORMES[0];
    const formesForRender = FORMES.map(f => ({
      key: f.key,
      label: f.label,
      dotColor: selectedForme === f.key ? 'oklch(58% 0.09 145)' : 'rgba(40,30,20,.14)',
      style: formeCardStyle(selectedForme === f.key, f.hasContent),
      select: () => this.selectForme(f.key)
    }));
    const patchSquares = buildPatchSquares(doseQuarters);
    function symptomBtnStyle(active, color, colorSoft) {
      return active
        ? `display:inline-flex;align-items:center;padding:11px 20px;border-radius:10px;border:2px solid ${color};background:${colorSoft};font-weight:700;font-size:14px;cursor:pointer;min-height:44px;box-sizing:border-box;color:${color}`
        : 'display:inline-flex;align-items:center;padding:11px 20px;border-radius:10px;border:2px solid transparent;background:#fff;color:rgba(40,30,20,.6);font-weight:700;font-size:14px;cursor:pointer;min-height:44px;box-sizing:border-box;box-shadow:0 1px 3px rgba(60,40,20,.08)';
    }

    const enrichedBoard = raisonsBoard.map(card => ({
      id: card.id,
      label: card.label,
      detail: card.detail,
      color: card.color,
      xPct: card.x.toFixed(1) + '%',
      yPct: card.y.toFixed(1) + '%',
      isEditing: editingCardId === card.id,
      isNotEditing: editingCardId !== card.id,
      hasDetail: !!card.detail,
      onPointerDown: this.cardPointerDown(card.id),
      onLabelChange: (e) => this.updateCardField(card.id, 'label', e.target.value),
      onDetailChange: (e) => this.updateCardField(card.id, 'detail', e.target.value),
      onDelete: () => this.deleteCard(card.id),
      onCloseEdit: this.closeCardEdit
    }));
    const enrichedReserve = raisonsReserve.map(r => ({ id: r.id, label: r.label, add: () => this.addToBoard(r.id) }));

    function pillStyle(active, color) {
      return active
        ? `background:${color};color:#fff;font-weight:800;font-size:13px;border-radius:999px;padding:9px 20px;cursor:pointer;min-height:44px;box-sizing:border-box;display:flex;align-items:center`
        : `background:#fff;color:rgba(40,30,20,.5);font-weight:800;font-size:13px;border-radius:999px;padding:9px 20px;cursor:pointer;min-height:44px;box-sizing:border-box;display:flex;align-items:center;box-shadow:0 1px 3px rgba(60,40,20,.08)`;
    }
    const d = selected ? PILLARS[selected] : null;

    const curvePath = buildCurvePath(events);
    const enrichedEvents = events.map(ev => {
      const info = TYPE_INFO[ev.type];
      const isPatch = ev.type === 'patch';
      const x = timeToX(ev.time);

      let cells = [];
      let xMinus = (x - 20).toFixed(1);
      let xPlus = (x + 20).toFixed(1);
      if (isPatch) {
        const quarterUnits = Math.round(ev.dose * 4);
        const totalSquares = Math.ceil(quarterUnits / 4);
        const cellSize = 9, cellGap = 1, squareGap = 4;
        const squareSize = 2 * cellSize + cellGap;
        const totalW = totalSquares * squareSize + (totalSquares - 1) * squareGap;
        const startX = x - totalW / 2;
        const baseY = 226;
        for (let s = 0; s < totalSquares; s++) {
          for (let p = 0; p < 4; p++) {
            const idx = s * 4 + p;
            const filled = idx < quarterUnits;
            const row = Math.floor(p / 2), col = p % 2;
            const cx = startX + s * (squareSize + squareGap) + col * (cellSize + cellGap);
            const cy = baseY + row * (cellSize + cellGap);
            cells.push({ key: ev.id + '-' + idx, x: cx.toFixed(1), y: cy.toFixed(1), w: cellSize, h: cellSize, fill: filled ? info.color : '#ffffff', stroke: info.color, sw: filled ? 0 : 1.3 });
          }
        }
        xMinus = (x - totalW / 2 - 16).toFixed(1);
        xPlus = (x + totalW / 2 + 16).toFixed(1);
      }

      return {
        id: ev.id,
        x: x.toFixed(1),
        xMinus,
        xPlus,
        label: info.label,
        color: info.color,
        isPatch,
        isCigOrSub: !isPatch,
        isCigarette: ev.type === 'cigarette',
        isSubstitut: ev.type === 'substitut',
        cells,
        doseLabel: isPatch ? formatDose(ev.dose) : '',
        remove: (e) => { e.stopPropagation(); this.removeEvent(ev.id); },
        incDose: (e) => { e.stopPropagation(); this.adjustDose(ev.id, 0.25); },
        decDose: (e) => { e.stopPropagation(); this.adjustDose(ev.id, -0.25); }
      };
    });

    function fillOp(key) { return selected === key ? '0.32' : selected ? '0.14' : '0.24'; }
    function strokeW(key) { return selected === key ? '6' : '2.5'; }

    const cravingProgress = 1 - cravingTime / CRAVING_DURATION;
    const cravingWavePoint2 = cravingWavePoint(cravingProgress);
    const cravingRenderOrder = [...cravingDs.filter(id => id !== 'detendre'), ...(cravingDs.includes('detendre') ? ['detendre'] : [])];
    const cravingCards = cravingRenderOrder.map((id, i) => {
      const info = CRAVING_D_INFO[id];
      const isTop = i === cravingRenderOrder.length - 1;
      const depth = cravingRenderOrder.length - 1 - i;
      const scale = isTop ? 1 : Math.max(0.9, 0.98 - depth * 0.04);
      const topOffset = 4 + i * 26;
      const wrapStyle = isTop
        ? `position:absolute;left:50%;transform:translateX(-50%);top:${topOffset}px;width:260px;background:${info.color};color:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 10px 24px rgba(58,51,44,.28);text-align:center;z-index:${i + 1}`
        : `position:absolute;left:50%;transform:translateX(-50%) scale(${scale});top:${topOffset}px;width:230px;background:${info.color.replace(/\)$/, ' / .8)')};color:#fff;border-radius:12px;padding:10px 18px;text-align:center;z-index:${i + 1}`;
      return {
        id,
        title: info.title,
        body: isTop ? info.body : '',
        isDetendre: id === 'detendre' && isTop,
        wrapStyle
      };
    });

    const cravingStageStyle = 'position:relative;height:530px';

    function cravingChipStyle(active, color, colorSoft) {
      return active
        ? `display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;border:2px solid ${color};background:${colorSoft};font-weight:800;font-size:13px;color:${color};cursor:pointer;min-height:44px;box-sizing:border-box`
        : `display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;border:2px solid transparent;background:#fff;color:rgba(40,30,20,.6);font-weight:700;font-size:13px;cursor:pointer;min-height:44px;box-sizing:border-box;box-shadow:0 1px 3px rgba(60,40,20,.08)`;
    }

    return {
      isHome: screen === 'home',
      isAddiction: screen === 'addiction',
      goToAddiction: this.goToAddiction,
      goToAddictionKey: this.goToAddictionKey,
      goHome: this.goHome,
      goHomeKey: this.goHomeKey,
      sourcesOpen,
      toggleSources: this.toggleSources,
      toggleSourcesKey: this.toggleSourcesKey,

      physiqueFillOpacity: fillOp('physique'),
      psychologiqueFillOpacity: fillOp('psychologique'),
      comportementaleFillOpacity: fillOp('comportementale'),
      physiqueStroke: strokeW('physique'),
      psychologiqueStroke: strokeW('psychologique'),
      comportementaleStroke: strokeW('comportementale'),

      selectPhysique: this.selectPhysique,
      selectPsychologique: this.selectPsychologique,
      selectComportementale: this.selectComportementale,

      hasSelection: !!d,
      noSelection: !d,
      selectedLabel: d ? d.label : '',
      selectedColor: d ? d.color : '',
      selectedColorSoft: d ? d.colorSoft : '',
      selectedOutils: d ? d.outils : [],

      isPhysiqueSel: selected === 'physique',
      isPsychologiqueSel: selected === 'psychologique',
      isComportementaleSel: selected === 'comportementale',
      physiqueExemples: PILLARS.physique.exemples,
      psychologiqueExemples: PILLARS.psychologique.exemples,
      comportementaleExemples: PILLARS.comportementale.exemples,
      physiqueColor: PILLARS.physique.color,
      psychologiqueColor: PILLARS.psychologique.color,
      comportementaleColor: PILLARS.comportementale.color,
      physiqueColorSoft: PILLARS.physique.colorSoft,
      psychologiqueColorSoft: PILLARS.psychologique.colorSoft,
      comportementaleColorSoft: PILLARS.comportementale.colorSoft,

      showPhysiqueLabel: selected !== 'physique',
      showPsychologiqueLabel: selected !== 'psychologique',
      showComportementaleLabel: selected !== 'comportementale',

      isNicotine: screen === 'nicotine',
      goToNicotine: this.goToNicotine,
      goToNicotineKey: this.goToNicotineKey,
      svgRef: this.svgRef,
      addEventAtClick: this.addEventAtClick,
      clearEvents: this.clearEvents,
      setToolCigarette: this.setToolCigarette,
      setToolPatch: this.setToolPatch,
      setToolSubstitut: this.setToolSubstitut,
      hasEvents: events.length > 0,
      curvePath,
      events: enrichedEvents,
      cigColor: TYPE_INFO.cigarette.color,
      patchColor: TYPE_INFO.patch.color,
      substitutColor: TYPE_INFO.substitut.color,
      cigButtonStyle: toolBtnStyle(tool === 'cigarette', TYPE_INFO.cigarette.color, TYPE_INFO.cigarette.colorSoft),
      patchButtonStyle: toolBtnStyle(tool === 'patch', TYPE_INFO.patch.color, TYPE_INFO.patch.colorSoft),
      substitutButtonStyle: toolBtnStyle(tool === 'substitut', TYPE_INFO.substitut.color, TYPE_INFO.substitut.colorSoft),

      isSoulagement: screen === 'soulagement',
      goToSoulagement: this.goToSoulagement,
      goToSoulagementKey: this.goToSoulagementKey,
      soulagementSvgRef: this.soulagementSvgRef,
      addSoulagementEventAtClick: this.addSoulagementEventAtClick,
      clearSoulagementEvents: this.clearSoulagementEvents,
      hasSoulagementEvents: soulagementEvents.length > 0,
      soulagementCurvePath: buildTensionCurvePath(soulagementEvents.map(ev => ev.time)),
      soulagementEvents: soulagementEvents.map(ev => ({
        id: ev.id,
        x: timeToX(ev.time).toFixed(1),
        remove: (e) => { e.stopPropagation(); this.removeSoulagementEvent(ev.id); }
      })),
      showNonSmoker,
      toggleNonSmoker: this.toggleNonSmoker,
      nonSmokerY: tensionToY(TENSION_NONSMOKER_LEVEL).toFixed(1),
      nonSmokerLabelY: (tensionToY(TENSION_NONSMOKER_LEVEL) - 8).toFixed(1),
      nonSmokerButtonStyle: showNonSmoker
        ? "display:inline-flex;align-items:center;padding:11px 20px;border-radius:10px;border:2px solid oklch(58% 0.09 145);background:oklch(58% 0.09 145 / .16);color:oklch(38% 0.09 145);font-weight:700;font-size:14px;cursor:pointer;min-height:44px;box-sizing:border-box"
        : "display:inline-flex;align-items:center;padding:11px 20px;border-radius:10px;border:2px solid oklch(58% 0.09 145);background:#fff;color:oklch(38% 0.09 145);font-weight:700;font-size:14px;cursor:pointer;min-height:44px;box-sizing:border-box",
      nonSmokerButtonLabel: showNonSmoker ? "Comparer au niveau d'un non-fumeur ✓" : "Comparer au niveau d'un non-fumeur",

      isToxique: screen === 'toxique',
      goToToxique: this.goToToxique,
      goToToxiqueKey: this.goToToxiqueKey,
      setViewMalade: this.setViewMalade,
      setViewDependance: this.setViewDependance,
      maladeButtonStyle: viewBtnStyle(toxiqueView === 'malade', 'oklch(55% 0.15 30)', 'oklch(55% 0.15 30 / .12)'),
      dependanceButtonStyle: viewBtnStyle(toxiqueView === 'dependance', 'oklch(48% 0.08 230)', 'oklch(48% 0.08 230 / .1)'),
      hotspots: SUBSTANCES_TOXIQUE.map(sub => {
        const isMaladeType = sub.type === 'malade';
        const baseChannel = isMaladeType ? '55% 0.15 30' : '48% 0.08 230';
        const baseColor = `oklch(${baseChannel})`;
        const emphasized = toxiqueView === sub.type;
        const dimmed = toxiqueView && toxiqueView !== sub.type;
        const r = (sub.key === 'nicotine' ? 22 : 20) + (emphasized ? 4 : 0);
        const cy = sub.side === 'above' ? 55 : 205;
        const lineY1 = sub.side === 'above' ? 114 : 148;
        const lineY2 = sub.side === 'above' ? cy + r : cy - r;
        const labelY = sub.side === 'above' ? (cy - r - 12) : (cy + r + 20);
        const iconSize = (sub.key === 'nicotine' ? 17 : 15) + (emphasized ? 3 : 0);
        const labelSize = emphasized ? 13.5 : 12.5;
        const labelWeight = emphasized ? 800 : 700;
        const labelColor = dimmed ? 'rgba(40,30,20,.4)' : 'oklch(24% 0.02 50)';
        const iconOpacity = dimmed ? .35 : 1;
        const xPct = (sub.x / 600) * 100;
        const cyPct = (cy / 262) * 100;
        const labelYPct = (labelY / 262) * 100;
        return {
          key: sub.key,
          x: sub.x,
          cy,
          r,
          lineY1,
          lineY2,
          lineColor: dimmed ? `oklch(${baseChannel} / .15)` : `oklch(${baseChannel} / .4)`,
          fill: dimmed ? `oklch(${baseChannel} / .07)` : `oklch(${baseChannel} / .16)`,
          color: dimmed ? `oklch(${baseChannel} / .3)` : baseColor,
          strokeW: emphasized ? 3.5 : 2,
          icon: sub.icon,
          label: sub.label,
          iconHtmlStyle: `position:absolute;left:${xPct}%;top:${cyPct}%;transform:translate(-50%,-50%);font-size:${iconSize}px;line-height:1;opacity:${iconOpacity};cursor:pointer;user-select:none;text-align:center`,
          labelHtmlStyle: `position:absolute;left:${xPct}%;top:${labelYPct}%;transform:translate(-50%,-50%);font-family:'Work Sans',sans-serif;font-weight:${labelWeight};font-size:${labelSize}px;color:${labelColor};white-space:nowrap;cursor:pointer;user-select:none;text-align:center`,
          toggle: () => this.toggleHotspot(sub.key)
        };
      }),
      hasOpenHotspot: !!openHotspot,
      openIcon: (() => { const s = SUBSTANCES_TOXIQUE.find(x => x.key === openHotspot); return s ? s.icon : ''; })(),
      openLabel: (() => { const s = SUBSTANCES_TOXIQUE.find(x => x.key === openHotspot); return s ? s.label : ''; })(),
      openDetail: (() => { const s = SUBSTANCES_TOXIQUE.find(x => x.key === openHotspot); return s ? s.detail : ''; })(),
      popoverStyle: (() => {
        const s = SUBSTANCES_TOXIQUE.find(x => x.key === openHotspot);
        if (!s) return '';
        const color = s.type === 'malade' ? 'oklch(55% 0.15 30)' : 'oklch(48% 0.08 230)';
        const leftPct = Math.min(78, Math.max(22, (s.x / 600) * 100));
        const vertical = s.side === 'above' ? 'top:4px;' : 'bottom:4px;';
        return `position:absolute;left:${leftPct}%;transform:translateX(-50%);${vertical}width:230px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(40,30,20,.2);padding:14px 16px;border-left:4px solid ${color};z-index:4;box-sizing:border-box`;
      })(),

      isMotivation: screen === 'motivation',
      goToMotivation: this.goToMotivation,
      goToMotivationKey: this.goToMotivationKey,
      isEtatTab: motivationTab === 'etat',
      isRaisonsTab: motivationTab === 'raisons',
      setTabEtat: this.setTabEtat,
      setTabRaisons: this.setTabRaisons,
      tabEtatStyle: pillStyle(motivationTab === 'etat', 'oklch(48% 0.08 230)'),
      tabRaisonsStyle: pillStyle(motivationTab === 'raisons', 'oklch(48% 0.08 230)'),

      isStepImportance: motivationStep === 0,
      isStepConfidence: motivationStep === 1,
      isStepDone: motivationStep === 2,
      goToStepConfidence: this.goToStepConfidence,
      goToStepDone: this.goToStepDone,
      restartMotivationSteps: this.restartMotivationSteps,
      importanceTouched,
      confidenceTouched,

      importance,
      confidence,
      importanceRef: this.importanceRef,
      confidenceRef: this.confidenceRef,
      importanceDrag: this.importanceDrag,
      confidenceDrag: this.confidenceDrag,
      importanceOffset: (circumference * (1 - importance / 10)).toFixed(1),
      confidenceOffset: (circumference * (1 - confidence / 10)).toFixed(1),
      importanceMinus: Math.max(0, importance - 1),
      importancePlus: Math.min(10, importance + 1),
      importanceShowMinus: importance > 0,
      importanceShowPlus: importance < 10,
      confidenceMinus: Math.max(0, confidence - 1),
      confidencePlus: Math.min(10, confidence + 1),
      confidenceShowMinus: confidence > 0,
      confidenceShowPlus: confidence < 10,

      boardRef: this.boardRef,
      raisonsBoard: enrichedBoard,
      raisonsReserve: enrichedReserve,
      hasNoBoardCards: enrichedBoard.length === 0,
      addFreeCard: this.addFreeCard,

      isSubstituts: screen === 'substituts',
      goToSubstituts: this.goToSubstituts,
      goToSubstitutsKey: this.goToSubstitutsKey,
      formes: formesForRender,
      selectedFormeLabel: selectedFormeObj.label,
      selectedFormeHasContent: selectedFormeObj.hasContent,
      selectedFormeNoContent: !selectedFormeObj.hasContent,
      isPatchSelected: selectedForme === 'patch',
      showTechniqueIllustration: selectedForme !== 'patch' && selectedFormeObj.hasContent,
      selectedFormeBonnes: selectedFormeObj.bonnes,
      selectedFormeErreurs: selectedFormeObj.erreurs,
      patchSquares,
      toggleEnvie: this.toggleEnvie,
      toggleSurdosage: this.toggleSurdosage,
      envieButtonStyle: symptomBtnStyle(symptom === 'envie', 'oklch(58% 0.09 145)', 'oklch(58% 0.09 145 / .14)'),
      surdosageButtonStyle: symptomBtnStyle(symptom === 'surdosage', 'oklch(55% 0.15 30)', 'oklch(55% 0.15 30 / .12)'),
      showEnvieSuggestion: symptom === 'envie',
      showSurdosageSuggestion: symptom === 'surdosage',
      applyPlusQuarter: this.applyPlusQuarter,
      applyMinusQuarter: this.applyMinusQuarter,
      revertToPrevious: this.revertToPrevious,

      isCraving: screen === 'craving',
      goToCraving: this.goToCraving,
      goToCravingKey: this.goToCravingKey,
      cravingIsIdle: cravingPhase === 'idle',
      cravingIsActive: cravingPhase === 'active',
      cravingIsDone: cravingPhase === 'done',
      startCravingTimer: this.startCravingTimer,
      resetCraving: this.resetCraving,
      cravingClock: formatClock(cravingTime),
      cravingWavePath: cravingWavePathUpTo(cravingProgress),
      cravingDotX: cravingWavePoint2.x.toFixed(1),
      cravingDotY: cravingWavePoint2.y.toFixed(1),
      cravingCards,
      cravingStageStyle,
      toggleDifferer: this.toggleDifferer,
      toggleDetourner: this.toggleDetourner,
      toggleDetendre: this.toggleDetendre,
      toggleEau: this.toggleEau,
      chipDiffererLabel: (cravingDs.includes('differer') ? '✓ ' : '') + 'Différer',
      chipDetournerLabel: (cravingDs.includes('detourner') ? '✓ ' : '') + 'Détourner',
      chipDetendreLabel: (cravingDs.includes('detendre') ? '● ' : '') + 'Détendre',
      chipEauLabel: (cravingDs.includes('eau') ? '✓ ' : '') + "D'eau",
      chipDiffererStyle: cravingChipStyle(cravingDs.includes('differer'), CRAVING_D_INFO.differer.color, CRAVING_D_INFO.differer.colorSoft),
      chipDetournerStyle: cravingChipStyle(cravingDs.includes('detourner'), CRAVING_D_INFO.detourner.color, CRAVING_D_INFO.detourner.colorSoft),
      chipDetendreStyle: cravingChipStyle(cravingDs.includes('detendre'), CRAVING_D_INFO.detendre.color, CRAVING_D_INFO.detendre.colorSoft),
      chipEauStyle: cravingChipStyle(cravingDs.includes('eau'), CRAVING_D_INFO.eau.color, CRAVING_D_INFO.eau.colorSoft)
    };
  }
}

