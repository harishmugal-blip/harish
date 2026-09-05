"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Win7Window, { type WinPos } from "@/components/win7/Win7Window";
import { Taskbar, StartMenu, ContextMenu, type WinId, type TaskItem } from "@/components/win7/chrome";
import {
  FolderIcon,
  ComputerIcon,
  RecycleBinIcon,
  NotepadIcon,
  PdfIcon,
  ContactIcon,
  GearIcon,
  MediaIcon,
} from "@/components/win7/icons";
import {
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ResumeContent,
  ContactContent,
  ComputerContent,
  RecycleContent,
  MusicLibraryContent,
} from "@/components/win7/contents";
import { JarvisMode } from "@/components/jarvis/JarvisMode";
import { profile } from "@/lib/portfolio";
import { TOTAL_SONGS } from "@/lib/musicData";
import { attachYtPlayer, handlePlayerError, handlePlayerStateChange } from "@/lib/radio";

/* ================= window configs ================= */

interface WinConfig {
  id: WinId;
  title: string;
  icon: React.ReactNode;
  w: number;
  h: number;
  content: React.ReactNode;
}

const WIN_CONFIGS: WinConfig[] = [
  { id: "about", title: "About_Me.txt — Notepad", icon: <NotepadIcon />, w: 560, h: 500, content: <AboutContent /> },
  { id: "projects", title: "Projects — Explorer", icon: <FolderIcon />, w: 660, h: 470, content: <ProjectsContent /> },
  { id: "skills", title: "Skills.exe", icon: <GearIcon />, w: 640, h: 430, content: <SkillsContent /> },
  { id: "resume", title: "Resume.pdf — Reader", icon: <PdfIcon />, w: 600, h: 510, content: <ResumeContent /> },
  { id: "contact", title: "New Message — Contact.exe", icon: <ContactIcon />, w: 560, h: 560, content: <ContactContent /> },
  { id: "computer", title: "Computer — System Info", icon: <ComputerIcon />, w: 640, h: 470, content: <ComputerContent /> },
  { id: "music", title: `Music Library — ${TOTAL_SONGS} Songs (YT Music)`, icon: <MediaIcon />, w: 560, h: 520, content: <MusicLibraryContent /> },
  { id: "recycle", title: "Recycle Bin", icon: <RecycleBinIcon />, w: 560, h: 380, content: <RecycleContent /> },
];

const DESKTOP_ICONS: { id: WinId; label: string; icon: React.ReactNode }[] = [
  { id: "computer", label: "Computer", icon: <ComputerIcon /> },
  { id: "about", label: "About_Me.txt", icon: <NotepadIcon /> },
  { id: "projects", label: "My Projects", icon: <FolderIcon /> },
  { id: "skills", label: "Skills.exe", icon: <GearIcon /> },
  { id: "resume", label: "Resume.pdf", icon: <PdfIcon /> },
  { id: "music", label: "Music Library", icon: <MediaIcon /> },
  { id: "contact", label: "Contact.exe", icon: <ContactIcon /> },
  { id: "recycle", label: "Recycle Bin", icon: <RecycleBinIcon /> },
];

interface WinState {
  open: boolean;
  min: boolean;
  max: boolean;
  x: number;
  y: number;
  z: number;
}

const initialWindows = (): Record<WinId, WinState> => {
  const o = {} as Record<WinId, WinState>;
  WIN_CONFIGS.forEach((c) => {
    o[c.id] = { open: false, min: false, max: false, x: 0, y: 0, z: 10 };
  });
  return o;
};

/* ================= YouTube player host ================= */

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: () => void;
            onStateChange?: (e: { data: number }) => void;
            onError?: (e: { data?: number }) => void;
          };
        }
      ) => unknown;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function YtPlayerHost() {
  const hostRef = useRef<HTMLDivElement>(null);
  const created = useRef(false);

  useEffect(() => {
    if (created.current) return;
    created.current = true;

    const tryCreate = () => {
      if (!window.YT || !hostRef.current || !window.YT.Player) return false;
      try {
        const p = new window.YT.Player(hostRef.current, {
          height: "180",
          width: "320",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              (window as unknown as { __ytPlayer?: unknown }).__ytPlayer = p;
              attachYtPlayer(p as never);
            },
            onStateChange: (e) => handlePlayerStateChange(e.data),
            onError: (e) => handlePlayerError((e as { data?: number })?.data),
          },
        });
        return true;
      } catch {
        return false;
      }
    };

    if (!tryCreate()) {
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        tryCreate();
      };
    }
  }, []);

  return (
    <div className="fixed -left-[9999px] top-0 w-[320px] h-[180px] overflow-hidden pointer-events-none" aria-hidden>
      <div ref={hostRef} />
    </div>
  );
}

