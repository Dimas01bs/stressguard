import {
  createInitialFormValues,
  fallbackFormMeta,
  normalizePayload,
  validateForm
} from "../lib/form";

describe("form helpers", () => {
  test("creates sensible defaults for all known fields", () => {
    const values = createInitialFormValues(fallbackFormMeta.fields);

    expect(values.sleepDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(values.sleepDurationHours).toBe(7.5);
    expect(values.sleepQuality).toBe(7);
    expect(values.notes).toBe("");
  });

  test("returns validation errors for invalid values", () => {
    const errors = validateForm(
      {
        sleepDate: "14-05-2026",
        sleepDurationHours: -1,
        sleepQuality: 0,
        bedtimeConsistency: 5,
        awakeningsCount: 0,
        daytimeFatigue: 4,
        screenTimeBeforeBedMinutes: 30,
        caffeineIntakeCups: 1,
        sleepLatencyMinutes: 20,
        notes: ""
      },
      fallbackFormMeta.fields
    );

    expect(errors.sleepDate).toBeDefined();
    expect(errors.sleepDurationHours).toBeDefined();
    expect(errors.sleepQuality).toBeDefined();
  });

  test("normalizes payload values before sending to backend", () => {
    const payload = normalizePayload(
      {
        sleepDate: "2026-05-14",
        sleepDurationHours: "6.5",
        sleepQuality: "4",
        bedtimeConsistency: "3",
        awakeningsCount: "2",
        daytimeFatigue: "8",
        screenTimeBeforeBedMinutes: "120",
        caffeineIntakeCups: "3",
        sleepLatencyMinutes: "45",
        notes: "  Sulit tidur  "
      },
      fallbackFormMeta.fields
    );

    expect(payload.sleepDurationHours).toBe(6.5);
    expect(payload.sleepQuality).toBe(4);
    expect(payload.notes).toBe("Sulit tidur");
  });
});
