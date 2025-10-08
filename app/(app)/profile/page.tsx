"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <h1 className="text-xl font-bold text-slate-800">Profile</h1>
        </header>

        <div className="p-6 space-y-6">
          {/* User Profile Card */}
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-green-50/30 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-green-200 shadow-lg">
                  <AvatarImage src="/palm.png" alt="avatar" className="object-cover" />
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-800">Alex Green</div>
                <div className="text-sm text-slate-600">alex@example.com</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 border border-green-300 text-xs font-medium text-green-700">
                    🌱 Pro Member
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Plant Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">12</div>
              <div className="text-xs text-blue-700 mt-1">Plants</div>
            </Card>
            <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-900">48</div>
              <div className="text-xs text-green-700 mt-1">Days Active</div>
            </Card>
            <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-900">95%</div>
              <div className="text-xs text-yellow-700 mt-1">Health</div>
            </Card>
          </div>

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

            {/* Edit Profile */}
            <button className="w-full bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center">
                  <span className="text-lg">✏️</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">Edit Profile</div>
                  <div className="text-xs text-slate-600">Update your information</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
                <span className="text-xs text-slate-600">3 active</span>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-50 border border-yellow-200 flex items-center justify-center">
                  <span className="text-lg">💳</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">Subscription</div>
                  <div className="text-xs text-slate-600">Manage your plan</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

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

            <button className="w-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center justify-center gap-2 hover:from-red-100 hover:to-pink-100 transition-colors shadow-sm">
              <span className="text-lg">🚪</span>
              <span className="text-sm font-semibold text-red-700">Sign Out</span>
            </button>
          </div>

          {/* App Version */}
          <div className="text-center text-xs text-slate-400 pt-4">
            Plant Care v1.0.0
          </div>
        </div>
      </div>
    </main>
  );
}


