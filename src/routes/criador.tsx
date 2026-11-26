import { createFileRoute } from "@tanstack/react-router";
import { CreatorPage } from "@/features/copilot/creator";
export const Route = createFileRoute("/criador")({
  head: () => ({
    meta: [
      { title: "Criador de conteúdo | Creator Copilot" },
      {
        name: "description",
        content:
          "Explore exemplos de posts, roteiros de vídeos e stories com o contexto do seu produto e público.",
      },
      { property: "og:title", content: "Criador de conteúdo | Creator Copilot" },
      {
        property: "og:description",
        content:
          "Explore exemplos de posts, roteiros de vídeos e stories com o contexto do seu produto e público.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatorPage,
});
