import { useState } from "react";
import {
  Copy,
  Check,
  Instagram,
  Video,
  Layers,
  Sparkles,
  WandSparkles,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilot } from "./store";
import { demoContent, type ContentFormat } from "./model";
import { PageHeading } from "./shared";
import { toast } from "sonner";
const formats: { id: ContentFormat; name: string; icon: typeof Instagram }[] = [
  { id: "post", name: "Post para Instagram", icon: Instagram },
  { id: "video", name: "Vídeo curto", icon: Video },
  { id: "story", name: "Stories", icon: Layers },
];
export function CreatorPage() {
  const {
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
  const generate = () => {
    setLoading(true);
    setResult("");
    window.setTimeout(() => {
      setResult(demoContent(format, product.trim(), audience.trim(), selectedTask));
      setLoading(false);
    }, 650);
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
        description="Dê contexto, escolha um formato e explore um exemplo de conteúdo."
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
            <fieldset>
              <legend>O que vamos criar?</legend>
              <div className="format-options" role="group" aria-label="Formato de conteúdo">
                {formats.map((item) => (
                  <Button
                    type="button"
                    variant="format"
                    className={format === item.id ? "format-selected" : ""}
                    key={item.id}
                    onClick={() => setFormat(item.id)}
                    aria-pressed={format === item.id}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                    {format === item.id && <Check size={13} />}
                  </Button>
                ))}
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
                <strong>Conteúdo demonstrativo</strong>Exemplos montados com modelos prontos, não
                por uma IA.
              </p>
            </div>
            <Button type="submit" className="generate-button" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
              {loading ? "Preparando seu exemplo..." : "Gerar exemplo de conteúdo"}
              {!loading && <ArrowRight />}
            </Button>
          </form>
        </section>
        <section className="result-tool">
          <div className="result-heading">
            <h2>Seu conteúdo</h2>
            <span className="sample-label">PRÉVIA DEMONSTRATIVA</span>
          </div>
          {loading ? (
            <div className="result-empty" aria-live="polite">
              <LoaderCircle size={36} className="animate-spin" />
              <h3>Organizando suas ideias...</h3>
              <p>Seu exemplo de conteúdo está sendo preparado.</p>
            </div>
          ) : result ? (
            <>
              <div className="result-meta">
                <span>
                  <Instagram size={16} />
                  Exemplo para sua próxima publicação
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
                Seu exemplo de post, roteiro ou story
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
