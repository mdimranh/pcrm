"use client";

import React, { createContext, useContext, useState } from "react";

export type stepType = {
  title: string;
  description: string;
  completed: boolean;
  index?: number;
  children: React.ReactNode;
};

type onboardingContextType = {
  steps: { title: string; description: string; completed: boolean }[];
  currentStep: stepType | undefined;
  setCurrentStep: (step: number) => void;
  setIsSaving: (saving: boolean) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLastStep: boolean;
  isSaving: boolean;
};

const OnboardingContext = createContext<onboardingContextType | null>(null);

type OnboardingProviderProps = {
  steps: stepType[];
  children: React.ReactNode;
};

export function OnboardingProvider({
  children,
  ...props
}: OnboardingProviderProps) {
  const [steps, _setSteps] = useState<stepType[]>(
    props.steps.map((step, index) => ({ ...step, index }))
  );
  const [currentStep, _setCurrentStep] = useState<stepType | undefined>(
    steps.find((step) => !step.completed)
  );
  const [isSaving, _setIsSaving] = useState<boolean>(false);
  const hasNext = (currentStep?.index || 0) < steps.length - 1;
  const hasPrevious = (currentStep?.index || 0) > 0;
  const isLastStep = currentStep?.index === steps.length - 1;

  const setCurrentStep = (step: number) => {
    console.log("S -------------> ", step);

    _setSteps(steps.map((s, index) => ({ ...s, completed: index < step })));
    _setCurrentStep(steps[step]);
  };
  const setIsSaving = (saving: boolean) => _setIsSaving(saving);

  const contextValue: onboardingContextType = {
    steps,
    currentStep,
    setCurrentStep,
    setIsSaving,
    hasNext,
    hasPrevious,
    isLastStep,
    isSaving,
  };
  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within a OnboardingProvider");
  }
  return context;
}
