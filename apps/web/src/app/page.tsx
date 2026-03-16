import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          WelfareApp
        </h1>
        <p className="mb-8 max-w-md text-lg text-zinc-500">
          Secure citizen welfare management system with role-based access for
          admins, verifiers, and citizens.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
