"use client";

import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">Dashboard</h1>
      <p className="mb-8 text-sm text-zinc-500">
        Welcome back, <span className="font-medium text-zinc-700">{user.name}</span>
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Role</p>
          <p className="mt-1 text-lg font-semibold capitalize text-zinc-900">{user.role}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{user.email}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Status</p>
          <p className="mt-1 text-lg font-semibold text-green-600">Active</p>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Admin Quick Actions</h2>
          <p className="text-sm text-zinc-500">
            Manage users and citizen profiles from the sidebar navigation.
          </p>
        </div>
      )}

      {user.role === "verifier" && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Verifier Quick Actions</h2>
          <p className="text-sm text-zinc-500">
            Review and verify citizen profiles from the sidebar navigation.
          </p>
        </div>
      )}

      {user.role === "citizen" && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900">Citizen Quick Actions</h2>
          <p className="text-sm text-zinc-500">
            View and update your welfare profile from the sidebar navigation.
          </p>
        </div>
      )}
    </div>
  );
}
