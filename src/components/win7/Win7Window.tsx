"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

export interface WinPos {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Win7WindowProps {
  title: string;
  icon: ReactNode;
  pos: WinPos;
  z: number;
  active: boolean;
  maximized: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (pos: WinPos) => void;
}

export default function Win7Window({
  title,
  icon,
  pos,
  z,
  active,
  maximized,
  children,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
}: Win7WindowProps) {
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (maximized) return;
      if ((e.target as HTMLElement).closest("[data-nodrag]")) return;
      dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [maximized, pos.x, pos.y]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const maxX = window.innerWidth - 120;
      const maxY = window.innerHeight - 100;
      onMove({
        ...pos,
        x: Math.min(Math.max(-pos.w + 160, e.clientX - dragRef.current.dx), maxX),
        y: Math.min(Math.max(0, e.clientY - dragRef.current.dy), maxY),
      });
    },
    [onMove, pos]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // Esc to close when active
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active, onClose]);

  const style: React.CSSProperties = maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - 40px)", zIndex: z }
    : { left: pos.x, top: pos.y, width: pos.w, height: pos.h, zIndex: z };

  return (
    <div
      className={`absolute flex flex-col win7-window-anim ${
        maximized ? "" : "rounded-t-lg"
      }`}
      style={style}
      onPointerDown={onFocus}
    >
      {/* Aero glass frame */}
      <div
        className={`flex flex-col h-full border ${
          maximized ? "" : "rounded-t-lg"
        } ${
          active
            ? "border-white/60 win7-glass-active shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
            : "border-white/30 win7-glass-inactive shadow-[0_6px_24px_rgba(0,0,0,0.4)]"
        } overflow-hidden`}
      >
        {/* Title bar */}
        <div
          className="flex items-center h-[30px] px-1.5 shrink-0 cursor-default select-none touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={onToggleMax}
        >
          <div className="w-4 h-4 mr-1.5 shrink-0 [&>svg]:w-4 [&>svg]:h-4 drop-shadow">{icon}</div>
          <span
            className={`text-[12px] font-semibold tracking-wide flex-1 truncate ${
              active ? "text-white/95" : "text-white/60"
            }`}
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
          >
            {title}
          </span>

          {/* Window buttons — Win7 style, touch top edge */}
          <div className="flex items-start shrink-0" data-nodrag>
            <button
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-[29px] h-[19px] rounded-b-[4px] border border-white/30 bg-gradient-to-b from-white/35 to-white/10 hover:from-[#e3f4ff]/60 hover:to-[#b3d9f5]/40 hover:shadow-[0_0_8px_#7ec5f5] flex items-center justify-center"
            >
              <span className="block w-[8px] h-[2px] bg-white/90 -mt-[6px] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
            </button>
            <button
              aria-label="Maximize"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMax();
              }}
              className="w-[29px] h-[19px] rounded-b-[4px] border-l-0 border border-white/30 bg-gradient-to-b from-white/35 to-white/10 hover:from-[#e3f4ff]/60 hover:to-[#b3d9f5]/40 hover:shadow-[0_0_8px_#7ec5f5] flex items-center justify-center"
            >
              <span className="block w-[9px] h-[7px] border border-white/90 -mt-[5px] rounded-[1px] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
            </button>
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-[45px] h-[19px] rounded-b-[4px] ml-[2px] border border-white/30 bg-gradient-to-b from-[#f8a0a0]/60 to-[#d45b5b]/40 hover:from-[#f97d7d] hover:to-[#d92b2b] hover:shadow-[0_0_10px_#ff5f5f] flex items-center justify-center"
            >
              <svg viewBox="0 0 12 12" className="w-[10px] h-[10px] -mt-[5px]">
                <path
                  d="M2 2l8 8M10 2l-8 8"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.6))" }}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 mx-[4px] mb-[4px] bg-white text-[#1a1a1a] overflow-hidden border border-[#4a6a8a]/60 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
