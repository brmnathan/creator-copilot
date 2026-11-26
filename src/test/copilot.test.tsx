import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  buildContentPrompt,
  completion,
  CONTENT_INSTRUCTIONS,
  initialDiagnosis,
  nextTask,
  normalizePlan,
  suggestFormat,
  tasks,
} from "@/features/copilot/model";
import { CopilotProvider, useCopilot } from "@/features/copilot/store";
describe("Creator Copilot demo behavior", () => {
  it("preserves diagnosis input when a consumer unmounts during navigation", () => {
    const { result } = renderHook(() => useCopilot(), { wrapper: CopilotProvider });
    act(() => result.current.updateDiagnosis({ name: "Camila", product: "Protetor solar" }));
    act(() => result.current.setDiagnosisStep(2));
    expect(result.current.diagnosis.name).toBe("Camila");
    expect(result.current.diagnosis.product).toBe("Protetor solar");
    expect(result.current.diagnosisStep).toBe(2);
  });
  it("task checkboxes update progress in both directions", () => {
    const { result } = renderHook(() => useCopilot(), { wrapper: CopilotProvider });
    expect(completion(result.current.completed).percent).toBe(33);
    act(() => result.current.toggleTask("post"));
    expect(completion(result.current.completed)).toEqual({ count: 3, total: 6, percent: 50 });
    act(() => result.current.toggleTask("post"));
    expect(completion(result.current.completed).count).toBe(2);
  });
  it("provides exactly three action plan steps", () => {
    expect([...new Set(tasks.map((task) => task.step))]).toEqual([1, 2, 3]);
    expect(completion(tasks.map((task) => task.id)).percent).toBe(100);
    expect(completion([]).percent).toBe(0);
  });
  it("normalizes an AI plan into six tasks, two per stage, and resets progress", () => {
    const raw = Array.from({ length: 6 }, (_, i) => ({
      step: 3 - Math.floor(i / 2),
      title: `Tarefa ${i}`,
      description: "Descrição",
      priority: "Alta" as const,
      duration: "10 min",
      format: null,
    }));
    const plan = normalizePlan(raw)!;
    expect(plan).toHaveLength(6);
    expect(plan.map((t) => t.step)).toEqual([1, 1, 2, 2, 3, 3]);
    expect(normalizePlan(raw.slice(0, 5))).toBeNull();
    const { result } = renderHook(() => useCopilot(), { wrapper: CopilotProvider });
    act(() => result.current.replacePlan(plan));
    expect(result.current.completed).toEqual([]);
    expect(nextTask(result.current.plan, result.current.completed)?.id).toBe("ai-1");
  });
  it("content prompt carries the diagnosis, platform and affiliate rules", () => {
    const prompt = buildContentPrompt({
      diagnosis: { ...initialDiagnosis, platform: "YouTube" },
      format: "video",
      product: "Protetor solar",
      audience: "Pessoas que praticam esportes",
      objective: "Apresentar o produto",
    });
    for (const part of ["YouTube", "Protetor solar", "Pessoas que praticam esportes", "Apresentar o produto"])
      expect(prompt).toContain(part);
    expect(CONTENT_INSTRUCTIONS).toContain("afiliado");
    expect(suggestFormat({ ...plan0, format: "Shorts" })).toBe("video");
  });
});
const plan0 = { id: "x", step: 1, title: "Planejar", description: "d", priority: "Alta" as const, duration: "5 min" };
