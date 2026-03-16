"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip-card";

const schemes = [
  {
    name: "PM Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000/year to small and marginal farmers in three equal installments.",
    category: "Agriculture",
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&auto=format&fit=crop",
    beneficiaries: "11.8 Crore farmers",
    launched: "February 2019",
    accent: "border-green-300 bg-green-50",
    badgeColor: "bg-green-600",
  },
  {
    name: "Ayushman Bharat (PMJAY)",
    description: "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.",
    category: "Healthcare",
    img: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?q=80&w=400&auto=format&fit=crop",
    beneficiaries: "55 Crore citizens",
    launched: "September 2018",
    accent: "border-blue-300 bg-blue-50",
    badgeColor: "bg-blue-600",
  },
  {
    name: "PM Awas Yojana",
    description: "Affordable housing with financial assistance up to ₹2.67 lakh for economically weaker sections.",
    category: "Housing",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop",
    beneficiaries: "4.5 Crore families",
    launched: "June 2015",
    accent: "border-orange-300 bg-orange-50",
    badgeColor: "bg-orange-600",
  },
  {
    name: "National Scholarship Portal",
    description: "Centralised portal for scholarship application and disbursement for students Class 1 to PhD.",
    category: "Education",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c476?q=80&w=400&auto=format&fit=crop",
    beneficiaries: "2.7 Crore students",
    launched: "July 2015",
    accent: "border-purple-300 bg-purple-50",
    badgeColor: "bg-purple-600",
  },
  {
    name: "PM Jan Dhan Yojana",
    description: "Universal access to banking with zero-balance accounts, insurance, and pension benefits.",
    category: "Financial Inclusion",
    img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop",
    beneficiaries: "52 Crore accounts",
    launched: "August 2014",
    accent: "border-indigo-300 bg-indigo-50",
    badgeColor: "bg-indigo-600",
  },
  {
    name: "Ujjwala Yojana",
    description: "Free LPG connections to women below poverty line to replace unclean cooking fuels.",
    category: "Energy",
    img: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=400&auto=format&fit=crop",
    beneficiaries: "10.3 Crore families",
    launched: "May 2016",
    accent: "border-rose-300 bg-rose-50",
    badgeColor: "bg-rose-600",
  },
];

const SchemeTooltipContent = ({ scheme }: { scheme: typeof schemes[0] }) => (
  <div>
    <img src={scheme.img} alt={scheme.name} className="w-full h-32 object-cover rounded-sm mb-3" />
    <p className="text-sm font-bold text-gray-900 mb-1">{scheme.name}</p>
    <p className="text-xs text-gray-600 mb-2">{scheme.description}</p>
    <div className="flex flex-col gap-1 text-[11px] text-gray-500">
      <span>👥 Beneficiaries: <strong className="text-gray-700">{scheme.beneficiaries}</strong></span>
      <span>📅 Launched: <strong className="text-gray-700">{scheme.launched}</strong></span>
    </div>
  </div>
);

export default function PopularSchemes() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-gov-light-blue/20 text-gov-dark-blue text-xs font-semibold uppercase tracking-wider mb-3">
            Government Initiatives
          </span>
          <h2 className="text-3xl font-bold text-gov-dark-blue sm:text-4xl">
            Popular Welfare Schemes
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-[#f59e0b]"></div>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gov-slate leading-relaxed">
            Explore the most-accessed citizen welfare programmes. Hover over any scheme to learn more.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <Tooltip
              key={scheme.name}
              content={<SchemeTooltipContent scheme={scheme} />}
              containerClassName="w-full"
            >
              <div className={`group cursor-pointer rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 ${scheme.accent}`}>
                {/* Scheme Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={scheme.img}
                    alt={scheme.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${scheme.badgeColor}`}>
                    {scheme.category}
                  </span>
                </div>

                {/* Scheme Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gov-dark-blue transition-colors">
                    {scheme.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                    {scheme.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      👥 {scheme.beneficiaries}
                    </span>
                    <Link
                      href="/register"
                      className="inline-flex items-center text-sm font-semibold text-gov-dark-blue hover:text-gov-mid-blue transition-colors"
                    >
                      Apply
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
}
