import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type SlideId = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const TOTAL_SLIDES = 7;

// ─────────────────────────────────────────────────────────────
// Coffee Bean Background
// ─────────────────────────────────────────────────────────────
function CoffeeBeanBg() {
  const beans = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {beans.map((i) => {
        const left = 5 + ((i * 12.5) % 95);
        const delay = (i * 2.3) % 12;
        const duration = 14 + ((i * 3.7) % 10);
        const rStart = (i * 47) % 360;
        const rEnd = rStart + 180 + ((i * 23) % 120);
        const size = 6 + ((i * 3) % 8);
        const opacity = 0.04 + (i % 3) * 0.02;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: "-40px",
              width: `${size * 2}px`,
              height: `${size}px`,
              background: `oklch(0.78 0.155 75 / ${opacity})`,
              borderRadius: "50%",
              animationName: "bean-float",
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationFillMode: "both",
              ["--r-start" as string]: `${rStart}deg`,
              ["--r-end" as string]: `${rEnd}deg`,
              ["--bean-opacity" as string]: `${opacity}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 0 — Cover
// ─────────────────────────────────────────────────────────────
function CoverSlide({ onNext }: { onNext: () => void }) {
  const title = "OburugoAgroChain";
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center overflow-hidden">
      {/* Vignette overlay */}
      <div className="cover-vignette" aria-hidden="true" />

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, oklch(0.22 0.038 255 / 0.8) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div
          className="w-20 h-20 md:w-24 md:h-24 mb-2"
          style={{ animation: "fade-in-up 0.6s ease-out 0.2s both" }}
        >
          <img
            src="/assets/generated/oac-logo-transparent.dim_200x200.png"
            alt="OburugoAgroChain logo"
            className="w-full h-full object-contain drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 20px oklch(0.78 0.155 75 / 0.5))",
            }}
          />
        </div>

        {/* Animated title */}
        <h1
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tight"
          aria-label="OburugoAgroChain"
        >
          {Array.from(title).map((char, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static string, order never changes
              key={i}
              style={{
                display: "inline-block",
                animation: `letter-rise 0.5s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.045}s both`,
                color: i < 7 ? "oklch(0.78 0.155 75)" : "oklch(0.95 0.01 80)",
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Animated underline */}
        <div className="relative w-full flex justify-center">
          <div
            className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
            style={{
              animation: "underline-sweep 0.8s ease-out 1.5s both",
              width: "60%",
              maxWidth: "480px",
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="font-display text-lg sm:text-xl md:text-2xl text-foreground/80 font-medium"
          style={{ animation: "fade-in-up 0.6s ease-out 1.2s both" }}
        >
          Tokenizing Uganda's Coffee Value Chain
        </p>

        {/* Tagline */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4"
          style={{ animation: "fade-in-up 0.6s ease-out 1.5s both" }}
        >
          {["Transparent", "Voice-Enabled", "Blockchain-Powered"].map((tag) => (
            <span
              key={tag}
              className="badge-gold px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Seed round badge */}
        <div
          className="mt-4 px-6 py-3 rounded-xl text-sm sm:text-base font-semibold tracking-wide"
          style={{
            animation: "fade-in-up 0.6s ease-out 1.8s both",
            background: "oklch(0.16 0.030 255 / 0.85)",
            border: "1px solid oklch(0.78 0.155 75 / 0.35)",
          }}
        >
          <span className="text-foreground/70">Investor Briefing — </span>
          <span className="text-gold font-bold">Seed Round · $250,000</span>
        </div>

        {/* CTA */}
        <button
          type="button"
          data-ocid="cover.primary_button"
          onClick={onNext}
          className="mt-6 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            animation: "fade-in-up 0.6s ease-out 2.1s both",
            background: "oklch(0.58 0.14 148)",
            color: "oklch(0.98 0.005 80)",
            boxShadow:
              "0 0 24px oklch(0.58 0.14 148 / 0.35), 0 4px 16px oklch(0 0 0 / 0.3)",
          }}
          aria-label="View pitch deck"
        >
          View Deck →
        </button>
      </div>

      {/* Voice Ledger + ICP partnership note */}
      <div
        className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 text-xs text-foreground/40"
        style={{ animation: "fade-in-up 0.6s ease-out 2.4s both" }}
      >
        <span>Built on Internet Computer</span>
        <span className="w-px h-4 bg-foreground/20" />
        <span>Voice Ledger Partnership</span>
        <span className="w-px h-4 bg-foreground/20" />
        <span>Uganda · East Africa · Global</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 1 — The Problem
// ─────────────────────────────────────────────────────────────
function ProblemSlide() {
  const problems = [
    {
      icon: "🌿",
      stat: "3.5M+",
      label: "Smallholder farmers",
      desc: "Uganda's coffee farmers — locked out of fair, transparent markets by layers of intermediaries.",
    },
    {
      icon: "💸",
      stat: "$0.20/kg",
      label: "Farmer earnings",
      desc: "Retail sells for $10+. Middlemen capture 60–70% of the value chain — leaving farmers with cents.",
    },
    {
      icon: "📋",
      stat: "Zero",
      label: "Traceability",
      desc: "Manual, paper-based batch records lead to quality disputes, rejected shipments, and zero auditability.",
    },
    {
      icon: "🔇",
      stat: "Low",
      label: "Digital literacy",
      desc: "Most smallholder farmers cannot use smartphones or fill digital forms — blocking adoption of ag-tech.",
    },
    {
      icon: "🏦",
      stat: "0%",
      label: "Trade finance access",
      desc: "No verifiable records = no collateral = no credit. Farmers cannot grow without capital.",
    },
  ];

  return (
    <div className="flex flex-col justify-center min-h-screen px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="slide-enter">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green/80">
            Slide 01
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-green/30 to-transparent" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
          Farmers Grow the Coffee.{" "}
          <span className="text-gold">Middlemen Capture the Value.</span>
        </h2>
        <p className="text-muted-foreground text-base mb-10 max-w-2xl">
          Uganda's coffee sector generates over $1 billion annually — yet those
          who grow it see almost none of that wealth.
        </p>

        {/* Problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <div
              key={p.label}
              className="rounded-xl p-5 border flex flex-col gap-3"
              style={{
                background: "oklch(0.16 0.030 255 / 0.7)",
                borderColor: "oklch(0.26 0.035 255)",
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="font-display font-bold text-xl text-gold leading-tight">
                    {p.stat}
                  </div>
                  <div className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
                    {p.label}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}

          {/* Insight card */}
          <div
            className="rounded-xl p-5 border sm:col-span-2 lg:col-span-2 flex items-center gap-4"
            style={{
              background: "oklch(0.58 0.14 148 / 0.07)",
              borderColor: "oklch(0.58 0.14 148 / 0.25)",
            }}
          >
            <div className="text-3xl shrink-0">⚠️</div>
            <p className="text-sm sm:text-base text-foreground/85 font-medium leading-relaxed">
              These aren't separate problems — they form a compounding trap.
              Without traceability, there's no credit. Without credit, there's
              no scale. Without scale, the farmer stays trapped.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 2 — The Solution
// ─────────────────────────────────────────────────────────────
function SolutionSlide() {
  const differentiators = [
    {
      icon: "🎙️",
      title: "Voice-First Batch Creation",
      desc: "Partnership with Voice Ledger enables farmers to create batches by speaking in their local language. No smartphone literacy required.",
      badge: "Voice Ledger Partner",
    },
    {
      icon: "🔗",
      title: "Full Tokenization Protocol",
      desc: "Each batch becomes a blockchain-verified token (ERC-1155 equivalent) with reserve verification, community distribution, and QR traceability built in.",
      badge: "7-Step Protocol",
    },
    {
      icon: "📱",
      title: "End-to-End Traceability",
      desc: "Buyers, exporters, and consumers scan a QR code to verify the full chain of custody — from farm coordinates to export container.",
      badge: "QR Verified",
    },
  ];

  const steps = [
    "Batch Creation",
    "Reserve Verification",
    "Token Minting",
    "Community Distribution",
    "Inventory Management",
    "Token Redemption",
    "QR Traceability",
  ];

  return (
    <div className="flex flex-col justify-center min-h-screen px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="slide-enter">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green/80">
            Slide 02
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-green/30 to-transparent" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
          OburugoAgroChain: <span className="text-gold">Voice-to-Chain</span>{" "}
          Coffee Protocol
        </h2>
        <p className="text-muted-foreground text-base mb-8 max-w-2xl">
          A 7-step blockchain protocol on the Internet Computer that tokenizes
          real coffee batches — traceable from farm to cup.
        </p>

        {/* 3 differentiator cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {differentiators.map((d) => (
            <div
              key={d.title}
              className="rounded-xl p-5 border flex flex-col gap-3"
              style={{
                background: "oklch(0.16 0.030 255 / 0.7)",
                borderColor: "oklch(0.26 0.035 255)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{d.icon}</span>
                <span className="badge-green text-xs px-2 py-0.5 rounded-full font-semibold">
                  {d.badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-foreground">
                {d.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 7-step flow diagram */}
        <div
          className="rounded-xl p-5 border"
          style={{
            background: "oklch(0.14 0.025 255 / 0.8)",
            borderColor: "oklch(0.26 0.035 255)",
          }}
        >
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground/50 mb-4">
            Protocol Flow
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="step-flow-pill">{step}</span>
                {i < steps.length - 1 && (
                  <span className="text-gold/40 text-xs font-bold">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 3 — Market Opportunity
// ─────────────────────────────────────────────────────────────
function MarketSlide() {
  const stats = [
    {
      value: "$1.07B",
      label: "Uganda Coffee Exports (2023)",
      sub: "Africa's #2 coffee exporter. Record year.",
    },
    {
      value: "$3.2B+",
      label: "East Africa Annual Coffee Market",
      sub: "Kenya, Ethiopia, Tanzania combined addressable market.",
    },
    {
      value: "$83B",
      label: "Global Specialty Coffee Market by 2027",
      sub: "8.5% CAGR — fastest-growing segment in food commodities.",
    },
  ];

  return (
    <div className="flex flex-col justify-center min-h-screen px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="slide-enter">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green/80">
            Slide 03
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-green/30 to-transparent" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
          A <span className="text-gold">$83B Global Market</span>,{" "}
          <span className="text-foreground/80">Starting in Uganda</span>
        </h2>
        <p className="text-muted-foreground text-base mb-10 max-w-2xl">
          We're entering at the source — Uganda's booming coffee export sector —
          with a clear path to the global specialty market.
        </p>

        {/* 3 large stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl p-6 border flex flex-col gap-2 text-center"
              style={{
                background: "oklch(0.16 0.030 255 / 0.8)",
                borderColor:
                  i === 2
                    ? "oklch(0.78 0.155 75 / 0.4)"
                    : "oklch(0.26 0.035 255)",
                boxShadow:
                  i === 2 ? "0 0 32px oklch(0.78 0.155 75 / 0.06)" : "none",
              }}
            >
              <div
                className="font-display font-extrabold text-4xl md:text-5xl leading-none"
                style={{ color: "oklch(0.78 0.155 75)" }}
              >
                {s.value}
              </div>
              <div className="font-semibold text-sm text-foreground/90">
                {s.label}
              </div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Two column expansion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "oklch(0.58 0.14 148 / 0.07)",
              borderColor: "oklch(0.58 0.14 148 / 0.25)",
            }}
          >
            <h3 className="font-display font-bold text-base text-green mb-2">
              🎯 Target Market
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="text-foreground">
                1.5M+ cooperatives & smallholder farmers
              </strong>{" "}
              in Uganda alone. UCDA-registered cooperatives as primary entry
              points for batch onboarding.
            </p>
          </div>

          <div
            className="rounded-xl p-5 border"
            style={{
              background: "oklch(0.78 0.155 75 / 0.05)",
              borderColor: "oklch(0.78 0.155 75 / 0.20)",
            }}
          >
            <h3 className="font-display font-bold text-base text-gold mb-2">
              🌍 Expansion Path
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="text-foreground">Uganda → East Africa</strong>{" "}
              (Kenya, Ethiopia, Tanzania) →{" "}
              <strong className="text-foreground">
                Global specialty buyers
              </strong>{" "}
              demanding ethical sourcing and traceability.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          ICP blockchain agri-fintech: underserved, high-growth segment — no
          dominant player yet.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 4 — Business Model
// ─────────────────────────────────────────────────────────────
function BusinessModelSlide() {
  const streams = [
    {
      icon: "⚙️",
      title: "Protocol Transaction Fee",
      detail: "0.5% of every transaction processed through the protocol",
      badge: "Core Revenue",
    },
    {
      icon: "📊",
      title: "Data Licensing",
      detail:
        "Verified batch data licensed to exporters, governments & sustainability auditors",
      badge: "Scalable",
    },
    {
      icon: "🤝",
      title: "Partnership Revenue",
      detail:
        "Co-revenue share with cooperatives, certification bodies, and export partners",
      badge: "Strategic",
    },
  ];

  const fundsBreakdown = [
    {
      label: "Go-to-Market",
      pct: 40,
      amount: "$100,000",
      color: "oklch(0.58 0.14 148)",
      icon: "🚀",
      desc: "Farmer onboarding, cooperative recruitment, Uganda pilot program",
    },
    {
      label: "Partnerships & Biz Dev",
      pct: 28,
      amount: "$70,000",
      color: "oklch(0.60 0.12 190)",
      icon: "🤝",
      desc: "UCDA alignment, exporter partnerships, certifier relations, regional expansion",
    },
    {
      label: "Technology & Infrastructure",
      pct: 20,
      amount: "$50,000",
      color: "oklch(0.78 0.155 75)",
      icon: "⚙️",
      desc: "Protocol development, ICP deployment, Voice Ledger integration",
    },
    {
      label: "Operations & Team",
      pct: 12,
      amount: "$30,000",
      color: "oklch(0.65 0.10 280)",
      icon: "🏢",
      desc: "Core team, legal, admin for Uganda launch phase",
    },
  ];

  return (
    <div className="flex flex-col justify-center min-h-screen px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="slide-enter">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green/80">
            Slide 04
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-green/30 to-transparent" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-8">
          Simple, <span className="text-gold">Scalable</span>, Low-Friction
          Revenue
        </h2>

        {/* Quote box */}
        <div
          className="rounded-xl p-5 border mb-8 relative overflow-hidden"
          style={{
            background: "oklch(0.78 0.155 75 / 0.06)",
            borderColor: "oklch(0.78 0.155 75 / 0.3)",
          }}
        >
          <div className="absolute -top-2 -left-1 text-5xl text-gold/20 font-serif select-none">
            "
          </div>
          <p className="text-base sm:text-lg font-semibold text-foreground/90 leading-relaxed pl-6">
            We charge <span className="text-gold font-bold">0.5%</span> of every
            transaction processed through the protocol — a fraction of what
            middlemen currently extract, generating revenue at scale
            automatically. No SaaS subscriptions — pure transaction alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue streams */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-foreground/60 mb-3">
              Revenue Streams
            </h3>
            <div className="flex flex-col gap-3">
              {streams.map((s) => (
                <div
                  key={s.title}
                  className="rounded-xl p-4 border flex items-start gap-3"
                  style={{
                    background: "oklch(0.16 0.030 255 / 0.7)",
                    borderColor: "oklch(0.26 0.035 255)",
                  }}
                >
                  <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">
                        {s.title}
                      </span>
                      <span className="badge-green text-xs px-2 py-0.5 rounded-full">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Use of Funds */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-foreground/60 mb-3">
              Use of Funds — <span className="text-gold">$250,000</span>
            </h3>
            <div className="flex flex-col gap-3">
              {fundsBreakdown.map((f) => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground/80">
                      {f.icon} {f.label}
                    </span>
                    <span className="font-bold" style={{ color: f.color }}>
                      {f.pct}% · {f.amount}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.20 0.025 255)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${f.pct}%`,
                        background: f.color,
                        transition: "width 1s ease-out",
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 12-month milestone */}
        <div
          className="mt-6 rounded-xl p-4 border text-center"
          style={{
            background: "oklch(0.58 0.14 148 / 0.07)",
            borderColor: "oklch(0.58 0.14 148 / 0.25)",
          }}
        >
          <span className="text-xs font-bold tracking-[0.15em] uppercase text-green/70 mr-2">
            12-Month Milestone
          </span>
          <span className="text-sm text-foreground/85 font-medium">
            Onboard <strong className="text-green">5,000 farmers</strong> ·{" "}
            <strong className="text-green">50 cooperatives</strong> · Complete{" "}
            <strong className="text-green">Uganda pilot</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 5 — Traction & Validation
// ─────────────────────────────────────────────────────────────
function TractionSlide() {
  const built = [
    "Live protocol demo — full 7-step pipeline functional",
    "Voice Ledger partnership confirmed — voice batch creation integrated",
    "Built on Internet Computer (ICP) — mainnet-ready architecture",
    "QR traceability live — scannable end-to-end batch verification",
  ];

  const whyNow = [
    "Uganda coffee exports hit record $1.07B in 2023 — sector momentum is real",
    "Government push for agri-tech modernization under NDP III national plan",
    "EU Deforestation Regulation (2025) forces European buyers to source verified, traceable coffee",
    "ICP offers zero gas fees and Web2-speed UX — removing previous blockchain adoption barriers",
  ];

  return (
    <div className="flex flex-col justify-center min-h-screen px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="slide-enter">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green/80">
            Slide 05
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-green/30 to-transparent" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-8">
          Early Stage. <span className="text-gold">Real Foundation.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* What's Built */}
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: "oklch(0.58 0.14 148 / 0.07)",
              borderColor: "oklch(0.58 0.14 148 / 0.25)",
            }}
          >
            <h3 className="font-display font-bold text-base text-green mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green/20 text-green text-xs flex items-center justify-center font-bold">
                ✓
              </span>
              What's Built
            </h3>
            <ul className="flex flex-col gap-3">
              {built.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="text-green mt-0.5 shrink-0 font-bold text-base">
                    ✅
                  </span>
                  <span className="text-foreground/85 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why Now */}
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: "oklch(0.78 0.155 75 / 0.05)",
              borderColor: "oklch(0.78 0.155 75 / 0.20)",
            }}
          >
            <h3 className="font-display font-bold text-base text-gold mb-4 flex items-center gap-2">
              <span className="text-gold">⚡</span>
              Why Now
            </h3>
            <ul className="flex flex-col gap-3">
              {whyNow.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="text-gold mt-0.5 shrink-0 font-bold">→</span>
                  <span className="text-foreground/85 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Honest status badge */}
        <div
          className="rounded-xl p-4 border text-center"
          style={{
            background: "oklch(0.16 0.030 255 / 0.9)",
            borderColor: "oklch(0.26 0.035 255)",
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="badge-gray text-xs px-3 py-1 rounded-full font-bold tracking-wide">
              Pre-Revenue
            </span>
            <span className="badge-yellow text-xs px-3 py-1 rounded-full font-bold tracking-wide">
              Seed Stage
            </span>
            <span className="badge-green text-xs px-3 py-1 rounded-full font-bold tracking-wide">
              Protocol Live
            </span>
            <span className="text-sm text-foreground/70 font-medium ml-2">
              Seeking <strong className="text-gold">$250,000</strong> to launch
              Uganda pilot
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide 6 — Competitive Advantage
// ─────────────────────────────────────────────────────────────
function CompetitiveSlide() {
  const features = [
    {
      name: "Voice-First Batch Creation",
      oac: true,
      middlemen: false,
      others: "partial" as const,
    },
    {
      name: "Blockchain Tokenization",
      oac: true,
      middlemen: false,
      others: "partial" as const,
    },
    { name: "Zero Gas Fees (ICP)", oac: true, middlemen: null, others: false },
    {
      name: "End-to-End QR Traceability",
      oac: true,
      middlemen: false,
      others: "partial" as const,
    },
    { name: "Trade Finance Ready", oac: true, middlemen: false, others: false },
    {
      name: "Farmer Revenue Share",
      oac: "high" as const,
      middlemen: "low" as const,
      others: "medium" as const,
    },
  ];

  const moats = [
    {
      icon: "🎙️",
      title: "Voice Ledger Exclusive Integration",
      desc: "The only protocol with voice-native batch creation in Uganda — lowering the literacy barrier to near zero.",
    },
    {
      icon: "⚡",
      title: "Internet Computer Advantage",
      desc: "No gas fees, no wallet friction, Web2-speed UX on Web3 infrastructure. Competitors can't replicate without rebuilding.",
    },
    {
      icon: "🏛️",
      title: "Government Alignment",
      desc: "Designed for UCDA (Uganda Coffee Development Authority) compliance — giving us a regulatory moat from day one.",
    },
  ];

  type CellValue = boolean | null | "partial" | "high" | "low" | "medium";

  function renderCell(val: CellValue) {
    if (val === true)
      return <span className="text-green font-bold text-lg">✓</span>;
    if (val === false)
      return <span className="text-destructive/70 font-bold text-base">✗</span>;
    if (val === null)
      return <span className="text-muted-foreground text-sm">N/A</span>;
    if (val === "partial")
      return <span className="text-gold text-sm font-semibold">Partial</span>;
    if (val === "high")
      return <span className="text-green text-sm font-bold">High</span>;
    if (val === "medium")
      return <span className="text-gold text-sm font-semibold">Medium</span>;
    if (val === "low")
      return (
        <span className="text-destructive/80 text-sm font-semibold">
          Low (30%)
        </span>
      );
    return null;
  }

  return (
    <div className="flex flex-col justify-center min-h-screen px-6 py-16 max-w-5xl mx-auto w-full">
      <div className="slide-enter">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green/80">
            Slide 06
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-green/30 to-transparent" />
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-8">
          We're Not{" "}
          <span className="text-gold">Another Blockchain Farm App</span>
        </h2>

        {/* Comparison table */}
        <div
          className="rounded-2xl overflow-hidden border mb-8"
          style={{ borderColor: "oklch(0.26 0.035 255)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: "oklch(0.16 0.030 255)" }}>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Feature
                </th>
                <th className="p-4 text-center">
                  <span className="badge-gold text-xs px-3 py-1 rounded-full font-bold">
                    OburugoAgroChain
                  </span>
                </th>
                <th className="p-4 text-center text-xs font-semibold text-muted-foreground">
                  Traditional Middlemen
                </th>
                <th className="p-4 text-center text-xs font-semibold text-muted-foreground">
                  Other Ag-Tech
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.name}
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(0.14 0.025 255 / 0.5)"
                        : "oklch(0.16 0.030 255 / 0.3)",
                  }}
                >
                  <td className="p-3 pl-4 text-sm text-foreground/85 font-medium">
                    {f.name}
                  </td>
                  <td className="p-3 text-center">{renderCell(f.oac)}</td>
                  <td className="p-3 text-center">{renderCell(f.middlemen)}</td>
                  <td className="p-3 text-center">{renderCell(f.others)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3 moat statements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {moats.map((m) => (
            <div
              key={m.title}
              className="rounded-xl p-5 border flex flex-col gap-2"
              style={{
                background: "oklch(0.16 0.030 255 / 0.8)",
                borderColor: "oklch(0.26 0.035 255)",
              }}
            >
              <span className="text-2xl">{m.icon}</span>
              <h3 className="font-display font-bold text-sm text-foreground">
                {m.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <div
          className="rounded-xl p-5 border text-center"
          style={{
            background: "oklch(0.78 0.155 75 / 0.06)",
            borderColor: "oklch(0.78 0.155 75 / 0.30)",
          }}
        >
          <p className="text-base sm:text-lg font-display font-bold text-foreground/90">
            "The infrastructure for Uganda's next{" "}
            <span className="text-gold">$5B coffee economy</span> — built for
            farmers first."
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation Bar
// ─────────────────────────────────────────────────────────────
function NavBar({
  current,
  total,
  onPrev,
  onNext,
  onDot,
}: {
  current: SlideId;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (i: number) => void;
}) {
  const slideLabels = [
    "Cover",
    "Problem",
    "Solution",
    "Market",
    "Business Model",
    "Traction",
    "Competitive",
  ];
  return (
    <div
      className="no-print fixed bottom-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between gap-4"
      style={{
        background: "oklch(0.12 0.025 255 / 0.92)",
        borderTop: "1px solid oklch(0.26 0.035 255)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Prev */}
      <button
        type="button"
        data-ocid="deck.prev_button"
        onClick={onPrev}
        disabled={current === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-white/5"
        aria-label="Previous slide"
        style={{ color: "oklch(0.78 0.155 75)" }}
      >
        ← Prev
      </button>

      {/* Dots */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        {slideLabels.map((label, i) => (
          <button
            type="button"
            key={label}
            onClick={() => onDot(i)}
            aria-label={`Go to slide ${i + 1}: ${label}`}
            className="transition-all duration-200"
            style={{
              width: current === i ? "20px" : "6px",
              height: "6px",
              borderRadius: "9999px",
              background:
                current === i
                  ? "oklch(0.78 0.155 75)"
                  : "oklch(0.40 0.020 255)",
            }}
          />
        ))}
      </div>

      {/* Slide label */}
      <span className="hidden sm:block text-xs text-muted-foreground font-medium min-w-[80px] text-center">
        {slideLabels[current]}
      </span>

      {/* Next */}
      <button
        type="button"
        data-ocid="deck.next_button"
        onClick={onNext}
        disabled={current === total - 1}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-white/5"
        aria-label="Next slide"
        style={{ color: "oklch(0.78 0.155 75)" }}
      >
        Next →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Download PDF Button
// ─────────────────────────────────────────────────────────────
function DownloadButton() {
  return (
    <button
      type="button"
      data-ocid="deck.download_button"
      onClick={() => window.print()}
      className="no-print fixed top-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        right: "8rem",
        background: "oklch(0.78 0.155 75 / 0.12)",
        border: "1px solid oklch(0.78 0.155 75 / 0.35)",
        color: "oklch(0.78 0.155 75)",
        backdropFilter: "blur(12px)",
      }}
      aria-label="Download pitch deck as PDF"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      PDF
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide Counter (top-right)
// ─────────────────────────────────────────────────────────────
function SlideCounter({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="no-print fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
      style={{
        background: "oklch(0.16 0.030 255 / 0.85)",
        border: "1px solid oklch(0.26 0.035 255)",
        color: "oklch(0.60 0.03 260)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span style={{ color: "oklch(0.78 0.155 75)" }}>{current + 1}</span>
      <span className="mx-1">/</span>
      <span>{total}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OAC Wordmark (top-left)
// ─────────────────────────────────────────────────────────────
function Wordmark({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: "oklch(0.16 0.030 255 / 0.85)",
        border: "1px solid oklch(0.26 0.035 255)",
        backdropFilter: "blur(12px)",
      }}
    >
      <img
        src="/assets/generated/oac-logo-transparent.dim_200x200.png"
        alt="OAC"
        className="w-5 h-5 object-contain"
      />
      <span
        className="text-xs font-display font-bold tracking-wide"
        style={{ color: "oklch(0.78 0.155 75)" }}
      >
        OburugoAgroChain
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  CoverSlide,
  ProblemSlide,
  SolutionSlide,
  MarketSlide,
  BusinessModelSlide,
  TractionSlide,
  CompetitiveSlide,
] as const;

// Slide data-ocid map
const SLIDE_OCIDS: string[] = [
  "deck.slide.1",
  "deck.slide.2",
  "deck.slide.3",
  "deck.slide.4",
  "deck.slide.5",
  "deck.slide.6",
  "deck.slide.7",
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<SlideId>(0);
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, i)) as SlideId;
    setCurrentSlide(clamped);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch swipe
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  const _SlideComponent = SLIDES[currentSlide];

  return (
    <div
      className="fixed inset-0 slide-mesh overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Coffee bean background */}
      <CoffeeBeanBg />

      {/* Top-right counter */}
      <SlideCounter current={currentSlide} total={TOTAL_SLIDES} />

      {/* Download PDF button */}
      <DownloadButton />

      {/* Top-left wordmark (hidden on cover) */}
      <Wordmark visible={currentSlide !== 0} />

      {/* Slide content */}
      <section
        key={animKey}
        data-ocid={SLIDE_OCIDS[currentSlide]}
        className="slide-enter absolute inset-0 overflow-y-auto pb-16"
        aria-label={`Slide ${currentSlide + 1} of ${TOTAL_SLIDES}`}
      >
        {currentSlide === 0 ? (
          <CoverSlide onNext={next} />
        ) : currentSlide === 1 ? (
          <ProblemSlide />
        ) : currentSlide === 2 ? (
          <SolutionSlide />
        ) : currentSlide === 3 ? (
          <MarketSlide />
        ) : currentSlide === 4 ? (
          <BusinessModelSlide />
        ) : currentSlide === 5 ? (
          <TractionSlide />
        ) : (
          <CompetitiveSlide />
        )}
      </section>

      {/* Bottom navigation */}
      <NavBar
        current={currentSlide}
        total={TOTAL_SLIDES}
        onPrev={prev}
        onNext={next}
        onDot={goTo}
      />

      {/* Footer (only visible on last slide) */}
      {currentSlide === TOTAL_SLIDES - 1 && (
        <div
          className="no-print fixed bottom-14 left-0 right-0 flex justify-center pointer-events-none"
          style={{ zIndex: 40 }}
        >
          <p className="text-xs text-foreground/30 text-center">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto hover:text-gold/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      )}

      {/* ── Print-only: all slides rendered sequentially ── */}
      <div className="print-only" aria-hidden="true">
        <div className="print-slide">
          <CoverSlide onNext={() => {}} />
        </div>
        <div className="print-slide">
          <ProblemSlide />
        </div>
        <div className="print-slide">
          <SolutionSlide />
        </div>
        <div className="print-slide">
          <MarketSlide />
        </div>
        <div className="print-slide">
          <BusinessModelSlide />
        </div>
        <div className="print-slide">
          <TractionSlide />
        </div>
        <div className="print-slide">
          <CompetitiveSlide />
        </div>
      </div>
    </div>
  );
}
