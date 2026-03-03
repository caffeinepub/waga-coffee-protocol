import { Hero } from "@/components/Hero";
import { StepNav } from "@/components/StepNav";
import { BatchCreation } from "@/components/steps/BatchCreation";
import { CommunityDistribution } from "@/components/steps/CommunityDistribution";
import { InventoryManagement } from "@/components/steps/InventoryManagement";
import { QRTraceability } from "@/components/steps/QRTraceability";
import { ReserveVerification } from "@/components/steps/ReserveVerification";
import { TokenMinting } from "@/components/steps/TokenMinting";
import { TokenRedemption } from "@/components/steps/TokenRedemption";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useApp } from "@/context/AppContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { Coffee, Github } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const STEPS = [
  BatchCreation,
  ReserveVerification,
  TokenMinting,
  CommunityDistribution,
  InventoryManagement,
  TokenRedemption,
  QRTraceability,
];

function AppContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showHero, setShowHero] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    batches,
    verifications,
    tokens,
    distributors,
    distributionOrders,
    redemptions,
  } = useApp();

  // Per-step completion gate: returns [canProceed, blockingMessage]
  const stepGates: [boolean, string][] = [
    // Step 1: must have created at least 1 batch
    [batches.length > 0, "Create at least one batch before proceeding."],
    // Step 2: must have at least 1 verified batch
    [
      Object.values(verifications).some((v) => v.status === "Verified"),
      "Verify at least one batch using the oracle before proceeding.",
    ],
    // Step 3: must have minted at least 1 token
    [tokens.length > 0, "Mint tokens for a verified batch before proceeding."],
    // Step 4: must have at least 1 distributor registered
    [
      distributors.length > 0 && distributionOrders.length > 0,
      distributors.length === 0
        ? "Register at least one distributor before proceeding."
        : "Create at least one distribution order before proceeding.",
    ],
    // Step 5 (Inventory): view-only — need tokens to exist
    [tokens.length > 0, "Mint tokens in Step 3 first to populate inventory."],
    // Step 6: must have submitted at least 1 redemption
    [
      redemptions.length > 0,
      "Submit at least one redemption request before proceeding.",
    ],
    // Step 7: last step, no next button shown anyway
    [true, ""],
  ];

  const [canProceed, blockingMessage] = stepGates[currentStep - 1] ?? [
    true,
    "",
  ];

  function handleExplore() {
    setShowHero(false);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleStepChange(step: number) {
    setCurrentStep(step);
    setShowHero(false);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleNext() {
    const next = Math.min(currentStep + 1, STEPS.length);
    handleStepChange(next);
  }

  const StepComponent = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Hero onExplore={handleExplore} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky step nav */}
      <div ref={contentRef}>
        <StepNav currentStep={currentStep} onStepChange={handleStepChange} />
      </div>

      {/* Step content */}
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <NavigationProvider
              currentStep={currentStep}
              totalSteps={STEPS.length}
              onNext={handleNext}
              canProceed={canProceed}
              blockingMessage={blockingMessage}
            >
              <StepComponent />
            </NavigationProvider>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-yellow/15 border border-yellow/30">
                <Coffee className="w-3 h-3 text-yellow" />
              </div>
              <span className="font-display font-bold text-sm text-yellow">
                OburugoAgroChain
              </span>
            </div>

            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()}. Built with{" "}
              <span className="text-green">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:underline"
              >
                caffeine.ai
              </a>
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <a
                href="https://wagatoken.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://github.com/wagatoken"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://wagatoken.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow transition-colors flex items-center gap-1"
              >
                <Github className="w-3 h-3" />
                OAC Token
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.015 60)",
            border: "1px solid oklch(0.28 0.03 60)",
            color: "oklch(0.93 0.03 80)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
