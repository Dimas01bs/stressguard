const strokeProps = {
  stroke: "#171717",
  strokeWidth: 4,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export function MeditationIllustration() {
  return (
    <svg
      className="character-illustration"
      viewBox="0 0 320 300"
      role="img"
      aria-label="Ilustrasi meditasi"
    >
      <ellipse cx="160" cy="258" rx="86" ry="20" fill="#b7ddf4" opacity="0.6" />
      <ellipse cx="160" cy="160" rx="108" ry="100" fill="#bcecff" opacity="0.55" />
      <path
        d="M112 86c6-24 28-42 58-42 32 0 58 20 64 48 16 0 28 12 28 28 0 18-14 32-32 32H110c-26 0-42-24-34-48 5-14 19-18 36-18z"
        fill="#5a9dd6"
        {...strokeProps}
      />
      <path
        d="M106 162c-10-6-24-3-30 8-5 10-2 23 8 30l18-10z"
        fill="#f8b4b8"
        {...strokeProps}
      />
      <path
        d="M214 162c10-6 24-3 30 8 5 10 2 23-8 30l-18-10z"
        fill="#f8b4b8"
        {...strokeProps}
      />
      <path
        d="M112 154c0-34 22-60 52-60s52 26 52 60v28c0 34-22 58-52 58s-52-24-52-58z"
        fill="#ffd6cf"
        {...strokeProps}
      />
      <path d="M146 156c-6 8-6 18 0 24" fill="none" {...strokeProps} />
      <path d="M174 156c6 8 6 18 0 24" fill="none" {...strokeProps} />
      <path d="M144 198c12 8 24 8 36 0" fill="none" {...strokeProps} />
      <path d="M130 144h18" fill="none" {...strokeProps} />
      <path d="M172 144h18" fill="none" {...strokeProps} />
      <path
        d="M124 226c12-12 28-18 40-18s28 6 40 18l-18 42h-84z"
        fill="#ff8aac"
        {...strokeProps}
      />
      <path
        d="M144 212c2 14 8 24 20 32 12-8 18-18 20-32"
        fill="#111111"
        {...strokeProps}
      />
      <path d="M146 224l18 26 18-26" fill="none" {...strokeProps} />
      <path d="M142 230l-18 38" fill="none" {...strokeProps} />
      <path d="M186 230l18 38" fill="none" {...strokeProps} />
      <path d="M144 268l-14 18" fill="none" {...strokeProps} />
      <path d="M184 268l14 18" fill="none" {...strokeProps} />
      <path d="M132 242l-24 16" fill="none" {...strokeProps} />
      <path d="M196 242l24 16" fill="none" {...strokeProps} />
      <path d="M108 258l-10 12" fill="none" {...strokeProps} />
      <path d="M220 258l10 12" fill="none" {...strokeProps} />
    </svg>
  );
}

export function BrainIllustration({ tone = "low" }) {
  const fills = {
    low: "#f4b4d3",
    medium: "#ffc984",
    high: "#ff9f9f"
  };

  return (
    <svg
      className="character-illustration"
      viewBox="0 0 320 320"
      role="img"
      aria-label="Ilustrasi otak"
    >
      <path
        d="M96 126c-10-34 10-70 44-82 12-24 42-34 68-22 26-14 58-4 72 22 26 6 44 30 44 58 0 26-16 50-40 58-8 34-38 58-74 58h-52c-36 0-66-24-74-58-22-8-36-28-36-52 0-30 20-54 48-60z"
        fill={fills[tone]}
        {...strokeProps}
      />
      <path d="M132 110c-12 12-16 28-10 42" fill="none" {...strokeProps} />
      <path d="M176 96c-14 14-18 34-10 52" fill="none" {...strokeProps} />
      <path d="M214 96c14 14 18 34 10 52" fill="none" {...strokeProps} />
      <path d="M252 112c10 12 14 26 10 40" fill="none" {...strokeProps} />
      <path d="M138 174c20 10 44 10 64 0" fill="none" {...strokeProps} />
      <path d="M198 174c18 12 38 12 56 0" fill="none" {...strokeProps} />
      <path d="M128 194c14 8 26 24 30 42" fill="none" {...strokeProps} />
      <path d="M238 194c-14 8-26 24-30 42" fill="none" {...strokeProps} />
      <path d="M116 236l-40 26" fill="none" {...strokeProps} />
      <path d="M84 250l-24-12" fill="none" {...strokeProps} />
      <path d="M204 236l40 26" fill="none" {...strokeProps} />
      <path d="M236 250l24-12" fill="none" {...strokeProps} />
      <path d="M148 246l-26 42" fill="none" {...strokeProps} />
      <path d="M182 246l26 42" fill="none" {...strokeProps} />
      <path d="M122 288h-28" fill="none" {...strokeProps} />
      <path d="M226 288h28" fill="none" {...strokeProps} />
      <path d="M164 138c10 12 10 26 0 38" fill="none" {...strokeProps} />
      <path d="M164 192c12 8 24 8 36 0" fill="none" {...strokeProps} />
    </svg>
  );
}

export function AvatarBadge() {
  return (
    <div className="avatar-badge" aria-hidden="true">
      <div className="avatar-core" />
    </div>
  );
}
