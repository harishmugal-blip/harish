// Authentic Windows 7 icon set — hybrid: REAL glossy PNGs (user-supplied sheet se, jo sahi nikle)
// + hand-crafted Win7 Aero SVG redraws for the broken/artifacted ones. Glass, gloss, soft gradients.

/* ---------------- Real icon PNG (extracted from original sheet, transparent bg) ---------------- */
function RealIcon({ src, className = "w-12 h-12" }: { src: string; className?: string }) {
  return <img src={`/icons/${src}`} alt="" className={className} draggable={false} />;
}

/* ---------------- Desktop: Recycle Bin (glass basket + chasing arrows + crumpled paper) ---------------- */
export function RecycleBinIcon({ className = "w-12 h-12" }: { className?: string; full?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="rbGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8f4fb" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#bcdcec" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8fb8cf" stopOpacity="0.52" />
        </linearGradient>
        <linearGradient id="rbRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f9fc" />
          <stop offset="1" stopColor="#93a9b8" />
        </linearGradient>
        <linearGradient id="rbPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe6ee" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="45" rx="13" ry="1.6" fill="#1c3a52" opacity="0.28" />
      {/* crumpled paper poking out of the top */}
      <g stroke="#8fa3b2" strokeWidth="0.7">
        <path d="M14 6.5l4.5-3 3 3.5-2 4-4.5.5z" fill="url(#rbPaper)" />
        <path d="M25 3.5l5-1.5 2.5 4-3 3.5-5-2z" fill="url(#rbPaper)" />
        <path d="M20 8l4-4 4 2.5-1.5 5-5 1z" fill="url(#rbPaper)" />
      </g>
      {/* tapered glass basket */}
      <path d="M10.5 13.5h27l-3 26a3 3 0 01-3 2.6h-15a3 3 0 01-3-2.6z" fill="url(#rbGlass)" stroke="#8fb4c9" strokeWidth="1" />
      {/* vertical glass strands */}
      <g stroke="#ffffff" strokeWidth="1.1" opacity="0.5" fill="none">
        <path d="M16 15l2 26" />
        <path d="M24 15v26.6" />
        <path d="M32 15l-2 26" />
      </g>
      <path d="M11.6 20.5h24.8" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      {/* metallic rim + inner opening */}
      <ellipse cx="24" cy="13.5" rx="13.8" ry="4" fill="url(#rbRim)" stroke="#7d93a4" strokeWidth="1" />
      <ellipse cx="24" cy="13.2" rx="10.8" ry="2.7" fill="#5f7c8f" opacity="0.5" />
      {/* chasing recycle arrows */}
      <g fill="none" stroke="#3f9c37" strokeWidth="2.4" strokeLinecap="round">
        <path d="M19.5 28.5a5.6 5.6 0 019.7 1.6" />
        <path d="M28.5 34.5a5.6 5.6 0 01-9.7-1.6" />
      </g>
      <path d="M27.6 26.2l1.9 4.3-4.6-.9z" fill="#3f9c37" stroke="#2c6b2f" strokeWidth="0.5" />
      <path d="M20.4 36.8l-1.9-4.3 4.6.9z" fill="#3f9c37" stroke="#2c6b2f" strokeWidth="0.5" />
    </svg>
  );
}

/* ---------------- Desktop: Computer (REAL LCD monitor) ---------------- */
export function ComputerIcon({ className = "w-12 h-12" }: { className?: string }) {
  return <RealIcon src="monitor.png" className={className} />;
}

/* ---------------- Desktop: Folder (REAL manila folder) ---------------- */
export function FolderIcon({ className = "w-12 h-12" }: { className?: string }) {
  return <RealIcon src="folder.png" className={className} />;
}

/* ---------------- Notepad (spiral pad — clean Aero redraw) ---------------- */
export function NotepadIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="npPage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9e6f1" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="45" rx="15" ry="1.6" fill="#1c3a52" opacity="0.25" />
      {/* back board */}
      <rect x="9" y="7" width="31.5" height="37.5" rx="2.5" fill="#c8d8e4" stroke="#7d93a4" strokeWidth="1" />
      {/* page */}
      <rect x="11.5" y="9.5" width="26.5" height="32.5" rx="1.5" fill="url(#npPage)" stroke="#9db0c0" strokeWidth="1" />
      {/* ruled lines */}
      <g stroke="#bcd4e9" strokeWidth="1.1" strokeLinecap="round">
        <path d="M21 19h15.5" />
        <path d="M21 23.5h15.5" />
        <path d="M21 28h15.5" />
        <path d="M21 32.5h15.5" />
        <path d="M21 37h10" />
      </g>
      {/* red margin */}
      <path d="M18.5 10.5v30.5" stroke="#e2a3a3" strokeWidth="1" />
      {/* spiral binding loops */}
      <g fill="none" stroke="#647c8e" strokeWidth="1.5" strokeLinecap="round">
        <path d="M13.6 9.8c-.7-3.2 4.1-3.2 3.4 0" />
        <path d="M19.6 9.8c-.7-3.2 4.1-3.2 3.4 0" />
        <path d="M25.6 9.8c-.7-3.2 4.1-3.2 3.4 0" />
        <path d="M31.6 9.8c-.7-3.2 4.1-3.2 3.4 0" />
      </g>
    </svg>
  );
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

