"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import api from "@/lib/axios";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Activity,
  IndianRupee,
  Home,
  MapPin,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Gauge,
  UserCheck,
  Shield,
} from "lucide-react";

// ────────────────────────────────
// INTERFACES
// ────────────────────────────────

interface CitizenProfileData {
  income: number;
  employment_status: string;
  family_size: number;
  education_level: string;
  health_condition: boolean;
  housing_type: string;
  disaster_risk: string;
  address: string;
  district: string;
  phoneNumber: string;
  documents: string[];
  vulnerabilityScore: number;
  verificationStatus: string;
}

// ────────────────────────────────
// SHARED COMPONENTS
// ────────────────────────────────

function StatCard({
  title,
  value,
  icon,
  color,
  capitalize,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </p>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
      <p
        className={`text-lg md:text-2xl font-bold text-gov-dark-blue ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3">
      <div className="p-2 rounded-lg bg-gray-100 text-gray-500 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-gov-dark-blue capitalize truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function TabButton({
  name,
  activeTab,
  setActiveTab,
  icon,
}: {
  name: string;
  activeTab: string;
  setActiveTab: (name: string) => void;
  icon: React.ReactNode;
}) {
  const isActive = activeTab === name;
  return (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-all ${
        isActive
          ? "border-gov-dark-blue text-gov-dark-blue"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {icon}
      <span className="capitalize">{name}</span>
    </button>
  );
}

function VulnerabilityAnalysisModal({
  citizen,
  onClose,
}: {
  citizen: any;
  onClose: () => void;
}) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (citizen) {
      api
        .get(`/api/analysis/vulnerability/${citizen._id}`)
        .then((res) => setAnalysis(res.data.analysis))
        .catch((err) =>
          setAnalysis(
            `Failed to load analysis: ${err.response?.data?.detail || err.message}`,
          ),
        )
        .finally(() => setLoading(false));
    }
  }, [citizen]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gov-dark-blue">
            Vulnerability Analysis for {citizen?.userId?.name || "..."}
          </h2>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto prose prose-sm max-w-none">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: analysis.replace(/\n/g, "<br />"),
              }}
            />
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-b-xl text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationsModal({
  citizen,
  recommendations,
  onClose,
}: {
  citizen: any;
  recommendations: any[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gov-dark-blue">
            Scheme Recommendations for {citizen?.userId?.name || "..."}
          </h2>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={rec._id} className="p-3 rounded-lg bg-gray-50">
                  <p className="font-semibold text-gov-dark-blue">
                    {rec.schemeName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              Loading recommendations...
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-b-xl text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────
// ADMIN DASHBOARD TABS
// ────────────────────────────────

function AdminOverviewTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("Failed to load admin stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Citizens"
          value={stats?.totalCitizens?.toLocaleString() || "0"}
          icon={<Users className="h-5 w-5" />}
          color="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Active Schemes"
          value={stats?.activeSchemes?.toString() || "0"}
          icon={<Activity className="h-5 w-5" />}
          color="text-green-600 bg-green-50"
        />
        <StatCard
          title="Total Applications"
          value={stats?.totalApplications?.toLocaleString() || "0"}
          icon={<FileText className="h-5 w-5" />}
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Approved"
          value={stats?.approvedCount?.toString() || "0"}
          icon={<CheckCircle className="h-5 w-5" />}
          color="text-emerald-600 bg-emerald-50"
        />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending"
          value={stats?.pendingCount?.toString() || "0"}
          icon={<Clock className="h-5 w-5" />}
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejectedCount?.toString() || "0"}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="text-red-600 bg-red-50"
        />
        <StatCard
          title="Fraud Flagged"
          value={stats?.flaggedCount?.toString() || "0"}
          icon={<ShieldCheck className="h-5 w-5" />}
          color="text-rose-600 bg-rose-50"
        />
      </div>

      {/* Quick Access */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gov-dark-blue">
            Scheme Applications
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.pendingCount || 0} pending + {stats?.underReviewCount || 0}{" "}
            under review applications need your attention.
          </p>
        </div>
        <Link
          href="/admin/applications"
          className="rounded-lg bg-gov-dark-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gov-dark-blue/90 flex items-center gap-2 shrink-0"
        >
          View All Applications
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function VulnerabilityTab() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  useEffect(() => {
    api
      .get("/api/admin/vulnerable-citizens")
      .then((res) => setCitizens(res.data.citizens))
      .catch((err) => console.error("Failed to load vulnerable citizens", err))
      .finally(() => setLoading(false));
  }, []);

  const handleGetRecommendations = (citizen: any) => {
    setSelectedCitizen(citizen);
    setRecommendations([]); // Clear previous recommendations
    setIsRecModalOpen(true);
    api
      .get(`/api/admin/recommendations?citizenId=${citizen._id}`)
      .then((res) => setRecommendations(res.data.recommendations))
      .catch((err) => console.error("Failed to load recommendations", err));
  };

  const handleViewAnalysis = (citizen: any) => {
    setSelectedCitizen(citizen);
    setIsAnalysisModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3">
        <h2 className="text-sm font-semibold text-gov-dark-blue">
          Top Vulnerable Citizens
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {citizens.map((citizen) => (
          <div
            key={citizen._id}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gov-dark-blue">
                {citizen.userId?.name || "Unnamed Citizen"}
              </p>
              <p className="text-xs text-gray-500">{citizen.district}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-amber-600">
                  {citizen.vulnerabilityScore}%
                </p>
                <p className="text-xs text-gray-400">Vulnerability</p>
              </div>
              <button
                onClick={() => handleViewAnalysis(citizen)}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                View Details
              </button>
              <button
                onClick={() => handleGetRecommendations(citizen)}
                className="rounded-lg bg-gov-dark-blue px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gov-dark-blue/90"
              >
                Get Recommendations
              </button>
            </div>
          </div>
        ))}
      </div>
      {isRecModalOpen && (
        <RecommendationsModal
          citizen={selectedCitizen}
          recommendations={recommendations}
          onClose={() => setIsRecModalOpen(false)}
        />
      )}
      {isAnalysisModalOpen && (
        <VulnerabilityAnalysisModal
          citizen={selectedCitizen}
          onClose={() => setIsAnalysisModalOpen(false)}
        />
      )}
    </div>
  );
}

function SchemesTab() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/schemes")
      .then((res) => setSchemes(res.data))
      .catch((err) => console.error("Failed to load schemes", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/add-scheme"
          className="rounded-lg bg-gov-dark-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gov-dark-blue/90"
        >
          Add New Scheme
        </Link>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheme Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benefit Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schemes.map((scheme) => (
              <tr key={scheme._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {scheme.schemeName}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {scheme.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {scheme.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  ₹{scheme.benefitAmount.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${scheme.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {scheme.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FraudTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [citizens, setCitizens] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingCitizens, setLoadingCitizens] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/fraud-applications")
      .then((res) => setApplications(res.data.applications))
      .catch((err) => console.error("Failed to load fraud applications", err))
      .finally(() => setLoadingApps(false));

    api
      .get("/api/admin/citizens?verification=rejected")
      .then((res) => setCitizens(res.data.citizens || []))
      .catch((err) => console.error("Failed to load fraud citizens", err))
      .finally(() => setLoadingCitizens(false));
  }, []);

  if (loadingApps || loadingCitizens) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fraud Applications */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gov-dark-blue">
            Fraud Flagged Applications
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            {applications.length}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div
                key={app._id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gov-dark-blue">
                    {app.userId?.name ||
                      app.citizenId?.userId?.name ||
                      "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {app.schemeId?.name ||
                      app.schemeId?.schemeName ||
                      "Unknown Scheme"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    {app.fraudScore || 0}%
                  </p>
                  <p className="text-xs text-gray-400">Fraud Score</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No fraud flagged applications found.
            </div>
          )}
        </div>
      </div>

      {/* Fraud Citizens */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gov-dark-blue">
            Fraud Flagged Citizens (Rejected)
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            {citizens.length}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {citizens.length > 0 ? (
            citizens.map((c) => {
              const p = c.profile || {};
              return (
                <div
                  key={c._id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gov-dark-blue">
                        {c.name}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                        Fraud
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.email} {p.phone ? `• ${p.phone}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.address?.district ? `${p.address.district}, ` : ""}
                      {p.address?.state || "Unknown Location"}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        {p.vulnerabilityScore ?? 0}/100
                      </p>
                      <p className="text-xs text-gray-400">Score</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No fraud flagged citizens found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────
// ROLE-SPECIFIC DASHBOARDS
// ────────────────────────────────

function TopRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/citizen/recommendations")
      .then((res) => setRecommendations(res.data.recommendations))
      .catch((err) => console.error("Failed to load recommendations", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3">
        <h2 className="text-sm font-semibold text-gov-dark-blue">
          Top Recommended Schemes for You
        </h2>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Loading recommendations...
          </p>
        ) : recommendations.length > 0 ? (
          recommendations.slice(0, 3).map((rec) => (
            <Link
              key={rec._id}
              href={`/citizen/schemes/apply?id=${rec._id}&name=${encodeURIComponent(rec.schemeName)}`}
              className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <p className="font-semibold text-gov-dark-blue">
                {rec.schemeName}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {rec.description}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No specific recommendations at this time. You can browse all
            schemes.
          </p>
        )}
      </div>
    </div>
  );
}

function CitizenDashboard() {
  const [profile, setProfile] = useState<CitizenProfileData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await api.get("/api/citizen/profile");
        setProfile(profileRes.data.profile);
        const statsRes = await api.get("/api/citizen/stats");
        setStats(statsRes.data.stats);
      } catch (error) {
        console.error("Failed to load citizen dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  const statusColor =
    profile?.verificationStatus === "verified"
      ? "bg-green-100 text-green-700 border-green-200"
      : profile?.verificationStatus === "rejected"
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-amber-100 text-amber-700 border-amber-200";

  const riskColor =
    profile?.disaster_risk === "high"
      ? "text-red-600"
      : profile?.disaster_risk === "medium"
        ? "text-amber-600"
        : "text-green-600";

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={stats?.total?.toString() || "0"}
          icon={<FileText className="h-5 w-5" />}
          color="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Pending"
          value={stats?.pending?.toString() || "0"}
          icon={<Clock className="h-5 w-5" />}
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Approved"
          value={stats?.approved?.toString() || "0"}
          icon={<CheckCircle className="h-5 w-5" />}
          color="text-green-600 bg-green-50"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected?.toString() || "0"}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="text-red-600 bg-red-50"
        />
      </div>

      {/* Second Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={<Briefcase />}
          label="Employment"
          value={profile?.employment_status?.replace("_", " ") || "—"}
        />
        <InfoCard
          icon={<Home />}
          label="Housing"
          value={profile?.housing_type || "—"}
        />
        <InfoCard
          icon={<MapPin />}
          label="District"
          value={profile?.district || "—"}
        />
        <InfoCard
          icon={<AlertTriangle className={riskColor} />}
          label="Disaster Risk"
          value={profile?.disaster_risk || "—"}
        />
      </div>

      {/* Quick Links + Recent */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3">
            <h2 className="text-sm font-semibold text-gov-dark-blue">
              Quick Actions
            </h2>
          </div>
          <div className="p-4 space-y-2">
            <Link
              href="/citizen/schemes"
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gov-dark-blue hover:bg-gov-dark-blue/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gov-mid-blue" />
                Browse & Apply for Schemes
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              href="/citizen/applications"
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gov-dark-blue hover:bg-gov-dark-blue/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gov-mid-blue" />
                Track My Applications
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              href="/citizen/profile"
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gov-dark-blue hover:bg-gov-dark-blue/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gov-mid-blue" />
                Update My Profile
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Documents Status */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3">
            <h2 className="text-sm font-semibold text-gov-dark-blue">
              Uploaded Documents
            </h2>
          </div>
          <div className="p-4">
            {profile?.documents && profile.documents.length > 0 ? (
              <div className="space-y-2">
                {profile.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2.5 text-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 capitalize">
                      {doc.replace(/_/g, " ").replace(".pdf", "")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                No documents uploaded yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Recommendations */}
      <TopRecommendations />

      {/* Help Banner */}
      <div className="rounded-xl bg-gradient-to-r from-gov-dark-blue to-gov-mid-blue p-5 flex gap-4 items-start text-white">
        <div className="p-2 bg-white/20 rounded-lg shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Need Help?</h3>
          <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
            Contact your district nodal officer or visit the nearest Common
            Service Centre (CSC) for assistance with application submission and
            document verification.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <TabButton
            name="overview"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<Activity />}
          />
          <TabButton
            name="vulnerability"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<TrendingUp />}
          />
          <TabButton
            name="fraud"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<ShieldCheck />}
          />
          <TabButton
            name="schemes"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={<FileText />}
          />
        </nav>
      </div>

      <div>
        {activeTab === "overview" && <AdminOverviewTab />}
        {activeTab === "vulnerability" && <VulnerabilityTab />}
        {activeTab === "fraud" && <FraudTab />}
        {activeTab === "schemes" && <SchemesTab />}
      </div>
    </div>
  );
}

function VerifierDashboard() {
  const [stats, setStats] = useState({
    pendingCount: 0,
    verifiedCount: 0,
    flaggedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/verifier/stats")
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("Failed to load stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending Verifications"
          value={stats.pendingCount.toString()}
          icon={<Clock className="h-5 w-5" />}
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Total Processed"
          value={stats.verifiedCount.toString()}
          icon={<CheckCircle className="h-5 w-5" />}
          color="text-green-600 bg-green-50"
        />
        <StatCard
          title="Flagged Issues"
          value={stats.flaggedCount.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="text-red-600 bg-red-50"
        />
      </div>

      {/* Quick Access Block */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gov-dark-blue">
            Applications Review
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            You have {stats.pendingCount} pending applications waiting for your
            review.
          </p>
        </div>
        <Link
          href="/verifier/reviews"
          className="rounded-lg bg-gov-dark-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gov-dark-blue/90 flex items-center gap-2"
        >
          Start Reviewing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ────────────────────────────────
// MAIN PAGE COMPONENT
// ────────────────────────────────

/* ─── DASHBOARD PAGE ────────────────────────────────────────────── */

interface CitizenProfileData {
  income: number;
  employment_status: string;
  family_size: number;
  education_level: string;
  health_condition: boolean;
  housing_type: string;
  disaster_risk: string;
  address: string;
  district: string;
  phoneNumber: string;
  documents: string[];
  vulnerabilityScore: number;
  verificationStatus: string;
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gov-dark-blue">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back,{" "}
          <span className="font-semibold text-gov-dark-blue">{user.name}</span>
        </p>
      </div>

      {user.role === "admin" && <AdminDashboard />}
      {user.role === "verifier" && <VerifierDashboard />}
      {user.role === "citizen" && <CitizenDashboard />}
    </div>
  );
}
