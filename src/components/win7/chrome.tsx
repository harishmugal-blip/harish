"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronUp } from "lucide-react";
import {
  IEIcon,
  MediaIcon,
  FolderIcon,
  WinFlag,
  NotepadIcon,
  PdfIcon,
  ContactIcon,
  ComputerIcon,
  GearIcon,
  GamesIcon,
  AgencyIcon,
  TrayFlagIcon,
  NetworkBarsIcon,
  VolumeIcon,
} from "./icons";
import { useToast } from "@/hooks/use-toast";
import { profile } from "@/lib/portfolio";
import { getRadioSnapshot, subscribeRadio, togglePlayPause, nextSong, radioStart } from "@/lib/radio";

export type WinId = "about" | "projects" | "skills" | "resume" | "contact" | "computer" | "recycle" | "music" | "privatevid" | "myex" | "office" | "admin";

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
  const date = now.toLocaleDateString("en-GB").split("/").join("-"); // DD-MM-YYYY — real Win7 jaisa
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
          "linear-gradient(to bottom, rgba(210,230,248,0.6) 0%, rgba(110,140,175,0.66) 7%, rgba(38,60,92,0.86) 18%, rgba(12,24,44,0.94) 48%, rgba(1,4,10,0.97) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.45)",
        backdropFilter: "blur(18px) saturate(1.35)",
        WebkitBackdropFilter: "blur(18px) saturate(1.35)",
      }}
    >
      {/* Start orb — protrudes above the bar like real Win7 */}
      <div className="relative w-[56px] shrink-0">
        <button
          aria-label="Start"
          onClick={onStartToggle}
          className="win7-no-touch absolute -top-[5px] left-0 w-[56px] h-[47px] flex items-center justify-center group"
        >
          <span
            className={`relative w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-150 group-hover:scale-[1.06] ${startOpen ? "win7-breathe" : ""}`}
            style={{
              background:
                "radial-gradient(circle at 35% 24%, #f2fbff 0%, #a8dcf8 18%, #52aeee 44%, #1a6fc4 70%, #0b4a97 88%, #073568 100%)",
              boxShadow: startOpen
                ? "0 0 20px 6px rgba(130,205,255,0.8), inset 0 2px 6px rgba(255,255,255,0.85), inset 0 -6px 10px rgba(0,25,60,0.65)"
                : "0 2px 7px rgba(0,0,0,0.7), 0 0 12px 3px rgba(90,160,230,0.4), inset 0 2px 6px rgba(255,255,255,0.8), inset 0 -6px 10px rgba(0,25,60,0.65)",
            }}
          >
            {/* glass sheen — Win7 orb ki chamak */}
            <span
              className="absolute inset-[2px] rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 32%, rgba(255,255,255,0) 52%)",
              }}
            />
            <WinFlag className="relative z-10 w-[22px] h-[22px] drop-shadow-[0_1px_1px_rgba(0,10,30,0.6)]" />
          </span>
        </button>
      </div>

      {/* Pinned + window buttons — Win7 superbar: icon-only glass squares */}
      <div className="flex-1 flex items-center gap-[2px] px-1 min-w-0 overflow-hidden">
        <button
          aria-label="Internet Explorer"
          title="Internet Explorer"
          className="win7-no-touch w-[40px] h-[33px] shrink-0 rounded-[4px] border border-transparent hover:border-white/25 hover:bg-white/15 flex items-center justify-center"
          onClick={() => toast({ title: "Internet Explorer", description: "42 tabs open. Send help. 🥱 (IE is just decorative here)" })}
        >
          <IEIcon className="w-[24px] h-[24px]" />
        </button>
        <button
          aria-label="File Explorer"
          title="File Explorer"
          className="win7-no-touch w-[40px] h-[33px] shrink-0 rounded-[4px] border border-transparent hover:border-white/25 hover:bg-white/15 flex items-center justify-center"
          onClick={() => onTaskClick("computer")}
        >
          <FolderIcon className="w-[24px] h-[24px]" />
        </button>
        <button
          aria-label="Windows Media Player"
          title="Music Library — 151 songs"
          className="win7-no-touch w-[40px] h-[33px] shrink-0 rounded-[4px] border border-transparent hover:border-white/25 hover:bg-white/15 flex items-center justify-center"
          onClick={() => onTaskClick("music")}
        >
          <MediaIcon className="w-[24px] h-[24px]" />
        </button>
        <button
          aria-label="Launch JARVIS"
          title="Launch J.A.R.V.I.S"
          onClick={onJarvisOpen}
          className="win7-no-touch w-[40px] h-[33px] shrink-0 rounded-[4px] border border-transparent hover:border-cyan-300/35 hover:bg-cyan-400/15 flex items-center justify-center"
        >
          <span className="block w-[24px] h-[24px] rounded-full bg-[radial-gradient(circle_at_35%_28%,#dffaff_0%,#5fd4f5_40%,#0f8cc2_80%,#075e8a_100%)] shadow-[0_0_9px_rgba(80,220,255,0.6),inset_0_1px_2px_rgba(255,255,255,0.65)] win7-breathe" />
        </button>
        {tasks.length > 0 && <div className="w-[1px] h-[22px] mx-1 bg-white/15 shrink-0" />}
        {tasks.map((t) => {
          const isActive = activeId === t.id && !minimized[t.id];
          return (
            <button
              key={t.id}
              onClick={() => onTaskClick(t.id)}
              title={t.title}
              className={`win7-no-touch w-[44px] h-[33px] shrink-0 rounded-[4px] border flex items-center justify-center transition-all ${
                isActive
                  ? "bg-white/25 border-white/45 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),inset_0_-1px_3px_rgba(0,0,0,0.35),0_0_11px_rgba(160,210,255,0.4)]"
                  : "bg-white/[0.09] border-white/15 hover:bg-white/20"
              }`}
            >
              <span className="w-[23px] h-[23px] shrink-0 [&>svg]:w-[23px] [&>svg]:h-[23px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{t.icon}</span>
            </button>
          );
        })}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-0.5 px-1.5 shrink-0 border-l border-white/15">
        <RadioTray />
        <button
          aria-label="Hidden icons"
          className="win7-no-touch p-1 rounded-[3px] hover:bg-white/20"
          onClick={() => toast({ title: "Hidden icons", description: "Sab chhupa rakha he. Spy mode: ON. 🕶" })}
        >
          <ChevronUp className="w-3.5 h-3.5 text-white/85" />
        </button>
        <button
          aria-label="Action Center"
          title="Action Center"
          className="win7-no-touch p-1 rounded-[3px] hover:bg-white/20 hidden sm:block"
          onClick={() => toast({ title: "Action Center", description: "Sab kuch under control he, sir. Koi urgent message nahi. ✅" })}
        >
          <TrayFlagIcon className="w-[15px] h-[15px]" />
        </button>
        <button
          aria-label="Network"
          title="Network — Connected"
          className="win7-no-touch p-1 rounded-[3px] hover:bg-white/20 hidden sm:block"
          onClick={() => toast({ title: "Network", description: "Connected to: DesiNet_5G (bars full, speed full, data khatam 😭)" })}
        >
          <NetworkBarsIcon className="w-[15px] h-[15px]" />
        </button>
        <button
          aria-label="Volume"
          title="Volume"
          className="win7-no-touch p-1 rounded-[3px] hover:bg-white/20 hidden sm:block"
          onClick={() => toast({ title: "Volume", description: "Speakers: Desi 5.1 surround. Volume abhi 100% he — padosi approve karte he 😄" })}
        >
          <VolumeIcon className="w-[15px] h-[15px]" />
        </button>
        <Clock />
        {/* Show desktop */}
        <button
          aria-label="Show desktop"
          onClick={onMinimizeAll}
          className="win7-no-touch w-[14px] self-stretch my-0 border-l border-white/35 hover:bg-white/25"
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

  const jarvisOrb = (
    <span className="block w-6 h-6 rounded-full bg-[radial-gradient(circle_at_35%_28%,#dffaff_0%,#5fd4f5_40%,#0f8cc2_80%,#075e8a_100%)] shadow-[0_0_8px_rgba(80,220,255,0.65),inset_0_1px_2px_rgba(255,255,255,0.65)]" />
  );

  const programs: { id: WinId | "ie" | "games" | "jarvis"; label: string; icon: ReactNode; sub?: string }[] = [
    { id: "ie", label: "Internet Explorer", icon: <IEIcon className="w-6 h-6" /> },
    { id: "about", label: "About_Me.txt", icon: <NotepadIcon className="w-6 h-6" /> },
    { id: "projects", label: "My Projects", icon: <FolderIcon className="w-6 h-6" /> },
    { id: "skills", label: "Skills.exe", icon: <GearIcon className="w-6 h-6" />, sub: "Skill Manager 7" },
    { id: "resume", label: "Resume.pdf", icon: <PdfIcon className="w-6 h-6" /> },
    { id: "contact", label: "Contact.exe", icon: <ContactIcon className="w-6 h-6" /> },
    { id: "computer", label: "Computer", icon: <ComputerIcon className="w-6 h-6" /> },
    { id: "music", label: "Music Library", icon: <MediaIcon className="w-6 h-6" />, sub: "151 songs • YT Music" },
    { id: "office", label: "Virtual Office — LIVE", icon: <AgencyIcon className="w-6 h-6" />, sub: "Harish Web Agency" },
    { id: "jarvis", label: "J.A.R.V.I.S", icon: jarvisOrb, sub: "AI assistant — password protected" },
    { id: "games", label: "Games", icon: <GamesIcon className="w-6 h-6" /> },
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
    { label: "Pictures", action: () => { onClose(); toast({ title: "Pictures", description: "Wallpaper toh dekh hi liya 😄 Gallery jald aa rahi he." }); } },
    { label: "Music", action: () => launch("music") },
    { label: "Games", action: () => launch("games") },
    { label: "Computer", action: () => launch("computer") },
    { label: "Control Panel", action: () => launch("skills") },
    { label: "Devices and Printers", action: () => { onClose(); toast({ title: "Devices and Printers", description: "1 device found: HARISH-PC. Printer 2011 se so raha he 😴" }); } },
    { label: "Default Programs", action: () => { onClose(); toast({ title: "Default Programs", description: "Sab kuch classic set he. IE bhi yahin hai, chupchaap. 🪟" }); } },
    { label: "J.A.R.V.I.S", action: () => onJarvisOpen() },
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
          {/* All Programs — authentic Win7 separator row */}
          <button
            onClick={() => toast({ title: "All Programs", description: "Yahi sab programs he bro — Win7 me bhi itna hi milta tha 😄" })}
            className="flex items-center justify-between w-full px-3 py-[5px] border-t border-[#dfe6ec] text-[12px] font-semibold text-[#1a2a38] hover:bg-gradient-to-b hover:from-[#e8f4fd] hover:to-[#c9e4f8]"
          >
            <span>All Programs</span>
            <span className="text-[#4a6a8a] text-[10px]">▶</span>
          </button>
          <div className="p-2 pt-1.5 border-t border-[#dfe6ec]">
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered[0]) launch(filtered[0].id);
                  if (e.key === "Escape") onClose();
                }}
                placeholder="Search programs and files"
                className="w-full h-[24px] text-[12px] pl-2.5 pr-7 rounded-[3px] border border-[#b8c8d6] bg-white outline-none focus:border-[#5aabe0] focus:shadow-[0_0_5px_#8ec9ee]"
              />
              <svg viewBox="0 0 16 16" className="w-[13px] h-[13px] absolute right-2 top-[5.5px] opacity-70 pointer-events-none">
                <circle cx="6.8" cy="6.8" r="4.2" fill="none" stroke="#4a6a8a" strokeWidth="1.6" />
                <path d="M10 10l3.4 3.4" stroke="#4a6a8a" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
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
