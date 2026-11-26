import { createContext, useContext, useState, type ReactNode } from "react";
import { demoTasks, initialDiagnosis, type Diagnosis, type ContentFormat, type PlanTask } from "./model";

type CopilotState = {
  diagnosis: Diagnosis;
  updateDiagnosis: (patch: Partial<Diagnosis>) => void;
  diagnosed: boolean;
  finishDiagnosis: () => void;
  diagnosisStep: number;
  setDiagnosisStep: (step: number) => void;
  completed: string[];
  toggleTask: (id: string) => void;
  format: ContentFormat;
  setFormat: (format: ContentFormat) => void;
  product: string;
  setProduct: (value: string) => void;
  audience: string;
  setAudience: (value: string) => void;
  selectedTask: string;
  setSelectedTask: (value: string) => void;
  result: string;
  setResult: (value: string) => void;
  plan: PlanTask[];
  planSource: "demo" | "ai";
  replacePlan: (plan: PlanTask[]) => void;
};
const CopilotContext = createContext<CopilotState | null>(null);
export function CopilotProvider({ children }: { children: ReactNode }) {
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis);
  const [diagnosed, setDiagnosed] = useState(false);
  const [diagnosisStep, setDiagnosisStep] = useState(0);
  const [completed, setCompleted] = useState(["audience", "product"]);
  const [format, setFormat] = useState<ContentFormat>("post");
  const [product, setProduct] = useState(initialDiagnosis.product);
  const [audience, setAudience] = useState("Mulheres que buscam uma rotina de autocuidado prática");
  const [selectedTask, setSelectedTask] = useState("Crie seu primeiro post de conexão");
  const [result, setResult] = useState("");
  const [plan, setPlan] = useState<PlanTask[]>(demoTasks);
  const [planSource, setPlanSource] = useState<"demo" | "ai">("demo");
  return (
    <CopilotContext.Provider
      value={{
        diagnosis,
        updateDiagnosis: (patch) => setDiagnosis((current) => ({ ...current, ...patch })),
        diagnosed,
        finishDiagnosis: () => {
          setDiagnosed(true);
          setProduct(diagnosis.product);
        },
        diagnosisStep,
        setDiagnosisStep,
        completed,
        toggleTask: (id) =>
          setCompleted((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
          ),
        format,
        setFormat,
        product,
        setProduct,
        audience,
        setAudience,
        selectedTask,
        setSelectedTask,
        result,
        setResult,
        plan,
        planSource,
        replacePlan: (next) => {
          setPlan(next);
          setPlanSource("ai");
          setCompleted([]);
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
