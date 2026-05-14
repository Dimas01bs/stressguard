const { env } = require("../config/env");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalize(value, min, max) {
  return clamp((value - min) / (max - min), 0, 1);
}

function scoreSleepDuration(hours) {
  if (hours >= 7 && hours <= 9) {
    return 0;
  }

  if (hours < 7) {
    return normalize(7 - hours, 0, 4);
  }

  return normalize(hours - 9, 0, 3);
}

function buildRecommendations(input, stressLevel) {
  const recommendations = [];

  if (input.screenTimeBeforeBedMinutes > 60) {
    recommendations.push("Kurangi screen time minimal 30 menit sebelum tidur.");
  }

  if (input.caffeineIntakeCups >= 3) {
    recommendations.push("Batasi konsumsi kafein setelah pukul 14.00.");
  }

  if (input.bedtimeConsistency <= 5) {
    recommendations.push("Usahakan jam tidur dan bangun tetap konsisten setiap hari.");
  }

  if (input.sleepLatencyMinutes >= 30 || input.awakeningsCount >= 3) {
    recommendations.push(
      "Pertimbangkan rutinitas relaksasi ringan sebelum tidur."
    );
  }

  if (input.daytimeFatigue >= 7) {
    recommendations.push("Kurangi aktivitas berat saat malam dan evaluasi kualitas istirahat.");
  }

  if (stressLevel === "Tinggi") {
    recommendations.push("Jika keluhan menetap, konsultasikan dengan tenaga kesehatan profesional.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Pertahankan pola tidur yang sudah baik dan lakukan pemantauan berkala.");
  }

  return recommendations;
}

function heuristicPrediction(input) {
  const components = {
    sleepDuration: scoreSleepDuration(input.sleepDurationHours) * 0.2,
    sleepQuality: normalize(10 - input.sleepQuality, 0, 9) * 0.2,
    bedtimeConsistency: normalize(10 - input.bedtimeConsistency, 0, 9) * 0.15,
    awakenings: normalize(input.awakeningsCount, 0, 6) * 0.1,
    daytimeFatigue: normalize(input.daytimeFatigue, 1, 10) * 0.15,
    screenTime: normalize(input.screenTimeBeforeBedMinutes, 0, 180) * 0.1,
    caffeine: normalize(input.caffeineIntakeCups, 0, 5) * 0.05,
    sleepLatency: normalize(input.sleepLatencyMinutes, 0, 60) * 0.05
  };

  const rawScore = Object.values(components).reduce((sum, value) => sum + value, 0);
  const stressScore = Math.round(clamp(rawScore * 100, 0, 100));

  let stressLevel = "Rendah";
  if (stressScore >= 65) {
    stressLevel = "Tinggi";
  } else if (stressScore >= 35) {
    stressLevel = "Sedang";
  }

  const nearestThreshold = Math.min(
    Math.abs(stressScore - 35),
    Math.abs(stressScore - 65)
  );
  const confidence = Number(clamp(0.65 + nearestThreshold / 100, 0.65, 0.96).toFixed(2));

  return {
    stressScore,
    stressLevel,
    confidence,
    recommendations: buildRecommendations(input, stressLevel),
    modelProvider: env.modelProvider,
    modelVersion: env.modelVersion
  };
}

async function generatePrediction(input) {
  if (env.modelProvider !== "heuristic") {
    throw new Error(
      `Unsupported MODEL_PROVIDER "${env.modelProvider}". Implement model adapter before using it.`
    );
  }

  return heuristicPrediction(input);
}

module.exports = {
  generatePrediction
};
