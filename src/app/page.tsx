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
} from "@/components/win7/icons";
import {
  AboutContent,
  ProjectsContent,
  SkillsContent,
  ResumeContent,
  ContactContent,
  ComputerContent,
  RecycleContent,
} from "@/components/win7/contents";
import { profile } from "@/lib/portfolio";

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
  { id: "about", title: "About_Me.txt — Notepad", icon: <NotepadIcon />, w: 560, h: 470, content: <AboutContent /> },
  { id: "projects", title: "Projects — Explorer", icon: <FolderIcon />, w: 660, h: 470, content: <ProjectsContent /> },
  { id: "skills", title: "Skills.exe", icon: <GearIcon />, w: 640, h: 430, content: <SkillsContent /> },
  { id: "resume", title: "Resume.pdf — Reader", icon: <PdfIcon />, w: 600, h: 510, content: <ResumeContent /> },
  { id: "contact", title: "New Message — Contact.exe", icon: <ContactIcon />, w: 540, h: 530, content: <ContactContent /> },
  { id: "computer", title: "Computer — System Info", icon: <ComputerIcon />, w: 640, h: 460, content: <ComputerContent /> },
  { id: "recycle", title: "Recycle Bin", icon: <RecycleBinIcon />, w: 560, h: 380, content: <RecycleContent /> },
];

const DESKTOP_ICONS: { id: WinId; label: string; icon: React.ReactNode }[] = [
  { id: "about", label: "About_Me.txt", icon: <NotepadIcon /> },
  { id: "projects", label: "My Projects", icon: <FolderIcon /> },
  { id: "skills", label: "Skills.exe", icon: <GearIcon /> },
  { id: "resume", label: "Resume.pdf", icon: <PdfIcon /> },
  { id: "contact", label: "Contact.exe", icon: <ContactIcon /> },
  { id: "computer", label: "Computer", icon: <ComputerIcon /> },
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

/* ================= page ================= */

export default function DesktopPage() {
  const { toast } = useToast();
  const [booting, setBooting] = useState(true);
  const [shutdown, setShutdown] = useState(false);
  const [windows, setWindows] = useState<Record<WinId, WinState>>(initialWindows);
  const [activeId, setActiveId] = useState<WinId | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<WinId | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const zTop = useRef(20);
  const cascade = useRef(0);
  const autoOpened = useRef(false);
  const coarse = useRef(false);
  const windowsRef = useRef(windows);
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  /* boot timer */
  useEffect(() => {
    if (!booting) return;
    const t = setTimeout(() => setBooting(false), 3300);
    return () => clearTimeout(t);
  }, [booting]);

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

  const openWindow = useCallback(
    (id: WinId) => {
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
    },
    []
  );

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

  /* auto-open About after boot */
  useEffect(() => {
    if (booting || autoOpened.current) return;
    autoOpened.current = true;
    const t = setTimeout(() => openWindow("about"), 650);
    return () => clearTimeout(t);
  }, [booting, openWindow]);

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

  /* click on desktop: deselect icon, close menus */
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

  if (shutdown) {
    return (
      <div
        className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={() => setShutdown(false)}
      >
        <div className="text-[#f8a030] text-[20px] sm:text-[26px] font-semibold text-center px-6" style={{ fontFamily: "'Courier New', monospace" }}>
          It&apos;s now safe to turn off
          <br />
          your computer.
        </div>
        <div className="text-white/40 text-[13px] mt-8 text-center px-6">
          …just kidding 😄 Click anywhere to restart
        </div>
      </div>
    );
  }

  return (
    <main className="win7-root fixed inset-0 overflow-hidden bg-[#1b4f8a]">
      {/* Wallpaper */}
      <div className="absolute inset-0" onClick={onDesktopClick} onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY }); setSelectedIcon(null); }}>
        <img
          src="/win7-wallpaper.png"
          alt="Windows 7 style wallpaper"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
      </div>

      {/* Desktop icons */}
      <div className="absolute top-2 left-1 flex flex-col gap-0.5 p-1 win7-fade-in">
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
              selectedIcon === d.id
                ? "bg-[#316ac5]/55 border-[#5a9ae0]"
                : "border-transparent hover:bg-white/15 hover:border-white/25"
            }`}
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] [&>svg]:w-full [&>svg]:h-full">
              {d.icon}
            </span>
            <span className="win7-icon-label text-[11px] sm:text-[11.5px] text-white text-center leading-[1.2] break-words w-full">
              {d.label}
            </span>
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
            onFocus={() => { if (activeId !== c.id) focusWindow(c.id); }}
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
        <StartMenu
          onClose={() => setStartOpen(false)}
          onOpen={openWindow}
          onShutdown={() => setShutdown(true)}
        />
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
      />

      {/* Boot screen */}
      {booting && (
        <div
          className="win7-boot-fadeout fixed inset-0 z-[9000] bg-black flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={() => setBooting(false)}
        >
          {/* four glowing orbs */}
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
          <div className="absolute bottom-6 text-white/30 text-[11px] tracking-[0.2em]">© DOSANJHCORP™</div>
          <div className="absolute bottom-2 right-3 text-white/25 text-[10px]">click to skip</div>
        </div>
      )}

      {/* Welcome bubble on first visit */}
      {!booting && <WelcomeBubble onOpen={() => openWindow("about")} />}
    </main>
  );
}

/* Little hint bubble bottom-right, dismisses on click */
function WelcomeBubble({ onOpen }: { onOpen: () => void }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, []);
  if (dismissed) return null;
  return (
    <div
      className={`fixed right-3 bottom-[52px] z-[3800] max-w-[250px] transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="rounded-[8px] border border-white/30 bg-[#123]/85 backdrop-blur-md p-3 shadow-xl">
        <div className="text-[12.5px] text-white/95 font-semibold">{profile.name} — Portfolio 🪟</div>
        <div className="text-[11.5px] text-white/75 mt-1">
          Desktop icons pe click karo, windows khulengi. Start menu bhi try karo!
        </div>
        <div className="flex gap-2 mt-2.5">
          <button
            onClick={() => {
              setDismissed(true);
              onOpen();
            }}
            className="text-[11.5px] px-2.5 py-1 rounded-[4px] bg-gradient-to-b from-[#5ab5ee] to-[#1a6fb0] text-white border border-white/30 hover:from-[#7ec5f5]"
          >
            About Me
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-[11.5px] px-2.5 py-1 rounded-[4px] bg-white/10 text-white/85 border border-white/20 hover:bg-white/20"
          >
            Theek he, khud dekhunga
          </button>
        </div>
      </div>
    </div>
  );
}
