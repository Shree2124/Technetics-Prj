"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 shadow-sm">
      <Link href={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-bold text-zinc-900">
        WelfareApp
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <span className="hidden text-sm text-zinc-600 sm:inline">
              {user.name}{" "}
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium uppercase text-zinc-500">
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
