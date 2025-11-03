import { SignupForm } from "@/components/auth/signup-form";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
            <Leaf className="h-10 w-10" />
            <span className="text-2xl font-bold">PlantCare</span>
          </Link>
          <p className="text-neutral-600 text-sm">Start your plant care journey today</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
