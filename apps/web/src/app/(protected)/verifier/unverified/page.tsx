"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface UnverifiedCitizen {
  _id: string;
  user: { _id: string; name: string; email: string };
  income: number;
  employmentStatus: string;
  familySize: number;
  healthConditions: string[];
  location: string;
  housingType: string;
  phoneNumber: string;
  vulnerabilityScore: number;
  verificationStatus: string;
}

export default function VerifierUnverifiedPage() {
  const [citizens, setCitizens] = useState<UnverifiedCitizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUnverified = async () => {
    try {
      const res = await api.get("/api/verifier/unverified");
      setCitizens(res.data.citizens);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverified();
  }, []);

  const handleVerify = async (profileId: string, status: "verified" | "rejected") => {
    setActionLoading(profileId);
    try {
      await api.post("/api/verifier/verify", { citizenProfileId: profileId, status });
      setCitizens((prev) => prev.filter((c) => c._id !== profileId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-sm text-zinc-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Unverified Citizens</h1>

      {citizens.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-400">No unverified citizen profiles at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {citizens.map((c) => (
            <div
              key={c._id}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{c.user?.name}</h3>
                  <p className="text-sm text-zinc-500">{c.user?.email}</p>
                </div>
                <span className="rounded bg-yellow-50 px-2 py-0.5 text-xs font-medium uppercase text-yellow-600">
                  Pending
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <span className="text-zinc-400">Income:</span>{" "}
                  <span className="font-medium text-zinc-700">{c.income}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Employment:</span>{" "}
                  <span className="font-medium capitalize text-zinc-700">{c.employmentStatus}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Family Size:</span>{" "}
                  <span className="font-medium text-zinc-700">{c.familySize}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Location:</span>{" "}
                  <span className="font-medium text-zinc-700">{c.location || "—"}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Housing:</span>{" "}
                  <span className="font-medium capitalize text-zinc-700">{c.housingType}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Vulnerability:</span>{" "}
                  <span className="font-medium text-zinc-700">{c.vulnerabilityScore}/100</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(c._id, "verified")}
                  disabled={actionLoading === c._id}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleVerify(c._id, "rejected")}
                  disabled={actionLoading === c._id}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
