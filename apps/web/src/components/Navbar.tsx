"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/SidebarContext";
import { LogOut, Menu, Bell, Search, UserCircle, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { toggleMobile } = useSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobile}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gov-dark-blue transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Branding */}
        <div className="flex items-center gap-2.5">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <Image
              src="/WelfAilogo.png"
              alt="WelfAI Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-base font-bold text-gov-dark-blue tracking-tight hidden sm:block">
              WelfAI
            </span>
          </Link>
        </div>
      </div>

      {/* Center — Search (hidden on small) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes, applications..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-mid-blue/40 focus:border-gov-mid-blue transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {isAuthenticated && user ? (
          <>
            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gov-dark-blue transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gov-dark-blue/10 flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-gov-dark-blue" />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-gov-mid-blue leading-tight">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-gov-dark-blue/10 text-[10px] font-bold uppercase tracking-wider text-gov-dark-blue">
                      {user.role} Account
                    </span>
                  </div>
                  <Link
                    href="/citizen/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="h-4 w-4 text-gray-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-gov-dark-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gov-dark-blue/90"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
