"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { LayoutDashboard, Users, UserCheck, Shield, CheckCircle, UserCircle } from "lucide-react";

// Add icons to links for better visual hierarchy typical of dashboards
const adminLinks = [
  { href: "/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Staff", icon: Users },
  { href: "/admin/citizens", label: "Manage Citizens", icon: Shield },
];

const verifierLinks = [
  { href: "/dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/verifier/unverified", label: "Pending Verifications", icon: CheckCircle },
];

const citizenLinks = [
  { href: "/dashboard", label: "My Applications", icon: LayoutDashboard },
  { href: "/citizen/profile", label: "Citizen Profile", icon: UserCircle },
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
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
      <div className="bg-gov-dark-blue px-6 py-4 flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-gov-light-blue mb-1">
          {user.role} Dashboard
        </span>
        <span className="text-sm text-white/90">
          Digital Welfare Portal
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="flex flex-col gap-1 px-3">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h3>
          </div>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gov-light-blue/20 text-gov-dark-blue border-l-4 border-gov-dark-blue"
                    : "text-gray-600 hover:bg-gov-light-gray hover:text-gov-dark-blue border-l-4 border-transparent"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-gov-dark-blue" : "text-gray-400 group-hover:text-gov-mid-blue"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="h-4 w-4 text-gov-mid-blue" />
          <span>Secure Session Active</span>
        </div>
      </div>
    </aside>
  );
}
