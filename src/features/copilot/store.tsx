import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  demoTasks,
  emptyDiagnosis,
  formatsFor,
  initialDiagnosis,
  type ContentFormat,
  type Diagnosis,
  type PlanTask,
} from "./model";

export const STORAGE_KEY = "creator-copilot:v1";

type Persisted = {
  diagnosis: Diagnosis;
  diagnosed: boolean;
  completed: string[];
  plan: PlanTask[];
  planSource: "demo" | "ai";
  planBasis: Diagnosis | null;
  format: ContentFormat;
  contentPlatform: string;
  product: string;
  audience: string;
  selectedTask: string;
  result: string;
};

function firstVisit(): Persisted {
  return {
    diagnosis: initialDiagnosis,
    diagnosed: false,
    completed: ["audience", "product"],
    plan: demoTasks,
    planSource: "demo",
    planBasis: null,
    format: formatsFor(initialDiagnosis.platform)[0]!.id,
    contentPlatform: initialDiagnosis.platform,
    product: initialDiagnosis.product,
    audience: "Mulheres que buscam uma rotina de autocuidado prática",
    selectedTask: "Crie seu primeiro post de conexão",
    result: "",
  };
}
function freshStart(): Persisted {
  return {
    ...firstVisit(),
    diagnosis: emptyDiagnosis,
    completed: [],
    format: formatsFor(emptyDiagnosis.platform)[0]!.id,
    contentPlatform: emptyDiagnosis.platform,
    product: "",
    audience: "",
    selectedTask: "",
  };
}
/** Merges stored data over defaults, ignoring anything malformed. */
export function readPersisted(raw: string | null): Persisted | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Persisted>;
    if (!data || typeof data !== "object" || !data.diagnosis) return null;
    const base = firstVisit();
    return {
      ...base,
      ...data,
      diagnosis: { ...base.diagnosis, ...data.diagnosis },
      plan: Array.isArray(data.plan) && data.plan.length ? data.plan : base.plan,
      completed: Array.isArray(data.completed) ? data.completed : base.completed,
    };
  } catch {
    return null;
  }
}

type CopilotState = Persisted & {
  hydrated: boolean;
  updateDiagnosis: (patch: Partial<Diagnosis>) => void;
  finishDiagnosis: () => void;
  diagnosisStep: number;
  setDiagnosisStep: (step: number) => void;
  toggleTask: (id: string) => void;
  setFormat: (format: ContentFormat) => void;
  setContentPlatform: (platform: string) => void;
  setProduct: (value: string) => void;
  setAudience: (value: string) => void;
  setSelectedTask: (value: string) => void;
  setResult: (value: string) => void;
  replacePlan: (plan: PlanTask[], basis: Diagnosis) => void;
  resetDemo: () => void;
};
const CopilotContext = createContext<CopilotState | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(firstVisit);
  const [hydrated, setHydrated] = useState(false);
  const [diagnosisStep, setDiagnosisStep] = useState(0);
  const skipSave = useRef(true);

  useEffect(() => {
    try {
      const saved = readPersisted(window.localStorage.getItem(STORAGE_KEY));
      if (saved) setState(saved);
    } catch {
      /* storage unavailable: keep defaults */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode: ignore */
    }
  }, [state, hydrated]);

  const patch = (p: Partial<Persisted>) => setState((s) => ({ ...s, ...p }));
  return (
    <CopilotContext.Provider
      value={{
        ...state,
        hydrated,
        updateDiagnosis: (p) => setState((s) => ({ ...s, diagnosis: { ...s.diagnosis, ...p } })),
        finishDiagnosis: () =>
          setState((s) => ({
            ...s,
            diagnosed: true,
            product: s.diagnosis.product,
            contentPlatform: s.diagnosis.platform,
            format: formatsFor(s.diagnosis.platform)[0]!.id,
          })),
        diagnosisStep,
        setDiagnosisStep,
        toggleTask: (id) =>
          setState((s) => ({
            ...s,
            completed: s.completed.includes(id)
              ? s.completed.filter((item) => item !== id)
              : [...s.completed, id],
          })),
        setFormat: (format) => patch({ format }),
        setContentPlatform: (contentPlatform) =>
          patch({ contentPlatform, format: formatsFor(contentPlatform)[0]!.id }),
        setProduct: (product) => patch({ product }),
        setAudience: (audience) => patch({ audience }),
        setSelectedTask: (selectedTask) => patch({ selectedTask }),
        setResult: (result) => patch({ result }),
        replacePlan: (plan, basis) =>
          patch({ plan, planSource: "ai", planBasis: basis, completed: [] }),
        resetDemo: () => {
          try {
            window.localStorage.removeItem(STORAGE_KEY);
          } catch {
            /* ignore */
          }
          setDiagnosisStep(0);
          setState(freshStart());
        },
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}
export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) throw new Error("CopilotProvider is required");
  return context;
}