/* ================= BSOD ================= */

function Bsod({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] bg-[#0000aa] text-white font-mono cursor-pointer select-none px-6 py-10 overflow-auto" onClick={onRestart}>
      <div className="max-w-[640px] mx-auto text-[13px] leading-[1.7]">
        <p>
          A problem has been detected and Windows has been shut down to prevent damage to your chai.
        </p>
        <p className="mt-4">CRITICAL_PROCESS_DIED_JARVIS_JOKE</p>
        <p className="mt-4">
          If this is the first time you&apos;ve seen this Stop error screen, relax — Harish ka J.A.R.V.I.S experiment thoda
          zyada ho gaya. Tumne kaha tha na &quot;DO NOT PRESS&quot;? Hmm? 😏
        </p>
        <p className="mt-4">
          Technical information:
          <br />
          *** STOP: 0x000000EF (0xCAFEBABE, 0xDEADBEEF, 0x00000CHAI, 0x00000005)
        </p>
        <p className="mt-6 text-white/80">Click anywhere to restart…</p>
      </div>
    </div>
  );
}

/* ================= page ================= */

type Phase = "boot" | "login" | "desktop" | "jarvis-install" | "jarvis" | "shutdown" | "bsod";

export default function DesktopPage() {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("boot");
  const [windows, setWindows] = useState<Record<WinId, WinState>>(initialWindows);
  const [activeId, setActiveId] = useState<WinId | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<WinId | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const zTop = useRef(20);
  const cascade = useRef(0);
  const coarse = useRef(false);
  const windowsRef = useRef(windows);
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  /* device detection */
  useEffect(() => {
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
    const mq = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const focusWindow = useCallback((id: WinId) => {
    zTop.current += 1;
    const z = zTop.current;
    setWindows((w) => ({ ...w, [id]: { ...w[id], z } }));
    setActiveId(id);
  }, []);

  const openWindow = useCallback((id: WinId) => {
    setStartOpen(false);
    setCtxMenu(null);
    setSelectedIcon(null);
    const cur = windowsRef.current[id];
    zTop.current += 1;
    const z = zTop.current;
    if (cur.open) {
      setWindows((w) => ({ ...w, [id]: { ...w[id], min: false, z } }));
    } else {
      const cfg = WIN_CONFIGS.find((c) => c.id === id)!;
      const n = cascade.current % 8;
      cascade.current = cascade.current + 1;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const mobile = vw <= 700;
      const x = mobile ? 0 : Math.max(8, Math.min(110 + n * 36, vw - cfg.w - 20));
      const y = mobile ? 0 : Math.max(6, Math.min(42 + n * 28, vh - cfg.h - 70));
      setWindows((w) => ({ ...w, [id]: { open: true, min: false, max: mobile, x, y, z } }));
    }
    setActiveId(id);
  }, []);

  const closeWindow = useCallback((id: WinId) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], open: false, min: false } }));
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const minimizeWindow = useCallback((id: WinId) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], min: true } }));
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const toggleMax = useCallback((id: WinId) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], max: !w[id].max } }));
  }, []);

  const moveWindow = useCallback((id: WinId, x: number, y: number) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], x, y } }));
  }, []);

  const onTaskClick = useCallback(
    (id: WinId) => {
      setStartOpen(false);
      const cur = windowsRef.current[id];
      if (!cur.open) return;
      if (!cur.min && activeId === id) {
        setWindows((w) => ({ ...w, [id]: { ...w[id], min: true } }));
        setActiveId(null);
      } else {
        zTop.current += 1;
        const z = zTop.current;
        setWindows((w) => ({ ...w, [id]: { ...w[id], min: false, z } }));
        setActiveId(id);
      }
    },
    [activeId]
  );

  const minimizeAll = useCallback(() => {
    setWindows((w) => {
      const n = { ...w };
      (Object.keys(n) as WinId[]).forEach((k) => {
        if (n[k].open) n[k] = { ...n[k], min: true };
      });
      return n;
    });
    setActiveId(null);
  }, []);

  const onDesktopClick = () => {
    setSelectedIcon(null);
    setCtxMenu(null);
    setStartOpen(false);
  };

  const tasks: TaskItem[] = WIN_CONFIGS.filter((c) => windows[c.id].open).map((c) => ({
    id: c.id,
    title: c.title.split(" — ")[0],
    icon: c.icon,
  }));

  const handleIconClick = (id: WinId) => {
    if (coarse.current) {
      openWindow(id);
    } else {
      setSelectedIcon(id);
    }
  };

  const openJarvis = useCallback(() => {
    setStartOpen(false);
    setPhase((p) => (p === "desktop" ? "jarvis-install" : "jarvis"));
  }, []);

  const openWindowForJarvis = useCallback((id: string) => {
    if (["about", "projects", "skills", "resume", "contact", "computer", "music", "recycle"].includes(id)) {
      openWindow(id as WinId);
    }
  }, [openWindow]);

  /* ---------- phases ---------- */

  if (phase === "shutdown") {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center cursor-pointer select-none" onClick={() => setPhase("boot")}>
        <div className="text-[#f8a030] text-[20px] sm:text-[26px] font-semibold text-center px-6" style={{ fontFamily: "'Courier New', monospace" }}>
          It&apos;s now safe to turn off
          <br />
          your computer.
        </div>
        <div className="text-white/40 text-[13px] mt-8 text-center px-6">…just kidding 😄 Click anywhere to restart</div>
      </div>
    );
  }

  if (phase === "bsod") {
    return (
      <Bsod
        onRestart={() => {
          setWindows(initialWindows());
          setActiveId(null);
          setPhase("login");
        }}
      />
    );
  }

  return (
    <main className="win7-root fixed inset-0 overflow-hidden bg-[#1b4f8a]">
      {/* YouTube hidden player */}
      <YtPlayerHost />

      {/* Wallpaper */}
      <div className="absolute inset-0" onClick={onDesktopClick} onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY }); setSelectedIcon(null); }}>
        <img src="/win7-wallpaper.png" alt="Windows 7 style wallpaper" className="w-full h-full object-cover select-none" draggable={false} />
      </div>

      {/* Desktop icons */}
      <div className="absolute top-2 left-1 flex flex-col flex-wrap gap-0.5 p-1 win7-fade-in max-h-[calc(100%-60px)]">
        {DESKTOP_ICONS.map((d) => (
          <button
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              handleIconClick(d.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openWindow(d.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") openWindow(d.id);
            }}
            className={`win7-no-touch w-[78px] sm:w-[84px] flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-[3px] border cursor-default ${
              selectedIcon === d.id ? "bg-[#316ac5]/55 border-[#5a9ae0]" : "border-transparent hover:bg-white/15 hover:border-white/25"
            }`}
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] [&>svg]:w-full [&>svg]:h-full">{d.icon}</span>
            <span className="win7-icon-label text-[11px] sm:text-[11.5px] text-white text-center leading-[1.2] break-words w-full">{d.label}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {WIN_CONFIGS.map((c) => {
        const w = windows[c.id];
        if (!w.open || w.min) return null;
        return (
          <Win7Window
            key={c.id}
            title={c.title}
            icon={c.icon}
            pos={{ x: w.x, y: w.y, w: c.w, h: c.h } as WinPos}
            z={w.z}
            active={activeId === c.id}
            maximized={w.max}
            onFocus={() => {
              if (activeId !== c.id) focusWindow(c.id);
            }}
            onClose={() => closeWindow(c.id)}
            onMinimize={() => minimizeWindow(c.id)}
            onToggleMax={() => toggleMax(c.id)}
            onMove={(pos) => moveWindow(c.id, pos.x, pos.y)}
          >
            {c.content}
          </Win7Window>
        );
      })}

      {/* Start menu */}
      {startOpen && (
        <StartMenu onClose={() => setStartOpen(false)} onOpen={openWindow} onShutdown={() => setPhase("shutdown")} onJarvisOpen={openJarvis} />
      )}

      {/* Context menu */}
      {ctxMenu && (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            onPersonalize={() => {
              setCtxMenu(null);
              toast({ title: "Personalize", description: "Wallpaper already perfect he. Windows 7 forever 😎🪟" });
            }}
          />
        </div>
      )}

      {/* Taskbar */}
      <Taskbar
        tasks={tasks}
        activeId={activeId}
        minimized={Object.fromEntries(WIN_CONFIGS.map((c) => [c.id, windows[c.id].min]))}
        onTaskClick={onTaskClick}
        onStartToggle={() => {
          setSelectedIcon(null);
          setCtxMenu(null);
          setStartOpen((s) => !s);
        }}
        startOpen={startOpen}
        onMinimizeAll={minimizeAll}
        onJarvisOpen={openJarvis}
      />

      {/* Activate Windows watermark → JARVIS easter egg */}
      <ActivateWatermark onActivate={() => setPhase("jarvis-install")} />

      {/* Welcome bubble on first visit */}
      {phase === "desktop" && <WelcomeBubble onOpen={() => openWindow("music")} />}

      {/* Boot */}
      {phase === "boot" && <BootScreen onDone={() => setPhase("login")} />}

      {/* Login */}
      {phase === "login" && <LoginScreen onDone={() => setPhase("desktop")} />}

      {/* JARVIS install sequence */}
      {phase === "jarvis-install" && <JarvisInstall onDone={() => setPhase("jarvis")} />}

      {/* JARVIS HUD */}
      {phase === "jarvis" && (
        <JarvisMode
          onExit={() => setPhase("desktop")}
          onOpenWindow={openWindowForJarvis}
          onBsod={() => setPhase("bsod")}
        />
      )}
    </main>
  );
}

