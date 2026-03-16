export default function StatsSection() {
  const stats = [
    { label: "Citizens Registered", value: "45M+" },
    { label: "Active Schemes", value: "1,200+" },
    { label: "Applications Processed", value: "18.5M" },
    { label: "Districts Covered", value: "766" },
  ];

  return (
    <section className="bg-gov-dark-blue py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium text-gov-light-blue sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
