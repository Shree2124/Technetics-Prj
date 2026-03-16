"use client";

import { useState } from "react";
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye, Filter, FileText } from "lucide-react";

const statuses = ["All", "Pending", "Under Review", "Approved", "Rejected"];

const dummyApplications = [
  { id: 1, scheme: "PM Kisan Samman Nidhi", appliedDate: "12 Mar 2026", status: "Approved", refNo: "PMKSN-2026-001234" },
  { id: 2, scheme: "Ayushman Bharat (PMJAY)", appliedDate: "28 Feb 2026", status: "Under Review", refNo: "PMJAY-2026-005678" },
  { id: 3, scheme: "PM Awas Yojana – Gramin", appliedDate: "15 Jan 2026", status: "Pending", refNo: "PMAYG-2026-009012" },
  { id: 4, scheme: "National Scholarship Portal", appliedDate: "02 Dec 2025", status: "Rejected", refNo: "NSP-2025-003456" },
  { id: 5, scheme: "PM Mudra Yojana", appliedDate: "10 Mar 2026", status: "Under Review", refNo: "PMMY-2026-007890" },
  { id: 6, scheme: "Ujjwala Yojana 2.0", appliedDate: "05 Mar 2026", status: "Pending", refNo: "UJY-2026-001122" },
  { id: 7, scheme: "Mahatma Gandhi NREGA", appliedDate: "20 Feb 2026", status: "Approved", refNo: "NREGA-2026-003344" },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  "Under Review": { icon: AlertTriangle, color: "text-blue-600", bg: "bg-blue-100" },
  Approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  Rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function ApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = filterStatus === "All"
    ? dummyApplications
    : dummyApplications.filter((a) => a.status === filterStatus);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Track the status of your submitted scheme applications</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["Pending", "Under Review", "Approved", "Rejected"].map((status) => {
          const config = statusConfig[status];
          const count = dummyApplications.filter((a) => a.status === status).length;
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? "All" : status)}
              className={`rounded-xl border p-3 text-left transition-all ${
                filterStatus === status
                  ? "border-gov-mid-blue bg-gov-dark-blue/5 shadow-sm"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg ${config.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold text-gov-dark-blue">{count}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{status}</p>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400">{filtered.length} application{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.map((app) => {
          const config = statusConfig[app.status];
          const Icon = config.icon;
          const isExpanded = expandedId === app.id;

          return (
            <div
              key={app.id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : app.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gov-dark-blue truncate">{app.scheme}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Applied: {app.appliedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color}`}>
                    {app.status}
                  </span>
                  <Eye className={`h-4 w-4 text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs block mb-0.5">Reference No.</span>
                      <span className="font-mono text-gov-dark-blue font-medium">{app.refNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block mb-0.5">Current Status</span>
                      <span className={`font-medium ${config.color}`}>{app.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block mb-0.5">Applied On</span>
                      <span className="font-medium text-gray-700">{app.appliedDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block mb-0.5">Last Updated</span>
                      <span className="font-medium text-gray-700">16 Mar 2026</span>
                    </div>
                  </div>
                  {app.status === "Rejected" && (
                    <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-600">
                      <strong>Reason:</strong> Incomplete income documentation. Please resubmit with updated income certificate.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No applications found with this status.</p>
        </div>
      )}
    </div>
  );
}
