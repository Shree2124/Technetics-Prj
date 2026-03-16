"use client";

const ministries = [
  { name: "Ministry of Finance", abbr: "MoF", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2YKLnFLfPpeZKsDREO8-1lu5Iwvwj9mLR3w&s" },
  { name: "Ministry of Health & Family Welfare", abbr: "MoHFW", logo: "https://www.ngoregistration.org/wp-content/uploads/2014/07/ministry-and-health-family-welfare.png" },
  { name: "Ministry of Agriculture", abbr: "MoA", logo: "https://www.pngkey.com/png/detail/244-2449850_india-ministry-of-agriculture-farmers-welfare-president-of.png" },
  { name: "Ministry of Education", abbr: "MoE", logo: "https://neec.ncert.gov.in/static/images/logos/mhrd-logo.png" },
  { name: "Ministry of Housing & Urban Affairs", abbr: "MoHUA", logo: "https://nulm.gov.in/images/MoHUALogo.png" },
  { name: "Ministry of Electronics & IT", abbr: "MeitY", logo: "https://egov.eletsonline.com/wp-content/uploads/2016/10/MEITY-Logo.png" },
  { name: "NITI Aayog", abbr: "NITI", logo: "https://getlogovector.com/wp-content/uploads/2019/12/niti-aayog-logo-vector.png" },
  { name: "Ministry of Rural Development", abbr: "MoRD", logo: "data:image/png;base64,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" },
  { name: "Ministry of Women & Child Development", abbr: "MWCD", logo: "https://www.newsonair.gov.in/wp-content/uploads/2024/02/NPIC-2023930121813.jpg" },
  { name: "Ministry of Social Justice", abbr: "MSJ", logo: "https://www.govtjobsblog.in/wp-content/uploads/2023/07/Ministry-of-Social-Justice-and-Empowerment.png" },
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

      {/* Row 1 */}
      <div className="relative flex overflow-hidden mb-6 group">
        <div className="flex animate-[marquee-left_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8">
          {[...ministries, ...ministries].map((m, i) => (
            <MarqueePill key={`r1-${i}`} {...m} />
          ))}
        </div>

        <div className="flex animate-[marquee-left_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8" aria-hidden>
          {[...ministries, ...ministries].map((m, i) => (
            <MarqueePill key={`r1d-${i}`} {...m} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-[marquee-right_45s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8">
          {[...ministries.slice(5), ...ministries.slice(0, 5), ...ministries].map((m, i) => (
            <MarqueePill key={`r2-${i}`} {...m} />
          ))}
        </div>

        <div className="flex animate-[marquee-right_45s_linear_infinite] group-hover:[animation-play-state:paused] gap-8 pr-8" aria-hidden>
          {[...ministries.slice(5), ...ministries.slice(0, 5), ...ministries].map((m, i) => (
            <MarqueePill key={`r2d-${i}`} {...m} />
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

function MarqueePill({ name, abbr, logo }: { name: string; abbr: string; logo?: string }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm hover:bg-white/10 transition-colors shrink-0">

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 shrink-0 overflow-hidden">
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="h-6 w-6 object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-xs font-bold text-white/90">
            {abbr.slice(0, 2)}
          </span>
        )}
      </div>

      <span className="text-sm font-medium text-white/80">{name}</span>
    </div>
  );
}