"use client";

import React from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingItem {
  icon: React.ElementType;
  title: string;
  description: string;
  value?: string;
  toggle?: boolean;
  toggleState?: boolean;
}

const SETTING_SECTIONS: { title: string; items: SettingItem[] }[] = [
  {
    title: "ACCOUNT",
    items: [
      { icon: User, title: "Profile", description: "Manage your account information", value: "Alex Chen" },
      { icon: Shield, title: "Security", description: "Password and two-factor authentication", value: "2FA Enabled" },
      { icon: Bell, title: "Notifications", description: "Email and push notification preferences", toggle: true, toggleState: true },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { icon: Database, title: "Data Management", description: "Export, import, and backup settings", value: "Last backup: 2h ago" },
      { icon: Globe, title: "Region & Language", description: "Time zone and locale configuration", value: "UTC+3 / EN" },
      { icon: Palette, title: "Appearance", description: "Theme and display preferences", value: "Midnight Professional" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-md">
              <SettingsIcon className="w-5 h-5 text-teal-400" />
            </div>
            <h1 className="text-lg font-bold tracking-widest text-white flex items-center gap-2">
              SYSTEM<span className="text-teal-400">.SETTINGS</span>
            </h1>
          </div>
          <div className="text-[10px] font-mono tracking-widest text-slate-500">
            CONFIG_V2.4.0
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 max-w-[900px] mx-auto">
        {SETTING_SECTIONS.map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-[10px] font-mono font-bold tracking-widest text-teal-400 mb-4 px-1">
              {section.title}
            </h2>
            <div className="flex flex-col gap-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between bg-slate-900/40 border border-white/5 hover:border-white/10 backdrop-blur-md rounded-xl px-5 py-4 shadow-lg transition-all duration-300 ease-out cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.value && (
                        <span className="text-xs font-mono text-slate-400">{item.value}</span>
                      )}
                      {item.toggle !== undefined ? (
                        item.toggleState ? (
                          <ToggleRight className="w-6 h-6 text-teal-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-600" />
                        )
                      ) : (
                        <ChevronRight className={cn(
                          "w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors"
                        )} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="mb-10">
          <h2 className="text-[10px] font-mono font-bold tracking-widest text-red-400 mb-4 px-1">
            DANGER ZONE
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-red-900/10 border border-red-500/10 hover:border-red-500/20 rounded-xl px-5 py-4 transition-all duration-300 ease-out cursor-pointer group">
              <div>
                <h3 className="text-sm font-semibold text-red-300">Reset All Settings</h3>
                <p className="text-xs text-red-400/60 mt-0.5">Restore factory defaults for all system configurations</p>
              </div>
              <button className="text-[10px] font-bold tracking-widest text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-md transition-colors">
                RESET
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
