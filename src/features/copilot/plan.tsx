import { ArrowUpRight, Check, Clock3, Flag, Sprout, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCopilot } from "./store";
import { completion, tasks } from "./model";
import { PageHeading, ProgressBar } from "./shared";
const steps = [
  { title: "Prepare sua base", subtitle: "Clareza antes de começar.", icon: Sprout },
  { title: "Crie uma conexão", subtitle: "Conteúdo que ajuda e aproxima.", icon: Sparkles },
  { title: "Promova e aprenda", subtitle: "Transforme atenção em oportunidade.", icon: Flag },
];
export function PlanPage() {
  const { diagnosis, completed, toggleTask, setSelectedTask, setFormat } = useCopilot();
  const progress = completion(completed);
  return (
    <>
      <PageHeading
        eyebrow="DA INTENÇÃO À AÇÃO"
        title="Seu próximo passo, bem definido."
        description={`Um plano de demonstração para ${diagnosis.platform}, com foco em ${diagnosis.niche.toLocaleLowerCase("pt-BR")}.`}
        action={
          <Button asChild variant="outline">
            <Link to="/diagnostico">
              Revisar diagnóstico
              <ArrowUpRight />
            </Link>
          </Button>
        }
      />
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
              {tasks
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
                    <Button asChild variant="link" className="task-content-button">
                      <Link
                        to="/criador"
                        onClick={() => {
                          setSelectedTask(task.title);
                          setFormat(task.id === "stories" ? "story" : "post");
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
        Plano ilustrativo com tarefas pré-definidas. Não é uma recomendação gerada por IA.
      </p>
    </>
  );
}
function ListIcon() {
  return <Check size={22} />;
}