/* ================= Boot screen ================= */

function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3300);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="win7-boot-fadeout fixed inset-0 z-[9000] bg-black flex flex-col items-center justify-center cursor-pointer select-none" onClick={onDone}>
      <div className="relative w-[130px] h-[130px]">
        <div className="absolute inset-0 rounded-full bg-[#4aa8e8]/20 blur-2xl" />
        <div className="win7-boot-orb absolute left-[14px] top-[10px] w-[46px] h-[46px] rounded-full bg-[#f65314]" style={{ animationDelay: "0.25s", boxShadow: "0 0 30px 8px rgba(246,83,20,0.55)", clipPath: "path('M0,0 L46,0 L46,46 L23,40 Q6,36 0,20 Z')" }} />
        <div className="win7-boot-orb absolute right-[14px] top-[10px] w-[46px] h-[46px] rounded-full bg-[#7cbb00]" style={{ animationDelay: "0.55s", boxShadow: "0 0 30px 8px rgba(124,187,0,0.55)" }} />
        <div className="win7-boot-orb absolute left-[14px] bottom-[10px] w-[46px] h-[46px] rounded-full bg-[#00a1f1]" style={{ animationDelay: "0.85s", boxShadow: "0 0 30px 8px rgba(0,161,241,0.55)" }} />
        <div className="win7-boot-orb absolute right-[14px] bottom-[10px] w-[46px] h-[46px] rounded-full bg-[#ffbb00]" style={{ animationDelay: "1.15s", boxShadow: "0 0 30px 8px rgba(255,187,0,0.55)" }} />
        <div className="win7-boot-flag absolute inset-0 flex items-center justify-center">
          <span className="text-[#bfe4ff] text-[42px] leading-none win7-breathe" style={{ textShadow: "0 0 30px rgba(120,200,255,0.9)" }}>🪟</span>
        </div>
      </div>
      <div className="win7-boot-text text-white/90 text-[15px] sm:text-[17px] font-light mt-10">Starting Windows</div>
      <div className="absolute bottom-6 text-white/30 text-[11px] tracking-[0.2em]">© {profile.name.toUpperCase()} PC • PORTFOLIO 7 ULTIMATE</div>
      <div className="absolute bottom-2 right-3 text-white/25 text-[10px]">click to skip</div>
    </div>
  );
}

