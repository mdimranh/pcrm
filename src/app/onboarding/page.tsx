import { Info } from "lucide-react";
import OnBoardingTimeline from "./components/timeline";

export default function OnBoarding() {
  return (
    <div className="flex justify-between h-screen">
      <div className=""></div>
      <div className="max-w-96 px-4 py-12 bg-primary-foreground flex flex-col justify-between">
        <OnBoardingTimeline />
        <div className="flex flex-col gap-3">
          <Info size={20} />
          <p className="font-semibold">Having trouble?</p>
          <p className="text-sm text-muted-foreground">
            Feel free to contact us and we aill always help you through the
            process.
          </p>
        </div>
      </div>
    </div>
  );
}
