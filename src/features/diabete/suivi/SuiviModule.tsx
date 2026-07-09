import { useReducer, useState } from 'react';
import type { ModuleProps } from '../../types';
import FicheOverlay from '../../../components/FicheOverlay';
import ModuleFooterNav from '../../../components/ModuleFooterNav';
import InfoHover from '../../../components/InfoHover';
import Silhouette from '../components/Silhouette';
import type { ZoneId } from '../components/Silhouette';
import IllustrationSlot from '../components/IllustrationSlot';
import {
  EXAM_DEFS,
  PROTECTS_INFO,
  MONTHS,
  MONTHS_FULL,
  CONSULT_INTERVAL_OPTIONS,
  CONSULT_INTERVAL_LABELS,
  angleForMonth,
  pt,
  computeConsultMonths,
  defaultConsultStatus,
  initExamConfig,
  initRevealedPrepeuple,
  initRevealedVide,
  nearestConsultMonth,
  examOccurrenceMonths,
  isLongCycle,
  longCycleYears,
  longCycleNextYear,
} from './logic';
import type { ExamId, ProtectsId, Status, ConsultConfig, ExamConfig } from './logic';
import styles from './SuiviModule.module.css';

// Le corps SVG partagé (S3, frozen) n'expose que 8 ancres nommées, calées sur les organes
// du module 5 — « vaisseaux », « bouche » et « défenses immunitaires » (module 6 uniquement)
// n'y ont pas d'équivalent anatomique direct. Repli assumé pour la porte « Ce que ça garde » :
// on montre la Silhouette pour les 4 organes qui s'y prêtent, une simple illustration d'organe
// sinon — le texte PROTECTS_INFO verbatim reste identique dans les deux cas.
const PROTECTS_TO_ZONE: Partial<Record<ProtectsId, ZoneId>> = {
  coeur: 'coeur',
  reins: 'reins',
  yeux: 'yeux',
  pied: 'pied',
};

type Temps = 'parcours' | 'fiche';

interface SuiviState {
  temps: Temps;
  consultConfig: ConsultConfig;
  consultStatus: Record<number, Status>;
  consultRevealed: boolean;
  examConfig: Record<ExamId, ExamConfig>;
  revealed: Record<ExamId, boolean>;
  doorOpen: ProtectsId | null;
}

type Action =
  | { type: 'SET_TEMPS'; temps: Temps }
  | { type: 'SET_CONSULT_INTERVAL'; interval: number; currentMonth: number }
  | { type: 'STEP_CONSULT_START'; delta: number; currentMonth: number }
  | { type: 'TOGGLE_CONSULT'; month: number }
  | { type: 'TOGGLE_CONSULT_REVEAL' }
  | { type: 'SET_EXAM_EVERY_N'; id: ExamId; everyN: number }
  | { type: 'STEP_EXAM_MONTH'; id: ExamId; delta: number }
  | { type: 'TOGGLE_EXAM_STATUS'; id: ExamId }
  | { type: 'TOGGLE_EXAM_REVEAL'; id: ExamId }
  | { type: 'OPEN_DOOR'; protects: ProtectsId }
  | { type: 'CLOSE_DOOR' }
  | { type: 'RESET_REVEAL' };

/**
 * État initial — cadran pré-peuplé au montage (D9 décision clé n°2, cf. S9.md) : rythme
 * standard posé (consultations tous les 3 mois + les 7 examens à leur fréquence par défaut),
 * l'utilisateur ajuste ensuite. Le mois courant réel (aiguille) est résolu une seule fois ici.
 */
function initSuiviState(currentMonth: number): SuiviState {
  const consultConfig: ConsultConfig = { interval: 3, startMonth: 0 };
  const consultMonths = computeConsultMonths(consultConfig);
  return {
    temps: 'parcours',
    consultConfig,
    consultStatus: defaultConsultStatus(consultMonths, currentMonth),
    consultRevealed: true,
    examConfig: initExamConfig(consultMonths, currentMonth),
    revealed: initRevealedPrepeuple(),
    doorOpen: null,
  };
}

