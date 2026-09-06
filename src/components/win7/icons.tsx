// Authentic Windows 7 icon set — original Win7 icons ki tarah render hone wale SVGs
// (Harmony-era visual language: glass, gloss, soft gradients, Segoe-era colors)

/* ---------------- Desktop: Recycle Bin (Win7 translucent bin + green recycle arrows) ---------------- */
export function RecycleBinIcon({ className = "w-12 h-12", full = true }: { className?: string; full?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="rbinBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9db8c9" stopOpacity="0.95" />
          <stop offset="0.14" stopColor="#dcecf5" stopOpacity="0.75" />
          <stop offset="0.38" stopColor="#eef8fd" stopOpacity="0.55" />
          <stop offset="0.62" stopColor="#cfe4f0" stopOpacity="0.6" />
          <stop offset="0.88" stopColor="#a4bfce" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8aa7b8" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="rbinRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2fafd" />
          <stop offset="1" stopColor="#9fbccd" />
        </linearGradient>
        <linearGradient id="rbinArrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cc04a" />
          <stop offset="1" stopColor="#2e8b2e" />
        </linearGradient>
      </defs>

      {/* crumpled papers when full */}
      {full && (
        <g>
          <path d="M17 8.5l4-3 3.4 2.6-1.2 4-4.6.6z" fill="#fdfefb" stroke="#a9bac6" strokeWidth="0.7" transform="rotate(-10 20 10)" />
          <path d="M25 7.5l4.4-2 2.6 3.4-2 4-4.4-1z" fill="#f3ecd4" stroke="#b3a878" strokeWidth="0.7" transform="rotate(8 28 9)" />
          <ellipse cx="19" cy="12" rx="2.6" ry="1.9" fill="#eef4f8" stroke="#a9bac6" strokeWidth="0.6" />
        </g>
      )}

      {/* tapered glass body */}
      <path d="M13.2 15.5h21.6l-2.05 24.2c-.16 1.9-1.62 3.3-3.5 3.3H18.75c-1.88 0-3.34-1.4-3.5-3.3z" fill="url(#rbinBody)" stroke="#6f8fa2" strokeWidth="1" />
      {/* rim */}
      <ellipse cx="24" cy="15.5" rx="10.8" ry="3.3" fill="url(#rbinRim)" stroke="#6f8fa2" strokeWidth="1" />
      <ellipse cx="24" cy="15.5" rx="7.6" ry="2.1" fill="#5f7d90" opacity="0.55" />
      <ellipse cx="24" cy="15.2" rx="9" ry="2.4" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
      {/* vertical facets */}
      <g stroke="#5f8095" strokeWidth="0.9" opacity="0.4" fill="none">
        <path d="M18.4 20.5l1 18.6" />
        <path d="M24 21v18.6" />
        <path d="M29.6 20.5l-1 18.6" />
      </g>
      {/* glass sheen */}
      <path d="M15.2 18.5l1.2 20c.06 1 .8 1.8 1.8 1.8h2.2c-1.4-6.6-1.6-14.8-1-21.8z" fill="#ffffff" opacity="0.35" />

      {/* recycle arrows emblem (3 chasing arrows) */}
      <g fill="url(#rbinArrow)" stroke="#1f6b1f" strokeWidth="0.45">
        <g transform="translate(24 30.5)">
          <path d="M0 -5.6l2.6 4.4h-1.5v3h-2.2v-3h-1.5z" transform="rotate(0)" />
          <path d="M0 -5.6l2.6 4.4h-1.5v3h-2.2v-3h-1.5z" transform="rotate(120)" />
          <path d="M0 -5.6l2.6 4.4h-1.5v3h-2.2v-3h-1.5z" transform="rotate(240)" />
        </g>
      </g>
    </svg>
  );
}

