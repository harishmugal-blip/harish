// Glossy Windows-7 style SVG icons — custom banaye hain, lucide se smooth nahi lagta
export function FolderIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="fldB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9d975" />
          <stop offset="1" stopColor="#e0a722" />
        </linearGradient>
        <linearGradient id="fldF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffefb2" />
          <stop offset="0.5" stopColor="#f5c94c" />
          <stop offset="1" stopColor="#d99b17" />
        </linearGradient>
      </defs>
      <path d="M4 12c0-1.6 1.2-3 3-3h11l4 4h19c1.8 0 3 1.3 3 3v4H4z" fill="url(#fldB)" stroke="#b98610" strokeWidth="0.8" />
      <path d="M4 17h40c1.6 0 2.8 1.4 2.5 3l-2.6 16c-.3 1.7-1.5 3-3.2 3H7.3c-1.7 0-2.9-1.3-3.2-3L1.5 20c-.3-1.6.9-3 2.5-3z" fill="url(#fldF)" stroke="#b98610" strokeWidth="0.8" />
      <path d="M5 18.5h38c.8 0 1.3.6 1.1 1.4l-.4 2c-.2.8-.9 1.4-1.7 1.4H6c-.8 0-1.5-.6-1.7-1.4l-.4-2c-.2-.8.3-1.4 1.1-1.4z" fill="#fff" opacity="0.45" />
    </svg>
  );
}

export function ComputerIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd6ff" />
          <stop offset="1" stopColor="#1f6fc0" />
        </linearGradient>
        <linearGradient id="mon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f8fb" />
          <stop offset="1" stopColor="#b9c6d2" />
        </linearGradient>
      </defs>
      <rect x="4" y="7" width="40" height="27" rx="2.5" fill="url(#mon)" stroke="#5a6b7a" strokeWidth="1" />
      <rect x="7" y="10" width="34" height="21" rx="1" fill="url(#scr)" />
      <path d="M7 10h34v8c-11 4-23 4-34 0z" fill="#fff" opacity="0.35" />
      <path d="M18 34h12l2 6H16z" fill="#aebccb" stroke="#5a6b7a" strokeWidth="0.8" />
      <rect x="11" y="40" width="26" height="3" rx="1.5" fill="#cfd9e2" stroke="#5a6b7a" strokeWidth="0.8" />
      <circle cx="24" cy="20" r="6" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
      <circle cx="24" cy="20" r="2.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export function RecycleBinIcon({ className = "w-12 h-12", full = true }: { className?: string; full?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="bin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfe3ee" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#eef7fc" stopOpacity="0.65" />
          <stop offset="1" stopColor="#a9c4d4" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {full && (
        <g>
          <rect x="17" y="8" width="7" height="9" rx="1" fill="#fff" stroke="#9db3c0" transform="rotate(-14 20 12)" />
          <rect x="25" y="7" width="7" height="10" rx="1" fill="#f7e9a0" stroke="#c9b45e" transform="rotate(10 28 12)" />
        </g>
      )}
      <path d="M13 16h22l-2.4 25c-.2 1.8-1.6 3-3.3 3h-10.6c-1.7 0-3.1-1.2-3.3-3z" fill="url(#bin)" stroke="#7e99a8" strokeWidth="1" />
      <ellipse cx="24" cy="16" rx="11" ry="3" fill="#dceaf3" stroke="#7e99a8" strokeWidth="1" />
      <ellipse cx="24" cy="16" rx="7.5" ry="1.8" fill="#b9d2e0" />
      <path d="M18.5 21l1.6 18M24 21v18M29.5 21l-1.6 18" stroke="#7e99a8" strokeWidth="1.2" opacity="0.6" fill="none" />
      <g transform="translate(24 28)" fill="#3f9e3f">
        <path d="M-4.5-2.5c.4-1.6 1.8-2.8 3.6-2.8 1.1 0 2.1.5 2.8 1.3l1-1 1 3.7-3.7-.9.9-.9c-.5-.6-1.2-.9-2-.9-1 0-1.9.6-2.3 1.5z" />
        <path d="M4.7 1.6c.3 1.6-.5 3.2-2.1 3.9-1 .5-2.2.4-3.1-.1l-.6 1.2-2.4-3 3.8-.5-.6 1.2c.6.3 1.4.3 2-.1.9-.4 1.4-1.4 1.2-2.4z" />
      </g>
    </svg>
  );
}