/* ================= Login screen ================= */

function LoginScreen({ onDone }: { onDone: () => void }) {
  const { toast } = useToast();
  const [pw, setPw] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const submit = () => {
    if (pw.trim().toLowerCase() === "harish" || pw.trim() === "") {
      // empty = guest quick login
      if (!pw.trim()) {
        toast({ title: "Guest login", description: "Password nahi pata? Koi baat nahi — andar chalo, masti karo 😄" });
      }
      onDone();
      return;
    }
    setAttempts((a) => a + 1);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setPw("");
  };

  return (
    <div className="fixed inset-0 z-[9000] flex flex-col items-center justify-center select-none" style={{ background: "radial-gradient(ellipse at 50% 35%, #2a6aa8 0%, #123a66 55%, #081e38 100%)" }}>
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at 80% 80%, rgba(90,171,224,0.35), transparent 45%)" }} />
      <img src={profile.avatar} alt={profile.name} className="w-[96px] h-[96px] rounded-[6px] object-cover border-[3px] border-white/80 shadow-[0_6px_30px_rgba(0,0,0,0.5)]" draggable={false} />
      <div className="text-white text-[22px] mt-3 font-light" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
        {profile.name}
      </div>
      <div className={`mt-4 flex items-center gap-1.5 ${shake ? "win7-shake" : ""}`}>
        <input
          ref={inputRef}
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-[210px] h-[32px] px-3 text-[13px] rounded-[3px] bg-white/95 border border-[#8ab4d8] outline-none focus:border-[#5aabe0] focus:shadow-[0_0_8px_rgba(120,200,255,0.6)] text-[#1a2a38]"
        />
        <button
          aria-label="Sign in"
          onClick={submit}
          className="h-[32px] px-3.5 text-[12.5px] rounded-[3px] text-white border border-white/40 bg-gradient-to-b from-[#6cb8ec] to-[#2173b4] hover:from-[#84c6f4] shadow"
        >
          →
        </button>
      </div>
      <div className="mt-3 text-white/60 text-[11.5px]">
        {attempts === 0
          ? "Hint: tumhara apna naam type karo 😉 (ya blank chhod ke guest ban jao)"
          : `Galat password ${attempts} baar. Hint de diya tha — apna naam! Ya blank = guest entry.`}
      </div>
      {attempts >= 2 && (
        <button onClick={onDone} className="mt-3 text-[11.5px] px-3 py-1 rounded-[3px] border border-white/30 text-white/85 hover:bg-white/15">
          Guest login →
        </button>
      )}
      <div className="absolute bottom-5 text-white/35 text-[10.5px] tracking-[0.25em]">PORTFOLIO 7 ULTIMATE • {profile.role.toUpperCase()}</div>
    </div>
  );
}

