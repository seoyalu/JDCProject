import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import type { Dispatch, ReactNode } from "react";
import {
  STORAGE_KEY,
  campusReducer,
  initialState,
  restoreState,
} from "./campus";
import type { CampusAction, CampusState } from "./campus";

const CampusContext = createContext<{
  state: CampusState;
  dispatch: Dispatch<CampusAction>;
  storageAvailable: boolean;
} | null>(null);

export function CampusProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(campusReducer, undefined, () => {
    try {
      return restoreState(localStorage.getItem(STORAGE_KEY));
    } catch {
      return initialState();
    }
  });
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [state]);
  return (
    <CampusContext.Provider value={{ state, dispatch, storageAvailable }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const value = useContext(CampusContext);
  if (!value) throw new Error("CampusProvider is required");
  return value;
}