function reducer(state: SuiviState, action: Action): SuiviState {
  switch (action.type) {
    case 'SET_TEMPS':
      return { ...state, temps: action.temps, doorOpen: null };
    case 'SET_CONSULT_INTERVAL': {
      const consultConfig = { ...state.consultConfig, interval: action.interval };
      const months = computeConsultMonths(consultConfig);
      return { ...state, consultConfig, consultStatus: defaultConsultStatus(months, action.currentMonth) };
    }
    case 'STEP_CONSULT_START': {
      const startMonth = (((state.consultConfig.startMonth + action.delta) % 12) + 12) % 12;
      const consultConfig = { ...state.consultConfig, startMonth };
      const months = computeConsultMonths(consultConfig);
      return { ...state, consultConfig, consultStatus: defaultConsultStatus(months, action.currentMonth) };
    }
    case 'TOGGLE_CONSULT': {
      const current = state.consultStatus[action.month];
      const next: Status = current === 'fait' ? 'a_programmer' : 'fait';
      return { ...state, consultStatus: { ...state.consultStatus, [action.month]: next } };
    }
    case 'TOGGLE_CONSULT_REVEAL':
      return { ...state, consultRevealed: !state.consultRevealed };
    case 'SET_EXAM_EVERY_N':
      return {
        ...state,
        examConfig: {
          ...state.examConfig,
          [action.id]: { ...state.examConfig[action.id], everyN: action.everyN },
        },
      };
    case 'STEP_EXAM_MONTH': {
      const consultMonths = computeConsultMonths(state.consultConfig);
      const cfg = state.examConfig[action.id];
      const snapped = nearestConsultMonth(cfg.startMonth, consultMonths);
      let idx = consultMonths.indexOf(snapped);
      idx = (((idx + action.delta) % consultMonths.length) + consultMonths.length) % consultMonths.length;
      return {
        ...state,
        examConfig: {
          ...state.examConfig,
          [action.id]: { ...cfg, startMonth: consultMonths[idx] },
        },
      };
    }
    case 'TOGGLE_EXAM_STATUS': {
      const cfg = state.examConfig[action.id];
      const next: Status = cfg.status === 'fait' ? 'a_programmer' : 'fait';
      return { ...state, examConfig: { ...state.examConfig, [action.id]: { ...cfg, status: next } } };
    }
    case 'TOGGLE_EXAM_REVEAL':
      return { ...state, revealed: { ...state.revealed, [action.id]: !state.revealed[action.id] } };
    case 'OPEN_DOOR':
      return { ...state, doorOpen: action.protects };
    case 'CLOSE_DOOR':
      return { ...state, doorOpen: null };
    case 'RESET_REVEAL':
      return { ...state, consultRevealed: true, revealed: initRevealedVide() };
    default:
      return state;
  }
}

const CX = 350;
const CY = 350;
const R_STATIONS_CONSULT = 150;
const R_STATIONS_BIO = 235;
const R_STATIONS_EXAM = 300;
const R_DOTS = 300;
const R_LABELS = 335;
const R_NEEDLE = 285;

