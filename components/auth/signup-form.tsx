"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
          <span className="text-2xl">🌱</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Create an account</h2>
        <p className="text-sm text-slate-600">Start your plant care journey today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="text-xs text-slate-600 font-medium mb-1 block">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            autoComplete="name"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs text-slate-600 font-medium mb-1 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs text-slate-600 font-medium mb-1 block">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={8}
            autoComplete="new-password"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-xs text-slate-600 font-medium mb-1 block">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="new-password"
            className="w-full h-12 rounded-xl border border-slate-300 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
        >
          Create account
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <Link href="/" className="text-slate-600 hover:text-green-600 font-medium">
          ← Back
        </Link>
        <div className="text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
