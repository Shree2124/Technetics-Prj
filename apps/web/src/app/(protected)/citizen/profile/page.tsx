"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAppSelector } from "@/store/hooks";
import api from "@/lib/axios";
import {
  UserCircle, Mail, Phone, MapPin, Briefcase, Home, GraduationCap,
  Heart, AlertTriangle, ShieldCheck, IndianRupee, Users, FileText,
  CheckCircle, Save, Loader2,
} from "lucide-react";

interface ProfileData {
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

export default function CitizenProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "financial" | "documents">("personal");

  const [form, setForm] = useState({
    income: 0,
    employment_status: "unemployed",
    family_size: 1,
    education_level: "primary",
    housing_type: "temporary",
    disaster_risk: "medium",
    health_condition: false,
    address: "",
    district: "",
    phoneNumber: "",
  });

  useEffect(() => {
    api.get("/api/citizen/profile")
      .then((res) => {
        const p = res.data.profile;
        setProfile(p);
        setForm({
          income: p.income || 0,
          employment_status: p.employment_status || "unemployed",
          family_size: p.family_size || 1,
          education_level: p.education_level || "primary",
          housing_type: p.housing_type || "temporary",
          disaster_risk: p.disaster_risk || "medium",
          health_condition: p.health_condition || false,
          address: p.address || "",
          district: p.district || "",
          phoneNumber: p.phoneNumber || "",
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put("/api/citizen/profile", form);
      setProfile(res.data.profile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  const statusColor = profile?.verificationStatus === "verified"
    ? "bg-green-100 text-green-700 border-green-200"
    : profile?.verificationStatus === "rejected"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-700 border-amber-200";

  const tabs = [
    { key: "personal" as const, label: "Personal Info", icon: UserCircle },
    { key: "financial" as const, label: "Financial", icon: IndianRupee },
    { key: "documents" as const, label: "Documents", icon: FileText },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="rounded-xl bg-gradient-to-r from-gov-dark-blue to-gov-mid-blue p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <UserCircle className="h-10 w-10 text-white/90" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user?.name || "Citizen"}</h1>
            <p className="text-sm text-white/70 mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                {profile?.verificationStatus || "pending"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                Score: {profile?.vulnerabilityScore || 0}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" /> {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-gov-dark-blue text-gov-dark-blue"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          {activeTab === "personal" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+91 XXXXX XXXXX" className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">District</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="Your district" className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Full Address</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} placeholder="Complete residential address" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Family Size</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="number" min={1} value={form.family_size} onChange={(e) => setForm({ ...form, family_size: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Education Level</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })} className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue appearance-none bg-white">
                    <option value="none">None</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Post Graduate</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={form.health_condition} onChange={(e) => setForm({ ...form, health_condition: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-gov-dark-blue focus:ring-gov-mid-blue" />
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-700">I have a pre-existing health condition</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Monthly Income (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="number" value={form.income} onChange={(e) => setForm({ ...form, income: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Employment Status</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select value={form.employment_status} onChange={(e) => setForm({ ...form, employment_status: e.target.value })} className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue appearance-none bg-white">
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="informal">Informal Sector</option>
                    <option value="self_employed">Self Employed</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Housing Type</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select value={form.housing_type} onChange={(e) => setForm({ ...form, housing_type: e.target.value })} className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue appearance-none bg-white">
                    <option value="permanent">Permanent</option>
                    <option value="temporary">Temporary</option>
                    <option value="rented">Rented</option>
                    <option value="homeless">Homeless</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gov-dark-blue">Disaster Risk Zone</label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select value={form.disaster_risk} onChange={(e) => setForm({ ...form, disaster_risk: e.target.value })} className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue appearance-none bg-white">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Your uploaded & verified documents:</p>
              {profile?.documents && profile.documents.length > 0 ? (
                <div className="space-y-2">
                  {profile.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium capitalize">{doc.replace(/_/g, " ").replace(".pdf", "")}</span>
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Uploaded</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No documents uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* Save Button (only for personal & financial tabs) */}
          {activeTab !== "documents" && (
            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-gov-dark-blue px-6 py-2.5 text-sm font-medium text-white hover:bg-gov-dark-blue/90 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
