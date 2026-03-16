"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useSidebar } from "@/components/SidebarContext";
import {
  LayoutDashboard, Users, UserCheck, Shield, CheckCircle, UserCircle,
  FileText, Bookmark, ChevronLeft, ChevronRight, X, LogOut,
} from "lucide-react";

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Staff", icon: Users },
  { href: "/admin/citizens", label: "Manage Citizens", icon: Shield },
];

const verifierLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/verifier/unverified", label: "Pending Verifications", icon: CheckCircle },
];

const citizenLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/citizen/schemes", label: "Browse Schemes", icon: FileText },
  { href: "/citizen/applications", label: "My Applications", icon: Bookmark },
  { href: "/citizen/profile", label: "My Profile", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { collapsed, mobileOpen, toggle, closeMobile } = useSidebar();

  if (!user) return null;

  const links =
    user.role === "admin"
      ? adminLinks
      : user.role === "verifier"
        ? verifierLinks
        : citizenLinks;

  const sidebarContent = (
    <>
      {/* Header */}
      <div className={`bg-gov-dark-blue px-4 py-4 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gov-light-blue">
              {user.role} Portal
            </span>
            <span className="text-sm font-medium text-white truncate">
              Digital Welfare
            </span>
          </div>
        )}
        {/* Desktop collapse toggle */}
        <button
          onClick={toggle}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        {/* Mobile close */}
        <button
          onClick={closeMobile}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {!collapsed && (
            <div className="px-3 mb-2">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Navigation
              </h3>
            </div>
          )}
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                title={collapsed ? link.label : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-gov-dark-blue/10 text-gov-dark-blue shadow-sm border border-gov-mid-blue/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gov-dark-blue"
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-gov-dark-blue" : "text-gray-400 group-hover:text-gov-mid-blue"
                  }`}
                />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={`p-3 border-t border-gray-100 bg-gray-50/80 ${collapsed ? "text-center" : ""}`}>
        {collapsed ? (
          <Shield className="h-4 w-4 text-gov-mid-blue mx-auto" />
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5 text-gov-mid-blue flex-shrink-0" />
            <span>Secured Session</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
