import {
  Eye,
  MousePointer2,
  MessageCircle,
  ArrowUpRight,
  Check,
  Info,
  ChartNoAxesCombined,
  CircleCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCopilot } from "./store";
import { completion } from "./model";
import { Journey, PageHeading, ProgressBar, SectionTitle } from "./shared";
export function ProgressPage() {
  const { completed, plan } = useCopilot();
  const progress = completion(completed, plan);
  return (
    <>
      <PageHeading
        eyebrow="CADA PASSO É UMA CONQUISTA"
        title="Olha só o quanto você já avançou."
        description="Acompanhe suas ações e celebre sua evolução, uma tarefa de cada vez."
      />
      <div className="metrics-disclaimer">
        <Info size={19} />
        <div>
          <strong>Estes números são dados de demonstração.</strong>
          <p>
            Valores fictícios para ilustrar o painel. Nenhuma conta social ou dado de performance da
            YouShop está conectado.
          </p>
        </div>
        <span className="sample-label">DADOS DEMO</span>
      </div>
      <div className="summary-grid">
        {[
          {
            name: "Visualizações do conteúdo",
            value: "1.248",
            icon: Eye,
            tone: "tone-lavender",
            sub: "Alcance ilustrativo",
          },
          {
            name: "Cliques no link",
            value: "32",
            icon: MousePointer2,
            tone: "tone-mint",
            sub: "Interesse ilustrativo",
          },
          {
            name: "Interações com o público",
            value: "86",
            icon: MessageCircle,
            tone: "tone-peach",
            sub: "Engajamento ilustrativo",
          },
        ].map((metric) => (
          <article className="summary-card" key={metric.name}>
            <span className={`summary-icon ${metric.tone}`}>
              <metric.icon size={21} />
            </span>
            <span className="summary-caption">{metric.name}</span>
            <h3>{metric.value}</h3>
            <p>
              {metric.sub} <span className="dot-divider">·</span> Dados demo
            </p>
          </article>
        ))}
      </div>
      <Journey />
      <div className="progress-columns">
        <section>
          <SectionTitle
            title="Seu plano em movimento"
            subtitle="Progresso real das tarefas desta sessão."
          />
          <div className="progress-overview">
            <span className="progress-big">
              {progress.percent}
              <small>%</small>
            </span>
            <div>
              <h3>
                {progress.count} de {progress.total} tarefas concluídas
              </h3>
              <p>Você está construindo sua própria consistência.</p>
              <ProgressBar percent={progress.percent} />
            </div>
          </div>
          <div
            className="activity-chart"
            aria-label="Gráfico ilustrativo de visualizações: segunda 120, terça 210, quarta 150, quinta 290, sexta 180, sábado 198, domingo 100"
          >
            <div className="chart-title">
              <h3>Visualizações ao longo da semana</h3>
              <span>EXEMPLO</span>
            </div>
            <div className="chart-bars">
              {[
                { day: "Seg", value: 120 },
                { day: "Ter", value: 210 },
                { day: "Qua", value: 150 },
                { day: "Qui", value: 290 },
                { day: "Sex", value: 180 },
                { day: "Sáb", value: 198 },
                { day: "Dom", value: 100 },
              ].map((item) => (
                <div className="chart-column" key={item.day}>
                  <span>{item.value}</span>
                  <meter
                    min={0}
                    max={300}
                    value={item.value}
                    aria-label={`${item.day}: ${item.value} visualizações demonstrativas`}
                  />
                  <small>{item.day}</small>
                </div>
              ))}
            </div>
            <p>Dados fictícios · Não representam resultados reais</p>
          </div>
        </section>
        <section>
          <SectionTitle title="Suas conquistas" subtitle="As ações que você já tirou do papel." />
          <div className="achievement-list">
            {plan
              .filter((task) => completed.includes(task.id))
              .map((task) => (
                <div className="achievement" key={task.id}>
                  <span>
                    <Check size={17} />
                  </span>
                  <div>
                    <h3>{task.title}</h3>
                    <p>Etapa {task.step} · Concluída</p>
                  </div>
                  <CircleCheck size={16} />
                </div>
              ))}
            {!completed.length && (
              <div className="completed-empty">
                <ChartNoAxesCombined size={30} />
                <h3>Sua primeira conquista te espera</h3>
                <p>Conclua uma tarefa do plano para acompanhar sua evolução aqui.</p>
              </div>
            )}
          </div>
          <Button asChild variant="outline">
            <Link to="/plano">
              Continuar meu plano
              <ArrowUpRight />
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
