"use client";

import React, { useState } from "react";
import { useSignIn, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Shield, Fingerprint, Key, Eye, EyeOff, AlertTriangle, IdCard } from "lucide-react";
import Link from "next/link";

export default function CustomSignIn() {
  const { signIn } = useSignIn();
  const [authMethod, setAuthMethod] = useState<"terminal" | "clerk">("terminal");
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
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.error) {
        setErrorMsg(result.error.message || "Authentication failed");
        setIsAuthenticating(false);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/dashboard");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          }
        });
      } else {
        setErrorMsg("Further authentication or verification required. Status: " + signIn.status);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setErrorMsg(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-white font-sans overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Terminal Corner Texts */}
      <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] leading-relaxed text-slate-500 z-10">
        <span className="text-primary font-semibold tracking-wider">SYSTEM: ONLINE</span><br />
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
      <div className="relative z-10 w-full max-w-[440px] rounded-none border border-border bg-card/25 p-8 backdrop-blur-xl shadow-2xl">
        {/* Top border highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary/5 border border-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white uppercase font-mono">SECURE LOGISTICS</h1>
          <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-primary">IDENTIFICATION REQUIRED</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mb-6 flex border border-border bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setAuthMethod("terminal")}
            className={`flex-1 py-2 font-mono text-[9px] tracking-wider transition-colors uppercase ${
              authMethod === "terminal"
                ? "bg-primary text-black font-semibold"
                : "text-slate-500 hover:text-white"
            }`}
          >
            [ Terminal Access ]
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("clerk")}
            className={`flex-1 py-2 font-mono text-[9px] tracking-wider transition-colors uppercase ${
              authMethod === "clerk"
                ? "bg-primary text-black font-semibold"
                : "text-slate-500 hover:text-white"
            }`}
          >
            [ Clerk Core ]
          </button>
        </div>

        {authMethod === "terminal" ? (
          <form onSubmit={handleSignIn} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {/* Agent ID Input */}
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-background px-2 font-mono text-[9px] font-medium tracking-[0.1em] text-primary">
                  AGENT ID / EMAIL
                </label>
                <div className="flex items-center gap-3 rounded-none border border-border bg-black/20 px-4 py-3 transition-colors focus-within:border-primary">
                  <IdCard className="h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="ENTER OPERATOR ID"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono tracking-wide text-white placeholder-slate-600 outline-none"
                  />
                </div>
              </div>

              {/* Access Key Input */}
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-background px-2 font-mono text-[9px] font-medium tracking-[0.1em] text-primary">
                  ACCESS KEY
                </label>
                <div className="flex items-center gap-3 rounded-none border border-border bg-black/20 px-4 py-3 transition-colors focus-within:border-primary">
                  <Key className="h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="............"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs tracking-widest text-white placeholder-slate-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-3 rounded-none border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Biometric Auth Button */}
            <div className="mt-2 flex flex-col items-center justify-center gap-4">
              <button
                type="submit"
                disabled={isAuthenticating}
                className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-black border border-primary/20 transition-all hover:border-primary"
              >
                <div className={`absolute inset-0 rounded-full border border-primary/30 ${isAuthenticating ? 'animate-ping' : 'group-hover:animate-ping'}`} />
                <Fingerprint className={`h-8 w-8 transition-all duration-300 ${isAuthenticating ? 'text-primary scale-110' : 'text-primary/70 group-hover:text-primary'}`} />
              </button>
              <span className={`font-mono text-[9px] tracking-[0.2em] transition-colors ${isAuthenticating ? 'text-primary' : 'text-slate-500'}`}>
                {isAuthenticating ? "AUTHENTICATING..." : "TAP TO AUTHENTICATE"}
              </span>
            </div>
          </form>
        ) : (
          <div className="clerk-container flex justify-center py-2 bg-transparent text-white">
            <SignIn
              routing="hash"
              signUpUrl="/sign-up"
              forceRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0 w-full border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "rounded-none border border-border bg-black/40 text-white hover:bg-black/60 font-mono text-[10px] uppercase py-2.5",
                  socialButtonsBlockButtonText: "text-white font-mono",
                  formButtonPrimary: "rounded-none bg-primary text-black hover:bg-primary/95 font-mono text-xs uppercase py-2.5 shadow-none",
                  formFieldInput: "rounded-none border border-border bg-black/20 text-white font-mono text-xs focus:border-primary focus:ring-0",
                  formFieldLabel: "font-mono text-[9px] text-primary uppercase tracking-wider",
                  footerActionLink: "text-primary hover:text-primary/85 font-mono text-[10px]",
                  footerActionText: "text-slate-500 font-mono text-[10px]",
                  dividerLine: "bg-border",
                  dividerText: "text-slate-500 font-mono text-[9px] uppercase",
                  identityPreviewText: "text-white font-mono text-xs",
                  identityPreviewEditButton: "text-primary font-mono text-[10px]"
                }
              }}
            />
          </div>
        )}

        {/* Bottom Links */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
          <Link href="#" className="font-mono text-[9px] text-slate-500 hover:text-primary transition-colors">
            [ FORGOT CREDENTIALS ]
          </Link>
          <Link href="/sign-up" className="font-mono text-[9px] text-slate-500 hover:text-primary transition-colors">
            [ REGISTER OPERATOR ]
          </Link>
        </div>
      </div>
    </div>
  );
}
