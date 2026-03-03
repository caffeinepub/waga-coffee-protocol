import { Button } from "@/components/ui/button";
import { useNavigation } from "@/context/NavigationContext";
import { ArrowRight, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function NextStepButton() {
  const { currentStep, totalSteps, onNext, canProceed, blockingMessage } =
    useNavigation();

  if (currentStep >= totalSteps) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex flex-col items-center gap-3 pt-4 pb-8"
    >
      <Button
        data-ocid={`step${currentStep}.next_button`}
        onClick={onNext}
        disabled={!canProceed}
        size="lg"
        className={
          canProceed
            ? "bg-green/10 border border-green/40 text-green hover:bg-green hover:text-background transition-all duration-200 font-semibold px-8 gap-2"
            : "bg-muted/20 border border-border text-muted-foreground cursor-not-allowed font-semibold px-8 gap-2 opacity-60"
        }
        variant="outline"
      >
        {canProceed ? (
          <ArrowRight className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        Proceed to Step {currentStep + 1}
      </Button>

      <AnimatePresence>
        {!canProceed && blockingMessage && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground text-center max-w-xs"
            data-ocid={`step${currentStep}.next_button.error_state`}
          >
            <Lock className="w-3 h-3 inline mr-1 mb-0.5" />
            {blockingMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
