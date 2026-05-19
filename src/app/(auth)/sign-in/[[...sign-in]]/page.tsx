"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Shield, Fingerprint, Key, Eye, EyeOff, AlertTriangle, IdCard } from "lucide-react";
import Link from "next/link";

export default function CustomSignIn() {
  const { signIn } = useSignIn();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setIsAuthenticating(true);
    setErrorMsg("");

    try {
      const { error } = await signIn.password({
        identifier,
        password,
      });
      
      if (error) {
        setErrorMsg(error.longMessage || "Authentication failed");
        setIsAuthenticating(false);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => {
            router.push("/dashboard/analytics");
          }
        });
      } else {
        setErrorMsg("Further authentication required.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "Authentication failed");
      } else {
        const clerkErr = err as { errors?: { longMessage?: string }[] };
        setErrorMsg(clerkErr.errors?.[0]?.longMessage || "Authentication failed");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#060D1A] text-white font-sans overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Terminal Corner Texts */}
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] leading-relaxed text-slate-500 z-10">
        <span className="text-cyan-500 font-semibold tracking-wider">SYSTEM: ONLINE</span><br />
        <span className="tracking-widest">NODE: ALPHA-7 // 42.001</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 text-right font-mono text-[10px] leading-relaxed text-slate-500 z-10 tracking-widest">
        ENCRYPTION: AES-256<br />
        SECURE CONNECTION ESTABLISHED
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 font-mono text-[10px] leading-relaxed text-slate-500 z-10 tracking-widest">
        ID: 884-21-X
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 text-right font-mono text-[10px] leading-relaxed text-slate-500 z-10 tracking-widest">
        V.4.0.2 // STABLE
      </div>

      {/* Main Sign-in Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-white/5 bg-slate-900/40 p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Top border highlight */}
        <div className="absolute top-0 left-1/2 h-[2px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Shield className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-[28px] font-bold tracking-wide text-white">SECURE LOGISTICS</h1>
          <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-cyan-500/80">IDENTIFICATION REQUIRED</p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-8">
          
          <div className="flex flex-col gap-6">
            {/* Agent ID Input */}
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-[#0a1120] px-2 font-mono text-[10px] font-medium tracking-[0.1em] text-cyan-500/70">
                AGENT ID
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-transparent px-4 py-3.5 transition-colors focus-within:border-cyan-500 focus-within:bg-cyan-500/5 focus-within:ring-1 focus-within:ring-cyan-500">
                <IdCard className="h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="ENTER ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium tracking-wide text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            {/* Access Key Input */}
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-[#0a1120] px-2 font-mono text-[10px] font-medium tracking-[0.1em] text-cyan-500/70">
                ACCESS KEY
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-transparent px-4 py-3.5 transition-colors focus-within:border-cyan-500 focus-within:bg-cyan-500/5 focus-within:ring-1 focus-within:ring-cyan-500">
                <Key className="h-5 w-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="............"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent font-mono text-sm tracking-widest text-white placeholder-slate-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Biometric Auth Button */}
          <div className="mt-4 flex flex-col items-center justify-center gap-5">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-950/50 border border-cyan-500/20 transition-all hover:bg-cyan-950/40 hover:border-cyan-500/40 focus:outline-none"
            >
              {/* Inner animated ring */}
              <div className={`absolute inset-0 rounded-full border border-cyan-400/30 ${isAuthenticating ? 'animate-ping' : 'group-hover:animate-ping'}`} />
              {/* Outer animated ring */}
              <div className={`absolute -inset-3 rounded-full border border-cyan-400/10 ${isAuthenticating ? 'animate-ping duration-1000 delay-100' : 'group-hover:animate-ping group-hover:duration-1000 group-hover:delay-100'}`} />
              
              <Fingerprint className={`h-10 w-10 transition-all duration-300 ${isAuthenticating ? 'text-cyan-300 scale-110' : 'text-cyan-500/70 group-hover:text-cyan-300'}`} />
            </button>
            <span className={`font-mono text-[10px] tracking-[0.2em] transition-colors ${isAuthenticating ? 'text-cyan-300' : 'text-slate-500'}`}>
              {isAuthenticating ? "AUTHENTICATING..." : "TOUCH TO AUTHENTICATE"}
            </span>
          </div>
        </form>

        {/* Bottom Links */}
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
          <Link href="#" className="text-[11px] text-slate-500 transition-colors hover:text-white">
            Forgot Credentials?
          </Link>
          <Link href="#" className="text-[11px] text-slate-500 transition-colors hover:text-white">
            Support Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