/* ---------------- Desktop: Computer (Win7 LCD monitor, Harmony-blue screen) ---------------- */
export function ComputerIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="cmpScr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#59b7f2" />
          <stop offset="0.55" stopColor="#1f7ad1" />
          <stop offset="1" stopColor="#0a3f7e" />
        </linearGradient>
        <linearGradient id="cmpBezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a5866" />
          <stop offset="0.5" stopColor="#2b3641" />
          <stop offset="1" stopColor="#161e26" />
        </linearGradient>
        <linearGradient id="cmpStand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9e4ec" />
          <stop offset="1" stopColor="#8ea3b2" />
        </linearGradient>
      </defs>
      {/* monitor */}
      <rect x="3.5" y="6.5" width="41" height="26" rx="2.2" fill="url(#cmpBezel)" stroke="#0d141b" strokeWidth="0.8" />
      <rect x="5.6" y="8.4" width="36.8" height="20.4" rx="1" fill="url(#cmpScr)" />
      {/* Harmony flag ghost on screen */}
      <g transform="translate(24 18.6) scale(0.34)" opacity="0.85">
        <path d="M-14 -9c5-2 10-2.4 13.5-1.8v8.6C-4-2.8-9-2.4-14-1z" fill="#f65314" />
        <path d="M2.5 -10.6c5-.8 10-1 14-1v8.6c-4 0-9 .2-14 1z" fill="#7cbb00" />
        <path d="M-14 2.6c5-1.4 10-1.8 13.5-1.2V10c-4.5-.6-9.5-.2-13.5 1z" fill="#00a1f1" />
        <path d="M2.5 1.2c5-1 10-1.2 14-1.2v8.6c-4 0-9 .3-14 1.2z" fill="#ffbb08" />
      </g>
      {/* screen sheen */}
      <path d="M5.6 8.4h36.8v9.2c-12.2 4.4-24.6 4.4-36.8 0z" fill="#ffffff" opacity="0.22" />
      {/* power LED */}
      <circle cx="41.2" cy="30.9" r="0.9" fill="#8fd8ff" />
      <circle cx="41.2" cy="30.9" r="0.45" fill="#e8faff" />
      {/* neck + foot */}
      <path d="M20 32.5h8l1.2 5.5H18.8z" fill="url(#cmpStand)" stroke="#5f7484" strokeWidth="0.8" />
      <path d="M13.5 38h21c1.4 0 2.4 1 2.4 2.2 0 .9-.7 1.6-1.7 1.6H12.8c-1 0-1.7-.7-1.7-1.6 0-1.2 1-2.2 2.4-2.2z" fill="url(#cmpStand)" stroke="#5f7484" strokeWidth="0.8" />
    </svg>
  );
}

/* ---------------- Desktop: Folder (Win7 two-tone manila) ---------------- */
export function FolderIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="fldB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efc75e" />
          <stop offset="1" stopColor="#d99b22" />
        </linearGradient>
        <linearGradient id="fldF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c2" />
          <stop offset="0.28" stopColor="#fbd873" />
          <stop offset="0.75" stopColor="#f2b93c" />
          <stop offset="1" stopColor="#dd9e1c" />
        </linearGradient>
      </defs>
      {/* back panel with tab */}
      <path d="M4.5 11.8c0-1.7 1.3-3 3-3h10.4l3.8 3.8h18.8c1.7 0 3 1.3 3 3v3.6H4.5z" fill="url(#fldB)" stroke="#b5820f" strokeWidth="0.9" />
      {/* front panel */}
      <path d="M4.5 16.4h38.6c1.75 0 3 1.45 2.72 3.18l-2.5 15.8c-.28 1.74-1.6 2.62-3.32 2.62H7.6c-1.72 0-3.04-.88-3.32-2.62l-2.5-15.8c-.28-1.73.97-3.18 2.72-3.18z" fill="url(#fldF)" stroke="#b5820f" strokeWidth="0.9" />
      {/* top sheen */}
      <path d="M5 18h38c.9 0 1.5.7 1.32 1.5l-.5 2.5c-.16.8-.9 1.4-1.8 1.4H6c-.9 0-1.64-.6-1.8-1.4l-.5-2.5C3.5 18.7 4.1 18 5 18z" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

/* ---------------- Notepad (Win7 spiral pad, blue rules) ---------------- */
export function NotepadIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="npPage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d8e6f2" />
        </linearGradient>
        <linearGradient id="npCover" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f7fb8" />
          <stop offset="1" stopColor="#265e91" />
        </linearGradient>
      </defs>
      {/* back cover */}
      <rect x="9" y="4.5" width="30" height="39" rx="2" fill="url(#npCover)" stroke="#1c4a75" strokeWidth="0.9" />
      {/* page */}
      <rect x="11" y="7" width="26" height="34" rx="1" fill="url(#npPage)" stroke="#8aa4ba" strokeWidth="0.8" />
      {/* spiral binding */}
      <g fill="none" stroke="#6b7f90" strokeWidth="1.3">
        <path d="M14.5 7v-2.6M19 7v-2.6M23.5 7v-2.6M28 7v-2.6M32.5 7v-2.6" />
      </g>
      <g fill="#c8d6e2" stroke="#6b7f90" strokeWidth="0.8">
        <circle cx="14.5" cy="3.9" r="1.3" />
        <circle cx="19" cy="3.9" r="1.3" />
        <circle cx="23.5" cy="3.9" r="1.3" />
        <circle cx="28" cy="3.9" r="1.3" />
        <circle cx="32.5" cy="3.9" r="1.3" />
      </g>
      {/* blue rules */}
      <g stroke="#6fa8d6" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14.5 16h19M14.5 21.5h19M14.5 27h19M14.5 32.5h12" />
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

