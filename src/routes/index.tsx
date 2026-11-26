import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/copilot/dashboard";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral | Creator Copilot" },
      {
        name: "description",
        content:
          "Seu painel para planejar conteúdo, acompanhar tarefas e dar os próximos passos até a primeira venda.",
      },
      { property: "og:title", content: "Visão geral | Creator Copilot" },
      {
        property: "og:description",
        content: "Seu espaço para criar, planejar e evoluir como afiliado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
