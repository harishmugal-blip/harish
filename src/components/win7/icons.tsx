// Authentic Windows 7 icon set — REAL glossy icons (user-supplied original icon sheet se
// extract kiye gaye) + Win7-style SVGs for the rest. Glass, gloss, soft gradients, Segoe-era colors.

/* ---------------- Real icon PNG (extracted from original sheet, transparent bg) ---------------- */
function RealIcon({ src, className = "w-12 h-12" }: { src: string; className?: string }) {
  return <img src={`/icons/${src}`} alt="" className={className} draggable={false} />;
}

/* ---------------- Desktop: Recycle Bin (REAL translucent glass bin + papers) ---------------- */
export function RecycleBinIcon({ className = "w-12 h-12" }: { className?: string; full?: boolean }) {
  return <RealIcon src="recycle-full.png" className={className} />;
}

/* ---------------- Desktop: Computer (REAL LCD monitor) ---------------- */
export function ComputerIcon({ className = "w-12 h-12" }: { className?: string }) {
  return <RealIcon src="monitor.png" className={className} />;
}

/* ---------------- Desktop: Folder (REAL manila folder) ---------------- */
export function FolderIcon({ className = "w-12 h-12" }: { className?: string }) {
  return <RealIcon src="folder.png" className={className} />;
}

/* ---------------- Notepad (REAL spiral pad) ---------------- */
export function NotepadIcon({ className = "w-12 h-12" }: { className?: string }) {
  return <RealIcon src="notepad.png" className={className} />;
}

/* ---------------- PDF document ---------------- */
export function PdfIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="pdfBadge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8604f" />
          <stop offset="1" stopColor="#a82c1f" />
        </linearGradient>
      </defs>
      <path d="M10 5h20l8 8v30H10z" fill="#ffffff" stroke="#8298a8" strokeWidth="1" />
      <path d="M30 5l8 8h-8z" fill="#c3d4e0" stroke="#8298a8" strokeWidth="1" />
      <g stroke="#9fb3c2" strokeWidth="1.4" strokeLinecap="round">
        <path d="M14 18h12" />
      </g>
      <rect x="5.5" y="23" width="31" height="13.5" rx="2" fill="url(#pdfBadge)" />
      <text x="21" y="33" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold" fontFamily="Arial, sans-serif">PDF</text>
    </svg>
  );
}

/* ---------------- Windows Contacts (REAL two-people icon) ---------------- */
export function ContactIcon({ className = "w-12 h-12" }: { className?: string }) {
  return <RealIcon src="users.png" className={className} />;
}

/* ---------------- User tile (fallback avatar frame) ---------------- */
export function UserTileIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="ut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9adcff" />
          <stop offset="1" stopColor="#2f7fc1" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="3" fill="url(#ut)" stroke="#1d568f" strokeWidth="1" />
      <circle cx="24" cy="19" r="7" fill="#ffe0b8" stroke="#c99b62" />
      <path d="M11 42c1.5-8 7-11 13-11s11.5 3 13 11z" fill="#ffe0b8" stroke="#c99b62" />
      <rect x="6" y="6" width="36" height="10" rx="3" fill="#fff" opacity="0.3" />
    </svg>
  );
}

/* ---------------- Control Panel style gear ---------------- */
export function GearIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="grBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f7fa" />
          <stop offset="0.5" stopColor="#b9c9d5" />
          <stop offset="1" stopColor="#7e93a3" />
        </linearGradient>
      </defs>
      <path d="M24 3.5l3.2 6.2 6.8-1.6 1 6.9 6.9 1L40.3 22.6l5.7 3.4-5.7 3.4 1.6 6.8-6.9 1-1 6.9-6.8-1.6L24 48.7l-3.2-6.2-6.8 1.6-1-6.9-6.9-1 1.6-6.8-5.7-3.4 5.7-3.4-1.6-6.8 6.9-1 1-6.9 6.8 1.6z" fill="url(#grBody)" stroke="#5d7386" strokeWidth="1" transform="translate(0 -1.5) scale(0.96)" />
      <circle cx="24" cy="24" r="7.8" fill="#eef4f8" stroke="#5d7386" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="4.2" fill="#8fb4cc" opacity="0.55" />
    </svg>
  );
}

