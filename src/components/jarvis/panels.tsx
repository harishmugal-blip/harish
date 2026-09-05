"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getMemorySnapshot,
  subscribeMemory,
  removeMemory,
  clearMemories,
  MEMORY_MAX,
} from "@/lib/jarvisMemory";
import { getRadioState, subscribeRadio, togglePlayPause, nextSong } from "@/lib/radio";

/* ---------- shell ---------- */

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[6px] border border-cyan-400/20 bg-black/40 backdrop-blur-[6px] overflow-hidden">
      <div className="flex items-center justify-between px-2.5 py-1 border-b border-cyan-400/15 bg-cyan-400/[0.06]">
        <span className="text-[9.5px] tracking-[0.22em] text-cyan-300/90 font-semibold">{title}</span>
        {right}
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  );
}

/* ---------- SYS panel ---------- */

function useUptime(activeSince: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - activeSince) / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function SysPanel({ activeSince }: { activeSince: number }) {
  const uptime = useUptime(activeSince);
  return (
    <Panel title="SYS://STATUS" right={<span className="text-[9px] text-emerald-300/90">● ONLINE</span>}>
      <div className="space-y-1 text-[11px]">
        {[
          ["CORE", "GLM NEURAL LINK ✓"],
          ["UPTIME", uptime],
          ["MEMORY BANK", `${getMemorySnapshot().length}/${MEMORY_MAX}`],
          ["AUDIO", "YT MUSIC BRIDGE ✓"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2">
            <span className="text-cyan-200/45 tracking-wider">{k}</span>
            <span className="text-cyan-100/85">{v}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------- WEATHER panel (live, open-meteo, Muzaffarnagar) ---------- */

interface Weather {
  temp: number;
  wind: number;
  code: number;
  loading: boolean;
  err: boolean;
}

const WCODES: Record<number, string> = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Fog",
  51: "Drizzle", 53: "Drizzle", 55: "Drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Snow", 73: "Snow", 75: "Snow", 80: "Showers", 81: "Showers", 82: "Heavy showers",
  95: "Thunderstorm", 96: "Hail storm", 99: "Hail storm",
};

export function WeatherPanel() {
  const [w, setW] = useState<Weather>({ temp: 0, wind: 0, code: 0, loading: true, err: false });

  useEffect(() => {
    let dead = false;
    const load = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=29.4727&longitude=77.7085&current_weather=true"
        );
        const d = await res.json();
        if (!dead && d?.current_weather) {
          setW({
            temp: Math.round(d.current_weather.temperature),
            wind: Math.round(d.current_weather.windspeed),
            code: d.current_weather.weathercode,
            loading: false,
            err: false,
          });
        }
      } catch {
        if (!dead) setW((p) => ({ ...p, loading: false, err: true }));
      }
    };
    load();
    const t = setInterval(load, 10 * 60 * 1000);
    return () => {
      dead = true;
      clearInterval(t);
    };
  }, []);

  return (
    <Panel title="WX://MUZAFFARNAGAR" right={<span className="text-[9px] text-cyan-200/50">LIVE</span>}>
      {w.loading ? (
        <div className="text-[11px] text-cyan-200/50 tracking-widest">SCANNING ATMOSPHERE…</div>
      ) : w.err ? (
        <div className="text-[11px] text-amber-200/70">Satellite link down, sir. Chai lo garam ☕</div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-[26px] leading-none text-cyan-100 font-light">{w.temp}°C</div>
          <div className="text-[11px] text-cyan-200/70 leading-[1.5]">
            <div>{WCODES[w.code] || "Sky"}</div>
            <div>wind {w.wind} km/h</div>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ---------- MEMORY panel ---------- */

export function MemoryPanel() {
  const memories = useSyncExternalStore(subscribeMemory, getMemorySnapshot, () => []);

  return (
    <Panel
      title={`MEM://CORE`}
      right={
        <span className="text-[9px] text-cyan-200/50">
          {memories.length}/{MEMORY_MAX}
        </span>
      }
    >
      {memories.length === 0 ? (
        <div className="text-[10.5px] text-cyan-200/40 leading-[1.6]">
          Memory core empty. Bolo &quot;remember: …&quot; — main yaad rakh lunga, sir.
        </div>
      ) : (
        <div className="space-y-1 max-h-[92px] overflow-y-auto jarvis-scroll">
          {memories.map((m, i) => (
            <div key={`${i}-${m}`} className="group flex items-start gap-1.5 text-[11px]">
              <span className="text-cyan-400/60 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-cyan-100/85 flex-1 break-words">{m}</span>
              <button
                onClick={() => removeMemory(i)}
                className="shrink-0 text-cyan-200/30 hover:text-red-300/80 text-[10px] px-0.5"
                title="Forget this"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {memories.length > 0 && (
        <button
          onClick={() => clearMemories()}
          className="mt-1.5 text-[9.5px] tracking-[0.15em] text-red-300/50 hover:text-red-300/90"
        >
          FORGET ALL
        </button>
      )}
    </Panel>
  );
}

/* ---------- COMM panel (radio now playing) ---------- */

export function CommPanel() {
  const radio = useSyncExternalStore(subscribeRadio, getRadioState, () => getRadioState());

  return (
    <Panel
      title="COMM://RADIO"
      right={<span className="text-[9px] text-cyan-200/50">{radio.source === "OLD" ? "OLD SKOOL" : "NEW ERA"}</span>}
    >
      {radio.song ? (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full shrink-0 ${radio.playing ? "bg-emerald-400 animate-pulse" : "bg-white/25"}`} />
          <div className="min-w-0 flex-1">
            <div className="text-[11.5px] text-cyan-100/90 truncate">{radio.song.title}</div>
            <div className="text-[10px] text-cyan-200/45 truncate">
              {radio.song.artist} • {radio.song.year}
            </div>
          </div>
          <button
            onClick={() => togglePlayPause()}
            className="text-[10px] px-1.5 py-1 rounded border border-cyan-400/30 text-cyan-200/80 hover:bg-cyan-400/10"
          >
            {radio.playing ? "❚❚" : "▶"}
          </button>
          <button
            onClick={() => nextSong()}
            className="text-[10px] px-1.5 py-1 rounded border border-cyan-400/30 text-cyan-200/80 hover:bg-cyan-400/10"
          >
            ▶▶
          </button>
        </div>
      ) : (
        <button
          onClick={() => togglePlayPause()}
          className="text-[11px] text-cyan-200/60 hover:text-cyan-100 tracking-wide"
        >
          ▶ Play old song — YouTube Music se
        </button>
      )}
      {radio.loading && <div className="text-[10px] text-amber-200/70 mt-1 tracking-widest">TUNING FREQUENCY…</div>}
      {radio.error && <div className="text-[10px] text-amber-200/70 mt-1">{radio.error}</div>}
    </Panel>
  );
}
