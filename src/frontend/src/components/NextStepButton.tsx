import { Button } from "@/components/ui/button";
import { useNavigation } from "@/context/NavigationContext";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function NextStepButton() {
  const { currentStep, totalSteps, onNext } = useNavigation();

  if (currentStep >= totalSteps) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex justify-center pt-4 pb-8"
    >
      <Button
        data-ocid={`step${currentStep}.next_button`}
        onClick={onNext}
        size="lg"
        className="bg-amber/10 border border-amber/40 text-amber hover:bg-amber hover:text-background transition-all duration-200 font-semibold px-8 gap-2"
        variant="outline"
      >
        Proceed to Step {currentStep + 1}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
