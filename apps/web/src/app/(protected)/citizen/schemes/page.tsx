"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

const categories = [
  "All", "Agriculture", "Healthcare", "Housing", "Education",
  "Finance", "Energy", "Women & Child", "Social Welfare", "Employment", "Rural Development",
];

const allSchemes = [
  { id: 1, name: "PM Kisan Samman Nidhi", ministry: "Ministry of Agriculture", category: "Agriculture", description: "Direct income support of ₹6,000/year to small and marginal farmer families.", eligibility: "Land-owning farmer families", amount: "₹6,000/year" },
  { id: 2, name: "Ayushman Bharat (PMJAY)", ministry: "Ministry of Health", category: "Healthcare", description: "Free health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.", eligibility: "SECC-identified families", amount: "₹5,00,000/year" },
  { id: 3, name: "PM Awas Yojana – Gramin", ministry: "Ministry of Rural Development", category: "Housing", description: "Financial assistance for construction of pucca house with basic amenities to rural households.", eligibility: "Houseless/living in kutcha houses", amount: "₹1,20,000–₹1,30,000" },
  { id: 4, name: "National Scholarship Portal", ministry: "Ministry of Education", category: "Education", description: "Centralized portal for scholarship applications from Class 1 to PhD across multiple government schemes.", eligibility: "Students with family income < ₹2.5 lakh", amount: "Varies by scheme" },
  { id: 5, name: "PM Jan Dhan Yojana", ministry: "Ministry of Finance", category: "Finance", description: "Universal banking access with zero-balance BSBD accounts, RuPay debit card, and accident insurance.", eligibility: "Any Indian citizen 10+", amount: "₹10,000 overdraft" },
  { id: 6, name: "Ujjwala Yojana 2.0", ministry: "Ministry of Petroleum", category: "Energy", description: "Free LPG connections and first refill to adult women of poor households to replace unclean cooking fuels.", eligibility: "BPL women (non-SECC)", amount: "Free connection + refill" },
  { id: 7, name: "Beti Bachao Beti Padhao", ministry: "Ministry of WCD", category: "Women & Child", description: "Scheme to address declining child sex ratio through awareness campaigns and multi-sectoral interventions.", eligibility: "Girl child families", amount: "Varies" },
  { id: 8, name: "PM Shram Yogi Maandhan", ministry: "Ministry of Labour", category: "Employment", description: "Voluntary pension scheme for unorganized workers with monthly pension of ₹3,000 after age 60.", eligibility: "Workers with income < ₹15,000/month", amount: "₹3,000/month pension" },
  { id: 9, name: "Mahatma Gandhi NREGA", ministry: "Ministry of Rural Development", category: "Rural Development", description: "Guaranteed 100 days of wage employment per year to rural household adults for unskilled manual work.", eligibility: "Any rural adult", amount: "100 days @ ₹267/day" },
  { id: 10, name: "Atal Pension Yojana", ministry: "Ministry of Finance", category: "Finance", description: "Government-guaranteed pension scheme with fixed pension of ₹1,000–₹5,000 per month from age 60.", eligibility: "Citizens aged 18-40", amount: "₹1,000–₹5,000/month" },
  { id: 11, name: "Sukanya Samriddhi Yojana", ministry: "Ministry of Finance", category: "Women & Child", description: "Small savings scheme for girl child education and marriage expenses with tax benefits under 80C.", eligibility: "Girls below 10 years", amount: "8.2% interest p.a." },
  { id: 12, name: "PM Fasal Bima Yojana", ministry: "Ministry of Agriculture", category: "Agriculture", description: "Comprehensive crop insurance for farmers against crop loss/damage due to natural calamities and pests.", eligibility: "All farmers, loanee & non-loanee", amount: "Up to sum insured" },
  { id: 13, name: "Janani Suraksha Yojana", ministry: "Ministry of Health", category: "Healthcare", description: "Cash assistance to pregnant women for institutional delivery to reduce maternal and infant mortality.", eligibility: "BPL pregnant women", amount: "₹700–₹1,400" },
  { id: 14, name: "PM Mudra Yojana", ministry: "Ministry of Finance", category: "Finance", description: "Collateral-free loans up to ₹10 lakh for non-corporate, micro/small enterprises to promote entrepreneurship.", eligibility: "Non-farm enterprises", amount: "Up to ₹10,00,000" },
  { id: 15, name: "Samagra Shiksha Abhiyan", ministry: "Ministry of Education", category: "Education", description: "Integrated scheme covering school education from pre-primary to Class 12 for inclusive and equitable education.", eligibility: "All school students", amount: "Varies" },
  { id: 16, name: "PM Ujjwala Yojana (Refill)", ministry: "Ministry of Petroleum", category: "Energy", description: "Subsidized LPG refills for Ujjwala beneficiaries to ensure sustained use of clean cooking fuel.", eligibility: "Existing Ujjwala beneficiaries", amount: "₹200 subsidy/refill" },
  { id: 17, name: "National Social Assistance", ministry: "Ministry of Rural Development", category: "Social Welfare", description: "Pension and family benefit schemes for BPL elderly, widows, and disabled persons.", eligibility: "BPL elderly/widows/disabled", amount: "₹200–₹500/month" },
  { id: 18, name: "Stand-Up India", ministry: "Ministry of Finance", category: "Employment", description: "Bank loans between ₹10 lakh–₹1 crore for SC/ST and women entrepreneurs for greenfield enterprises.", eligibility: "SC/ST/Women entrepreneurs", amount: "₹10L–₹1Cr" },
  { id: 19, name: "PM Awas Yojana – Urban", ministry: "Ministry of Housing", category: "Housing", description: "Credit-linked subsidy and affordable housing for economically weaker sections in urban areas.", eligibility: "EWS/LIG/MIG families", amount: "₹2.67 lakh subsidy" },
  { id: 20, name: "Integrated Child Dev. Services", ministry: "Ministry of WCD", category: "Women & Child", description: "Nutrition, health, and education services for children under 6 and pregnant/lactating mothers via Anganwadis.", eligibility: "Children 0-6, pregnant women", amount: "In-kind services" },
];

