"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/lib/axios";

interface Profile {
  _id: string;
  income: number;
  employmentStatus: string;
  familySize: number;
  healthConditions: string[];
  location: string;
  housingType: string;
  phoneNumber: string;
  documents: string[];
  vulnerabilityScore: number;
  verificationStatus: string;
}

export default function CitizenProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    income: 0,
    employmentStatus: "unemployed",
    familySize: 1,
    healthConditions: "",
    location: "",
    housingType: "other",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/citizen/profile");
        const p = res.data.profile;
        setProfile(p);
        setForm({
          income: p.income,
          employmentStatus: p.employmentStatus,
          familySize: p.familySize,
          healthConditions: p.healthConditions?.join(", ") || "",
          location: p.location,
          housingType: p.housingType,
          phoneNumber: p.phoneNumber,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        healthConditions: form.healthConditions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await api.put("/api/citizen/profile", payload);
      setProfile(res.data.profile);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-zinc-500">Loading profile...</div>;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">My Profile</h1>

      {profile && (
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${
              profile.verificationStatus === "verified"
                ? "bg-green-50 text-green-600"
                : profile.verificationStatus === "rejected"
                  ? "bg-red-50 text-red-600"
                  : "bg-yellow-50 text-yellow-600"
            }`}
          >
            {profile.verificationStatus}
          </span>
          <span className="text-sm text-zinc-400">
            Vulnerability Score: {profile.vulnerabilityScore}/100
          </span>
        </div>
      )}

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Income</label>
            <input
              type="number"
              value={form.income}
              onChange={(e) => setForm({ ...form, income: Number(e.target.value) })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Employment Status
            </label>
            <select
              value={form.employmentStatus}
              onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            >
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Family Size</label>
            <input
              type="number"
              min={1}
              value={form.familySize}
              onChange={(e) => setForm({ ...form, familySize: Number(e.target.value) })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Housing Type</label>
            <select
              value={form.housingType}
              onChange={(e) => setForm({ ...form, housingType: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            >
              <option value="owned">Owned</option>
              <option value="rented">Rented</option>
              <option value="homeless">Homeless</option>
              <option value="government">Government</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              placeholder="City, State"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Phone Number</label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              placeholder="+1234567890"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Health Conditions <span className="text-zinc-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.healthConditions}
              onChange={(e) => setForm({ ...form, healthConditions: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              placeholder="diabetes, hypertension"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
