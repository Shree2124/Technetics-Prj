"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  ChevronLeft, User, MapPin, Briefcase, FileText, CheckCircle,
  XCircle, AlertTriangle, IndianRupee, Users, Home, GraduationCap,
  Heart, ShieldCheck, Download
} from "lucide-react";

interface ProfileData {
  _id: string;
  userId: { _id: string; email: string; name: string };
  fullName: string;
  aadhaarNumber: string;
  phone: string;
  age: number;
  gender: string;
  address: { state: string; district: string; village: string; pincode: string };
  ruralFlag: boolean;
  income: number;
  employmentStatus: string;
  educationLevel: string;
  familySize: number;
  healthCondition: boolean;
  disability: boolean;
  propertyOwned: number;
  bankAccount: string;
  verificationStatus: string;
  vulnerabilityScore: number;
  documents?: string[];
  createdAt: string;
}

export default function VerifierCitizenReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"verified" | "rejected" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/api/verifier/citizens/${params.id}`)
      .then((res) => setProfile(res.data.citizen))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAction = async (status: "verified" | "rejected") => {
    setActionLoading(status);
    try {
      await api.put(`/api/verifier/citizens/${params.id}`, { status });
      setProfile((prev) => prev ? { ...prev, verificationStatus: status } : null);
      
      // Auto-redirect back to list after short delay on success
      setTimeout(() => {
        router.push("/verifier/reviews");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to mark as ${status}`);
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gov-mid-blue border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-700">Error Loading Profile</h2>
        <p className="text-sm text-red-600 mt-1">{error || "Profile not found"}</p>
        <Link href="/verifier/reviews" className="inline-block mt-4 text-sm font-medium text-gov-dark-blue hover:underline">
          &larr; Back to Review List
        </Link>
      </div>
    );
  }

  const isPending = profile.verificationStatus === "pending";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Navigation */}
      <div>
        <Link href="/verifier/reviews" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gov-dark-blue mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Review List
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gov-dark-blue">Profile Review</h1>
            <p className="text-sm text-gray-500 mt-1">Reviewing details for <span className="font-semibold text-gray-700">{profile.fullName}</span></p>
          </div>
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold uppercase tracking-wider text-sm border ${
            profile.verificationStatus === "verified" ? "bg-green-50 text-green-700 border-green-200" :
            profile.verificationStatus === "rejected" ? "bg-red-50 text-red-700 border-red-200" :
            "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {profile.verificationStatus === "verified" && <CheckCircle className="h-5 w-5" />}
            {profile.verificationStatus === "rejected" && <XCircle className="h-5 w-5" />}
            {profile.verificationStatus === "pending" && <AlertTriangle className="h-5 w-5" />}
            {profile.verificationStatus}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Location */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4 flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-bold text-gov-dark-blue">Identity Information</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <DataField label="Full Legal Name" value={profile.fullName || "Not Provided"} />
              <DataField label="Aadhaar Number" value={profile.aadhaarNumber ? `XXXX-XXXX-${profile.aadhaarNumber.slice(-4)}` : "Not Provided"} />
              <DataField label="Age / Gender" value={`${profile.age || "—"} yrs / ${profile.gender || "—"}`} />
              <DataField label="Phone Number" value={profile.phone || "Not Provided"} />
              <DataField label="Email Address" value={profile.userId?.email || "Not Provided"} />
              <DataField label="Profile Created On" value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "—"} />
            </div>
          </div>

          {/* Location Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-bold text-gov-dark-blue">Location & Address</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <DataField label="State" value={profile.address?.state || "Not Provided"} />
              <DataField label="District" value={profile.address?.district || "Not Provided"} />
              <DataField label="Village/Town" value={profile.address?.village || "Not Provided"} />
              <DataField label="PIN Code" value={profile.address?.pincode || "Not Provided"} />
              <div className="sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  profile.ruralFlag ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {profile.ruralFlag ? "Rural Area" : "Urban Area"}
                </span>
              </div>
            </div>
          </div>

          {/* Socio-Economic Card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4 flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-bold text-gov-dark-blue">Socio-Economic Profile</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
              <DataField label="Annual Income" value={profile.income !== undefined ? `₹${profile.income.toLocaleString('en-IN')}` : "Not Provided"} icon={<IndianRupee className="h-3.5 w-3.5" />} />
              <DataField label="Employment" value={profile.employmentStatus ? profile.employmentStatus.replace("_", " ") : "Not Provided"} capitalize />
              <DataField label="Education" value={profile.educationLevel || "Not Provided"} capitalize icon={<GraduationCap className="h-3.5 w-3.5" />} />
              <DataField label="Family Size" value={profile.familySize !== undefined ? `${profile.familySize} Members` : "Not Provided"} icon={<Users className="h-3.5 w-3.5" />} />
              <DataField label="Health Risk" value={profile.healthCondition ? "High Risk" : "Normal"} color={profile.healthCondition ? "text-red-600" : "text-gray-900"} icon={<Heart className="h-3.5 w-3.5" />} />
              <DataField label="Disability" value={profile.disability ? "Yes" : "No"} color={profile.disability ? "text-red-600" : "text-gray-900"} />
              <DataField label="Bank Account" value={profile.bankAccount ? `Ending in ${profile.bankAccount.slice(-4)}` : "Not Provided"} />
              <DataField label="Property Owned" value={profile.propertyOwned > 0 ? "Yes" : "No"} icon={<Home className="h-3.5 w-3.5" />} />
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Documents */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="rounded-xl border-2 border-gov-dark-blue bg-white shadow-lg overflow-hidden sticky top-6">
            <div className="bg-gov-dark-blue px-5 py-4 text-white">
              <h2 className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Verification Action
              </h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 text-sm">
                <p className="text-gray-600 mb-2">Calculated Vulnerability Score:</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gov-dark-blue">{profile.vulnerabilityScore}</span>
                  <span className="text-gray-400 font-medium mb-1">/ 100</span>
                </div>
              </div>

              {isPending ? (
                <>
                  <p className="text-sm text-gray-500">Please review all data carefully before making a decision.</p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleAction("verified")}
                      disabled={actionLoading !== null}
                      className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === "verified" ? "Saving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleAction("rejected")}
                      disabled={actionLoading !== null}
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === "rejected" ? "Saving..." : "Reject"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm font-medium text-gray-500">This profile has already been processed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents Box */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4 flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-bold text-gov-dark-blue">Uploaded Documents</h2>
            </div>
            <div className="p-5">
              {profile.documents && profile.documents.length > 0 ? (
                <div className="space-y-3">
                  {profile.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gov-mid-blue/30" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 capitalize">{doc.replace(/_/g, " ").replace(".pdf", "")}</p>
                          <p className="text-xs text-gray-400">PDF Document</p>
                        </div>
                      </div>
                      <button className="h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No documents uploaded.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, capitalize, color, icon }: { label: string; value: string | number; capitalize?: boolean; color?: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <div className={`text-sm font-medium flex items-center gap-1.5 ${color || "text-gray-900"} ${capitalize ? "capitalize" : ""}`}>
        {icon && <span className="text-gray-400">{icon}</span>}
        {value || "—"}
      </div>
    </div>
  );
}
