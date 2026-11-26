import { ArrowUpRight, Check, Sparkles, Rocket, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCopilot } from "./store";
import { completion, stepDone, type PlanTask } from "./model";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function DemoBadge() {
  return (
    <span className="demo-badge">
      <span />
      Modo demonstração
    </span>
  );
}
export function ProgressBar({ percent }: { percent: number }) {
  return (
    <progress
      className="copilot-progress"
      value={percent}
      max={100}
      aria-label={`Progresso: ${percent}%`}
    />
  );
}
export function SectionTitle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function TaskRow({ task }: { task: PlanTask }) {
  const { completed, toggleTask } = useCopilot();
  return (
    <div className={`task-row ${completed.includes(task.id) ? "task-done" : ""}`}>
      <Checkbox
        id={`task-${task.id}`}
        checked={completed.includes(task.id)}
        onCheckedChange={() => toggleTask(task.id)}
        aria-label={`Concluir: ${task.title}`}
      />
      <label htmlFor={`task-${task.id}`}>
        <strong>{task.title}</strong>
        <span>
          {task.duration} <span className="dot-divider">·</span>{" "}
          {task.priority === "Alta" ? "Prioridade alta" : "Prioridade média"}
        </span>
      </label>
      <span className={`priority-dot ${task.priority === "Alta" ? "high" : ""}`} />
    </div>
  );
}
export function Journey({ compact = false }: { compact?: boolean }) {
  const { completed, plan } = useCopilot();
  const { percent } = completion(completed, plan);
  const milestones = [
    {
      title: "Conhecer seu público",
      sub: "Uma base bem definida",
      icon: Check,
      done: stepDone(plan, completed, 1),
    },
    {
      title: "Criar e compartilhar",
      sub: "Conteúdo que conecta",
      icon: Sparkles,
      done: stepDone(plan, completed, 2),
    },
    {
      title: "Promover e evoluir",
      sub: "Mais perto da primeira venda",
      icon: Flag,
      done: stepDone(plan, completed, 3),
    },
  ];
  return (
    <section className={`journey-section ${compact ? "compact" : ""}`}>
      <SectionTitle
        title="Sua jornada até a primeira venda"
        subtitle="Um passo de cada vez. Cada ação conta."
      >
        <span className="progress-label">{percent}% concluído</span>
      </SectionTitle>
      <div className="journey-track">
        {milestones.map((item, index) => (
          <div className={`milestone ${item.done ? "is-complete" : ""}`} key={item.title}>
            <span className="milestone-icon">
              <item.icon size={18} />
            </span>
            <div>
              <span className="step-caption">ETAPA {index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function RocketIllustration() {
  return (
    <div className="rocket-art" aria-hidden="true">
      <svg viewBox="0 0 330 200" className="orbit-lines">
        <path d="M20 180 C40 30 200 220 290 30" />
        <path d="M70 170 C170 170 145 35 265 60" />
        <circle cx="70" cy="170" r="5" />
        <circle cx="265" cy="60" r="5" />
      </svg>
      <div className="rocket-figure">
        <Rocket strokeWidth={1.2} />
      </div>
      <span className="art-tag art-tag-one">
        <Check size={13} />
        Seu primeiro passo
      </span>
      <span className="art-tag art-tag-two">
        <Flag size={13} />
        Sua primeira venda
      </span>
      <span className="art-spark spark-one">✦</span>
      <span className="art-spark spark-two">+</span>
    </div>
  );
}
export function ContentLink({
  children = "Criar conteúdo",
  onClick,
}: {
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button variant="outline" asChild>
      <Link to="/criador" onClick={onClick}>
        {children}
        <ArrowUpRight />
      </Link>
    </Button>
  );
}
