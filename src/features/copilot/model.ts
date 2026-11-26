export type Diagnosis = {
  name: string;
  niche: string;
  platform: string;
  followers: string;
  experience: string;
  difficulty: string;
  product: string;
  goal: string;
};
export const initialDiagnosis: Diagnosis = {
  name: "Mariana",
  niche: "Beleza e autocuidado",
  platform: "Instagram",
  followers: "1250",
  experience: "Iniciante",
  difficulty: "Não sei o que postar",
  product: "Kit de skincare natural",
  goal: "Fazer minha primeira venda",
};
export type PlanTask = {
  id: string;
  step: number;
  title: string;
  description: string;
  priority: "Alta" | "Média";
  duration: string;
  format?: string | null;
};
export const demoTasks: PlanTask[] = [
  {
    id: "audience",
    step: 1,
    title: "Conheça seu público",
    description: "Liste as principais dúvidas e necessidades de quem acompanha você.",
    priority: "Alta",
    duration: "10 min",
  },
  {
    id: "product",
    step: 1,
    title: "Escolha seu produto foco",
    description: "Selecione um produto alinhado ao seu nicho e conheça seus benefícios.",
    priority: "Alta",
    duration: "10 min",
  },
  {
    id: "post",
    step: 2,
    title: "Crie seu primeiro post de conexão",
    description: "Mostre como seu produto resolve uma dificuldade real do seu público.",
    priority: "Alta",
    duration: "15 min",
  },
  {
    id: "stories",
    step: 2,
    title: "Compartilhe uma sequência de stories",
    description: "Apresente uma dica, o benefício do produto e um convite para conversar.",
    priority: "Média",
    duration: "15 min",
  },
  {
    id: "publish",
    step: 3,
    title: "Publique com uma chamada para ação",
    description: "Convide seu público a conhecer o produto pelo seu link de afiliado.",
    priority: "Alta",
    duration: "5 min",
  },
  {
    id: "review",
    step: 3,
    title: "Acompanhe e ajuste sua estratégia",
    description: "Observe as respostas do público e registre o que pode melhorar.",
    priority: "Média",
    duration: "10 min",
  },
];
/** @deprecated use the plan from the store; kept as the demo fallback */
export const tasks = demoTasks;
export function completion(ids: string[], list: PlanTask[] = demoTasks) {
  const count = list.filter((task) => ids.includes(task.id)).length;
  const total = list.length || 1;
  return { count, total: list.length, percent: Math.round((count / total) * 100) };
}
export function nextTask(list: PlanTask[], completed: string[]) {
  return list.find((task) => !completed.includes(task.id)) ?? null;
}
export function stepDone(list: PlanTask[], completed: string[], step: number) {
  const items = list.filter((task) => task.step === step);
  return items.length > 0 && items.every((task) => completed.includes(task.id));
}
/** Accepts raw AI tasks; returns six tasks, two per stage, or null when unusable. */
export function normalizePlan(raw: Omit<PlanTask, "id">[]): PlanTask[] | null {
  const clean = raw.filter((t) => t.title?.trim() && t.description?.trim());
  if (clean.length < 6) return null;
  const sorted = [...clean].sort((a, b) => a.step - b.step).slice(0, 6);
  return sorted.map((task, index) => ({
    id: `ai-${index + 1}`,
    step: Math.floor(index / 2) + 1,
    title: task.title.trim(),
    description: task.description.trim(),
    priority: task.priority === "Média" ? "Média" : "Alta",
    duration: task.duration.trim() || "15 min",
    format: task.format?.trim() || null,
  }));
}
export type ContentFormat = "post" | "video" | "story";
export const formatLabels: Record<ContentFormat, string> = {
  post: "Post de feed",
  video: "Vídeo curto",
  story: "Stories / sequência curta",
};
export function suggestFormat(task: PlanTask): ContentFormat {
  const text = `${task.format ?? ""} ${task.title}`.toLocaleLowerCase("pt-BR");
  if (/(v[ií]deo|reels|shorts|tiktok|roteiro)/.test(text)) return "video";
  if (/(stor|sequ[eê]ncia)/.test(text)) return "story";
  return "post";
}
type DiagnosisInput = Diagnosis;
function profile(d: DiagnosisInput) {
  return [
    `Nicho: ${d.niche}`,
    `Rede social principal: ${d.platform}`,
    `Seguidores: ${d.followers}`,
    `Nível de experiência: ${d.experience}`,
    `Principal dificuldade: ${d.difficulty}`,
    `Produto: ${d.product}`,
    `Objetivo principal: ${d.goal}`,
  ].join("\n");
}
export const PLAN_INSTRUCTIONS = `Você é um estrategista de conteúdo para criadores afiliados iniciantes. Responda sempre em português do Brasil.
Crie exatamente 6 tarefas práticas: 2 na etapa 1 (Prepare sua base), 2 na etapa 2 (Crie uma conexão) e 2 na etapa 3 (Promova e aprenda).
Adapte tudo à rede social informada: use apenas formatos que existem nela (ex.: YouTube → Shorts, vídeos longos, posts da comunidade; TikTok → vídeos curtos e lives; Instagram → feed, Reels, Stories).
Considere nicho, número de seguidores, experiência, dificuldade, produto e objetivo.
Cada tarefa: título curto (até 60 caracteres), descrição prática e específica (1–2 frases), prioridade "Alta" ou "Média", tempo estimado (ex.: "15 min") e formato de conteúdo sugerido (ou null se não se aplica).
Não invente características, preços, resultados ou depoimentos do produto.`;
export const CONTENT_INSTRUCTIONS = `Você escreve conteúdo para criadores afiliados em português do Brasil, com tom próximo e honesto.
Regras obrigatórias:
- Não invente especificações, benefícios, preços, ingredientes, depoimentos ou resultados de vendas. Fale do produto apenas com o que foi informado; quando precisar, peça ao criador para confirmar detalhes entre [colchetes].
- Inclua uma chamada para ação adequada à rede social.
- Inclua uma divulgação transparente de link de afiliado.
- Respeite as características do formato e da rede social informada.
- Hashtags apenas se fizerem sentido na rede e no nicho informados.
- Texto pronto para copiar, sem markdown (sem ** ou #títulos). Use quebras de linha.`;
export function buildPlanPrompt(d: DiagnosisInput) {
  return `Perfil do criador:\n${profile(d)}\n\nGere o plano de ação personalizado.`;
}
const formatRules: Record<ContentFormat, string> = {
  post: "Post de feed: legenda com gancho na primeira linha, corpo curto e escaneável, CTA e divulgação de afiliado.",
  video: "Roteiro de vídeo curto (até 60s): cenas numeradas com tempo, fala e o que mostrar; gancho nos 3 primeiros segundos; CTA final; divulgação de afiliado.",
  story: "Sequência de 3 a 5 stories (ou formato equivalente na rede): texto de cada tela, sugestão de figurinha/interação, CTA e divulgação de afiliado.",
};
export function buildContentPrompt(input: {
  diagnosis: DiagnosisInput;
  format: ContentFormat;
  product: string;
  audience: string;
  objective: string;
}) {
  return `Perfil do criador:\n${profile(input.diagnosis)}\n\nFormato: ${formatLabels[input.format]} para ${input.diagnosis.platform}.\n${formatRules[input.format]}\nProduto a promover: ${input.product}\nPúblico: ${input.audience}\nObjetivo do conteúdo: ${input.objective}\n\nEscreva o conteúdo no campo "content".`;
}
