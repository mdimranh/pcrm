const steps = [
  {
    title: "Senior Full Stack Developer",
    description: "Led the development of enterprise-scale web applications.",
    completed: true,
  },
  {
    title: "Full Stack Developer",
    description: "Developed and maintained multiple client projects.",
    completed: false,
  },
  {
    title: "Frontend Developer",
    description: "Created responsive and interactive user interfaces.",
    completed: false,
  },
];

export default function OnBoardingTimeline() {
  return (
    <div className="max-w-(--breakpoint-sm) mx-auto py-2 md:py-4 px-6">
      <div className="relative ml-3">
        <div className="absolute left-0 top-4 bottom-0" />
        {steps.map(({ description, title, completed }, index) => (
          <div
            key={index}
            className={`relative pb-12 last:pb-0 last:border-l-transparent border-l-2 flex items-start ${
              completed ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`shrink-0 h-9 w-9 -translate-x-5 border rounded-full flex items-center justify-center border-primary font-bold ${
                completed ? "bg-primary text-primary-foreground" : "bg-accent"
              }`}
            >
              {index + 1}
            </div>
            {/* Content */}
            <div className="flex flex-col">
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
