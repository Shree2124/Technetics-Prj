"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError, adminLogin } from "@/store/slices/authSlice";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

  useEffect(() => {
    // Intentionally left blank or can be removed.
    // We are no longer using localStorage for the email, as we now use session vs persistent cookies.
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    // Check if it's an admin login
    if (email === ADMIN_EMAIL) {
      // Use admin login for admin credentials
      const result = await dispatch(adminLogin({ email, password }));
      if (adminLogin.fulfilled.match(result)) {
        router.push("/dashboard");
      }
    } else {
      // Use regular user login for citizens/verifiers
      const result = await dispatch(loginUser({ email, password, rememberMe }));
      if (loginUser.fulfilled.match(result)) {
        router.push("/dashboard");
      }
    }
  };

  return (
    <AuthLayout
      title="Login Portal"
      subtitle="Access your welfare dashboard and tracking portal"
    >
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="citizen@example.com"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between mt-1 mb-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-gov-dark-blue focus:ring-gov-mid-blue"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 font-medium"
            >
              Remember me
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-gov-mid-blue hover:text-gov-dark-blue"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full mt-2"
        >
          {loading ? "Authenticating..." : "Login to Portal"}
        </Button>
      </form>

      <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
        New user?{" "}
        <Link
          href="/register"
          className="font-semibold text-gov-mid-blue hover:text-gov-dark-blue"
        >
          Register for an account
        </Link>
      </div>
    </AuthLayout>
  );
}
