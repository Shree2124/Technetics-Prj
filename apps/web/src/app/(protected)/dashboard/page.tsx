"use client";

import { useAppSelector } from "@/store/hooks";
import { Users, FileText, CheckCircle, Clock, AlertTriangle, ShieldCheck, CreditCard, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gov-dark-blue">Dashboard Overview</h1>
        <p className="text-sm text-gov-slate">
          Welcome back to the portal, <span className="font-semibold text-gov-dark-blue">{user.name}</span>. 
          Your session is <span className="text-green-600 font-medium">secured and active</span>.
        </p>
      </div>

      {/* Role-Specific Content */}
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "verifier" && <VerifierDashboard />}
      {user.role === "citizen" && <CitizenDashboard />}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Citizens" value="1.24M" icon={<Users />} trend="+12.5%" />
        <StatCard title="Active Schemes" value="48" icon={<Activity />} trend="Stable" />
        <StatCard title="Verification Requests" value="3,429" icon={<FileText />} trend="-2.4%" />
        <StatCard title="Funds Disbursed" value="₹450Cr" icon={<CreditCard />} trend="+8.1%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
            <h2 className="text-sm font-semibold text-gov-dark-blue flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gov-mid-blue" />
              Administrative Actions
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <button className="text-left px-4 py-3 rounded-md bg-gov-light-gray hover:bg-gov-mid-blue/10 text-sm font-medium text-gov-dark-blue transition-colors">
              Manage System Users & Roles
            </button>
            <button className="text-left px-4 py-3 rounded-md bg-gov-light-gray hover:bg-gov-mid-blue/10 text-sm font-medium text-gov-dark-blue transition-colors">
              View Audit Logs
            </button>
            <button className="text-left px-4 py-3 rounded-md bg-gov-light-gray hover:bg-gov-mid-blue/10 text-sm font-medium text-gov-dark-blue transition-colors">
              Configure Welfare Parameters
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
            <h2 className="text-sm font-semibold text-gov-dark-blue flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              Real-time System Status
            </h2>
          </div>
          <div className="p-4 flex flex-col divide-y divide-gray-100">
            <div className="flex justify-between py-2 items-center">
              <span className="text-sm text-gray-600">Database Integrity</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Optimal</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-sm text-gray-600">API Gateway</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">99.9% Uptime</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-sm text-gray-600">Sync with UIDAI</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Minor Lag</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifierDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Pending Verifications" value="142" icon={<Clock className="text-amber-500" />} />
        <StatCard title="Processed Today" value="38" icon={<CheckCircle className="text-green-500" />} />
        <StatCard title="Flagged Issues" value="4" icon={<AlertTriangle className="text-red-500" />} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gov-dark-blue flex items-center gap-2">
            <FileText className="h-4 w-4 text-gov-mid-blue" />
            Priority Queue
          </h2>
          <button className="text-xs font-medium text-gov-mid-blue hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-medium">Applicant Name</th>
                <th className="px-4 py-3 font-medium">Scheme Type</th>
                <th className="px-4 py-3 font-medium">Date Submitted</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">Applicant {i}</td>
                  <td className="px-4 py-3 text-gray-600">PM Kisan Scheme</td>
                  <td className="px-4 py-3 text-gray-500">Oct {14 - i}, 2026</td>
                  <td className="px-4 py-3">
                    <button className="text-gov-mid-blue font-medium hover:text-gov-dark-blue">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CitizenDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="col-span-1 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col text-center p-6 items-center">
          <div className="h-16 w-16 bg-gov-light-gray rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gov-mid-blue" />
          </div>
          <h3 className="text-lg font-bold text-gov-dark-blue">Verified Citizen</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">KYC Status: <span className="text-green-600 font-medium">Complete</span></p>
          <button className="mt-auto w-full py-2 rounded border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
            Update Profile
          </button>
        </div>

        {/* Direct Benefits Transfer Status */}
        <div className="col-span-1 lg:col-span-2 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
            <h2 className="text-sm font-semibold text-gov-dark-blue flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gov-mid-blue" />
              Benefit Applications
            </h2>
          </div>
          <div className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50/50">
              <div>
                <p className="font-medium text-sm text-gray-900">National Scholarship Scheme</p>
                <p className="text-xs text-gray-500 mt-0.5">Applied: 12 Aug 2026</p>
              </div>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-50/50">
              <div>
                <p className="font-medium text-sm text-gray-900">Housing Subsidy Yojana</p>
                <p className="text-xs text-gray-500 mt-0.5">Applied: 02 Oct 2026</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Under Review</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Section */}
      <div className="rounded-lg bg-gov-light-blue/10 border border-gov-light-blue/20 p-4 flex gap-4 items-start">
        <div className="p-2 bg-white rounded-full shrink-0">
          <FileText className="h-5 w-5 text-gov-mid-blue" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gov-dark-blue">Need assistance with your applications?</h3>
          <p className="text-xs text-gov-slate mt-1 max-w-2xl">
            You can verify your uploaded documents or contact your district nodal officer directly from the portal. Refer to the standard guidelines for required KYC modifications.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
        <div className="text-gov-mid-blue bg-gov-light-gray p-1.5 rounded-md">
          {icon}
        </div>
      </div>
      <div className="mt-auto flex items-end justify-between">
        <p className="text-2xl font-bold text-gov-dark-blue">{value}</p>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('+') || trend === 'Stable' ? 'text-green-600' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
