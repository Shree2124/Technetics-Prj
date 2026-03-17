"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  Check,
  X,
  Info,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const categories = [
  "All",
  "Agriculture",
  "Healthcare",
  "Housing",
  "Education",
  "Finance",
  "Energy",
  "Women & Child",
  "Social Welfare",
  "Employment",
  "Rural Development",
];

const ITEMS_PER_PAGE = 6;

const checkEligibility = (scheme, profile) => {
  if (!profile || !profile.age) return { isEligible: false, checks: [] };

  const { eligibility } = scheme;
  const checks = [];
  let metCriteria = 0;

  const addCheck = (criterion, isMet) => {
    checks.push({ criterion, met: isMet });
    if (isMet) metCriteria++;
  };

  if (eligibility.minAge !== undefined)
    addCheck(
      `Minimum Age: ${eligibility.minAge}`,
      profile.age >= eligibility.minAge,
    );
  if (eligibility.maxAge !== undefined)
    addCheck(
      `Maximum Age: ${eligibility.maxAge}`,
      profile.age <= eligibility.maxAge,
    );
  if (eligibility.maxIncome !== undefined)
    addCheck(
      `Maximum Income: ₹${eligibility.maxIncome.toLocaleString()}`,
      profile.income <= eligibility.maxIncome,
    );
  if (eligibility.ruralOnly)
    addCheck("Must be in a rural area", profile.ruralFlag === true);
  if (eligibility.minFamilySize !== undefined)
    addCheck(
      `Minimum Family Size: ${eligibility.minFamilySize}`,
      profile.familySize >= eligibility.minFamilySize,
    );

  return { isEligible: metCriteria === checks.length, checks };
};

const SchemeCard = ({ scheme, profile }) => {
  const { isEligible, checks } = useMemo(
    () => checkEligibility(scheme, profile),
    [scheme, profile],
  );
  const [showDetails, setShowDetails] = useState(false);

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
    <div
      className={`rounded-xl border ${isEligible ? "border-green-200" : "border-gray-200"} bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColors[scheme.category] || "bg-gray-100 text-gray-600"}`}
          >
            {scheme.category}
          </span>
          <span
            className={`text-xs font-semibold flex items-center gap-1.5 ${isEligible ? "text-green-600" : "text-gray-500"}`}
          >
            {isEligible ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}{" "}
            {isEligible ? "Eligible" : "Not Eligible"}
          </span>
        </div>
        <h3 className="text-base font-bold text-gov-dark-blue mb-1">
          {scheme.schemeName}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-1">
          {scheme.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 border-t border-gray-100 pt-3">
          <span>
            <strong>Benefit:</strong> ₹{scheme.benefitAmount.toLocaleString()}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-gov-mid-blue hover:underline"
          >
            <Info className="h-3 w-3" /> Details
          </button>
        </div>

        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs space-y-1.5">
            <h4 className="font-bold text-gray-600">Eligibility Criteria:</h4>
            {checks.map((c, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 ${c.met ? "text-green-700" : "text-red-700"}`}
              >
                {c.met ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}{" "}
                {c.criterion}
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/citizen/schemes/apply?id=${scheme._id}&name=${encodeURIComponent(scheme.schemeName)}`}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isEligible ? "bg-gov-dark-blue text-white hover:bg-gov-dark-blue/90" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          aria-disabled={!isEligible}
          onClick={(e) => !isEligible && e.preventDefault()}
        >
          Apply Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default function SchemesPage() {
  const [allSchemes, setAllSchemes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [schemesRes, profileRes] = await Promise.all([
          api.get("/api/schemes"),
          api.get("/api/citizen/profile"),
        ]);
        setAllSchemes(schemesRes.data);
        setProfile(profileRes.data.profile);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (loading) return [];
    return allSchemes.filter((s) => {
      const matchSearch =
        s.schemeName.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || s.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory, allSchemes, loading]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue">
          Browse Welfare Schemes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Search and apply for government welfare programmes
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none rounded-lg border border-gray-200 bg-white pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-400">
        Showing {paginated.length} of {filtered.length} scheme
        {filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Scheme Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((scheme) => (
          <SchemeCard key={scheme._id} scheme={scheme} profile={profile} />
        ))}
      </div>

      {paginated.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            No schemes match your criteria.
          </p>
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
