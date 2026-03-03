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
import { AppProvider } from "@/context/AppContext";
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
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber/15 border border-amber/30">
                <Coffee className="w-3 h-3 text-amber" />
              </div>
              <span className="font-display font-bold text-sm text-amber">
                OburugoAgroChain
              </span>
            </div>

            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()}. Built with{" "}
              <span className="text-amber">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:underline"
              >
                caffeine.ai
              </a>
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <a
                href="https://wagatoken.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://github.com/wagatoken"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://wagatoken.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber transition-colors flex items-center gap-1"
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
