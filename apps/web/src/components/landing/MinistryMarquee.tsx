"use client";

const ministries = [
  { name: "Ministry of Finance", abbr: "MoF" },
  { name: "Ministry of Health & Family Welfare", abbr: "MoHFW" },
  { name: "Ministry of Agriculture", abbr: "MoA" },
  { name: "Ministry of Education", abbr: "MoE" },
  { name: "Ministry of Housing & Urban Affairs", abbr: "MoHUA" },
  { name: "Ministry of Electronics & IT", abbr: "MeitY" },
  { name: "NITI Aayog", abbr: "NITI" },
  { name: "Ministry of Rural Development", abbr: "MoRD" },
  { name: "Ministry of Women & Child Development", abbr: "MWCD" },
  { name: "Ministry of Social Justice", abbr: "MSJ" },
];

export default function MinistryMarquee() {
  return (
    <section className="bg-gov-dark-blue py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Supported by Government Ministries
        </h2>
        <p className="mt-2 text-sm text-white/60">
          In partnership with key ministries and government bodies of India
        </p>
      </div>

      {/* Row 1 — scrolling left */}
      <div className="relative flex overflow-hidden mb-6 group">
        <div className="flex animate-[marquee-left_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8">
          {[...ministries, ...ministries].map((m, i) => (
            <MarqueePill key={`r1-${i}`} name={m.name} abbr={m.abbr} />
          ))}
        </div>
        <div className="flex animate-[marquee-left_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8" aria-hidden>
          {[...ministries, ...ministries].map((m, i) => (
            <MarqueePill key={`r1d-${i}`} name={m.name} abbr={m.abbr} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolling right */}
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-[marquee-right_45s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8">
          {[...ministries.slice(5), ...ministries.slice(0, 5), ...ministries].map((m, i) => (
            <MarqueePill key={`r2-${i}`} name={m.name} abbr={m.abbr} />
          ))}
        </div>
        <div className="flex animate-[marquee-right_45s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8" aria-hidden>
          {[...ministries.slice(5), ...ministries.slice(0, 5), ...ministries].map((m, i) => (
            <MarqueePill key={`r2d-${i}`} name={m.name} abbr={m.abbr} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function MarqueePill({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm hover:bg-white/10 transition-colors shrink-0">
      {/* Ministry emblem placeholder */}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white/90 shrink-0">
        {abbr.slice(0, 2)}
      </div>
      <span className="text-sm font-medium text-white/80">{name}</span>
    </div>
  );
}
