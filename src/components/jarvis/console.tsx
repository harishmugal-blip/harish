"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { createRecognition, playHudBeep, stopSpeaking } from "@/lib/jarvis";

export interface JarvisMsg {
  id: number;
  from: "user" | "jarvis";
  text: string;
  mode?: "research" | "chat";
}

const CHIPS = [
  "kya haal he jarvis",
  "latest AI news",
  "remember: chai break 5 min",
  "open projects",
  "play old song",
  "time kya hua he",
];

interface Props {
  msgs: JarvisMsg[];
  busy: boolean;
  busyLabel: string;
  onSend: (text: string) => void;
  ttsOn: boolean;
  onToggleTts: () => void;
}

export function JarvisConsole({ msgs, busy, busyLabel, onSend, ttsOn, onToggleTts }: Props) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const recRef = useRef<unknown>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    playHudBeep(720, 0.06);
    onSend(t);
    setInput("");
  };

  const toggleMic = () => {
    if (listening) {
      (recRef.current as { stop: () => void } | null)?.stop();
      setListening(false);
      return;
    }
    const rec = createRecognition(
      (text) => {
        setListening(false);
        send(text);
      },
      () => setListening(false)
    );
    if (!rec) {
      setMicSupported(false);
      return;
    }
    recRef.current = rec;
     
    (rec as any).start();
    setListening(true);
    playHudBeep(980, 0.08);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-2.5 space-y-2 jarvis-scroll">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[86%] rounded-[6px] px-2.5 py-1.5 text-[12.5px] leading-[1.5] border ${
                m.from === "user"
                  ? "bg-cyan-500/10 border-cyan-400/25 text-cyan-100"
                  : "bg-white/[0.04] border-amber-300/20 text-amber-50"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-[9px] tracking-[0.18em] font-semibold ${m.from === "user" ? "text-cyan-400/80" : "text-amber-300/80"}`}>
                  {m.from === "user" ? "USER://HARISH" : "JARVIS://CORE"}
                </span>
                {m.mode === "research" && (
                  <span className="text-[8.5px] px-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 tracking-wider">
                    RESEARCH://WEB
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap break-words">{m.text}</div>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-cyan-300/90 text-[11px] tracking-[0.2em] pl-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            {busyLabel}
            <span className="jarvis-dots" />
          </div>
        )}
      </div>

      {/* chips */}
      <div className="flex gap-1.5 px-3 pb-1.5 overflow-x-auto shrink-0">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            className="whitespace-nowrap text-[10.5px] px-2 py-[3px] rounded-full border border-cyan-400/25 text-cyan-200/80 hover:bg-cyan-400/10 hover:text-cyan-100 transition-colors"
          >
            {c}
          </button>
        ))}
      </div>

      {/* input row */}
      <div className="flex items-center gap-1.5 px-3 pb-3 shrink-0">
        <div
          className={`flex-1 flex items-center h-[34px] px-2.5 rounded-[5px] border bg-black/40 transition-colors ${
            listening ? "border-cyan-300/70 shadow-[0_0_12px_rgba(80,220,255,0.35)]" : "border-cyan-400/30"
          }`}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={listening ? "SUN RAHA HU SIR…" : "What can I search or do for you, sir?"}
            className="flex-1 bg-transparent outline-none text-[12.5px] text-cyan-50 placeholder:text-cyan-200/30"
          />
        </div>
        <button
          onClick={toggleMic}
          title={micSupported ? "Voice input" : "Mic not supported in this browser"}
          className={`w-[34px] h-[34px] rounded-[5px] border flex items-center justify-center transition-colors ${
            listening
              ? "bg-cyan-400/25 border-cyan-300/70 text-cyan-100 animate-pulse"
              : "border-cyan-400/30 text-cyan-300/80 hover:bg-cyan-400/10"
          }`}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <button
          onClick={onToggleTts}
          title={ttsOn ? "Voice output: ON" : "Voice output: muted"}
          className={`w-[34px] h-[34px] rounded-[5px] border flex items-center justify-center transition-colors ${
            ttsOn ? "border-amber-300/40 text-amber-200/90 hover:bg-amber-300/10" : "border-white/15 text-white/35 hover:bg-white/5"
          }`}
        >
          {ttsOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={() => send(input)}
          disabled={busy || !input.trim()}
          className="h-[34px] px-3 rounded-[5px] border border-cyan-400/40 bg-cyan-400/15 text-cyan-100 text-[12px] font-medium tracking-wide hover:bg-cyan-400/25 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export function useStopSpeakOnUnmount() {
  useEffect(() => () => stopSpeaking(), []);
}
