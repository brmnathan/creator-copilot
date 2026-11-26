import { createFileRoute } from "@tanstack/react-router";
import { PlanPage } from "@/features/copilot/plan";
export const Route = createFileRoute("/plano")({
  head: () => ({
    meta: [
      { title: "Plano de ação | Creator Copilot" },
      {
        name: "description",
        content:
          "Explore um plano de divulgação em três etapas e acompanhe suas tarefas até a primeira venda.",
      },
      { property: "og:title", content: "Plano de ação | Creator Copilot" },
      {
        property: "og:description",
        content:
          "Explore um plano de divulgação em três etapas e acompanhe suas tarefas até a primeira venda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});
