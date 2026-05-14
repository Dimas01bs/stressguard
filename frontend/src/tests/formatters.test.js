import {
  buildTrendPoints,
  formatConfidence,
  getDistributionRows,
  getStressTone
} from "../lib/formatters";

describe("formatter helpers", () => {
  test("maps stress level to tone", () => {
    expect(getStressTone("Rendah")).toBe("low");
    expect(getStressTone("Sedang")).toBe("medium");
    expect(getStressTone("Tinggi")).toBe("high");
  });

  test("formats confidence as percentage", () => {
    expect(formatConfidence(0.89)).toBe("89%");
  });

  test("builds chart points from trend data", () => {
    const points = buildTrendPoints([
      { averageStressScore: 30 },
      { averageStressScore: 60 }
    ]);

    expect(points).toContain("0,");
    expect(points).toContain("360,");
  });

  test("creates ordered distribution rows", () => {
    const rows = getDistributionRows({ Tinggi: 1, Rendah: 2, Sedang: 3 });

    expect(rows[0].level).toBe("Rendah");
    expect(rows[1].level).toBe("Sedang");
    expect(rows[2].level).toBe("Tinggi");
  });
});
