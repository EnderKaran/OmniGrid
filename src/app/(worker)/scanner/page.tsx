"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Hexagon, 
  Settings, 
  Wifi, 
  BatteryMedium, 
  Maximize2, 
  PackageCheck, 
  CheckCircle2, 
  XCircle, 
  FileEdit, 
  AlertTriangle, 
  Check,
  Camera,
  Volume2,
  VolumeX,
  RefreshCw,
  Barcode,
  Layers,
  History,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// 1. Mock Barcodes Database
interface ScannedItem {
  id: string;
  name: string;
  shelfId: string;
  quantity: number;
  status: "success" | "warning" | "error";
  alertText?: string;
  speakText: string;
}

const MOCK_BARCODES: Record<string, ScannedItem> = {
  "PROD-ZX-9902": {
    id: "ZX-9902",
    name: "Optik Sensör Seti",
    shelfId: "A1-R24",
    quantity: 150,
    status: "success",
    speakText: "Ürün zed iks dokuz dokuz sıfır iki tarandı. Raf A bir, yüz elli adet mevcut."
  },
  "PROD-ZX-8842": {
    id: "ZX-8842",
    name: "Batarya Konnektörü",
    shelfId: "B3-R12",
    quantity: 12,
    status: "warning",
    alertText: "KRİTİK STOK SEVİYESİ! Sipariş eşiğinin altında.",
    speakText: "Kritik Stok Uyarısı! Batarya Konnektörü tarandı. Sadece on iki adet kaldı."
  },
  "PROD-TEMP-923": {
    id: "TEMP-923",
    name: "Kriyojenik Tüp Modülü",
    shelfId: "C2-L08",
    quantity: 85,
    status: "error",
    alertText: "SICAKLIK SINIRI AŞILDI! +4.2°C (Maks +2.0°C)",
    speakText: "Tehlike! Kriyojenik Tüp Modülü sıcaklık limiti aşıldı! Lütfen soğutma ünitesini kontrol edin."
  },
  "PROD-ERR-999": {
    id: "ERR-999",
    name: "Geçersiz Barkod Formatı",
    shelfId: "BİLİNMİYOR",
    quantity: 0,
    status: "error",
    alertText: "ARIZA: Veritabanı ile eşleşmeyen kod!",
    speakText: "Hata! Geçersiz barkod formatı algılandı."
  }
};

