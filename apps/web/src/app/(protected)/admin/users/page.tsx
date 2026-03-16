"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  Search, Pencil, Trash2, Shield, Mail, Calendar,
  AlertTriangle, X, Check, ChevronLeft, ChevronRight,
} from "lucide-react";

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function AdminStaffPage() {
  const [allUsers, setAllUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [page, setPage] = useState(1);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: "verifier" });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const res = await api.get(`/api/admin/users?${params.toString()}`);
      setAllUsers(res.data.users);
      setPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch verifiers");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Pagination
  const totalPages = Math.ceil(allUsers.length / PAGE_SIZE);
  const paginatedUsers = allUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startEdit = (u: StaffUser) => {
    setEditingId(u._id);
    setEditName(u.name);
    setEditEmail(u.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const saveEdit = async (userId: string) => {
    setActionLoading(`${userId}-edit`);
    try {
      await api.put("/api/admin/users", { userId, action: "edit", name: editName, email: editEmail });
      cancelEdit();
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this verifier?")) return;
    setActionLoading(`${userId}-delete`);
    try {
      await api.put("/api/admin/users", { userId, action: "delete" });
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove verifier");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue tracking-tight">
            Manage Staff (Verifiers)
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Edit or remove verifier accounts
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-gov-light-blue/20 text-gov-dark-blue text-sm font-semibold">
          {allUsers.length} Verifiers
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue transition-colors"
            />
          </div>
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
        ) : allUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Shield className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No verifiers found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Verifier</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        {editingId === u._id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border border-gov-mid-blue bg-white px-3 py-1.5 text-sm text-gov-dark-blue font-semibold focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gov-dark-blue/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-gov-dark-blue">
                                {u.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <p className="font-semibold text-gov-dark-blue text-sm">{u.name}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {editingId === u._id ? (
                          <input
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full rounded-lg border border-gov-mid-blue bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40"
                          />
                        ) : (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-gray-400" /> {u.email}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {editingId === u._id ? (
                            <>
                              <button
                                onClick={() => saveEdit(u._id)}
                                disabled={actionLoading === `${u._id}-edit`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(u)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gov-dark-blue hover:bg-gov-dark-blue hover:text-white transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(u._id)}
                                disabled={actionLoading === `${u._id}-delete`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-xs font-medium text-red-700 hover:bg-red-600 hover:text-white transition-colors border border-red-200 disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
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
              {paginatedUsers.map((u) => (
                <div key={u._id} className="p-4 space-y-3">
                  {editingId === u._id ? (
                    <div className="space-y-2">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" className="w-full rounded-lg border border-gov-mid-blue px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40" />
                      <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-gov-mid-blue px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40" />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(u._id)} className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium">Save</button>
                        <button onClick={cancelEdit} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-500">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gov-dark-blue/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-gov-dark-blue">{u.name?.charAt(0)?.toUpperCase() || "?"}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gov-dark-blue text-sm">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(u)} className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gov-dark-blue">Edit</button>
                        <button onClick={() => handleDelete(u._id)} className="px-3 py-2 rounded-lg bg-red-50 text-xs font-medium text-red-700 border border-red-200">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} ({allUsers.length} verifiers)
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
