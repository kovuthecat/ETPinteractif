import { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ThemeId } from '../features/types';

/**
 * État de sélection partagé, EN MÉMOIRE uniquement (invariant projet 1 : zéro
 * persistance — ni localStorage, ni sessionStorage, ni cookie, ni réseau).
 * Le `SelectionProvider` est monté au-dessus du switcher de vues d'`App.tsx` :
 * il survit donc à la navigation inter-modules mais se réinitialise à chaque
 * rechargement de page (F5), ce qui reste « éphémère » et conforme.
 *
 * Générique : l'état est indexé par `themeId` (aucun nom de thème en dur ici).
 * Les champs ci-dessous sont le vocabulaire de sélection ETP courant ; un thème
 * qui n'en utilise pas certains les laisse simplement vides.
 */
/**
 * Stratégie d'arrêt retenue dans le plan (thème tabac). Deux options également
 * valables ; `null` = pas encore choisi (rendu rétro-compatible). Portée v1 :
 * libellés seuls — ne modifie ni le protocole ni le contenu du livret.
 */
export type StrategieArret = 'complet' | 'progressive';

export interface SelectionState {
  dateArret: string;
  /** stratégie d'arrêt retenue (tabac) — `null` tant qu'aucun choix. */
  strategie: StrategieArret | null;
  /** ids de situations cochées (canoniques — cf. `tabac/situations.ts`). */
  situations: string[];
  /** situations saisies librement dans « Mon plan d'arrêt ». */
  situationsLibres: string[];
  /** ids de formes de substitut retenues (canoniques — cf. `SubstitutsModule`). */
  substituts: string[];
  /** ids d'outils marqués « Dans ma fiche » (canoniques — cf. boîte-à-outils). */
  outilsFiche: string[];
  /** parades (4D + libres) retenues dans « Mon plan d'arrêt ». */
  parades: string[];
  /** raisons d'arrêter (libellés — cf. `MotivationModule`). */
  raisons: string[];
  /** gestes « Si j'ai un écart » retenus dans « Mon plan d'arrêt ». */
  gestesEcart: string[];
}

export type SelectionListField = Exclude<keyof SelectionState, 'dateArret' | 'strategie'>;

const EMPTY_STATE: SelectionState = Object.freeze({
  dateArret: '',
  strategie: null,
  situations: [],
  situationsLibres: [],
  substituts: [],
  outilsFiche: [],
  parades: [],
  raisons: [],
  gestesEcart: [],
});

type StatesByTheme = Record<ThemeId, SelectionState>;

type Action =
  | { type: 'TOGGLE'; theme: ThemeId; field: SelectionListField; value: string }
  | { type: 'ADD'; theme: ThemeId; field: SelectionListField; value: string }
  | { type: 'REMOVE'; theme: ThemeId; field: SelectionListField; value: string }
  | { type: 'SET_LIST'; theme: ThemeId; field: SelectionListField; values: string[] }
  | { type: 'SET_DATE'; theme: ThemeId; value: string }
  | { type: 'SET_STRATEGIE'; theme: ThemeId; value: StrategieArret | null }
  | { type: 'RESET'; theme: ThemeId };

function sameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function withField(
  state: StatesByTheme,
  theme: ThemeId,
  current: SelectionState,
  field: SelectionListField,
  next: string[],
): StatesByTheme {
  return { ...state, [theme]: { ...current, [field]: next } };
}

function reducer(state: StatesByTheme, action: Action): StatesByTheme {
  const current = state[action.theme] ?? EMPTY_STATE;
  switch (action.type) {
    case 'TOGGLE': {
      const list = current[action.field];
      const next = list.includes(action.value)
        ? list.filter((v) => v !== action.value)
        : [...list, action.value];
      return withField(state, action.theme, current, action.field, next);
    }
    case 'ADD': {
      const list = current[action.field];
      if (list.includes(action.value)) return state;
      return withField(state, action.theme, current, action.field, [...list, action.value]);
    }
    case 'REMOVE': {
      const list = current[action.field];
      if (!list.includes(action.value)) return state;
      return withField(state, action.theme, current, action.field, list.filter((v) => v !== action.value));
    }
    case 'SET_LIST': {
      const list = current[action.field];
      if (sameOrder(list, action.values)) return state;
      return withField(state, action.theme, current, action.field, action.values);
    }
    case 'SET_DATE': {
      if (current.dateArret === action.value) return state;
      return { ...state, [action.theme]: { ...current, dateArret: action.value } };
    }
    case 'SET_STRATEGIE': {
      if (current.strategie === action.value) return state;
      return { ...state, [action.theme]: { ...current, strategie: action.value } };
    }
    case 'RESET': {
      if (!state[action.theme]) return state;
      const rest = { ...state };
      delete rest[action.theme];
      return rest;
    }
    default:
      return state;
  }
}

const StatesContext = createContext<StatesByTheme | null>(null);
const DispatchContext = createContext<React.Dispatch<Action> | null>(null);
const ThemeScopeContext = createContext<ThemeId | null>(null);

/** Monté AU-DESSUS du switcher de vues (App.tsx) → ne se démonte jamais lors d'un
 *  changement de module, donc l'état survit à la navigation. */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [states, dispatch] = useReducer(reducer, {} as StatesByTheme);
  return (
    <StatesContext.Provider value={states}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StatesContext.Provider>
  );
}

/** Fixe le `themeId` courant pour les descendants ; placé autour de la vue de
 *  module, il peut se remonter à la navigation sans perdre l'état (qui vit dans
 *  le `SelectionProvider`, au-dessus). */
export function SelectionScope({ themeId, children }: { themeId: ThemeId; children: ReactNode }) {
  return <ThemeScopeContext.Provider value={themeId}>{children}</ThemeScopeContext.Provider>;
}

export interface UseSelectionResult {
  state: SelectionState;
  toggle: (field: SelectionListField, value: string) => void;
  add: (field: SelectionListField, value: string) => void;
  remove: (field: SelectionListField, value: string) => void;
  setList: (field: SelectionListField, values: string[]) => void;
  setDate: (value: string) => void;
  setStrategie: (value: StrategieArret | null) => void;
  reset: () => void;
}

/** Lecture + actions pour le thème courant (résolu via `SelectionScope`). */
export function useSelection(): UseSelectionResult {
  const states = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const theme = useContext(ThemeScopeContext);
  if (states === null || dispatch === null) {
    throw new Error('useSelection doit être utilisé sous <SelectionProvider>.');
  }
  if (theme === null) {
    throw new Error('useSelection doit être utilisé sous <SelectionScope>.');
  }
  const state = states[theme] ?? EMPTY_STATE;
  const actions = useMemo(
    () => ({
      toggle: (field: SelectionListField, value: string) => dispatch({ type: 'TOGGLE', theme, field, value }),
      add: (field: SelectionListField, value: string) => dispatch({ type: 'ADD', theme, field, value }),
      remove: (field: SelectionListField, value: string) => dispatch({ type: 'REMOVE', theme, field, value }),
      setList: (field: SelectionListField, values: string[]) => dispatch({ type: 'SET_LIST', theme, field, values }),
      setDate: (value: string) => dispatch({ type: 'SET_DATE', theme, value }),
      setStrategie: (value: StrategieArret | null) => dispatch({ type: 'SET_STRATEGIE', theme, value }),
      // `reset` supprime l'entrée du thème → `strategie` repart à `null` (défaut).
      reset: () => dispatch({ type: 'RESET', theme }),
    }),
    [dispatch, theme],
  );
  return { state, ...actions };
}
