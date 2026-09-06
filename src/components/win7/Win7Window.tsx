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
        className={`relative flex flex-col h-full border ${
          maximized ? "" : "rounded-t-[7px]"
        } ${
          active
            ? "border-white/70 win7-glass-active shadow-[0_0_0_1px_rgba(180,215,250,0.45),0_18px_50px_rgba(0,0,0,0.6),0_0_32px_rgba(110,170,235,0.35)]"
            : "border-white/35 win7-glass-inactive shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        } overflow-hidden`}
      >
        {/* Title bar */}
        <div
          className="flex items-start h-[31px] px-1.5 shrink-0 cursor-default select-none touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={onToggleMax}
        >
          <div className="w-4 h-4 mt-[6px] mr-1.5 shrink-0 [&>svg]:w-4 [&>svg]:h-4 drop-shadow">{icon}</div>
          <span
            className={`text-[12px] flex-1 truncate mt-[6px] ${
              active ? "text-white" : "text-white/55"
            }`}
            style={{
              textShadow: active
                ? "0 0 10px rgba(205,235,255,0.6), 0 1px 3px rgba(0,0,0,0.9)"
                : "0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            {title}
          </span>

          {/* Window buttons — flush to the top edge, Win7 superbar style */}
          <div className="flex items-start shrink-0 self-start" data-nodrag>
            <button
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-[29px] h-[20px] rounded-b-[4px] border border-t-0 border-white/45 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(205,225,242,0.4)_50%,rgba(160,190,218,0.5))] hover:bg-[linear-gradient(to_bottom,#eaf7ff,#c3e5fb_50%,#9fd0f2)] hover:shadow-[0_0_9px_#8ac9f7] flex items-center justify-center"
            >
              <span className="block w-[9px] h-[2px] bg-[#0c3a5e] rounded-[1px]" />
            </button>
            <button
              aria-label="Maximize"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMax();
              }}
              className="w-[29px] h-[20px] rounded-b-[4px] border border-t-0 border-l-0 border-white/45 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(205,225,242,0.4)_50%,rgba(160,190,218,0.5))] hover:bg-[linear-gradient(to_bottom,#eaf7ff,#c3e5fb_50%,#9fd0f2)] hover:shadow-[0_0_9px_#8ac9f7] flex items-center justify-center"
            >
              <span className="block w-[9px] h-[8px] border-[1.5px] border-[#0c3a5e] rounded-[1px]" />
            </button>
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-[46px] h-[20px] rounded-b-[4px] ml-[2px] border border-t-0 border-white/45 bg-[linear-gradient(to_bottom,rgba(255,170,170,0.9),rgba(233,110,110,0.85)_48%,rgba(202,58,58,0.9))] hover:bg-[linear-gradient(to_bottom,#ffb3b3,#f08080_48%,#e54949)] hover:shadow-[0_0_12px_#ff6b6b] flex items-center justify-center"
            >
              <svg viewBox="0 0 12 12" className="w-[10px] h-[10px]">
                <path
                  d="M2.4 2.4l7.2 7.2M9.6 2.4l-7.2 7.2"
                  stroke="#fff"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 1px 1px rgba(90,0,0,0.55))" }}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 mx-[5px] mb-[5px] bg-white text-[#1a1a1a] overflow-hidden rounded-t-[2px] border border-[#5b7b99]/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)] flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
