"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useOnboarding } from "../provider";
import OnBoardingTimeline from "./timeline";

type onboardingStepProps = {
  title: "Organization";
  description: "Create your organization. Choose a name and a logo.";
  hasPrevious: boolean;
  hasNext: boolean;
  children: React.ReactNode;
};

export function Onboarding() {
  const {
    steps,
    currentStep,
    setCurrentStep,
    isSaving,
    setIsSaving,
    hasPrevious,
    hasNext,
  } = useOnboarding();
  return (
    <div className="flex justify-between h-screen">
      <div className="w-full p-8 flex flex-col justify-between">
        <div>
          <h1>{currentStep?.title}</h1>
          <p>{currentStep?.description}</p>
        </div>
        {currentStep?.children}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={!hasPrevious}
            onClick={() => setCurrentStep((currentStep?.index || 0) - 1)}
          >
            Previous
          </Button>
          <Button onClick={() => setCurrentStep((currentStep?.index || 0) + 1)}>
            {isSaving ? (
              <>
                <Loader className="animate-spin" /> Saving
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
      <div className="max-w-96 px-4 py-12 bg-primary-foreground flex flex-col justify-between">
        <OnBoardingTimeline />
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Having trouble?</p>
          <p className="text-sm text-muted-foreground">
            Feel free to contact us and we aill always help you through the
            process.
          </p>
          <Link href="/contact">
            <Button variant={"outline"}>Contact us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
