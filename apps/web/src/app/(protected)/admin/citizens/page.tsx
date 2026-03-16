"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  Search, Users, CheckCircle, Clock, XCircle, Trash2,
  Phone, MapPin, IndianRupee, AlertTriangle,
  Gauge, ChevronLeft, ChevronRight,
} from "lucide-react";

interface CitizenData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  profile?: {
    _id: string;
    phone?: string;
    income?: number;
    familySize?: number;
    employmentStatus?: string;
    verificationStatus?: string;
    vulnerabilityScore?: number;
    address?: { district?: string; state?: string };
  };
}

const VERIFICATION_TABS = [
  { key: "all", label: "All Citizens", icon: Users },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "verified", label: "Verified", icon: CheckCircle },
  { key: "rejected", label: "Rejected", icon: XCircle },
];

const verificationBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    verified: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
  };
  return map[status] || map.pending;
};

const PAGE_SIZE = 10;

export default function AdminCitizensPage() {
  const [allCitizens, setAllCitizens] = useState<CitizenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState("");
  const [page, setPage] = useState(1);

  const fetchCitizens = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("verification", activeTab);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await api.get(`/api/admin/citizens?${params.toString()}`);
      setAllCitizens(res.data.citizens);
      setPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch citizens");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    fetchCitizens();
  }, [fetchCitizens]);

  const totalPages = Math.ceil(allCitizens.length / PAGE_SIZE);
  const paginatedCitizens = allCitizens.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this citizen?")) return;
    setActionLoading(userId);
    try {
      await api.put("/api/admin/users", { userId, action: "delete" });
      fetchCitizens();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove citizen");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue tracking-tight">
            Manage Citizens
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View and manage all registered citizen accounts
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-gov-light-blue/20 text-gov-dark-blue text-sm font-semibold">
          {allCitizens.length} Citizens
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue transition-colors"
            />
          </div>
        </div>

        {/* Verification Filter Tabs */}
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1 overflow-x-auto">
          {VERIFICATION_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gov-dark-blue text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gov-dark-blue"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : allCitizens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No citizens found</p>
            <p className="text-xs mt-1">Try adjusting your filters or search</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Citizen</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Income</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">District</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Verification</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedCitizens.map((c) => {
                    const p = c.profile;
                    const vStatus = p?.verificationStatus || "pending";
                    return (
                      <tr key={c._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gov-dark-blue/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-gov-dark-blue">
                                {c.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gov-dark-blue text-sm">{c.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500">
                          {p?.phone || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700">
                          {p?.income ? `₹${p.income.toLocaleString("en-IN")}` : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700">
                          {p?.address?.district || "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${verificationBadge(vStatus)}`}>
                            {vStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-semibold text-gov-dark-blue">
                            {p?.vulnerabilityScore ?? 0}/100
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleDelete(c._id)}
                              disabled={actionLoading === c._id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-xs font-medium text-red-700 hover:bg-red-600 hover:text-white transition-colors border border-red-200 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {paginatedCitizens.map((c) => {
                const p = c.profile;
                const vStatus = p?.verificationStatus || "pending";
                return (
                  <div key={c._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gov-dark-blue/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-gov-dark-blue">
                            {c.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gov-dark-blue text-sm">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${verificationBadge(vStatus)}`}>
                        {vStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {p?.phone || "—"}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p?.address?.district || "—"}
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" /> {p?.income ? `₹${p.income.toLocaleString("en-IN")}` : "—"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3 w-3" /> Score: {p?.vulnerabilityScore ?? 0}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(c._id)}
                      disabled={actionLoading === c._id}
                      className="w-full text-center px-3 py-2 rounded-lg bg-red-50 text-xs font-medium text-red-700 border border-red-200 disabled:opacity-50"
                    >
                      Remove Citizen
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} ({allCitizens.length} citizens)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
