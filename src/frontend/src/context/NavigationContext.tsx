import type React from "react";
import { createContext, useContext } from "react";

interface NavigationContextType {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({
  children,
  currentStep,
  totalSteps,
  onNext,
}: {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
}) {
  return (
    <NavigationContext.Provider value={{ currentStep, totalSteps, onNext }}>
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
