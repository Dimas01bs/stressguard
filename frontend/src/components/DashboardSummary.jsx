import {
  formatDate,
  formatDateTime,
  getDistributionRows,
  getStressTone,
} from "../lib/formatters";

function DashboardEmpty() {
  return (
    <div className="dashboard-empty">
      <strong>Dashboard akan aktif setelah ada prediksi</strong>
      <p>
        Saat riwayat masih kosong, kartu ringkasan, distribusi, dan tren belum
        memiliki data untuk divisualisasikan.
      </p>
    </div>
  );
}

export function DashboardSummary({ summary, isLoading, error }) {
  const rows = getDistributionRows(summary?.distribution);
  const totalDistribution = rows.reduce((sum, row) => sum + row.total, 0);
  const trendEntries = buildSevenDayTrend(summary?.trend || []);
  const trendChart = buildTrendChart(trendEntries);
  const calendarDays = buildCurrentWeekDays();

  return (
    <section
      className="phone-card dashboard-phone"
      id="dashboard"
      aria-labelledby="dashboard-title"
    >
      <div className="calendar-strip" aria-hidden="true">
        {calendarDays.map((day) => (
          <div
            key={day.key}
            className={`calendar-pill ${day.isToday ? "calendar-pill-active" : ""}`}
          >
            <span>{day.label}</span>
            <strong>{day.date}</strong>
          </div>
        ))}
      </div>

      <div className="phone-top-copy">
        <span className="section-label">Physical state</span>
        <h2 id="dashboard-title">Daily balance</h2>
        <p>
          Ringkasan ini tetap real-time dari backend, hanya tampil dalam bentuk
          yang lebih mirip wellness dashboard.
        </p>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      {isLoading ? (
        <div className="loading-card">Memuat insight terbaru...</div>
      ) : !summary || summary.totalPredictions === 0 ? (
        <DashboardEmpty />
      ) : (
        <>
          <div className="dashboard-feature-grid">
            <div className="feature-card feature-card-pink">
              <span>Total check-ins</span>
              <strong>{summary.totalPredictions} sesi</strong>
            </div>
          </div>

          <div className="dashboard-body">
            <div className="distribution-card">
              <div className="distribution-header">
                <h3>Distribution</h3>
                <span>{totalDistribution} entri</span>
              </div>
              <div className="distribution-list">
                {rows.map((row) => {
                  const percentage = totalDistribution
                    ? Math.round((row.total / totalDistribution) * 100)
                    : 0;

                  return (
                    <div key={row.level} className="distribution-item">
                      <div className="distribution-topline">
                        <span>{row.level}</span>
                        <strong>{percentage}%</strong>
                      </div>
                      <div className="distribution-track">
                        <span
                          className={`distribution-fill tone-${row.tone}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="trend-card">
            <div className="distribution-header">
              <h3>Tren 7 hari terakhir</h3>
              <span>Rata-rata skor harian</span>
            </div>
            {trendEntries.length ? (
              <>
                <svg
                  className="trend-chart"
                  viewBox="0 0 360 180"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="trendStroke" x1="0" x2="1">
                      <stop offset="0%" stopColor="#fd8de5" />
                      <stop offset="100%" stopColor="#9be9ff" />
                    </linearGradient>
                    <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#fd8de5" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#9be9ff" stopOpacity="0.04" />
                    </linearGradient>
                  </defs>
                  {[36, 72, 108, 144].map((y) => (
                    <line
                      key={y}
                      x1="24"
                      x2="336"
                      y1={y}
                      y2={y}
                      className="trend-grid-line"
                    />
                  ))}
                  <polygon points={trendChart.areaPoints} className="trend-area" />
                  <polyline
                    fill="none"
                    stroke="url(#trendStroke)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trendChart.linePoints}
                  />
                  {trendChart.points.map((point, index) => (
                    <circle
                      key={`${point.x}-${point.y}-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r={point.hasData ? "6" : "4"}
                      className={`trend-point${point.hasData ? "" : " trend-point-empty"}`}
                      tabIndex="0"
                      aria-label={point.label}
                      data-tooltip={point.label}
                    >
                      <title>{point.label}</title>
                    </circle>
                  ))}
                </svg>
              </>
            ) : (
              <DashboardEmpty />
            )}
          </div>

          <div className="recent-card-board">
            <div className="distribution-header">
              <h3>Prediksi terbaru</h3>
              <span>5 entri terakhir</span>
            </div>
            <div className="recent-grid">
              {summary.recentPredictions.map((item) => (
                <article
                  key={item.id}
                  className={`recent-card tone-${getStressTone(item.stressLevel)}`}
                >
                  <div className="recent-topline">
                    <strong>{item.stressLevel}</strong>
                    <span>Skor {item.stressScore}</span>
                  </div>
                  <p>
                    Tidur {item.sleepHours} jam · Kualitas{" "}
                    {item.sleepQualityScore}/10
                  </p>

                  <p>Screen time {item.dailyScreenTimeHours} jam</p>

                  <small>{formatDateTime(item.createdAt)}</small>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function buildTrendChart(entries) {
  const width = 360;
  const height = 180;
  const paddingX = 28;
  const paddingY = 24;
  const bottomY = height - paddingY;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const points = entries.map((entry, index) => {
    const score = entry.hasData
      ? Math.max(0, Math.min(100, Number(entry.averageStressScore) || 0))
      : 0;
    const x =
      entries.length === 1
        ? width / 2
        : paddingX + (index / (entries.length - 1)) * plotWidth;
    const y = paddingY + (1 - score / 100) * plotHeight;

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      hasData: entry.hasData,
      label: entry.hasData
        ? `${formatDate(entry.sleepDate)} - Skor ${Math.round(score)}`
        : `${formatDate(entry.sleepDate)} - Tidak ada data`,
    };
  });

  const linePoints =
    points.length === 1
      ? `${paddingX},${points[0].y} ${width - paddingX},${points[0].y}`
      : points.map((point) => `${point.x},${point.y}`).join(" ");

  const areaPoints =
    points.length === 1
      ? `${paddingX},${bottomY} ${paddingX},${points[0].y} ${width - paddingX},${points[0].y} ${width - paddingX},${bottomY}`
      : `${points[0].x},${bottomY} ${linePoints} ${points[points.length - 1].x},${bottomY}`;

  return {
    areaPoints,
    linePoints,
    points,
  };
}

function buildSevenDayTrend(entries) {
  const dataByDate = new Map(
    entries.map((entry) => [
      normalizeDateKey(entry.sleepDate),
      {
        ...entry,
        hasData: true,
      },
    ]),
  );
  const endDate = entries.length
    ? parseDateKey(
        entries
          .map((entry) => normalizeDateKey(entry.sleepDate))
          .sort()
          .at(-1),
      )
    : new Date();
  const days = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - index);

    const sleepDate = toDateKey(date);
    const data = dataByDate.get(sleepDate);

    days.push(
      data || {
        sleepDate,
        averageStressScore: 0,
        hasData: false,
      },
    );
  }

  return days;
}

function normalizeDateKey(value) {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return toDateKey(new Date(value));
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildCurrentWeekDays() {
  const today = new Date();
  const startOfWeek = new Date(today);
  const mondayOffset = (today.getDay() + 6) % 7;

  startOfWeek.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    return {
      key: toDateKey(date),
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      date: date.getDate(),
      isToday: toDateKey(date) === toDateKey(today),
    };
  });
}