const ITEMS_PER_PAGE = 6;

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return allSchemes.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || s.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const categoryColors: Record<string, string> = {
    Agriculture: "bg-green-100 text-green-700",
    Healthcare: "bg-blue-100 text-blue-700",
    Housing: "bg-orange-100 text-orange-700",
    Education: "bg-purple-100 text-purple-700",
    Finance: "bg-indigo-100 text-indigo-700",
    Energy: "bg-rose-100 text-rose-700",
    "Women & Child": "bg-pink-100 text-pink-700",
    "Social Welfare": "bg-teal-100 text-teal-700",
    Employment: "bg-cyan-100 text-cyan-700",
    "Rural Development": "bg-lime-100 text-lime-700",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue">Browse Welfare Schemes</h1>
        <p className="text-sm text-gray-500 mt-1">Search and apply for government welfare programmes</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="appearance-none rounded-lg border border-gray-200 bg-white pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-400">
        Showing {paginated.length} of {filtered.length} scheme{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Scheme Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((scheme) => (
          <div key={scheme.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColors[scheme.category] || "bg-gray-100 text-gray-600"}`}>
                  {scheme.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-gov-dark-blue mb-1">{scheme.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <Building2 className="h-3 w-3" /> {scheme.ministry}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-1">{scheme.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4 border-t border-gray-100 pt-3">
                <span><strong>Benefit:</strong> {scheme.amount}</span>
              </div>
              <Link
                href={`/citizen/schemes/apply?id=${scheme.id}&name=${encodeURIComponent(scheme.name)}`}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gov-dark-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-gov-dark-blue/90 transition-colors"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {paginated.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No schemes match your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-gov-dark-blue text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
