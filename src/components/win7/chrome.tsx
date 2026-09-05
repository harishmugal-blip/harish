"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Wifi, ChevronUp } from "lucide-react";
import { IEIcon, MediaIcon, FolderIcon, WinFlag } from "./icons";
import { useToast } from "@/hooks/use-toast";
import { profile } from "@/lib/portfolio";
import { getRadioSnapshot, subscribeRadio, togglePlayPause, nextSong, radioStart } from "@/lib/radio";

export type WinId = "about" | "projects" | "skills" | "resume" | "contact" | "computer" | "recycle" | "music";

export interface TaskItem {
  id: WinId;
  title: string;
  icon: ReactNode;
}

/* ---------------- Live Clock ---------------- */
export function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    const t0 = setTimeout(update, 0);
    const t = setInterval(update, 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);
  if (!now) return <div className="w-[70px]" />;
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const date = now.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  return (
    <div className="text-center leading-[1.25] px-2 cursor-default select-none">
      <div className="text-[11.5px] text-white/95">{time}</div>
      <div className="text-[11px] text-white/85">{date}</div>
    </div>
  );
}

/* ---------------- Radio tray (taskbar) ---------------- */
function RadioTray() {
  const radio = useSyncExternalStore(subscribeRadio, getRadioSnapshot, () => getRadioSnapshot());
  const { toast } = useToast();

  if (!radio.on) {
    return (
      <button
        aria-label="Radio — play music"
        className="win7-no-touch flex items-center gap-1 px-1.5 py-[3px] rounded-[3px] hover:bg-white/20"
        onClick={() => {
          void radioStart("OLD");
          toast({ title: "♪ Radio ON", description: "YouTube Music se old songs laga raha hu — link live dhundhta hu 🎵" });
        }}
      >
        <MediaIcon className="w-[17px] h-[17px]" />
        <span className="hidden md:inline text-[10.5px] text-white/75">Radio</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 px-1.5 max-w-[190px]">
      <button aria-label="Play/Pause" className="win7-no-touch text-white/90 hover:text-white text-[11px] px-1" onClick={() => togglePlayPause()}>
        {radio.loading ? "…" : radio.playing ? "❚❚" : "▶"}
      </button>
      <button aria-label="Next" className="win7-no-touch text-white/90 hover:text-white text-[10px] px-0.5" onClick={() => nextSong()}>
        ▶▶
      </button>
      <div className="min-w-0 leading-[1.15]">
        <div className="text-[10px] text-white/90 truncate max-w-[110px]">♪ {radio.song?.title || "Loading…"}</div>
        <div className="text-[9px] text-white/55 truncate max-w-[110px]">{radio.playing ? "YT Music • playing" : "paused"}</div>
      </div>
    </div>
  );
}

/* ---------------- Taskbar ---------------- */
interface TaskbarProps {
  tasks: TaskItem[];
  activeId: WinId | null;
  minimized: Record<string, boolean>;
  onTaskClick: (id: WinId) => void;
  onStartToggle: () => void;
  startOpen: boolean;
  onMinimizeAll: () => void;
  onJarvisOpen: () => void;
}

export function Taskbar({ tasks, activeId, minimized, onTaskClick, onStartToggle, startOpen, onMinimizeAll, onJarvisOpen }: TaskbarProps) {
  const { toast } = useToast();

  return (
    <div
      className="fixed bottom-0 inset-x-0 h-[40px] z-[4000] flex items-stretch select-none"
      style={{
        background:
          "linear-gradient(to bottom, rgba(70,110,160,0.62) 0%, rgba(38,66,108,0.72) 12%, rgba(18,38,70,0.82) 55%, rgba(10,24,48,0.9) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.28)",
        backdropFilter: "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
      }}
    >
      {/* Start orb */}
      <div className="relative shrink-0">
        <button
          aria-label="Start"
          onClick={onStartToggle}
          className="win7-no-touch relative -top-[1px] ml-[2px] mt-[1px] w-[50px] h-[38px] flex items-center justify-center group"
        >
          <span
            className={`w-[37px] h-[37px] rounded-full flex items-center justify-center transition-all duration-150 ${startOpen ? "win7-breathe text-[#9fd8ff]" : ""}`}
            style={{
              background: startOpen
                ? "radial-gradient(circle at 35% 28%, #d8f2ff 0%, #5ab5ee 45%, #1a6fb0 80%, #0d4f86 100%)"
                : "radial-gradient(circle at 35% 28%, #bfe8ff 0%, #4aa8e8 40%, #1663a4 78%, #0a4070 100%)",
              boxShadow: startOpen
                ? "0 0 14px 4px rgba(120,200,255,0.65), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,20,50,0.5)"
                : "0 1px 4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.55), inset 0 -4px 8px rgba(0,20,50,0.55)",
            }}
          >
            <WinFlag className="w-[19px] h-[19px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
          </span>
        </button>
      </div>

      {/* Quick launch */}
      <div className="hidden sm:flex items-center gap-[2px] px-1.5 mr-1 shrink-0 border-x border-white/10 my-[5px]">
        <button
          aria-label="Internet Explorer"
          className="win7-no-touch p-[3px] rounded-[3px] hover:bg-white/20"
          onClick={() => toast({ title: "Internet Explorer", description: "42 tabs open. Send help. 🥱 (IE is just decorative here)" })}
        >
          <IEIcon className="w-[22px] h-[22px]" />
        </button>
        <button aria-label="File Explorer" className="win7-no-touch p-[3px] rounded-[3px] hover:bg-white/20" onClick={() => onTaskClick("computer")}>
          <FolderIcon className="w-[22px] h-[22px]" />
        </button>
        <button aria-label="Music Library" className="win7-no-touch p-[3px] rounded-[3px] hover:bg-white/20" onClick={() => onTaskClick("music")}>
          <MediaIcon className="w-[22px] h-[22px]" />
        </button>
        {/* JARVIS launch */}
        <button
          aria-label="Launch JARVIS"
          onClick={onJarvisOpen}
          title="Launch J.A.R.V.I.S"
          className="win7-no-touch p-[3px] rounded-[3px] hover:bg-cyan-400/25 group relative"
        >
          <span className="block w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_28%,#bff4ff_0%,#41c7f0_45%,#0b7fb0_85%)] shadow-[0_0_8px_rgba(80,220,255,0.55),inset_0_1px_2px_rgba(255,255,255,0.6)] flex items-center justify-center win7-breathe" />
        </button>
      </div>

      {/* Window buttons */}
      <div className="flex-1 flex items-center gap-[3px] px-1.5 min-w-0 overflow-hidden">
        {tasks.map((t) => {
          const isActive = activeId === t.id && !minimized[t.id];
          return (
            <button
              key={t.id}
              onClick={() => onTaskClick(t.id)}
              title={t.title}
              className={`win7-no-touch flex items-center gap-1.5 h-[28px] max-w-[165px] min-w-0 px-2 rounded-[3px] border text-left transition-colors ${
                isActive ? "bg-white/30 border-white/40 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]" : "bg-white/10 border-white/15 hover:bg-white/20"
              }`}
            >
              <span className="w-4 h-4 shrink-0 [&>svg]:w-4 [&>svg]:h-4">{t.icon}</span>
              <span className="text-[11.5px] text-white/95 truncate" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.7)" }}>
                {t.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-1 px-2 shrink-0 border-l border-white/15">
        <RadioTray />
        <button
          aria-label="Hidden icons"
          className="win7-no-touch p-1 rounded-[3px] hover:bg-white/20"
          onClick={() => toast({ title: "Hidden icons", description: "Sab chhupa rakha he. Spy mode: ON. 🕶" })}
        >
          <ChevronUp className="w-3.5 h-3.5 text-white/85" />
        </button>
        <button
          aria-label="Network"
          className="win7-no-touch p-1 rounded-[3px] hover:bg-white/20 hidden sm:block"
          onClick={() => toast({ title: "Network", description: "Connected to: DesiNet_5G (bars full, speed full, data khatam 😭)" })}
        >
          <Wifi className="w-4 h-4 text-white/85" />
        </button>
        <Clock />
        {/* Show desktop */}
        <button
          aria-label="Show desktop"
          onClick={onMinimizeAll}
          className="win7-no-touch w-[12px] self-stretch my-0 border-l border-white/40 hover:bg-white/25"
          title="Show desktop"
        />
      </div>
    </div>
  );
}

/* ---------------- Start Menu ---------------- */
interface StartMenuProps {
  onClose: () => void;
  onOpen: (id: WinId) => void;
  onShutdown: () => void;
  onJarvisOpen: () => void;
}

export function StartMenu({ onClose, onOpen, onShutdown, onJarvisOpen }: StartMenuProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  const programs: { id: WinId | "ie" | "games" | "jarvis"; label: string; icon: ReactNode; sub?: string }[] = [
    { id: "ie", label: "Internet Explorer", icon: <IEIcon className="w-6 h-6" /> },
    { id: "about", label: "About_Me.txt", icon: <span className="text-lg">📝</span> },
    { id: "projects", label: "My Projects", icon: <FolderIcon className="w-6 h-6" /> },
    { id: "skills", label: "Skills.exe", icon: <span className="text-lg">⚙️</span>, sub: "Skill Manager 7" },
    { id: "resume", label: "Resume.pdf", icon: <span className="text-lg">📄</span> },
    { id: "contact", label: "Contact.exe", icon: <span className="text-lg">📨</span> },
    { id: "computer", label: "Computer", icon: <span className="text-lg">💻</span> },
    { id: "music", label: "Music Library", icon: <span className="text-lg">🎵</span>, sub: "151 songs • YT Music" },
    { id: "jarvis", label: "J.A.R.V.I.S", icon: <span className="text-lg">🤖</span>, sub: "AI assistant — password protected" },
    { id: "games", label: "Games", icon: <span className="text-lg">🎮</span> },
  ];

  const filtered = programs.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

  const launch = (id: WinId | "ie" | "games" | "jarvis") => {
    onClose();
    if (id === "ie") toast({ title: "Internet Explorer", description: "Ye sirf nostalgia ke liye he. Asli browsing Chrome me hoti he 😄" });
    else if (id === "games") toast({ title: "Games", description: "Minesweeper delete ho gaya deadline ke pehle. Sorry yaar 🙈" });
    else if (id === "jarvis") onJarvisOpen();
    else onOpen(id);
  };

  const links: { label: string; action: () => void; highlight?: boolean }[] = [
    { label: profile.name, action: () => launch("about"), highlight: true },
    { label: "Documents", action: () => launch("resume") },
    { label: "Music", action: () => launch("music") },
    { label: "Computer", action: () => launch("computer") },
    { label: "J.A.R.V.I.S", action: () => onJarvisOpen() },
    { label: "Control Panel", action: () => launch("skills") },
    { label: "Help and Support", action: () => { onClose(); toast({ title: "Help and Support", description: "Support aadmi so gaya. J.A.R.V.I.S se pucho — wo 24x7 jagta he 😄" }); } },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[3900]" onClick={onClose} />
      <div
        className="win7-menu-anim fixed left-0 bottom-[40px] z-[3950] rounded-tr-[8px] rounded-br-[8px] flex"
        style={{
          width: "min(400px, calc(100vw - 12px))",
          height: "min(500px, calc(100vh - 70px))",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "linear-gradient(to bottom, rgba(40,70,110,0.75), rgba(20,40,75,0.85))",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          backdropFilter: "blur(18px) saturate(1.5)",
          WebkitBackdropFilter: "blur(18px) saturate(1.5)",
        }}
      >
        {/* Left pane */}
        <div className="w-[58%] min-w-0 flex flex-col bg-[#f6f8fa]/95 rounded-tl-[6px] m-[1px] mr-0">
          <div className="flex-1 overflow-auto py-1.5 win7-scroll">
            {filtered.length === 0 && <div className="px-3 py-2 text-[12px] text-[#7a8a98] italic">Kuch nahi mila &quot;{query}&quot; 🤷</div>}
            {filtered.map((p) => (
              <button
                key={p.label}
                onClick={() => launch(p.id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-[5px] text-left hover:bg-gradient-to-b hover:from-[#e8f4fd] hover:to-[#c9e4f8] hover:outline hover:outline-1 hover:outline-[#b3d8f0]"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6">{p.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] text-[#1a2a38] truncate">{p.label}</span>
                  {p.sub && <span className="block text-[10.5px] text-[#7a8a98] truncate">{p.sub}</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-[#dfe6ec]">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered[0]) launch(filtered[0].id);
                if (e.key === "Escape") onClose();
              }}
              placeholder="Search programs and files"
              className="w-full h-[24px] text-[12px] px-2.5 rounded-[3px] border border-[#b8c8d6] bg-white outline-none focus:border-[#5aabe0] focus:shadow-[0_0_5px_#8ec9ee]"
            />
          </div>
        </div>

        {/* Right pane */}
        <div className="flex-1 flex flex-col p-2.5 min-w-0">
          <button onClick={() => launch("about")} className="mx-auto mt-2 mb-1 win7-no-touch">
            <img src={profile.avatar} alt={profile.name} className="w-[52px] h-[52px] rounded-[4px] object-cover border-2 border-white/70 shadow-md" draggable={false} />
          </button>
          <div className="text-center text-[12px] text-white font-semibold mb-1" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
            {profile.name}
          </div>
          <div className="flex flex-col mt-0.5 flex-1 min-h-0 overflow-auto win7-scroll">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={l.action}
                className={`text-left px-2 py-[5px] rounded-[3px] text-[12px] truncate ${l.highlight ? "text-white font-semibold" : "text-white/85 hover:text-white hover:bg-white/15"}`}
                style={l.highlight ? { textShadow: "0 1px 2px rgba(0,0,0,0.6)" } : undefined}
              >
                {l.label}
              </button>
            ))}
          </div>
          {/* Shut down */}
          <div className="flex mt-2 shrink-0">
            <button
              onClick={() => {
                onClose();
                onShutdown();
              }}
              className="flex-1 h-[26px] text-[12px] text-white/95 px-3 rounded-l-[3px] border border-white/25 bg-gradient-to-b from-white/20 to-white/5 hover:from-[#f8b060]/50 hover:to-[#e08030]/40 hover:border-[#f8b060]/50"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.7)" }}
            >
              Shut down
            </button>
            <button
              aria-label="More shutdown options"
              onClick={() => {
                onClose();
                toast({ title: "Shutdown options", description: "Sleep? Restart? Bhai pehle J.A.R.V.I.S toh try kar lo 😄" });
              }}
              className="w-[22px] h-[26px] text-white/95 rounded-r-[3px] border border-l-0 border-white/25 bg-gradient-to-b from-white/20 to-white/5 hover:from-[#f8b060]/50 hover:to-[#e08030]/40 text-[10px]"
            >
              ▸
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Desktop Context Menu ---------------- */
export function ContextMenu({ x, y, onPersonalize }: { x: number; y: number; onPersonalize: () => void }) {
  const { toast } = useToast();
  const item =
    "w-full text-left px-4 py-[4px] text-[12px] text-[#1a2a38] hover:bg-gradient-to-b hover:from-[#e8f4fd] hover:to-[#c9e4f8] cursor-default";
  const disabled = "w-full text-left px-4 py-[4px] text-[12px] text-[#a8b4c0] cursor-default";
  return (
    <div
      className="fixed z-[6000] w-[170px] py-[2px] rounded-[3px] border border-[#b0c0ce] bg-[#f6f8fa]/97 shadow-[0_6px_24px_rgba(0,0,0,0.35)] backdrop-blur-md select-none"
      style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 220) }}
    >
      <div className={item}>View ▸</div>
      <div className={item}>Sort by ▸</div>
      <div className={item} onClick={() => toast({ title: "Refresh", description: "Desktop refresh ho gaya. Kuch nahi badla. Jaise zindagi. 😄" })}>
        Refresh
      </div>
      <div className="h-[1px] bg-[#dfe6ec] my-[2px] mx-1" />
      <div className={disabled}>Paste</div>
      <div className={item}>New ▸</div>
      <div className="h-[1px] bg-[#dfe6ec] my-[2px] mx-1" />
      <div className={item} onClick={() => toast({ title: "Screen resolution", description: "Recommended: 1920×1080. Tumhari aankh recommend: 6/6 😎" })}>
        Screen resolution
      </div>
      <div className={item} onClick={onPersonalize}>
        Personalize
      </div>
    </div>
  );
}