/* ---------------- Windows Live Mail style envelope ---------------- */
export function ContactIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id="mlBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cc4f4" />
          <stop offset="0.5" stopColor="#3187c9" />
          <stop offset="1" stopColor="#1b5f9e" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="40" height="28" rx="3" fill="url(#mlBody)" stroke="#154f85" strokeWidth="1" />
      <path d="M5 12l19 14.2L43 12" fill="none" stroke="#eaf6ff" strokeWidth="2.4" strokeLinejoin="round" opacity="0.95" />
      <path d="M4.5 11c0-1.1.9-2 2-2h35c1.1 0 2 .9 2 2l-19.5 14z" fill="#dcefff" opacity="0.5" />
      <rect x="4" y="10" width="40" height="7" rx="3" fill="#ffffff" opacity="0.28" />
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

/* ---------------- Windows Media Player 12 orange orb ---------------- */
export function MediaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <defs>
        <radialGradient id="wmpOrb" cx="0.35" cy="0.28" r="0.95">
          <stop offset="0" stopColor="#ffd29a" />
          <stop offset="0.3" stopColor="#ffa64d" />
          <stop offset="0.68" stopColor="#f07614" />
          <stop offset="1" stopColor="#a83f04" />
        </radialGradient>
        <linearGradient id="wmpSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#wmpOrb)" stroke="#8f3a04" strokeWidth="1" />
      <circle cx="16" cy="16" r="10.6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
      <path d="M4.2 12.6C6 7.6 10.6 4.6 16 4.6c2.2 0 4.3.5 6.1 1.4-4.2-.4-9.2.4-12.6 2.4-2.5 1.4-4.3 3-5.3 4.2z" fill="url(#wmpSheen)" />
      <path d="M12.6 10.2l10 5.8-10 5.8z" fill="#ffffff" style={{ filter: "drop-shadow(0 1px 1.5px rgba(90,30,0,0.5))" }} />
    </svg>
  );
}

/* ---------------- Internet Explorer (blue e + gold orbit) ---------------- */
export function IEIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <defs>
        <linearGradient id="ieBlue" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#8ed2f6" />
          <stop offset="0.45" stopColor="#3b93cf" />
          <stop offset="1" stopColor="#0f5b9e" />
        </linearGradient>
        <linearGradient id="ieGoldBack" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c98f1d" />
          <stop offset="1" stopColor="#e8b64a" />
        </linearGradient>
        <linearGradient id="ieGoldFront" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd977" />
          <stop offset="1" stopColor="#eda322" />
        </linearGradient>
      </defs>
      {/* orbit — back half (behind the e) */}
      <path d="M2.6 13.2c3-6.4 9-9.6 14.6-8.2 3.4.86 6 3 7.8 6-2.4-1.6-5.2-2.4-8.2-2.2-6 .4-11 2-14.2 4.4z" fill="url(#ieGoldBack)" />
      {/* the e */}
      <g transform="translate(16 16.6) skewX(-8) translate(-16 -16.6)">
        <path d="M22.6 13.2A7.1 7.1 0 1 0 22.6 20" fill="none" stroke="url(#ieBlue)" strokeWidth="4.7" />
        <rect x="9" y="14.4" width="13.4" height="3.4" fill="url(#ieBlue)" />
      </g>
      {/* orbit — front half (crosses in front) */}
      <path d="M29.4 18.8c-3 6.4-9 9.6-14.6 8.2-3.4-.86-6-3-7.8-6 2.4 1.6 5.2 2.4 8.2 2.2 6-.4 11-2 14.2-4.4z" fill="url(#ieGoldFront)" />
    </svg>
  );
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

/* ---------------- Tray: Volume speaker ---------------- */
export function VolumeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <path d="M2.2 5.8h2.6L9 2.4v11.2L4.8 10.2H2.2z" fill="#f2f6fa" />
      <path d="M11 5.2a4.1 4.1 0 0 1 0 5.6M13.2 3.4a7 7 0 0 1 0 9.2" fill="none" stroke="#f2f6fa" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
