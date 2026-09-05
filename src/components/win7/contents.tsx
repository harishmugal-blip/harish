"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FolderIcon, DriveIcon, NotepadIcon } from "./icons";
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

        <div className="text-[12px] font-bold text-[#3a4a58] mb-1.5">System Properties</div>
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
                  <td className="px-2.5 py-[5px] text-[#1a2a38] cursor-default">📄 {it.name}</td>
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
