import { useState } from "react";
import {
  Copy,
  Check,
  Video,
  Layers,
  Clapperboard,
  MonitorPlay,
  MessagesSquare,
  Images,
  Type,
  Newspaper,
  Send,
  CircleDashed,
  Sparkles,
  WandSparkles,
  LoaderCircle,
  ArrowRight,
  CircleAlert,
  RotateCcw,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateContent } from "@/lib/ai/copilot.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilot } from "./store";
import { findFormat, formatsFor, platforms, type FormatKind } from "./model";
import { PageHeading } from "./shared";
import { toast } from "sonner";
const kindIcons: Record<FormatKind, typeof Video> = {
  video: Clapperboard,
  "long-video": MonitorPlay,
  post: Newspaper,
  story: Layers,
  carousel: Images,
  caption: Type,
  community: MessagesSquare,
  message: Send,
  status: CircleDashed,
};
export function CreatorPage() {
  const {
    diagnosis,
    contentPlatform,
    setContentPlatform,
    format,
    setFormat,
    product,
    setProduct,
    audience,
    setAudience,
    result,
    setResult,
    selectedTask,
    setSelectedTask,
  } = useCopilot();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const formats = formatsFor(contentPlatform);
  const current = findFormat(contentPlatform, format);
  const CurrentIcon = kindIcons[current.kind];
  const callAi = useServerFn(generateContent);
  const generate = async () => {
    if (!product.trim() || !audience.trim() || !selectedTask.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await callAi({
        data: {
          diagnosis,
          format: current.id,
          platform: contentPlatform,
          product: product.trim(),
          audience: audience.trim(),
          objective: selectedTask.trim(),
        },
      });
      if (res.ok) setResult(res.data);
      else setError(res.error);
    } catch {
      setError("Não foi possível falar com a IA agora. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Conteúdo copiado!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto para copiar manualmente.");
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="MENOS PÁGINA EM BRANCO, MAIS CONEXÃO"
        title="Sua próxima ideia começa aqui."
        description={`Dê contexto, escolha um formato e gere um conteúdo com IA para a rede que preferir.`}
      />
      <div className="creator-layout">
        <section className="creator-tool">
          <div className="tool-heading">
            <span className="summary-icon tone-mint">
              <WandSparkles size={22} />
            </span>
            <div>
              <h2>Criador de conteúdo</h2>
              <p>Uma ideia com o seu contexto.</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generate();
            }}
          >
            <div className="fields mb-6">
              <label>
                Onde você vai publicar?
                <select
                  value={contentPlatform}
                  onChange={(e) => setContentPlatform(e.target.value)}
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                      {p === diagnosis.platform ? " (rede principal)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset>
              <legend>O que vamos criar?</legend>
              <div className="format-options" role="group" aria-label="Formato de conteúdo">
                {formats.map((item) => {
                  const Icon = kindIcons[item.kind];
                  return (
                    <Button
                      type="button"
                      variant="format"
                      className={current.id === item.id ? "format-selected" : ""}
                      key={item.id}
                      onClick={() => setFormat(item.id)}
                      aria-pressed={current.id === item.id}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                      {current.id === item.id && <Check size={13} />}
                    </Button>
                  );
                })}
              </div>
            </fieldset>
            <div className="fields">
              <label>
                Produto que você quer promover
                <Input
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  maxLength={150}
                  placeholder="Nome do produto"
                />
              </label>
              <label>
                Para quem é esse conteúdo?
                <textarea
                  required
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Descreva seu público e suas necessidades"
                />
              </label>
              <label>
                Objetivo do conteúdo
                <Input
                  required
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  maxLength={200}
                />
              </label>
            </div>
            <div className="demo-notice">
              <Sparkles size={17} />
              <p>
                <strong>Gerado por IA</strong>O texto usa seu diagnóstico e o contexto acima. A IA
                não inventa dados do produto e marca o link como [SEU LINK YOUSHOP]: troque pelo seu
                link antes de publicar.
              </p>
            </div>
            <Button type="submit" className="generate-button" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
              {loading ? "Gerando com IA..." : "Gerar conteúdo com IA"}
              {!loading && <ArrowRight />}
            </Button>
          </form>
        </section>
        <section className="result-tool">
          <div className="result-heading">
            <h2>Seu conteúdo</h2>
            <span className="sample-label">GERADO POR IA</span>
          </div>
          {loading ? (
            <div className="result-empty" aria-live="polite">
              <LoaderCircle size={36} className="animate-spin" />
              <h3>Organizando suas ideias...</h3>
              <p>A IA está escrevendo seu conteúdo.</p>
            </div>
          ) : error ? (
            <div className="result-empty" role="alert">
              <CircleAlert size={36} />
              <h3>Não conseguimos gerar seu conteúdo</h3>
              <p>{error}</p>
              <Button variant="outline" onClick={generate}>
                <RotateCcw />
                Tentar novamente
              </Button>
            </div>
          ) : result ? (
            <>
              <div className="result-meta">
                <span>
                  <CurrentIcon size={16} />
                  {current.label} · {contentPlatform}
                </span>
                <Button size="sm" variant="outline" onClick={copy}>
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
              <div className="generated-text" aria-live="polite">
                {result}
              </div>
              <div className="result-footer">
                <Check size={15} />
                <p>Revise o texto e confirme as informações do produto antes de publicar.</p>
              </div>
            </>
          ) : (
            <div className="result-empty">
              <span className="empty-icon">
                <WandSparkles size={35} strokeWidth={1.3} />
              </span>
              <h3>Um espaço para sua próxima ideia</h3>
              <p>
                Seu post, roteiro ou sequência de stories
                <br />
                vai aparecer aqui.
              </p>
              <span className="empty-caption">SEU CONTEXTO + UM POUCO DE INSPIRAÇÃO</span>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