/* ================= Activate Windows watermark ================= */

function ActivateWatermark({ onActivate }: { onActivate: () => void }) {
  const [dialog, setDialog] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [installing, setInstalling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dialog) setTimeout(() => inputRef.current?.focus(), 120);
  }, [dialog]);

  const activate = () => {
    const v = key.trim().toLowerCase();
    if (v === "jarvis") {
      setInstalling(true);
      setError("");
      setTimeout(() => {
        setDialog(false);
        setKey("");
        setInstalling(false);
        onActivate();
      }, 1800);
    } else {
      setError("Ye key toh Chor Bazaar se lagti he 😅 Hint: J.A.R.V.I.S ka naam type karo");
      setShakeNow();
    }
  };

  const [shaking, setShaking] = useState(false);
  const setShakeNow = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  return (
    <>
      {/* watermark */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDialog(true);
        }}
        className="fixed right-3 bottom-[48px] z-[3600] text-right leading-[1.3] pointer-events-auto hover:bg-white/10 rounded px-1 transition-colors"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
        title="Activate Windows (jo bhi karo, kuch toh hoga 😄)"
      >
        <div className="text-white/45 text-[12.5px]">Activate Windows</div>
        <div className="text-white/40 text-[11.5px]">Go to Settings to activate Windows.</div>
      </button>

      {/* dialog */}
      {dialog && (
        <div className="fixed inset-0 z-[7000] bg-black/45 flex items-center justify-center px-4" onClick={() => !installing && setDialog(false)}>
          <div
            className={`w-[380px] max-w-full rounded-[6px] overflow-hidden border border-[#8ab4d8] shadow-[0_20px_60px_rgba(0,0,0,0.55)] ${shaking ? "win7-shake" : ""}`}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "linear-gradient(to bottom, #eef4fa, #dce8f4)" }}
          >
            <div className="flex items-center justify-between px-3 h-[30px] text-[12px] text-white" style={{ background: "linear-gradient(to bottom, #5a9ad0, #2f6a9e)" }}>
              <span>Windows Activation — Secure Channel 🔐</span>
              {!installing && (
                <button aria-label="Close" onClick={() => setDialog(false)} className="text-white/85 hover:text-white text-[13px] leading-none">
                  ✕
                </button>
              )}
            </div>
            <div className="p-4">
              {installing ? (
                <div className="py-3">
                  <div className="text-[13px] text-[#1a2a38] font-semibold mb-2">Key accepted — J.A.R.V.I.S install ho raha he…</div>
                  <div className="h-[14px] rounded-[7px] border border-[#b8c8d6] bg-white overflow-hidden">
                    <div className="h-full bg-gradient-to-b from-[#8fd0f8] to-[#2f7fc1] win7-progress-anim" />
                  </div>
                  <div className="text-[11px] text-[#4a6072] mt-2 tracking-wide">NEURAL LINK • MEMORY CORE • VOICE MODULES</div>
                </div>
              ) : (
                <>
                  <div className="text-[12.5px] text-[#1a2a38] leading-[1.55]">
                    Windows activate karne ke liye apni product key daalo.
                    <div className="text-[11px] text-[#7a8a98] mt-0.5">(Kuch bhi ho sakta he — try karo 😏)</div>
                  </div>
                  <input
                    ref={inputRef}
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && activate()}
                    placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                    className="mt-3 w-full h-[32px] px-3 text-[13px] tracking-[0.18em] rounded-[3px] bg-white border border-[#8ab4d8] outline-none focus:border-[#5aabe0] focus:shadow-[0_0_8px_rgba(120,200,255,0.6)] text-[#1a2a38]"
                  />
                  {error && <div className="mt-2 text-[11.5px] text-[#c0392b] leading-snug">{error}</div>}
                  <div className="flex justify-end gap-2 mt-3.5">
                    <button onClick={() => setDialog(false)} className="h-[28px] px-3 text-[12px] rounded-[3px] border border-[#b8c8d6] bg-white hover:bg-[#f0f6fb] text-[#2a3a48]">
                      Later
                    </button>
                    <button onClick={activate} className="h-[28px] px-4 text-[12px] rounded-[3px] text-white border border-[#1d5f94] bg-gradient-to-b from-[#6cb8ec] to-[#2173b4] hover:from-[#84c6f4] shadow">
                      Activate
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= JARVIS install sequence ================= */

function JarvisInstall({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const n = p + Math.random() * 18 + 8;
        if (n >= 100) {
          clearInterval(t);
          setTimeout(onDone, 600);
          return 100;
        }
        return n;
      });
    }, 280);
    return () => clearInterval(t);
  }, [onDone]);

  const lines = [
    "Unmounting Windows constraints…",
    "Mounting J.A.R.V.I.S kernel v5.1…",
    "Calibrating neural link…",
    "Syncing memory core…",
    "Bootstrapping satellite uplink…",
    "All systems nominal — launching…",
  ];
  const lineIdx = Math.min(lines.length - 1, Math.floor((progress / 100) * lines.length));

  return (
    <div className="fixed inset-0 z-[9400] bg-[#02090f] flex flex-col items-center justify-center select-none">
      <div className="absolute inset-0 jarvis-grid opacity-40" />
      <div className="relative w-[140px] h-[140px] jarvis-holo-scan">
        <img src="/jarvis-helmet.png" alt="JARVIS installing" className="w-full h-full object-contain jarvis-holo [mask-image:radial-gradient(circle,black_52%,transparent_70%)]" draggable={false} />
      </div>
      <div className="text-cyan-200 tracking-[0.4em] text-[13px] mt-6">J.A.R.V.I.S</div>
      <div className="w-[240px] h-[10px] mt-4 rounded-[5px] border border-cyan-400/30 bg-black/50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#0b7fb0] via-[#41c7f0] to-[#bff4ff] transition-all duration-200" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
      <div className="text-cyan-300/70 text-[11px] mt-3 h-4 tracking-wider">{lines[lineIdx]}</div>
    </div>
  );
}

