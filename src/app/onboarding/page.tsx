"use client";

import { Onboarding } from "./components";
import { Organization } from "./components/steps/organization";
import { OnboardingProvider } from "./provider";

const steps = [
  {
    title: "Organization",
    description: "Create your organization. Choose a name and a logo.",
    completed: false,
    children: <Organization />,
  },
  {
    title: "Domain",
    description: "Buy or acquire a domain. Or use a subdomain.",
    completed: false,
    children: <Organization />,
  },
  {
    title: "Configuration",
    description: "Configure your organization. Create a team and invite users.",
    completed: false,
    children: <Organization />,
  },
];

export default function OnBoardingpAGE() {
  return (
    <OnboardingProvider steps={steps}>
      <Onboarding />
    </OnboardingProvider>
  );
}
