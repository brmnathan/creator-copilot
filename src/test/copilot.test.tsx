import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { completion, demoContent, tasks } from "@/features/copilot/model";
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
  it("uses the supplied product and audience in each demo format", () => {
    for (const format of ["post", "video", "story"] as const) {
      const content = demoContent(
        format,
        "Protetor solar",
        "Pessoas que praticam esportes",
        "Apresentar o produto",
      );
      expect(content).toContain("Protetor solar");
      expect(content).toContain("pessoas que praticam esportes");
      expect(content).toContain("Apresentar o produto");
    }
    expect(demoContent("video", "Produto", "Público", "Objetivo")).toContain("Cena 3");
    expect(demoContent("story", "Produto", "Público", "Objetivo")).toContain("Story 3");
  });
});
