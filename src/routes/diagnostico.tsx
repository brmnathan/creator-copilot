import { createFileRoute } from "@tanstack/react-router";
import { DiagnosisPage } from "@/features/copilot/diagnosis";
export const Route = createFileRoute("/diagnostico")({
  head: () => ({
    meta: [
      { title: "Meu diagnóstico | Creator Copilot" },
      {
        name: "description",
        content:
          "Conheça seu perfil de criador e organize seu próximo passo com um diagnóstico em três etapas.",
      },
      { property: "og:title", content: "Meu diagnóstico | Creator Copilot" },
      {
        property: "og:description",
        content:
          "Conheça seu perfil de criador e organize seu próximo passo com um diagnóstico em três etapas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiagnosisPage,
});