function pct(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

function statusLabelFor(status: Status): string {
  if (status === 'fait') return 'Fait';
  if (status === 'a_programmer') return 'À programmer';
  return 'À venir';
}

export default function SuiviModule({ onNavigate }: ModuleProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayFrac = (now.getDate() - 1) / daysInCurrentMonth;

  const [state, dispatch] = useReducer(reducer, currentMonth, initSuiviState);
  const [ficheOpen, setFicheOpen] = useState(false);

  const consultMonths = computeConsultMonths(state.consultConfig);
  const annualN = Math.round(12 / state.consultConfig.interval);
  const monthPos = currentMonth + dayFrac;
  const needle = pt(CX, CY, R_NEEDLE, angleForMonth(monthPos));

  // ── Cadran : points de mois "libres" (sans consultation) + labels des mois de consultation ──
  const monthDots = Array.from({ length: 12 }, (_, m) => m).filter((m) => !consultMonths.includes(m));
  const monthLabels = consultMonths.map((m) => ({ m, ...pt(CX, CY, R_LABELS, angleForMonth(m)) }));

  // ── Icônes de consultation (stéthoscope) ──────────────────────────────────────────────────
  const consultIcons = state.consultRevealed
    ? consultMonths.map((m) => {
        const st = state.consultStatus[m];
        const p = pt(CX, CY, R_STATIONS_CONSULT, angleForMonth(m));
        return { month: m, x: p.x, y: p.y, status: st };
      })
    : [];

  // ── Icônes bio (prise de sang) : regroupées par mois, tous statuts bio confondus ──────────
  const bioByMonth = new Map<number, { def: (typeof EXAM_DEFS)[number]; cfg: ExamConfig }[]>();
  const nonBioByMonth = new Map<number, { def: (typeof EXAM_DEFS)[number]; cfg: ExamConfig }[]>();
  EXAM_DEFS.forEach((def) => {
    if (!state.revealed[def.id]) return;
    const cfg = state.examConfig[def.id];
    const months = examOccurrenceMonths(cfg, consultMonths);
    months.forEach((m) => {
      const target = def.bio ? bioByMonth : nonBioByMonth;
      const list = target.get(m) ?? [];
      list.push({ def, cfg });
      target.set(m, list);
    });
  });

  const bioIcons = Array.from(bioByMonth.entries()).map(([m, group]) => {
    const p = pt(CX, CY, R_STATIONS_BIO, angleForMonth(m));
    const allFait = group.every((g) => g.cfg.status === 'fait');
    const anyProgrammer = group.some((g) => g.cfg.status === 'a_programmer');
    const status: Status = allFait ? 'fait' : anyProgrammer ? 'a_programmer' : 'a_venir';
    return {
      month: m,
      x: p.x,
      y: p.y,
      status,
      label: group.map((g) => g.def.name).join(' + ') + ' — ' + MONTHS[m],
      ids: group.map((g) => g.def.id),
    };
  });

  const examIcons: {
    id: ExamId;
    month: number;
    x: number;
    y: number;
    status: Status;
    longCycle: boolean;
    protects: ProtectsId;
    name: string;
  }[] = [];
  Array.from(nonBioByMonth.entries()).forEach(([m, group]) => {
    group.forEach((entry, i) => {
      const spread = (i - (group.length - 1) / 2) * 0.32;
      const p = pt(CX, CY, R_STATIONS_EXAM, angleForMonth(m) + spread);
      examIcons.push({
        id: entry.def.id,
        month: m,
        x: p.x,
        y: p.y,
        status: entry.cfg.status,
        longCycle: isLongCycle(entry.cfg, consultMonths),
        protects: entry.def.protects,
        name: entry.def.name,
      });
    });
  });

  // ── Panneau de réglage — consultations ────────────────────────────────────────────────────
  function setConsultInterval(interval: number) {
    dispatch({ type: 'SET_CONSULT_INTERVAL', interval, currentMonth });
  }
  function stepConsultStart(delta: number) {
    dispatch({ type: 'STEP_CONSULT_START', delta, currentMonth });
  }

  // ── Panneau de réglage — examens ──────────────────────────────────────────────────────────
  const examRows = EXAM_DEFS.map((def) => {
    const cfg = state.examConfig[def.id];
    const revealed = state.revealed[def.id];
    const snapped = nearestConsultMonth(cfg.startMonth, consultMonths);
    const longCycle = isLongCycle(cfg, consultMonths);
    const cycles = longCycleYears(cfg, state.consultConfig.interval);
    const info = PROTECTS_INFO[def.protects];
    const freqOptions = [
      { n: 1, label: 'Chaque consult.' },
      { n: annualN, label: '1×/an' },
      { n: annualN * 2, label: '1×/2 ans' },
      { n: annualN * 5, label: '1×/5 ans' },
    ];
    return { def, cfg, revealed, snapped, longCycle, cycles, info, freqOptions };
  });

  // ── Fiche — check-list triée par mois ─────────────────────────────────────────────────────
  interface FicheRow {
    month: number;
    name: string;
    status: Status | 'grise';
    nextYear?: number;
    cycles?: number;
  }
  const ficheSrc: FicheRow[] = consultMonths.map((m) => ({
    month: m,
    name: 'Consultation — ' + MONTHS_FULL[m],
    status: state.consultStatus[m],
  }));
  EXAM_DEFS.forEach((def) => {
    const cfg = state.examConfig[def.id];
    if (isLongCycle(cfg, consultMonths)) {
      const snapped = nearestConsultMonth(cfg.startMonth, consultMonths);
      ficheSrc.push({
        month: snapped,
        name: def.name,
        status: 'grise',
        nextYear: longCycleNextYear(cfg, state.consultConfig.interval, currentYear),
        cycles: longCycleYears(cfg, state.consultConfig.interval),
      });
    } else {
      examOccurrenceMonths(cfg, consultMonths).forEach((m) => {
        ficheSrc.push({ month: m, name: def.name, status: cfg.status });
      });
    }
  });
  ficheSrc.sort((a, b) => a.month - b.month);

  const doorInfo = state.doorOpen ? PROTECTS_INFO[state.doorOpen] : null;
  const doorZone = state.doorOpen ? PROTECTS_TO_ZONE[state.doorOpen] : undefined;

  return (
    <div className={styles.module}>
      <div className={styles.tabs} role="tablist" aria-label="Étapes du module Suivi">
        <button
          type="button"
          role="tab"
          aria-selected={state.temps === 'parcours'}
          className={state.temps === 'parcours' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => dispatch({ type: 'SET_TEMPS', temps: 'parcours' })}
        >
          ① Le parcours
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={state.temps === 'fiche'}
          className={state.temps === 'fiche' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => {
            dispatch({ type: 'SET_TEMPS', temps: 'fiche' });
            setFicheOpen(true);
          }}
        >
          ② La fiche
        </button>
      </div>

      {state.temps === 'parcours' && (
        <div className={styles.parcours}>
          <div className={styles.dialWrap}>
            <svg viewBox="0 0 700 700" className={styles.dialSvg} aria-hidden="true" focusable="false">
              <circle cx={CX} cy={CY} r={300} className={styles.dialRing} />

              {monthDots.map((m) => {
                const p = pt(CX, CY, R_DOTS, angleForMonth(m));
                return <circle key={m} cx={p.x} cy={p.y} r={4} className={styles.dialDot} />;
              })}

              {monthLabels.map(({ m, x, y }) => (
                <text key={m} x={x} y={y + 5} textAnchor="middle" className={styles.dialMonthLabel}>
                  {MONTHS[m]}
                </text>
              ))}

              <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} className={styles.dialNeedle} />
              <circle cx={needle.x} cy={needle.y} r={7} className={styles.dialNeedleTip} />

              {/* Centre : motif fil rouge (brief §1.6, refrain « les vaisseaux protégés »). */}
              <circle cx={CX} cy={CY} r={62} className={styles.dialCenterHalo} />
              <circle cx={CX} cy={CY} r={40} className={styles.dialCenterCore} />
              <circle cx={CX} cy={CY} r={7} className={styles.dialCenterDot} />
            </svg>

            {consultIcons.map((c) => (
              <button
                key={`consult-${c.month}`}
                type="button"
                className={styles.station}
                data-size="consult"
                data-status={c.status}
                style={{ left: pct(c.x, 700), top: pct(c.y, 700) }}
                onClick={() => dispatch({ type: 'TOGGLE_CONSULT', month: c.month })}
                aria-label={`Consultation — ${MONTHS_FULL[c.month]} — ${statusLabelFor(c.status)} — cliquer pour changer`}
              >
                <span className={styles.stationIcon}>
                  <IllustrationSlot id="suivi-stethoscope" label="Stéthoscope" shape="circle" size={44} />
                </span>
                <span className={styles.stationBadge} aria-hidden="true">
                  {c.status === 'fait' ? '✓' : c.status === 'a_programmer' ? '⏳' : ''}
                </span>
                <span className={styles.stationTooltip}>Consultation — {MONTHS[c.month]}</span>
              </button>
            ))}

            {bioIcons.map((b) => (
              <button
                key={`bio-${b.month}`}
                type="button"
                className={styles.station}
                data-size="bio"
                data-status={b.status}
                style={{ left: pct(b.x, 700), top: pct(b.y, 700) }}
                onClick={() => b.ids.forEach((id) => dispatch({ type: 'TOGGLE_EXAM_STATUS', id }))}
                aria-label={`${b.label} — ${statusLabelFor(b.status)} — cliquer pour changer`}
              >
                <span className={styles.stationIcon}>
                  <IllustrationSlot id="suivi-prise-de-sang" label="Prise de sang" shape="circle" size={38} />
                </span>
                <span className={styles.stationBadge} aria-hidden="true">
                  {b.status === 'fait' ? '✓' : b.status === 'a_programmer' ? '⏳' : ''}
                </span>
                <span className={styles.stationTooltip}>{b.label}</span>
              </button>
            ))}

            {examIcons.map((e) => (
              <button
                key={`exam-${e.id}-${e.month}`}
                type="button"
                className={styles.station}
                data-size="exam"
                data-status={e.longCycle ? 'longcycle' : e.status}
                style={{ left: pct(e.x, 700), top: pct(e.y, 700) }}
                onClick={() => dispatch({ type: 'TOGGLE_EXAM_STATUS', id: e.id })}
                aria-label={`${e.name} — ${MONTHS_FULL[e.month]} — ${
                  e.longCycle ? 'échéance pluriannuelle, jamais évaporée' : statusLabelFor(e.status)
                } — cliquer pour changer`}
              >
                <span className={styles.stationIcon}>
                  <IllustrationSlot
                    id={`suivi-organe-${e.protects}`}
                    label={PROTECTS_INFO[e.protects].name}
                    shape="circle"
                    size={44}
                  />
                </span>
                <span className={styles.stationBadge} aria-hidden="true">
                  {!e.longCycle && (e.status === 'fait' ? '✓' : e.status === 'a_programmer' ? '⏳' : '')}
                </span>
                <span className={styles.stationTooltip}>
                  {e.name} — {MONTHS[e.month]}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelEyebrow}>On construit le cadran, un élément à la fois</span>
              <button type="button" className={styles.resetLink} onClick={() => dispatch({ type: 'RESET_REVEAL' })}>
                Tout réinitialiser
              </button>
            </div>

            <div className={styles.consultRow}>
              <span className={styles.rowIcon}>
                <IllustrationSlot id="suivi-stethoscope" label="Stéthoscope" shape="circle" size={38} />
              </span>
              <span className={styles.rowLabel}>Consultations</span>
              <div className={styles.chipGroup}>
                {CONSULT_INTERVAL_OPTIONS.map((iv) => (
                  <button
                    key={iv}
                    type="button"
                    className={styles.chip}
                    aria-pressed={state.consultConfig.interval === iv}
                    onClick={() => setConsultInterval(iv)}
                  >
                    {CONSULT_INTERVAL_LABELS[iv]}
                  </button>
                ))}
              </div>
              <div className={styles.stepper}>
                <button type="button" aria-label="Mois de départ précédent" onClick={() => stepConsultStart(-1)}>
                  ‹
                </button>
                <span>{MONTHS[state.consultConfig.startMonth]}</span>
                <button type="button" aria-label="Mois de départ suivant" onClick={() => stepConsultStart(1)}>
                  ›
                </button>
              </div>
              <button
                type="button"
                className={styles.revealToggle}
                aria-pressed={state.consultRevealed}
                onClick={() => dispatch({ type: 'TOGGLE_CONSULT_REVEAL' })}
              >
                {state.consultRevealed ? 'Retirer du cadran' : 'Placer sur le cadran'}
              </button>
            </div>

            <p className={styles.examListLabel}>Mes examens — un par un</p>
            <div className={styles.examList}>
              {examRows.map(({ def, cfg, revealed, snapped, longCycle, cycles, info, freqOptions }) => (
                <div key={def.id} className={styles.examRow} data-revealed={revealed}>
                  <span className={styles.rowIcon}>
                    <IllustrationSlot id={`suivi-organe-${def.protects}`} label={info.name} shape="circle" size={34} />
                  </span>
                  <span className={styles.examName}>
                    <span className={styles.examNameLabel}>{def.name}</span>
                    <span className={styles.examProtects}>protège : {info.name}</span>
                  </span>

                  <div className={styles.chipGroup}>
                    {freqOptions.map((fo) => (
                      <button
                        key={fo.n}
                        type="button"
                        className={styles.chipSmall}
                        aria-pressed={cfg.everyN === fo.n}
                        onClick={() => dispatch({ type: 'SET_EXAM_EVERY_N', id: def.id, everyN: fo.n })}
                      >
                        {fo.label}
                      </button>
                    ))}
                    <InfoHover
                      label={`Fréquence usuelle de ${def.name}, à revalider`}
                      content={
                        <>
                          Fréquence indicative — <strong>à revalider (ADA/HAS-SFD)</strong> avec le soignant.
                        </>
                      }
                    >
                      <span className={styles.infoGlyph} aria-hidden="true">
                        i
                      </span>
                    </InfoHover>
                  </div>

                  <div className={styles.stepper}>
                    <button
                      type="button"
                      aria-label={`Mois de ${def.name} précédent`}
                      onClick={() => dispatch({ type: 'STEP_EXAM_MONTH', id: def.id, delta: -1 })}
                    >
                      ‹
                    </button>
                    <span>{MONTHS[snapped]}</span>
                    <button
                      type="button"
                      aria-label={`Mois de ${def.name} suivant`}
                      onClick={() => dispatch({ type: 'STEP_EXAM_MONTH', id: def.id, delta: 1 })}
                    >
                      ›
                    </button>
                  </div>

                  <span className={styles.examStatus} data-status={longCycle ? 'longcycle' : cfg.status}>
                    {longCycle
                      ? `Tous les ${cycles} ans — prochain : ${longCycleNextYear(cfg, state.consultConfig.interval, currentYear)}`
                      : statusLabelFor(cfg.status)}
                  </span>

                  <button
                    type="button"
                    className={styles.doorButton}
                    onClick={() => dispatch({ type: 'OPEN_DOOR', protects: def.protects })}
                  >
                    Ce que ça garde
                  </button>
                  <button
                    type="button"
                    className={styles.revealToggle}
                    aria-pressed={revealed}
                    onClick={() => dispatch({ type: 'TOGGLE_EXAM_REVEAL', id: def.id })}
                  >
                    {revealed ? 'Retirer du cadran' : 'Placer sur le cadran'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className={styles.caption}>
        {state.temps === 'parcours'
          ? "On place les consultations, puis chaque examen un par un — le cadran se construit sous vos yeux."
          : 'Le cadran enseigne, la fiche organise — même ADN, deux objets distincts.'}
      </p>

      <ModuleFooterNav
        titre="Continuer l'exploration"
        items={[{ id: 'traitements', label: 'Les surveillances liées aux médicaments' }]}
        onNavigate={onNavigate}
      />

      {doorInfo && (
        <div
          className={styles.doorOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Ce que ça garde — ${doorInfo.name}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) dispatch({ type: 'CLOSE_DOOR' });
          }}
        >
          <div className={styles.doorSheet}>
            <button
              type="button"
              className={styles.doorClose}
              onClick={() => dispatch({ type: 'CLOSE_DOOR' })}
              aria-label="Fermer"
            >
              ✕
            </button>
            <div className={styles.doorVisual}>
              {doorZone ? (
                <Silhouette zones={[{ id: doorZone, etat: 'ouvert' }]} />
              ) : (
                <IllustrationSlot
                  id={`suivi-organe-${state.doorOpen}`}
                  label={doorInfo.name}
                  shape="rounded"
                  size={160}
                />
              )}
            </div>
            <div className={styles.doorText}>
              <span className={styles.doorEyebrow}>Ce que ça garde — {doorInfo.name}</span>
              <p>{doorInfo.text}</p>
            </div>
          </div>
        </div>
      )}

      {ficheOpen && (
        <FicheOverlay
          eyebrow={`Fiche — mon calendrier ${currentYear}`}
          titre="Mes rendez-vous et examens de l'année"
          footer={
            <p className="fiche-filrouge">
              Le diabète est une maladie des vaisseaux, pas seulement du sucre — agir sur tout ensemble
              protège.
            </p>
          }
          onClose={() => {
            setFicheOpen(false);
            dispatch({ type: 'SET_TEMPS', temps: 'parcours' });
          }}
        >
          <div className={styles.ficheList}>
            {ficheSrc.map((r, i) => (
              <div key={i} className={styles.ficheRow}>
                <span className={styles.ficheMonth}>{MONTHS[r.month]}</span>
                <span className={styles.ficheDot} data-status={r.status} aria-hidden="true">
                  {r.status === 'fait' ? '✓' : r.status === 'a_programmer' ? '⏳' : ''}
                </span>
                <span className={styles.ficheName}>{r.name}</span>
                <span className={styles.ficheStatus} data-status={r.status}>
                  {r.status === 'grise' ? `Tous les ${r.cycles} ans — ${r.nextYear}` : statusLabelFor(r.status)}
                </span>
                <span className={styles.ficheDate}>Date : ____ /____ /______</span>
              </div>
            ))}
          </div>
          <div className="fiche-bloc">
            <p className={styles.ficheLegend}>
              ✓ fait&nbsp;·&nbsp;⏳ à programmer&nbsp;·&nbsp;grisé = échéance à plus de 12 mois (n'attend
              rien de vous cette année)
            </p>
          </div>
        </FicheOverlay>
      )}
    </div>
  );
}
