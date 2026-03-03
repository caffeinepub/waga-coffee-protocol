import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Coffee,
  Coins,
  Layers,
  Network,
  QrCode,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

interface StepNavProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

type StepStatus = "Not Started" | "In Progress" | "Complete";

const stepConfig = [
  { num: 1, icon: Layers, label: "Batch Creation", short: "Batch" },
  { num: 2, icon: ShieldCheck, label: "Reserve Verification", short: "Verify" },
  { num: 3, icon: Coins, label: "Token Minting", short: "Mint" },
  { num: 4, icon: Network, label: "Distribution", short: "Distribute" },
  { num: 5, icon: BarChart3, label: "Inventory", short: "Inventory" },
  { num: 6, icon: RefreshCcw, label: "Token Redemption", short: "Redeem" },
  { num: 7, icon: QrCode, label: "QR Traceability", short: "QR" },
];

export function StepNav({ currentStep, onStepChange }: StepNavProps) {
  const { batches, tokens, distributors, redemptions } = useApp();

  function getStepStatus(stepNum: number): StepStatus {
    if (stepNum === currentStep) return "In Progress";
    switch (stepNum) {
      case 1:
        return batches.length > 0 ? "Complete" : "Not Started";
      case 2:
        return batches.some(
          (b) => b.status === "Verified" || b.status === "Minted",
        )
          ? "Complete"
          : "Not Started";
      case 3:
        return tokens.length > 0 ? "Complete" : "Not Started";
      case 4:
        return distributors.length > 0 ? "Complete" : "Not Started";
      case 5:
        return batches.length > 0 ? "Complete" : "Not Started";
      case 6:
        return redemptions.length > 0 ? "Complete" : "Not Started";
      case 7:
        return "Not Started";
      default:
        return "Not Started";
    }
  }

  const completedSteps = stepConfig.filter(
    (s) => getStepStatus(s.num) === "Complete",
  ).length;
  const progressPct = (completedSteps / stepConfig.length) * 100;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-yellow/15 border border-yellow/30">
              <Coffee className="w-3.5 h-3.5 text-yellow" />
            </div>
            <span className="font-display font-bold text-sm text-yellow hidden sm:block">
              OAC
            </span>
          </div>

          {/* Progress summary */}
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-green transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span>{completedSteps}/7 Complete</span>
            </div>
          </div>
        </div>

        {/* Step buttons */}
        <div className="flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {stepConfig.map((step, idx) => {
            const status = getStepStatus(step.num);
            const isActive = currentStep === step.num;
            const isComplete = status === "Complete";

            return (
              <button
                key={step.num}
                type="button"
                data-ocid={`nav.step.button.${step.num}`}
                onClick={() => onStepChange(step.num)}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  isActive
                    ? "bg-yellow/15 text-yellow border border-yellow/30"
                    : isComplete
                      ? "text-green hover:bg-green/10 hover:text-green"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                {/* Step number circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0 transition-all duration-200",
                    isActive
                      ? "bg-yellow text-background"
                      : isComplete
                        ? "bg-green/20 text-green"
                        : "bg-border/60 text-muted-foreground",
                  )}
                >
                  {isComplete && !isActive ? "✓" : step.num}
                </div>

                {/* Label */}
                <span className="hidden sm:block">{step.short}</span>

                {/* Active underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow" />
                )}

                {/* Connector */}
                {idx < stepConfig.length - 1 && (
                  <div
                    className={cn(
                      "absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-px",
                      isComplete ? "bg-green/30" : "bg-border/40",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-0.5 w-full bg-border/30">
        <div
          className="h-full bg-green/60 transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </nav>
  );
}
