export function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateValue));
}

export function formatDateTime(dateValue) {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

export function formatConfidence(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

export function getStressTone(level) {
  if (level === "Tinggi") {
    return "high";
  }

  if (level === "Sedang") {
    return "medium";
  }

  return "low";
}

export function getStressCopy(level) {
  if (level === "Tinggi") {
    return {
      eyebrow: "Perlu perhatian lebih",
      description:
        "Pola tidur Anda memberi sinyal bahwa tubuh sedang membutuhkan pemulihan yang lebih terarah."
    };
  }

  if (level === "Sedang") {
    return {
      eyebrow: "Ada ruang untuk perbaikan",
      description:
        "Beberapa indikator tidur mulai mengarah ke tekanan sedang. Perubahan kecil bisa memberi dampak nyata."
    };
  }

  return {
    eyebrow: "Arah tidur cukup stabil",
    description:
      "Sebagian besar indikator terlihat sehat. Pertahankan ritme ini sambil memantau perubahan harian."
  };
}

export function getScoreLabel(score) {
  if (score >= 65) {
    return "Intens";
  }

  if (score >= 35) {
    return "Waspada";
  }

  return "Stabil";
}

export function buildTrendPoints(trend, width = 360, height = 160) {
  if (!trend?.length) {
    return "";
  }

  if (trend.length === 1) {
    const midpointY = height - (Number(trend[0].averageStressScore) / 100) * height;
    return `0,${midpointY} ${width},${midpointY}`;
  }

  return trend
    .map((entry, index) => {
      const x = (index / (trend.length - 1)) * width;
      const y = height - (Number(entry.averageStressScore) / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function getDistributionRows(distribution = {}) {
  return ["Rendah", "Sedang", "Tinggi"].map((level) => ({
    level,
    total: distribution[level] || 0,
    tone: getStressTone(level)
  }));
}
