import type React from "react";
import { createContext, useContext } from "react";

interface NavigationContextType {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  canProceed: boolean;
  blockingMessage: string;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({
  children,
  currentStep,
  totalSteps,
  onNext,
  canProceed,
  blockingMessage,
}: {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  canProceed: boolean;
  blockingMessage: string;
}) {
  return (
    <NavigationContext.Provider
      value={{ currentStep, totalSteps, onNext, canProceed, blockingMessage }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const ctx = useContext(NavigationContext);
  if (!ctx)
    throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
