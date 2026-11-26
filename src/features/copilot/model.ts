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
export const tasks = [
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
export function completion(ids: string[]) {
  const count = tasks.filter((task) => ids.includes(task.id)).length;
  return { count, total: tasks.length, percent: Math.round((count / tasks.length) * 100) };
}
export type ContentFormat = "post" | "video" | "story";
export function demoContent(
  format: ContentFormat,
  product: string,
  audience: string,
  difficulty: string,
) {
  const context = `Para ${audience.toLocaleLowerCase("pt-BR")}, um cuidado simples pode fazer a diferença. Conheça ${product}: uma opção para incluir na sua rotina com mais intenção.`;
  if (format === "video")
    return `ROTEIRO · VÍDEO CURTO\n\nCena 1 — Conexão (0–5s)\n“Você também fica em dúvida sobre por onde começar?”\n\nCena 2 — Apresentação (5–20s)\nMostre ${product} de perto.\n“${context}”\n\nCena 3 — Convite (20–30s)\n“Quer saber mais? Me chama ou confira o link na bio.”\n\nContexto da criação: ${difficulty}.\n\nTransparência: informe que o link é de afiliado. Verifique os benefícios reais antes de publicar.`;
  if (format === "story")
    return `SEQUÊNCIA · 3 STORIES\n\nStory 1 — Converse\n“Qual é sua maior dúvida na hora de escolher um produto?”\nUse uma caixinha de perguntas.\n\nStory 2 — Apresente\n${context}\nMostre o produto e um benefício verificado.\n\nStory 3 — Convide\n“Se fizer sentido para você, veja os detalhes no meu link 💚”\nIdentifique o link como afiliado.\n\nContexto da criação: ${difficulty}.`;
  return `Uma rotina melhor começa com escolhas que fazem sentido para você. 🌿\n\n${context}\n\nAntes de comprar, conheça os detalhes, confira os ingredientes e escolha o que combina com suas necessidades.\n\nQuer conhecer melhor? Me conta sua dúvida nos comentários ou acesse o link da bio. 💚\n\nEste é um link de afiliado: posso receber uma comissão, sem custo extra para você.\n\n#Autocuidado #DicasDeBeleza #RotinaConsciente\n\nContexto da criação: ${difficulty}.`;
}
