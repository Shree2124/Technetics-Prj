"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gov-mid-blue/20 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-8 flex-col items-center justify-center rounded bg-gradient-to-b from-gov-light-blue/20 to-gov-light-gray border border-gov-mid-blue/20 text-[10px] font-bold text-gov-dark-blue shadow-inner">
          <span>GOI</span>
        </div>
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-bold text-gov-dark-blue tracking-tight">
          WelfareApp
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <div className="hidden items-center gap-3 sm:flex border-r border-gray-200 pr-4">
              <UserCircle className="h-8 w-8 text-gov-slate" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gov-dark-blue leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gov-mid-blue">
                  {user.role} Account
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="rounded-md border border-gov-mid-blue px-4 py-2 text-sm font-medium text-gov-dark-blue transition-colors hover:bg-gov-light-gray"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
