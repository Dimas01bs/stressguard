const { z } = require("zod");

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Format tanggal harus YYYY-MM-DD."
});

const predictionInputSchema = z.object({
  sleepDate: dateStringSchema,
  sleepDurationHours: z.number().min(0).max(24),
  sleepQuality: z.number().int().min(1).max(10),
  bedtimeConsistency: z.number().int().min(1).max(10),
  awakeningsCount: z.number().int().min(0).max(10),
  daytimeFatigue: z.number().int().min(1).max(10),
  screenTimeBeforeBedMinutes: z.number().int().min(0).max(300),
  caffeineIntakeCups: z.number().int().min(0).max(10),
  sleepLatencyMinutes: z.number().int().min(0).max(180),
  notes: z.string().trim().max(500).optional()
});

const predictionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  stressLevel: z.enum(["Rendah", "Sedang", "Tinggi"]).optional()
});

module.exports = {
  predictionInputSchema,
  predictionQuerySchema
};
