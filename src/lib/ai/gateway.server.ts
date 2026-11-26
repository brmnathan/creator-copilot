import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import type { z } from "zod";

const MODEL = "openai/gpt-6-luna";
const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export class AiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    runId ??= response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
    return response;
  };
}

function friendly(status: number) {
  if (status === 429) return "Muitas solicitações em pouco tempo. Aguarde alguns segundos e tente novamente.";
  if (status === 402) return "Os créditos de IA do espaço de trabalho acabaram. Adicione créditos para continuar gerando.";
  if (status === 403) return "A geração com IA não está liberada neste espaço de trabalho no momento.";
  if (status === 401) return "A IA não está configurada corretamente. Verifique a chave do projeto.";
  if (status >= 500) return "O serviço de IA está instável agora. Tente novamente em instantes.";
  return "Não foi possível gerar com IA agora. Tente novamente.";
}

/** Streams a structured response server-side and returns the final object. */
export async function generateStructured<T>(schema: z.ZodType<T>, instructions: string, prompt: string): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError(friendly(401), 401);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch(),
  });
  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    prompt,
    maxRetries: 1,
    output: Output.object({ schema }),
    onError: ({ error }) => {
      failure = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  try {
    return (await result.output) as T;
  } catch (error) {
    const source = (failure ?? error) as { statusCode?: number };
    const status = typeof source?.statusCode === "number" ? source.statusCode : 500;
    console.error("AI gateway error", status, failure ?? error);
    throw new AiError(friendly(status), status);
  }
}
