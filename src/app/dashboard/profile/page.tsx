"use client";

import React from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { 
  Home, 
  ChevronRight, 
  User, 
  Mail, 
  Calendar, 
  ShieldAlert, 
  Clock, 
  LogOut,
  Settings,
  Hexagon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function UserProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center font-mono gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest text-slate-500">Retrieving Operator Profile...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center font-mono gap-4">
        <ShieldAlert className="w-12 h-12 text-amber-500 animate-pulse" />
        <span className="text-sm uppercase tracking-widest text-slate-400">Authentication Required</span>
        <Link href="/sign-in" className="text-xs text-teal-400 hover:text-teal-300 border border-teal-500/30 px-4 py-2 rounded-md hover:bg-teal-500/10 transition-all mt-2">
          RETURN TO LOGIN
        </Link>
      </div>
    );
  }

  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "N/A";

  const lastSignIn = user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "N/A";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500/30 p-6 lg:p-8 max-w-[1200px] mx-auto pb-24">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tracking-wide mb-6">
        <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <span>WMS</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Operator Profile</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900/20 border border-white/5 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 p-8 opacity-5 shrink-0 pointer-events-none">
          <Hexagon className="w-64 h-64 text-teal-500" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Glowing Avatar */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 opacity-30 blur-md group-hover:opacity-50 transition-opacity" />
            <img 
              src={user.imageUrl} 
              alt={user.fullName || "User Avatar"} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-teal-400 object-cover shadow-2xl relative z-10"
            />
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase mb-3">
              ACTIVE OPERATOR
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {user.fullName || "Unnamed Operator"}
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 font-mono">
              Role: Operations Specialist & System Manager
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-500" />
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Details Card */}
        <div className="md:col-span-2 bg-slate-900/40 border border-white/5 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-6 tracking-wide flex items-center gap-2 border-b border-white/5 pb-3">
              <User className="w-5 h-5 text-teal-400" />
              ACCOUNT SPECIFICATIONS
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">First Name</span>
                <span className="text-sm font-semibold text-white">{user.firstName || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Last Name</span>
                <span className="text-sm font-semibold text-white">{user.lastName || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Username</span>
                <span className="text-sm font-mono text-teal-400">@{user.username || user.firstName?.toLowerCase() || "operator"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Clerk ID</span>
                <span className="text-xs font-mono text-slate-500 select-all truncate max-w-[200px]" title={user.id}>
                  {user.id}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white px-4 py-2 rounded-md text-xs font-bold tracking-wider">
              <Settings className="w-4 h-4" />
              MANAGE CREDENTIALS
            </button>
          </div>
        </div>

        {/* Security & System Info */}
        <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-6 tracking-wide flex items-center gap-2 border-b border-white/5 pb-3">
              <Clock className="w-5 h-5 text-teal-400" />
              SESSION LOG
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 h-9 shrink-0 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Enrolled Date</div>
                  <div className="text-sm text-white font-medium mt-0.5">{createdDate}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 h-9 shrink-0 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Last Active Log</div>
                  <div className="text-sm text-white font-medium mt-0.5" title={lastSignIn}>{lastSignIn}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <SignOutButton>
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 text-xs font-bold tracking-widest uppercase transition-all">
                <LogOut className="w-4 h-4" />
                TERMINATE SESSION
              </button>
            </SignOutButton>
          </div>
        </div>

      </div>

    </div>
  );
}
