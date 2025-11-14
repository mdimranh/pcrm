import OnBoardingTimeline from "./components/timeline";

export default function OnBoarding() {
  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-3"></div>
      <div className="col-span-1 p-4 bg-primary-foreground">
        <OnBoardingTimeline />
      </div>
    </div>
  );
}
