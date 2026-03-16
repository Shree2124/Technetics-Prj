"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface CitizenProfile {
  _id: string;
  user: { _id: string; name: string; email: string };
  income: number;
  employmentStatus: string;
  familySize: number;
  location: string;
  verificationStatus: string;
}

export default function AdminCitizensPage() {
  const [profiles, setProfiles] = useState<CitizenProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const res = await api.get("/api/admin/citizens");
        setProfiles(res.data.profiles);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch citizens");
      } finally {
        setLoading(false);
      }
    };
    fetchCitizens();
  }, []);

  if (loading) return <div className="text-sm text-zinc-500">Loading citizens...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Manage Citizens</h1>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium text-zinc-500">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Email</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Income</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Employment</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Location</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {profiles.map((p) => (
              <tr key={p._id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-900">{p.user?.name}</td>
                <td className="px-4 py-3 text-zinc-600">{p.user?.email}</td>
                <td className="px-4 py-3 text-zinc-600">{p.income}</td>
                <td className="px-4 py-3 text-zinc-600 capitalize">{p.employmentStatus}</td>
                <td className="px-4 py-3 text-zinc-600">{p.location || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${
                      p.verificationStatus === "verified"
                        ? "bg-green-50 text-green-600"
                        : p.verificationStatus === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {p.verificationStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {profiles.length === 0 && (
          <p className="p-6 text-center text-sm text-zinc-400">No citizen profiles found.</p>
        )}
      </div>
    </div>
  );
}
