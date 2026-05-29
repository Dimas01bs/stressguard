import { formatDate, getStressTone } from "../lib/formatters";
import { MeditationIllustration } from "./Illustrations";

export function HeroSection({ health, user, latestPrediction, onPrimaryClick }) {
  const latestTone = latestPrediction
    ? getStressTone(latestPrediction.stressLevel)
    : "low";
  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "teman";

  return (
    <section className="phone-card hero-phone" aria-labelledby="hero-title">
      <div className="hero-copy">
        <span className="hero-overline">Selamat datang</span>
        <h1 id="hero-title">Halo, {displayName}</h1>
        <p>
          Pantau ringkasan stres dan mulai asesmen tidur hari ini dari satu
          ruang kerja yang lebih tenang.
        </p>
      </div>

      <div className="hero-figure">
        <MeditationIllustration />
      </div>

      <div className="hero-floating-stack">
        <div className="floating-chip">
          <span>Connection</span>
          <strong>{health.online ? "Ready" : "Waiting"}</strong>
        </div>
        <div className={`floating-chip tone-${latestTone}`}>
          <span>Latest insight</span>
          <strong>
            {latestPrediction
              ? `${latestPrediction.stressLevel} • ${latestPrediction.stressScore}%`
              : "No data yet"}
          </strong>
          {latestPrediction ? (
            <>
              <small>{formatDate(latestPrediction.sleepDate)}</small>

              <small>Tidur {latestPrediction.sleepHours} jam</small>
            </>
          ) : null}
        </div>
      </div>

      <div className="hero-footer">
        <button type="button" className="hero-play" onClick={onPrimaryClick}>
          Mulai asesmen
        </button>
      </div>
    </section>
  );
}
