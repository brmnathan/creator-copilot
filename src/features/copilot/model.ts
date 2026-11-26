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
export type ContentFormat = string;
export type FormatKind =
  | "video"
  | "long-video"
  | "post"
  | "story"
  | "carousel"
  | "caption"
  | "message"
  | "status"
  | "community";
export type FormatOption = { id: string; label: string; kind: FormatKind; rule: string };
export const platforms = ["Instagram", "TikTok", "YouTube", "Facebook", "WhatsApp"] as const;
const R = {
  feed: "Legenda com gancho na primeira linha, corpo curto e escaneável, CTA e divulgação de afiliado.",
  reels:
    "Roteiro de vídeo vertical de até 60s: cenas numeradas com tempo, fala e o que mostrar; gancho nos 3 primeiros segundos; CTA final; divulgação de afiliado (falada e na legenda).",
  stories:
    "Sequência de 3 a 5 telas: texto de cada tela, sugestão de interação (enquete, caixa de perguntas), CTA e divulgação de afiliado.",
  shorts:
    "Roteiro de Short vertical de até 60s: gancho imediato, cenas com tempo, fala e o que mostrar, CTA para o link na descrição/comentário fixado e divulgação de afiliado.",
  long: "Roteiro de vídeo longo (5–10 min): título sugerido, abertura, tópicos com tempo aproximado, momento natural de apresentar o produto, CTA, descrição com divulgação de afiliado.",
  community:
    "Post da comunidade do YouTube: texto curto e conversacional, de preferência com uma enquete (pergunta + opções), CTA e divulgação de afiliado.",
  carousel:
    "Carrossel de fotos do TikTok: texto de cada imagem (4 a 7), legenda final com CTA e divulgação de afiliado.",
  caption:
    "Legenda para TikTok: curta, com gancho, CTA para o link e divulgação de afiliado, mais 3 a 5 hashtags relevantes ao nicho.",
  fbPost:
    "Publicação no Facebook: texto conversacional, um pouco mais longo que no Instagram, pergunta para gerar comentários, CTA e divulgação de afiliado.",
  wppMsg:
    "Mensagem para lista de transmissão/grupo do WhatsApp: tom pessoal, curta, sem parecer spam, CTA claro com o link e divulgação de afiliado.",
  wppStatus:
    "Sequência de 3 status do WhatsApp: texto de cada status, convite para responder, CTA e divulgação de afiliado.",
};
export const platformFormats: Record<string, FormatOption[]> = {
  Instagram: [
    { id: "ig-feed", label: "Post de feed", kind: "post", rule: R.feed },
    { id: "ig-reels", label: "Reels", kind: "video", rule: R.reels },
    { id: "ig-stories", label: "Stories", kind: "story", rule: R.stories },
  ],
  YouTube: [
    { id: "yt-shorts", label: "Shorts", kind: "video", rule: R.shorts },
    { id: "yt-long", label: "Vídeo longo", kind: "long-video", rule: R.long },
    { id: "yt-community", label: "Post da comunidade", kind: "community", rule: R.community },
  ],
  TikTok: [
    {
      id: "tt-video",
      label: "Vídeo curto",
      kind: "video",
      rule: R.reels.replace("vídeo vertical", "TikTok"),
    },
    { id: "tt-carousel", label: "Carrossel", kind: "carousel", rule: R.carousel },
    { id: "tt-caption", label: "Legenda", kind: "caption", rule: R.caption },
  ],
  Facebook: [
    { id: "fb-post", label: "Publicação", kind: "post", rule: R.fbPost },
    { id: "fb-reels", label: "Reels", kind: "video", rule: R.reels },
    { id: "fb-stories", label: "Stories", kind: "story", rule: R.stories },
  ],
  WhatsApp: [
    { id: "wa-message", label: "Mensagem para lista", kind: "message", rule: R.wppMsg },
    { id: "wa-status", label: "Status", kind: "status", rule: R.wppStatus },
  ],
};
export function formatsFor(platform: string): FormatOption[] {
  return platformFormats[platform] ?? platformFormats["Instagram"]!;
}
export function findFormat(platform: string, id: string): FormatOption {
  const list = formatsFor(platform);
  return list.find((f) => f.id === id) ?? list[0]!;
}
/** Picks the platform format that best matches a plan task. */
export function suggestFormat(task: PlanTask, platform: string): ContentFormat {
  const list = formatsFor(platform);
  const text = `${task.format ?? ""} ${task.title}`.toLocaleLowerCase("pt-BR");
  const byLabel = list.find((f) => text.includes(f.label.toLocaleLowerCase("pt-BR")));
  if (byLabel) return byLabel.id;
  const kind: FormatKind | null = /(longo)/.test(text)
    ? "long-video"
    : /(v[ií]deo|reels|shorts|roteiro)/.test(text)
      ? "video"
      : /(stor|status)/.test(text)
        ? "story"
        : null;
  return (kind && list.find((f) => f.kind === kind)?.id) || list[0]!.id;
}
/** Fields whose change makes an AI plan outdated. */
const planFields = ["niche", "platform", "experience", "difficulty", "product", "goal"] as const;
export function planOutdated(basis: Diagnosis | null, current: Diagnosis) {
  if (!basis) return false;
  return planFields.some(
    (key) =>
      basis[key].trim().toLocaleLowerCase("pt-BR") !==
      current[key].trim().toLocaleLowerCase("pt-BR"),
  );
}
export const emptyDiagnosis: Diagnosis = {
  name: "",
  niche: "Beleza e autocuidado",
  platform: "Instagram",
  followers: "",
  experience: "Iniciante",
  difficulty: "Não sei o que postar",
  product: "",
  goal: "Fazer minha primeira venda",
};
export const LINK_PLACEHOLDER = "[SEU LINK YOUSHOP]";
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
export const CONTENT_INSTRUCTIONS: string = `Você escreve conteúdo para criadores afiliados em português do Brasil, com tom próximo e honesto.
Regras obrigatórias:
- Não invente especificações, benefícios, preços, ingredientes, depoimentos ou resultados de vendas. Fale do produto apenas com o que foi informado; quando precisar, peça ao criador para confirmar detalhes entre [colchetes].
- Inclua uma chamada para ação adequada à rede social.
- Inclua uma divulgação transparente de link de afiliado.
- Sempre escreva o marcador ${LINK_PLACEHOLDER} pelo menos uma vez no texto (na chamada para ação, descrição ou legenda), exatamente assim, (o criador vai substituí-lo pelo link de rastreamento da YouShop).
- Não invente garantias, preços, depoimentos, avaliações ou resultados de vendas.
- Respeite as características do formato e da rede social informada.
- Hashtags apenas se fizerem sentido na rede e no nicho informados.
- Texto pronto para copiar, sem markdown (sem ** ou #títulos). Use quebras de linha.`;
export function buildPlanPrompt(d: DiagnosisInput) {
  return `Perfil do criador:\n${profile(d)}\nFormatos disponíveis em ${d.platform}: ${formatsFor(
    d.platform,
  )
    .map((f) => f.label)
    .join(
      ", ",
    )}\n\nGere o plano de ação personalizado. No campo de formato, use um desses formatos.`;
}
export function buildContentPrompt(input: {
  diagnosis: DiagnosisInput;
  format: ContentFormat;
  platform: string;
  product: string;
  audience: string;
  objective: string;
}) {
  return `Perfil do criador:\n${profile(input.diagnosis)}\n\nRede social desta publicação: ${input.platform}\nFormato: ${findFormat(input.platform, input.format).label} (${input.platform}).\n${findFormat(input.platform, input.format).rule}\nProduto a promover: ${input.product}\nPúblico: ${input.audience}\nObjetivo do conteúdo: ${input.objective}\n\nEscreva o conteúdo no campo "content".`;
}
