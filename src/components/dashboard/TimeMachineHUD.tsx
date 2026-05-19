"use client";
 
import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, ShieldAlert, Zap, Tv } from "lucide-react";
 
interface TimeMachineHUDProps {
  timeOffset: number; // in hours (0, 1, 4, 12, 24, 48)
  setTimeOffset: (hours: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  liveInterrupt: { shelfName: string; timestamp: string } | null;
  onClearInterrupt: () => void;
}
 
const STEPS = [
  { value: 0, label: "LIVE" },
  { value: 1, label: "-1 HR" },
  { value: 4, label: "-4 HR" },
  { value: 12, label: "-12 HR" },
  { value: 24, label: "-24 HR" },
  { value: 48, label: "-48 HR" },
];
 
export function TimeMachineHUD({
  timeOffset,
  setTimeOffset,
  isPlaying,
  setIsPlaying,
  liveInterrupt,
  onClearInterrupt,
}: TimeMachineHUDProps) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showCRT, setShowCRT] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
 
  // Play synthetic retro-computer click sound using Web Audio API
  const playSynthSound = useCallback((frequency = 600, duration = 0.06, type: "sine" | "square" = "sine") => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
 
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
 
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
 
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
 
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      if (type === "sine") {
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
      } else {
        osc.frequency.setValueAtTime(frequency / 2, ctx.currentTime + duration * 0.5);
      }
 
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
 
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
 
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // fail-safe
    }
  }, [audioEnabled]);

  // Trigger sound on offset change
  useEffect(() => {
    if (timeOffset === 0) {
      playSynthSound(1000, 0.1, "sine");
    } else {
      playSynthSound(400 + (timeOffset * 5), 0.08, "sine");
    }
  }, [timeOffset, playSynthSound]);
 
  // Loop playback effect when playing is active
  useEffect(() => {
    if (!isPlaying) return;
 
    const interval = setInterval(() => {
      // Get index of current step
      const currentIndex = STEPS.findIndex((s) => s.value === timeOffset);
      let nextIndex = currentIndex + 1;
      if (nextIndex >= STEPS.length) {
        nextIndex = 0; // wrap around to LIVE
      }
      setTimeOffset(STEPS[nextIndex].value);
      playSynthSound(700, 0.05, "square");
    }, 2500);
 
    return () => clearInterval(interval);
  }, [isPlaying, timeOffset, setTimeOffset, playSynthSound]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    playSynthSound(800, 0.12, "sine");
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const nearestStep = STEPS.reduce((prev, curr) => 
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    );
    setTimeOffset(nearestStep.value);
  };

  return (
    <div className="relative mb-6 flex flex-col gap-4 border border-border bg-card/25 p-4 font-mono select-none">
      {/* Dynamic CRT interference overlay layer */}
      {showCRT && (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden bg-transparent opacity-10">
          {/* Scanlines scan visual */}
          <div className="absolute inset-0 h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] animate-[pulse_0.15s_infinite]" />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-primary/10 via-transparent to-primary/10 animate-[bounce_8s_infinite]" />
        </div>
      )}

      {/* Grid HUD Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3 text-[10px] uppercase">
        {/* Status indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2 w-2`}>
              {timeOffset === 0 && !isPlaying ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
                </>
              )}
            </span>
            <span className="font-bold tracking-widest text-slate-300">
              {timeOffset === 0 ? "🟢 TELEMETRY SYSTEM: LIVE" : `⏳ TELEMETRY REWIND: -${timeOffset} HRS`}
            </span>
          </div>

          {isPlaying && (
            <span className="animate-pulse bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-500 font-bold text-[8px] tracking-widest">
              PLAYBACK LOOP ACTIVE
            </span>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* CRT effect toggle */}
          <button
            onClick={() => {
              setShowCRT(!showCRT);
              playSynthSound(900, 0.08, "sine");
            }}
            className={`flex items-center gap-1.5 border px-2 py-1 transition-all ${
              showCRT
                ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_8px_rgba(206,170,91,0.2)]"
                : "border-border text-slate-500 hover:border-slate-700"
            }`}
            title="Toggle Visual CRT Scanlines Effect"
          >
            <Tv className="h-3 w-3" />
            <span>CRT HUD</span>
          </button>

          {/* Synthesizer audio toggle */}
          <button
            onClick={() => {
              const newState = !audioEnabled;
              setAudioEnabled(newState);
              if (newState) {
                // Initialize context instantly to unlock browser audio
                try {
                  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
                  if (AudioCtx) {
                    audioContextRef.current = new AudioCtx();
                    audioContextRef.current.resume();
                  }
                } catch {
                  // fail-safe
                }
              }
              // Quick confirmation beep
              setTimeout(() => {
                if (newState) {
                  playSynthSound(800, 0.08, "sine");
                }
              }, 50);
            }}
            className={`flex items-center gap-1.5 border px-2 py-1 transition-all ${
              audioEnabled
                ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_8px_rgba(206,170,91,0.2)]"
                : "border-border text-slate-500 hover:border-slate-700"
            }`}
            title="Toggle Audio Feedback"
          >
            {audioEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            <span>AUDIO SYNTH</span>
          </button>
        </div>
      </div>

      {/* Main Control Deck */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayback}
          className={`flex h-11 w-11 shrink-0 items-center justify-center border transition-all ${
            isPlaying
              ? "border-amber-500 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
              : "border-primary bg-primary/5 text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(206,170,91,0.1)]"
          }`}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        {/* Timeline Slider & Steps Track */}
        <div className="flex-1 w-full flex flex-col gap-2">
          {/* Interactive HTML Range Slider */}
          <div className="relative w-full px-1">
            <input
              type="range"
              aria-label="Timeline History Slider"
              min="0"
              max="48"
              step="1"
              value={timeOffset}
              onChange={handleSliderChange}
              disabled={isPlaying}
              className="h-1.5 w-full cursor-pointer appearance-none bg-border accent-primary outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(timeOffset / 48) * 100}%, var(--border) ${(timeOffset / 48) * 100}%, var(--border) 100%)`
              }}
            />
          </div>

          {/* Stepped Labels */}
          <div className="flex justify-between px-1 text-[9px] font-bold text-slate-500">
            {STEPS.map((step) => {
              const isActive = timeOffset === step.value;
              return (
                <button
                  key={step.value}
                  onClick={() => {
                    if (!isPlaying) {
                      setTimeOffset(step.value);
                    }
                  }}
                  disabled={isPlaying}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive
                      ? "text-primary font-extrabold"
                      : "hover:text-slate-300 disabled:hover:text-slate-500"
                  }`}
                >
                  <span className={`h-1.5 w-0.5 bg-current ${isActive ? "scale-y-150" : ""}`} />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Pusher Live Signal Override Warning Alert HUD */}
      {liveInterrupt && (
        <div className="mt-2 flex items-center justify-between border border-red-500/50 bg-red-500/10 p-3 text-red-400 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-red-500 bg-red-500/20 text-red-500">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="flex flex-col font-mono text-[10px] uppercase">
              <span className="font-extrabold tracking-widest text-red-200">
                🚨 REAL-TIME INTERRUPT BROADCAST RECEIVED!
              </span>
              <span className="text-slate-400 mt-0.5">
                Active Pick Guidance trigger signal captured on shelf:{" "}
                <strong className="text-red-400 font-bold">{liveInterrupt.shelfName}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playSynthSound(1200, 0.15, "sine");
              onClearInterrupt(); // snaps timeline back to LIVE
            }}
            className="flex items-center gap-1.5 border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-[9px] font-bold text-red-300 uppercase tracking-widest hover:border-red-400 hover:bg-red-500/40 transition-colors"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Warp to Live</span>
          </button>
        </div>
      )}
    </div>
  );
}
