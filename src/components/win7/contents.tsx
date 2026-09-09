"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FolderIcon, DriveIcon, NotepadIcon, WinFlag, SoundFileIcon, CdMusicIcon } from "./icons";
import { useToast } from "@/hooks/use-toast";
import {
  profile,
  projects,
  skillGroups,
  resume,
  drives,
  systemSpecs,
  recycleItems,
  socials,
} from "@/lib/portfolio";
import { OLD_SONGS, NEW_ERAS, ytMusicSearchUrl, type Song } from "@/lib/musicData";
import { getRadioSnapshot, requestSong, subscribeRadio, togglePlayPause, nextSong, prevSong, setVolume, unmuteRadio } from "@/lib/radio";

/* ---------- shared bits ---------- */

function MenuBar({ items = ["File", "Edit", "Format", "View", "Help"] }: { items?: string[] }) {
  return (
    <div className="flex items-center h-[24px] px-1 bg-[#f1f5f9] border-b border-[#d6dde4] shrink-0 select-none">
      {items.map((m) => (
        <span key={m} className="text-[12px] px-2 py-[2px] rounded-sm hover:bg-[#e0ecf8] cursor-default text-[#2a2a2a]">
          {m}
        </span>
      ))}
    </div>
  );
}

function StatusBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center h-[22px] px-2 bg-[#f1f5f9] border-t border-[#d6dde4] shrink-0 text-[11px] text-[#4a5560] select-none gap-4">
      {children}
    </div>
  );
}

