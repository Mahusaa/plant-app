"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.email?.[0]?.toUpperCase() || "U";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setError("");
    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch("/api/user/update-avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) throw new Error("Failed to upload avatar");

        setSuccess("Avatar updated successfully!");
        setTimeout(() => {
          setSuccess("");
          window.location.reload();
        }, 1500);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload avatar");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
      setIsSigningOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="mx-auto max-w-md">
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}

          {/* User Profile Card */}
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-green-50/30 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-green-200 shadow-lg">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} className="object-cover" />
                  <AvatarFallback className="bg-green-100 text-green-700 text-xl font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-800">{user.name}</div>
                <div className="text-sm text-slate-600">{user.email}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 border border-green-300 text-xs font-medium text-green-700">
                    🌱 Active Member
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Settings Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 px-1">Settings</h2>

            {/* Notifications Toggle */}
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-200 flex items-center justify-center">
                  <span className="text-lg">🔔</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">Notifications</div>
                  <div className="text-xs text-slate-600">Watering reminders & alerts</div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${notifications ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-50 border border-purple-200 flex items-center justify-center">
                  <span className="text-lg">{darkMode ? '🌙' : '☀️'}</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">Dark Mode</div>
                  <div className="text-xs text-slate-600">Coming soon</div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-500' : 'bg-slate-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${darkMode ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </button>

            {/* IoT Devices */}
            <button className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-200 flex items-center justify-center">
                  <span className="text-lg">📡</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">IoT Devices</div>
                  <div className="text-xs text-slate-600">Manage connected sensors</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-600">Coming soon</span>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Account Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 px-1">Account</h2>

            <button className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center">
                  <span className="text-lg">❓</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">Help & Support</div>
                  <div className="text-xs text-slate-600">Get help with the app</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Button
              onClick={handleSignOut}
              loading={isSigningOut}
              className="w-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 hover:from-red-100 hover:to-pink-100 text-red-700 font-semibold"
            >
              {!isSigningOut && <span className="text-lg mr-2">🚪</span>}
              Sign Out
            </Button>
          </div>

          {/* App Version */}
          <div className="text-center text-xs text-slate-400 pt-4">
            PlantCare v1.0.0
          </div>
        </div>
      </div>
    </main>
  );
}