export default function ScannerPage() {
  const [activeItem, setActiveItem] = useState<ScannedItem>(MOCK_BARCODES["PROD-ZX-9902"]);
  const [scanQty, setScanQty] = useState<number>(150);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Real camera video stream state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [activeDeviceId, setActiveDeviceId] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [targetLocking, setTargetLocking] = useState<boolean>(false);
  const [tempBarcodeVal, setTempBarcodeVal] = useState<string>("");
  
  // History logs state
  const [recentScans, setRecentScans] = useState<Array<{
    id: string;
    shelfId: string;
    status: "success" | "warning" | "error";
    timestamp: string;
  }>>([
    { id: "ZX-9901", shelfId: "A1-R23", status: "success", timestamp: "13:12:04" },
    { id: "ZX-8842", shelfId: "B3-R12", status: "warning", timestamp: "13:08:45" },
    { id: "XY-2209", shelfId: "C1-R02", status: "error", timestamp: "12:59:12" },
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Synthesize Web Audio API beep
  const playBeep = (type: "success" | "error" | "confirm") => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === "confirm") {
        // High pitch chord chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("AudioContext init error", e);
    }
  };

  // Speak Status using Web Speech API
  const speakStatus = (phrase: string) => {
    if (!soundEnabled) return;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // kill ongoing speakings
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = "tr-TR";
      utterance.rate = 1.05;
      utterance.pitch = 0.98;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Camera start routine
  const startCamera = async (deviceId?: string) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      setCameraPermission("pending");
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "environment" }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermission("granted");
      setCameraActive(true);

      // Get lists of video inputs
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === "videoinput");
      setDevices(videoDevices);
      if (!deviceId && videoDevices.length > 0) {
        setActiveDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.warn("WebRTC camera stream error", err);
      setCameraPermission("denied");
      setCameraActive(false);
    }
  };

  // Shut down camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Trigger camera start on load
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Trigger barcode scan simulator action
  const handleTriggerScan = (code: string) => {
    if (targetLocking) return;
    
    setTargetLocking(true);
    playBeep("success");

    setTimeout(() => {
      const match = MOCK_BARCODES[code];
      if (match) {
        setActiveItem(match);
        setScanQty(match.quantity);
        
        // Success or alert beep tones
        if (match.status === "success") {
          playBeep("success");
        } else {
          playBeep("error");
        }
        
        // Voice report out loud
        speakStatus(match.speakText);
      }
      setTargetLocking(false);
    }, 900); // Locking target duration simulation
  };

  // Submit manual scanner inputs
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempBarcodeVal.trim()) return;

    // Search matches or fallback to custom error
    const formattedCode = `PROD-${tempBarcodeVal.toUpperCase()}`;
    const matchedKey = Object.keys(MOCK_BARCODES).find(k => k.includes(tempBarcodeVal.toUpperCase()));
    
    if (matchedKey) {
      handleTriggerScan(matchedKey);
    } else {
      // Generate temporary dummy bad match barcode
      const tempErrorItem: ScannedItem = {
        id: tempBarcodeVal.toUpperCase(),
        name: "Tanımsız Envanter Ürünü",
        shelfId: "Z-SEKTÖRÜ",
        quantity: 0,
        status: "error",
        alertText: "SİSTEM DIŞI BARKOD! Lokasyon tespiti başarısız.",
        speakText: "Uyarı! Tanımsız envanter barkodu algılandı."
      };
      
      setTargetLocking(true);
      setTimeout(() => {
        setActiveItem(tempErrorItem);
        setScanQty(0);
        playBeep("error");
        speakStatus(tempErrorItem.speakText);
        setTargetLocking(false);
      }, 700);
    }
    
    setTempBarcodeVal("");
  };

  // Confirm transaction & add to logs
  const handleConfirmTransaction = () => {
    playBeep("confirm");
    
    const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    setRecentScans(prev => [
      {
        id: activeItem.id,
        shelfId: activeItem.shelfId,
        status: activeItem.status,
        timestamp: time
      },
      ...prev.slice(0, 5) // cap at last 6 entries
    ]);

    // TTS approval feedback
    speakStatus("İşlem onaylandı. Stok başarıyla güncellendi.");
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-black text-amber-50 font-sans selection:bg-amber-500/30">
      
      {/* 1. Header (Takip & Durum Çubuğu) */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-amber-500/10 bg-zinc-950 px-6 z-10 select-none">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Hexagon className="h-7 w-7 text-amber-500" fill="currentColor" fillOpacity={0.15} />
            <span className="text-sm font-black tracking-widest text-amber-500">OMNIGRID HUD</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-zinc-300">EL TERMİNALİ M-03</span>
            <span className="text-[9px] font-mono tracking-widest text-emerald-500 uppercase">WEBRTC SCANNER ONLINE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          {/* Audio controller button */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-2 py-1 border border-zinc-800 text-[10px] font-mono tracking-widest transition-colors ${
              soundEnabled ? "text-amber-500 bg-amber-500/5 border-amber-500/20" : "text-zinc-500 bg-transparent"
            }`}
          >
            {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            {soundEnabled ? "SES AKTİF" : "SESSİZ"}
          </button>

          <div className="h-4 w-px bg-zinc-800" />
          
          <div className="flex items-center gap-4 text-zinc-400">
            <Wifi className="h-4 w-4 text-emerald-500 animate-pulse" />
            <div className="flex items-center gap-1">
              <BatteryMedium className="h-4 w-4 text-amber-500" />
              <span className="text-[10px] font-mono">92%</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Split View (L: AR Camera/Simulation, R: Telemetry Controls & Mock Barcodes) */}
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT COMPONENT: Video Stream / CRT Simulation Layer */}
        <div className="relative flex-1 bg-zinc-950 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800/40">
          
          {/* Target Scanning overlays */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none select-none">
            <div className="flex items-center gap-2 border border-emerald-500/20 bg-zinc-950/80 px-3 py-1 text-[10px] font-mono text-emerald-400 tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              {cameraActive ? "WEBRTC CAM: ACTIVE" : "SIMULATED FEED: ACTIVE"}
            </div>
            {targetLocking && (
              <div className="flex items-center gap-1.5 border border-red-500/40 bg-zinc-950/90 px-3 py-1 text-[10px] font-mono text-red-500 tracking-widest animate-pulse font-bold">
                <AlertCircle className="h-3 w-3" />
                HEDEFE KİLİTLENİLİYOR...
              </div>
            )}
          </div>

          {/* Diagnostic Overlay Lines */}
          <div className="absolute inset-0 z-10 pointer-events-none border border-zinc-800/50">
            {/* Corner brackets */}
            <div className="absolute left-6 top-6 h-6 w-6 border-l-2 border-t-2 border-amber-500/30" />
            <div className="absolute right-6 top-6 h-6 w-6 border-r-2 border-t-2 border-amber-500/30" />
            <div className="absolute bottom-6 left-6 h-6 w-6 border-l-2 border-b-2 border-amber-500/30" />
            <div className="absolute bottom-6 right-6 h-6 w-6 border-r-2 border-b-2 border-amber-500/30" />
            
            {/* Fine grids */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-zinc-800/10" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800/10" />
            
            {/* Crosshair element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-amber-500/10 flex items-center justify-center">
              <div className="h-1 w-1 bg-amber-500/30 rounded-full animate-ping" />
            </div>
          </div>

          {/* CRT scanlines effect (strictly visual, lightweight) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

          {/* Actual video or animated fallback */}
          <div className="flex-1 w-full relative flex items-center justify-center bg-zinc-950">
            {cameraActive ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            ) : (
              // Cyberpunk terminal loop scanning graphic animation
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 overflow-hidden">
                <div className="w-64 h-64 border border-zinc-800/40 relative flex items-center justify-center bg-zinc-900/10">
                  {/* Radar rotating sweep */}
                  <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent animate-pulse" />
                  <div className="w-48 h-48 rounded-full border border-zinc-800/40 flex items-center justify-center animate-spin [animation-duration:10s]">
                    <div className="w-1 h-24 bg-gradient-to-t from-amber-500/20 to-transparent absolute top-0" />
                  </div>
                  <div className="w-24 h-24 rounded-full border border-amber-500/10 absolute animate-ping [animation-duration:3s]" />
                  <Barcode className="h-16 w-16 text-zinc-700 animate-pulse" />
                  
                  {/* Moving scanning line */}
                  <div className="absolute left-0 right-0 h-[2px] bg-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-[bounce_3s_infinite]" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 mt-6 uppercase">CAMERA OFFLINE / WAITING FOR PERMISSION</span>
              </div>
            )}
            
            {/* Viewfinder Target frame overlay */}
            <div className={`relative z-20 w-72 h-72 border border-zinc-800/55 flex flex-col justify-between p-4 transition-all duration-300 ${
              targetLocking ? "scale-95 border-red-500/60 bg-red-500/5" : "hover:border-amber-500/40"
            }`}>
              {/* Corner brackets for targeting */}
              <div className={`absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 rounded-tl-lg transition-colors ${targetLocking ? "border-red-500" : "border-amber-500"}`} />
              <div className={`absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 rounded-tr-lg transition-colors ${targetLocking ? "border-red-500" : "border-amber-500"}`} />
              <div className={`absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 rounded-bl-lg transition-colors ${targetLocking ? "border-red-500" : "border-amber-500"}`} />
              <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 rounded-br-lg transition-colors ${targetLocking ? "border-red-500" : "border-amber-500"}`} />
              
              <div className="flex justify-between items-start text-[8px] font-mono text-amber-500/40 select-none">
                <span>SYS.REC // 004</span>
                <span>AUTO_ZOOM</span>
              </div>

              {/* Dynamic status pill inside viewfinder */}
              <div className="flex justify-center">
                {targetLocking ? (
                  <span className="px-2 py-0.5 bg-red-950/80 border border-red-500/50 text-[8px] font-mono text-red-400 animate-pulse tracking-widest">
                    LOCKED & ANALYZING
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-zinc-900/80 border border-zinc-700/50 text-[8px] font-mono text-zinc-400 tracking-wider">
                    VIEWFINDER FOCUS
                  </span>
                )}
              </div>

              <div className="flex justify-between items-end text-[8px] font-mono text-amber-500/40 select-none">
                <span>R-AXIS // LOCK_OK</span>
                <span>TEMP // SAFE</span>
              </div>

              {/* Laser line inside viewfinder */}
              <div className={`absolute left-4 right-4 h-[1.5px] shadow-[0_0_10px_2px_rgba(245,158,11,0.5)] transition-all ${
                targetLocking 
                  ? "bg-red-500 top-1/2 animate-ping shadow-[0_0_14px_4px_rgba(239,68,68,0.7)]" 
                  : "bg-amber-500 top-1/3 animate-pulse"
              }`} />
            </div>
          </div>

          {/* Left panel footer status */}
          <div className="h-16 shrink-0 border-t border-zinc-800 bg-zinc-950/90 px-6 flex items-center justify-between select-none z-10">
            <div className="flex gap-4">
              <button 
                onClick={() => startCamera()}
                className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition-colors hover:text-white"
              >
                <Camera className="h-3.5 w-3.5" />
                KAMERAYI YENİLE
              </button>

              {devices.length > 1 && (
                <button 
                  onClick={() => {
                    const idx = devices.findIndex(d => d.deviceId === activeDeviceId);
                    const nextIdx = (idx + 1) % devices.length;
                    setActiveDeviceId(devices[nextIdx].deviceId);
                    startCamera(devices[nextIdx].deviceId);
                  }}
                  className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition-colors hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  KENDİSİNİ DEĞİŞTİR
                </button>
              )}
            </div>

            <span className="text-[10px] font-mono text-zinc-500">OP-STATION: SEC-F</span>
          </div>

        </div>

        {/* RIGHT COMPONENT: Mock Barcodes & Scanned Telemetry Panel */}
        <div className="w-full md:w-[480px] shrink-0 flex flex-col justify-between bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 z-10 overflow-y-auto">
          
          <div className="p-6 space-y-6">
            
            {/* CARD 1: CURRENT SCANNED DATA */}
            <div className={`border p-5 relative transition-all duration-300 bg-zinc-900/30 ${
              activeItem.status === "success" 
                ? "border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.02)]" 
                : activeItem.status === "warning"
                ? "border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.02)]"
                : "border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.02)]"
            }`}>
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700" />
              
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest ${
                  activeItem.status === "success" 
                    ? "text-emerald-500" 
                    : activeItem.status === "warning"
                    ? "text-amber-500"
                    : "text-red-500"
                }`}>
                  <PackageCheck className="h-4 w-4" />
                  <span>[ BARKOD BULUNDU ]</span>
                </div>
                <Maximize2 className="h-4 w-4 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
              </div>

              {/* Huge digital-style SKU */}
              <div className="mb-2 font-mono text-5xl font-extrabold tracking-tighter text-zinc-100 flex items-baseline gap-2">
                {activeItem.id}
                <span className="text-xs font-normal tracking-wide text-zinc-500">SKU</span>
              </div>

              <div className="text-sm font-semibold text-zinc-400 mb-6 font-mono">
                Ürün İsmi: <span className="text-zinc-200">{activeItem.name}</span>
              </div>

              {/* Environmental/Placement Parameters Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 p-3">
                  <span className="block text-[8px] font-mono tracking-widest text-zinc-500 uppercase">HEDEF RAF LOKASYON</span>
                  <span className="text-lg font-black font-mono text-zinc-100 mt-0.5">{activeItem.shelfId}</span>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-3">
                  <span className="block text-[8px] font-mono tracking-widest text-zinc-500 uppercase">FİZİKSEL ADET (MEVCUT)</span>
                  <span className="text-lg font-black font-mono text-zinc-100 mt-0.5">
                    {activeItem.quantity} <span className="text-xs font-normal text-zinc-400">adet</span>
                  </span>
                </div>
              </div>

              {/* Status alerts */}
              {activeItem.alertText && (
                <div className={`flex items-start gap-2.5 border p-3.5 mb-2 font-mono text-xs ${
                  activeItem.status === "warning" 
                    ? "bg-amber-500/5 border-amber-500/20 text-amber-500" 
                    : "bg-red-500/5 border-red-500/20 text-red-500"
                }`}>
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black uppercase tracking-wider block mb-0.5">SİNYAL BİLDİRİMİ</span>
                    <p className="leading-relaxed">{activeItem.alertText}</p>
                  </div>
                </div>
              )}
            </div>

            {/* INTERACTIVE DOCK: MOCK BARCODES TEST PANEL */}
            <div className="border border-zinc-800 p-5 bg-zinc-900/20">
              <h3 className="text-xs font-black tracking-widest text-amber-500 mb-3 uppercase flex items-center gap-1.5 font-mono select-none">
                <Barcode className="h-3.5 w-3.5" />
                ÖRNEK BARKODLAR (MASAÜSTÜ HIZLI TEST PANELİ)
              </h3>
              <p className="text-[10px] text-zinc-500 mb-4 font-mono leading-relaxed">
                Aşağıdaki test barkodlarına tıklayarak terminalin hedefe kilitlenme (Target Lock) ses sentezleyicilerini ve sesli bildirimlerini deneyimleyebilirsiniz:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => handleTriggerScan("PROD-ZX-9902")}
                  disabled={targetLocking}
                  className="flex flex-col items-start p-2.5 border border-zinc-800 bg-zinc-900 text-left hover:border-emerald-500/30 hover:bg-zinc-800/50 transition-all select-none disabled:opacity-50"
                >
                  <span className="text-[9px] font-mono text-emerald-500 font-bold">[ NORMAL STOK ]</span>
                  <span className="text-xs font-mono font-bold text-zinc-300 mt-1">PROD-ZX-9902</span>
                  <span className="text-[8px] font-mono text-zinc-500 mt-0.5">Optik Sensör Seti</span>
                </button>

                <button 
                  onClick={() => handleTriggerScan("PROD-ZX-8842")}
                  disabled={targetLocking}
                  className="flex flex-col items-start p-2.5 border border-zinc-800 bg-zinc-900 text-left hover:border-amber-500/30 hover:bg-zinc-800/50 transition-all select-none disabled:opacity-50"
                >
                  <span className="text-[9px] font-mono text-amber-500 font-bold">[ STOK KRİTİK ]</span>
                  <span className="text-xs font-mono font-bold text-zinc-300 mt-1">PROD-ZX-8842</span>
                  <span className="text-[8px] font-mono text-zinc-500 mt-0.5">Batarya Konnektörü</span>
                </button>

                <button 
                  onClick={() => handleTriggerScan("PROD-TEMP-923")}
                  disabled={targetLocking}
                  className="flex flex-col items-start p-2.5 border border-zinc-800 bg-zinc-900 text-left hover:border-red-500/30 hover:bg-zinc-800/50 transition-all select-none disabled:opacity-50"
                >
                  <span className="text-[9px] font-mono text-red-500 font-bold">[ SICAKLIK ALARMI ]</span>
                  <span className="text-xs font-mono font-bold text-zinc-300 mt-1">PROD-TEMP-923</span>
                  <span className="text-[8px] font-mono text-zinc-500 mt-0.5">Kriyojenik Modül</span>
                </button>

                <button 
                  onClick={() => handleTriggerScan("PROD-ERR-999")}
                  disabled={targetLocking}
                  className="flex flex-col items-start p-2.5 border border-zinc-800 bg-zinc-900 text-left hover:border-zinc-500/30 hover:bg-zinc-800/50 transition-all select-none disabled:opacity-50"
                >
                  <span className="text-[9px] font-mono text-zinc-400 font-bold">[ FORMAT HATASI ]</span>
                  <span className="text-xs font-mono font-bold text-zinc-300 mt-1">PROD-ERR-999</span>
                  <span className="text-[8px] font-mono text-zinc-500 mt-0.5">Geçersiz Kod</span>
                </button>
              </div>

              {/* Form Input for manual keying */}
              <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2 pt-4 border-t border-zinc-800">
                <input 
                  type="text" 
                  value={tempBarcodeVal}
                  onChange={(e) => setTempBarcodeVal(e.target.value)}
                  placeholder="Barkod değerini manuel girin... (örn: ZX-9902)"
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500/40 font-mono placeholder:text-zinc-600"
                />
                <button 
                  type="submit" 
                  disabled={targetLocking}
                  className="bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold px-3 py-2 border border-zinc-700 hover:text-white transition-colors"
                >
                  GÖNDER
                </button>
              </form>
            </div>

            {/* CARD 2: RECENT SCANS HISTORY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 select-none">
                <h3 className="text-xs font-black tracking-widest text-zinc-500 uppercase font-mono flex items-center gap-1">
                  <History className="h-3.5 w-3.5" />
                  SON TARAMALAR GÜNCESİ
                </h3>
                <span className="text-[9px] font-mono text-zinc-500">LIVE FEED</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentScans.map((log, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between border border-zinc-800 bg-zinc-900/10 p-3 hover:bg-zinc-900/30 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-zinc-200">{log.id}</span>
                      <span className="text-[8px] font-mono text-zinc-500">Raf: {log.shelfId} // Saat: {log.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {log.status === "success" ? (
                        <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-mono font-bold uppercase">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>ONAYLI</span>
                        </div>
                      ) : log.status === "warning" ? (
                        <div className="flex items-center gap-1 text-amber-500 text-[9px] font-mono font-bold uppercase">
                          <AlertTriangle className="h-3 w-3" />
                          <span>KRİTİK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500 text-[9px] font-mono font-bold uppercase">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>ARIZA</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* DOCK FOOTER ACTIONS: Quantity Modifier & Submit Chime */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md space-y-4">
            
            {/* Quantity adjustment form */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-zinc-400 select-none">TÜKETİM / TRANSFER ADETİ:</span>
              <div className="flex items-center border border-zinc-800 bg-zinc-900 overflow-hidden">
                <button 
                  onClick={() => setScanQty(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold transition-colors"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={scanQty}
                  onChange={(e) => setScanQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-transparent text-center text-xs font-mono font-bold text-zinc-100 focus:outline-none"
                />
                <button 
                  onClick={() => setScanQty(prev => prev + 1)}
                  className="px-3 py-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={handleConfirmTransaction}
              className="group relative flex h-14 w-full items-center justify-center gap-2 border border-amber-500/20 bg-amber-500/10 font-bold text-amber-500 transition-all hover:bg-amber-500 hover:text-black hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <Check className="h-5 w-5" />
              <span className="text-sm font-black tracking-widest uppercase">İŞLEMİ ONAYLA // CONFIRM</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
