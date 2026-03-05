import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  BarChart3,
  Coffee,
  Coins,
  Layers,
  Network,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { type Variants, motion, useReducedMotion } from "motion/react";

interface HeroProps {
  onExplore: () => void;
}

const steps = [
  {
    num: 1,
    icon: Layers,
    label: "Batch Creation",
    desc: "Register coffee batches on-chain",
  },
  {
    num: 2,
    icon: ShieldCheck,
    label: "Reserve Verification",
    desc: "Oracle-based quality validation",
  },
  {
    num: 3,
    icon: Coins,
    label: "Token Minting",
    desc: "ERC-1155 token generation",
  },
  {
    num: 4,
    icon: Network,
    label: "Distribution",
    desc: "Community distributor network",
  },
  {
    num: 5,
    icon: BarChart3,
    label: "Inventory",
    desc: "Real-time supply tracking",
  },
  {
    num: 6,
    icon: RefreshCcw,
    label: "Redemption",
    desc: "Physical fulfilment & burning",
  },
  {
    num: 7,
    icon: QrCode,
    label: "QR Traceability",
    desc: "Farm-to-cup provenance",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BRAND_NAME = "OburugoAgroChain";

const letterContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.15,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.88, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const underlineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: BRAND_NAME.length * 0.045 + 0.3,
    },
  },
};

export function Hero({ onExplore }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen hero-mesh overflow-hidden flex flex-col justify-center">
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(var(--yellow)) 1px, transparent 1px),
            linear-gradient(90deg, oklch(var(--yellow)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative coffee ring */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-yellow/10 opacity-40 hidden lg:block" />
      <div className="absolute top-24 right-24 w-56 h-56 rounded-full border border-yellow/5 opacity-60 hidden lg:block" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border border-yellow/5 opacity-30 hidden lg:block" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow/30 bg-yellow/10 text-yellow text-xs font-semibold tracking-wider uppercase">
            <Zap className="w-3 h-3" />
            <span>Blockchain Protocol</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                type: "spring",
                stiffness: 200,
              }}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow/15 border border-yellow/30"
            >
              <Coffee className="w-6 h-6 text-yellow" />
            </motion.div>
          </div>

          {/* Animated brand name — letter by letter */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-2 relative inline-block">
            <motion.span
              variants={
                prefersReducedMotion ? undefined : letterContainerVariants
              }
              initial={prefersReducedMotion ? { opacity: 1 } : "hidden"}
              animate="visible"
              aria-label={BRAND_NAME}
              className="inline-flex flex-wrap"
              style={{ lineHeight: 1.1 }}
            >
              {BRAND_NAME.split("").map((char, i) => (
                <motion.span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static string
                  key={i}
                  variants={prefersReducedMotion ? undefined : letterVariants}
                  className="gradient-text inline-block"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.span>

            {/* Green glow underline that sweeps in after letters */}
            <motion.div
              variants={prefersReducedMotion ? undefined : underlineVariants}
              initial={
                prefersReducedMotion ? { scaleX: 1, opacity: 1 } : "hidden"
              }
              animate="visible"
              style={{ originX: 0 }}
              className="absolute -bottom-1 left-0 h-1 w-full rounded-full"
              aria-hidden="true"
            >
              <div
                className="h-full w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(var(--green)) 0%, oklch(var(--yellow)) 60%, oklch(var(--green) / 0.3) 100%)",
                  boxShadow:
                    "0 0 14px oklch(var(--green) / 0.7), 0 0 30px oklch(var(--green) / 0.3)",
                  animation: "glow-pulse 2.5s ease-in-out infinite",
                }}
              />
            </motion.div>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mb-4 leading-relaxed"
        >
          Blockchain-powered coffee traceability from farm to cup. Every bean,
          every batch, every transaction — immutably recorded on-chain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-6 mb-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>Live Protocol</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow" />
            <span>ERC-1155 Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-info" />
            <span>Chainlink Oracles</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20"
        >
          <Button
            data-ocid="hero.explore_button"
            onClick={onExplore}
            size="lg"
            className="bg-green text-background hover:opacity-90 font-semibold text-base px-8 py-6 rounded-xl glow-green-sm transition-all duration-200 hover:scale-[1.02]"
          >
            Explore the Protocol
            <ArrowDown className="ml-2 w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Simulate a complete supply chain ↓
          </span>
        </motion.div>

        {/* Step overview grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.6 }}
        >
          <motion.p
            variants={itemVariants}
            className="text-xs text-muted-foreground uppercase tracking-widest mb-6 font-medium"
          >
            7-Step Supply Chain Protocol
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={itemVariants}
                className="group relative p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm card-hover cursor-default"
              >
                {/* Number */}
                <div className="text-xs font-bold text-yellow/60 mb-3 font-mono">
                  0{step.num}
                </div>
                {/* Icon */}
                <div className="mb-3">
                  <step.icon className="w-5 h-5 text-yellow/70 group-hover:text-yellow transition-colors duration-200" />
                </div>
                {/* Label */}
                <div className="text-xs font-semibold text-foreground/80 mb-1 font-display leading-tight">
                  {step.label}
                </div>
                <div className="text-xs text-muted-foreground leading-tight hidden sm:block">
                  {step.desc}
                </div>

                {/* Connector dot */}
                {step.num < 7 && (
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-px bg-yellow/30 hidden lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs uppercase tracking-widest">
          Scroll to begin
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <ArrowDown className="w-4 h-4 text-yellow/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
