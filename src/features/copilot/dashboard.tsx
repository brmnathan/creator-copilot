import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Sprout,
  ListChecks,
  Target,
  Lightbulb,
  ScanLine,
  WandSparkles,
  CircleCheck,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopilot } from "./store";
import { completion, nextTask, suggestFormat } from "./model";
import {
  ContentLink,
  Journey,
  PageHeading,
  ProgressBar,
  RocketIllustration,
  SectionTitle,
  TaskRow,
} from "./shared";
export function Dashboard() {
  const { diagnosis, completed, diagnosed, plan, planSource, setSelectedTask, setFormat } =
    useCopilot();
  const progress = completion(completed, plan);
  const next = nextTask(plan, completed);
  const upcoming = plan.filter((task) => !completed.includes(task.id)).slice(0, 3);
  return (
    <>
      <PageHeading
        eyebrow="SEU PAINEL DE CRIAÇÃO"
        title={`Olá, ${diagnosis.name || "criador"}! 👋`}
        description="Vamos transformar suas ideias na sua primeira venda?"
        action={
          <span className="day-label">
            <span className="live-dot" />
            Um bom dia para começar
          </span>
        }
      />
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="banner-eyebrow">
            <Sparkles size={14} /> SEU COPILOTO ESTÁ COM VOCÊ
          </span>
          <h2>
            Sua primeira venda está
            <br />
            mais perto do que você imagina.
          </h2>
          <p>
            Você não precisa ter todas as respostas.
            <br />
            Só precisa dar o próximo passo — e a gente te ajuda.
          </p>
          <Button variant="lime" asChild>
            <Link to="/plano">
              Continuar meu plano
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <RocketIllustration />
      </section>
      <div className="summary-grid">
        <article className="summary-card">
          <span className="summary-icon tone-lavender">
            <Sprout size={21} />
          </span>
          <span className="summary-caption">Seu nível de criadora</span>
          <h3>{diagnosis.experience}</h3>
          <p>
            <span className="tiny-dot" />
            Construindo uma base sólida
          </p>
          <span className="card-corner">01</span>
        </article>
        <article className="summary-card">
          <span className="summary-icon tone-mint">
            <ListChecks size={21} />
          </span>
          <span className="summary-caption">Tarefas concluídas</span>
          <h3>
            {progress.count}
            <span className="metric-secondary"> / {progress.total}</span>
          </h3>
          <ProgressBar percent={progress.percent} />
          <p>{progress.percent}% do seu plano de ação</p>
        </article>
        <article className="summary-card">
          <span className="summary-icon tone-peach">
            <Target size={21} />
          </span>
          <span className="summary-caption">Seu objetivo atual</span>
          <h3 className="goal-value">{diagnosis.goal}</h3>
          <p>Um objetivo. Um plano. Você no controle.</p>
          <span className="card-corner">
            <ArrowUpRight size={18} />
          </span>
        </article>
      </div>
      <div className="dashboard-columns">
        <section className="recommendation-section">
          <SectionTitle title="Um direcionamento para você">
            <span className="mini-label">
              <Sparkles size={12} />
              COPILOT
            </span>
          </SectionTitle>
          <div className="recommendation-card">
            <div className="recommendation-top">
              <span className="idea-icon">
                <Lightbulb size={23} />
              </span>
              <span className="sample-label">
                {planSource === "ai" ? "RECOMENDAÇÃO COM IA" : "RECOMENDAÇÃO DEMONSTRATIVA"}
              </span>
            </div>
            {next ? (
              <>
                <h3>{next.title}</h3>
                <p>{next.description}</p>
                <div className="recommendation-insight">
                  <Sparkles size={16} />
                  <p>
                    Seu próximo passo · Etapa {next.step} · {next.duration}
                    {next.format ? (
                      <>
                        {" "}
                        · Formato: <strong>{next.format}</strong>
                      </>
                    ) : null}
                  </p>
                </div>
                <ContentLink
                  onClick={() => {
                    setSelectedTask(next.title);
                    setFormat(suggestFormat(next));
                  }}
                >
                  Transformar em conteúdo
                </ContentLink>
              </>
            ) : (
              <>
                <h3>Plano concluído!</h3>
                <p>Você completou todas as tarefas. Gere um novo plano quando quiser evoluir.</p>
              </>
            )}
            <div className="recommendation-note">
              {planSource === "ai"
                ? "Baseado no seu plano gerado por IA."
                : "Plano de exemplo. Gere seu plano com IA na página Plano de ação."}
            </div>
          </div>
        </section>
        <section className="upcoming-section">
          <SectionTitle title="Seus próximos passos" subtitle="Pequenas ações para sair do lugar.">
            <Button variant="link" asChild size="sm">
              <Link to="/plano">
                Ver plano
                <ArrowUpRight />
              </Link>
            </Button>
          </SectionTitle>
          <div className="upcoming-list">
            {upcoming.length ? (
              upcoming.map((task) => <TaskRow key={task.id} task={task} />)
            ) : (
              <div className="completed-empty">
                <CircleCheck size={30} />
                <h3>Plano concluído!</h3>
                <p>Você deu todos os passos. Agora é hora de acompanhar o que funciona.</p>
                <Button asChild variant="outline">
                  <Link to="/progresso">
                    Ver meu progresso
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <div className="consistency-note">
            <Clock3 size={17} />
            <span>Consistência vale mais do que perfeição.</span>
          </div>
          <div className="quick-actions">
            <h3>Um atalho para o próximo passo</h3>
            <div>
              <Link to="/diagnostico" className="quick-action">
                <span className="quick-icon tone-lavender">
                  <ScanLine size={19} />
                </span>
                <span>
                  <strong>{diagnosed ? "Revisar diagnóstico" : "Meu diagnóstico"}</strong>
                  <small>Uma estratégia com a sua cara</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
              <Link to="/criador" className="quick-action">
                <span className="quick-icon tone-mint">
                  <WandSparkles size={19} />
                </span>
                <span>
                  <strong>Criar conteúdo</strong>
                  <small>Da ideia à próxima publicação</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Journey compact />
    </>
  );
}