/* ---------------- Windows Contacts (two glossy people — clean redraw) ---------------- */
export function ContactIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <radialGradient id="ctGreen" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#c6e9a8" />
          <stop offset="0.5" stopColor="#8bc853" />
          <stop offset="1" stopColor="#4e8f2f" />
        </radialGradient>
        <radialGradient id="ctBlue" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#bfe3f7" />
          <stop offset="0.5" stopColor="#6fb1dc" />
          <stop offset="1" stopColor="#3474a8" />
        </radialGradient>
      </defs>
      <ellipse cx="25" cy="44" rx="16" ry="1.8" fill="#1c3a52" opacity="0.25" />
      {/* back person — blue */}
      <g stroke="#2b5f8e" strokeWidth="1">
        <circle cx="16.5" cy="17" r="7" fill="url(#ctBlue)" />
        <path d="M4.5 40c1.6-9 6.5-13 12-13s10.4 4 12 13z" fill="url(#ctBlue)" />
      </g>
      {/* front person — green with white rim separation */}
      <g fill="#ffffff">
        <circle cx="31" cy="15.5" r="8" />
        <path d="M16.5 41c1.8-10.5 7.5-15 14.5-15s12.7 4.5 14.5 15z" />
      </g>
      <g stroke="#3f7323" strokeWidth="1">
        <circle cx="31" cy="15.5" r="6.7" fill="url(#ctGreen)" />
        <path d="M18.5 40c1.7-9.4 6.9-13.4 12.5-13.4s10.8 4 12.5 13.4z" fill="url(#ctGreen)" />
      </g>
    </svg>
  );
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

/* ---------------- Control Panel style gear (glossy silver — two-pass silhouette) ---------------- */
export function GearIcon({ className = "w-12 h-12" }: { className?: string }) {
  const teeth = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
    <rect key={a} x="20.4" y="3" width="7.2" height="11" rx="2.2" transform={`rotate(${a} 24 24)`} />
  ));
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <radialGradient id="grBody" cx="0.38" cy="0.32" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#d5e0e9" />
          <stop offset="0.8" stopColor="#9fb2c1" />
          <stop offset="1" stopColor="#788fa0" />
        </radialGradient>
        <radialGradient id="grHub" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#f4fafd" />
          <stop offset="0.7" stopColor="#b9cede" />
          <stop offset="1" stopColor="#8ba4b6" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="45.5" rx="15" ry="1.7" fill="#1c3a52" opacity="0.25" />
      {/* silhouette pass (strokes hidden under fill pass) */}
      <g fill="#5f7688" stroke="#5f7688" strokeWidth="1.4">
        {teeth}
        <circle cx="24" cy="24" r="14.5" />
      </g>
      {/* fill pass */}
      <g fill="url(#grBody)">
        {teeth}
        <circle cx="24" cy="24" r="14.5" />
      </g>
      {/* top gloss */}
      <path d="M13 18.2a11.6 11.6 0 0122 0 15.5 15.5 0 00-22 0z" fill="#ffffff" opacity="0.6" />
      <circle cx="24" cy="24" r="8.2" fill="#e9f2f8" stroke="#6d8496" strokeWidth="1" />
      <circle cx="24" cy="24" r="5" fill="url(#grHub)" stroke="#6d8496" strokeWidth="0.8" />
      <circle cx="24" cy="24" r="2.1" fill="#5d7386" opacity="0.55" />
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

/* ---------------- Windows Media Player (glossy orange play sphere — clean redraw) ---------------- */
export function MediaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <radialGradient id="wmpBall" cx="0.35" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#ffc987" />
          <stop offset="0.42" stopColor="#fb923c" />
          <stop offset="0.8" stopColor="#ea6c1a" />
          <stop offset="1" stopColor="#c24d08" />
        </radialGradient>
        <linearGradient id="wmpGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="44.5" rx="15" ry="1.8" fill="#1c3a52" opacity="0.25" />
      <circle cx="24" cy="23" r="18.5" fill="url(#wmpBall)" stroke="#93400e" strokeWidth="1" />
      <ellipse cx="24" cy="14" rx="15.6" ry="7.6" fill="url(#wmpGloss)" opacity="0.75" />
      <path d="M19.5 14.5l13.5 8.5-13.5 8.5z" fill="#ffffff" stroke="#b34a0b" strokeWidth="0.6" strokeLinejoin="round" />
    </svg>
  );
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

/* ---------------- Tray: Volume speaker (crisp Win7 white speaker) ---------------- */
export function VolumeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <path d="M2.2 5.8h2.6L9.2 2.5v11L4.8 10.2H2.2z" fill="#f4f9fd" stroke="#4c5e6c" strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M11.2 5.6a3.3 3.3 0 010 4.8" fill="none" stroke="#f4f9fd" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13.4 3.9a5.9 5.9 0 010 8.2" fill="none" stroke="#f4f9fd" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
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

