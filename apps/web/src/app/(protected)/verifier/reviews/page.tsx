"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Search, Filter, Shield, ChevronLeft, ChevronRight, UserCircle, MapPin, Calendar } from "lucide-react";

interface Citizen {
  _id: string;
  userId: { _id: string; email: string };
  fullName: string;
  aadhaarNumber: string;
  address: { district: string; state: string };
  verificationStatus: string;
  vulnerabilityScore: number;
  createdAt: string;
}

export default function VerifierReviewsPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCitizens = async (currentPage: number, currentSearch: string, currentStatus: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/verifier/citizens`, {
        params: { page: currentPage, limit: 10, search: currentSearch, status: currentStatus }
      });
      setCitizens(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setTotal(res.data.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch citizens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens(page, search, status);
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCitizens(1, search, status);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue">Applications Review</h1>
          <p className="text-sm text-gray-500 mt-1">Review and process citizen profile verifications here.</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>{total} Profiles Found</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name, Aadhaar, or District..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40"
          />
        </form>
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40"
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* Table Area */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
          </div>
        ) : citizens.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <UserCircle className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Citizens Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Citizen Name</th>
                  <th className="px-6 py-4">Aadhaar No.</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Submitted On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {citizens.map((citizen) => (
                  <tr key={citizen._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gov-dark-blue/10 flex items-center justify-center text-gov-dark-blue font-bold flex-shrink-0">
                          {citizen.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{citizen.fullName || "Incomplete Profile"}</div>
                          <div className="text-xs text-gray-500">{citizen.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {citizen.aadhaarNumber ? `XXXX-XXXX-${citizen.aadhaarNumber.slice(-4)}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {citizen.address?.district ? (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span className="truncate max-w-[120px]">{citizen.address.district}</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(citizen.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        citizen.verificationStatus === "verified" ? "bg-green-100 text-green-700" :
                        citizen.verificationStatus === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {citizen.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/verifier/reviews/${citizen._id}`}
                        className="inline-flex items-center rounded-lg bg-gov-dark-blue/5 px-3 py-1.5 text-xs font-semibold text-gov-dark-blue transition-colors hover:bg-gov-dark-blue hover:text-white"
                      >
                        Review Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between mt-auto">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, total)}</span> of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(p => p - 1)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="px-3 py-1 text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </div>
              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
