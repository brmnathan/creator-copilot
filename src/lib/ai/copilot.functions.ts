import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  buildContentPrompt,
  buildPlanPrompt,
  CONTENT_INSTRUCTIONS,
  normalizePlan,
  PLAN_INSTRUCTIONS,
  type PlanTask,
} from "@/features/copilot/model";

const diagnosisSchema = z.object({
  name: z.string().max(80),
  niche: z.string().max(120),
  platform: z.string().max(60),
  followers: z.string().max(20),
  experience: z.string().max(60),
  difficulty: z.string().max(200),
  product: z.string().max(150),
  goal: z.string().max(200),
});

const planOutput = z.object({
  tasks: z.array(
    z.object({
      step: z.number(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(["Alta", "Média"]),
      duration: z.string(),
      format: z.string().nullable(),
    }),
  ),
});

type AiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function run<T>(fn: () => Promise<T>): Promise<AiResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    const { AiError } = await import("./gateway.server");
    return {
      ok: false,
      error: error instanceof AiError ? error.message : "Não foi possível gerar com IA agora. Tente novamente.",
    };
  }
}

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => diagnosisSchema.parse(data))
  .handler(async ({ data }): Promise<AiResult<PlanTask[]>> =>
    run(async () => {
      const { generateStructured, AiError } = await import("./gateway.server");
      const out = await generateStructured(planOutput, PLAN_INSTRUCTIONS, buildPlanPrompt(data));
      const plan = normalizePlan(out.tasks);
      if (!plan) throw new AiError("A IA retornou um plano incompleto. Tente gerar novamente.", 500);
      return plan;
    }),
  );

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        diagnosis: diagnosisSchema,
        format: z.enum(["post", "video", "story"]),
        product: z.string().min(1).max(150),
        audience: z.string().min(1).max(500),
        objective: z.string().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<AiResult<string>> =>
    run(async () => {
      const { generateStructured } = await import("./gateway.server");
      const out = await generateStructured(
        z.object({ content: z.string() }),
        CONTENT_INSTRUCTIONS,
        buildContentPrompt(data),
      );
      return out.content.trim();
    }),
  );
