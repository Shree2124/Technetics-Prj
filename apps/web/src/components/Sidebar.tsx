"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const adminLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Manage Users" },
  { href: "/admin/citizens", label: "Manage Citizens" },
];

const verifierLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/verifier/unverified", label: "Unverified Citizens" },
];

const citizenLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/citizen/profile", label: "My Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const links =
    user.role === "admin"
      ? adminLinks
      : user.role === "verifier"
        ? verifierLinks
        : citizenLinks;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-zinc-200 bg-zinc-50 py-6">
      <div className="mb-6 px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {user.role} Panel
        </p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