/* ---------------- Hard drive ---------------- */
export function DriveIcon({ className = "w-12 h-12", variant = "c" }: { className?: string; variant?: string }) {
  const color = variant === "c" ? "#4f9e4f" : variant === "d" ? "#3b7fc4" : "#b88ad4";
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id={`dv-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f6f9" />
          <stop offset="1" stopColor="#b6c5d1" />
        </linearGradient>
      </defs>
      <rect x="5" y="14" width="38" height="20" rx="2.5" fill={`url(#dv-${variant})`} stroke="#66798a" strokeWidth="1" />
      <rect x="5" y="14" width="38" height="7" rx="2.5" fill="#fff" opacity="0.5" />
      <circle cx="37" cy="29" r="2" fill={color} />
      <rect x="9" y="27" width="14" height="4" rx="1" fill="#8fa3b2" opacity="0.6" />
    </svg>
  );
}

/* ---------------- Windows Media Player (REAL glass stack + orange play) ---------------- */
export function MediaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <RealIcon src="media-player.png" className={className} />;
}

/* ---------------- Internet Explorer (REAL blue e + gold orbit) ---------------- */
export function IEIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <RealIcon src="ie.png" className={className} />;
}

/* ---------------- Games controller (Win7 purple pad) ---------------- */
export function GamesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <defs>
        <linearGradient id="gmpad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a98fe0" />
          <stop offset="0.55" stopColor="#7452c0" />
          <stop offset="1" stopColor="#4b2f8e" />
        </linearGradient>
      </defs>
      <path d="M9.4 9.5h13.2c3.8 0 6.6 3 6.6 7 0 3.8-1.4 7-4.2 7-2.2 0-3.2-1.8-4.4-3.6-.9-1.4-1.6-2-2.8-2h-3.6c-1.2 0-1.9.6-2.8 2-1.2 1.8-2.2 3.6-4.4 3.6-2.8 0-4.2-3.2-4.2-7 0-4 2.8-7 6.6-7z" fill="url(#gmpad)" stroke="#33206b" strokeWidth="1" />
      <path d="M9.4 10.6h13.2c2.6 0 4.6 1.7 5.6 4.2-.8-2-2.8-3.2-5.6-3.2H9.4c-2.8 0-4.8 1.2-5.6 3.2 1-2.5 3-4.2 5.6-4.2z" fill="#ffffff" opacity="0.3" />
      <g fill="#e8e2f8">
        <rect x="8.4" y="13.2" width="5.2" height="2.4" rx="0.8" />
        <rect x="9.8" y="11.8" width="2.4" height="5.2" rx="0.8" />
      </g>
      <circle cx="21.4" cy="13" r="1.35" fill="#ffd23e" stroke="#8a6410" strokeWidth="0.5" />
      <circle cx="24.4" cy="15.6" r="1.35" fill="#ff6b57" stroke="#8a2418" strokeWidth="0.5" />
    </svg>
  );
}

/* ---------------- Waving Windows flag — OFFICIAL Windows 7 logo (user-supplied SVG) ---------------- */
export function WinFlag({ className = "w-6 h-6" }: { className?: string }) {
  return <img src="/win7-logo.svg" alt="Windows 7 logo" className={className} draggable={false} />;
}

/* ---------------- Tray: Action Center flag ---------------- */
export function TrayFlagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <path d="M4.2 1.8v12.6" stroke="#f2f6fa" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.2 2.2l8.2 1.8c.5.1.5.9 0 1L4.2 7z" fill="#f2f6fa" />
    </svg>
  );
}

/* ---------------- Tray: Win7 network signal bars ---------------- */
export function NetworkBarsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <g fill="#f2f6fa">
        <rect x="1" y="11" width="2.1" height="3.2" rx="0.4" />
        <rect x="4.2" y="8.6" width="2.1" height="5.6" rx="0.4" />
        <rect x="7.4" y="6.2" width="2.1" height="8" rx="0.4" />
        <rect x="10.6" y="3.8" width="2.1" height="10.4" rx="0.4" />
        <rect x="13.8" y="1.4" width="2.1" height="12.8" rx="0.4" opacity="0.45" />
      </g>
    </svg>
  );
}

/* ---------------- Tray: Volume speaker (REAL glossy speaker) ---------------- */
export function VolumeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <RealIcon src="speaker.png" className={className} />;
}

/* ---------------- Sound file (REAL WAV file icon) — audio entries ke liye ---------------- */
export function SoundFileIcon({ className = "w-6 h-6" }: { className?: string }) {
  return <RealIcon src="wav-file.png" className={className} />;
}

/* ---------------- Music CD (REAL disc + note) ---------------- */
export function CdMusicIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <RealIcon src="cd-music.png" className={className} />;
}

/* ---------------- Info (REAL blue info circle) ---------------- */
export function InfoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <RealIcon src="info.png" className={className} />;
}

/* ---------------- Security shield (REAL green check shield) ---------------- */
export function ShieldCheckIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <RealIcon src="shield-check.png" className={className} />;
}

/* ---------------- Videos folder (REAL film folder) ---------------- */
export function FolderVideosIcon({ className = "w-8 h-8" }: { className?: string }) {
  return <RealIcon src="folder-videos.png" className={className} />;
}
