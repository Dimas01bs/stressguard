import {
  formatConfidence,
  formatDate,
  getScoreLabel,
  getStressCopy,
  getStressTone
} from "../lib/formatters";
import { BrainIllustration } from "./Illustrations";

function renderRecommendation(item) {
  if (typeof item !== "string") {
    return item;
  }

  return (
    <div className="recommendation-content">
      {item
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== "---")
        .map((line, index) => {
          const normalizedLine = line
            .replace(/\*\*\*/g, "**")
            .replace(/^#{1,6}\s*/, "");
          const headingMatch = normalizedLine.match(
            /^\*\*(\d+\.\s*.+?)\*\*$/,
          );

          if (headingMatch) {
            return (
              <h4 key={`${normalizedLine}-${index}`}>
                {headingMatch[1]}
              </h4>
            );
          }

          return (
            <p key={`${normalizedLine}-${index}`}>
              {renderInlineMarkdown(normalizedLine)}
            </p>
          );
        })}
    </div>
  );
}

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

export function PredictionResult({ result }) {
  if (!result) {
    return (
      <section className="phone-card result-phone result-empty">
        <span className="result-brand">mindcare</span>

        <div className="result-figure">
          <BrainIllustration tone="low" />
        </div>

        <div className="result-copy">
          <h2>Your mental health matters</h2>
          <p>
            Hasil analisis akan muncul di kartu ini setelah asesmen pertama
            dikirim ke backend.
          </p>
        </div>

        <a href="#assessment" className="result-cta">
          Let&apos;s start now
        </a>
      </section>
    );
  }

  const tone = getStressTone(result.stressLevel);
  const copy = getStressCopy(result.stressLevel);

  return (
    <section
      className={`phone-card result-phone tone-${tone}`}
      aria-labelledby="result-title"
    >
      <span className="result-brand">mindcare</span>

      <div className="result-figure">
        <BrainIllustration tone={tone} />
      </div>

      <div className="result-copy">
        <span className="result-overline">
          {copy.eyebrow}
        </span>

        <h2 id="result-title">
          {result.stressLevel} for {formatDate(result.sleepDate)}
        </h2>

        <p>{copy.description}</p>
      </div>

      <div className="result-tag-row">
        <span className="result-tag">
          Score {result.stressScore}
        </span>

        <span className="result-tag">
          {getScoreLabel(result.stressScore)}
        </span>

        <span className="result-tag">
          Confidence {formatConfidence(result.confidence)}
        </span>
      </div>

      <div className="result-card-stack">
        <div className="result-mini-card">
          <span>Model</span>
          <strong>
            {result.modelProvider} / {result.modelVersion}
          </strong>
        </div>

        <div className="result-mini-card">
          <span>Input</span>
          <strong>
            Tidur {result.sleepHours} jam · Kualitas {result.sleepQualityScore}/10
          </strong>
        </div>

        <div className="result-mini-card">
          <span>Screen time</span>
          <strong>
            {result.dailyScreenTimeHours} jam / hari · HP sebelum tidur{" "}
            {result.phoneUsageBeforeSleepMinutes} menit
          </strong>
        </div>

        <div className="result-mini-card">
          <span>Catatan</span>
          <strong>
            {result.notes || "Belum ada catatan tambahan."}
          </strong>
        </div>
      </div>

      <div className="result-recommendations">
        <h3>Rekomendasi Kesehatan</h3>

        {result.recommendations && result.recommendations.length > 0 ? (
          result.recommendations.map((item, index) => (
            <div key={index} className="recommendation-card">
              {renderRecommendation(item)}
            </div>
          ))
        ) : (
          <p>Rekomendasi sedang dipersiapkan dari AI service.</p>
        )}
      </div>

      <a href="#history" className="result-cta">
        Open journal view
      </a>
    </section>
  );
}
