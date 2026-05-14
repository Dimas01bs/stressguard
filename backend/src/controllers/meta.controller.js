function getFormMeta(req, res) {
  res.json({
    success: true,
    data: {
      fields: [
        {
          name: "sleepDate",
          type: "date",
          required: true
        },
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
    }
  });
}

module.exports = { getFormMeta };
