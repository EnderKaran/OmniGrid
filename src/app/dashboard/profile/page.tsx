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
      <div className="min-h-screen bg-background text-slate-300 flex flex-col items-center justify-center font-mono gap-4 selection:bg-primary/30">
        <div className="w-8 h-8 border border-primary border-t-transparent animate-spin rounded-none" />
        <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Retrieving Operator Profile...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background text-slate-300 flex flex-col items-center justify-center font-mono gap-4 selection:bg-primary/30">
        <ShieldAlert className="w-12 h-12 text-primary animate-pulse" />
        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Authentication Required</span>
        <Link href="/sign-in" className="text-xs text-primary hover:text-white border border-primary/30 px-4 py-2 hover:bg-primary/10 transition-all mt-2 uppercase tracking-widest font-bold rounded-none">
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
    <div className="min-h-screen bg-background text-slate-300 font-mono text-[11px] selection:bg-primary/30 p-6 lg:p-8 max-w-[1200px] mx-auto pb-24">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-6">
        <Link href="/dashboard" className="hover:text-primary transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <span>WMS</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-bold">Operator Profile</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-card/25 border border-border p-6 md:p-8 mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-5 shrink-0 pointer-events-none">
          <Hexagon className="w-64 h-64 text-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Sharp Double Border Avatar Frame */}
          <div className="relative group">
            <div className="absolute inset-0 border border-primary/30 scale-105 group-hover:scale-110 transition-transform" />
            <img 
              src={user.imageUrl} 
              alt={user.fullName || "User Avatar"} 
              className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary object-cover shadow-2xl relative z-10 rounded-none"
            />
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-[9px] font-bold tracking-widest text-primary uppercase mb-3 rounded-none">
              ACTIVE OPERATOR
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
              {user.fullName || "Unnamed Operator"}
            </h1>
            <p className="text-slate-500 text-[10px] mt-1.5 uppercase tracking-wider">
              Role: Operations Specialist & System Manager
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Details Card */}
        <div className="md:col-span-2 bg-card/25 border border-border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-extrabold text-white mb-6 tracking-widest uppercase flex items-center gap-2 border-b border-border pb-3">
              <User className="w-5 h-5 text-primary" />
              ACCOUNT SPECIFICATIONS
            </h2>
            
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">First Name</span>
                <span className="font-bold text-white uppercase">{user.firstName || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">Last Name</span>
                <span className="font-bold text-white uppercase">{user.lastName || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">Username</span>
                <span className="font-bold text-primary">@{user.username || user.firstName?.toLowerCase() || "operator"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">Clerk ID</span>
                <span className="text-[10px] text-slate-500 select-all truncate max-w-[200px]" title={user.id}>
                  {user.id}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 border border-border bg-card/25 hover:bg-card/45 text-white px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all rounded-none">
              <Settings className="w-4 h-4 text-primary" />
              MANAGE CREDENTIALS
            </button>
          </div>
        </div>

        {/* Security & System Info */}
        <div className="bg-card/25 border border-border p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-extrabold text-white mb-6 tracking-widest uppercase flex items-center gap-2 border-b border-border pb-3">
              <Clock className="w-5 h-5 text-primary" />
              SESSION LOG
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="p-2 border border-primary/20 bg-primary/10 text-primary h-9 shrink-0 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Enrolled Date</div>
                  <div className="text-xs text-white font-bold mt-0.5 uppercase">{createdDate}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 border border-primary/20 bg-primary/10 text-primary h-9 shrink-0 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Last Active Log</div>
                  <div className="text-xs text-white font-bold mt-0.5 uppercase" title={lastSignIn}>{lastSignIn}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <SignOutButton>
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 hover:border-destructive/30 text-xs font-bold tracking-widest uppercase transition-all rounded-none">
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
