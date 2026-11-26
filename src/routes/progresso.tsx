import { createFileRoute } from "@tanstack/react-router";
import { ProgressPage } from "@/features/copilot/progress";
export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Meu progresso | Creator Copilot" },
      {
        name: "description",
        content:
          "Acompanhe suas tarefas concluídas e explore métricas de demonstração da sua jornada de criação.",
      },
      { property: "og:title", content: "Meu progresso | Creator Copilot" },
      {
        property: "og:description",
        content:
          "Acompanhe suas tarefas concluídas e explore métricas de demonstração da sua jornada de criação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});
