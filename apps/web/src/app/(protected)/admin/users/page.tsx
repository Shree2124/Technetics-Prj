"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/admin/users");
        setUsers(res.data.users);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-sm text-zinc-500">Loading users...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Manage Users</h1>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium text-zinc-500">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Email</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Role</th>
              <th className="px-4 py-3 font-medium text-zinc-500">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-900">{u.name}</td>
                <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium uppercase text-zinc-500">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-6 text-center text-sm text-zinc-400">No users found.</p>
        )}
      </div>
    </div>
  );
}
