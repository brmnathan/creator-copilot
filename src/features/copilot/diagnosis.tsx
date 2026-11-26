import { ArrowLeft, ArrowRight, Check, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilot } from "./store";
import { planOutdated } from "./model";
import { PageHeading } from "./shared";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
const steps = ["Sobre você", "Seu momento", "Seu objetivo"];
export function DiagnosisPage() {
  const {
    diagnosis: d,
    updateDiagnosis,
    diagnosed,
    finishDiagnosis,
    diagnosisStep: step,
    setDiagnosisStep: setStep,
    planSource,
    planBasis,
  } = useCopilot();
  const outdated = planSource === "ai" && planOutdated(planBasis, d);
  const next = () => {
    setStep(Math.min(step + 1, 2));
  };
  return (
    <>
      <PageHeading
        eyebrow="UM PLANO QUE COMEÇA COM VOCÊ"
        title="Meu diagnóstico"
        description="Conte um pouco sobre sua jornada. Vamos encontrar seu próximo passo."
      />
      <div className="form-layout">
        <section className="diagnosis-tool">
          <div className="form-stepper">
            {steps.map((name, index) => (
              <div key={name} className={index <= step ? "step-current" : ""}>
                <span>{index < step ? <Check size={15} /> : index + 1}</span>
                <strong>{name}</strong>
              </div>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (step < 2) next();
              else {
                finishDiagnosis();
                if (outdated)
                  toast.warning(
                    "Diagnóstico salvo. Seu plano atual pode precisar ser gerado de novo.",
                    {
                      description:
                        "Nada foi substituído. Gere um novo plano na página Plano de ação.",
                    },
                  );
                else toast.success("Diagnóstico salvo! Seu plano está pronto para explorar.");
              }
            }}
          >
            <div className="form-intro">
              <span className="eyebrow">ETAPA {step + 1} DE 3</span>
              <h2>{["Vamos nos conhecer?", "Onde você está hoje?", "Para onde vamos?"][step]}</h2>
              <p>
                {
                  [
                    "Sua estratégia deve combinar com você e com quem te acompanha.",
                    "Não existe ponto de partida errado. Existe o seu ponto de partida.",
                    "Escolha seu foco para dar os próximos passos com clareza.",
                  ][step]
                }
              </p>
            </div>
            {step === 0 && (
              <div className="fields">
                <label>
                  Como podemos te chamar?
                  <Input
                    required
                    value={d.name}
                    onChange={(e) => updateDiagnosis({ name: e.target.value })}
                    placeholder="Seu nome"
                    maxLength={50}
                  />
                </label>
                <label>
                  Qual é o seu nicho?
                  <select
                    value={d.niche}
                    onChange={(e) => updateDiagnosis({ niche: e.target.value })}
                  >
                    <option>Beleza e autocuidado</option>
                    <option>Moda e acessórios</option>
                    <option>Saúde e bem-estar</option>
                    <option>Casa e decoração</option>
                    <option>Tecnologia</option>
                    <option>Outro</option>
                  </select>
                </label>
                <div className="field-pair">
                  <label>
                    Sua principal rede social
                    <select
                      value={d.platform}
                      onChange={(e) => updateDiagnosis({ platform: e.target.value })}
                    >
                      <option>Instagram</option>
                      <option>TikTok</option>
                      <option>YouTube</option>
                      <option>Facebook</option>
                      <option>WhatsApp</option>
                    </select>
                  </label>
                  <label>
                    Número de seguidores
                    <Input
                      required
                      type="number"
                      min="0"
                      max="100000000"
                      value={d.followers}
                      onChange={(e) => updateDiagnosis({ followers: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="fields">
                <fieldset>
                  <legend>Qual é sua experiência como afiliado?</legend>
                  <div className="radio-options">
                    {["Iniciante", "Já crio conteúdo", "Já fiz vendas"].map((value) => (
                      <label key={value} className={d.experience === value ? "selected-radio" : ""}>
                        <input
                          type="radio"
                          name="experience"
                          value={value}
                          checked={d.experience === value}
                          onChange={() => updateDiagnosis({ experience: value })}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label>
                  Qual é sua maior dificuldade?
                  <select
                    value={d.difficulty}
                    onChange={(e) => updateDiagnosis({ difficulty: e.target.value })}
                  >
                    <option>Não sei o que postar</option>
                    <option>Tenho pouco engajamento</option>
                    <option>Não sei como apresentar o produto</option>
                    <option>Tenho receio de vender</option>
                    <option>Preciso de mais consistência</option>
                  </select>
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="fields">
                <label>
                  Qual produto você quer promover?
                  <Input
                    required
                    value={d.product}
                    onChange={(e) => updateDiagnosis({ product: e.target.value })}
                    placeholder="Ex.: nome do produto que você divulga"
                    maxLength={150}
                  />
                </label>
                <label>
                  Seu principal objetivo
                  <select
                    value={d.goal}
                    onChange={(e) => updateDiagnosis({ goal: e.target.value })}
                  >
                    <option>Fazer minha primeira venda</option>
                    <option>Criar conteúdo com consistência</option>
                    <option>Aumentar meu engajamento</option>
                    <option>Melhorar minha divulgação</option>
                  </select>
                </label>
                {diagnosed && (
                  <div className="saved-message">
                    <Check size={18} />
                    Seu diagnóstico está salvo neste navegador.
                    <Button asChild variant="link">
                      <Link to="/plano">
                        Ver meu plano
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className="form-navigation">
              <Button
                variant="outline"
                type="button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft />
                Voltar
              </Button>
              <span>{step + 1} de 3</span>
              <Button type="submit">
                {step === 2 ? "Salvar diagnóstico" : "Continuar"}
                {step === 2 ? <Check /> : <ArrowRight />}
              </Button>
            </div>
          </form>
        </section>
        <aside className="diagnosis-aside">
          <span className="aside-illustration">
            <ScanLine size={45} strokeWidth={1.3} />
            <Sparkles size={20} />
          </span>
          <h3>
            Seu jeito de criar.
            <br />
            Seu caminho para crescer.
          </h3>
          <p>Um bom plano considera seu nicho, sua experiência e o que você quer conquistar.</p>
          <div className="aside-fact">
            <Check size={16} />
            <span>Sem precisar ter milhares de seguidores</span>
          </div>
          <div className="aside-fact">
            <Check size={16} />
            <span>Passos simples e possíveis na sua rotina</span>
          </div>
          <div className="aside-disclaimer">
            <Sparkles size={16} />
            <p>
              Suas respostas são usadas pela IA para personalizar seu plano de ação e os conteúdos
              gerados. Elas ficam salvas apenas neste navegador.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