export function NotepadIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="np" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d7e3ec" />
        </linearGradient>
      </defs>
      <path d="M10 5h20l8 8v30H10z" fill="url(#np)" stroke="#8298a8" strokeWidth="1" />
      <path d="M30 5l8 8h-8z" fill="#c3d4e0" stroke="#8298a8" strokeWidth="1" />
      <g stroke="#5b8db8" strokeWidth="1.6" strokeLinecap="round">
        <path d="M15 18h18M15 23h18M15 28h18M15 33h12" />
      </g>
    </svg>
  );
}

export function PdfIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path d="M10 5h20l8 8v30H10z" fill="#fff" stroke="#8298a8" strokeWidth="1" />
      <path d="M30 5l8 8h-8z" fill="#c3d4e0" stroke="#8298a8" strokeWidth="1" />
      <rect x="6" y="22" width="30" height="14" rx="2" fill="#c0392b" />
      <text x="21" y="32.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">PDF</text>
    </svg>
  );
}

export function ContactIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="ml" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ec8f7" />
          <stop offset="1" stopColor="#2b6fb5" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="40" height="28" rx="3" fill="url(#ml)" stroke="#1d568f" strokeWidth="1" />
      <path d="M5 12l19 14 19-14" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" opacity="0.85" />
      <path d="M5 12l19 14 19-14v-1c0-1-.9-2-2-2H7c-1.1 0-2 1-2 2z" fill="#e8f4fd" opacity="0.35" />
    </svg>
  );
}

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

export function GearIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe9ef" />
          <stop offset="1" stopColor="#93a8b6" />
        </linearGradient>
      </defs>
      <g fill="url(#gr)" stroke="#61788a" strokeWidth="1">
        <path d="M24 4l3 6 6.5-1.5 1 6.5 6.5 1L39.5 22 45 25l-5.5 3 1.5 6.5-6.5 1-1 6.5L27 40.5 24 46l-3-5.5-6.5 1.5-1-6.5-6.5-1L8.5 28 3 25l5.5-3-1.5-6.5 6.5-1 1-6.5L21 9.5z" />
      </g>
      <circle cx="24" cy="25" r="7.5" fill="#eef4f8" stroke="#61788a" strokeWidth="1.2" />
      <circle cx="24" cy="25" r="4" fill="#8fb4cc" opacity="0.5" />
    </svg>
  );
}

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

export function MediaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <defs>
        <radialGradient id="wmp" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffb75e" />
          <stop offset="0.6" stopColor="#f07818" />
          <stop offset="1" stopColor="#c4500a" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#wmp)" stroke="#93400a" strokeWidth="1" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <path d="M13 10.5l9 5.5-9 5.5z" fill="#fff" />
    </svg>
  );
}

export function IEIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <defs>
        <linearGradient id="ieg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd0f8" />
          <stop offset="1" stopColor="#1d64ad" />
        </linearGradient>
      </defs>
      <path d="M16 4c7 0 12 5 12 12 0 7-5 12-12 12S4 23 4 16C4 9 9 4 16 4zm0 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="url(#ieg)" />
      <path d="M3 12c4-7 12-9 18-6 3 1.5 5 4 6 6.5-2-1.5-5-2.5-8-2C13 9 7 10 3 12z" fill="#f2b230" opacity="0.9" />
      <text x="16" y="21.5" textAnchor="middle" fill="#fff" fontSize="13" fontStyle="italic" fontWeight="bold" fontFamily="Georgia, serif">e</text>
    </svg>
  );
}

export function WinFlag({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <g transform="rotate(-8 16 16)">
        <path d="M15 6.5c-4 1.2-8 1.6-11 1.6v7c3 0 7-.4 11-1.4z" fill="#f65314" />
        <path d="M17 6c5-1.2 10-1.4 13-1.4v7c-3 0-8 .2-13 1.2z" fill="#7cbb00" />
        <path d="M15 16.5c-4 1-8 1.4-11 1.4v7c3 0 7-.3 11-1.3z" fill="#00a1f1" />
        <path d="M17 17c5-1 10-1.2 13-1.2v7c-3 0-8 .3-13 1.3z" fill="#ffbb00" />
      </g>
    </svg>
  );
}
