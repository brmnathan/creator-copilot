import { createContext, useContext, useState, type ReactNode } from "react";
import { initialDiagnosis, type Diagnosis, type ContentFormat } from "./model";

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
