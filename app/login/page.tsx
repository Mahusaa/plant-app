import { Leaf } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <Leaf className="h-10 w-10" />
            <span className="text-2xl font-bold">PlantCare</span>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
