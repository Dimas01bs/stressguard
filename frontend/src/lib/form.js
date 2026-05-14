export const fallbackFormMeta = {
  fields: [
    { name: "sleepDate", label: "Tanggal Tidur", type: "date", required: true },
    {
      name: "sleepDurationHours",
      label: "Durasi Tidur (jam)",
      type: "number",
      required: true,
      min: 0,
      max: 24,
      step: 0.5
    },
    {
      name: "sleepQuality",
      label: "Kualitas Tidur",
      type: "range",
      required: true,
      min: 1,
      max: 10
    },
    {
      name: "bedtimeConsistency",
      label: "Konsistensi Jam Tidur",
      type: "range",
      required: true,
      min: 1,
      max: 10
    },
    {
      name: "awakeningsCount",
      label: "Frekuensi Terbangun",
      type: "number",
      required: true,
      min: 0,
      max: 10
    },
    {
      name: "daytimeFatigue",
      label: "Kelelahan Siang Hari",
      type: "range",
      required: true,
      min: 1,
      max: 10
    },
    {
      name: "screenTimeBeforeBedMinutes",
      label: "Screen Time Sebelum Tidur (menit)",
      type: "number",
      required: true,
      min: 0,
      max: 300
    },
    {
      name: "caffeineIntakeCups",
      label: "Konsumsi Kafein (cangkir)",
      type: "number",
      required: true,
      min: 0,
      max: 10
    },
    {
      name: "sleepLatencyMinutes",
      label: "Waktu Mulai Tidur (menit)",
      type: "number",
      required: true,
      min: 0,
      max: 180
    },
    {
      name: "notes",
      label: "Catatan",
      type: "textarea",
      required: false,
      maxLength: 500
    }
  ],
  stressLevels: ["Rendah", "Sedang", "Tinggi"]
};

const fieldDefaults = {
  sleepDurationHours: 7.5,
  sleepQuality: 7,
  bedtimeConsistency: 7,
  awakeningsCount: 1,
  daytimeFatigue: 4,
  screenTimeBeforeBedMinutes: 45,
  caffeineIntakeCups: 1,
  sleepLatencyMinutes: 20,
  notes: ""
};

export function createInitialFormValues(fields = fallbackFormMeta.fields) {
  const values = {};

  for (const field of fields) {
    if (field.name === "sleepDate") {
      values[field.name] = new Date().toISOString().slice(0, 10);
      continue;
    }

    if (field.type === "textarea") {
      values[field.name] = "";
      continue;
    }

    values[field.name] =
      fieldDefaults[field.name] ??
      (typeof field.min === "number" && typeof field.max === "number"
        ? Number(((field.min + field.max) / 2).toFixed(1))
        : "");
  }

  return values;
}

export function mergeFormMeta(meta) {
  const fallbackFieldMap = Object.fromEntries(
    fallbackFormMeta.fields.map((field) => [field.name, field])
  );

  return {
    ...fallbackFormMeta,
    ...meta,
    fields: (meta?.fields || fallbackFormMeta.fields).map((field) => ({
      ...fallbackFieldMap[field.name],
      ...field
    }))
  };
}

export function validateForm(values, fields = fallbackFormMeta.fields) {
  const errors = {};

  for (const field of fields) {
    const value = values[field.name];

    if (field.required && (value === "" || value === null || value === undefined)) {
      errors[field.name] = "Field ini wajib diisi.";
      continue;
    }

    if (field.type === "date" && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errors[field.name] = "Gunakan format tanggal YYYY-MM-DD.";
      continue;
    }

    if (field.type === "number" || field.type === "range") {
      if (Number.isNaN(Number(value))) {
        errors[field.name] = "Masukkan angka yang valid.";
        continue;
      }

      const numericValue = Number(value);

      if (typeof field.min === "number" && numericValue < field.min) {
        errors[field.name] = `Nilai minimum adalah ${field.min}.`;
      } else if (typeof field.max === "number" && numericValue > field.max) {
        errors[field.name] = `Nilai maksimum adalah ${field.max}.`;
      }
    }

    if (field.type === "textarea" && value && field.maxLength && value.length > field.maxLength) {
      errors[field.name] = `Maksimal ${field.maxLength} karakter.`;
    }
  }

  return errors;
}

export function normalizePayload(values, fields = fallbackFormMeta.fields) {
  const payload = {};

  for (const field of fields) {
    const value = values[field.name];

    if (field.type === "number" || field.type === "range") {
      payload[field.name] = Number(value);
    } else if (field.type === "textarea") {
      payload[field.name] = value?.trim() ? value.trim() : undefined;
    } else {
      payload[field.name] = value;
    }
  }

  return payload;
}