/* ---------------- Videos folder (manila folder + film strip — clean redraw) ---------------- */
export function FolderVideosIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="fvBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7d890" />
          <stop offset="1" stopColor="#e0a83c" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43.5" rx="16" ry="1.8" fill="#1c3a52" opacity="0.25" />
      <path d="M6 12.5a2 2 0 012-2h11l3.5 3.5H40a2 2 0 012 2v22a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="url(#fvBack)" stroke="#b98a2a" strokeWidth="1" />
      <g transform="rotate(-3 24 27)">
        <rect x="9" y="20" width="30" height="13" rx="1.5" fill="#2c3440" stroke="#1c232c" strokeWidth="0.8" />
        <g fill="#8fd0f0">
          <rect x="11.5" y="22.5" width="6" height="8" rx="0.6" />
          <rect x="19.5" y="22.5" width="6" height="8" rx="0.6" />
          <rect x="27.5" y="22.5" width="6" height="8" rx="0.6" />
        </g>
        <g fill="#e8eef4">
          {[10, 13.5, 17, 20.5, 24, 27.5, 31, 34.5].map((x) => (
            <rect key={`t${x}`} x={x} y="21" width="1.6" height="1.6" rx="0.3" />
          ))}
          {[10, 13.5, 17, 20.5, 24, 27.5, 31, 34.5].map((x) => (
            <rect key={`b${x}`} x={x} y="30.4" width="1.6" height="1.6" rx="0.3" />
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ---------------- Prank: My Ex Photos folder (folder + peeking photo with heart) ---------------- */
export function FolderPhotosIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="fpBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7d890" />
          <stop offset="1" stopColor="#dfa93b" />
        </linearGradient>
        <linearGradient id="fpFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9b0" />
          <stop offset="1" stopColor="#f0b84e" />
        </linearGradient>
        <linearGradient id="fpSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd8f5" />
          <stop offset="1" stopColor="#5fa8d8" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43.5" rx="16" ry="1.8" fill="#1c3a52" opacity="0.25" />
      {/* back panel */}
      <path d="M6 13a2 2 0 012-2h10l3 3h19a2 2 0 012 2v20a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="url(#fpBack)" stroke="#b98a2a" strokeWidth="1" />
      {/* peeking photo */}
      <g transform="rotate(-4 22 15)">
        <rect x="13" y="6.5" width="19" height="14.5" rx="1" fill="#ffffff" stroke="#8fa3b2" strokeWidth="0.7" />
        <rect x="14.6" y="8.1" width="15.8" height="11.3" fill="url(#fpSky)" />
        <path d="M22.5 16.8c-2.6-1.7-4-3.1-4-4.7a2.1 2.1 0 014-.9 2.1 2.1 0 014 .9c0 1.6-1.4 3-4 4.7z" fill="#f25f8a" stroke="#c73b64" strokeWidth="0.5" />
      </g>
      {/* front flap */}
      <path d="M6 19a2 2 0 012-2h32a2 2 0 012 2v17a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="url(#fpFront)" stroke="#b98a2a" strokeWidth="1" />
      <path d="M7 18.5h34v3.2a34 34 0 01-34 0z" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

/* ---------------- Prank: Private Videos folder (folder + gold padlock) ---------------- */
export function FolderPrivateIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="pvBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7d890" />
          <stop offset="1" stopColor="#dfa93b" />
        </linearGradient>
        <linearGradient id="pvFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9b0" />
          <stop offset="1" stopColor="#f0b84e" />
        </linearGradient>
        <linearGradient id="pvLock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.5" stopColor="#f5b52e" />
          <stop offset="1" stopColor="#c98a10" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43.5" rx="16" ry="1.8" fill="#1c3a52" opacity="0.25" />
      <path d="M6 13a2 2 0 012-2h10l3 3h19a2 2 0 012 2v20a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="url(#pvBack)" stroke="#b98a2a" strokeWidth="1" />
      <path d="M6 19a2 2 0 012-2h32a2 2 0 012 2v17a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="url(#pvFront)" stroke="#b98a2a" strokeWidth="1" />
      <path d="M7 18.5h34v3.2a34 34 0 01-34 0z" fill="#ffffff" opacity="0.35" />
      {/* gold padlock */}
      <g>
        <path d="M28.5 22.5v-3.2a4.5 4.5 0 019 0v3.2" fill="none" stroke="#8a6410" strokeWidth="2.4" />
        <rect x="25.5" y="22" width="15" height="12.5" rx="2.2" fill="url(#pvLock)" stroke="#8a6410" strokeWidth="1" />
        <circle cx="33" cy="27" r="1.8" fill="#6b4e08" />
        <path d="M33 28.4v2.6" stroke="#6b4e08" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M26.8 23.2h12.4v2.6a16 16 0 01-12.4 0z" fill="#ffffff" opacity="0.4" />
      </g>
    </svg>
  );
}