function NavToolbar({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-1.5 h-[30px] px-1.5 bg-gradient-to-b from-[#f6fbff] to-[#e2eef8] border-b border-[#c5d5e2] shrink-0">
      <div className="flex gap-[2px]">
        <span className="w-[22px] h-[22px] rounded-full bg-gradient-to-b from-[#7ec45a] to-[#4a9e2e] text-white text-[11px] flex items-center justify-center shadow-sm">←</span>
        <span className="w-[22px] h-[22px] rounded-full bg-gradient-to-b from-[#c8d6e0] to-[#9fb2c2] text-white text-[11px] flex items-center justify-center shadow-sm">→</span>
      </div>
      <div className="flex-1 h-[22px] bg-white border border-[#a8bdd0] rounded-[2px] flex items-center px-2 text-[12px] text-[#333] gap-1 overflow-hidden">
        <span className="truncate">📁 {path}</span>
      </div>
      <div className="w-[110px] h-[22px] bg-white border border-[#a8bdd0] rounded-[2px] flex items-center px-2 text-[12px] text-[#8a9aa8]">Search</div>
    </div>
  );
}

/* ---------- About Me (Notepad) ---------- */

export function AboutContent() {
  return (
    <div className="flex flex-col h-full">
      <MenuBar items={["File", "Edit", "Format", "View", "Help"]} />
      <div className="flex-1 overflow-auto p-3 bg-white">
        <pre className="font-mono text-[12.5px] leading-[1.55] text-[#1e2a33] whitespace-pre-wrap select-text">{profile.bio}</pre>
        <div className="mt-4 grid grid-cols-2 gap-2 max-w-[420px]">
          {profile.quickFacts.map((f) => (
            <div key={f.label} className="border border-[#d6e2ec] bg-[#f6fafd] rounded-[3px] px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wide text-[#6b7c8a]">{f.label}</div>
              <div className="text-[13px] font-semibold text-[#1f5c8b]">{f.value}</div>
            </div>
          ))}
        </div>
        <pre className="font-mono text-[12px] leading-[1.5] text-[#3a4a56] mt-4 whitespace-pre-wrap select-text">{`Location : ${profile.location}
Email    : ${profile.email}
Phone    : ${profile.phone} (WhatsApp: ${profile.whatsapp})
Status   : Open for website & POS projects ☕`}</pre>
      </div>
      <StatusBar>
        <span>Ln 1, Col 1</span>
        <span>100%</span>
        <span>Windows (CRLF)</span>
        <span>UTF-8</span>
      </StatusBar>
    </div>
  );
}

/* ---------- Projects (Explorer) ---------- */

export function ProjectsContent() {
  const [selected, setSelected] = useState<number | null>(null);
  const sel = selected !== null ? projects[selected] : null;

  return (
    <div className="flex flex-col h-full">
      <NavToolbar path="Computer > Work (D:) > harish_portfolio" />
      <div className="flex-1 flex min-h-0">
        <div className="w-[130px] shrink-0 bg-gradient-to-b from-[#f4f8fc] to-[#e8f0f7] border-r border-[#d6e0ea] p-1.5 overflow-auto hidden sm:block">
          <div className="text-[11px] font-semibold text-[#4a6072] px-1 py-0.5">Favorites</div>
          {["Desktop", "Downloads", "Recent Places"].map((x) => (
            <div key={x} className="text-[12px] text-[#2f4356] px-1.5 py-[3px] rounded-sm hover:bg-[#dcebf7] cursor-default truncate">⭐ {x}</div>
          ))}
          <div className="text-[11px] font-semibold text-[#4a6072] px-1 py-0.5 mt-2">Libraries</div>
          {["Websites", "POS Software", "Client Work"].map((x) => (
            <div key={x} className="text-[12px] text-[#2f4356] px-1.5 py-[3px] rounded-sm hover:bg-[#dcebf7] cursor-default truncate">📚 {x}</div>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-2 bg-white">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
            {projects.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelected(i)}
                className={`flex flex-col items-center gap-1 p-2 rounded-[3px] text-center cursor-default ${
                  selected === i ? "bg-[#cfe6f8] outline outline-1 outline-[#7db4dd]" : "hover:bg-[#e8f2fa]"
                }`}
              >
                {p.type === "folder" ? <FolderIcon className="w-10 h-10" /> : <NotepadIcon className="w-10 h-10" />}
                <span className="text-[11.5px] leading-tight text-[#1a2a38] break-words max-w-[110px]">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-[#d6e0ea] bg-gradient-to-b from-[#f6fafd] to-[#eaf1f7] px-3 py-1.5 min-h-[44px]">
        {sel ? (
          <div>
            <div className="text-[12px] font-semibold text-[#1f5c8b]">
              {sel.name}
              <span className="text-[10px] font-normal px-1.5 py-[1px] rounded-full bg-[#dff0d8] text-[#3c763d] border border-[#c9e2c0] ml-1">{sel.status}</span>
            </div>
            <div className="text-[11.5px] text-[#44566a]">{sel.desc}</div>
            <div className="flex gap-1 mt-1 flex-wrap">
              {sel.tech.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-[1px] bg-[#e3eef7] border border-[#bcd6ea] rounded-full text-[#2f6a9e]">{t}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[11.5px] text-[#7a8a98]">Select an item to view details. Single click works here 😄</div>
        )}
      </div>
      <StatusBar>
        <span>{projects.length} items</span>
        {sel && <span>1 item selected</span>}
      </StatusBar>
    </div>
  );
}

/* ---------- Skills ---------- */

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(level), delay);
    return () => clearTimeout(t);
  }, [level, delay]);
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-[12px] mb-[3px]">
        <span className="text-[#2a3a48] font-medium">{name}</span>
        <span className="text-[#6b7c8a]">{level}%</span>
      </div>
      <div className="h-[14px] border border-[#b8c8d6] rounded-[7px] bg-gradient-to-b from-[#f2f6fa] to-[#e2eaf2] overflow-hidden shadow-inner">
        <div className="h-full rounded-[6px] bg-gradient-to-b from-[#8ee06e] via-[#5cb838] to-[#3e9420] transition-all duration-[1200ms] ease-out relative" style={{ width: `${w}%` }}>
          <div className="absolute top-[2px] left-[4px] right-[4px] h-[3px] bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkillsContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-3 bg-white">
        <div className="text-[13px] font-bold text-[#1f5c8b] mb-1 border-b border-[#e0eaf2] pb-1">Skill Manager — trained at IIT Roorkee bootcamp ✅</div>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3 mt-2">
          {skillGroups.map((g, gi) => (
            <div key={g.category} className="border border-[#d6e2ec] rounded-[4px] bg-[#fafdfe] p-2.5">
              <div className="text-[12px] font-semibold text-[#3a4a58] mb-2 flex items-center gap-1.5">
                <span className="w-[14px] h-[14px] rounded-[2px] bg-gradient-to-b from-[#5aabe0] to-[#2f6a9e] text-white text-[9px] flex items-center justify-center">{gi + 1}</span>
                {g.category}
              </div>
              {g.items.map((s, si) => (
                <SkillBar key={s.name} name={s.name} level={s.level} delay={gi * 200 + si * 120} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <StatusBar>
        <span>Scanning for new skills… 0 found (always learning though)</span>
      </StatusBar>
    </div>
  );
}

/* ---------- Resume (Document viewer) ---------- */

export function ResumeContent() {
  return (
    <div className="flex flex-col h-full">
      <MenuBar items={["File", "Edit", "View", "Tools", "Help"]} />
      <div className="flex-1 overflow-auto bg-[#8a9aa8] p-3">
        <div className="bg-white max-w-[560px] mx-auto shadow-md px-6 py-5 text-[#1a1a1a] select-text">
          <div className="text-center border-b-2 border-[#2f6a9e] pb-2">
            <div className="text-[18px] font-bold tracking-wide">{profile.name}</div>
            <div className="text-[12px] text-[#44566a] mt-0.5">{profile.role}</div>
            <div className="text-[11px] text-[#6b7c8a]">
              {profile.email} • {profile.phone}
            </div>
            <div className="text-[11px] text-[#6b7c8a]">{profile.location} • WFH Ready</div>
          </div>

          <div className="mt-3">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#2f6a9e]">Summary</div>
            <p className="text-[12px] leading-[1.5] mt-1">{resume.summary}</p>
          </div>

          <div className="mt-3">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#2f6a9e]">Experience</div>
            {resume.experience.map((e) => (
              <div key={e.role} className="mt-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[12.5px] font-semibold">
                    {e.role}, <span className="text-[#44566a] font-normal">{e.company}</span>
                  </span>
                  <span className="text-[10.5px] text-[#6b7c8a]">{e.period}</span>
                </div>
                <ul className="list-disc pl-4 mt-0.5">
                  {e.points.map((pt) => (
                    <li key={pt} className="text-[11.5px] leading-[1.45] text-[#333]">{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#2f6a9e]">Education</div>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-[12.5px] font-semibold">
                {resume.education.degree}, <span className="font-normal text-[#44566a]">{resume.education.school}</span>
              </span>
              <span className="text-[10.5px] text-[#6b7c8a]">{resume.education.period}</span>
            </div>
            <div className="text-[11px] text-[#44566a]">{resume.education.note}</div>
          </div>
        </div>
      </div>
      <StatusBar>
        <span>Harish_Resume.pdf — ready for MNC & WFH</span>
        <span>100%</span>
      </StatusBar>
    </div>
  );
}

/* ---------- Contact (Outlook-style new mail) ---------- */

export function ContactContent() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const send = () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "⚠ Error 417", description: "Subject aur message toh bharo pehle! (Please fill both fields)" });
      return;
    }
    const mailUrl = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n— ${name || "Aapka reader"}`)}`;
    window.location.href = mailUrl;
    toast({
      title: "✓ Mail app khul raha he!",
      description: `Direct mail nahi bhej sakta (privacy 😄) — lekin aapka draft ready he. Ya seedha ${profile.email} pe likho.`,
    });
    setSubject("");
    setMessage("");
    setName("");
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f8fc]">
      <MenuBar items={["File", "Edit", "View", "Insert", "Help"]} />
      <div className="flex-1 overflow-auto p-3">
        <div className="border border-[#c5d5e2] bg-white rounded-[3px] overflow-hidden">
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-[#dfe8f0]">
            <div className="text-[12px] text-[#44566a] w-[52px]">From:</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 text-[12.5px] border border-[#c5d5e2] rounded-[2px] px-2 py-[4px] outline-none focus:border-[#5aabe0] focus:shadow-[0_0_4px_#8ec9ee] bg-[#fdfeff]"
            />
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 border-b border-[#dfe8f0]">
            <div className="text-[12px] text-[#44566a] w-[52px]">To:</div>
            <div className="flex-1 text-[12.5px] text-[#2f6a9e] bg-[#f2f7fb] border border-[#dbe6ef] rounded-[2px] px-2 py-[4px] select-text">{profile.email} ✓</div>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2">
            <div className="text-[12px] text-[#44566a] w-[52px]">Subject:</div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Website banwana he / POS chahiye / Namaste!"
              className="flex-1 text-[12.5px] border border-[#c5d5e2] rounded-[2px] px-2 py-[4px] outline-none focus:border-[#5aabe0] focus:shadow-[0_0_4px_#8ec9ee] bg-[#fdfeff]"
            />
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi Harish,\n\nMujhe ek website / POS software chahiye...\n\n`}
          className="w-full h-[110px] mt-2.5 text-[12.5px] border border-[#c5d5e2] rounded-[2px] p-2.5 outline-none focus:border-[#5aabe0] focus:shadow-[0_0_4px_#8ec9ee] bg-white resize-none leading-[1.5]"
        />

        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <button
            onClick={send}
            className="px-4 py-[6px] text-[12.5px] font-semibold text-white rounded-[3px] bg-gradient-to-b from-[#6cc04a] to-[#3e9420] border border-[#2f7514] hover:from-[#7ed15c] hover:to-[#4aa52c] shadow-sm active:translate-y-[1px]"
          >
            📨 Send Mail
          </button>
          <a
            href={`https://wa.me/917835908508`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-[6px] text-[12.5px] font-semibold text-white rounded-[3px] bg-gradient-to-b from-[#4ecb6e] to-[#25a34a] border border-[#1d7d38] hover:from-[#5fd97e] shadow-sm active:translate-y-[1px]"
          >
            💬 WhatsApp: {profile.whatsapp}
          </a>
          <a
            href="tel:+917668483250"
            className="px-4 py-[6px] text-[12.5px] font-semibold text-white rounded-[3px] bg-gradient-to-b from-[#5ab5ee] to-[#1a6fb0] border border-[#125a8f] hover:from-[#7ec5f5] shadow-sm active:translate-y-[1px]"
          >
            📞 {profile.phone}
          </a>
        </div>

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[#6b7c8a] mb-1.5">Baaki options:</div>
          <div className="flex gap-2 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] px-3 py-[5px] bg-white border border-[#c5d5e2] rounded-[3px] text-[#2f6a9e] hover:bg-[#e8f2fa] hover:border-[#7db4dd] shadow-sm"
              >
                {s.icon === "email" && "📧 "}
                {s.icon === "whatsapp" && "💬 "}
                {s.icon === "phone" && "📞 "}
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <StatusBar>
        <span>Reply within 24 hrs — promise 🤝</span>
      </StatusBar>
    </div>
  );
}

/* ---------- My Computer (with drives + specs) ---------- */

export function ComputerContent() {
  return (
    <div className="flex flex-col h-full">
      <NavToolbar path="Computer" />
      <div className="flex-1 overflow-auto p-3 bg-white">
        <div className="text-[12px] font-bold text-[#3a4a58] mb-1.5">Hard Disk Drives (3)</div>
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 mb-4">
          {drives.map((d) => (
            <div key={d.label} className="flex gap-2.5 items-center p-2 rounded-[3px] border border-transparent hover:bg-[#e8f2fa] hover:border-[#d0e2f0]">
              <DriveIcon variant={d.icon} className="w-11 h-11 shrink-0" />
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-[#1a2a38] truncate">{d.label}</div>
                <div className="h-[9px] mt-1 rounded-[4px] bg-[#e4ebf1] border border-[#c8d4de] overflow-hidden w-full min-w-[100px]">
                  <div className={`h-full rounded-[3px] ${d.used > 85 ? "bg-gradient-to-b from-[#f09a5a] to-[#d4552a]" : "bg-gradient-to-b from-[#8fd0f8] to-[#2f7fc1]"}`} style={{ width: `${d.used}%` }} />
                </div>
                <div className="text-[10.5px] text-[#6b7c8a] mt-0.5">{d.free}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[12px] font-bold text-[#3a4a58] mb-1.5 flex items-center justify-between max-w-[560px]">
          <span>System Properties</span>
          <WinFlag className="w-[52px] h-auto opacity-95" />
        </div>
        <div className="border border-[#dfe8f0] rounded-[3px] overflow-hidden max-w-[560px]">
          {systemSpecs.map((s, i) => (
            <div key={s.label} className={`flex text-[12px] ${i % 2 ? "bg-[#f6fafd]" : "bg-white"}`}>
              <div className="w-[150px] shrink-0 px-2.5 py-[5px] text-[#44566a] border-r border-[#e8eef4]">{s.label}</div>
              <div className="px-2.5 py-[5px] text-[#1a2a38] select-text">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="text-[11.5px] text-[#7a8a98] mt-3 italic">
          Music Library bhi isi PC me he — 151 songs, YouTube Music powered 🎵 (taskbar tray ya Music icon se kholo)
        </div>
      </div>
      <StatusBar>
        <span>3 items</span>
        <span>All systems operational ⚡</span>
      </StatusBar>
    </div>
  );
}

/* ---------- MUSIC LIBRARY (151 songs, YouTube Music powered) ---------- */

function SongRow({ song, active, playing, onPlay }: { song: Song; active: boolean; playing: boolean; onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      className={`w-full flex items-center gap-2 px-2 py-[5px] text-left rounded-[3px] border ${
        active ? "bg-[#cfe6f8] border-[#7db4dd]" : "border-transparent hover:bg-[#e8f2fa]"
      }`}
    >
      <span className="w-6 text-center text-[12px] text-[#2f6a9e] shrink-0">{active && playing ? "♪" : "▶"}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[12px] text-[#1a2a38] truncate">{song.title}</span>
        <span className="block text-[10.5px] text-[#6b7c8a] truncate">{song.artist}</span>
      </span>
      <span className="text-[10.5px] text-[#8a9aa8] shrink-0">{song.year}</span>
      <a
        href={ytMusicSearchUrl(song)}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Open in YouTube Music"
        className="text-[9px] px-1.5 py-[2px] rounded-full bg-[#fdeaea] border border-[#f5c6c6] text-[#c0392b] hover:bg-[#fbdcdc] shrink-0"
      >
        YT
      </a>
    </button>
  );
}

export function MusicLibraryContent() {
  const radio = useSyncExternalStore(subscribeRadio, getRadioSnapshot, () => getRadioSnapshot());
  const [tab, setTab] = useState<"OLD" | "NEW">("OLD");
  const [q, setQ] = useState("");
  const list = tab === "OLD" ? OLD_SONGS : NEW_ERAS;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((s) => `${s.title} ${s.artist}`.toLowerCase().includes(query));
  }, [list, q]);

  return (
    <div className="flex flex-col h-full">
      {/* toolbar */}
      <div className="flex items-center gap-2 h-[34px] px-2 bg-gradient-to-b from-[#f6fbff] to-[#e2eef8] border-b border-[#c5d5e2] shrink-0">
        <div className="flex rounded-[3px] overflow-hidden border border-[#b8c8d6]">
          <button
            onClick={() => setTab("OLD")}
            className={`px-2.5 h-[22px] text-[11.5px] ${tab === "OLD" ? "bg-gradient-to-b from-[#7db4dd] to-[#4a90c4] text-white" : "bg-white text-[#2a3a48] hover:bg-[#e8f2fa]"}`}
          >
            Old Skool ({OLD_SONGS.length})
          </button>
          <button
            onClick={() => setTab("NEW")}
            className={`px-2.5 h-[22px] text-[11.5px] border-l border-[#b8c8d6] ${tab === "NEW" ? "bg-gradient-to-b from-[#7db4dd] to-[#4a90c4] text-white" : "bg-white text-[#2a3a48] hover:bg-[#e8f2fa]"}`}
          >
            New Era ({NEW_ERAS.length})
          </button>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 151 songs…"
          className="flex-1 min-w-[80px] h-[22px] text-[12px] px-2 rounded-[3px] border border-[#b8c8d6] bg-white outline-none focus:border-[#5aabe0]"
        />
      </div>

      {/* now playing bar */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gradient-to-b from-[#eef5fb] to-[#dcebf7] border-b border-[#c5d5e2] shrink-0">
        <CdMusicIcon className={`w-[26px] h-[26px] shrink-0 ${radio.playing && !radio.loading ? "animate-spin [animation-duration:2.8s]" : ""}`} />
        <button
          onClick={() => togglePlayPause()}
          className="w-[26px] h-[26px] rounded-full bg-gradient-to-b from-[#7db4dd] to-[#2f6a9e] text-white text-[12px] flex items-center justify-center shadow hover:from-[#8ec5ee] shrink-0"
          title={radio.playing ? "Pause" : "Play"}
        >
          {radio.loading ? "…" : radio.playing ? "❚❚" : "▶"}
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-[#1a2a38] truncate font-medium">{radio.song ? radio.song.title : "Kuch bhi chala do — YouTube Music se 🎵"}</div>
          <div className="text-[10.5px] text-[#6b7c8a] truncate">
            {radio.song ? `${radio.song.artist}${radio.song.year ? ` • ${radio.song.year}` : ""}` : "Play dabao, link khud dhundh lunga"}
            {radio.resolvedFrom === "web" && radio.song ? " • YT link live mila" : ""}
            {radio.resolvedFrom === "cache" && radio.song ? " • cached link" : ""}
          </div>
        </div>
        {radio.loading && <span className="text-[10px] text-[#b06a00] shrink-0">YT link dhundh raha hu…</span>}
        {radio.error && <span className="text-[10px] text-[#c0392b] truncate max-w-[140px] shrink-0">{radio.error}</span>}
        {radio.muted && (
          <button
            onClick={() => unmuteRadio()}
            className="text-[10px] px-1.5 py-[2px] rounded-full bg-[#fff3cd] border border-[#e6c200] text-[#8a6d00] hover:bg-[#ffecb0] shrink-0 animate-pulse"
            title="Browser ne sound block kiya — tap karke unmute karo"
          >
            🔇 Tap to unmute
          </button>
        )}
        <div className="flex gap-1 shrink-0">
          <button onClick={() => prevSong()} className="w-[24px] h-[24px] rounded-full border border-[#b8c8d6] bg-white/80 text-[10px] hover:bg-white" title="Previous">⏮</button>
          <button onClick={() => nextSong()} className="w-[24px] h-[24px] rounded-full border border-[#b8c8d6] bg-white/80 text-[10px] hover:bg-white" title="Next">⏭</button>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={radio.volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-[70px] shrink-0 accent-[#2f6a9e]"
          title={`Volume ${radio.volume}%`}
        />
      </div>

      {/* song list */}
      <div className="flex-1 overflow-auto bg-white win7-scroll">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#8a9aa8]">
            <div className="text-[34px]">🎵</div>
            <div className="text-[12.5px] mt-1">&quot;{q}&quot; nahi mila. Spell check kar lo ya dusra naam try karo.</div>
          </div>
        ) : (
          <div className="py-1">
            {filtered.map((s) => (
              <SongRow
                key={s.id}
                song={s}
                active={radio.song?.title === s.title}
                playing={radio.playing}
                onPlay={() => void requestSong(s)}
              />
            ))}
          </div>
        )}
      </div>

      <StatusBar>
        <span>{filtered.length} songs</span>
        <span>Source: YouTube Music links • auto-resolved live</span>
        {radio.song && <span className="hidden sm:inline">Now: {radio.song.title}</span>}
      </StatusBar>
    </div>
  );
}

/* ---------- Recycle Bin ---------- */

export function RecycleContent() {
  const { toast } = useToast();
  const [items, setItems] = useState(recycleItems);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 h-[32px] px-2 bg-gradient-to-b from-[#f6fbff] to-[#e2eef8] border-b border-[#c5d5e2] shrink-0">
        <button
          onClick={() => {
            setItems([]);
            toast({ title: "Recycle Bin emptied", description: "Purane zamane ka hisaab permanently deleted! 😄" });
          }}
          className="text-[12px] px-2.5 py-[3px] rounded-[3px] border border-[#c5d5e2] bg-gradient-to-b from-white to-[#e8f0f7] hover:from-[#eaf4fc] hover:to-[#d0e4f4] text-[#2a3a48]"
        >
          🗑 Empty Recycle Bin
        </button>
        <button
          onClick={() => {
            setItems(recycleItems);
            toast({ title: "Items restored", description: "Sab wapas aa gaya. Kasoor mera nahi tha. 😌" });
          }}
          className="text-[12px] px-2.5 py-[3px] rounded-[3px] border border-[#c5d5e2] bg-gradient-to-b from-white to-[#e8f0f7] hover:from-[#eaf4fc] hover:to-[#d0e4f4] text-[#2a3a48]"
        >
          ↩ Restore all items
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#8a9aa8]">
            <div className="text-[42px]">🗑</div>
            <div className="text-[13px] mt-2">This folder is empty.</div>
            <div className="text-[11.5px] mt-1 italic">So clean. So fresh. ✨</div>
          </div>
        ) : (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-gradient-to-b from-[#f6fbff] to-[#e2eef8] text-[#3a4a58]">
                <th className="text-left font-normal px-2.5 py-[5px] border-b border-[#d6e0ea]">Name</th>
                <th className="text-left font-normal px-2.5 py-[5px] border-b border-[#d6e0ea] w-[90px]">Size</th>
                <th className="text-left font-normal px-2.5 py-[5px] border-b border-[#d6e0ea] w-[130px] hidden sm:table-cell">Type</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.name} className={`${i % 2 ? "bg-[#f8fbfd]" : "bg-white"} hover:bg-[#e8f2fa]`}>
                  <td className="px-2.5 py-[5px] text-[#1a2a38] cursor-default">
                    <span className="inline-flex items-center gap-1.5">
                      {it.name.endsWith(".wav") ? (
                        <SoundFileIcon className="w-4 h-4 inline-block" />
                      ) : it.name.endsWith(".png") ? (
                        <span>🖼️</span>
                      ) : it.name.endsWith(".docx") ? (
                        <NotepadIcon className="w-4 h-4 inline-block" />
                      ) : (
                        <span>📄</span>
                      )}
                      {it.name}
                    </span>
                  </td>
                  <td className="px-2.5 py-[5px] text-[#44566a] cursor-default">{it.size}</td>
                  <td className="px-2.5 py-[5px] text-[#44566a] cursor-default hidden sm:table-cell">{it.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <StatusBar>
        <span>{items.length} items</span>
      </StatusBar>
    </div>
  );
}

/* ---------- Private Videos (prank: fake security bypass → meme reveal 😂) ---------- */

export function PrivateVideosContent() {
  const [stage, setStage] = useState<"load" | "meme">("load");
  const [pct, setPct] = useState(0);
  const [line, setLine] = useState(0);

  const statusLines = [
    "Bypassing security…",
    "Decrypting files…",
    "Buffering private video…",
    "Access granted 😉",
  ];

  useEffect(() => {
    if (stage !== "load") return;
    const iv = setInterval(() => {
      setPct((p) => Math.min(100, p + 3 + Math.floor(Math.random() * 8)));
    }, 80);
    const lv = setInterval(() => {
      setLine((l) => Math.min(statusLines.length - 1, l + 1));
    }, 620);
    const done = setTimeout(() => {
      setPct(100);
      setStage("meme");
    }, 2600);
    return () => {
      clearInterval(iv);
      clearInterval(lv);
      clearTimeout(done);
    };
  }, [stage]);

  const replay = () => {
    setPct(0);
    setLine(0);
    setStage("load");
  };

  if (stage === "load") {
    return (
      <div className="flex flex-col h-full bg-[#0e1620] select-none">
        <MenuBar items={["File", "Edit", "View", "Help"]} />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="text-[40px] leading-none mb-4">🔐</div>
          <div className="text-[#dce8f2] text-[15px] font-semibold mb-1">Private_Videos</div>
          <div className="text-[#7d95a8] text-[12px] mb-6">This folder is protected by AES-404 encryption</div>
          <div className="w-[300px] max-w-full h-[16px] rounded-[8px] bg-[#1c2a38] border border-[#31485c] overflow-hidden shadow-inner">
            <div
              className="h-full rounded-[8px] transition-[width] duration-100 ease-out"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(to bottom, #8fd0f5 0%, #3d9ad4 45%, #1f6ea6 100%)",
                boxShadow: "0 0 10px rgba(90,180,240,0.65) inset",
              }}
            />
          </div>
          <div className="mt-3 text-[12.5px] text-[#9fc0d8] font-mono">
            {statusLines[line]} <span className="text-[#5da9dd]">{pct}%</span>
          </div>
        </div>
        <div className="h-[22px] px-2 bg-[#f1f5f9] border-t border-[#d6dde4] flex items-center text-[11px] text-[#4a5560] select-none">
          <span>{pct >= 100 ? "Done" : "Working…"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#14181d] select-none">
      <MenuBar items={["File", "Edit", "View", "Help"]} />
      <div className="flex-1 min-h-0 relative">
        <img src="/private-meme.jpg" alt="Private video meme" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        {/* classic meme captions */}
        <div
          className="absolute top-2.5 left-0 right-0 text-center text-white uppercase font-black text-[15px] sm:text-[19px] leading-tight px-3"
          style={{
            fontFamily: "Impact, 'Arial Black', sans-serif",
            textShadow: "2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 3px 8px rgba(0,0,0,0.6)",
            letterSpacing: "0.03em",
          }}
        >
          When you open someone&apos;s
          <br />
          &quot;Private Videos&quot; folder
        </div>
        <div
          className="absolute bottom-2.5 left-0 right-0 text-center text-white uppercase font-black text-[16px] sm:text-[21px] leading-tight px-3"
          style={{
            fontFamily: "Impact, 'Arial Black', sans-serif",
            textShadow: "2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 3px 8px rgba(0,0,0,0.6)",
            letterSpacing: "0.03em",
          }}
        >
          Just a very good boy 😂
        </div>
      </div>
      <div className="h-[30px] px-2.5 bg-[#f0f6fb] border-t border-[#d6dde4] flex items-center justify-between shrink-0">
        <span className="text-[11px] text-[#3a4a58]">0 videos found — 1 golden retriever detected 🐶 · trolled by {profile.name}</span>
        <button
          onClick={replay}
          className="text-[11px] px-2.5 py-[3px] rounded-[3px] text-[#123a5e] border border-[#7ba6c9] bg-[linear-gradient(to_bottom,#ffffff_0%,#e6f2fc_50%,#cfe6f8_100%)] hover:border-[#5a9ae0]"
        >
          Watch again
        </button>
      </div>
    </div>
  );
}

/* ---------------- Harish Web Agency — Virtual Office (LIVE show) ---------------- */

export function AgencyOfficeContent() {
  return (
    <div className="h-full w-full bg-[#0b1526] overflow-hidden select-none">
      <iframe
        src="/cr-office-iso-mockup.html?embed=1"
        title="Harish Web Agency — Virtual Office LIVE"
        className="h-full w-full border-0 block"
      />
    </div>
  );
}

/* ---------------- ADMIN — Secret Leads CRM (sirf Harish ke liye 🔐) ---------------- */

/* ⚠️ BOSS ZONE: apna secret PIN yahan badlo — ye desktop pe "System Config" icon ke piche chhupa he */
const ADMIN_PIN = "2007";

type AdminLead = {
  id: number;
  token: number;
  naam: string;
  kaam: string;
  phone: string | null;
  msg: string | null;
  stage: number;
  source: string;
  createdAt: string;
};

const ADMIN_STAGES = ["NEW", "CONTACTED", "MEETING", "WEBSITE BUILT", "GOOGLE PE #1"];
const ADMIN_STAGES_SHORT = ["NEW", "CONTACTED", "MEETING", "BUILT", "#1"];

function adminTimeAgo(iso: string) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "abhi abhi";
  if (s < 3600) return `${Math.floor(s / 60)} min pehle`;
  if (s < 86400) return `${Math.floor(s / 3600)} ghante pehle`;
  return `${Math.floor(s / 86400)} din pehle`;
}

function adminWaLink(phone: string | null, naam: string, kaam: string) {
  const d = (phone || "").replace(/\D/g, "");
  const num = d.length === 10 ? "91" + d : d;
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(
    `Hi ${naam}! Harish here (Harish Web Agency) — aapki enquiry: ${kaam}. Baat karni thi 🙂`
  )}`;
}

export function AdminPanelContent() {
  const { toast } = useToast();
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);
  const [leads, setLeads] = useState<AdminLead[] | null>(null);
  const [filter, setFilter] = useState<number | "all">("all");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/agency-leads", { cache: "no-store" });
      const j = await r.json();
      setLeads(Array.isArray(j.leads) ? j.leads : []);
    } catch {
      setLeads([]);
      toast({ title: "Load fail", description: "Database tak nahi pahunch raha — Refresh dabao." });
    }
  }, [toast]);

  useEffect(() => {
    if (!unlocked) return;
    void load();
    const t = setInterval(() => void load(), 15000); /* live CRM — 15s me khud sync */
    return () => clearInterval(t);
  }, [unlocked, load]);

  const unlock = () => {
    if (pin.trim() === ADMIN_PIN) {
      setUnlocked(true);
      setWrong(false);
      toast({ title: "🔓 Welcome Boss", description: "Admin CRM unlock — leads tumhare command pe he." });
    } else {
      setWrong(true);
      toast({ title: "🚫 Galat PIN", description: "Ye area sirf Harish ke liye he bhai." });
      setPin("");
    }
  };

  const tryMove = async (l: AdminLead, stage: number) => {
    if (l.stage === stage) return;
    setLeads((ls) => (ls || []).map((x) => (x.id === l.id ? { ...x, stage } : x))); /* optimistic */
    try {
      const r = await fetch(`/api/agency-leads/${l.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!r.ok) throw new Error("patch fail");
      const j = await r.json();
      if (j?.lead) setLeads((ls) => (ls || []).map((x) => (x.id === l.id ? (j.lead as AdminLead) : x)));
      toast({ title: `📈 #L${l.token} → ${ADMIN_STAGES[stage]}`, description: `${l.naam} pipeline me aage badh gaya.` });
    } catch {
      setLeads((ls) => (ls || []).map((x) => (x.id === l.id ? { ...x, stage: l.stage } : x))); /* rollback */
      toast({ title: "Stage move fail", description: "DB ne mana kar diya — dobara try karo." });
    }
  };

  const tryDel = async (l: AdminLead) => {
    if (!window.confirm(`#${l.token} — ${l.naam} ko delete karein? (wapas nahi aayega)`)) return;
    try {
      const r = await fetch(`/api/agency-leads/${l.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("delete fail");
      setLeads((ls) => (ls || []).filter((x) => x.id !== l.id));
      toast({ title: "🗑 Lead delete", description: `#L${l.token} ${l.naam} DB se hata diya.` });
    } catch {
      toast({ title: "Delete fail", description: "Lead hataya nahi ja raha — refresh karke try karo." });
    }
  };

  /* ---------- PIN gate ---------- */
  if (!unlocked) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-[#16324f] via-[#0f2438] to-[#081524] select-none">
        <div
          className={`w-[310px] rounded-[6px] border bg-[#f6f8fa] shadow-[0_14px_50px_rgba(0,0,0,0.55)] p-5 ${
            wrong ? "border-[#d84a3a]" : "border-white/25"
          }`}
        >
          <div className="text-center text-[34px] leading-none mb-1.5">🔐</div>
          <div className="text-center text-[15px] font-bold text-[#1a2a38]">Administrator Sign In</div>
          <div className="text-center text-[11px] text-[#7a8a98] mt-0.5 mb-3.5">Restricted area — sirf boss (Harish) ke liye</div>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setWrong(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") unlock();
            }}
            placeholder="Admin PIN"
            className={`w-full h-[30px] text-[13px] tracking-[0.3em] text-center rounded-[3px] border bg-white outline-none focus:border-[#5aabe0] focus:shadow-[0_0_5px_#8ec9ee] ${
              wrong ? "border-[#d84a3a] bg-[#fdf1ef]" : "border-[#b8c8d6]"
            }`}
          />
          <button
            onClick={unlock}
            className="w-full h-[30px] mt-2.5 text-[12.5px] font-semibold text-white rounded-[3px] border border-[#1e5e9e] bg-gradient-to-b from-[#4d9ad6] to-[#2b6fb0] hover:from-[#5aa8e2] hover:to-[#337cba] active:translate-y-[1px]"
            style={{ textShadow: "0 1px 1px rgba(0,0,0,0.4)" }}
          >
            Unlock
          </button>
          <div className="text-center text-[10px] text-[#a8b4c0] mt-3">HARISH-PC • Secure Admin Channel</div>
        </div>
      </div>
    );
  }

  /* ---------- CRM panel ---------- */
  const shown = (leads || []).filter((l) => filter === "all" || l.stage === filter);
  const countFor = (i: number | "all") => (i === "all" ? (leads || []).length : (leads || []).filter((l) => l.stage === i).length);

  return (
    <div className="h-full w-full flex flex-col bg-[#f1f5f9] text-[#1a2a38] select-none">
      <MenuBar items={["File", "Leads", "Stage", "Help"]} />

      {/* header */}
      <div className="flex items-center gap-2 px-3 h-[36px] bg-gradient-to-b from-[#f6fbff] to-[#e2eef8] border-b border-[#c5d5e2] shrink-0">
        <span className="text-[15px]">🗂</span>
        <span className="text-[13px] font-bold">LEADS CRM — ADMIN</span>
        <span className="text-[10px] px-1.5 py-[1px] rounded bg-[#3fbd6d] text-white font-bold">LIVE</span>
        <span className="text-[11px] text-[#5a6a78]">{leads ? `${leads.length} leads` : "loading…"}</span>
        <div className="flex-1" />
        <button
          onClick={() => void load()}
          className="text-[11px] px-2.5 py-[3px] rounded-[3px] border border-[#b8c8d6] bg-white hover:bg-[#e8f4fd] active:translate-y-[1px]"
        >
          ↻ Refresh
        </button>
      </div>

      {/* stage filter pills */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#dfe6ec] bg-[#f6f8fa] shrink-0 overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`text-[10.5px] px-2 py-[3px] rounded-full border whitespace-nowrap ${
            filter === "all" ? "bg-[#2f6fb5] text-white border-[#1e5e9e] font-bold" : "bg-white text-[#4a5a68] border-[#c8d4de] hover:bg-[#eef6fd]"
          }`}
        >
          SAB ({countFor("all")})
        </button>
        {ADMIN_STAGES_SHORT.map((s, i) => (
          <button
            key={s}
            title={ADMIN_STAGES[i]}
            onClick={() => setFilter(filter === i ? "all" : i)}
            className={`text-[10.5px] px-2 py-[3px] rounded-full border whitespace-nowrap ${
              filter === i ? "bg-[#2f6fb5] text-white border-[#1e5e9e] font-bold" : "bg-white text-[#4a5a68] border-[#c8d4de] hover:bg-[#eef6fd]"
            }`}
          >
            {s} ({countFor(i)})
          </button>
        ))}
      </div>

      {/* leads list */}
      <div className="flex-1 min-h-0 overflow-y-auto win7-scroll px-2.5 py-2">
        {leads === null && <div className="text-center text-[12px] text-[#7a8a98] py-8">Database se leads aa rahi he… ⏳</div>}
        {leads !== null && shown.length === 0 && (
          <div className="text-center text-[12.5px] text-[#7a8a98] py-10">
            Yahan koi lead nahi — chai piyo ☕, enquiry aate hi LIVE dikhegi
          </div>
        )}
        {shown.map((l) => {
          const wa = adminWaLink(l.phone, l.naam, l.kaam);
          return (
            <div key={l.id} className="mb-1.5 rounded-[3px] border border-[#d0dae2] bg-white shadow-sm">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className="text-[10px] font-mono font-bold text-white bg-[#2f6fb5] rounded px-1 py-[2px] shrink-0">#{l.token}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[12.5px] font-bold truncate">{l.naam}</span>
                    <span
                      className={`text-[9.5px] px-1 rounded border shrink-0 ${
                        l.source === "sarkari" ? "bg-[#fdf6e3] text-[#8a6d1f] border-[#e3d5a3]" : "bg-[#eef6fd] text-[#2f6fb5] border-[#c8ddf0]"
                      }`}
                    >
                      {l.source === "sarkari" ? "🏛 SARKARI" : "🏢 OFFICE"}
                    </span>
                    <span className="text-[10px] text-[#9aa8b4] shrink-0 ml-auto">{adminTimeAgo(l.createdAt)}</span>
                  </div>
                  <div className="text-[11px] text-[#4a5a68] truncate">
                    {l.kaam}
                    {l.msg ? ` — "${l.msg}"` : ""}
                    {l.phone ? <span className="text-[#7a8a98]"> • 📞 {l.phone}</span> : null}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {l.phone && (
                    <a href={`tel:${l.phone}`} title={`Call ${l.naam}`} className="text-[13px] px-1 py-0.5 rounded hover:bg-[#e8f4fd] no-underline">
                      📞
                    </a>
                  )}
                  {wa && (
                    <a href={wa} target="_blank" rel="noreferrer" title="WhatsApp kholo" className="text-[13px] px-1 py-0.5 rounded hover:bg-[#e8f8ee] no-underline">
                      💬
                    </a>
                  )}
                  <button onClick={() => void tryDel(l)} title="Delete lead" className="text-[13px] px-1 py-0.5 rounded hover:bg-[#fdeeea] cursor-pointer">
                    🗑
                  </button>
                </div>
              </div>
              {/* stage mover */}
              <div className="flex items-center gap-1 px-2 py-1 border-t border-[#e8eef2] bg-[#fafcfe] overflow-x-auto">
                <span className="text-[9.5px] text-[#7a8a98] mr-0.5 shrink-0 font-semibold">STAGE:</span>
                {ADMIN_STAGES_SHORT.map((s, i) => (
                  <button
                    key={s}
                    title={`${ADMIN_STAGES[i]} — click karke move karo`}
                    onClick={() => void tryMove(l, i)}
                    className={`text-[9.5px] px-1.5 py-[2px] rounded border whitespace-nowrap ${
                      i === l.stage
                        ? "bg-gradient-to-b from-[#5aa8e2] to-[#2b6fb0] text-white border-[#1e5e9e] font-bold"
                        : "bg-white text-[#6a7a88] border-[#d0dae2] hover:bg-[#eef6fd] hover:border-[#8fc3ea] cursor-pointer"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <StatusBar>
        <span>DB: SQLite (Prisma) — {leads ? `${leads.length} records` : "…"}</span>
        <span>Auto-refresh: 15s</span>
        <span>Filter: {filter === "all" ? "SAB" : ADMIN_STAGES[filter]}</span>
        <span className="ml-auto">🔐 Admin session — Harish</span>
      </StatusBar>
    </div>
  );
}
