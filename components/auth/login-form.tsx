"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [_error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });
      toast.success("Welcome back! Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
        <p className="text-sm text-slate-600">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-xs text-slate-600 font-medium mb-1 block"
          >
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
          <label
            htmlFor="password"
            className="text-xs text-slate-600 font-medium mb-1 block"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              className="w-full h-12 rounded-xl border border-slate-300 px-4 pr-12 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
        >
          Sign in
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/"
          className="text-slate-600 hover:text-green-600 font-medium"
        >
          ← Back
        </Link>
        <div className="text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-green-600 hover:text-green-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
