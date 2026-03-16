"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  ArrowLeft, CheckCircle, XCircle, ShieldAlert, Clock, User,
  FileText, IndianRupee, MapPin, Phone, Mail, Calendar,
  AlertTriangle, Gauge, Shield,
} from "lucide-react";

interface ApplicationDetail {
  _id: string;
  status: string;
  fraudScore?: number;
  vulnerabilityScore?: number;
  appliedAt?: string;
  submittedAt?: string;
  verifiedAt?: string;
  adminApprovedAt?: string;
  createdAt: string;
  citizenId?: {
    _id: string;
    fullName?: string;
    phone?: string;
    age?: number;
    gender?: string;
    income?: number;
    familySize?: number;
    employmentStatus?: string;
    address?: { state?: string; district?: string; village?: string; pincode?: string };
    userId?: { name: string; email: string };
  };
  schemeId?: {
    _id: string;
    schemeName: string;
    category: string;
    description: string;
    benefitAmount: number;
    eligibility?: {
      minAge?: number;
      maxAge?: number;
      maxIncome?: number;
      ruralOnly?: boolean;
      minFamilySize?: number;
    };
  };
  assignedVerifier?: { name: string; email: string };
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: "text-gray-600", bg: "bg-gray-100", label: "Draft" },
  submitted: { color: "text-amber-700", bg: "bg-amber-50 border border-amber-200", label: "Pending" },
  under_review: { color: "text-blue-700", bg: "bg-blue-50 border border-blue-200", label: "Under Review" },
  verified: { color: "text-cyan-700", bg: "bg-cyan-50 border border-cyan-200", label: "Verified" },
  approved: { color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200", label: "Approved" },
  rejected: { color: "text-red-700", bg: "bg-red-50 border border-red-200", label: "Rejected" },
  fraud_flagged: { color: "text-rose-700", bg: "bg-rose-50 border border-rose-200", label: "Fraud Flagged" },
};

export default function AdminApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    api.get(`/api/admin/applications/${id}`)
      .then((res) => setApp(res.data.application))
      .catch((err) => setError(err.response?.data?.message || "Failed to load application"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action.replace("_", " ")} this application?`)) return;
    setActionLoading(action);
    try {
      const res = await api.put(`/api/admin/applications/${id}`, { action });
      setApp(res.data.application);
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-500">
        <AlertTriangle className="h-10 w-10 mb-3" />
        <p className="text-sm font-medium">{error || "Application not found"}</p>
        <Link href="/admin/applications" className="mt-4 text-sm text-gov-mid-blue hover:underline">
          ← Back to Applications
        </Link>
      </div>
    );
  }

  const citizen = app.citizenId;
  const scheme = app.schemeId;
  const sc = statusConfig[app.status] || statusConfig.draft;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gov-dark-blue transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gov-dark-blue">Application Details</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">ID: {app._id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${sc.bg} ${sc.color}`}>
          {sc.label}
        </span>
      </div>

      {/* Admin Actions */}
      {(app.status !== "approved" && app.status !== "rejected" && app.status !== "fraud_flagged") && (
        <div className="rounded-xl border-2 border-dashed border-gov-mid-blue/30 bg-gov-light-blue/10 p-5">
          <h2 className="text-sm font-bold text-gov-dark-blue mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Admin Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAction("approve")}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <CheckCircle className="h-4 w-4" />
              {actionLoading === "approve" ? "Approving..." : "Approve Application"}
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <XCircle className="h-4 w-4" />
              {actionLoading === "reject" ? "Rejecting..." : "Reject Application"}
            </button>
            <button
              onClick={() => handleAction("flag_fraud")}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <ShieldAlert className="h-4 w-4" />
              {actionLoading === "flag_fraud" ? "Flagging..." : "Flag as Fraud"}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Citizen Info */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gov-dark-blue px-5 py-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <User className="h-4 w-4" /> Citizen Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={citizen?.userId?.name || citizen?.fullName || "—"} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={citizen?.userId?.email || "—"} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={citizen?.phone || "—"} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="District" value={citizen?.address?.district || "—"} />
            <InfoRow icon={<IndianRupee className="h-4 w-4" />} label="Income" value={citizen?.income ? `₹${citizen.income.toLocaleString("en-IN")}` : "—"} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Family Size" value={citizen?.familySize?.toString() || "—"} />
          </div>
        </div>

        {/* Scheme Info */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gov-mid-blue px-5 py-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="h-4 w-4" /> Scheme Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Scheme Name" value={scheme?.schemeName || "—"} />
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Category" value={scheme?.category || "—"} />
            <InfoRow icon={<IndianRupee className="h-4 w-4" />} label="Benefit Amount" value={scheme?.benefitAmount ? `₹${scheme.benefitAmount.toLocaleString("en-IN")}` : "—"} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{scheme?.description || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scores & Timeline */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scores */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gov-dark-blue mb-4 flex items-center gap-2">
            <Gauge className="h-4 w-4" /> Risk Assessment
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Fraud Score</p>
              <p className={`text-2xl font-bold mt-1 ${
                (app.fraudScore || 0) > 70 ? "text-red-600" :
                (app.fraudScore || 0) > 40 ? "text-amber-600" : "text-green-600"
              }`}>
                {app.fraudScore ?? 0}%
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Vulnerability</p>
              <p className="text-2xl font-bold mt-1 text-gov-dark-blue">
                {app.vulnerabilityScore ?? 0}/100
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gov-dark-blue mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Timeline
          </h2>
          <div className="space-y-3">
            <TimelineItem
              label="Created"
              date={app.createdAt}
              active
            />
            <TimelineItem
              label="Submitted"
              date={app.submittedAt}
              active={!!app.submittedAt}
            />
            <TimelineItem
              label="Verified"
              date={app.verifiedAt}
              active={!!app.verifiedAt}
            />
            <TimelineItem
              label="Admin Decision"
              date={app.adminApprovedAt}
              active={!!app.adminApprovedAt}
            />
          </div>
        </div>
      </div>

      {/* Verifier Info */}
      {app.assignedVerifier && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gov-dark-blue mb-3">Assigned Verifier</h2>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gov-dark-blue/10 flex items-center justify-center">
              <User className="h-5 w-5 text-gov-dark-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gov-dark-blue">{app.assignedVerifier.name}</p>
              <p className="text-xs text-gray-400">{app.assignedVerifier.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Sub-components ──────────────────────────────────────── */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-md bg-gray-100 text-gray-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({ label, date, active }: { label: string; date?: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full shrink-0 ${active ? "bg-gov-mid-blue" : "bg-gray-200"}`} />
      <div className="flex-1 flex items-center justify-between">
        <p className={`text-sm font-medium ${active ? "text-gov-dark-blue" : "text-gray-400"}`}>{label}</p>
        <p className="text-xs text-gray-400">
          {date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
        </p>
      </div>
    </div>
  );
}
