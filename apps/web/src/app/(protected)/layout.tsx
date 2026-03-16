"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NewsTicker from "@/components/landing/NewsTicker";
import { SidebarProvider } from "@/components/SidebarContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading && !fetchAttempted) {
      setFetchAttempted(true);
      dispatch(fetchCurrentUser()).unwrap().catch(() => {
        router.replace("/login");
      });
    }
  }, [dispatch, isAuthenticated, loading, router, fetchAttempted]);

  // After logout: isAuthenticated=false, user=null, not loading → redirect
  useEffect(() => {
    if (!isAuthenticated && !loading && fetchAttempted && !user) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, fetchAttempted, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gov-mid-blue border-t-transparent" />
          <p className="text-sm text-gray-500">Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <NewsTicker />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
