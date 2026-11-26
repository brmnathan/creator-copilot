import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Flag,
  Sprout,
  Sparkles,
  LoaderCircle,
  RotateCcw,
  CircleAlert,
  Clapperboard,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generatePlan } from "@/lib/ai/copilot.functions";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCopilot } from "./store";
import { completion, suggestFormat } from "./model";
import { PageHeading, ProgressBar } from "./shared";
const steps = [
  { title: "Prepare sua base", subtitle: "Clareza antes de começar.", icon: Sprout },
  { title: "Crie uma conexão", subtitle: "Conteúdo que ajuda e aproxima.", icon: Sparkles },
  { title: "Promova e aprenda", subtitle: "Transforme atenção em oportunidade.", icon: Flag },
];
export function PlanPage() {
  const {
    diagnosis,
    completed,
    toggleTask,
    setSelectedTask,
    setFormat,
    plan,
    planSource,
    replacePlan,
  } = useCopilot();
  const progress = completion(completed, plan);
  const generate = useServerFn(generatePlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const run = async () => {
    setConfirmOpen(false);
    setLoading(true);
    setError("");
    try {
      const res = await generate({ data: diagnosis });
      if (res.ok) replacePlan(res.data);
      else setError(res.error);
    } catch {
      setError("Não foi possível falar com a IA agora. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const request = () => (completed.length > 0 ? setConfirmOpen(true) : run());
  return (
    <>
      <PageHeading
        eyebrow="DA INTENÇÃO À AÇÃO"
        title="Seu próximo passo, bem definido."
        description={`${planSource === "ai" ? "Um plano personalizado com IA" : "Um plano de demonstração"} para ${diagnosis.platform}, com foco em ${diagnosis.niche.toLocaleLowerCase("pt-BR")}.`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/diagnostico">
                Revisar diagnóstico
                <ArrowUpRight />
              </Link>
            </Button>
            <Button onClick={request} disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
              {loading ? "Gerando seu plano..." : "Gerar meu plano com IA"}
            </Button>
          </div>
        }
      />
      {error && (
        <div className="demo-notice" role="alert">
          <CircleAlert size={17} />
          <p>
            <strong>Não conseguimos gerar seu plano</strong>
            {error}
          </p>
          <Button size="sm" variant="outline" onClick={request} disabled={loading}>
            <RotateCcw />
            Tentar novamente
          </Button>
        </div>
      )}
      <section className="plan-progress">
        <div>
          <span className="summary-icon tone-mint">
            <ListIcon />
          </span>
          <div>
            <h2>Seu plano de ação</h2>
            <p>
              {progress.count} de {progress.total} tarefas concluídas
            </p>
          </div>
        </div>
        <div className="plan-progress-meter">
          <strong>{progress.percent}%</strong>
          <ProgressBar percent={progress.percent} />
        </div>
      </section>
      <div className="plan-steps">
        {steps.map((step, index) => (
          <section className="plan-step" key={step.title}>
            <div className="plan-step-heading">
              <span className="plan-number">0{index + 1}</span>
              <div>
                <span className="eyebrow">ETAPA {index + 1}</span>
                <h2>{step.title}</h2>
                <p>{step.subtitle}</p>
              </div>
              <step.icon size={23} />
            </div>
            <div className="plan-task-grid">
              {plan
                .filter((task) => task.step === index + 1)
                .map((task) => (
                  <article
                    className={`plan-task ${completed.includes(task.id) ? "plan-task-complete" : ""}`}
                    key={task.id}
                  >
                    <div className="plan-task-top">
                      <span
                        className={`priority-badge ${task.priority === "Alta" ? "priority-high" : ""}`}
                      >
                        Prioridade {task.priority.toLocaleLowerCase("pt-BR")}
                      </span>
                      <span>
                        <Clock3 size={13} />
                        {task.duration}
                      </span>
                    </div>
                    <div className="plan-task-title">
                      <Checkbox
                        id={`plan-${task.id}`}
                        checked={completed.includes(task.id)}
                        onCheckedChange={() => toggleTask(task.id)}
                        aria-label={`Concluir: ${task.title}`}
                      />
                      <label htmlFor={`plan-${task.id}`}>{task.title}</label>
                    </div>
                    <p>{task.description}</p>
                    {task.format && (
                      <span className="priority-badge">
                        <Clapperboard size={12} /> {task.format}
                      </span>
                    )}
                    <Button asChild variant="link" className="task-content-button">
                      <Link
                        to="/criador"
                        onClick={() => {
                          setSelectedTask(task.title);
                          setFormat(suggestFormat(task));
                        }}
                      >
                        Gerar conteúdo para esta tarefa
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
      <p className="page-disclaimer">
        <Sparkles size={15} />
        {planSource === "ai"
          ? "Plano gerado por IA a partir do seu diagnóstico. Revise as sugestões antes de colocar em prática."
          : "Plano ilustrativo com tarefas pré-definidas. Clique em “Gerar meu plano com IA” para personalizá-lo."}
      </p>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Substituir seu plano atual?</AlertDialogTitle>
            <AlertDialogDescription>
              Você já concluiu {progress.count} tarefa{progress.count === 1 ? "" : "s"}. Um novo
              plano substitui as tarefas atuais e zera seu progresso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter plano atual</AlertDialogCancel>
            <AlertDialogAction onClick={run}>Gerar novo plano</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
function ListIcon() {
  return <Check size={22} />;
}