/* ================= Welcome bubble ================= */

function WelcomeBubble({ onOpen }: { onOpen: () => void }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, []);
  if (dismissed) return null;
  return (
    <div className={`fixed left-3 bottom-[52px] z-[3800] max-w-[250px] transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="rounded-[8px] border border-white/30 bg-[#123]/85 backdrop-blur-md p-3 shadow-xl">
        <div className="text-[12.5px] text-white/95 font-semibold">{profile.name} — Portfolio 🪟</div>
        <div className="text-[11.5px] text-white/75 mt-1">
          Music Library me 151 songs he (YouTube Music se). Aur haan — taskbar ke JARVIS button ya &quot;Activate Windows&quot; pe click karo 😉
        </div>
        <div className="flex gap-2 mt-2.5">
          <button
            onClick={() => {
              setDismissed(true);
              onOpen();
            }}
            className="text-[11.5px] px-2.5 py-1 rounded-[4px] bg-gradient-to-b from-[#5ab5ee] to-[#1a6fb0] text-white border border-white/30 hover:from-[#7ec5f5]"
          >
            Play Music 🎵
          </button>
          <button onClick={() => setDismissed(true)} className="text-[11.5px] px-2.5 py-1 rounded-[4px] bg-white/10 text-white/85 border border-white/20 hover:bg-white/20">
            Theek he, khud dekhunga
          </button>
        </div>
      </div>
    </div>
  );
}
