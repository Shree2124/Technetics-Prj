"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import {
  Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle,
  Clock, FileText, ChevronLeft, ChevronRight, ShieldAlert,
  Users, MoreHorizontal,
} from "lucide-react";

interface ApplicationItem {
  _id: string;
  status: string;
  fraudScore?: number;
  vulnerabilityScore?: number;
  appliedAt?: string;
  createdAt: string;
  citizenId?: {
    _id: string;
    fullName?: string;
    phone?: string;
    userId?: { name: string; email: string };
  };
  schemeId?: {
    _id: string;
    schemeName: string;
    category: string;
    benefitAmount: number;
  };
}

const STATUS_TABS = [
  { key: "all", label: "All", icon: FileText },
  { key: "submitted", label: "Pending", icon: Clock },
  { key: "under_review", label: "Under Review", icon: Search },
  { key: "verified", label: "Verified", icon: CheckCircle },
  { key: "approved", label: "Approved", icon: CheckCircle },
  { key: "rejected", label: "Rejected", icon: XCircle },
  { key: "fraud_flagged", label: "Flagged", icon: ShieldAlert },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    submitted: "bg-amber-50 text-amber-700 border border-amber-200",
    under_review: "bg-blue-50 text-blue-700 border border-blue-200",
    verified: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
    fraud_flagged: "bg-rose-50 text-rose-700 border border-rose-200",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1 });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("status", activeTab);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("page", page.toString());
      params.set("limit", "15");

      const res = await api.get(`/api/admin/applications?${params.toString()}`);
      setApplications(res.data.applications);
      setPagination(res.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAction = async (id: string, action: string) => {
    try {
      await api.put(`/api/admin/applications/${id}`, { action });
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue tracking-tight">
            Scheme Applications
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and review all citizen scheme applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-gov-light-blue/20 text-gov-dark-blue text-sm font-semibold">
            {pagination.totalCount} Total
          </span>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by citizen name, email, or scheme..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue transition-colors"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => {
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

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No applications found</p>
            <p className="text-xs mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Citizen</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Scheme</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Fraud Score</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Applied</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-semibold text-gov-dark-blue text-sm">
                            {app.citizenId?.userId?.name || app.citizenId?.fullName || "—"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {app.citizenId?.userId?.email || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-700 text-sm">{app.schemeId?.schemeName || "—"}</p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">{app.schemeId?.category || ""}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusBadge(app.status)}`}>
                          {app.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-semibold ${
                          (app.fraudScore || 0) > 70 ? "text-red-600" :
                          (app.fraudScore || 0) > 40 ? "text-amber-600" : "text-green-600"
                        }`}>
                          {app.fraudScore ?? 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {app.appliedAt
                          ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : new Date(app.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        }
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/applications/${app._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gov-dark-blue hover:bg-gov-dark-blue hover:text-white transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          {(app.status === "submitted" || app.status === "verified") && (
                            <>
                              <button
                                onClick={() => handleAction(app._id, "approve")}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-xs font-medium text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(app._id, "reject")}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-xs font-medium text-red-700 hover:bg-red-600 hover:text-white transition-colors border border-red-200"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {applications.map((app) => (
                <div key={app._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gov-dark-blue text-sm">
                        {app.citizenId?.userId?.name || app.citizenId?.fullName || "—"}
                      </p>
                      <p className="text-xs text-gray-400">{app.citizenId?.userId?.email || ""}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(app.status)}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{app.schemeId?.schemeName || "—"}</span>
                    <span>Fraud: {app.fraudScore ?? 0}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/applications/${app._id}`}
                      className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gov-dark-blue hover:bg-gov-dark-blue hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    {(app.status === "submitted" || app.status === "verified") && (
                      <>
                        <button
                          onClick={() => handleAction(app._id, "approve")}
                          className="px-3 py-2 rounded-lg bg-emerald-50 text-xs font-medium text-emerald-700 border border-emerald-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(app._id, "reject")}
                          className="px-3 py-2 rounded-lg bg-red-50 text-xs font-medium text-red-700 border border-red-200"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Page {page} of {pagination.totalPages} ({pagination.totalCount} results)
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
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
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
